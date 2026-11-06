# Place pages: About Gabriel (gabriel.html), Visit (visit.html), 404 (404.html).
# Runs inside build.py's globals (page, WA, MAPS, ... available). Overrides build.py's versions.
# Copy is build.py's English copy, word for word, re-ordered into new components.
# New UI strings (alts, one slot caption) are listed in i18n/new-place.json.

# ======================================================================================
# About Gabriel: an editorial founder profile
# ======================================================================================
_GB_CSS = r"""
/* pale sections on this dark page keep ink text (kit classes too) */
.dark .gb-pale{color:var(--ink)}
.dark .gb-pale .k-label{color:var(--brass-ink)}
.dark .gb-pale .k-h .it{color:var(--leaf)}
.dark .gb-pale .k-head aside,.dark .gb-pale .muted{color:var(--stone)}
.gb-bone{background:var(--bone)}

/* ---------- hero: magazine cover, portrait bleeds to the edge ---------- */
.gb-hero{position:relative;min-height:max(100svh,680px);display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);background:var(--night);color:var(--cream);overflow:hidden}
.gb-ht{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:flex-end;padding-top:150px;padding-bottom:clamp(130px,17vh,180px)}
.gb-ht .k-label{margin-bottom:26px}
.gb-ht h1{font-size:clamp(64px,9.6vw,172px);line-height:.84;letter-spacing:-.065em}
.gb-ht h1 .it{display:block;color:var(--brass);padding-left:.04em;letter-spacing:-.02em}
.gb-ht .gb-lead{margin-top:34px;font-size:clamp(17px,1.35vw,20px);line-height:1.55;max-width:50ch;color:rgba(244,239,230,.8)}
.gb-hq{margin:26px 0 0;padding-left:20px;border-left:1px solid var(--brass);max-width:40ch;font-family:var(--accent);font-style:italic;font-weight:500;font-size:clamp(22px,1.9vw,28px);line-height:1.2;color:var(--cream)}
.gb-ht .row{margin-top:34px}
.gb-hp{position:relative;margin:0;overflow:hidden;background:var(--night)}
.gb-hp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 18%}
.gb-hp::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,var(--night) 0%,rgba(7,30,23,0) 22%),linear-gradient(0deg,rgba(7,30,23,.55) 0%,rgba(7,30,23,0) 30%);pointer-events:none}
@media (min-width:901px) and (max-height:960px){.gb-ht{padding-top:112px;padding-bottom:124px}.gb-ht h1{font-size:clamp(56px,8vw,128px)}.gb-ht .gb-lead{margin-top:24px}.gb-hq{margin-top:18px}.gb-ht .row{margin-top:24px}}
@media (min-width:901px) and (max-height:760px){.gb-ht{padding-top:92px;padding-bottom:110px}.gb-ht .k-label{margin-bottom:16px}.gb-ht h1{font-size:clamp(52px,6.6vw,104px)}.gb-ht .gb-lead{font-size:16px;margin-top:18px}.gb-hq{font-size:21px;max-width:48ch}}
@media (max-width:900px){
  .gb-hero{grid-template-columns:minmax(0,1fr);min-height:0}
  .gb-hp{order:-1;aspect-ratio:4/5;max-height:66svh}
  .gb-hp::after{background:linear-gradient(0deg,var(--night) 0%,rgba(7,30,23,.6) 22%,rgba(7,30,23,0) 48%)}
  .gb-ht{margin-top:-120px;padding-top:0;padding-bottom:120px}
}

/* ---------- credentials as marks ---------- */
.gb-cred .gb-mk{font-size:clamp(44px,4.4vw,76px)!important;white-space:nowrap}.gb-cred{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(28px,5vw,80px);align-items:start}.gb-credp{margin:0;position:sticky;top:96px;aspect-ratio:3/4;border-radius:6px;overflow:hidden}.gb-credp img{width:100%;height:100%;object-fit:cover;object-position:50% 30%}@media (max-width:900px){.gb-cred{grid-template-columns:minmax(0,1fr)}.gb-credp{position:relative;top:0;max-width:520px}}
.gb-marks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--line-l)}
.gb-marks>div{padding:clamp(30px,3.4vw,52px) clamp(20px,3.4vw,56px) clamp(34px,3.6vw,60px) 0;border-bottom:1px solid var(--line-l)}
.gb-marks>div:nth-child(even){padding-left:clamp(20px,3.4vw,56px);padding-right:0;border-left:1px solid var(--line-l)}
.gb-mk{display:block;font-size:clamp(58px,8vw,132px);font-weight:600;letter-spacing:-.065em;line-height:.86;font-variant-numeric:tabular-nums}
.gb-ml{display:block;margin-top:16px;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass-ink)}
.gb-marks h3{margin-top:clamp(26px,3vw,44px);font-size:clamp(22px,2vw,30px);letter-spacing:-.03em;line-height:1.05}
.gb-marks p{margin:12px 0 0;color:var(--stone);max-width:46ch}
@media (max-width:700px){.gb-marks{grid-template-columns:minmax(0,1fr)}.gb-marks>div,.gb-marks>div:nth-child(even){padding-left:0;padding-right:0;border-left:0}}

/* ---------- statement ---------- */
.gb-stmt blockquote{max-width:25ch;font-size:clamp(30px,4.1vw,64px)}
.gb-stmt cite span{white-space:nowrap}

/* ---------- journey: a real timeline ---------- */
.gb-tlw{position:relative}.gb-tl{list-style:none;margin:0;padding:0;position:relative}
.gb-tlw::before,.gb-fill{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--line-d);transform:translateX(-.5px)}
.gb-fill{background:var(--brass);transform-origin:50% 0}
.gb-tl>li{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(64px,10vw,150px);align-items:center;padding-block:clamp(44px,5.5vw,84px)}
.gb-tl>li::after{content:'';position:absolute;left:50%;top:50%;width:15px;height:15px;border-radius:50%;background:var(--bottle);box-shadow:0 0 0 1px var(--brass);transform:translate(-50%,-50%);transition:background .4s var(--ease),box-shadow .4s var(--ease)}
.gb-tl>li.on::after{background:var(--brass);box-shadow:0 0 0 6px rgba(217,178,106,.18)}
.gb-ph{position:relative;justify-self:end;width:min(100%,440px);margin:0;border-radius:6px;overflow:hidden;background:var(--pine)}
.gb-ph img{width:100%;height:auto}
.gb-tl>li:nth-child(even) .gb-ph{order:2;justify-self:start}
.gb-tl>li:nth-child(even) .gb-tx{justify-self:end;text-align:right}
.gb-tl>li:nth-child(even) .gb-tx p{margin-left:auto}
.gb-n{display:block;font-family:var(--loud);font-size:clamp(76px,8.6vw,140px);line-height:.82;color:var(--brass)}
.gb-tx h3{margin-top:22px;font-size:clamp(32px,3.4vw,52px);letter-spacing:-.045em;line-height:.98}
.gb-tx p{margin:16px 0 0;font-size:clamp(17px,1.35vw,20px);line-height:1.5;max-width:30ch;color:rgba(244,239,230,.78)}
.gb-ph.k-slot{aspect-ratio:4/5;min-height:0;background-color:#174536;box-shadow:inset 0 0 0 1px rgba(217,178,106,.3)}
.gb-ph.k-slot::after{opacity:.5}
.gb-ph.k-slot .k-slotcap{color:var(--brass)}
@media (max-width:900px){
  .gb-tlw::before,.gb-fill{left:7px}
  .gb-tl>li{grid-template-columns:minmax(0,1fr);gap:24px;padding:40px 0 40px 44px}
  .gb-tl>li::after{left:7px;top:58px}
  .gb-tl>li .gb-ph,.gb-tl>li:nth-child(even) .gb-ph{order:2;justify-self:start;width:min(100%,460px)}
  .gb-tl>li:nth-child(even) .gb-tx{justify-self:start;text-align:left}
  .gb-tl>li:nth-child(even) .gb-tx p{margin-left:0}
}

/* ---------- family: two-column text, then the three photos edge to edge ---------- */
.gb-fam .k-h .it{display:block}
.gb-famp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(24px,4vw,64px);margin-top:clamp(36px,4vw,56px);max-width:1040px;margin-left:auto}
.gb-famp p{margin:0 0 18px;font-size:18px;line-height:1.7;color:var(--stone)}.gb-famp .gb-own{color:var(--ink);font-weight:500}
.gb-famp>div:first-child>p:first-child::first-letter{float:left;font-family:var(--accent);font-weight:500;font-size:4.1em;line-height:.8;margin:.06em .1em 0 0;color:var(--leaf)}
.gb-fammo{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
.gb-fammo figure{position:relative;margin:0;aspect-ratio:3/4;overflow:hidden;background:var(--pine)}
.gb-fammo img{width:100%;height:100%;object-fit:cover}
@media (max-width:760px){.gb-famp{grid-template-columns:minmax(0,1fr)}.gb-fammo{grid-template-columns:repeat(2,minmax(0,1fr))}.gb-fammo figure:first-child{grid-column:1/-1}}

/* ---------- sport and community ---------- */
.gb-spg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(40px,7vw,120px);align-items:center}
.gb-bigp{position:relative;margin:0;aspect-ratio:3/4;border-radius:6px;overflow:hidden;max-width:560px}.gb-bigp img{width:100%;height:100%;object-fit:cover;object-position:50% 35%}.gb-bigp::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(4,20,15,.9) 0%,rgba(4,20,15,.3) 38%,rgba(4,20,15,0) 60%)}.gb-bigp figcaption{position:absolute;left:clamp(20px,2.4vw,34px);bottom:clamp(20px,2.4vw,34px);z-index:1}.gb-bigp b{font-size:clamp(56px,6.4vw,104px)!important}
.gb-big b{display:block;font-size:clamp(84px,13.5vw,230px);font-weight:600;letter-spacing:-.075em;line-height:.8;font-variant-numeric:tabular-nums;color:var(--cream)}
.gb-big span{display:block;margin-top:22px;font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--brass)}
.gb-sp .k-h{font-size:clamp(40px,4.8vw,76px)}
.gb-sp .k-lead{margin-top:26px}
.gb-sp .gb-p2{margin-top:18px;max-width:46ch;color:rgba(244,239,230,.66)}
.gb-sp .row{margin-top:30px}
@media (max-width:900px){.gb-spg{grid-template-columns:minmax(0,1fr);align-items:start}}

/* ---------- 3 S: three big cards ---------- */
.gb-3s .k-h .it{display:block}
.gb-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.gb-card{position:relative;display:flex;flex-direction:column;min-height:clamp(470px,44vw,640px);padding:clamp(24px,2.4vw,36px);border-radius:6px;overflow:hidden;isolation:isolate}
.gb-card .gb-ci{font-family:var(--loud);font-size:clamp(110px,12vw,200px);line-height:.8;letter-spacing:.005em}
.gb-card h3{margin-top:auto;padding-top:32px;font-size:clamp(34px,3.4vw,54px);letter-spacing:-.05em;line-height:.95}
.gb-card p{margin:16px 0 0;font-size:16px;line-height:1.55;max-width:34ch;opacity:.86}
.gb-card.c1{background:var(--bottle);color:var(--cream)}.gb-card.c1 .gb-ci{color:var(--brass)}
.gb-card.c2{background:var(--brass);color:#13201B}.gb-card.c2 .gb-ci{color:var(--bottle)}
.gb-card.c3{background:var(--leaf);color:var(--cream)}.gb-card.c3 .gb-ci{color:var(--brass-hi)}
@media (max-width:900px){
  .gb-cards{grid-template-columns:minmax(0,1fr);gap:14px}
  .gb-card{position:sticky;top:calc(84px + var(--i,0) * 18px);min-height:380px;box-shadow:0 -14px 40px rgba(14,20,18,.14)}
  .gb-card .gb-ci{font-size:110px}
}

/* ---------- closing band: Gabriel at the club wall, the words on clean night ---------- */
.gb-cta .k-h{font-size:clamp(56px,7.4vw,124px);max-width:9ch}
.gb-cta>img{object-position:50% 30%}
@media (min-width:901px){
  .gb-cta>img{left:auto;right:0;width:56%}
  .gb-cta::after{background:linear-gradient(90deg,var(--night) 0%,var(--night) 44%,rgba(7,30,23,0) 60%),linear-gradient(0deg,rgba(7,30,23,.55) 0%,rgba(7,30,23,0) 28%)}
  .gb-cta .wrap>*{max-width:min(40vw,560px)}
}
@media (max-width:900px){
  .gb-cta{display:block;min-height:0}
  .gb-cta>img{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:4/5;max-height:80svh}
  .gb-cta::after{background:linear-gradient(180deg,rgba(7,30,23,0) 0%,rgba(7,30,23,0) 34%,var(--night) 54%)}
  .gb-cta .wrap{margin-top:-90px;padding-top:0;padding-bottom:120px}
}
"""

