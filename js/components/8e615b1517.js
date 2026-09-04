(function(){
  var els=document.querySelectorAll('.rvl');
  try{
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){
      els.forEach(function(e){e.classList.add('in')});return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{rootMargin:'0px 0px -8% 0px'});
    document.documentElement.classList.add('motion-ready');
    els.forEach(function(e){io.observe(e)});
  }catch(error){
    document.documentElement.classList.remove('motion-ready');
    els.forEach(function(e){e.classList.add('in')});
  }
})();
