import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.setViewport({width:1280,height:900}); await p.goto('http://localhost:8765/business.html',{waitUntil:'load'});
await p.$eval('#map',e=>e.scrollIntoView()); await new Promise(r=>setTimeout(r,2500));
await p.type('#bt-country-q','Israel'); await p.$eval('#bt-country-q',e=>e.dispatchEvent(new Event('change',{bubbles:true}))); await new Promise(r=>setTimeout(r,1800));
const names=await p.$$eval('#bt-map path.c',x=>x.map(e=>e.__data__.properties.name));
console.log('Palestine paths:',names.filter(n=>n==='Palestine').length,'Israel paths:',names.filter(n=>n==='Israel').length,'total',names.length,'errs',errs.length);
const el=await p.$('.bt-mapwrap'); await el.screenshot({path:'qa/israel-map.png'}); await b.close();
