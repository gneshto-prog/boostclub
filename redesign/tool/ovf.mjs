import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900}); await p.goto('http://localhost:8765/business.html',{waitUntil:'networkidle0'});
await p.evaluate(async()=>{ for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y); await new Promise(r=>setTimeout(r,40));} });
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>{const r=e.getBoundingClientRect(); return e.tagName+'.'+String(e.className).slice(0,30)+' r='+Math.round(r.right)+' w='+Math.round(r.width)+' sec='+((e.closest('section')||{}).className||'')+' '+(e.getAttribute('src')||'')}).slice(0,10)),null,1));
console.log(await p.evaluate(()=>document.documentElement.scrollWidth));
await b.close();
