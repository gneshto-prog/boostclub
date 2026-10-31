// usage: rpshot.mjs page WxH "sel1|sel2|y:1200" outprefix [rm]
import puppeteer from 'puppeteer-core';
const [pg,vp,sels,pre,rm]=process.argv.slice(2); const [w,h]=vp.split('x').map(Number);
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rp/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('requestfailed',r=>errs.push('FAIL '+r.url()));
if(rm) await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,1500));
let i=0;
for(const s of sels.split('|')){
  const y=await p.evaluate(s=>{ if(s.startsWith('y:')) return +s.slice(2); const e=document.querySelector(s); return e?e.getBoundingClientRect().top+scrollY-(s.includes('@')?0:0):-1; },s);
  if(y<0){console.log('missing',s);continue;}
  await p.evaluate(async y=>{const s0=scrollY; for(let k=1;k<=12;k++){scrollTo(0,s0+(y-s0)*k/12); await new Promise(r=>setTimeout(r,35));}},Math.max(0,y-(s.startsWith('y:')?0:70)));
  await new Promise(r=>setTimeout(r,1400));
  await p.screenshot({path:`${out}${pre}_${i++}.jpg`,type:'jpeg',quality:72});
}
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
console.log(pg,vp,'overflow',ov,'errs',JSON.stringify(errs.slice(0,5)));
await b.close();
