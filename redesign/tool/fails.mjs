import puppeteer from 'puppeteer-core';
const base=process.env.BASE||'file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const pg of process.argv[2].split(',')){const p=await b.newPage();await p.setViewport({width:1440,height:900});
p.on('requestfailed',r=>console.log(pg,'FAIL',r.url().replace(base,''),r.failure()?.errorText));
p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log(pg,'CONSOLE',m.text())});
await p.goto(base+pg,{waitUntil:'networkidle0'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
await new Promise(r=>setTimeout(r,1500));await p.close();}
await b.close();
