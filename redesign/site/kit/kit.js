/* Club Kit motion: one vocabulary for every page.
   data-k="lines"  headline words rise out of masks          data-k="rise"  children fade up in sequence
   data-k="clip"   image opens from the bottom edge           data-k="par"   image drifts against the scroll
   .k-rail         drag + arrow buttons                       .k-steps       pinned visual follows the active step
   .k-index[data-float] image follows the cursor              .faq details   open and close with height motion
   Reserve bar hides while reading down, returns on scroll up. Page curtain between internal pages.
   Reduced motion or no GSAP: everything shows in its final state. */
(function(){
var W=window,D=document,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
function G(){ return !RM&&W.gsap&&W.ScrollTrigger&&(W.gsap.registerPlugin(W.ScrollTrigger),W.gsap); }
function qa(s,r){ return Array.prototype.slice.call((r||D).querySelectorAll(s)); }

/* ---------- page curtain ---------- */
addEventListener('pageshow',function(e){ if(e.persisted) D.documentElement.classList.remove('k-out'); });
D.addEventListener('click',function(e){
  if(RM||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
  var a=e.target.closest&&e.target.closest('a[href]'); if(!a||a.target||a.hasAttribute('download')) return;
  var h=a.getAttribute('href'); if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:|javascript:)/.test(h)||h.indexOf('.html')<0) return;
  if(a.pathname===location.pathname&&a.hash) return;
  if(!D.querySelector('.k-curtain')) return; e.preventDefault(); try{ sessionStorage.setItem('kcur','1'); }catch(_){} D.documentElement.classList.remove('k-in'); D.documentElement.classList.add('k-out');
  setTimeout(function(){ location.href=a.href; },400);
});

/* ---------- reserve bar: hide while reading down, show on scroll up, hide near the footer and booking zones ---------- */
function rbar(){ var b=D.querySelector('.rbar'); if(!b) return; var last=scrollY, hideZone=false;
  var zones=qa('.foot,[data-k-calm]');
  if('IntersectionObserver' in W&&zones.length){ var vis=new Set(); var io=new IntersectionObserver(function(es){ es.forEach(function(x){ x.isIntersecting?vis.add(x.target):vis.delete(x.target); }); hideZone=vis.size>0; upd(); },{rootMargin:'0px 0px -10% 0px'}); zones.forEach(function(z){ io.observe(z); }); }
  var down=false;
  function upd(){ var y=scrollY; if(Math.abs(y-last)>6){ down=y>last; last=y; } var top=y<innerHeight*.6;
    b.classList.toggle('k-hide', hideZone||(!top&&down)); }
  addEventListener('scroll',upd,{passive:true}); upd();
  b.addEventListener('focusin',function(){ b.classList.remove('k-hide'); });
}

/* ---------- split headline words into masks (keeps inner spans like .it) ---------- */
function splitWords(el){ if(el.dataset.kSplit) return; el.dataset.kSplit=1;
  (function walk(n){ Array.prototype.slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){ var parts=c.textContent.split(/(\s+)/); var f=D.createDocumentFragment();
      parts.forEach(function(p){ if(!p) return; if(/^\s+$/.test(p)){ f.appendChild(D.createTextNode(p)); return; }
        var o=D.createElement('span'); o.className='kw'; var i=D.createElement('span'); i.textContent=p; o.appendChild(i); f.appendChild(o); });
      n.replaceChild(f,c); }
    else if(c.nodeType===1&&!/^(BR|SVG|IMG)$/.test(c.tagName)&&!c.classList.contains('kw')) walk(c);
  }); })(el);
  return qa('.kw>span',el);
}

