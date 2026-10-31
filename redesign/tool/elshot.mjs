import puppeteer from 'puppeteer-core';
const base=process.env.BASE||'file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/el_';
const jobs=JSON.parse(process.argv[2]);
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const [pg,w,sel,name] of jobs){const p=await b.newPage();await p.setViewport({width:w,height:900,isMobile:w<800});
await p.goto(base+pg,{waitUntil:'networkidle0'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
const el=await p.evaluateHandle(s=>{const img=document.querySelector(s);return img.closest('section')},sel);
await el.evaluate(e=>e.scrollIntoView());await new Promise(r=>setTimeout(r,1500));
await el.screenshot({path:out+name+'.jpg',type:'jpeg',quality:70});await p.close();}
await b.close();
