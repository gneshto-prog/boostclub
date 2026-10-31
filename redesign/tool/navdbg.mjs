import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/menu.html',{waitUntil:'networkidle0'}); await p.evaluate(()=>scrollTo(0,6000)); await new Promise(r=>setTimeout(r,800));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.bfl')].map(e=>[e.className,e.closest('header,nav,div')?.className, e.parentElement.closest('[class*=nav]')?.className, getComputedStyle(e).display, e.src.split('/').pop(), e.getBoundingClientRect().width])));
await b.close();
