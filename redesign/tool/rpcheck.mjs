import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rp/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/results.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,800));
// hover a big tile
await p.evaluate(()=>document.querySelector('.rg-t.big').scrollIntoView({block:'center'})); await new Promise(r=>setTimeout(r,1500));
const bb=await p.$eval('.rg-t.big .rg-b',e=>{const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
await p.mouse.move(bb[0],bb[1]); await new Promise(r=>setTimeout(r,1100)); await p.screenshot({path:out+'hover.jpg',type:'jpeg',quality:70});
// lightbox tab wrap
await p.click('.rg-t.big .rg-b'); await new Promise(r=>setTimeout(r,1300));
await p.screenshot({path:out+'lb2.jpg',type:'jpeg',quality:70});
const seen=new Set(); let out1=0; for(let i=0;i<40;i++){ await p.keyboard.press('Tab'); const r=await p.evaluate(()=>!!document.activeElement.closest('#lb')); if(!r) out1++; }
console.log('tab x40 escaped focus:',out1);
for(let i=0;i<20;i++){ await p.keyboard.down('Shift'); await p.keyboard.press('Tab'); await p.keyboard.up('Shift'); if(!await p.evaluate(()=>!!document.activeElement.closest('#lb'))) out1++; }
console.log('shift-tab escaped:',out1);
await p.click('[data-go="9"]'); console.log('strip ->',await p.$eval('#lb .lb-t',e=>e.textContent.trim()));
await p.keyboard.press('Escape'); await new Promise(r=>setTimeout(r,300));
console.log('closed',!(await p.$eval('#lb',d=>d.open)),'focus back',await p.evaluate(()=>document.activeElement.dataset.open));
// h1 count, images loaded
for(const pg of ['results.html','reviews.html','ro/results.html','ru/reviews.html']){ await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'});
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
  await new Promise(r=>setTimeout(r,800));
  console.log(pg,'h1',await p.$$eval('h1',a=>a.length),'broken imgs',await p.$$eval('img',a=>a.filter(i=>i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.src)));}
// reduced motion
const q=await b.newPage(); await q.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await q.setViewport({width:1440,height:900});
await q.goto('http://localhost:8765/results.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,800));
console.log('RM hero p',await q.$eval('.ba-hero .ba-h',h=>h.getAttribute('aria-valuenow')),'hidden opac',await q.$$eval('.rg-t,.st-row figure,.rx-stage',a=>a.filter(e=>getComputedStyle(e).opacity<0.9).length));
await q.goto('http://localhost:8765/reviews.html',{waitUntil:'networkidle0'}); await q.evaluate(()=>document.querySelector('.mqsec').scrollIntoView()); await new Promise(r=>setTimeout(r,500)); await q.screenshot({path:out+'rm_mq.jpg',type:'jpeg',quality:60});
console.log('errors',errs);
await b.close();
