import puppeteer from 'puppeteer-core';
// One real submission per form on live boostclub.ro (test person: TEST Kai (ignore), +447700900123).
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const vis=(p,s)=>p.$eval(s,e=>!e.hidden&&getComputedStyle(e).display!=='none').catch(()=>false);
{ const p=await b.newPage(); await p.setViewport({width:1280,height:900}); const st=[]; p.on('response',r=>{ if(r.request().method()==='POST') st.push(r.status()+' '+r.url()); });
  await p.goto('https://boostclub.ro/consultatie-gratuita?goal=muscle&when=Test%20submission',{waitUntil:'networkidle0'});
  await p.evaluate(()=>{ document.querySelectorAll('#bookform .step').forEach((s,i)=>s.classList.toggle('on',i===2)); });
  await p.type('#fn','TEST Kai (ignore)'); await p.type('#ph','+447700900123'); await p.click('#s2');
  await p.click('#bookform button[type=submit]'); await new Promise(r=>setTimeout(r,4000));
  console.log('free scan:', st.join(' ; '), '| thank-you shown:', await vis(p,'#done')); await p.close(); }
{ const p=await b.newPage(); await p.setViewport({width:1280,height:900}); const st=[]; p.on('response',r=>{ if(r.request().method()==='POST') st.push(r.status()+' '+r.url()); });
  await p.goto('https://boostclub.ro/business',{waitUntil:'networkidle0'});
  await p.click('.bt-path[data-path=c] .bt-pick'); await new Promise(r=>setTimeout(r,900));
  await p.type('#bt-name','TEST Kai (ignore)'); await p.type('#bt-contact','+447700900123'); await p.type('#bt-country','Romania');
  await p.click('#bt-send'); await new Promise(r=>setTimeout(r,4000));
  console.log('business:', st.join(' ; '), '| thank-you shown:', await vis(p,'#bt-done')); await p.close(); }
await b.close();
