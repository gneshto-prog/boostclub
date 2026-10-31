# Community pages: Bring a friend (overrides build.py's version). Runs inside build.py's globals.
# Boost Fit lives in pages_c_boostfit.py (its own black and green identity). Copy is build.py's English, word for word.
# ---------------------------------------------------------------- BRING A FRIEND
_BA_STEPS = [
    ("1", "Bring a new person to a Wellness Test", "Come together with a friend (a new person who has never done a Wellness Test at Boost Club) and you will receive your breakfast for free!", "Your breakfast on us!", "#E7C548", "#13201B", "img/real/friends-selfie.jpg", "Gabriel with two friends at Boost Club", "50% 30%", "REAL · you and the friend you bring"),
    ("2", "They buy a 10-day club pass", "If the person you bring purchases a 10-day club pass, you will receive a 3-day breakfast pass as our gift!", "3-day breakfast pass for you!", "#F2707A", "#13201B", "img/shot-berry.jpg", "", "50% 45%", "REAL · breakfast at the club"),
    ("3", "They buy a 30-day pass or a home program", "If the person you bring purchases a 30-day club pass or a home program, you will receive a 7-day breakfast pass as our gift!", "7-day breakfast pass for you!", "#2F5BD3", "#FFF8EE", "img/his/card-appreciated.webp", "", "50% 88%", "REAL · thank-you card at the club"),
]

def _ba_step(n, h, p, g, bg, ink, img, alt, pos, slot):
    return (f'<li class="ba-card" style="--c:{bg};--ci:{ink}"><div class="ba-ph" data-slot="{slot}"><img src="{img}" alt="{alt}" loading="lazy" style="object-position:{pos}"><span class="ba-n" aria-hidden="true">{n}</span></div>'
            f'<div class="ba-tx"><h3>{h}</h3><p>{p}</p></div><div class="ba-gift"><b>{g}</b></div></li>')

_ba_body = f'''
<section class="ba-hero gut"><div class="wrap ba-hg">
  <div class="ba-htx">
    <span class="eyebrow">Boost Ambassador Program</span>
    <h1 class="h-xl">Bring a friend. <span class="it">Share good health!</span></h1>
    <p class="lead sub">Wellness Test · Nutrition · Community · Results</p>
    <div class="row" style="margin-top:32px"><a class="btn btn-bottle" href="#" data-reserve>Book the Wellness Test <span class="ar">→</span></a><a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener">Message us on WhatsApp</a></div>
  </div>
  <div class="ba-hph">
    <div class="frame ba-hframe" data-slot="REAL · friends under the sign"><img src="img/real/sign-handshake.jpg" alt="Two friends shaking hands under the Boost Club sign" style="object-position:50% 40%" fetchpriority="high"></div>
    <div class="ba-seal" aria-hidden="true"><span>Your breakfast on us!</span></div>
  </div>
</div></section>

<section class="sec on-dark gut ba-how">
  <div class="wrap">
    <div class="k-head"><div><span class="k-label">How it works</span><h2 class="k-h" data-k="lines">Healthier people, <span class="it">happier days.</span></h2></div></div>
    <ol class="ba-cards" data-k="rise">{"".join(_ba_step(*s) for s in _BA_STEPS)}</ol>
  </div>
</section>

<div class="ba-strip" data-k="rise">
  <div data-slot="REAL · friends around a table at the club"><img src="img/real/table-four.jpg" alt="" loading="lazy" style="object-position:50% 45%"></div>
  <div data-slot="REAL · a shake at the club"><img src="img/real/shake-in-hand.jpg" alt="" loading="lazy" style="object-position:50% 50%"></div>
  <div data-slot="REAL · two friends under the sign"><img src="img/real/club-sign-duo.jpg" alt="" loading="lazy" style="object-position:40% 50%"></div>
</div>

<section class="sec oat gut ba-lad">
  <div class="wrap ba-ladg">
    <div>
      <span class="k-label">Ambassador ladder</span>
      <h2 class="k-h" data-k="lines">Climb the <span class="it">ladder.</span></h2>
      <div class="ba-tiers">
        <div class="ba-tier"><span class="ba-big" aria-hidden="true">2</span><div><span class="ba-k">2 clients</span><h3>Ambassador</h3><p>2 new clients in the club.</p></div></div>
        <div class="ba-tier vip"><span class="ba-big" aria-hidden="true">4</span><div><span class="ba-k">4 in a month</span><h3>VIP Ambassador · one free month</h3><p>4 friends who become clients in one month.</p></div></div>
      </div>
      <p class="small muted ba-fine">Only purchased passes and home programs count; a Wellness Test on its own does not. Free days stack, with at most one free month per calendar month; the surplus carries over to your next pass.</p>
    </div>
    <figure class="ba-board">
      <div class="ba-poster" data-slot="REAL · the Boost Ambassador board in the club"><img src="img/his/ambassador-board.webp" data-ro="img/his/ambassador-board-ro.webp" alt="The Boost Club Ambassador board: Ambassadors of the month, with photo frames" loading="lazy"></div>
      <figcaption>Ambassadors of the month go up on the Boost Ambassador board in the club.</figcaption>
    </figure>
  </div>
</section>

<section class="ba-end gut"><div class="wrap ba-endg">
  <div class="ba-circ" data-slot="REAL · two hands together under the sign"><img src="img/real/sign-handshake-close.jpg" alt="" loading="lazy"></div>
  <h2 class="h-xl" data-k="lines">Together for a healthier <span class="it">tomorrow!</span></h2>
  <p class="lead">Good health spreads!</p>
  <div class="row"><a class="btn btn-bottle" href="#" data-reserve>Book the Wellness Test <span class="ar">→</span></a></div>
  <p class="ba-partner"><a class="k-link" href="https://boostclub.ro/business" target="_blank" rel="noopener">Already bringing friends and thinking about an extra income? See the partner program →</a></p>
</div></section>
'''

