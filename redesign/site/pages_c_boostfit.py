# Boost Fit: the training team's own page, in its own world (Gabi's 3 Oct brand: BLACK #0A0A0A / WHITE / CLUB GREEN
# #0D5645, Archivo Black, three chevrons slanted 12°). Structure and copy are the live boostclub.ro/boostfit page; photos
# are the real 25 Oct session set (the live page's v2 set was generated). No Boost Club nav, footer or reserve bar here:
# Boost Fit has its own bar, footer and phone CTA. Runs inside build.py's globals.

_BFW = "https://wa.me/40726205752?text=Hi%21%20I%27d%20like%20to%20join%20the%20Boost%20Fit%20team."
_BF_WAICO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.2 5.2 0 0 0 3.1.6 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>'
_BF_JOIN = f'<a class="bft-btn bft-g" href="{_BFW}" target="_blank" rel="noopener">{_BF_WAICO}<span>Join the team</span></a>'
_BF_CHEV = '<svg class="bft-chev" viewBox="0 0 120 100" aria-hidden="true"><g transform="skewX(-12)"><polygon points="20,0 44,0 74,50 44,100 20,100 50,50" fill="currentColor"/><polygon points="53,0 77,0 107,50 77,100 53,100 83,50" fill="currentColor" opacity=".55"/></g></svg>'
# the hero wordmark: same geometry as bf/boostfit-logo.svg, split into groups so it can assemble on load
_BF_WMHERO = open(os.path.join(D, "bf", "wmhero.svg"), encoding="utf-8").read()


def _bf_topo():
    import math as m
    paths = []
    for cx, cy, n, r0, st, ph in ((300, 150, 9, 18, 26, 0.0), (40, 430, 6, 30, 30, 1.7)):
        for i in range(n):
            r = r0 + i * st
            pts = []
            for k in range(73):
                a = k / 72 * 2 * m.pi
                w = 1 + .16 * m.sin(3 * a + ph + i * .35) + .08 * m.sin(5 * a - i * .5 + ph) + .05 * m.cos(2 * a + i)
                pts.append((cx + r * w * 1.25 * m.cos(a), cy + r * w * m.sin(a)))
            paths.append('<path d="M' + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + 'Z"/>')
    return ('<svg class="bft-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
            '<g fill="none" stroke="rgba(79,179,138,.32)" stroke-width="1.2">' + "".join(paths) + '</g>'
            '<path d="M64 260 C 110 230, 120 180, 180 170 S 250 130, 236 100 S 280 70, 300 80" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 10"/>'
            '<circle cx="64" cy="260" r="7" fill="#FFFFFF"/><path d="M300 80 v-46 l30 12 -30 12" fill="#4FB38A" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/></svg>')


def _bf_ring():
    import math as m
    t = []
    for k in range(60):
        a = k / 60 * 2 * m.pi - m.pi / 2
        r1, r2 = (88, 112) if k % 5 == 0 else (98, 112)
        t.append(f'<line x1="{200 + r1 * m.cos(a):.1f}" y1="{150 + r1 * m.sin(a):.1f}" x2="{200 + r2 * m.cos(a):.1f}" y2="{150 + r2 * m.sin(a):.1f}"/>')
    return ('<svg class="bft-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
            '<g stroke="rgba(255,255,255,.4)" stroke-width="3" stroke-linecap="round">' + "".join(t) + '</g>'
            '<circle cx="200" cy="150" r="72" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="18"/>'
            '<circle class="bft-arc" cx="200" cy="150" r="72" fill="none" stroke="#4FB38A" stroke-width="18" stroke-dasharray="151 453" transform="rotate(-90 200 150)"/>'
            '<circle cx="200" cy="150" r="8" fill="#FFFFFF"/></svg>')


_bf_ranks = "".join(f'<li style="--i:{i}"><img src="bf/ranks/{f}" alt="" loading="lazy" width="120" height="120"><b>{n}</b><span>{d}</span></li>'
                    for i, (f, n, d) in enumerate([("boostfit-rank-start.svg", "START", "first session"), ("boostfit-rank-i.svg", "I", "3 sessions"),
                                                   ("boostfit-rank-ii.svg", "II", "6 sessions"), ("boostfit-rank-iii.svg", "III", "10 sessions"),
                                                   ("boostfit-rank-star.svg", "III ★", "finish a monthly event")]))

_bf_faq = "".join(f'<details><summary>{q}</summary><div class="a">{a}</div></details>' for q, a in [
    ("What do I need?", "Trainers, sportswear, water. A jacket for the walk to the club."),
    ("What if it rains?", "Light rain, we train. Heavy rain, we announce in the group by 07:15 what we do."),
    ("I'm not in shape, can I come?", "Yes. Every exercise has an easy version. Tell Gabriel at the start."),
    ("Do I have to be a Boost Club client?", "No. Anyone can come."),
    ("Can I bring kids or my dog?", "Kids from 14, with you. Dogs in the park yes, in the club no."),
    ("Do you film?", "Yes, we film for Instagram. If you don't want to be in it, tell us at the start."),
    ("What does it cost?", "The training is free. The entrance is the recovery nutrition at the club: 35 lei (protein shake, electrolyte drink, tea). 10-entrance card: 290 lei, valid at Boost Fit and at Boost Club."),
    ("Do I need to tell you I'm coming?", "Yes, reply in the WhatsApp group so we know how many we are."),
])

_bf_mq = "".join('<span>Park workout</span>' + _BF_CHEV + '<span>Runs</span>' + _BF_CHEV + '<span>Hikes</span>' + _BF_CHEV + '<span>Challenges</span>' + _BF_CHEV for _ in range(4))

