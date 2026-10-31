import puppeteer from 'puppeteer-core'; import fs from 'fs';
const pages='_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,404.html'.split(',');
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let out='';
for(const pg of pages){ const p=await b.newPage(); await p.setViewport({width:1440,height:900}); await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'});
 await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=500){ scrollTo(0,y); await new Promise(r=>setTimeout(r,40)); } });
 const t=await p.evaluate(()=>{ const sk=new Set(); const L=[]; const sk2=e=>[...e.parentElement.closest('h1,h2,h3,p,li,blockquote')?[1]:[]].length>0; document.querySelectorAll('body h1,body h2,body h3,body h4,body p,body li,body blockquote,body figcaption,body .btn,body button,body .k-label,body .eyebrow,body dt,body dd,body b,body small').forEach(e=>{ if(e.closest('.k-marquee,footer,nav,#rgrid,.rv-grid,.rgrid,#tiles')||sk2(e)) return; const s=(e.innerText||'').trim().replace(/\s+/g,' '); if(s&&!sk.has(s)){ sk.add(s); L.push(e.tagName+': '+s); } }); return L.join('\n'); });
 out+='\n\n######## '+pg+'\n'+t; await p.close(); }
fs.writeFileSync('qa/copy-en.txt',out); await b.close();
