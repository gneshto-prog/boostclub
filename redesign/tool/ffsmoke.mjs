import puppeteer from 'puppeteer-core';
// Firefox smoke test over WebDriver BiDi: every page loads, no JS errors, no horizontal overflow, one h1, images load.
const pages='_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,business.html,404.html,ro/business.html,ru/index.html'.split(',');
const b=await puppeteer.launch({browser:'firefox',executablePath:'/Applications/Firefox.app/Contents/MacOS/firefox',headless:true});
let bad=0;
for(const w of [390,1440]) for(const pg of pages){ const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e.message||e).slice(0,120)));
  await p.setViewport({width:w,height:w<800?844:900});
  try{ await p.goto('http://localhost:8765/'+pg,{waitUntil:'load',timeout:60000}); }catch(e){ errs.push('GOTO '+e.message.slice(0,80)); }
  await new Promise(r=>setTimeout(r,1500));
  const r=await p.evaluate(async()=>{ for(let y=0;y<document.documentElement.scrollHeight;y+=500){ scrollTo(0,y); await new Promise(r=>setTimeout(r,80)); } await new Promise(r=>setTimeout(r,1200));
    return {ov:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.getAttribute('src')).slice(0,3),nav:!!document.querySelector('.nav'),foot:!!document.querySelector('footer')}; }).catch(e=>({err:String(e).slice(0,100)}));
  const iss=[]; if(r.err) iss.push(r.err); if(r.ov>0) iss.push('overflow '+r.ov); if(r.h1!==1) iss.push('h1='+r.h1); if(r.broken&&r.broken.length) iss.push('broken '+r.broken.join(' ')); if(!r.nav||!r.foot) iss.push('nav/footer missing'); iss.push(...errs);
  if(iss.length){ bad++; console.log('✗ FF',w,pg,iss.join(' ; ')); } else console.log('✓ FF',w,pg);
  await p.close(); }
console.log(bad?bad+' with issues':'FIREFOX CLEAN'); await b.close();
