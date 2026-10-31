import puppeteer from 'puppeteer-core';
// Per page on a throttled phone: bytes at load and after full scroll, LCP, CLS, long tasks. Chrome only.
const pages='_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,404.html'.split(',');
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const pg of pages){
  const p=await b.newPage(); await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  const c=await p.createCDPSession(); await c.send('Network.enable'); await c.send('Network.setCacheDisabled',{cacheDisabled:true});
  await c.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:12*1024*1024/8,uploadThroughput:3*1024*1024/8});
  await c.send('Emulation.setCPUThrottlingRate',{rate:4});
  let bytes=0; const big=[]; c.on('Network.loadingFinished',e=>{ bytes+=e.encodedDataLength; }); c.on('Network.responseReceived',e=>{ e._u=e.response.url; });
  await p.evaluateOnNewDocument(()=>{ window.__cls=0; window.__lcp=0; new PerformanceObserver(l=>l.getEntries().forEach(e=>{ if(!e.hadRecentInput) window.__cls+=e.value; })).observe({type:'layout-shift',buffered:true}); new PerformanceObserver(l=>{ const e=l.getEntries().pop(); window.__lcp=e.startTime; window.__lcpel=(e.element&&(e.element.tagName+' '+(e.element.currentSrc||e.element.className||'')).slice(0,60))||''; }).observe({type:'largest-contentful-paint',buffered:true}); });
  const t0=Date.now(); await p.goto('http://localhost:8765/'+pg,{waitUntil:'load',timeout:120000}); const tl=Date.now()-t0;
  await new Promise(r=>setTimeout(r,1500)); const atLoad=bytes;
  const m=await p.evaluate(()=>({lcp:Math.round(window.__lcp),el:window.__lcpel,cls:+window.__cls.toFixed(3)}));
  await p.evaluate(async()=>{ for(let y=0;y<document.documentElement.scrollHeight;y+=600){ scrollTo(0,y); await new Promise(r=>setTimeout(r,250)); } });
  await new Promise(r=>setTimeout(r,1500)); const cls2=await p.evaluate(()=>+window.__cls.toFixed(3));
  console.log(`${pg.padEnd(22)} load ${tl}ms  first ${(atLoad/1048576).toFixed(2)}MB  all ${(bytes/1048576).toFixed(2)}MB  LCP ${m.lcp}ms (${m.el})  CLS load ${m.cls} scroll ${cls2}`);
  await p.close(); }
await b.close();
