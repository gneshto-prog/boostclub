import puppeteer from 'puppeteer-core';
const base='file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/concepts/a/';
const plan={c1:[0,'#scan','.spill',  '#founder','.visit'],c2:[0,1.0,2.0,'#tri','.band','#scan'],c3:[0,'.state','#leave','.start','#menu','#goings']};
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
for (const [pg,stops] of Object.entries(plan)) for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]){
  const p=await b.newPage(); const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push(e.message));
  await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
  await p.goto(base+pg+'.html',{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,1800));
  let i=0; const list = tag==='m' ? stops.slice(0,4) : stops;
  for (const s of list){
    await p.evaluate(async (s)=>{ let y; if(typeof s==='number') y=s*innerHeight; else { const el=document.querySelector(s); y=el.getBoundingClientRect().top+scrollY; } 
      for(let k=0;k<=12;k++){ window.scrollTo(0,(y)*k/12); await new Promise(r=>setTimeout(r,60)); } },s);
    await new Promise(r=>setTimeout(r,1700));
    await p.screenshot({path:`../cshots/${pg}_${tag}_${i++}.jpg`,type:'jpeg',quality:72});
  }
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  console.log(pg,tag,'overflowX',ov,'errors',errs.slice(0,3));
  await p.close();
}
await b.close();
