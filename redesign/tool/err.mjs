import puppeteer from 'puppeteer-core';
const base='file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const pg of process.argv[2].split(',')){const p=await b.newPage(); p.on('console',m=>{if(m.type()==='error')console.log(pg,m.text(),JSON.stringify(m.location()))});
await p.goto(base+pg,{waitUntil:'networkidle0'}); await p.close();}
await b.close();
