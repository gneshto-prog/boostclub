import puppeteer from 'puppeteer-core';
const base='http://127.0.0.1:8931/anim/demo.html';
const [,, query='', widths='1440,390', stopsArg=''] = process.argv;
const stops = stopsArg ? JSON.parse(stopsArg) : [[0,0],['#tiles',0],['#build',0.02],['#build',0.18],['#build',0.3],['#build',0.45],['#build',0.6],['#build',0.72],['#build',0.82],['#build',1],['#d3',0],['#scy',0.25],['#scy',0.5]];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const w of widths.split(',').map(Number)){
  const h = w<800?844:900, tag=w;
  const p=await b.newPage(); const errs=[]; p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())}); p.on('pageerror',e=>errs.push(e.message));
  await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800,deviceScaleFactor:1}); if(process.env.RM) await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); const tagp=process.env.TAG||'';
  await p.goto(base+query,{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,1200));
  let i=0;
  for (const [sel,frac] of stops){
    await p.evaluate(async (sel,frac)=>{ let y; if(sel===0) y=0; else { const el=document.querySelector(sel); const r=el.getBoundingClientRect(); y=r.top+scrollY+frac*Math.max(0,el.offsetHeight-innerHeight); }
      const y0=scrollY; for(let k=1;k<=10;k++){ window.scrollTo(0,y0+(y-y0)*k/10); await new Promise(r=>setTimeout(r,50)); } },sel,frac);
    await new Promise(r=>setTimeout(r,1400));
    await p.screenshot({path:`/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/ashots/${tagp}${tag}_${String(i++).padStart(2,'0')}.jpg`,type:'jpeg',quality:70});
  }
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  console.log(w,'overflowX',ov,'errors',errs.slice(0,5));
  await p.close();
}
await b.close();