function motion(){ var g=G(); if(!g) return;
  qa('[data-k="lines"]').forEach(function(el){ var w=splitWords(el)||[];
    g.from(w,{yPercent:115,rotate:3,duration:1.1,ease:'power4.out',stagger:.045,onComplete:function(){ el.classList.add('kw-done'); },scrollTrigger:{trigger:el,start:'top 88%'}}); });
  qa('[data-k="rise"]').forEach(function(el){ var kids=el.children.length?Array.prototype.slice.call(el.children):[el];
    g.from(kids,{y:34,opacity:0,duration:.95,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:el,start:'top 86%'}}); });
  qa('[data-k="clip"]').forEach(function(el){ var im=el.querySelector('img,video');
    g.fromTo(el,{clipPath:'inset(18% 0% 0% 0% round 6px)'},{clipPath:'inset(0% 0% 0% 0% round 6px)',ease:'power3.out',duration:1.4,scrollTrigger:{trigger:el,start:'top 85%'}});
    if(im) g.fromTo(im,{scale:1.18},{scale:1,ease:'power3.out',duration:1.6,scrollTrigger:{trigger:el,start:'top 85%'}}); });
  qa('[data-k="par"]').forEach(function(el){ var im=el.querySelector('img,video')||el;
    g.fromTo(im,{yPercent:-6,scale:1.12},{yPercent:6,scale:1.12,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}); });
  qa('.k-index').forEach(function(l){ g.from(qa('li',l),{y:30,opacity:0,duration:.8,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:l,start:'top 85%'}}); });
  qa('.k-nums').forEach(function(l){ g.from(l.children,{y:26,opacity:0,duration:.8,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:l,start:'top 88%'}}); });
  qa('.k-rail').forEach(function(l){ g.from(l.children,{x:60,opacity:0,duration:1,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:l,start:'top 85%'}}); });
  qa('.k-mosaic').forEach(function(l){ g.from(l.children,{y:40,opacity:0,duration:1,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:l,start:'top 85%'}}); });
  qa('.k-stmt blockquote').forEach(function(q){ var w=splitWords(q)||[]; q.classList.add('kw-done'); g.from(w,{opacity:.18,ease:'none',stagger:.05,scrollTrigger:{trigger:q,start:'top 88%',end:'bottom 72%',scrub:true}}); });
}

/* ---------- rail: drag to scroll + arrows ---------- */
function rails(){ qa('.k-railwrap').forEach(function(w){ var r=w.querySelector('.k-rail'); if(!r) return;
  // a scroll area keyboard users can reach (arrow keys scroll it once focused)
  if(!r.hasAttribute('tabindex')){ r.setAttribute('tabindex','0'); if(!r.getAttribute('aria-label')) r.setAttribute('aria-label',(W.BC_T_fn||function(x){return x})('Scrollable gallery')); }
  var prev=w.querySelector('[data-k-prev]'), next=w.querySelector('[data-k-next]');
  function step(){ var c=r.children[0]; return c?c.getBoundingClientRect().width+14:300; }
  function st(){ if(prev) prev.disabled=r.scrollLeft<4; if(next) next.disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-4; }
  if(prev) prev.addEventListener('click',function(){ r.scrollBy({left:-step(),behavior:RM?'auto':'smooth'}); });
  if(next) next.addEventListener('click',function(){ r.scrollBy({left:step(),behavior:RM?'auto':'smooth'}); });
  r.addEventListener('scroll',st,{passive:true}); st();
  if(FINE){ var x0,s0,moved=false,down=false;
    r.addEventListener('pointerdown',function(e){ if(e.pointerType!=='mouse') return; down=true; moved=false; x0=e.clientX; s0=r.scrollLeft; });
    addEventListener('pointermove',function(e){ if(!down) return; var dx=e.clientX-x0; if(Math.abs(dx)>4){ moved=true; r.classList.add('drag'); } r.scrollLeft=s0-dx; });
    addEventListener('pointerup',function(){ if(!down) return; down=false; r.classList.remove('drag'); });
    r.addEventListener('click',function(e){ if(moved){ e.preventDefault(); e.stopPropagation(); moved=false; } },true);
    r.addEventListener('dragstart',function(e){ e.preventDefault(); }); }
}); }