_GB_JS = r"""
  var gbRM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // marks count up from zero; prefix/suffix text (and its translation) stays as written
  document.querySelectorAll('[data-gb-count]').forEach(function(el){
    if(gbRM||!('IntersectionObserver' in window)) return;
    var tn=null;(function f(n){ Array.prototype.forEach.call(n.childNodes,function(c){ if(tn) return; if(c.nodeType===3&&/\d/.test(c.nodeValue)) tn=c; else if(c.nodeType===1) f(c); }); })(el);
    if(!tn) return; var src=tn.nodeValue, m=src.match(/\d[\d,]*/); if(!m) return;
    var end=parseInt(m[0].replace(/,/g,''),10), cm=m[0].indexOf(',')>-1;
    function fm(v){ var s=String(v); return cm?s.replace(/\B(?=(\d{3})+(?!\d))/g,','):s; }
    el.style.minWidth=el.getBoundingClientRect().width+'px';
    tn.nodeValue=src.replace(m[0],fm(0));
    var io=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; io.disconnect(); var t0=null;
      function st(t){ if(!t0) t0=t; var p=Math.min(1,(t-t0)/1500); p=1-Math.pow(1-p,3); tn.nodeValue=src.replace(m[0],fm(Math.round(end*p))); if(p<1) requestAnimationFrame(st); }
      requestAnimationFrame(st); },{threshold:.5});
    io.observe(el);
  });
  // timeline dots: all lit when there is no scroll motion
  if(gbRM||!window.gsap) document.querySelectorAll('.gb-tl>li').forEach(function(l){ l.classList.add('on'); });
  document.querySelectorAll('.gb-card').forEach(function(c,i){ c.style.setProperty('--i',i); });
"""

