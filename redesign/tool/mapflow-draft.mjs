import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };
const tf=p=>p.$eval('.bt-view',g=>g.getAttribute('transform')||'');
for(const [lang,q,expect] of [['en','Germany','Germany'],['ro','Germania','Germania'],['ru','Германия','Германия']]){
  for(const w of [1280,390]){
  const p=await b.newPage(); await p.setViewport({width:w,height:900,isMobile:w<800,hasTouch:w<800}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('https://6ae6189a3c6b6f61dea60c53--resplendent-starlight-5bdd62.netlify.app/'+(lang==='en'?'':lang+'/')+'business.html',{waitUntil:'load'}); await new Promise(r=>setTimeout(r,2500));
  await p.evaluate(()=>document.getElementById('map').scrollIntoView()); await new Promise(r=>setTimeout(r,800));
  const t0=await tf(p); ok(/scale\(([2-9]|1\.[5-9])/.test(t0),`${lang}@${w} opens zoomed on Europe (${t0.slice(0,60)})`);
  await p.click('#bt-zin'); await new Promise(r=>setTimeout(r,500)); const t1=await tf(p); ok(t1!==t0,`${lang}@${w} + zooms in`);
  await p.click('.bt-views button[data-view=world]'); await new Promise(r=>setTimeout(r,1100)); const t2=await tf(p); ok(/scale\(1\)/.test(t2)||!/scale/.test(t2),`${lang}@${w} World view resets (${t2})`);
  await p.click('#bt-country-q',{clickCount:3}); await p.type('#bt-country-q',q); await p.$eval('#bt-country-q',e=>e.dispatchEvent(new Event('change',{bubbles:true}))); await new Promise(r=>setTimeout(r,1200));
  const pn=await p.$eval('#bt-pn',e=>e.textContent), dist=await p.$eval('#bt-pdist',e=>e.textContent), fc=await p.$eval('#bt-country',e=>e.value);
  ok(pn===expect&&/km/.test(dist)&&fc===expect&&await p.$$eval('.bt-map path.sel',x=>x.length)===1,`${lang}@${w} search "${q}" → panel "${pn}", ${dist}, form country "${fc}"`);
  ok(await p.$$eval('.bt-map .arc',x=>x.length)===1,`${lang}@${w} route arc drawn`);
  await p.evaluate(()=>{ const pin=document.querySelector('.bt-map .vnp'); pin.dispatchEvent(new MouseEvent('click',{bubbles:true})); }); await new Promise(r=>setTimeout(r,1000));
  const st=await p.$eval('#bt-pstat',e=>e.textContent); ok(st.length>2&&!/Herbalife/.test(st),`${lang}@${w} Varna pin → status "${st}", ${await p.$eval('#bt-pdist',e=>e.textContent)}`);
  ok(!errs.length,`${lang}@${w} no JS errors ${errs.join('|')}`);
  ok(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=0,`${lang}@${w} no horizontal overflow`);
  await p.close(); } }
{ const p=await b.newPage(); await p.setViewport({width:1280,height:900}); await p.goto('https://6ae6189a3c6b6f61dea60c53--resplendent-starlight-5bdd62.netlify.app/business.html',{waitUntil:'load'}); await new Promise(r=>setTimeout(r,2500));
  const q=await p.$$eval('#bt-quick button',x=>x.map(b=>b.textContent)); ok(q.length===8,'quick picks: '+q.join(', '));
  await p.click('#bt-quick button[data-n=Moldova]'); await new Promise(r=>setTimeout(r,1100)); ok(await p.$eval('#bt-pn',e=>e.textContent)==='Moldova','quick pick Moldova selects it');
  const y0=await p.evaluate(()=>scrollY); const box=await p.$eval('#bt-map',e=>{const r=e.getBoundingClientRect(); return [r.x+r.width/2,r.y+r.height/2];}); const t0=await tf(p);
  await p.mouse.move(box[0],box[1]); await p.mouse.wheel({deltaY:300}); await new Promise(r=>setTimeout(r,600));
  ok(await tf(p)===t0,'plain wheel does not zoom the map (page keeps scrolling)'); ok(await p.$eval('#bt-hint',e=>!e.hidden),'hint shows "Ctrl/⌘ + scroll to zoom"');
  await p.close(); }
console.log(fails?fails+' FAILED':'ALL PASS'); await b.close();