/* ---------- sticky steps: the pinned visual follows the step in view ---------- */
function steps(){ qa('.k-steps').forEach(function(s){ var lis=qa('ol>li',s), vis=qa('.k-pin>*',s);
  function on(i){ lis.forEach(function(l,j){ l.classList.toggle('on',j===i); }); vis.forEach(function(v,j){ v.classList.toggle('on',j===Math.min(i,vis.length-1)); }); }
  on(0); if(!('IntersectionObserver' in W)) return;
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) on(lis.indexOf(e.target)); }); },{rootMargin:'-45% 0px -45% 0px'});
  lis.forEach(function(l){ io.observe(l); });
}); }

/* ---------- index list: image follows the cursor ---------- */
function floats(){ if(!FINE||RM) return; qa('.k-index[data-float]').forEach(function(l){
  var f=D.createElement('div'); f.className='k-float'; f.setAttribute('aria-hidden','true'); var im=D.createElement('img'); im.alt=''; f.appendChild(im); D.body.appendChild(f);
  var x=0,y=0,cx=0,cy=0,raf=0;
  function loop(){ cx+=(x-cx)*.18; cy+=(y-cy)*.18; f.style.left=cx+'px'; f.style.top=cy+'px'; raf=Math.abs(x-cx)+Math.abs(y-cy)>.5?requestAnimationFrame(loop):0; }
  qa('li[data-img]',l).forEach(function(li){
    li.addEventListener('mouseenter',function(e){ im.src=li.dataset.img; x=cx=e.clientX+170; y=cy=e.clientY; f.classList.add('on'); });
    li.addEventListener('mousemove',function(e){ x=e.clientX+170; y=e.clientY; if(!raf) raf=requestAnimationFrame(loop); });
    li.addEventListener('mouseleave',function(){ f.classList.remove('on'); }); });
}); }

/* ---------- FAQ height motion ---------- */
function faqs(){ if(RM) return; qa('.faq details').forEach(function(d){ var s=d.querySelector('summary'); if(!s) return;
  s.addEventListener('click',function(e){ e.preventDefault(); var open=d.open, body=Array.prototype.slice.call(d.children).filter(function(c){ return c!==s; });
    if(!open){ d.open=true; body.forEach(function(b){ var h=b.scrollHeight; b.animate([{height:'0px',opacity:0},{height:h+'px',opacity:1}],{duration:380,easing:'cubic-bezier(.2,.7,.1,1)'}); }); }
    else{ var a; body.forEach(function(b){ a=b.animate([{height:b.scrollHeight+'px',opacity:1},{height:'0px',opacity:0}],{duration:300,easing:'cubic-bezier(.2,.7,.1,1)'}); }); if(a) a.onfinish=function(){ d.open=false; }; else d.open=false; }
  }); }); }

/* ---------- magnetic primary buttons ---------- */
function magnets(){ if(!FINE||RM) return; qa('.btn-brass,.btn-bottle').forEach(function(b){ if(b.closest('.rbar')) return;
  b.addEventListener('mousemove',function(e){ var r=b.getBoundingClientRect(); b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'; });
  b.addEventListener('mouseleave',function(){ b.style.transform=''; }); b.style.transition='transform .35s cubic-bezier(.2,.7,.1,1),background .16s'; }); }

function go(){ rbar(); rails(); steps(); floats(); faqs(); magnets(); motion(); }
// pins created later in the page (e.g. a pinned hero) add scroll space: re-measure every trigger in page order
function remeasure(){ if(W.ScrollTrigger){ W.ScrollTrigger.sort(); W.ScrollTrigger.refresh(); } }
addEventListener('load',function(){ remeasure(); setTimeout(remeasure,600); });
if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',go); else go();
W.BCKit={split:splitWords};
})();