_GB_GSAP = r"""
  var tl=document.querySelector('.gb-tlw');
  if(tl){
    gsap.fromTo('.gb-fill',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:tl,start:'top 55%',end:'bottom 55%',scrub:true}});
    gsap.utils.toArray('.gb-tl>li').forEach(function(li){
      ScrollTrigger.create({trigger:li,start:'top 55%',onEnter:function(){ li.classList.add('on'); },onLeaveBack:function(){ li.classList.remove('on'); }});
      gsap.from(li.querySelector('.gb-tx'),{y:46,opacity:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:li,start:'top 78%'}});
    });
  }
  gsap.from('.gb-hp img',{scale:1.08,duration:1.8,ease:'power3.out'});
  gsap.from('.gb-ht .gb-lead,.gb-ht .gb-hq,.gb-ht .row',{y:22,opacity:0,duration:1,stagger:.08,ease:'power3.out',delay:.35});
  gsap.from('.gb-fammo figure',{y:60,opacity:0,duration:1.1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'.gb-fammo',start:'top 85%'}});
"""

def _gb_step(n, h, p, media):
    return f'<li>{media}<div class="gb-tx"><span class="gb-n">{n}</span><h3>{h}</h3><p>{p}</p></div></li>'

def _gb_img(src, alt, w, h, slot):
    return f'<figure class="gb-ph" data-k="clip" data-slot="{slot}"><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy"></figure>'