_ba_css = r"""
.ba-hero{padding-top:clamp(110px,12vw,150px);padding-bottom:clamp(64px,7vw,110px)}
.ba-hg{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:clamp(32px,6vw,100px);align-items:center}
.ba-hero .h-xl{max-width:11ch}
.ba-hero .sub{margin-top:28px;font-weight:500;letter-spacing:.01em;color:var(--stone)}
.ba-hph{position:relative}
.ba-hframe{aspect-ratio:4/5;max-height:78vh;margin-left:auto}
.ba-hframe img{width:100%;height:100%;object-fit:cover}
.ba-seal{position:absolute;left:clamp(-56px,-4vw,-20px);bottom:clamp(28px,5vw,64px);width:clamp(132px,13vw,184px);aspect-ratio:1;border-radius:50%;background:#E7C548;color:#13201B;display:grid;place-items:center;text-align:center;padding:18px;transform:rotate(-9deg);box-shadow:0 22px 44px -18px rgba(11,43,34,.45)}
.ba-seal::before{content:'';position:absolute;inset:7px;border-radius:50%;border:1.5px dashed rgba(19,32,27,.45)}
.ba-seal span{font-family:var(--accent);font-style:italic;font-weight:600;font-size:clamp(19px,1.75vw,25px);line-height:1.02}
@media (max-width:900px){.ba-hg{grid-template-columns:minmax(0,1fr)}.ba-hframe{max-height:none;aspect-ratio:5/4}}@media (max-width:600px){.ba-hframe{aspect-ratio:4/5}}@media (max-width:900px){.ba-seal{left:auto;right:14px;bottom:-26px}}

/* how it works: three cards, the gift grows */
.ba-how .k-head{margin-bottom:clamp(36px,4vw,60px)}
.ba-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;counter-reset:ba}
.ba-card{display:flex;flex-direction:column;border-radius:8px;overflow:hidden;background:var(--cream);color:var(--ink)}
.ba-ph{position:relative;aspect-ratio:5/4;overflow:hidden;background:var(--c)}
.ba-ph img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
.ba-card:hover .ba-ph img{transform:scale(1.04)}
.ba-n{position:absolute;left:18px;top:14px;font-family:var(--loud);font-size:clamp(64px,6vw,92px);line-height:1;color:#fff;text-shadow:0 2px 24px rgba(7,30,23,.35)}
.ba-tx{padding:clamp(22px,2.2vw,30px) clamp(22px,2.2vw,30px) 8px}
.ba-tx h3{font-size:clamp(22px,1.9vw,28px);letter-spacing:-.035em;line-height:1.05}
.ba-tx p{margin:12px 0 0;font-size:15.5px;line-height:1.55;color:var(--stone)}
.ba-gift{position:relative;margin-top:auto;padding:26px clamp(22px,2.2vw,30px) 24px;background:var(--c);color:var(--ci)}
.ba-gift::before{content:'';position:absolute;left:0;right:0;top:-1px;height:10px;background:radial-gradient(circle at 8px 0,var(--cream) 6px,transparent 6.5px) 0 0/16px 10px repeat-x}
.ba-gift b{display:block;font-family:var(--accent);font-style:italic;font-weight:600;font-size:clamp(25px,2.2vw,32px);line-height:1.05}
.ba-card:nth-child(1) .ba-gift{min-height:96px}.ba-card:nth-child(2) .ba-gift{min-height:120px}.ba-card:nth-child(3) .ba-gift{min-height:144px}
.ba-card:nth-child(1) .ba-tx{min-height:0}
@media (max-width:900px){.ba-cards{grid-template-columns:minmax(0,1fr);gap:18px}.ba-ph{aspect-ratio:16/10}.ba-card .ba-gift{min-height:0!important}}
@media (min-width:600px) and (max-width:900px){.ba-card{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);grid-template-rows:1fr auto}.ba-ph{grid-row:1/3;aspect-ratio:auto;min-height:300px}.ba-gift::before{display:none}}

/* edge-to-edge photo strip (Blank Street) */
.ba-strip{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1fr);gap:4px;background:var(--oat)}
.ba-strip>div{position:relative;overflow:hidden;height:clamp(300px,34vw,540px)}
.ba-strip img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
.ba-strip>div:hover img{transform:scale(1.04)}
@media (max-width:700px){.ba-strip{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.ba-strip>div:first-child{grid-column:1/3;height:62vw}.ba-strip>div{height:68vw}}

/* ladder */
.ba-ladg{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(36px,6vw,100px);align-items:center}
.ba-tiers{margin-top:clamp(36px,4vw,52px);display:grid;gap:12px}
.ba-tier{display:grid;grid-template-columns:clamp(88px,9vw,120px) minmax(0,1fr);gap:clamp(18px,2vw,28px);align-items:center;padding:22px 26px 22px 18px;border-radius:8px;background:var(--bone)}
.ba-tier.vip{background:var(--bottle);color:var(--cream);margin-left:clamp(0px,4vw,56px)}
.ba-big{font-family:var(--loud);font-size:clamp(88px,8vw,120px);line-height:.8;text-align:center;color:var(--leaf)}
.ba-tier.vip .ba-big{color:var(--brass)}
.ba-k{display:block;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass-ink)}
.ba-tier.vip .ba-k{color:var(--brass)}
.ba-tier h3{margin-top:8px;font-size:clamp(22px,2vw,30px);letter-spacing:-.035em;line-height:1.05}
.ba-tier p{margin:8px 0 0;font-size:15px;opacity:.78}
.ba-fine{margin:26px 0 0;max-width:62ch}
.ba-board{margin:0}
.ba-board .k-slot{aspect-ratio:1;border-radius:8px}
.ba-board figcaption{margin-top:16px;font-family:var(--accent);font-style:italic;font-size:clamp(20px,1.7vw,24px);line-height:1.25;max-width:32ch}
@media (max-width:900px){.ba-ladg{grid-template-columns:minmax(0,1fr)}.ba-board .k-slot{aspect-ratio:16/9;min-height:0}.ba-tier.vip{margin-left:0}}
@media (max-width:520px){.ba-tier{grid-template-columns:64px minmax(0,1fr);padding:18px 18px 18px 12px}.ba-big{font-size:72px}}

/* closing: one warm sentence on the club's yellow */
.ba-end{background:#E7C548;color:#13201B;padding-block:clamp(90px,11vw,170px);text-align:center}
.ba-endg{display:flex;flex-direction:column;align-items:center}
.ba-circ{width:clamp(170px,17vw,250px);aspect-ratio:1;border-radius:50%;overflow:hidden;margin-bottom:clamp(30px,3vw,44px);box-shadow:0 0 0 8px rgba(19,32,27,.08)}
.ba-circ img{width:100%;height:100%;object-fit:cover;object-position:62% 74%;transform:scale(1.7);transform-origin:62% 74%}
.ba-end .h-xl{max-width:14ch;margin:0 auto}
.ba-end .h-xl .it{color:var(--bottle)}
.ba-end .lead{margin:22px auto 0;font-family:var(--accent);font-style:italic;font-size:clamp(24px,2.2vw,32px)}
.ba-end .row{margin-top:30px;justify-content:center}
.ba-partner{margin:40px auto 0;max-width:56ch;font-size:15px;line-height:1.6}
.ba-partner .k-link{font-weight:600}
"""

