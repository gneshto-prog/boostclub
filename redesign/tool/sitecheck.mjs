import puppeteer from 'puppeteer-core';
const base='file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const pages=process.argv[2].split(','); const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const pg of pages) for (const [w,h,tag,n] of [[1440,900,'d',7],[390,844,'m',5]]){
  const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('requestfailed',r=>errs.push('FAIL '+r.url().split('/').pop()));
  await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
  await p.goto(base+pg,{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,1600));
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let i=0;i<n;i++){ const y=Math.round((H-h)*i/(n-1)); await p.evaluate(async y=>{const s=scrollY; for(let k=1;k<=10;k++){scrollTo(0,s+(y-s)*k/10); await new Promise(r=>setTimeout(r,40));}},y); await new Promise(r=>setTimeout(r,1100)); await p.screenshot({path:`${out}${pg.replace('.html','')}_${tag}_${i}.jpg`,type:'jpeg',quality:68}); }
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  console.log(pg,tag,'H',H,'overflow',ov,'errs',JSON.stringify(errs.filter(e=>!e.includes('hero-desktop')).slice(0,3)));
  await p.close(); }
await b.close();