_GB_STEPS = "".join([
    _gb_step("01", "The starting point", "Underweight, living chaotically, with close to zero confidence.",
             _gb_img("img/his/gabi-before.jpg", "Gabriel at the starting point, before building over 20 kg of muscle", 855, 1736, "REAL · Gabriel before")),
    _gb_step("02", "The change", "Proper nutrition + structured training → over 20 kg of muscle.",
             _gb_img("img/his/gabi-after.jpg", "Gabriel after building over 20 kg of muscle", 855, 1736, "REAL · Gabriel after")),
    _gb_step("03", "Sport", "Today he competes as a semi-pro MMA fighter and track &amp; field athlete.",
             _gb_img("img/mma.jpg", "Gabriel training in an MMA cage", 825, 1100, "REAL · MMA")),
    _gb_step("04", "The training", "Years studying sports science and nutrition, confirmed by the ISSA certification.",
             _gb_img("img/real/gabi-event.jpg", "Gabriel Neshto on stage at a gala", 1350, 1800, "REAL · Gabriel in a tux on stage")),
    _gb_step("05", "Boost Club", "All that experience comes home to Bucharest. You come in, measure your start, leave with a clear direction.",
             _gb_img("img/his/painting.webp", "Gabriel painting the green wall of the club", 1049, 1500, "REAL · painting the wall")),
])

_GB_BODY = f'''<section class="gb-hero">
  <div class="gb-ht gut">
    <span class="k-label">Boost Club founder</span>
    <h1>Gabriel <span class="it">Neshto.</span></h1>
    <p class="gb-lead">ISSA-certified personal trainer, semi-professional MMA fighter and track &amp; field athlete, third generation of a family with 36 years in wellness, and someone who built his own body from zero: over 20 kg of muscle.</p>
    <p class="gb-hq">I don't sell you a perfect plan. I offer a realistic direction, built around your life, not the other way around.</p>
    <div class="row"><a class="btn btn-brass" href="#" data-reserve>Book a consultation with Gabriel <span class="ar">→</span></a></div>
  </div>
  <figure class="gb-hp" data-slot="REAL · Gabriel on stage"><img src="img/real/gabi-event.jpg" alt="Gabriel Neshto on stage at a gala" width="1350" height="1800"></figure>
</section>

<section class="sec gut gb-bone gb-pale"><div class="wrap">
  <div class="gb-cred"><figure class="gb-credp" data-k="clip" data-slot="REAL · Gabriel training"><img src="img/his/gabi-fight.jpg" alt="Gabriel in a Muay Thai fight" loading="lazy"></figure><div>
  <h2 class="k-h" data-k="lines">Credentials.</h2>
  <div class="gb-marks" data-k="rise" style="margin-top:40px">
    <div><b class="gb-mk">ISSA</b><span class="gb-ml">Certified personal trainer</span><h3>ISSA certified</h3><p>Certified Personal Trainer from the International Sports Sciences Association, backed by years of systematic study in sports science, nutrition and health.</p></div>
    <div><b class="gb-mk" data-gb-count>+20 kg</b><span class="gb-ml">Muscle built</span><h3>Competing athlete</h3><p>Over 20 kg of muscle built through proper nutrition and training. Competes as a semi-professional MMA fighter and track &amp; field athlete.</p></div>
    <div><b class="gb-mk" data-gb-count>36 years</b><span class="gb-ml">Family expertise in wellness</span><h3>36 years of heritage</h3><p>The Neshto family has worked in wellness for 36 years and guided thousands of people. Gabriel grew up in this environment and carries the tradition forward.</p></div>
    <div><b class="gb-mk" data-gb-count>20+</b><span class="gb-ml">Countries</span><h3>International community</h3><p>Clients from over 20 countries, from France, Switzerland and the UK to the USA, India and Singapore. Close to 30,000 followers online.</p></div>
  </div>
</div></div>
</div></section>

<section class="k-stmt night gut gb-stmt"><blockquote>"Your body is the one business you can't sell, replace, or walk away from. <em>Start investing in it.</em>"</blockquote></section>

<section class="sec on-dark gut"><div class="wrap">
  <div class="k-head"><div><span class="k-label">The story</span><h2 class="k-h" data-k="lines">Gabriel's <span class="it">journey.</span></h2></div></div>
  <div class="gb-tlw"><span class="gb-fill" aria-hidden="true"></span><ol class="gb-tl">{_GB_STEPS}</ol></div>
</div></section>

<section class="oat gb-pale gb-fam">
  <div class="sec gut" style="padding-bottom:clamp(56px,6vw,96px)"><div class="wrap">
    <span class="k-label">Family heritage</span>
    <h2 class="k-h" data-k="lines" style="margin-top:22px">36 years of wellness. <span class="it">A tradition that continues.</span></h2>
    <div class="gb-famp" data-k="rise"><div><p>The Neshto family has worked in nutrition and wellness since 1989. For more than three decades they have guided thousands of people of all ages, with every kind of goal: losing weight, building strength, getting their energy back. Along the way they built teams across countries and reached one of the highest levels of recognition in their industry.</p><p>Gabriel grew up inside that work. He saw what actually changes people's lives and what doesn't: the habits that last, the support that keeps someone going, the details that make a plan realistic.</p></div><div><p>This means that behind Boost Club stands not an entrepreneur who read a few books, but a family that has seen what works on thousands of real people, in real time, for nearly four decades.</p><p class="gb-own">Boost Club is his own. The same proven principles, applied with a younger, more modern perspective, built for the pace of life today.</p></div></div>
  </div></div>
  <div class="gb-fammo">
    <figure data-slot="REAL · the family"><img src="img/family.jpg" alt="The Neshto family in a TV studio" loading="lazy" style="object-position:50% 30%"></figure>
    <figure data-slot="REAL"><img src="img/his/gabi-kiss.webp" alt="Gabriel at the club with the youngest member of the family" loading="lazy" style="object-position:50% 30%"></figure>
    <figure data-slot="REAL"><img src="img/real/gabi-gala-group.jpg" alt="Gabriel with his family and team on stage at a gala" loading="lazy" style="object-position:50% 40%"></figure>
  </div>
</section>

<section class="sec night gut"><div class="wrap gb-spg">
  <figure class="gb-big gb-bigp" data-k="clip" data-slot="REAL · Gabriel training in Thailand"><img src="img/his/gabi-muaythai.jpg" alt="Gabriel flexing at a Muay Thai gym in Thailand" loading="lazy"><figcaption><b data-gb-count>~30,000</b><span>Followers</span></figcaption></figure>
  <div class="gb-sp"><span class="k-label">Sport &amp; community</span><h2 class="k-h" data-k="lines" style="margin-top:22px">From the ring and the track, <span class="it">into the club.</span></h2><p class="k-lead">The discipline of MMA and athletics is the same discipline Gabriel brings to consultations: measurable steps, executed consistently, no shortcuts.</p><p class="gb-p2">Close to 30,000 people follow him on social media, where his content on nutrition, training and lifestyle has gathered millions of views.</p><div class="row"><a class="btn btn-ghost" href="https://www.instagram.com/gabineshto" target="_blank" rel="noopener">@gabineshto on Instagram</a><a class="btn btn-ghost" href="https://gabrielneshto.com" target="_blank" rel="noopener">gabrielneshto.com</a></div></div>
</div></section>'''

