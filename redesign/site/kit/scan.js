/* BCScan: the body scan as a body of light. A point cloud in a human silhouette; a scan line sweeps
   down and every point it passes takes its segment's composition (muscle green / fat gold), callouts
   appear as their segment is read. BCScan.mount(el, {segs, callouts}) returns {set(p)} with p 0..1.
   Without a driver it loops on its own while visible. Reduced motion: final state, still. */
(function(){
var W=window,D=document,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
// right half of a front silhouette, viewBox x -112..112, y 0..440; mirrored for the left
var R=[[9,54],[10,64],[30,71],[50,79],[60,93],[64,128],[67,164],[70,198],[69,226],[73,248],[64,268],[55,252],[52,228],[49,196],[45,166],[42,120],[40,114],
       [35,172],[43,214],[45,262],[39,318],[41,358],[31,408],[37,428],[12,431],[12,410],[14,360],[12,320],[8,264],[0,244]];
function smooth(pts){ var s='M'+pts[0][0]+' '+pts[0][1]; for(var i=0;i<pts.length-1;i++){ var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
  s+='C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+' '+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+' '+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0]+' '+p2[1]; } return s; }
var body=R.concat(R.slice().reverse().map(function(p){ return [-p[0],p[1]]; }));
var BODY=smooth(body)+'Z', HEAD='M0 3a20 25 0 1 0 0.01 0Z';
function seg(x,y){ if(y<56) return 'head'; if(Math.abs(x)>41&&y<270) return x<0?'la':'ra'; if(y>236) return x<0?'ll':'rl'; return 'trunk'; }
function hash(i){ i=(i^61)^(i>>>16); i=i+(i<<3); i=i^(i>>>4); i=Math.imul(i,0x27d4eb2d); i=i^(i>>>15); return (i>>>0)/4294967295; }

function mount(el,o){ o=o||{};
  var F=o.segs||{head:0,trunk:.32,la:.24,ra:.22,ll:.26,rl:.25};
  var C={muscle:o.muscle||'#38B27A',fat:o.fat||'#E2BC6E',off:'rgba(244,239,230,.16)',line:'#EAFBF2'};
  var cv=D.createElement('canvas'), ctx=cv.getContext('2d'); cv.setAttribute('aria-hidden','true'); el.appendChild(cv);
  var ov=D.createElement('div'); ov.className='bcs-ov'; el.appendChild(ov);
  // points
  var pc=D.createElement('canvas').getContext('2d'), P=new Path2D(BODY), H=new Path2D(HEAD), pts=[], step=3.3, k=0;
  for(var y=2;y<438;y+=step) for(var x=-110;x<=110;x+=step){ var jx=x+(k%2?step/2:0); k++; if(!(pc.isPointInPath(P,jx,y)||pc.isPointInPath(H,jx,y))) continue;
    var s=seg(jx,y), r=hash(Math.round((jx+120)*10)*7919+Math.round(y*10)); pts.push({x:jx,y:y,s:s,fat:s!=='head'&&r<F[s],ph:r*6.28}); }
  var calls=(o.callouts||[]).map(function(c){ var d=D.createElement('div'); d.className='bcs-c '+(c.x<0?'l':'r'); d.innerHTML='<i></i><span>'+c.label+'</span><b>'+c.value+'</b>'; ov.appendChild(d); c.el=d; return c; });
  var w=0,h=0,dpr=1,sc=1,ox=0,oy=0,prog=RM?1:0,raf=0,vis=false,loop=!o.driven;
  function size(){ var r=el.getBoundingClientRect(); w=r.width; h=r.height; dpr=Math.min(2,W.devicePixelRatio||1); cv.width=w*dpr; cv.height=h*dpr; cv.style.width=w+'px'; cv.style.height=h+'px';
    sc=Math.min(h*.94/440,w*(1-2*(o.pad||0))*.9/230); ox=w/2; oy=(h-440*sc)/2;
    calls.forEach(function(c){ c.el.style.top=(oy+c.y*sc)+'px'; c.el.style.setProperty('--x',(ox+c.x*sc)+'px'); }); draw(performance.now()); }
  function draw(t){ ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    var sy=-20+prog*480, rad=Math.max(.9,1.02*sc);
    ctx.save(); ctx.translate(ox,oy); ctx.scale(sc,sc); ctx.lineWidth=1.1/sc; ctx.strokeStyle='rgba(124,224,168,.32)'; ctx.stroke(P); ctx.stroke(H); ctx.restore();
    for(var i=0;i<pts.length;i++){ var p=pts[i], X=ox+p.x*sc, Y=oy+p.y*sc, d=sy-p.y;
      if(d<0){ ctx.fillStyle=C.off; ctx.beginPath(); ctx.arc(X,Y,rad*.62,0,6.283); ctx.fill(); continue; }
      var near=d<14, tw=.82+.18*Math.sin(t/700+p.ph);
      ctx.globalAlpha=near?1:tw; ctx.fillStyle=near?C.line:(p.s==='head'?'rgba(244,239,230,.55)':(p.fat?C.fat:C.muscle));
      ctx.beginPath(); ctx.arc(X,Y,near?rad*1.25:rad,0,6.283); ctx.fill(); }
    ctx.globalAlpha=1;
    if(prog>0&&prog<1){ var ly=oy+sy*sc, g=ctx.createLinearGradient(0,ly-90*sc,0,ly); g.addColorStop(0,'rgba(56,178,122,0)'); g.addColorStop(1,'rgba(56,178,122,.22)');
      ctx.fillStyle=g; ctx.fillRect(ox-118*sc,ly-90*sc,236*sc,90*sc);
      ctx.shadowColor='#7CF0B4'; ctx.shadowBlur=18; ctx.fillStyle=C.line; ctx.fillRect(ox-122*sc,ly-1,244*sc,2); ctx.shadowBlur=0; }
    calls.forEach(function(c){ c.el.classList.toggle('on',sy>c.y+4); });
    if(o.onProgress) o.onProgress(prog);
  }
  function tick(t){ raf=0; if(loop&&vis&&!RM){ prog+=.0032; if(prog>1.35) prog=0; } draw(t); if(vis&&!RM) raf=requestAnimationFrame(tick); }
  function wake(){ if(!raf&&vis&&!RM) raf=requestAnimationFrame(tick); }
  if('IntersectionObserver' in W) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; wake(); }).observe(el); else { vis=true; wake(); }
  addEventListener('resize',size); size();
  return {set:function(p){ loop=false; prog=Math.max(0,Math.min(1,p)); wake(); }, auto:function(){ loop=true; wake(); }};
}
W.BCScan={mount:mount};
// every older drawScan() call on the site now draws this body
W.drawScan=function(el){ if(!el) return; el.innerHTML=''; var box=D.createElement('div'); box.className='bcs-box'; el.appendChild(box);
  var T=W.BC_T||{}, L=D.documentElement.lang, lean={ro:'masă slabă',ru:'сух. масса'}[L]||'lean';
  function t(k,d){ var v=T[k]; return v?v.charAt(0)+v.slice(1).toLowerCase():d; }
  requestAnimationFrame(function(){ mount(box,{pad:.24,callouts:[{x:44,y:150,label:t('TRUNK','Trunk'),value:'68% '+lean},{x:-66,y:156,label:t('LEFT ARM','Left arm'),value:'76% '+lean},
    {x:-40,y:268,label:t('LEFT LEG','Left leg'),value:'74% '+lean},{x:40,y:280,label:t('RIGHT LEG','Right leg'),value:'75% '+lean}]}); }); };
})();
