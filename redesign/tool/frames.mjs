import puppeteer from 'puppeteer-core'; import fs from 'fs';
// grab still frames from a local video through Chrome (no ffmpeg on this Mac)
const [src,outdir,n]=[process.argv[2],process.argv[3],+(process.argv[4]||12)];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.goto('http://localhost:8765/');
const res=await p.evaluate(async(src,n)=>{ const v=document.createElement('video'); v.src=src; v.muted=true; v.crossOrigin='anonymous'; await new Promise(r=>v.addEventListener('loadedmetadata',r)); const out=[]; const d=v.duration;
  for(let i=0;i<n;i++){ v.currentTime=d*(i+.5)/n; await new Promise(r=>v.addEventListener('seeked',r,{once:true})); const c=document.createElement('canvas'); c.width=v.videoWidth; c.height=v.videoHeight; c.getContext('2d').drawImage(v,0,0); out.push([v.currentTime.toFixed(1),c.toDataURL('image/jpeg',.9)]); }
  return {d,w:v.videoWidth,h:v.videoHeight,out}; },src,n);
console.log(res.d,res.w,res.h); res.out.forEach(([t,u],i)=>fs.writeFileSync(`${outdir}/f${String(i).padStart(2,'0')}-${t}.jpg`,Buffer.from(u.split(',')[1],'base64')));
await b.close();