_bf_body = f'''
<header class="bft-bar">
  <a href="boost-fit.html" class="bft-home" aria-label="Boost Fit"><img src="bf/boostfit-logo.svg" alt="Boost Fit" width="257" height="30"></a>
  <div class="bft-right">
    <a class="bft-club" href="index.html">Back to Boost Club</a>
    <nav class="bft-lang" aria-label="Language"></nav>
  </div>
</header>

<section class="bft-hero" id="top">
  <div class="bft-hph" aria-hidden="true" data-slot="REAL · Boost Fit, Sunday in Kiseleff"><img src="img/real/park-walk.jpg" alt="" fetchpriority="high"></div>
  <img class="bft-hsym" src="bf/boostfit-symbol.svg" alt="" aria-hidden="true">
  <div class="bft-hin">
    {_BF_WMHERO}
    <div class="bft-when"><span class="dot" aria-hidden="true"></span><span>Sundays · 09:00 · Bucharest</span></div>
    <h1 class="bft-d bft-h1"><span>Join</span> <span class="bft-blk"><span>the team.</span></span></h1>
    <p class="bft-tag">Park workouts, runs, hikes. Any level. <b>Then recovery at Boost Club.</b></p>
    <div class="bft-ctas">{_BF_JOIN}<a class="bft-btn bft-ghost" href="#how">How it works ↓</a></div>
    <p class="bft-dates"><span class="nx" id="bft-next"></span><a class="cal" href="https://boostclub.ro/boostfit/boostfit.ics">+ Add to calendar</a></p>
    <div class="bft-stats">
      <div><b class="bft-m">09:00</b><span>Sundays</span></div>
      <div><b class="bft-m">45<i>'</i></b><span>Minutes</span></div>
      <div><b class="bft-m">3</b><span>Levels</span></div>
      <div><b class="bft-d bft-kis">Kiseleff</b><span>First session</span></div>
    </div>
  </div>
</section>

<div class="bft-mq" aria-hidden="true"><div class="bft-mtr">{_bf_mq}</div></div>

<section class="bft-sec" id="what">
  <div class="bft-wrap">
    <div class="bft-head bft-rv"><div><p class="bft-eye">What we do</p><h2 class="bft-d">We train outside.</h2></div><p>The place changes from week to week.</p></div>
    <div class="bft-acts">
      <figure class="bft-act bft-rv bft-vid" data-slot="REAL · Boost Fit Session 01 video">
        <div class="bft-actm"><video muted loop playsinline preload="none" poster="video/boostfit-session01-poster.jpg" aria-hidden="true"><source src="video/boostfit-session01.mp4" type="video/mp4"></video></div>
        <figcaption><h3>Runs</h3><p>Group runs at the group's pace.</p></figcaption>
      </figure>
      <figure class="bft-act bft-rv" data-slot="REAL · park workout"><div class="bft-actm"><img src="img/real/park-trio.jpg" alt="Three members on the park path after a Sunday session" loading="lazy"></div><figcaption><h3>Park workout</h3><p>Bodyweight circuit, about 45 minutes, 3 levels.</p></figcaption></figure>
      <figure class="bft-act bft-rv" data-slot="REAL · hike photo goes here (designed card until then)"><div class="bft-actm bft-art-wrap">{_bf_topo()}</div><figcaption><h3>Hikes</h3><p>Trips out of the city, announced early in the group.</p></figcaption></figure>
      <figure class="bft-act bft-rv" data-slot="REAL · monthly challenge photo goes here (designed card until then)"><div class="bft-actm bft-art-wrap">{_bf_ring()}</div><figcaption><h3>Challenges</h3><p>Once a month, a harder event.</p></figcaption></figure>
    </div>
  </div>
</section>

<section class="bft-sec bft-night" id="how">
  <div class="bft-wrap">
    <div class="bft-head bft-rv"><div><p class="bft-eye">The plan</p><h2 class="bft-d">How it works.</h2></div><p>The training is free. You don't need to be fit.</p></div>
    <ol class="bft-tl">
      <li class="bft-rv"><span class="bft-t bft-m">01</span><div><figure class="bft-stopimg bft-wa" data-slot="REAL · the community: full room, blurred"><img src="img/his/full-room.webp" alt="" loading="lazy"><div class="bft-wabadge" aria-hidden="true"><span class="ic">{_BF_WAICO}</span><span class="t"><b>Boost Fit</b><i>WhatsApp group</i></span>{_BF_CHEV}</div></figure><h3>Join the WhatsApp group</h3><p>Every session is announced there.</p></div></li>
      <li class="bft-rv"><span class="bft-t bft-m">02</span><div><figure class="bft-stopimg" data-slot="REAL · on the move in the park"><img src="img/real/park-walk-2.jpg" alt="Two members walking a park path in Kiseleff" loading="lazy" style="object-position:50% 38%"></figure><h3>Meet at the announced spot</h3><p>About 45 minutes. Every exercise has 3 levels.</p></div></li>
      <li class="bft-rv"><span class="bft-t bft-m">03</span><div><figure class="bft-stopimg" data-slot="REAL · recovery at the club after the session"><img src="img/real/bf-recovery.jpg" alt="The team at Boost Club after the Sunday session" loading="lazy"></figure><h3>Recovery at Boost Club</h3><p>The nutrition lesson and the shakes, on Sevastopol 24.</p></div></li>
      <li class="bft-rv"><span class="bft-t bft-m">04</span><div><h3>Move up a rank</h3><p>Every session counts.</p></div></li>
    </ol>
  </div>
</section>

<section class="bft-sec bft-ent" id="entrance">
  <div class="bft-wrap bft-price">
    <div class="bft-rv">
      <p class="bft-eye">The entrance</p>
      <p class="bft-d bft-bigw">Recovery nutrition.</p>
      <p class="bft-lead2">The training is free. The entrance is what you get at the club after every session.</p>
      <ul class="bft-rules">
        <li>You have an active program at Boost Club: the entrance is included.</li>
        <li>You bring a friend who comes: your next entrance is free.</li>
      </ul>
    </div>
    <div class="bft-shelf bft-rv">
      <article class="bft-pk bft-pk1"><span class="bft-slash" aria-hidden="true"></span><img src="bf/h24-rebuild.png" alt="Herbalife H24 Rebuild Strength pouch" loading="lazy"><div class="bft-pkt"><div class="k">Recovery</div><h3>Protein shake</h3><p>H24 Rebuild Strength</p></div></article>
      <article class="bft-pk bft-pk2"><span class="bft-slash" aria-hidden="true"></span><div class="bft-cr7" aria-hidden="true"><span>CR7</span><b>Drive</b></div><div class="bft-pkt"><div class="k">Hydration</div><h3>CR7 Drive</h3><p>Carbohydrate and electrolyte drink</p></div></article>
      <article class="bft-pk bft-pk3"><span class="bft-slash" aria-hidden="true"></span><svg class="bft-steam" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="#4FB38A" stroke-width="5" stroke-linecap="round"><path d="M40 52c-8-10 8-16 0-28"/><path d="M60 52c-8-10 8-16 0-28"/><path d="M80 52c-8-10 8-16 0-28"/></g><path d="M22 62h76v10a28 28 0 0 1-28 28H50a28 28 0 0 1-28-28Z" fill="#fff"/><path d="M98 66h6a10 10 0 0 1 0 20h-8" fill="none" stroke="#fff" stroke-width="6"/></svg><div class="bft-pkt"><div class="k">Tea</div><h3>Tea</h3><p>Hot or cold, your choice.</p></div></article>
    </div>
  </div>
</section>

<section class="bft-sec" id="who">
  <div class="bft-wrap">
    <div class="bft-head bft-rv"><div><p class="bft-eye">Who it's for</p><h2 class="bft-d">Any level.</h2></div></div>
    <div class="bft-who">
      <figure class="bft-whoimg bft-rv" data-slot="REAL · the crew in Kiseleff"><img src="img/real/park-selfie.jpg" alt="Three members taking a selfie in Kiseleff Park" loading="lazy"></figure>
      <div class="bft-card bft-come bft-rv"><div class="k">Come if</div><ul>
        <li>You want to move but you don't like the gym.</li>
        <li>You already train and want people to train with on Sunday.</li>
        <li>You want to start and don't know how.</li>
      </ul>
      <div class="bft-lv" aria-hidden="true"><i></i><i></i><i></i><span>3 levels</span></div></div>
    </div>
  </div>
</section>

<section class="bft-sec bft-night" id="ranks">
  <div class="bft-wrap">
    <div class="bft-head bft-rv"><div><p class="bft-eye">Ranks</p><h2 class="bft-d">Show up, rank up.</h2></div><p>It never goes down.</p></div>
    <ol class="bft-ranks">{_bf_ranks}</ol>
  </div>
</section>

<section class="bft-sec" id="where">
  <div class="bft-wrap">
    <div class="bft-head bft-rv"><div><p class="bft-eye">Where</p><h2 class="bft-d">First session.</h2></div></div>
    <div class="bft-where bft-rv">
      <div class="bft-card"><div class="k bft-m">09:00</div><h3>Kiseleff Park</h3><p>The entrance from Piața Victoriei, at the start of Șoseaua Kiseleff. Metro Piața Victoriei.</p><a href="https://maps.google.com/?q=Parcul+Kiseleff+Bucuresti" target="_blank" rel="noopener">Open in Maps →</a></div>
      <div class="bft-walk bft-m" aria-hidden="true"><span>after</span>{_BF_CHEV}</div>
      <div class="bft-card"><div class="k bft-m">10:30</div><h3>Boost Club</h3><p>Strada Sevastopol 24, Sector 1.</p><a href="https://maps.google.com/?q=Strada+Sevastopol+24+Bucuresti" target="_blank" rel="noopener">Open in Maps →</a></div>
    </div>
  </div>
</section>

<section class="bft-sec bft-night" id="coach">
  <div class="bft-wrap bft-coach">
    <figure class="bft-cph bft-rv" data-slot="REAL · Gabriel training"><img src="img/his/bf-coach.jpg" alt="Gabriel Neshto training" loading="lazy"><span class="lb">Gabriel Neshto</span></figure>
    <div class="bft-rv">
      <p class="bft-eye">Coach</p>
      <h2 class="bft-d">Gabriel.</h2>
      <p>Founder of Boost Club. Fighter and runner. He opens the club at 07:00 during the week and trains with you on Sunday.</p>
      <a class="bft-btn bft-ghost" href="gabriel.html">About Gabriel →</a>
    </div>
  </div>
</section>

<section class="bft-zh" id="monthly">
  <div class="bft-wrap bft-zhg">
    <a class="bft-zhlogo bft-rv" href="https://boostclub.ro/zerohour/" target="_blank" rel="noopener"><img src="bf/zero-hour-logo-stacked.svg" alt="ZERO HOUR" loading="lazy" width="635" height="240"></a>
    <div class="bft-rv">
      <div class="bft-zhed bft-m">ZERO HOUR · 22 November · 04:00</div>
      <h2 class="bft-d">Once a month, ZERO HOUR.</h2>
      <p>2 hours of very hard physical challenge, then a lesson about perseverance and leadership.</p>
      <a class="bft-btn bft-zhb" href="https://boostclub.ro/zerohour/" target="_blank" rel="noopener">About ZERO HOUR →</a>
    </div>
  </div>
  <span class="bft-zhclock bft-m" aria-hidden="true">04:00</span>
</section>

<section class="bft-sec" id="faq">
  <div class="bft-wrap bft-faqg">
    <div class="bft-head bft-rv"><div><p class="bft-eye">FAQ</p><h2 class="bft-d">Before you come.</h2></div></div>
    <div class="bft-faq bft-rv">{_bf_faq}</div>
  </div>
</section>

<section class="bft-final" id="join">
  <div class="bft-fbg" aria-hidden="true" data-slot="REAL · the crew"><img src="img/real/park-selfie.jpg" alt="" loading="lazy"></div>
  <div class="bft-wrap bft-rv">
    <h2 class="bft-d"><span>Join</span> <span class="bft-blk"><span>the team.</span></span></h2>
    <p>Message us on WhatsApp and we add you to the group.</p>
    {_BF_JOIN}
  </div>
</section>

<footer class="bft-foot">
  <div class="bft-wrap">
    <div class="row"><img src="bf/boostfit-logo.svg" alt="Boost Fit" width="257" height="30"><div><a href="index.html">boostclub.ro</a> · <a href="tel:+40726205752">+40 726 205 752</a> · <span>Strada Sevastopol 24, Sector 1, Bucharest</span></div></div>
    <p class="disc">Boost Fit is Boost Club's training team. Independent Herbalife Distributor. Boost Club provides wellness guidance and educational consultations. Consultations do not diagnose, treat or replace medical care. You take part in the workout at your own responsibility; if you have a medical condition, talk to your doctor first. Results vary from person to person.</p>
    <div class="links"><a href="index.html">Back to Boost Club</a><a href="https://boostclub.ro/confidentialitate" target="_blank" rel="noopener">Privacy</a><a href="https://boostclub.ro/termeni" target="_blank" rel="noopener">Terms</a><a href="https://boostclub.ro/cookies" target="_blank" rel="noopener">Cookies</a></div>
    <p class="copy">© 2026 Boost Club. All rights reserved.</p>
  </div>
</footer>

<div class="bft-sticky" id="bft-sticky"><a class="bft-btn bft-g" href="{_BFW}" target="_blank" rel="noopener">{_BF_WAICO}<span>Join the team</span><span class="sep">·</span><span class="bft-m">09:00</span></a></div>
'''

