import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:390,height:844,isMobile:true});
await p.goto('http://localhost:8765/menu.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,2000));
const seen=[]; const t0=Date.now();
for(let i=0;i<40;i++){ seen.push([Date.now()-t0, await p.evaluate(()=>getComputedStyle(document.getElementById('mh')).backgroundColor)]); await new Promise(r=>setTimeout(r,100)); }
const ch=[]; for(let i=1;i<seen.length;i++) if(seen[i][1]!==seen[i-1][1]) ch.push(seen[i][0]);
console.log('colour changes in 4s:',ch.length,ch.slice(0,10)); await b.close();
