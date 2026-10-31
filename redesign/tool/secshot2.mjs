import puppeteer from 'puppeteer-core';
// node secshot2.mjs <page> <width> <selector> <out> : scroll the section into view like a visitor, wait, screenshot the viewport region
const [u,w,sel,f]=[process.argv[2],+process.argv[3],process.argv[4],process.argv[5]];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const H=w<800?844:900; await p.setViewport({width:w,height:H,isMobile:w<800});
await p.goto('http://localhost:8765/'+u,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,1500));
const r=await p.evaluate(async s=>{ const el=document.querySelector(s); const t=el.getBoundingClientRect().top+scrollY; for(let y=0;y<t;y+=400){ scrollTo(0,y); await new Promise(r=>setTimeout(r,30)); } scrollTo({top:t-70,behavior:'instant'}); await new Promise(r=>setTimeout(r,1600)); return Math.min(el.getBoundingClientRect().height+70, 2600); },sel);
await p.setViewport({width:w,height:Math.round(Math.max(H,r))}); await new Promise(r=>setTimeout(r,900)); await p.screenshot({path:f}); await b.close();
