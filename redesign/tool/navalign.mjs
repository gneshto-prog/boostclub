import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/menu.html',{waitUntil:'networkidle0'}); await p.evaluate(()=>scrollTo(0,1200)); await new Promise(r=>setTimeout(r,800));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.nav ul a')].map(a=>{ const el=a.querySelector('img.bfl:not([style*="none"])')&&[...a.querySelectorAll('img')].find(i=>getComputedStyle(i).display!=='none'); const r=(el||a).getBoundingClientRect(); return (a.textContent.trim()||'BoostFit')+':'+Math.round((r.top+r.bottom)/2*10)/10; })));
const n=await p.$('.nav'); await n.screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/navx.jpg',type:'jpeg',quality:85});
await b.close();
