import puppeteer from 'puppeteer-core';
const base='file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/rr/';
const pages=process.argv[2].split(','); const vps=(process.argv[3]||'1440x900,1024x768,390x844').split(',');
const rm=process.argv[4]==='rm';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const pg of pages) for (const vp of vps){ const [w,h]=vp.split('x').map(Number);
  const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text()+JSON.stringify(m.location()))}); p.on('requestfailed',r=>errs.push('FAIL '+r.url().split('/').pop()));
  if(rm) await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800,deviceScaleFactor:1});
  await p.goto(base+pg,{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,1500));
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  const tag=pg.replace('.html','')+'_'+w+(rm?'_rm':'');
  let i=0;
  for(let y=0;y<H;y+=Math.round(h*0.9)){ await p.evaluate(y=>scrollTo(0,y),y); await new Promise(r=>setTimeout(r,450)); await p.screenshot({path:`${out}${tag}_${String(i++).padStart(2,'0')}.jpg`,type:'jpeg',quality:60}); }
  const ov=await p.evaluate(()=>{const o=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>innerWidth+1&&!e.closest('.mq,.lb,.sheet')&&r.width>0) o.push(e.className+':'+Math.round(r.right))}); return [document.documentElement.scrollWidth-innerWidth,o.slice(0,6)]});
  console.log(tag,'H',H,'shots',i,'overflow',JSON.stringify(ov),'errs',JSON.stringify(errs.slice(0,4)));
  await p.close(); }
await b.close();
