import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/how-it-works.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1200));
for(const n of [4,5]){ await p.evaluate(async n=>{ const li=document.querySelectorAll('.hw-steps ol>li')[n-1]; const y=li.getBoundingClientRect().top+scrollY-200; for(let k=0;k<12;k++){ window.scrollTo({top:scrollY+(y-scrollY)/(12-k),behavior:'instant'}); await new Promise(r=>setTimeout(r,60)); } },n); await new Promise(r=>setTimeout(r,2800));
 await p.screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/pin'+n+'.jpg',type:'jpeg',quality:75}); }
await b.close();
