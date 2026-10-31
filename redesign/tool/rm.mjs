import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const pg of ['boost-fit.html','bring-a-friend.html','ro/boost-fit.html']){
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.setViewport({width:1440,height:900}); await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'});
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H;y+=500){await p.evaluate(y=>scrollTo(0,y),y);await new Promise(r=>setTimeout(r,80));}
await new Promise(r=>setTimeout(r,800));
const r=await p.evaluate(()=>({vid:[...document.querySelectorAll('video')].map(v=>v.paused),
 hidden:[...document.querySelectorAll('main *, section *')].filter(e=>{const s=getComputedStyle(e);return e.offsetParent&&parseFloat(s.opacity)<.5&&!e.closest('.k-slot,[aria-hidden=true]')}).slice(0,5).map(e=>e.tagName+'.'+e.className)}));
console.log(pg,JSON.stringify(r),errs);
// click play
if(pg==='boost-fit.html'){ await p.evaluate(()=>document.querySelector('.bf-vid').scrollIntoView()); await p.evaluate(()=>scrollBy(0,-200)); await p.click('.bf-pp'); await new Promise(r=>setTimeout(r,1500)); console.log('after click', await p.evaluate(()=>[document.querySelector('.bf-vid video').paused,document.querySelector('.bf-pp').getAttribute('aria-label')]));}
await p.close();}
await b.close();
