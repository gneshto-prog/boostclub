import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const u of process.argv.slice(2)){ const p=await b.newPage(); const e=[]; p.on('pageerror',x=>e.push('PAGEERR '+x.message)); p.on('console',m=>{ if(m.type()==='error'||m.type()==='warn') e.push(m.type()+' '+m.text().slice(0,150)); }); p.on('requestfailed',r=>e.push('FAIL '+r.url()));
  await p.goto('http://localhost:8765/'+u,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,2000)); console.log(u, e.length?e.join('\n  '):'clean'); await p.close(); }
await b.close();
