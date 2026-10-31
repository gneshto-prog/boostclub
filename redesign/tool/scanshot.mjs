import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
await p.goto('http://localhost:8765/_home_local.html',{waitUntil:'networkidle0'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));}}); const top=await p.evaluate(()=>{window.ScrollTrigger&&ScrollTrigger.refresh(); const st=ScrollTrigger.getAll().find(t=>t.pin&&t.pin.classList.contains('sx-pin')); return st?st.start:document.getElementById('scan').getBoundingClientRect().top+scrollY;});
for(const [i,f] of [[0,0.15],[1,0.6],[2,1.3]].entries()){ const y=top+(w>900?f*1260:0); await p.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y); await new Promise(r=>setTimeout(r,w>900?1200:2500*(i+1)));
 await p.screenshot({path:`${out}scan_${t}_${i}.jpg`,type:'jpeg',quality:72}); }
console.log(t,errs); await p.close(); }
await b.close();
