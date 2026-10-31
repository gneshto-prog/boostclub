import puppeteer from 'puppeteer-core';
const base='file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const pages=['_home_local.html','free-scan.html','how-it-works.html','menu.html','results.html','reviews.html','gabriel.html','boost-fit.html','visit.html','bring-a-friend.html','photos.html','404.html'];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const pg of pages){ const p=await b.newPage(); let bytes=0; p.on('response',async r=>{ try{ const buf=await r.buffer(); bytes+=buf.length; }catch(e){} });
 await p.setViewport({width:1440,height:900}); await p.goto(base+pg,{waitUntil:'networkidle0'});
 await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=700){ scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); } });
 await new Promise(r=>setTimeout(r,800));
 const r=await p.evaluate(()=>{ const noalt=[...document.images].filter(i=>!i.hasAttribute('alt')).map(i=>i.src.split('/').pop());
  const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop());
  const h=[...document.querySelectorAll('h1,h2,h3')].map(x=>x.tagName); const h1=h.filter(x=>x==='H1').length;
  const btn=[...document.querySelectorAll('button,a')].filter(e=>!(e.textContent.trim()||e.getAttribute('aria-label')||e.querySelector('img[alt]:not([alt=""])'))).map(e=>e.outerHTML.slice(0,60));
  const links=[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>h&&!h.startsWith('http')&&!h.startsWith('#')&&!h.startsWith('mailto'));
  return {noalt,broken,h1,btn,links:[...new Set(links)]}; });
 console.log(pg,'KB',Math.round(bytes/1024),JSON.stringify(r)); await p.close(); }
await b.close();
