import puppeteer from 'puppeteer-core';
// Boost Team /business journeys with the POST intercepted: map search → country, path button → form, configurator → form,
// validation, partner-lead payload, success + failure. EN/RO/RU.
const base=process.env.BASE||'http://localhost:8765/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };
async function open(url,status=200,w=1280){ const p=await b.newPage(); await p.setViewport({width:w,height:900,isMobile:w<800}); const posts=[], errs=[];
  await p.setRequestInterception(true); p.on('request',r=>{ if(r.method()==='POST'){ posts.push(Object.fromEntries(new URLSearchParams(r.postData()||''))); r.respond({status,contentType:'text/html',body:'ok'}); } else r.continue(); });
  p.on('pageerror',e=>errs.push(e.message)); await p.goto(base+url,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,2500)); return {p,posts,errs}; }
const vis=(p,s)=>p.$eval(s,e=>!e.hidden&&getComputedStyle(e).display!=='none').catch(()=>false);
for(const lang of (process.argv[2]||'en,ro,ru').split(',')){
  const {p,posts,errs}=await open((lang==='en'?'':lang+'/')+'business.html');
  const MD=await p.evaluate(l=>new Intl.DisplayNames([l],{type:'region'}).of('MD'),lang);
  const n=await p.$$eval('#bt-worldmap path.c',x=>x.length); ok(n>150,`${lang} map drew ${n} countries`);
  const on=await p.$$eval('#bt-worldmap path.c.on',x=>x.length); ok(on>=80,`${lang} ${on} Herbalife markets highlighted`);
  await p.type('#bt-country-q','Moldova'); await p.$eval('#bt-country-q',e=>e.dispatchEvent(new Event('change',{bubbles:true}))); await new Promise(r=>setTimeout(r,400));
  ok(await p.$eval('#bt-country',e=>e.value)===MD && await p.$$eval('#bt-worldmap path.sel',x=>x.length)===1 && await p.$$eval('#bt-worldmap .arc',x=>x.length)===1,`${lang} map search selects Moldova, draws the arc, fills the form country`);
  ok(await vis(p,'#bt-mapcta'),`${lang} map CTA appears`);
  await p.click('input[name=bt-p][value=c] + span'); const sb=await p.$$('input[name=bt-s] + span'); await sb[1].click(); const tb=await p.$$('input[name=bt-t] + span'); await tb[0].click();
  const sum=await p.$eval('#bt-sumtx',e=>e.textContent); ok(sum.includes(MD)&&sum.split('·').length>=4,`${lang} configurator summary: ${sum}`);
  ok(await p.$eval('#bt-path',e=>e.value)==='C Build your own wellness business',`${lang} configurator sets the form path`);
  await p.click('.bt-path[data-path=a] .bt-pick'); await new Promise(r=>setTimeout(r,900));
  ok(await p.$eval('#bt-path',e=>e.value)==='A Open a Boost Club',`${lang} path card A preselects path A`);
  await p.click('#bt-send'); await new Promise(r=>setTimeout(r,300)); ok(posts.length===0&&await vis(p,'#bt-err'),`${lang} empty name blocked`);
  await p.type('#bt-name','Test Partner'); await p.type('#bt-contact','+40 722 000 000'); await p.click('#bt-send'); await new Promise(r=>setTimeout(r,900));
  const d=posts[0]||{};
  ok(posts.length===1&&d['form-name']==='partner-lead'&&d.lead_type==='business'&&d.lang===lang&&d.name==='Test Partner'&&d.country===MD&&/^A Open a Boost Club/.test(d.goal||''),`${lang} payload ${JSON.stringify({fn:d['form-name'],lang:d.lang,country:d.country,goal:d.goal,cand:d.cand})}`);
  ok('bot-field' in d && d['bot-field']==='',`${lang} honeypot present and empty`);
  ok(await vis(p,'#bt-done'),`${lang} thank-you after server OK`);
  ok(await p.$eval('#bt-wa2',a=>a.href.includes('Test%20Partner')),`${lang} WhatsApp follow-up prefilled`);
  ok(!errs.length,`${lang} no JS errors ${errs.join(' | ')}`);
  await p.close();
}
{ const {p,posts}=await open('business.html',500); await p.type('#bt-name','X Y'); await p.type('#bt-contact','x@y.co'); await p.type('#bt-country','Romania'); await p.click('#bt-send'); await new Promise(r=>setTimeout(r,900));
  ok(posts.length===1&&await vis(p,'#bt-err')&&!(await vis(p,'#bt-done'))&&await p.$eval('#bt-err a',a=>a.href.startsWith('https://wa.me/')).catch(()=>false),'server error keeps the form and offers WhatsApp'); await p.close(); }
{ const {p}=await open('business.html',200,390); const n=await p.$$eval('#bt-worldmap path.c',x=>x.length); ok(n>150,'phone: map draws'); ok(await p.$eval('.bt-lang',e=>e.querySelectorAll('a').length===2),'phone: language switch has RO and RU links'); await p.close(); }
console.log(fails?fails+' FAILED':'ALL PASS'); await b.close();
