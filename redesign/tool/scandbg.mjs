import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/_home_local.html',{waitUntil:'networkidle0'});
console.log(await p.evaluate(async()=>{ const r={}; r.H=document.body.scrollHeight; r.sts=ScrollTrigger.getAll().map(t=>[t.trigger&&t.trigger.id||t.trigger&&t.trigger.className,Math.round(t.start),Math.round(t.end),!!t.pin]).slice(0,6);
 window.scrollTo({top:2500,behavior:'instant'}); await new Promise(r=>setTimeout(r,500)); r.y=scrollY; r.scanTop=document.getElementById('scan').getBoundingClientRect().top; return r;}));
await b.close();
