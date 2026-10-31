import puppeteer from 'puppeteer-core';
const [pg,w,h,out,wait]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5],+(process.argv[6]||2500)];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:w,height:h,isMobile:w<800}); await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,wait));
const info=await p.evaluate(()=>{ const h=document.querySelector('h1'); const r=h.getBoundingClientRect(); let a=h.parentElement; while(a&&getComputedStyle(a).overflow==='visible') a=a.parentElement; const ar=a?a.getBoundingClientRect():null; return {h1:[r.top,r.bottom,r.left,r.right].map(Math.round),anc:a&&(a.className+'#'+a.id),ar:ar&&[ar.top,ar.bottom].map(Math.round),spans:[...h.querySelectorAll('.kw')].map(s=>{const q=s.getBoundingClientRect(); return Math.round(q.bottom)})}; });
console.log(JSON.stringify(info)); await p.screenshot({path:out}); await b.close();