page("gabriel.html", "About Gabriel", "gabriel", _GB_BODY, css=_GB_CSS, js=_GB_JS, gsapjs=_GB_GSAP, light=False, dark=True)


# ======================================================================================
# Visit: a destination page
# ======================================================================================
_VS_CSS = r"""
/* hero: the full room stays soft on purpose */
.vs-hero{min-height:max(100svh,640px)}
.vs-hero .h-xl{font-size:clamp(64px,10vw,180px);max-width:11ch}
.vs-hero .h-xl .it{color:var(--brass)}
.vs-hero .k-label{margin-bottom:26px}
.vs-hero .vs-sub{margin-top:28px;font-size:clamp(18px,1.6vw,22px);line-height:1.45;max-width:40ch;color:rgba(244,239,230,.84)}
.vs-hero .btn-ghost{color:var(--cream)}

/* two real photos, edge to edge, nothing cropped */
.vs-strip{display:grid;grid-template-columns:minmax(0,1.3333fr) minmax(0,.75fr);gap:4px;background:var(--bone)}
.vs-strip figure{position:relative;margin:0;overflow:hidden;background:var(--pine)}
.vs-strip figure:first-child{aspect-ratio:4/3}
.vs-strip img{width:100%;height:100%;object-fit:cover}
@media (max-width:760px){.vs-strip{grid-template-columns:minmax(0,1fr)}.vs-strip figure+figure{aspect-ratio:4/5}}

/* contact + hours */
.vs-ig{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(36px,6vw,100px);align-items:start}
.vs-addr .k-h{margin-top:22px;font-size:clamp(42px,5.4vw,88px)}
.vs-addr .k-h .it{display:block}
.vs-links{margin-top:clamp(36px,4vw,56px);border-top:1px solid var(--line-l)}
.vs-l{display:grid;grid-template-columns:130px minmax(0,1fr) auto;align-items:center;gap:16px;padding:22px 0;border-bottom:1px solid var(--line-l);text-decoration:none;transition:padding .45s var(--ease)}
.vs-l span{font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass-ink)}
.vs-l b{font-size:clamp(22px,2.3vw,34px);font-weight:600;letter-spacing:-.035em;line-height:1.1;overflow-wrap:anywhere}
.vs-l i{font-style:normal;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line-l);font-size:18px;transition:background .3s var(--ease),color .3s var(--ease),transform .4s var(--ease)}
@media (hover:hover){.vs-l:hover{padding-left:12px}.vs-l:hover i{background:var(--bottle);color:var(--cream);transform:rotate(45deg)}}
.vs-addr .row{margin-top:32px}
@media (max-width:560px){.vs-l{grid-template-columns:minmax(0,1fr) auto;gap:6px 14px}.vs-l span{grid-column:1/-1}.vs-l i{grid-row:2;grid-column:2}}
.vs-hours{background:var(--bottle);color:var(--cream);border-radius:6px;padding:clamp(26px,3vw,44px)}
.vs-hr{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;padding:20px 0;border-bottom:1px solid var(--line-d);position:relative}
.vs-hours .k-label+.vs-hr{margin-top:22px;border-top:1px solid var(--line-d)}
.vs-hr span{font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--sage)}
.vs-hr b{font-size:clamp(30px,3.1vw,48px);font-weight:600;letter-spacing:-.045em;line-height:1;font-variant-numeric:tabular-nums}
.vs-hr.on span{color:var(--brass)}
.vs-hr.on::before{content:'';position:absolute;right:0;top:24px;width:10px;height:10px;border-radius:50%;background:var(--brass);box-shadow:0 0 0 6px rgba(217,178,106,.2)}
.vs-hours p{margin:22px 0 0;color:rgba(244,239,230,.78)}
.vs-hours .vs-rv{margin-top:14px;font-size:13px;color:var(--brass)}
@media (max-width:900px){.vs-ig{grid-template-columns:minmax(0,1fr)}}

/* directions: a line diagram, not a map */
.vs-route{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:0;padding:clamp(36px,5vw,72px) clamp(24px,4vw,64px);border-radius:6px;background:radial-gradient(90% 120% at 15% 0%,rgba(47,138,99,.35),transparent 60%),radial-gradient(70% 100% at 100% 100%,rgba(217,178,106,.14),transparent 60%),var(--pine);overflow:hidden}
.vs-stop{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;width:clamp(170px,19vw,250px)}
.vs-dot{display:grid;place-items:center;width:clamp(72px,7vw,100px);height:clamp(72px,7vw,100px);border-radius:50%;flex:none}
.vs-dot.m{background:var(--night);box-shadow:inset 0 0 0 3px var(--brass);color:var(--brass);font:600 clamp(30px,3vw,42px)/1 var(--display);letter-spacing:-.04em}
.vs-dot.b{background:var(--cream);color:var(--leaf)}
.vs-dot.b{position:relative}.vs-dot.b svg{width:38%;height:auto}
.vs-dot.b::after{content:'';position:absolute;inset:0;border-radius:50%;animation:vspulse 2.6s ease-out infinite}
@keyframes vspulse{from{box-shadow:0 0 0 0 rgba(244,239,230,.45)}to{box-shadow:0 0 0 26px rgba(244,239,230,0)}}
.vs-stop b{text-wrap:balance;font-size:clamp(17px,1.5vw,22px);font-weight:600;letter-spacing:-.02em;line-height:1.2}
.vs-stop small{display:block;margin-top:4px;font-size:13px;color:var(--sage)}
.vs-line{position:relative;height:clamp(72px,7vw,100px);align-self:start;margin:0 -12px}
.vs-line::before{content:'';position:absolute;left:0;right:0;top:50%;height:4px;margin-top:-2px;background:repeating-linear-gradient(90deg,var(--brass) 0 8px,transparent 8px 20px);background-size:20px 4px;animation:vswalk 1.2s linear infinite;opacity:.9;transform-origin:0 50%}
.vs-line i{position:absolute;top:50%;left:0;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--cream);box-shadow:0 0 0 6px rgba(244,239,230,.16);animation:vsgo 4.2s cubic-bezier(.45,0,.55,1) infinite}
.vs-chip{position:absolute;left:50%;bottom:calc(50% + 22px);transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;background:rgba(7,30,23,.72);backdrop-filter:blur(8px);color:var(--cream);font-size:13px;font-weight:600;white-space:nowrap}
.vs-chip svg{width:14px;height:14px;flex:none;color:var(--brass)}
@keyframes vswalk{to{background-position:20px 0}}
@keyframes vsgo{0%{left:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:100%;opacity:0}}
@media (max-width:760px){
  .vs-route{grid-template-columns:minmax(0,1fr);justify-items:center;padding:36px 20px}
  .vs-stop{width:auto}
  .vs-line{width:100px;height:190px;margin:10px 0;align-self:auto}
  .vs-line::before{left:50%;right:auto;top:0;bottom:0;width:4px;height:auto;margin:0 0 0 -2px;background:repeating-linear-gradient(180deg,var(--brass) 0 8px,transparent 8px 20px);background-size:4px 20px;animation-name:vswalkv}
  .vs-line i{left:50%;top:0;animation-name:vsgov}
  .vs-chip{left:50%;bottom:auto;top:50%;transform:translate(-50%,-50%);white-space:normal;max-width:min(240px,80%);text-align:left}
}
@keyframes vswalkv{to{background-position:0 20px}}
@keyframes vsgov{0%{top:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{top:100%;opacity:0}}
.vs-ways{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:clamp(24px,4vw,64px);align-items:start;margin-top:clamp(36px,4vw,56px)}
.vs-way{display:grid;grid-template-columns:56px minmax(0,1fr);gap:20px;padding-top:24px;border-top:1px solid var(--line-d)}
.vs-ic{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(217,178,106,.6);color:var(--brass);font:600 22px/1 var(--display)}
.vs-ic svg{width:26px;height:26px}
.vs-k{display:block;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass)}
.vs-way h3{margin-top:10px;font-size:clamp(22px,2vw,30px);letter-spacing:-.03em;line-height:1.1}
.vs-way p{margin:10px 0 0;color:rgba(244,239,230,.74);max-width:40ch}
.vs-ways>.btn{align-self:end}
@media (max-width:1000px){.vs-ways{grid-template-columns:minmax(0,1fr)}.vs-ways>.btn{justify-self:start}}

/* walk-in: the door itself */
.vs-cta .k-split{grid-template-columns:minmax(0,.7fr) minmax(0,1fr)}
.vs-cta .k-media{aspect-ratio:3/4.3}
.vs-cta .k-media img{object-position:50% 55%}
.vs-cta .k-h{font-size:clamp(46px,6vw,100px)}
.vs-cta .k-lead{color:var(--stone)}
@media (max-width:900px){.vs-cta .k-split{grid-template-columns:minmax(0,1fr)}.vs-cta .k-media{aspect-ratio:4/5;max-height:72svh;width:100%}}
"""

