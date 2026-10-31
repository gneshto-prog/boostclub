// results page: hero per featured pair, gallery, lightbox, show-all
import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/';
const [w,h]=(process.argv[2]||'1440x900').split('x').map(Number); const lang=process.argv[3]||'';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.goto('http://localhost:8765/'+lang+'results.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,800));
const pks=await p.$$('.pk');
for(let i=0;i<pks.length;i++){ await pks[i].click(); await new Promise(r=>setTimeout(r,900)); await p.screenshot({path:`${out}rx_${w}_hero${i}.jpg`,type:'jpeg',quality:70}); }
await p.evaluate(()=>document.getElementById('gallery').scrollIntoView()); await new Promise(r=>setTimeout(r,800));
for(let i=0;i<4;i++){ await p.screenshot({path:`${out}rx_${w}_gal${i}.jpg`,type:'jpeg',quality:70}); await p.evaluate(h=>scrollBy(0,h*.9),h); await new Promise(r=>setTimeout(r,700)); }
await p.click('[data-more]'); await new Promise(r=>setTimeout(r,900));
const focus=await p.evaluate(()=>document.activeElement.getAttribute('aria-label'));
for(let i=0;i<4;i++){ await p.screenshot({path:`${out}rx_${w}_more${i}.jpg`,type:'jpeg',quality:70}); await p.evaluate(h=>scrollBy(0,h*.9),h); await new Promise(r=>setTimeout(r,700)); }
await p.click('.rg-f[data-f=fig]'); await new Promise(r=>setTimeout(r,500));
const nfig=await p.evaluate(()=>[...document.querySelectorAll('.rg-t')].filter(t=>!t.hidden).length);
await p.evaluate(()=>document.getElementById('gallery').scrollIntoView()); await new Promise(r=>setTimeout(r,600));
await p.screenshot({path:`${out}rx_${w}_fig.jpg`,type:'jpeg',quality:70});
await p.evaluate(()=>[...document.querySelectorAll('.rg-t')].find(t=>!t.hidden).querySelector('button').click()); await new Promise(r=>setTimeout(r,900));
await p.screenshot({path:`${out}rx_${w}_lb0.jpg`,type:'jpeg',quality:70});
const ct1=await p.evaluate(()=>document.querySelector('[data-lb-ct]').textContent);
await p.keyboard.press('Tab'); await p.keyboard.press('ArrowRight'); 
await p.click('[data-lb-next]'); await new Promise(r=>setTimeout(r,800));
const ct2=await p.evaluate(()=>document.querySelector('[data-lb-ct]').textContent+' '+document.querySelector('[data-lb-c]').textContent);
await p.screenshot({path:`${out}rx_${w}_lb1.jpg`,type:'jpeg',quality:70});
await p.keyboard.press('Escape'); await new Promise(r=>setTimeout(r,300));
const back=await p.evaluate(()=>document.activeElement.className+' open='+document.getElementById('lb').open);
const broken=await p.evaluate(()=>[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src).map(i=>i.src.split('/').pop()));
console.log(JSON.stringify({focusAfterMore:focus,nfig,ct1,ct2,back,broken,errs}));
await b.close();
