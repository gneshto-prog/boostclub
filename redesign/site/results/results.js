/* Results page: before/after comparison slider (pointer + keyboard), featured picker with ambient light,
   gallery lightbox (focus trap, Esc returns focus), gentle reveals. Reduced motion: no glides, no hints. */
(function(){
  var P=JSON.parse(document.getElementById('pairs').textContent);
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CT='Community transformation';
  function ease(u){ return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2; }

  function Slider(el){
    var h=el.querySelector('.ba-h'), tb=el.querySelector('.ba-tb'), ta=el.querySelector('.ba-ta'), p=50, drag=false, raf=0, api={touched:false};
    function set(v,user){ p=Math.max(0,Math.min(100,v)); el.style.setProperty('--p',p+'%'); var r=Math.round(p);
      h.setAttribute('aria-valuenow',r); h.setAttribute('aria-valuetext','Showing '+r+'% before, '+(100-r)+'% after');
      tb.style.opacity=p<16?0:1; ta.style.opacity=p>84?0:1; if(user){ api.touched=true; stop(); } }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf=0; } el.classList.remove('hint'); }
    // glide through a list of positions; skipped for reduced motion
    function glide(keys,dur,done){ stop(); if(RM){ set(keys[keys.length-1]); if(done) done(); return; }
      var t0=null, n=keys.length-1;
      function st(t){ if(!t0) t0=t; var q=Math.min(1,(t-t0)/dur), seg=Math.min(n-1,Math.floor(q*n)), u=ease(q*n-seg);
        set(keys[seg]+(keys[seg+1]-keys[seg])*u); if(q<1) raf=requestAnimationFrame(st); else { raf=0; el.classList.remove('hint'); if(done) done(); } }
      raf=requestAnimationFrame(st); }
    function fromX(x){ var b=el.getBoundingClientRect(); if(b.width) set((x-b.left)/b.width*100,true); }
    el.addEventListener('pointerdown',function(e){ if(e.button>0) return; drag=true; el.classList.add('drag');
      try{ el.setPointerCapture(e.pointerId); }catch(_){} fromX(e.clientX); if(e.pointerType==='mouse'){ e.preventDefault(); h.focus({preventScroll:true}); } });
    el.addEventListener('pointermove',function(e){ if(drag) fromX(e.clientX); });
    function end(){ drag=false; el.classList.remove('drag'); }
    ['pointerup','pointercancel','lostpointercapture'].forEach(function(t){ el.addEventListener(t,end); });
    h.addEventListener('keydown',function(e){ var s=e.shiftKey?10:5, k=e.key, v=null;
      if(k==='ArrowLeft'||k==='ArrowDown') v=p-s; else if(k==='ArrowRight'||k==='ArrowUp') v=p+s;
      else if(k==='PageDown') v=p-20; else if(k==='PageUp') v=p+20; else if(k==='Home') v=0; else if(k==='End') v=100;
      if(v!==null){ e.preventDefault(); set(v,true); } });
    api.set=set; api.get=function(){ return p; }; api.glide=glide; api.stop=stop;
    // reveal: the after wipes in from the right edge, then settles in the middle
    api.reveal=function(){ if(RM){ set(50); return; } set(100); glide([100,50],950); };
    api.hint=function(){ if(api.touched||RM) return; el.classList.add('hint'); glide([50,80,22,50],3200); };
    api.load=function(d){ var b=el.querySelector('.ba-before'), a=el.querySelector('.ba-after'), fl=el.querySelector('.ba-fill');
      el.style.setProperty('--a',Math.max(d.a,+(el.dataset.mina||0))); b.src=d.b; b.alt=d.ab; a.src=d.f; a.alt=d.af; if(fl) fl.src=d.fs;
      b.width=a.width=Math.round(d.a*1000); b.height=a.height=1000;
      h.setAttribute('aria-label','Before and after comparison, transformation '+d.n); set(50); };
    set(50); return api;
  }
  window.BA=Slider;

  function caption(node,d){ node.textContent=d.cap||CT; node.classList.toggle('nofig',!d.cap); }

  // hero: featured set, ambient light follows the pair
  var hero=document.querySelector('.ba-hero'), HS=Slider(hero);
  var capN=document.querySelector('[data-cap-n]'), capT=document.querySelector('[data-cap-t]');
  var amb=[document.querySelector('[data-amb]'),document.querySelector('[data-amb2]')], ai=0;
  function ambient(src){ if(!amb[0]||!amb[1]) return; var nx=amb[1-ai]; nx.src=src; nx.classList.add('on'); amb[ai].classList.remove('on'); ai=1-ai; }
  document.querySelectorAll('.pk').forEach(function(b){ b.addEventListener('click',function(){
    if(b.getAttribute('aria-pressed')==='true') return;
    var d=P[+b.dataset.i]; HS.load(d); capN.textContent=d.n; caption(capT,d); ambient(d.fs);
    document.querySelectorAll('.pk').forEach(function(x){ x.setAttribute('aria-pressed',x===b); });
    HS.touched=true; HS.reveal();
    if(!RM&&window.gsap){ gsap.fromTo([capN,capT],{yPercent:60,opacity:0},{yPercent:0,opacity:1,duration:.7,stagger:.06,ease:'power3.out'}); } }); });
  // first view: the after wipes in, then one slow sweep so people see it moves (skipped once touched)
  if(!RM&&'IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; io.disconnect();
      setTimeout(function(){ if(HS.touched) return; HS.set(100); HS.glide([100,50],1100,function(){ setTimeout(HS.hint,450); }); },500); },{threshold:.4});
    io.observe(hero); }

  // gallery lightbox
  var lb=document.getElementById('lb'), LS=Slider(lb.querySelector('.ba-lb')), cur=0, opener=null;
  var ORD=P.map(function(_,k){ return k; });   // indices in the current filter, in gallery order
  var lbN=lb.querySelector('[data-lb-n]'), lbC=lb.querySelector('[data-lb-c]'), lbCt=lb.querySelector('[data-lb-ct]'), lbA=lb.querySelector('[data-lb-amb]');
  var ths=lb.querySelectorAll('[data-go]');
  function show(i){ var j=ORD.indexOf(i); if(j<0){ j=0; } cur=ORD[j]; var d=P[cur]; LS.load(d); lbN.textContent=d.n; caption(lbC,d);
    lbCt.textContent=String(j+1).padStart(2,'0')+' / '+String(ORD.length).padStart(2,'0');
    if(lbA) lbA.src=d.fs;
    ths.forEach(function(t){ var k=+t.dataset.go; t.hidden=ORD.indexOf(k)<0; t.setAttribute('aria-current',k===cur?'true':'false'); if(k===cur&&t.offsetParent&&t.scrollIntoView) t.scrollIntoView({block:'nearest',inline:'center',behavior:RM?'auto':'smooth'}); });
    LS.reveal();
    var n=P[ORD[(j+1)%ORD.length]]; [n.b,n.f].forEach(function(s){ var im=new Image(); im.src=s; }); }
  function step(dlt){ var j=ORD.indexOf(cur); show(ORD[(j+dlt+ORD.length)%ORD.length]); }
  function open(i,from){ opener=from||document.activeElement;
    if(lb.showModal) lb.showModal(); else lb.setAttribute('open','');
    document.documentElement.style.overflow='hidden'; show(i); lb.querySelector('.ba-h').focus(); }
  function close(){ LS.stop(); if(lb.close) lb.close(); else { lb.removeAttribute('open'); onClose(); } }
  function onClose(){ document.documentElement.style.overflow=''; if(opener&&opener.focus) opener.focus({preventScroll:true}); }
  lb.addEventListener('close',onClose);
  document.querySelectorAll('[data-open]').forEach(function(b){ b.addEventListener('click',function(){ open(+b.dataset.open,b); }); });
  ths.forEach(function(t){ t.addEventListener('click',function(){ show(+t.dataset.go); }); });
  lb.querySelector('[data-lb-close]').addEventListener('click',close);
  lb.querySelector('[data-lb-prev]').addEventListener('click',function(){ step(-1); });
  lb.querySelector('[data-lb-next]').addEventListener('click',function(){ step(1); });
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  lb.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ e.preventDefault(); close(); return; }
    if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!(e.target.classList&&e.target.classList.contains('ba-h'))){ e.preventDefault(); step(e.key==='ArrowLeft'?-1:1); return; }
    if(e.key!=='Tab') return;
    var f=Array.prototype.filter.call(lb.querySelectorAll('button,[tabindex="0"]'),function(x){ return x.offsetParent!==null; });
    if(!f.length) return; var a=f[0], z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){ e.preventDefault(); z.focus(); }
    else if(!e.shiftKey&&document.activeElement===z){ e.preventDefault(); a.focus(); } });
  window.BC_LB={open:open,close:close,show:show};

  // gallery: filter (all / with a figure) + "Show all" after the first tiles
  var tiles=[].slice.call(document.querySelectorAll('.rg-t')), more=document.querySelector('[data-more]'), FIRST=tiles.filter(function(t){ return !t.hidden; }).length, flt='all', all=false;
  function paint(){ ORD=[]; var shown=0;
    tiles.forEach(function(t){ var k=+t.dataset.k, inF=flt==='all'||t.classList.contains('fig'); if(inF) ORD.push(k);
      t.hidden=!inF||(!all&&flt==='all'&&shown>=FIRST); if(inF) shown++; });
    if(more) more.parentNode.hidden=all||flt!=='all';
    if(window.ScrollTrigger) ScrollTrigger.refresh(); }
  document.querySelectorAll('.rg-f').forEach(function(b){ b.addEventListener('click',function(){
    flt=b.dataset.f; document.querySelectorAll('.rg-f').forEach(function(x){ x.setAttribute('aria-pressed',x===b); }); paint(); }); });
  if(more) more.addEventListener('click',function(){ all=true; paint(); var t=tiles[FIRST]; if(t){ var bt=t.querySelector('button'); if(bt) bt.focus({preventScroll:false}); } if(window.ScrollTrigger) ScrollTrigger.refresh(); });

  // gentle reveals
  if(RM||!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.rx-copy .eyebrow,.rx-copy .sub,.rx-ctas',{y:18,opacity:0,duration:.9,stagger:.07,ease:'power3.out',delay:.25});
  gsap.from('.rx-stage',{y:40,opacity:0,duration:1.2,ease:'power3.out',delay:.1});
  gsap.from('.rx-side>*',{y:24,opacity:0,duration:.9,stagger:.08,ease:'power3.out',delay:.35});
  gsap.utils.toArray('.rg-t').forEach(function(el,k){
    gsap.fromTo(el,{clipPath:'inset(14% 0% 0% 0%)',opacity:0},{clipPath:'inset(0% 0% 0% 0%)',opacity:1,duration:1.1,ease:'power3.out',delay:(k%4)*.06,
      scrollTrigger:{trigger:el,start:'top 90%'},onComplete:function(){ el.style.clipPath=''; }}); });
  gsap.from('.st-feat blockquote',{y:40,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.st-feat',start:'top 75%'}});
})();
