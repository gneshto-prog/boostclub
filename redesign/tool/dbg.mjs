import puppeteer from 'puppeteer-core';
const [,,url,js,w='1440']=process.argv;
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:+w,height:900});
await p.goto(url,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,800));
console.log(JSON.stringify(await p.evaluate(js),null,1)); await b.close();
