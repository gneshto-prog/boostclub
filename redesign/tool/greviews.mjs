import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--lang=en-US']});
const p=await b.newPage(); await p.setViewport({width:1280,height:900}); await p.setExtraHTTPHeaders({'Accept-Language':'en-US,en;q=0.9'});
await p.goto('https://www.google.com/maps/search/Boost+Club+Strada+Sevastopol+24+Bucharest?hl=en',{waitUntil:'networkidle2',timeout:60000});
await new Promise(r=>setTimeout(r,2000)); const rej=await p.$$('button'); for(const bt of rej){ const tx=await bt.evaluate(e=>e.innerText); if(/Reject all/.test(tx)){ await bt.click(); break; } } await new Promise(r=>setTimeout(r,6000));
const t=await p.evaluate(()=>document.body.innerText.slice(0,4000));
console.log(t.replace(/\n+/g,' | ').slice(0,1500));
const m=await p.evaluate(()=>[...document.querySelectorAll('[aria-label]')].map(e=>e.getAttribute('aria-label')).filter(a=>/review|star/i.test(a)).slice(0,12));
console.log(m); await b.close();