_bf_css = r"""
@font-face{font-family:"Archivo Black";src:url(bf/fonts/archivo-black-latin.woff2) format("woff2");font-weight:400;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Archivo Black";src:url(bf/fonts/archivo-black-latin-ext.woff2) format("woff2");font-weight:400;font-display:swap;unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:Poppins;src:url(bf/fonts/poppins-400-latin.woff2) format("woff2");font-weight:400;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;src:url(bf/fonts/poppins-400-latin-ext.woff2) format("woff2");font-weight:400;font-display:swap;unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:Poppins;src:url(bf/fonts/poppins-500-latin.woff2) format("woff2");font-weight:500;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;src:url(bf/fonts/poppins-500-latin-ext.woff2) format("woff2");font-weight:500;font-display:swap;unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:Poppins;src:url(bf/fonts/poppins-600-latin.woff2) format("woff2");font-weight:600;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;src:url(bf/fonts/poppins-600-latin-ext.woff2) format("woff2");font-weight:600;font-display:swap;unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"IBM Plex Mono";src:url(bf/fonts/ibm-plex-mono-500-latin.woff2) format("woff2");font-weight:500;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"IBM Plex Mono";src:url(bf/fonts/ibm-plex-mono-500-latin-ext.woff2) format("woff2");font-weight:500;font-display:swap;unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}

/* ---------- Boost Fit world: black / white / club green ---------- */
body{--bf-night:#050505;--bf-deep:#0A0A0A;--bf-green:#0D5645;--bf-mid:#11705A;--bf-hi:#4FB38A;--bf-dim:#B5BDB9;--bf-rule:rgba(255,255,255,.14);--bf-card:rgba(255,255,255,.04);
  background:var(--bf-deep);color:#fff;font-family:Poppins,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.55}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.05;mix-blend-mode:screen;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
.k-curtain{background:var(--bf-deep)!important}.k-curtain img{content:url(bf/boostfit-logo.svg);width:min(62vw,420px)!important}
::selection{background:var(--bf-green);color:#fff}
.bft-d{font-family:"Archivo Black",Impact,sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:-.025em;line-height:.95}
.bft-m{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-weight:500;font-variant-numeric:tabular-nums}
.bft-blk{display:inline-block;background:var(--bf-green);color:#fff;padding:.02em .16em .04em .14em;margin:0 .02em;transform:skewX(-12deg)}
.bft-blk>span{display:inline-block;transform:skewX(12deg)}
.bft-eye{font-size:11px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--bf-hi);margin:0 0 14px;display:flex;align-items:center;gap:10px}
.bft-eye::before{content:"";width:22px;height:2px;background:var(--bf-hi);transform:skewX(-12deg)}
.bft-wrap{width:min(1180px,100% - 40px);margin-inline:auto}
.bft-sec{padding:clamp(76px,10vw,128px) 0;position:relative;background:var(--bf-deep)}
.bft-night{background:var(--bf-night)}
.bft-head{display:grid;gap:16px;margin-bottom:clamp(30px,4vw,48px)}
@media(min-width:860px){.bft-head{grid-template-columns:1.15fr 1fr;align-items:end;gap:48px}}
.bft-head h2{font-size:clamp(36px,6.4vw,84px);margin:0;color:#fff}
.bft-head h2::after{content:"";display:block;width:72px;height:10px;background:var(--bf-green);margin-top:18px;transform:skewX(-12deg)}
.bft-head>p{margin:0;color:var(--bf-dim);font-size:clamp(15px,1.5vw,18px);max-width:46ch}

/* buttons: the angled cut of the logo */
.bft-btn{display:inline-flex;align-items:center;gap:10px;padding:17px 32px;font-family:"Archivo Black",Impact,sans-serif;font-size:15px;letter-spacing:.02em;text-transform:uppercase;text-decoration:none;color:#fff;border:0;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);transition:background .2s,transform .2s,box-shadow .2s;white-space:nowrap}
.bft-btn svg{width:18px;height:18px;flex:none}
.bft-btn:active{transform:scale(.98)}
.bft-g{background:var(--bf-green)}.bft-g:hover{background:var(--bf-mid)}
.bft-ghost{background:rgba(255,255,255,.03);box-shadow:inset 0 0 0 2px rgba(255,255,255,.55)}.bft-ghost:hover{background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 2px #fff}
.bft-btn:focus-visible{outline:2px solid var(--bf-hi);outline-offset:4px}

/* top bar */
.bft-bar{position:fixed;inset:0 0 auto 0;z-index:50;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px clamp(16px,3vw,32px);padding-top:max(12px,env(safe-area-inset-top));background:rgba(10,10,10,.6);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.08);transition:background .3s}
.bft-bar.solid{background:rgba(5,5,5,.92)}
.bft-home img{height:24px;width:auto;display:block}
.bft-right{display:flex;align-items:center;gap:16px}
.bft-club{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--bf-dim);text-decoration:none;display:none}
.bft-club:hover{color:#fff}
@media(min-width:600px){.bft-club{display:inline}}
.bft-lang{display:flex;padding:3px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.bft-lang a,.bft-lang b{display:block;padding:6px 13px;font-family:"Archivo Black",sans-serif;font-weight:400;font-size:11px;letter-spacing:.1em;color:var(--bf-dim);text-decoration:none;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)}
.bft-lang a:hover{color:#fff}
.bft-lang b{background:var(--bf-green);color:#fff}

/* hero */
.bft-hero{position:relative;min-height:100svh;display:grid;place-items:center;text-align:center;padding:96px 20px 64px;overflow:hidden;background:radial-gradient(120% 70% at 50% 100%,rgba(13,86,69,.6) 0%,rgba(13,86,69,0) 60%),var(--bf-deep)}
.bft-hph{position:absolute;inset:0}
.bft-hph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 34%;transform:scale(1.06)}
.bft-hph::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.62) 0,rgba(10,10,10,.5) 38%,rgba(10,10,10,.78) 74%,var(--bf-deep) 100%),radial-gradient(90% 60% at 50% 100%,rgba(13,86,69,.45),transparent 70%)}
.bft-hsym{position:absolute;width:min(130vw,980px);left:-30%;bottom:-34%;opacity:.05;transform:rotate(-8deg);pointer-events:none}
.bft-hin{position:relative;z-index:2;max-width:1000px}
.wmhero{display:block;width:min(86vw,620px);height:auto;overflow:visible;margin:0 auto 26px}
@keyframes bfIn{from{transform:translateX(var(--dx));opacity:0}60%{opacity:1}to{transform:none;opacity:1}}
.wmhero .lb{--dx:-140px}.wmhero .lf{--dx:140px}.wmhero .lc{--dx:-260px}
.wmhero g.a{animation:bfIn .65s cubic-bezier(.2,.9,.25,1.08) both;animation-delay:calc(var(--d) * 1ms + 250ms)}
.bft-when{display:inline-flex;align-items:center;gap:12px;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);box-shadow:inset 0 0 0 1px rgba(79,179,138,.55);padding:9px 22px 9px 18px;background:rgba(4,30,23,.66);font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:clamp(12px,1.5vw,15px);letter-spacing:.18em;text-transform:uppercase;color:var(--bf-hi);margin-bottom:24px}
.bft-when .dot{width:8px;height:8px;border-radius:50%;background:var(--bf-hi);box-shadow:0 0 0 4px rgba(79,179,138,.2);animation:bfPulse 2.4s ease-in-out infinite}
@keyframes bfPulse{50%{box-shadow:0 0 0 9px rgba(79,179,138,0)}}
.bft-h1{font-size:clamp(46px,10vw,132px);margin:0;color:#fff}
.bft-h1>span:first-child{display:block}
.bft-tag{font-size:clamp(16px,1.8vw,21px);max-width:36ch;margin:24px auto 0;line-height:1.5;color:#fff}
.bft-tag b{font-weight:600;color:var(--bf-hi)}
.bft-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px}
.bft-proof{margin:22px 0 0;font-size:13px}
.bft-proof a{color:var(--bf-hi);text-decoration:none;font-weight:600}.bft-proof a:hover{text-decoration:underline}
.bft-dates{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;margin:14px 0 0;font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--bf-dim)}
.bft-dates .cal{color:var(--bf-hi);text-decoration:none}.bft-dates .cal:hover{text-decoration:underline}
.bft-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:36px auto 0;max-width:780px}
@media(min-width:640px){.bft-stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
.bft-stats>div{border:1px solid var(--bf-rule);border-top:3px solid var(--bf-green);padding:16px 10px;background:rgba(10,10,10,.5);backdrop-filter:blur(6px)}
.bft-stats b{display:block;font-size:clamp(26px,3.4vw,36px);line-height:1;color:#fff;font-weight:500}
.bft-stats b i{font-style:normal;color:var(--bf-hi)}
.bft-stats .bft-kis{font-size:clamp(17px,2.2vw,23px);line-height:1.5}
.bft-stats span{display:block;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--bf-dim);margin-top:8px}

/* green ticker */
.bft-mq{background:var(--bf-green);overflow:hidden;white-space:nowrap;padding:16px 0;transform:skewY(-1.2deg);margin:-10px 0;position:relative;z-index:3}
.bft-mtr{display:inline-flex;align-items:center;gap:28px;animation:bfMq 34s linear infinite;padding-right:28px}
.bft-mq span{font-family:"Archivo Black",sans-serif;text-transform:uppercase;font-size:clamp(22px,3vw,38px);color:#fff;letter-spacing:-.01em}
.bft-chev{width:clamp(26px,3vw,38px);height:auto;color:#fff;flex:none}
@keyframes bfMq{to{transform:translateX(-50%)}}

/* what we do */
.bft-acts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media(min-width:960px){.bft-acts{grid-template-columns:repeat(4,minmax(0,1fr))}}
.bft-act{margin:0;background:var(--bf-card);border:1px solid var(--bf-rule);border-left:4px solid var(--bf-green);display:flex;flex-direction:column;transition:border-color .3s,transform .3s}
.bft-act:hover{border-color:rgba(79,179,138,.5);border-left-color:var(--bf-hi);transform:translateY(-3px)}
.bft-actm{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--bf-night)}
.bft-actm img,.bft-actm video{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.bft-act:hover .bft-actm img{transform:scale(1.04)}
.bft-art-wrap{background:radial-gradient(80% 70% at 30% 20%,rgba(13,86,69,.55),transparent 70%),var(--bf-night)}
.bft-art{position:absolute;inset:0;width:100%;height:100%}
.bft-arc{transition:stroke-dasharray 1.4s cubic-bezier(.2,.8,.2,1)}
.bft-act.bft-seen .bft-arc{stroke-dasharray:302 453}
.bft-live{position:absolute;left:12px;top:12px;font-family:"Archivo Black",sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;background:var(--bf-green);color:#fff;padding:6px 12px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.bft-act figcaption{padding:16px 16px 20px}
.bft-act h3{margin:0 0 6px;font-family:"Archivo Black",sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(18px,1.7vw,22px);letter-spacing:-.01em}
.bft-act p{margin:0;color:var(--bf-dim);font-size:14.5px;line-height:1.5}

/* how it works: timeline */
.bft-tl{list-style:none;margin:0;padding:0;border-top:1px solid var(--bf-rule);position:relative}
.bft-tl li{display:grid;grid-template-columns:72px minmax(0,1fr);gap:16px;padding:28px 0;border-bottom:1px solid var(--bf-rule);align-items:start}
@media(min-width:760px){.bft-tl li{grid-template-columns:160px minmax(0,1fr);padding:36px 0}.bft-tl li>div:has(.bft-stopimg){display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:0 40px;align-items:center}.bft-tl li>div>.bft-stopimg{grid-row:span 2;margin:0}.bft-tl li>div>h3{align-self:end}.bft-tl li>div>p{align-self:start}}
.bft-t{font-size:clamp(28px,4vw,48px);color:var(--bf-hi);line-height:1}
.bft-tl h3{margin:0 0 8px;font-family:"Archivo Black",sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(20px,2.4vw,30px);letter-spacing:-.015em;line-height:1.05}
.bft-tl p{margin:0;color:var(--bf-dim);max-width:52ch}
.bft-stopimg{position:relative;margin:0 0 18px;max-width:620px;overflow:hidden;background:var(--bf-deep);clip-path:polygon(0 0,100% 0,100% calc(100% - 26px),calc(100% - 26px) 100%,0 100%)}
.bft-stopimg img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;object-position:50% 45%}
.bft-stopimg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(5,5,5,.35))}

/* entrance */
.bft-ent{background:linear-gradient(180deg,var(--bf-deep),#071A14)}
.bft-price{display:grid;gap:36px}
@media(min-width:900px){.bft-price{grid-template-columns:1fr 1fr;align-items:center;gap:64px}}
.bft-bigw{font-size:clamp(42px,6.4vw,86px);margin:0;color:#fff}
.bft-lead2{color:var(--bf-dim);font-size:clamp(16px,1.7vw,20px);margin:18px 0 0;max-width:40ch}
.bft-rules{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:10px}
.bft-rules li{padding-left:24px;position:relative;color:#fff}
.bft-rules li::before{content:"›";position:absolute;left:4px;top:-2px;color:var(--bf-hi);font-weight:700;font-size:20px}
.bft-cards{display:grid;gap:12px}
.bft-card{border:1px solid var(--bf-rule);padding:22px 24px;background:var(--bf-card);border-left:4px solid var(--bf-green);position:relative}
.bft-card .k{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--bf-hi);margin-bottom:8px;font-weight:600}
.bft-card h3{margin:0 0 6px;font-size:21px;font-weight:600;color:#fff;letter-spacing:-.01em}
.bft-card p{margin:0;color:var(--bf-dim);font-size:15px}
.bft-cards .bft-card:hover{border-left-color:var(--bf-hi)}

/* step 01: the group, blurred, with the WhatsApp badge */
.bft-wa img{filter:blur(3.5px) saturate(1.08);transform:scale(1.05)}
.bft-wa::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(135deg,rgba(13,86,69,.38),rgba(5,5,5,.18) 60%,rgba(5,5,5,.38))}
.bft-wa::after{display:none}
.bft-wabadge{position:absolute;left:50%;top:50%;z-index:2;transform:translate(-50%,-50%);display:flex;align-items:center;gap:14px;padding:14px 22px 14px 14px;background:rgba(5,5,5,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px rgba(79,179,138,.45),0 20px 40px rgba(0,0,0,.45);clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);white-space:nowrap}
.bft-wabadge .ic{display:grid;place-items:center;width:clamp(44px,5vw,58px);aspect-ratio:1;border-radius:50%;background:#25D366;color:#fff;box-shadow:0 0 0 6px rgba(37,211,102,.18);animation:bfPulseWa 2.6s ease-in-out infinite}
.bft-wabadge .ic svg{width:58%;height:58%}
@keyframes bfPulseWa{50%{box-shadow:0 0 0 12px rgba(37,211,102,0)}}
.bft-wabadge .t{display:grid;line-height:1.1}
.bft-wabadge b{font-family:"Archivo Black",sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(15px,1.6vw,20px);color:#fff}
.bft-wabadge i{font-style:normal;font-family:"IBM Plex Mono",monospace;font-size:clamp(11px,1.1vw,13px);letter-spacing:.12em;text-transform:uppercase;color:var(--bf-hi);margin-top:4px}
.bft-wabadge .bft-chev{width:clamp(26px,2.6vw,34px);color:var(--bf-hi);margin-left:4px}
@media(max-width:600px){.bft-wabadge{gap:10px;padding:9px 16px 9px 9px}.bft-wabadge .bft-chev{display:none}.bft-wabadge b{font-size:13px}.bft-wabadge i{font-size:9.5px;letter-spacing:.08em}.bft-wabadge .ic{width:36px}}
@media(prefers-reduced-motion:reduce){.bft-wabadge .ic{animation:none}}

/* entrance: H24 shelf */
.bft-shelf{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);grid-template-rows:auto auto;gap:12px}
.bft-pk{position:relative;overflow:hidden;min-width:0;background:radial-gradient(90% 80% at 50% 30%,rgba(13,86,69,.55),rgba(13,86,69,0) 70%),#0B0B0B;border:1px solid var(--bf-rule);min-height:240px;display:flex;flex-direction:column;justify-content:flex-end;transition:border-color .3s}
.bft-pk:hover{border-color:rgba(79,179,138,.55)}
.bft-pk1{grid-row:span 2;min-height:460px}
.bft-slash{position:absolute;left:-10%;top:22px;width:62%;height:14px;background:linear-gradient(90deg,var(--bf-green),var(--bf-hi));transform:skewX(-40deg);transform-origin:left}
.bft-pk1 img{position:absolute;left:50%;top:42%;height:min(62%,330px);width:auto;max-width:72%;transform:translate(-50%,-50%) rotate(-6deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.6)) drop-shadow(0 0 40px rgba(79,179,138,.22));animation:bfFloat 6s ease-in-out infinite}
@keyframes bfFloat{50%{transform:translate(-50%,-53%) rotate(-4deg)}}
.bft-pkt{position:relative;padding:18px 20px 20px;background:linear-gradient(0deg,rgba(5,5,5,.92),rgba(5,5,5,0))}
.bft-pkt .k{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--bf-hi);font-weight:600;margin-bottom:6px}
.bft-pkt h3{margin:0;font-family:"Archivo Black",sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(17px,1.6vw,21px);line-height:1.08}
.bft-pkt p{margin:6px 0 0;font-size:13px;line-height:1.45;color:var(--bf-dim)}
.bft-cr7{position:absolute;right:16px;top:30px;text-align:right;line-height:.82}
.bft-cr7 span{display:block;font-family:"Archivo Black",sans-serif;font-size:clamp(64px,7vw,96px);color:transparent;-webkit-text-stroke:1.6px rgba(255,255,255,.7);letter-spacing:-.02em}
.bft-cr7 b{display:block;font-family:"Archivo Black",sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(20px,2vw,26px);color:#fff;margin-top:6px}
.bft-steam{position:absolute;right:18px;top:30px;width:clamp(70px,7vw,96px);height:auto}
.bft-steam g path{animation:bfSteam 3s ease-in-out infinite}.bft-steam g path:nth-child(2){animation-delay:.4s}.bft-steam g path:nth-child(3){animation-delay:.8s}
@keyframes bfSteam{50%{opacity:.35;transform:translateY(-4px)}}
@media(max-width:560px){.bft-shelf{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.bft-pk.bft-pk1{grid-column:1/-1;grid-row:auto;min-height:400px}.bft-pk{min-height:230px}.bft-cr7{right:12px;top:26px}.bft-cr7 span{font-size:52px}.bft-cr7 b{font-size:18px}.bft-steam{width:64px}.bft-pkt{padding:14px 14px 16px}}
@media(prefers-reduced-motion:reduce){.bft-pk1 img,.bft-steam g path{animation:none}}

/* who */
.bft-who{display:grid;gap:16px}
@media(min-width:860px){.bft-who{grid-template-columns:1.1fr .9fr;gap:22px;align-items:stretch}}
.bft-whoimg{margin:0;overflow:hidden;background:var(--bf-night);clip-path:polygon(0 0,100% 0,100% calc(100% - 30px),calc(100% - 30px) 100%,0 100%)}
.bft-whoimg img{width:100%;height:100%;min-height:280px;aspect-ratio:4/3;object-fit:cover;object-position:50% 40%;display:block}
.bft-come{display:flex;flex-direction:column;justify-content:center;padding:clamp(24px,3vw,40px)}
.bft-come ul{margin:4px 0 0;padding:0;list-style:none;display:grid;gap:14px}
.bft-come li{font-size:clamp(17px,1.7vw,21px);line-height:1.35;font-weight:500;padding-left:30px;position:relative}
.bft-come li::before{content:"";position:absolute;left:0;top:.45em;width:14px;height:10px;background:var(--bf-hi);clip-path:polygon(0 0,45% 0,100% 50%,45% 100%,0 100%,55% 50%)}
.bft-lv{display:flex;align-items:flex-end;gap:6px;margin-top:28px;height:44px}
.bft-lv i{display:block;width:30px;background:var(--bf-green);transform:skewX(-12deg)}
.bft-lv i:nth-child(1){height:34%}.bft-lv i:nth-child(2){height:66%;background:var(--bf-mid)}.bft-lv i:nth-child(3){height:100%;background:var(--bf-hi)}
.bft-lv span{margin-left:12px;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--bf-dim);align-self:center}

/* ranks */
.bft-ranks{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;position:relative}
.bft-ranks::before{content:"";position:absolute;left:10%;right:10%;top:clamp(36px,5vw,60px);height:2px;background:linear-gradient(90deg,var(--bf-green),var(--bf-hi));opacity:.55}
.bft-ranks li{text-align:center;position:relative}
.bft-ranks img{width:100%;max-width:120px;height:auto;display:block;margin:0 auto 12px;position:relative;filter:drop-shadow(0 10px 24px rgba(13,86,69,.35))}
.bft-ranks b{display:block;font-family:"Archivo Black",sans-serif;font-weight:400;font-size:clamp(15px,1.6vw,20px)}
.bft-ranks span{display:block;font-size:13px;color:var(--bf-dim);margin-top:2px}
@media(max-width:700px){.bft-ranks{grid-template-columns:repeat(3,minmax(0,1fr));row-gap:28px}.bft-ranks::before{display:none}}

/* where */
.bft-where{display:grid;gap:12px}
@media(min-width:860px){.bft-where{grid-template-columns:1fr auto 1fr;align-items:stretch;gap:22px}}
.bft-where a{color:var(--bf-hi);text-decoration:none;font-weight:600;font-size:14px;display:inline-block;margin-top:12px}.bft-where a:hover{text-decoration:underline}
.bft-walk{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--bf-hi);font-size:12px;letter-spacing:.2em;text-transform:uppercase;padding:6px}
.bft-walk .bft-chev{width:30px;color:var(--bf-hi)}
@media(max-width:859px){.bft-walk .bft-chev{transform:rotate(90deg)}}

/* coach */
.bft-coach{display:grid;gap:28px;align-items:center}
@media(min-width:860px){.bft-coach{grid-template-columns:.85fr 1.15fr;gap:64px}}
.bft-cph{position:relative;margin:0;overflow:hidden;aspect-ratio:4/5;background:var(--bf-deep);clip-path:polygon(0 0,100% 0,100% calc(100% - 30px),calc(100% - 30px) 100%,0 100%)}
.bft-cph img{width:100%;height:100%;object-fit:cover;object-position:60% 30%;filter:grayscale(1) contrast(1.15) brightness(.92)}
.bft-cph::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,86,69,.22),rgba(4,30,23,.55));mix-blend-mode:multiply}
.bft-cph .lb{position:absolute;left:14px;bottom:14px;z-index:2;font-family:"Archivo Black",sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--bf-green);padding:8px 14px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.bft-coach h2{font-size:clamp(44px,7vw,96px);margin:0 0 18px}
.bft-coach p{color:var(--bf-dim);margin:0 0 26px;font-size:clamp(16px,1.6vw,19px);max-width:46ch}

/* ZERO HOUR: its own black + warning-yellow world, never club green */
.bft-zh{position:relative;overflow:hidden;background:#0B0B0B;padding:clamp(96px,12vw,150px) 0 clamp(80px,10vw,128px)}
.bft-zh::before{content:"";position:absolute;left:0;right:0;top:0;height:14px;background:repeating-linear-gradient(135deg,#F0C33C 0 20px,#0B0B0B 20px 40px);z-index:3}
.bft-zhclock{position:absolute;right:-2vw;bottom:-4vw;font-size:clamp(120px,22vw,340px);line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(240,195,60,.2);pointer-events:none;letter-spacing:-.04em}
.bft-zhg{display:grid;gap:30px;position:relative;z-index:2}
@media(min-width:900px){.bft-zhg{grid-template-columns:.8fr 1.2fr;align-items:center;gap:64px}}
.bft-zhlogo{display:block;width:min(80vw,460px)}.bft-zhlogo img{width:100%;height:auto;display:block}
.bft-zhed{font-size:clamp(12px,1.4vw,15px);letter-spacing:.14em;text-transform:uppercase;color:#F0C33C}
.bft-zh h2{font-size:clamp(36px,6.4vw,84px);margin:12px 0 18px;color:#fff}
.bft-zh p{color:rgba(255,255,255,.76);max-width:50ch;margin:0 0 28px;font-size:clamp(15px,1.6vw,18px)}
.bft-zhb{background:#F0C33C;color:#0B0B0B}.bft-zhb:hover{background:#fff}

/* faq */
.bft-faqg{display:grid;gap:8px}
@media(min-width:900px){.bft-faqg{grid-template-columns:.8fr 1.2fr;gap:64px;align-items:start}.bft-faqg .bft-head{grid-template-columns:1fr;position:sticky;top:110px}}
.bft-faq details{border-top:1px solid var(--bf-rule)}
.bft-faq details:last-child{border-bottom:1px solid var(--bf-rule)}
.bft-faq summary{list-style:none;cursor:pointer;padding:20px 0;display:flex;justify-content:space-between;gap:16px;align-items:center;font-weight:600;font-size:clamp(16px,1.7vw,19px)}
.bft-faq summary::-webkit-details-marker{display:none}
.bft-faq summary::after{content:"+";font-family:"IBM Plex Mono",monospace;color:var(--bf-hi);font-size:24px;line-height:1;flex:none;transition:transform .25s}
.bft-faq details[open] summary::after{transform:rotate(45deg)}
.bft-faq summary:hover{color:var(--bf-hi)}
.bft-faq .a{padding:0 0 20px;color:var(--bf-dim);max-width:60ch}

/* final */
.bft-final{position:relative;overflow:hidden;text-align:center;padding:clamp(110px,14vw,180px) 0;background:var(--bf-night)}
.bft-fbg{position:absolute;inset:0}
.bft-fbg img{width:100%;height:100%;object-fit:cover;object-position:50% 40%;filter:grayscale(1) contrast(1.1) blur(2px);opacity:.28;transform:scale(1.05)}
.bft-fbg::after{content:"";position:absolute;inset:0;background:radial-gradient(70% 70% at 50% 60%,rgba(13,86,69,.45),rgba(5,5,5,.92) 75%)}
.bft-final .bft-wrap{position:relative;z-index:2}
.bft-final h2{font-size:clamp(46px,10vw,140px);margin:0 0 22px}
.bft-final p{color:var(--bf-dim);margin:0 auto 30px;max-width:40ch;font-size:clamp(16px,1.6vw,19px)}

/* footer */
.bft-foot{border-top:1px solid var(--bf-rule);padding:40px 0 120px;color:var(--bf-dim);font-size:13px;background:var(--bf-deep)}
.bft-foot .row{display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;justify-content:space-between}
.bft-foot .row img{height:20px;width:auto}
.bft-foot a{color:#fff;text-decoration:underline;text-decoration-color:rgba(79,179,138,.7);text-underline-offset:3px}.bft-foot a:hover{text-decoration-color:#fff}
.bft-foot .disc{margin:22px 0 0;max-width:86ch;font-size:12px;line-height:1.65;color:rgba(181,189,185,.86)}
.bft-foot .links{display:flex;gap:18px;flex-wrap:wrap;margin-top:12px}
.bft-foot .copy{margin:14px 0 0}
@media(min-width:900px){.bft-foot{padding-bottom:48px}}

/* phone CTA */
.bft-sticky{position:fixed;left:0;right:0;bottom:0;z-index:45;padding:10px 12px;padding-bottom:max(10px,env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(5,5,5,0),rgba(5,5,5,.94) 45%);display:flex;justify-content:center;transform:translateY(120%);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.bft-sticky.show{transform:none}
.bft-sticky .bft-btn{width:min(520px,100%);justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.bft-sticky .sep{opacity:.6}
@media(min-width:900px){.bft-sticky{display:none}}

/* reveal: quick and once */
.bft-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1)}
.bft-rv.bft-seen{opacity:1;transform:none}
.bft-ranks li{opacity:0;transform:translateY(16px) scale(.94);transition:opacity .5s ease,transform .5s cubic-bezier(.2,.9,.25,1.2);transition-delay:calc(var(--i) * 90ms)}
.bft-ranks.bft-seen li{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.bft-rv,.bft-ranks li{opacity:1;transform:none;transition:none}.wmhero g.a,.bft-mtr,.bft-when .dot{animation:none}.bft-arc{transition:none}}
@media(max-width:480px){.bft-btn{padding:16px 24px;font-size:14px}.bft-ctas .bft-btn{width:100%;justify-content:center}}
"""