_ba_gsap = """  gsap.from('.ba-hframe',{clipPath:'inset(10% 6% 0% 6% round 6px)',duration:1.4,ease:'power3.out'});
  gsap.from('.ba-hframe img',{scale:1.15,duration:1.8,ease:'power3.out'});
  gsap.from('.ba-seal',{scale:.4,rotate:-40,opacity:0,duration:1,ease:'back.out(1.7)',delay:.7});
  gsap.to('.ba-seal',{rotate:6,ease:'none',scrollTrigger:{trigger:'.ba-hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.from('.ba-tier',{x:-40,opacity:0,duration:.9,ease:'power3.out',stagger:.14,scrollTrigger:{trigger:'.ba-tiers',start:'top 82%'}});
  gsap.from('.ba-circ',{scale:.6,opacity:0,duration:1.1,ease:'back.out(1.5)',scrollTrigger:{trigger:'.ba-end',start:'top 75%'}});"""

page("bring-a-friend.html", "Bring a friend", "", _ba_body, css=_ba_css+'.ba-poster{position:relative;padding:clamp(14px,1.6vw,22px);background:#1a1410;border-radius:4px;box-shadow:0 2px 0 rgba(255,255,255,.06) inset,0 30px 60px rgba(14,20,18,.28),0 8px 18px rgba(14,20,18,.18);transform:rotate(-1.2deg);transition:transform .6s var(--ease)}.ba-poster img{display:block;width:100%;height:auto;border-radius:1px}.ba-poster::after{content:"";position:absolute;inset:clamp(14px,1.6vw,22px);background:linear-gradient(120deg,rgba(255,255,255,.14),rgba(255,255,255,0) 35%);pointer-events:none}@media (hover:hover){.ba-poster:hover{transform:rotate(0)}}', js="  if(document.documentElement.lang==='ro'){ document.querySelectorAll('img[data-ro]').forEach(function(i){ i.src=i.src.replace(/ambassador-board\\.webp/,'ambassador-board-ro.webp'); }); }", gsapjs=_ba_gsap)
