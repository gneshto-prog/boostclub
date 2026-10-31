import puppeteer from 'puppeteer-core';
const [u,w,h,f]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:w,height:h}); await p.goto('http://localhost:8765/'+u,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,800)); await p.screenshot({path:f}); await b.close();