_bf_js = r"""
  // own language switch (same file in /ro/ and /ru/)
  (function(){ var L=document.documentElement.lang||'en', f='boost-fit.html', nav=document.querySelector('.bft-lang');
    nav.innerHTML=['ro','en','ru'].map(function(l){ var h=(L==='en'?'':'../')+(l==='en'?'':l+'/')+f; return l===L?'<b aria-current="true">'+l.toUpperCase()+'</b>':'<a href="'+h+'" hreflang="'+l+'">'+l.toUpperCase()+'</a>'; }).join('');
    // chevron favicon on this page
    document.querySelectorAll('link[rel~="icon"]').forEach(function(x){ x.remove(); }); var fi=document.createElement('link'); fi.rel='icon'; fi.href=(L==='en'?'':'../')+'bf/boostfit-favicon.svg'; document.head.appendChild(fi);
    // next Sundays (no session 15 + 22 Nov 2026)
    var off={'2026-11-15':1,'2026-11-22':1}, d=new Date(), out=[]; d.setHours(12,0,0,0); d.setDate(d.getDate()+((7-d.getDay())%7));
    if(new Date().getDay()===0&&new Date().getHours()>=11) d.setDate(d.getDate()+7);
    for(var i=0;out.length<3&&i<12;i++){ var k=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); if(!off[k]) out.push(new Date(d)); d.setDate(d.getDate()+7); }
    var fmt; try{ fmt=new Intl.DateTimeFormat(L==='en'?'en-GB':L,{day:'numeric',month:'short'}); }catch(e){ fmt={format:function(x){return x.toDateString()}}; }
    document.getElementById('bft-next').textContent='Next Sundays'+': '+out.map(function(x){ return fmt.format(x).replace('.',''); }).join(' · ');
  })();
  var bar=document.querySelector('.bft-bar'), st=document.getElementById('bft-sticky'), hero=document.getElementById('top'), fin=document.getElementById('join');
  function onS(){ bar.classList.toggle('solid',scrollY>40); var past=scrollY>hero.offsetHeight*.7, end=fin.getBoundingClientRect().top<innerHeight; st.classList.toggle('show',past&&!end); }
  addEventListener('scroll',onS,{passive:true}); onS();
  // reveals + the Session 01 video plays only while on screen
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('bft-seen'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('.bft-rv,.bft-ranks').forEach(function(x){ io.observe(x); });
    var vo=new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target.querySelector('video'); if(!v||RM) return; if(e.isIntersecting){ v.play().catch(function(){}); } else v.pause(); }); },{threshold:.35});
    document.querySelectorAll('.bft-vid').forEach(function(x){ vo.observe(x); });
  } else document.querySelectorAll('.bft-rv,.bft-ranks').forEach(function(x){ x.classList.add('bft-seen'); });"""

_bf_gsap = r"""
  gsap.fromTo('.bft-hph img',{scale:1.14},{scale:1.06,duration:2.4,ease:'power3.out'});
  gsap.to('.bft-hph img',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.bft-hero',start:'top top',end:'bottom top',scrub:true}});"""

DESC["boost-fit.html"] = "Boost Fit, Boost Club's training team: Sundays 09:00 in Kiseleff Park, then the nutrition lesson and shakes at the club. Any level. Join the team on WhatsApp."
page("boost-fit.html", "Boost Fit", "fit", _bf_body, css=_bf_css, js=_bf_js, gsapjs=_bf_gsap, light=False, dark=False,
     cfg=' data-nonav="1" data-nofoot="1" data-norbar="1"')
