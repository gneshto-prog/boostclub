import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
p.on('pageerror',e=>console.log('ERR',e.message)); p.on('console',m=>console.log('C',m.text()));
await p.goto('file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/concepts/b/c4.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
console.log(await p.evaluate(()=>{const c=document.getElementById('cups'); const w=c.querySelector('.cupwrap'); const i=w&&w.querySelector('.cup'); return JSON.stringify({n:c.children.length,cups:c.getBoundingClientRect(),w:w&&w.getBoundingClientRect(),wop:w&&getComputedStyle(w).opacity,img:i&&i.getBoundingClientRect(),nat:i&&i.naturalWidth, src:i&&i.src})}));
await b.close();
