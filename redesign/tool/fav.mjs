import puppeteer from 'puppeteer-core'; import fs from 'fs';
const S='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/brand/';
const svg=fs.readFileSync(S+'favicon.svg','utf8');
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const [n,sz,bleed] of [['apple-touch-icon.png',180,1],['fav-32.png',32,0],['fav-16.png',16,0],['fav-48.png',48,0]]){
 const p=await b.newPage(); await p.setViewport({width:sz,height:sz});
 const s=bleed?svg.replace('rx="14"','rx="0"'):svg;
 await p.setContent('<html><body style="margin:0;background:transparent">'+s.replace('<svg ','<svg width="'+sz+'" height="'+sz+'" ')+'</body></html>');
 await p.screenshot({path:S+n,omitBackground:true}); await p.close(); }
await b.close();
