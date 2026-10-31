import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const u of ['boost-fit.html','ru/boost-fit.html']){ const p=await b.newPage(); await p.setViewport({width:1024,height:900}); await p.goto('http://localhost:8765/'+u,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,1500));
 const r=await p.evaluate(async()=>{ const el=document.querySelector('#entrance'); scrollTo({top:el.getBoundingClientRect().top+scrollY-70,behavior:'instant'}); await new Promise(r=>setTimeout(r,1500)); const rv=[...el.querySelectorAll('.bft-rv')]; return {n:rv.length,in:rv.filter(x=>x.classList.contains('in')).length,op:rv.map(x=>getComputedStyle(x).opacity),hasIO:'IntersectionObserver' in window,scripts:[...document.scripts].length}; });
 console.log(u,JSON.stringify(r)); await p.close(); }
await b.close();
