import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const pg of ['gabriel.html','visit.html','404.html','ro/gabriel.html','ru/visit.html'])
 for (const [w,h] of [[1440,900],[1024,768],[1280,720],[390,844]]){
  const p=await b.newPage(); const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push(e.message));
  await p.setViewport({width:w,height:h}); await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
  const r=await p.evaluate(()=>{const h1=document.querySelectorAll('h1').length; const btn=document.querySelector('.gb-ht .btn,.vs-hero .btn,.p4 .btn'); const bb=btn?btn.getBoundingClientRect().bottom:0;
   const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&!i.loading).map(i=>i.src);
   return {h1, btnBottom:Math.round(bb), vh:innerHeight, broken}});
  console.log(pg,w,h,JSON.stringify(r),errs.slice(0,2).join(' | ')); await p.close(); }
await b.close();
