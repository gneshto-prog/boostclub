import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1920,height:1080}); await p.goto('http://localhost:8765/business.html',{waitUntil:'networkidle0'});
console.log(await p.evaluate(()=>{ const s=document.querySelector('.skip'); const cs=getComputedStyle(s); return {top:cs.top,pos:cs.position,rect:s.getBoundingClientRect().top}; }));
await p.evaluate(()=>{ const r=document.querySelector('.bz-num').getBoundingClientRect(); scrollTo({top:scrollY+r.top-200,behavior:'instant'}); }); await new Promise(r=>setTimeout(r,1500));
console.log(await p.evaluate(()=>{ const n=document.querySelector('.bz-num'); const cs=getComputedStyle(n); return {op:cs.opacity,vis:cs.visibility,h:n.getBoundingClientRect().height,tr:cs.transform}; }));
await p.screenshot({path:'qa/bz-num-1920.png'}); await b.close();
