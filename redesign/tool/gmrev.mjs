import puppeteer from 'puppeteer-core'; import fs from 'fs';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--lang=en-US']});
const p=await b.newPage(); await p.setViewport({width:1280,height:1000}); await p.setExtraHTTPHeaders({'Accept-Language':'en-US,en;q=0.9'});
await p.goto('https://www.google.com/maps/search/Boost+Club+Strada+Sevastopol+24+Bucharest?hl=en',{waitUntil:'networkidle2',timeout:60000});
await new Promise(r=>setTimeout(r,2000));
for(const bt of await p.$$('button')){ const tx=await bt.evaluate(e=>e.innerText); if(/Reject all/.test(tx)){ await bt.click(); break; } }
await new Promise(r=>setTimeout(r,6000));
const tabs=await p.$$('button[role="tab"]'); let ok=false;
for(const t of tabs){ const tx=await t.evaluate(e=>e.innerText+' '+(e.getAttribute('aria-label')||'')); if(/review/i.test(tx)){ await t.click(); ok=true; break; } }
console.log('tab',ok); await new Promise(r=>setTimeout(r,4000));
const body=await p.evaluate(()=>document.body.innerText); if(/unusual traffic|not a robot/i.test(body)){ console.log('BLOCKED'); await b.close(); process.exit(0); }
for(let i=0;i<60;i++){ await p.evaluate(()=>{ const f=[...document.querySelectorAll('div')].filter(d=>d.scrollHeight>d.clientHeight+200&&getComputedStyle(d).overflowY!='visible').sort((a,b)=>b.scrollHeight-a.scrollHeight)[0]; if(f) f.scrollTop=f.scrollHeight; }); await new Promise(r=>setTimeout(r,700)); }
for(const m of await p.$$('button[aria-label="See more"],button.w8nwRe')){ try{ await m.click(); }catch(e){} }
await new Promise(r=>setTimeout(r,1000));
const revs=await p.evaluate(()=>[...document.querySelectorAll('[data-review-id]')].filter(e=>e.querySelector('.wiI7pd')||e.innerText).map(e=>({id:e.getAttribute('data-review-id'),name:(e.querySelector('.d4r55')||{}).innerText||'',stars:(e.querySelector('[role="img"][aria-label*="star"]')||{getAttribute:()=>''}).getAttribute('aria-label'),when:(e.querySelector('.rsqaWe')||{}).innerText||'',text:(e.querySelector('.wiI7pd')||{}).innerText||''})));
const uniq={}; revs.forEach(r=>{ if(!uniq[r.id]||r.text.length>uniq[r.id].text.length) uniq[r.id]=r; });
const out=Object.values(uniq); fs.writeFileSync('/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/greviews.json',JSON.stringify(out,null,1));
console.log('reviews',out.length,'with text',out.filter(r=>r.text).length); await b.close();