_VS_JS = r"""
  try{ var wd=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Bucharest',weekday:'short'}).format(new Date());
    var dn={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[wd];
    document.querySelectorAll('.vs-hr[data-days]').forEach(function(r){ if(r.dataset.days.split(',').indexOf(String(dn))>-1){ r.classList.add('on'); r.setAttribute('aria-current','date'); } });
  }catch(e){}
"""

_VS_GSAP = r"""
  gsap.from('.vs-hero .vs-sub,.vs-hero .row',{y:20,opacity:0,duration:1,stagger:.08,ease:'power3.out',delay:.3});
  gsap.from('.vs-hero .h-xl',{y:40,opacity:0,duration:1.1,ease:'power4.out'});
  gsap.from('.vs-stop',{y:24,opacity:0,duration:.9,stagger:.25,ease:'power3.out',scrollTrigger:{trigger:'.vs-route',start:'top 80%'}});
  gsap.from('.vs-l,.vs-hr',{y:22,opacity:0,duration:.8,stagger:.06,ease:'power3.out',scrollTrigger:{trigger:'.vs-ig',start:'top 80%'}});
"""

_LEAF = '<svg viewBox="0 0 24 25.7" aria-hidden="true"><path fill="currentColor" d="M18.62 0h2.56C23.06 0 24 5.98 24 9.22v2.48c0 7.94-6.92 14-18.62 14H2.82C.85 25.7 0 19.64 0 17.08v-3.59C0 5.98 6.83 0 18.62 0Z"/></svg>'
_WALK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M10 21l2-6 3 3v3M8 12l3-4 3 2 3 1M11 8l-1 5"/></svg>'
_CAR = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3h-3v-1H6v1H3z"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/></svg>'

