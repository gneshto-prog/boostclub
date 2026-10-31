import puppeteer from 'puppeteer-core';
const [pg,w,sels]=[process.argv[2],+process.argv[3],process.argv[4].split('|')];
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/sec_';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.setViewport({width:w,height:w<800?844:900,isMobile:w<800,hasTouch:w<800});
await p.goto((process.env.BASE||'http://localhost:8765/')+pg,{waitUntil:'networkidle0'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}});
for(const [i,s] of sels.entries()){ const el=await p.$(s); if(!el){console.log('missing',s);continue;}
 await el.evaluate(e=>{const y=e.getBoundingClientRect().top+scrollY-40; window.scrollTo({top:y,behavior:'instant'});}); await new Promise(r=>setTimeout(r,1600));
 await p.screenshot({path:`${out}${w}_${i}.jpg`,type:'jpeg',quality:70}); }
console.log('errs',errs); await b.close();
