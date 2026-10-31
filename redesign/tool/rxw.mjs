import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:+process.argv[2],height:844,isMobile:true,hasTouch:true});
await p.goto('http://localhost:8765/results.html',{waitUntil:'networkidle0'}); await p.click('[data-more]'); await new Promise(r=>setTimeout(r,500));
console.log(JSON.stringify(await p.evaluate(()=>{const t0=document.querySelector(".rg-t"),cs=getComputedStyle(t0); return [cs.flexGrow,cs.flexBasis,cs.maxHeight,cs.maxWidth,cs.aspectRatio,cs.width,getComputedStyle(document.getElementById("rg"),"::after").flexGrow, getComputedStyle(document.getElementById("rg")).getPropertyValue("--rh")]})));console.log(JSON.stringify(await p.evaluate(()=>{const g=document.getElementById('rg').getBoundingClientRect(); return {g:[g.left,g.width], t:[...document.querySelectorAll('.rg-t')].slice(0,24).map(t=>{const r=t.getBoundingClientRect(); return [t.querySelector('.rg-n').textContent,Math.round(r.left),Math.round(r.width),Math.round(r.height),Math.round(r.top)]})}})));
await b.close();