_VS_BODY = f'''<section class="k-band soft vs-hero" data-slot="REAL · the club, full room (kept soft on purpose)"><img src="img/his/full-room.webp" alt="" aria-hidden="true"><div class="wrap gut">
  <span class="k-label">Location</span>
  <h1 class="h-xl">Come to Boost <span class="it">Club.</span></h1>
  <p class="vs-sub">Strada Sevastopol 24, Sector 1, in central Bucharest.</p>
  <div class="row"><a class="btn btn-brass" href="{MAPS}" target="_blank" rel="noopener">Open directions <span class="ar">→</span></a><a class="btn btn-ghost" href="#" data-reserve>Book free consultation</a></div>
</div></section>

<section class="vs-strip">
  <figure data-slot="REAL · the club by day" data-k="clip"><img src="img/his/day-room.webp" alt="The Boost Club lounge by day, with the red armchair, round tables and the glass entrance" loading="lazy"></figure>
  <figure data-slot="A shake on the counter" data-k="clip"><img src="img/wet/pistachio-dream.jpg" alt="A cold Pistachio Dream shake on the counter at Boost Club" loading="lazy" style="object-position:50% 45%"></figure>
</section>

<section class="sec gut"><div class="wrap vs-ig">
  <div class="vs-addr">
    <span class="k-label">Contact information</span>
    <h2 class="k-h" data-k="lines">Strada Sevastopol 24 <span class="it">Sector 1, Bucharest.</span></h2>
    <div class="vs-links">
      <a class="vs-l" href="tel:+40726205752"><span>Phone</span><b>+40 726 205 752</b><i aria-hidden="true">↗</i></a>
      <a class="vs-l" href="{WA}" target="_blank" rel="noopener"><span>WhatsApp</span><b>Message us</b><i aria-hidden="true">↗</i></a>
      <a class="vs-l" href="mailto:gneshto@gmail.com"><span>Email</span><b>gneshto@gmail.com</b><i aria-hidden="true">↗</i></a>
    </div>
    <div class="row"><a class="btn btn-bottle" href="{MAPS}" target="_blank" rel="noopener">Open directions <span class="ar">→</span></a></div>
  </div>
  <aside class="vs-hours">
    <span class="k-label">Hours</span>
    <div class="vs-hr" data-days="1,2,3,4,5"><span>Monday – Friday</span><b>07:00 – 20:00/21:00</b></div>
    <div class="vs-hr" data-days="6"><span>Saturday</span><b>Closed</b></div>
    <div class="vs-hr" data-days="0"><span>Sunday</span><b>10:00 – 18:00</b></div>
    <p>Walk-ins welcome during business hours. To guarantee your slot, book online or on WhatsApp.</p>
    <p class="vs-rv">5.0 / 5 · 202 Google reviews · Snapshot from 6 November 2026</p>
  </aside>
</div></section>

<section class="sec on-dark gut"><div class="wrap">
  <div class="k-head"><div><span class="k-label">Directions</span><h2 class="k-h" data-k="lines">From Piața Victoriei <span class="it">to Boost Club.</span></h2></div></div>
  <div class="vs-route">
    <div class="vs-stop"><span class="vs-dot m" aria-hidden="true">M</span><b>Piața Victoriei · M1 / M2</b></div>
    <div class="vs-line" aria-hidden="true"><i></i></div>
    <div class="vs-stop"><span class="vs-dot b">{_LEAF}</span><b>Boost Club</b><small>Strada Sevastopol 24</small></div>
    <span class="vs-chip">{_WALK}<span>On foot from Piața Victoriei</span></span>
  </div>
  <div class="vs-ways" data-k="rise">
    <div class="vs-way"><span class="vs-ic" aria-hidden="true">M</span><div><span class="vs-k">Metro</span><h3>Piața Victoriei · M1 / M2</h3><p>Piața Victoriei metro station is served by lines M1 and M2. Open walking directions in Google Maps.</p></div></div>
    <div class="vs-way"><span class="vs-ic">{_CAR}</span><div><span class="vs-k">Car</span><h3>By car</h3><p>Enter Strada Sevastopol 24, Sector 1, Bucharest in your navigation app. Check parking restrictions and availability when you arrive.</p></div></div>
    <a class="btn btn-brass" href="{MAPS}" target="_blank" rel="noopener">Open directions <span class="ar">→</span></a>
  </div>
</div></section>

<section class="sec oat gut vs-cta"><div class="wrap k-split">
  <div class="k-media" data-k="clip" data-slot="REAL · Gabriel welcoming you at the door"><img src="img/his/gabi-welcome.jpg" alt="Gabriel holding the door open and waving guests into Boost Club" loading="lazy" style="object-position:45% 40%"><span class="k-cap">The entrance</span></div>
  <div class="k-txt"><h2 class="k-h" data-k="lines">You can also come without <span class="it">an appointment.</span></h2><p class="k-lead">If you're in the area and the door is open, come in any time during business hours. If you want to be sure Gabriel is available for you, book online or on WhatsApp.</p><div class="row"><a class="btn btn-bottle" href="#" data-reserve>Book free consultation <span class="ar">→</span></a><a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener">Message on WhatsApp</a></div></div>
</div></section>'''

