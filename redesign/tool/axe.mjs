import puppeteer from 'puppeteer-core'; import fs from 'fs';
// WCAG 2.1 A/AA scan with axe-core after scrolling the page (so reveals finished). Groups by rule.
const AXE=fs.readFileSync(new URL('./node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
const pages=(process.env.PAGES||'_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,business.html,404.html').split(',');
const w=+(process.env.W||1280);
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const out={};
for(const pg of pages){ const p=await b.newPage(); await p.setViewport({width:w,height:900,isMobile:w<800});
  await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0'});
  await p.evaluate(async()=>{ for(let y=0;y<document.documentElement.scrollHeight;y+=400){ scrollTo(0,y); await new Promise(r=>setTimeout(r,120)); } await new Promise(r=>setTimeout(r,1500)); scrollTo(0,0); });
  await p.addScriptTag({content:AXE});
  const r=await p.evaluate(async()=>{ const res=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},resultTypes:['violations']});
    return res.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,help:v.help,eg:v.nodes.slice(0,3).map(x=>x.target.join(' ')+' :: '+(x.failureSummary||'').split('\n').slice(1,2).join('').slice(0,120))})); });
  out[pg]=r; console.log(pg, r.length?r.map(v=>`${v.id}(${v.impact},${v.n})`).join(' '):'clean'); await p.close(); }
fs.writeFileSync(process.env.OUT||'axe.json',JSON.stringify(out,null,1)); await b.close();
