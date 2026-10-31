import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/how-it-works.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,2500));
console.log(await p.evaluate(()=>{const i=document.querySelector('.phport img');const f=i.parentElement;const cs=getComputedStyle(i);return {frame:[f.clientWidth,f.clientHeight,getComputedStyle(f).aspectRatio],img:[i.clientWidth,i.clientHeight,cs.objectFit,cs.objectPosition,cs.transform,i.style.cssText]}}));
await b.close();
