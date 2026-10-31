import puppeteer from 'puppeteer-core';
// node elshot2.mjs <page> <width> <selector> <out.png>
const [u,w,sel,f]=[process.argv[2],+process.argv[3],process.argv[4],process.argv[5]];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:w,height:900,isMobile:w<800}); await p.goto('http://localhost:8765/'+u,{waitUntil:'networkidle0'});
await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:'center'}),sel); await new Promise(r=>setTimeout(r,1800));
await (await p.$(sel)).screenshot({path:f}); await b.close();