page("visit.html", "Visit", "", _VS_BODY, css=_VS_CSS, js=_VS_JS, gsapjs=_VS_GSAP, light=False)


# ======================================================================================
# 404
# ======================================================================================
_P4_CSS = r"""
.p4{min-height:100svh}
.p4 .wrap{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:clamp(24px,4vw,64px)}
.p4-num{order:2;display:block;font-family:var(--loud);font-weight:400;font-size:clamp(150px,26vw,420px);line-height:.78;letter-spacing:.01em;color:transparent;-webkit-text-stroke:1.5px rgba(217,178,106,.75)}
@media (max-width:900px){.p4 .wrap{grid-template-columns:minmax(0,1fr)}.p4-num{order:0;font-size:clamp(130px,42vw,260px)}}
.p4 .h-xl{max-width:12ch}
.p4 .h-xl .it{color:var(--brass)}
.p4 .k-lead{margin-top:24px}
.p4 .btn-ghost{color:var(--cream)}
"""
_P4_BODY = '''<section class="k-band soft p4"><img src="img/his/full-room.webp" alt="" aria-hidden="true"><div class="wrap gut">
  <span class="p4-num">404</span>
  <div><h1 class="h-xl">This page is <span class="it">not here.</span></h1>
  <p class="k-lead">The club is. Strada Sevastopol 24, in central Bucharest.</p>
  <div class="row"><a class="btn btn-brass" href="index.html">Back to Boost Club <span class="ar">→</span></a><a class="btn btn-ghost" href="free-scan.html">Free consultation</a></div></div>
</div></section>'''
_P4_GSAP = "  gsap.from('.p4-num',{yPercent:20,opacity:0,duration:1.4,ease:'power4.out'});gsap.from('.p4 .h-xl,.p4 .k-lead,.p4 .row',{y:30,opacity:0,duration:1,stagger:.08,ease:'power3.out',delay:.2});"

def _p4_write():
    _place_page_orig("404.html", "Page not found", "", _P4_BODY, css=_P4_CSS, gsapjs=_P4_GSAP, light=False, cfg=' data-norbar="1"')

# build.py writes its own 404.html AFTER the page modules run. So that this design wins without
# editing build.py, route any later page("404.html", ...) call to the version above. Remove this
# wrapper once build.py's 404 line moves above the module loop (or is deleted).
_place_page_orig = page
def page(fn, *a, **k):
    if fn == "404.html":
        return _p4_write()
    return _place_page_orig(fn, *a, **k)

_p4_write()
