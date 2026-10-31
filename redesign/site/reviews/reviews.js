/* Reviews page: language filter, marquee pause, gentle reveals. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chips=document.querySelectorAll('.chips-f button'), rvs=document.querySelectorAll('.rv'), msg=document.querySelector('[data-count-msg]');
  var names={all:'all languages',en:'English',ro:'Romanian',ru:'Russian',uk:'Ukrainian'}, LIMIT=24, open=false, cur='all', more=document.querySelector('[data-more]'), moreN=document.querySelector('[data-more-n]');
  function apply(f,animate){ cur=f; var n=0, shown=[]; rvs.forEach(function(r){ var on=f==='all'||r.dataset.lang===f; if(on) n++; var vis=on&&(open||n<=LIMIT); r.hidden=!vis; if(vis) shown.push(r); });
    if(more){ more.parentNode.hidden=open||n<=LIMIT; if(moreN) moreN.textContent=n; }
    return [n,shown]; }
  apply('all');
  if(more) more.addEventListener('click',function(){ open=true; var res=apply(cur); var first=res[1][LIMIT]; if(first){ first.setAttribute('tabindex','-1'); first.focus({preventScroll:true}); } });
  chips.forEach(function(b){ b.addEventListener('click',function(){ var f=b.dataset.f, n=0;
    chips.forEach(function(x){ x.setAttribute('aria-pressed',x===b); });
    var res=apply(f); n=res[0];
    msg.textContent='Showing '+n+' review'+(n===1?'':'s')+' in '+names[f]+'.';
    if(!RM&&window.gsap) gsap.fromTo(res[1].slice(0,18),{opacity:0,y:14},{opacity:1,y:0,duration:.45,stagger:.025,ease:'power2.out',overwrite:true}); }); });

  var sec=document.querySelector('.mqsec'), pb=document.querySelector('.mq-pause');
  if(pb) pb.addEventListener('click',function(){ var on=pb.getAttribute('aria-pressed')!=='true'; pb.setAttribute('aria-pressed',on); sec.classList.toggle('paused',on); pb.querySelector('.mq-pl').textContent=on?'Play':'Pause'; });

  if(RM||!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.plate',{y:30,opacity:0,duration:1,ease:'power3.out',delay:.2});
  gsap.from('.fq-fig blockquote',{y:40,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.fq-fig',start:'top 80%'}});
  gsap.utils.toArray('.rv,.share-more').forEach(function(el){ gsap.from(el,{y:24,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%'}}); });
})();
