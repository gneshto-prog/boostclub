import puppeteer from 'puppeteer-core';
// End-to-end journeys with the form POST intercepted (nothing leaves the machine):
// free-scan booking (EN/RO/RU) success + failure + validation, the reserve bar hand-off, /business tabs, configurator,
// booking form payload, mobile menu. Prints PASS/FAIL per check.
const base=process.env.BASE||'http://localhost:8765/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };
async function pageWith(url,{w=1280,status=200}={}){
  const p=await b.newPage(); await p.setViewport({width:w,height:w<800?844:900,isMobile:w<800,hasTouch:w<800});
  const posts=[]; await p.setRequestInterception(true);
  p.on('request',r=>{ if(r.method()==='POST'){ posts.push(Object.fromEntries(new URLSearchParams(r.postData()||''))); r.respond({status,contentType:'text/html',body:'ok'}); } else r.continue(); });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(base+url,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,500));
  return {p,posts,errs};
}
const vis=(p,sel)=>p.$eval(sel,e=>!e.hidden&&getComputedStyle(e).display!=='none').catch(()=>false);

// ---------- free scan booking
for(const lang of ['en','ro','ru']){
  const url=(lang==='en'?'':lang+'/')+'free-scan.html?goal=muscle&when=Tuesday%2C%20evening';
  const {p,posts,errs}=await pageWith(url);
  ok(await p.$eval('#g2',e=>e.checked),`${lang} free-scan: ?goal=muscle preselects Build muscle`);
  ok(await p.$eval('#when',e=>e.value)==='Tuesday, evening',`${lang} free-scan: ?when carried from the reserve bar`);
  await p.evaluate(()=>{ document.querySelectorAll('#bookform .step').forEach((s,i)=>s.classList.toggle('on',i===2)); });
  await p.click('#bookform button[type=submit]'); await new Promise(r=>setTimeout(r,300));
  ok(posts.length===0 && await vis(p,'#err'),`${lang} free-scan: empty name blocked with a message`);
  await p.type('#fn','Test'); await p.type('#ph','0722');
  await p.click('#bookform button[type=submit]'); await new Promise(r=>setTimeout(r,300));
  ok(posts.length===0,`${lang} free-scan: short phone blocked`);
  await p.$eval('#ph',e=>e.value=''); await p.type('#ph','+40 722 000 000'); await p.click('#s2');
  await p.click('#bookform button[type=submit]'); await new Promise(r=>setTimeout(r,800));
  const d=posts[0]||{};
  const fn={en:'consultatie-en',ro:'consultatie',ru:'consultatie-ru'}[lang];
  ok(posts.length===1,`${lang} free-scan: one POST sent`);
  ok(d['form-name']===fn && d.lang===lang,`${lang} free-scan: form-name=${d['form-name']} lang=${d.lang}`);
  ok(d.prenume==='Test'&&d.telefon==='+40 722 000 000'&&(lang==='en'?d.obiectiv==='Build muscle':!!d.obiectiv)&&d.cand==='Tuesday, evening'&&d.aflat==='Instagram'&&/free-scan|consultatie-gratuita/.test(d.referrer||''),`${lang} free-scan: payload fields ${JSON.stringify({prenume:d.prenume,telefon:d.telefon,obiectiv:d.obiectiv,cand:d.cand,aflat:d.aflat})}`);
  ok('bot-field' in d && d['bot-field']==='',`${lang} free-scan: honeypot present and empty`);
  ok(await vis(p,'#done') && !(await vis(p,'#bookform')),`${lang} free-scan: thank-you shown only after the server answered`);
  const html=await p.content(); ok(!/Concept preview|nothing was sent/i.test(html),`${lang} free-scan: no concept-preview text`);
  ok(!errs.length,`${lang} free-scan: no JS errors ${errs.join(' | ')}`);
  await p.close();
}
{ // failure path
  const {p,posts}=await pageWith('free-scan.html',{status:500});
  await p.evaluate(()=>{ document.querySelectorAll('#bookform .step').forEach((s,i)=>s.classList.toggle('on',i===2)); });
  await p.type('#fn','Test'); await p.type('#ph','+40 722 000 000'); await p.click('#bookform button[type=submit]'); await new Promise(r=>setTimeout(r,800));
  ok(posts.length===1 && !(await vis(p,'#done')) && await vis(p,'#err'),'free-scan: server error keeps the form and shows the error');
  ok(await p.$eval('#err a',a=>a.href.startsWith('https://wa.me/40726205752')).catch(()=>false),'free-scan: error offers WhatsApp');
  ok(await p.$eval('#bookform button[type=submit]',x=>!x.disabled),'free-scan: send button re-enabled for retry');
  await p.close();
}
{ // reserve bar → free scan
  const {p}=await pageWith('menu.html');
  const ok1=await p.$('form.rbar'); ok(!!ok1,'menu: reserve bar present');
  if(ok1){ await p.select('form.rbar select[name=day]','Monday'); await p.select('form.rbar select[name=time]','Evening');
    await Promise.all([p.waitForNavigation({waitUntil:'networkidle0'}), p.click('form.rbar button[type=submit]')]);
    ok(/(free-scan\.html|consultatie-gratuita)\?when=Monday.*evening/i.test(decodeURIComponent(p.url())),'reserve bar: goes to free-scan with the chosen time '+decodeURIComponent(p.url()).replace(base,''));
    ok(await p.$eval('#when',e=>e.value).then(v=>/Monday/.test(v)),'reserve bar: time lands in the booking form'); }
  await p.close();
}
// ---------- business
for(const lang of ['en','ro','ru']){
  const {p,posts,errs}=await pageWith((lang==='en'?'':lang+'/')+'business.html');
  // tabs: click + keyboard
  await p.click('#bzt-own'); ok(await p.$eval('#bzp-own',e=>!e.hidden) && await p.$eval('#bzp-club',e=>e.hidden),`${lang} business: tab click switches panel`);
  await p.focus('#bzt-own'); await p.keyboard.press('ArrowRight'); ok(await p.$eval('#bzp-dist',e=>!e.hidden) && await p.evaluate(()=>document.activeElement.id)==='bzt-dist',`${lang} business: arrow key moves to the next tab`);
  // path button → form
  await p.click('#bzp-dist .bz-pick'); await new Promise(r=>setTimeout(r,900));
  ok(await p.$eval('#bz-path',e=>e.value)==='03 Build without premises',`${lang} business: "Talk about this path" preselects the path in the form`);
  // configurator
  await p.$eval('#cf-country',e=>{e.value='Moldova';e.dispatchEvent(new Event('input',{bubbles:true}));});
  await p.click('input[name=cf-path][value=own] + span'); const bgs=await p.$$('input[name=cf-bg] + span'); await bgs[2].click(); const tms=await p.$$('input[name=cf-time] + span'); await tms[0].click();
  const sum=await p.$eval('#bz-sumtx',e=>e.textContent); ok(/Moldova/.test(sum)&&sum.length>40,`${lang} business: summary updates (${sum.slice(0,70)}…)`);
  ok(await p.$eval('#bz-sumnote',e=>!e.hidden),`${lang} business: outside-Romania note shown for Moldova`);
  await p.click('#bz-use'); await new Promise(r=>setTimeout(r,900));
  ok(await p.$eval('#bz-country',e=>e.value)==='Moldova' && await p.$eval('#bz-path',e=>e.value)==='02 Open your own nutrition club' && await p.$eval('#bz-bg',e=>e.value)==='I run a gym or studio',`${lang} business: "Use this in my booking" fills country, path, background`);
  // validation + submit
  await p.click('#bz-send'); await new Promise(r=>setTimeout(r,300)); ok(posts.length===0 && await vis(p,'#bz-err'),`${lang} business: empty name blocked`);
  await p.type('#bz-name','Test Partner'); await p.type('#bz-contact','test@example.com'); await p.click('#bz-send'); await new Promise(r=>setTimeout(r,900));
  const d=posts[0]||{};
  ok(posts.length===1 && d['form-name']==='partner-lead' && d.lead_type==='business' && d.lang===lang,`${lang} business: posts partner-lead (lead_type=${d.lead_type}, lang=${d.lang})`);
  ok(d.name==='Test Partner'&&d.contact==='test@example.com'&&d.country==='Moldova'&&/02 Open your own nutrition club/.test(d.goal||'')&&(d.cand||'').length>2,`${lang} business: payload ${JSON.stringify({country:d.country,goal:d.goal,cand:d.cand})}`);
  ok(await vis(p,'#bz-done'),`${lang} business: confirmation shown after server OK`);
  ok(await p.$eval('#bz-wa2',a=>a.href.includes('Test%20Partner')),`${lang} business: WhatsApp follow-up prefilled with name`);
  ok(!errs.length,`${lang} business: no JS errors ${errs.join(' | ')}`);
  await p.close();
}
{ const {p,posts}=await pageWith('business.html',{status:500});
  await p.type('#bz-name','X Y'); await p.type('#bz-contact','+40722000000'); await p.type('#bz-country','Romania'); await p.click('#bz-send'); await new Promise(r=>setTimeout(r,900));
  ok(posts.length===1 && await vis(p,'#bz-err') && !(await vis(p,'#bz-done')) && await p.$eval('#bz-err a',a=>a.href.startsWith('https://wa.me/')).catch(()=>false),'business: server error shows WhatsApp fallback, keeps the form');
  await p.close(); }
// ---------- mobile menu
for(const pg of ['index.html','menu.html','business.html']){
  const {p}=await pageWith(pg,{w:390});
  const btn=await p.$('.nav button, .nav .burger, .nav [aria-expanded]');
  ok(!!btn,`${pg} phone: menu button exists`);
  if(btn){ await btn.click(); await new Promise(r=>setTimeout(r,700));
    const open=await p.evaluate(()=>{ const s=document.querySelector('.sheet'); return !!s&&getComputedStyle(s).visibility!=='hidden'&&s.getBoundingClientRect().height>200; });
    ok(open,`${pg} phone: menu opens`);
    const links=await p.$$eval('.sheet a',as=>as.map(a=>a.getAttribute('href')).filter(Boolean)); ok(links.length>=6,`${pg} phone: menu has ${links.length} links`);
    await p.keyboard.press('Escape'); await new Promise(r=>setTimeout(r,600));
    const closed=await p.evaluate(()=>{ const s=document.querySelector('.sheet'); return !s||getComputedStyle(s).visibility==='hidden'||!document.body.classList.contains('menu-open'); });
    ok(closed,`${pg} phone: Escape closes the menu`); }
  await p.close();
}
console.log(fails?fails+' FAILED':'ALL PASS'); await b.close();
