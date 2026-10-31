import puppeteer from 'puppeteer-core';
// usage: node vf_shot.mjs page.html WxH y1,y2,... prefix   (y may be a CSS selector prefixed with @)
const [pg,size,ys,prefix]=process.argv.slice(2); const [w,h]=size.split('x').map(Number);
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('requestfailed',r=>errs.push('FAIL '+r.url()));
await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1200));
let i=0; for(const y of ys.split(',')){
  const target = y.startsWith('@') ? await p.evaluate(s=>{const e=document.querySelector(s); return e? e.getBoundingClientRect().top+scrollY-80:0}, y.slice(1)) : +y;
  await p.evaluate(async t=>{const s=scrollY; for(let k=1;k<=12;k++){scrollTo(0,s+(t-s)*k/12); await new Promise(r=>setTimeout(r,35));}},target);
  await new Promise(r=>setTimeout(r,1500)); await p.screenshot({path:`/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/${prefix}_${i++}.jpg`,type:'jpeg',quality:72}); }
console.log('errs',JSON.stringify(errs), 'overflow', await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
await b.close();
