# Visit flow: how-it-works.html + free-scan.html (override build.py's versions). Runs inside build.py's globals.
# Copy is build.py's English copy, re-arranged into Club Kit patterns. New short UI strings: i18n/new-visitflow.json.

# ---------------------------------------------------------------- shared bits
_VF_ICONS = {
    "water": '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3.5c5 6.2 8.5 11 8.5 15.5a8.5 8.5 0 0 1-17 0C7.5 14.5 11 9.7 16 3.5Z"/><path d="M11.5 19.5a4.6 4.6 0 0 0 4.5 4.3"/></svg>',
    "clothes": '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 5 8l-2.5 6.5 4.5 2 1.5-2.5V28h15V14l1.5 2.5 4.5-2L27 8l-7-3.5c-.6 2-2 3-4 3s-3.4-1-4-3Z"/></svg>',
    "time": '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="17" r="11.5"/><path d="M16 10v7l4.5 3"/><path d="M13 2.5h6"/></svg>',
}
_VF_WAQ = f'<a class="k-link fs-waq" href="{WA}" target="_blank" rel="noopener">Have a question? Message us on WhatsApp</a>'

# ================================================================= HOW IT WORKS
_HW_FIRST = '''<div class="hw-goal hw-first" data-slot="Your first step, visualised"><svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<defs><linearGradient id="hfl" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#2F8A63"/><stop offset="1" stop-color="#7CE0A8"/></linearGradient>
<radialGradient id="hfr" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7CE0A8" stop-opacity=".5"/><stop offset="1" stop-color="#7CE0A8" stop-opacity="0"/></radialGradient>
<filter id="hfb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>
<g stroke="#F4EFE6" stroke-opacity=".06"><line x1="0" y1="75" x2="600" y2="75"/><line x1="0" y1="150" x2="600" y2="150"/><line x1="0" y1="225" x2="600" y2="225"/><line x1="0" y1="300" x2="600" y2="300"/><line x1="0" y1="375" x2="600" y2="375"/><line x1="0" y1="450" x2="600" y2="450"/><line x1="0" y1="525" x2="600" y2="525"/><line x1="0" y1="600" x2="600" y2="600"/><line x1="0" y1="675" x2="600" y2="675"/><line x1="75" y1="0" x2="75" y2="750"/><line x1="150" y1="0" x2="150" y2="750"/><line x1="225" y1="0" x2="225" y2="750"/><line x1="300" y1="0" x2="300" y2="750"/><line x1="375" y1="0" x2="375" y2="750"/><line x1="450" y1="0" x2="450" y2="750"/><line x1="525" y1="0" x2="525" y2="750"/></g>
<path d="M96 640 C 170 600, 160 520, 230 500 S 300 430, 300 380 S 380 300, 360 260 S 430 210, 452 170" fill="none" stroke="#F4EFE6" stroke-opacity=".12" stroke-width="2" stroke-dasharray="3 9"/>
<g fill="#04140F" stroke="#F4EFE6" stroke-opacity=".22" stroke-width="2"><circle cx="300" cy="380" r="6"/><circle cx="360" cy="260" r="6"/><circle cx="452" cy="170" r="8"/></g>
<circle cx="230" cy="500" r="110" fill="url(#hfr)"/>
<path class="hf-glow" d="M96 640 C 170 600, 160 520, 230 500" fill="none" stroke="url(#hfl)" stroke-width="12" filter="url(#hfb)" stroke-linecap="round" pathLength="1"/>
<path class="hf-path" d="M96 640 C 170 600, 160 520, 230 500" fill="none" stroke="url(#hfl)" stroke-width="4" stroke-linecap="round" pathLength="1"/>
<circle cx="96" cy="640" r="9" fill="#F4EFE6"/>
<g class="hf-ms"><circle class="hf-ring" cx="230" cy="500" r="30" fill="none" stroke="#7CE0A8" stroke-opacity=".6"/><circle cx="230" cy="500" r="14" fill="#7CE0A8"/><path d="M223 500 l5 5 l10 -11" fill="none" stroke="#04140F" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>
<text x="96" y="684" class="hg-t" text-anchor="middle">Today</text>
<text x="230" y="448" class="hg-t hf-tg" text-anchor="middle">A clear first step</text>
</svg></div>'''
_HW_GOAL = '''<div class="hw-goal" data-slot="Your goal, visualised"><svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<defs><linearGradient id="hgl" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#2F8A63"/><stop offset=".6" stop-color="#7CE0A8"/><stop offset="1" stop-color="#E6C68A"/></linearGradient>
<radialGradient id="hgr" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E6C68A" stop-opacity=".55"/><stop offset="1" stop-color="#E6C68A" stop-opacity="0"/></radialGradient>
<filter id="hgb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>
<g class="hg-grid" stroke="#F4EFE6" stroke-opacity=".06"><line x1="0" y1="75" x2="600" y2="75"/><line x1="0" y1="150" x2="600" y2="150"/><line x1="0" y1="225" x2="600" y2="225"/><line x1="0" y1="300" x2="600" y2="300"/><line x1="0" y1="375" x2="600" y2="375"/><line x1="0" y1="450" x2="600" y2="450"/><line x1="0" y1="525" x2="600" y2="525"/><line x1="0" y1="600" x2="600" y2="600"/><line x1="0" y1="675" x2="600" y2="675"/><line x1="75" y1="0" x2="75" y2="750"/><line x1="150" y1="0" x2="150" y2="750"/><line x1="225" y1="0" x2="225" y2="750"/><line x1="300" y1="0" x2="300" y2="750"/><line x1="375" y1="0" x2="375" y2="750"/><line x1="450" y1="0" x2="450" y2="750"/><line x1="525" y1="0" x2="525" y2="750"/></g>
<circle cx="452" cy="170" r="120" fill="url(#hgr)"/>
<g class="hg-target" fill="none" stroke="#E6C68A"><circle cx="452" cy="170" r="70" stroke-opacity=".25"/><circle cx="452" cy="170" r="46" stroke-opacity=".45"/><circle cx="452" cy="170" r="22" stroke-opacity=".8"/><circle cx="452" cy="170" r="7" fill="#E6C68A"/></g>
<path class="hg-ghost" d="M96 640 C 170 600, 160 520, 230 500 S 300 430, 300 380 S 380 300, 360 260 S 430 210, 452 170" fill="none" stroke="#F4EFE6" stroke-opacity=".14" stroke-width="2" stroke-dasharray="3 9"/>
<path class="hg-glow" d="M96 640 C 170 600, 160 520, 230 500 S 300 430, 300 380 S 380 300, 360 260 S 430 210, 452 170" fill="none" stroke="url(#hgl)" stroke-width="10" filter="url(#hgb)" stroke-linecap="round" pathLength="1"/>
<path class="hg-path" d="M96 640 C 170 600, 160 520, 230 500 S 300 430, 300 380 S 380 300, 360 260 S 430 210, 452 170" fill="none" stroke="url(#hgl)" stroke-width="3.5" stroke-linecap="round" pathLength="1"/>
<g class="hg-ms"><circle cx="230" cy="500" r="7"/><circle cx="300" cy="380" r="7"/><circle cx="360" cy="260" r="7"/></g>
<circle class="hg-start" cx="96" cy="640" r="9" fill="#F4EFE6"/>
<text x="96" y="684" class="hg-t" text-anchor="middle">Today</text>
<text x="452" y="78" class="hg-t hg-tg" text-anchor="middle">Your goal</text>
</svg>
<ul class="hg-chips"><li>Healthy weight loss</li><li>Build muscle</li><li>More energy</li></ul></div>'''

_HW_STEPS = [
    ("01", "Brief conversation", "Gabriel welcomes you and we learn where you're starting and what you want to change. It takes 5 relaxed minutes.",
     '<img src="img/his/gabi-welcome.jpg" alt="Gabriel holding the door open and waving guests into Boost Club" data-slot="REAL · Gabriel welcoming you at the door" style="object-position:45% 40%">'),
    ("02", "Body analysis", "Gabriel explains each step of the body composition measurement. Contact the club before your visit for preparation instructions specific to the device.",
     '<img src="img/his/tanita.webp" alt="The body composition analyser at Boost Club" data-slot="REAL · the Tanita analyser at the club">'),
    ("03", "Results, explained", "You get the full report, translated into plain language, not just numbers on paper.",
     '<div class="hw-scanv" data-slot="REAL · results printout explained at the table"><div class="hw-sv" data-scan></div><span class="hw-scancap">Example scan · segmental</span></div>'),
    ("04", "Your goal", "We talk about what you want: weight loss, muscle or energy. No templates.",
     _HW_GOAL),
    ("05", "A clear first step", "You leave with one concrete, achievable next step.",
     _HW_FIRST),
]

_hw_pin = "".join(v for *_, v in _HW_STEPS)
_hw_lis = "".join(
    f'<li><span class="n">{n}</span><h3>{h}</h3><p>{p}</p><div class="k-mob{" hw-mobscan" if "hw-scanv" in v else ""}">{v.replace(" data-scan", " data-scan")}</div></li>'
    for n, h, p, v in _HW_STEPS)

_HW_TIPS = [
    ("water", "Water", "Normal hydration", "Drink water normally on the day of your visit. Avoid alcohol or excessive fluid intake a few hours before. These can affect the measurement."),
    ("clothes", "Clothes", "Comfortable clothes", "Come in light, comfortable clothing. No sportswear needed. The consultation doesn't involve training."),
    ("time", "Time", "Allow 40 minutes", "The session takes 25–30 minutes. Don't rush. The most valuable moment is the discussion after the measurement."),
]
_hw_tips = "".join(f'<div class="hw-tip">{_VF_ICONS[i]}<span class="hw-tk">{k}</span><h3>{h}</h3><p>{p}</p></div>' for i, k, h, p in _HW_TIPS)

_HW_LEARN = [
    ("Muscle mass", "How much muscle you have and how it's distributed"),
    ("Fat mass", "Body-fat percentage and whether it's in a healthy range"),
    ("Body water", "Your hydration level"),
    ("Visceral fat", "Fat around your organs, key to metabolic health"),
    ("Metabolic age", "How efficiently your metabolism works"),
    ("Metabolic rate", "Calories you burn at rest, the basis of any plan"),
]
_hw_learn = "".join(f'<li><span class="n">{i+1:02d}</span><h3>{h}</h3><p>{p}</p></li>' for i, (h, p) in enumerate(_HW_LEARN))

# guidance: Third Space rail, photo cards alternating with flat colour cards (Blank Street)
_HW_GUIDE = [
    ("Food", "Eating habits", "Practical guidance on balanced nutrition that fits your real lifestyle, not an ideal plan that's impossible to follow.",
     '<img src="img/wet/mocha.jpg" alt="A cold mocha shake with chocolate drizzle on the counter at Boost Club" loading="lazy" style="object-position:50% 40%">', "", "REAL · a breakfast at the club table"),
    ("Day", "Daily structure", "Suggestions on meal frequency, hydration and micro-habits that support your goal without disrupting your schedule.",
     "", "background:#E7C548;color:#13201B;--cut:#E7C548", ""),
    ("Move", "Movement and activity", "General recommendations on the type and frequency of physical activity suited to you, regardless of your current fitness level.",
     '<img src="img/real/park-walk.jpg" alt="Two members walking a park path in Kiseleff on a Sunday morning" loading="lazy">', "", "REAL · Boost Fit, Sunday in Kiseleff"),
    ("Next", "Concrete next step", "One clear action you can take in the coming week. Not an overwhelming list. One achievable step.",
     "", "background:var(--leaf-hi);color:#FFF8EE;--cut:var(--leaf-hi)", ""),
]
def _hw_card(k, h, p, img, style, slot):
    flat = "" if img else " flat"
    ds = f' data-slot="{slot}"' if slot else ""
    st = f' style="{style}"' if style else ""
    deco = "" if img else '<svg class="hw-gleaf" viewBox="0 0 24 25.7" aria-hidden="true"><path d="M18.62 0h2.56C23.06 0 24 5.98 24 9.22v2.48c0 7.94-6.92 14-18.62 14H2.82C.85 25.7 0 19.64 0 17.08v-3.59C0 5.98 6.83 0 18.62 0Z" fill="currentColor"/><path d="M3.5 22.8 14.94 9.48" stroke="var(--cut)" stroke-width="1.6" stroke-linecap="round"/></svg>'
    return f'<div class="k-card hw-gcard{flat}"{st}{ds}>{img}{deco}<span class="k-idx">{k}</span><b>{h}</b><p>{p}</p></div>'
_hw_guide = "".join(_hw_card(*g) for g in _HW_GUIDE)

_HW_FAQ = [("Do I need to be fit before I visit?", "You can start with a conversation about your goals and routine, whatever your experience with exercise."),
           ("How does the body assessment work?", "We use a professional body composition analyser. Ask us about the device and its preparation instructions before your visit."),
           ("Are the results a diagnosis?", "No. They are estimates, explained as a starting point for discussing your habits. The assessment does not replace medical care."),
           ("Can I bring someone with me?", "Yes, you can come with a partner, friend or family member. Let us know when arranging your visit.")]

_HW_BODY = (
hero("Your free visit", 'What happens at your <span class="it">visit.</span>', "25–30 minutes, structured and clear. Here's exactly what to expect from your first visit to Boost Club.", BOOK + WAB,
     img="img/his/consult-handshake.webp", alt="A handshake across the consultation table at Boost Club", slot="REAL · consultation (scan moment still to shoot)", pos="50% 55%", portrait=True)
# before you arrive: a quick, light strip
+ f'''<section class="gut hw-prep" aria-labelledby="hw-prep-h"><div class="wrap hw-prepg" data-k="rise">
  <div class="hw-prephead"><h2 id="hw-prep-h">Before you <span class="it">arrive.</span></h2><p>No special preparation needed. A few simple tips for the most accurate results.</p></div>
  {_hw_tips}
</div></section>'''
# step by step: pinned scroll story
+ f'''<section class="sec on-dark gut hw-story" id="steps"><div class="wrap">
  <div class="k-head"><div><span class="k-label">Step by step</span><h2 class="k-h" data-k="lines">Step by step. <span class="it">What happens.</span></h2></div></div>
  <div class="k-steps hw-steps"><div class="k-pin" data-n="01">{_hw_pin}</div><ol>{_hw_lis}</ol></div>
</div></section>'''
# what you'll find out: the instrument + the index
+ f'''<section class="sec gut hw-data"><div class="wrap">
  <div class="k-head"><div><span class="k-label">What you'll learn</span><h2 class="k-h" data-k="lines">What you'll find out about <span class="it">your body.</span></h2></div><aside>The professional analyser measures more than weight. You get real data to understand and use.</aside></div>
  <div class="hw-datag">
    <div class="hw-inst" data-slot="REAL · a real printout from the analyser">
      <div class="hw-insthead"><span class="hw-live" aria-hidden="true"></span><span>Example scan · segmental</span></div>
      <div class="hw-sv" id="scanH"></div>
      <div class="hw-read">
        <div><b data-count="22.4">22.4<small>%</small></b><span>Body fat</span></div>
        <div><b data-count="34.6">34.6<small>kg</small></b><span>Muscle mass</span></div>
        <div><b data-count="56.1">56.1<small>%</small></b><span>Body water</span></div>
        <div><b data-count="1780">1,780<small>kcal</small></b><span>Metabolism at rest</span></div>
      </div>
      <p class="hw-disc">Example readout. Your numbers come from your own scan. Not a medical diagnosis.</p>
    </div>
    <ol class="k-index hw-index">{_hw_learn}</ol>
  </div>
</div></section>'''
# guidance: rail of cards
+ f'''<section class="sec oat gut hw-guide"><div class="wrap">
  <div class="k-head"><div><span class="k-label">Guidance</span><h2 class="k-h" data-k="lines">What kind of guidance <span class="it">you'll receive.</span></h2></div><aside>Everyone leaves with recommendations tailored to their goal and routine, not generic advice.</aside></div>
  <div class="k-railwrap"><div class="k-rail hw-rail">{_hw_guide}</div><div class="k-railnav hw-railnav"><button data-k-prev aria-label="Previous">←</button><button data-k-next aria-label="Next">→</button></div></div>
</div></section>'''
# closing band: full-bleed, the club full of people
+ f'''<section class="k-band soft gut hw-band" data-slot="REAL · a full session at the club"><img src="img/his/full-room.webp" alt="A full room of people at the round tables during a session at Boost Club" loading="lazy" data-k="par"><div class="wrap">
  <span class="k-label">First step</span><h2 class="k-h" data-k="lines">Ready to see where <span class="it">you stand?</span></h2><p class="k-lead">Book your free body assessment and leave with a clear plan.</p>
  <div class="row"><a class="btn btn-brass" href="#" data-reserve>Book the free assessment <span class="ar">→</span></a><a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener">Message on WhatsApp</a></div>
</div></section>'''
# FAQ
+ '<section class="sec gut hw-faq"><div class="wrap hw-faqg"><div class="hw-faqhead"><h2 class="k-h" data-k="lines">Questions before your <span class="it">first visit.</span></h2></div><div>'
+ faq(_HW_FAQ) + AFTER + "</div></div></section>"
)

_HW_CSS = """
/* before you arrive: one quick strip */
.hw-prep{padding-block:clamp(56px,7vw,104px) clamp(64px,8vw,120px)}
.hw-prepg{display:grid;grid-template-columns:minmax(0,1.2fr) repeat(3,minmax(0,1fr));border-top:1px solid var(--line-l);padding-top:clamp(36px,4vw,56px)}
.hw-prephead{padding-right:clamp(24px,3vw,56px)}
.hw-prephead h2{font-size:clamp(34px,3.3vw,52px);letter-spacing:-.045em;line-height:.98}
.hw-prephead h2 .it{color:var(--leaf)}
.hw-prephead p{margin:18px 0 0;color:var(--stone);font-size:16px;line-height:1.55;max-width:30ch}
.hw-tip{padding:2px clamp(18px,2.2vw,36px) 0;border-left:1px solid var(--line-l)}
.hw-tip svg{width:30px;height:30px;color:var(--leaf);margin-bottom:26px;display:block}
.hw-tk{display:block;font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--brass-ink);margin-bottom:10px}
.hw-tip h3{font-size:clamp(20px,1.7vw,24px);letter-spacing:-.03em;line-height:1.1}
.hw-tip p{margin:10px 0 0;font-size:15px;line-height:1.55;color:var(--stone)}
@media (max-width:1100px){.hw-prepg{grid-template-columns:repeat(3,minmax(0,1fr))}.hw-prephead{grid-column:1/-1;padding:0 0 36px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:32px;align-items:end}.hw-prephead p{margin:0}.hw-tip:nth-child(2){border-left:0;padding-left:0}}
@media (max-width:720px){.hw-prepg{grid-template-columns:minmax(0,1fr)}.hw-prephead{display:block;padding-bottom:20px}.hw-prephead p{margin-top:14px}.hw-tip{border-left:0;border-top:1px solid var(--line-l);padding:22px 0 20px!important;display:grid;grid-template-columns:42px minmax(0,1fr);column-gap:14px}.hw-tip svg{grid-row:1/4;margin:0;width:28px;height:28px}}

/* step by step */
.hw-story .k-head{margin-bottom:clamp(24px,4vw,56px)}
.hw-steps .k-pin::after{content:attr(data-n) " / 05";position:absolute;top:18px;left:18px;z-index:3;padding:8px 14px;border-radius:999px;background:rgba(7,30,23,.72);backdrop-filter:blur(10px);color:var(--cream);font-size:12px;font-weight:600;letter-spacing:.18em;font-variant-numeric:tabular-nums}
.hw-steps .k-pin{background:var(--night)}
.hw-steps li h3{color:var(--cream)}
.hw-steps li p{color:rgba(244,239,230,.78)}
.hw-scanv{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(90% 70% at 50% 40%,rgba(47,138,99,.28),transparent 70%),var(--night)}
.hw-scanv .hw-sv{width:min(84%,440px)}
.hw-sv svg{width:100%;height:auto;display:block;overflow:visible}
.hw-scancap{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass)}
.hw-mobscan .hw-scanv{position:relative;height:100%;padding:18px 0 14px}
.hw-mobscan .hw-scanv .hw-sv{width:min(78%,300px)}
@media (max-width:900px){.hw-steps ol{border-bottom:1px solid var(--line-d)}.hw-steps li .k-mob{aspect-ratio:4/3}}

/* what you'll find out: the instrument */
.hw-datag{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,5vw,88px);align-items:start}
.hw-inst{position:sticky;top:92px;background:radial-gradient(80% 50% at 50% 30%,rgba(47,138,99,.22),transparent 70%),var(--night);color:var(--cream);border-radius:6px;padding:clamp(22px,2.6vw,36px);overflow:hidden}
.hw-insthead{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass);margin-bottom:6px}
.hw-live{width:7px;height:7px;border-radius:50%;background:var(--leaf-hi);box-shadow:0 0 0 0 rgba(47,138,99,.6);animation:hwlive 2.2s infinite}
@keyframes hwlive{70%{box-shadow:0 0 0 9px rgba(47,138,99,0)}100%{box-shadow:0 0 0 0 rgba(47,138,99,0)}}
.hw-inst .hw-sv{max-width:330px;margin:0 auto}
.hw-read{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--line-d);margin-top:18px}
.hw-read div{padding:16px 10px 14px 0;border-bottom:1px solid var(--line-d)}
.hw-read div:nth-child(even){padding-left:18px;border-left:1px solid var(--line-d)}
.hw-read b{display:block;font-size:clamp(28px,2.5vw,40px);letter-spacing:-.05em;font-weight:600;line-height:1;font-variant-numeric:tabular-nums}
.hw-read b small{font-size:.42em;margin-left:3px;font-weight:500;letter-spacing:0;opacity:.8}
.hw-read span{display:block;margin-top:8px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.62;font-weight:600}
.hw-disc{font-size:12px;line-height:1.5;opacity:.55;margin:14px 0 0}
.hw-index li{grid-template-columns:56px minmax(0,.9fr) minmax(0,1.1fr);padding:28px 0}
.hw-index li h3{font-size:clamp(24px,2.3vw,36px)}
@media (max-width:1100px){.hw-index li{grid-template-columns:48px minmax(0,1fr)}.hw-index li p{grid-column:2}}
@media (max-width:860px){.hw-datag{grid-template-columns:minmax(0,1fr)}.hw-inst{position:relative;top:0}}
@media (max-width:760px){.hw-index li{grid-template-columns:40px minmax(0,1fr);gap:4px 12px;padding:22px 0}.hw-index li .n{grid-row:1/3;padding-top:8px}}

/* guidance rail */
.hw-railnav{justify-content:flex-end;margin-top:22px;color:var(--ink)}
.hw-railwrap{position:relative}
.hw-gcard{aspect-ratio:3/4.1}
.hw-gcard b{font-size:clamp(28px,2.3vw,36px);max-width:12ch}
.hw-gcard p{font-size:15px}
.hw-gcard.flat .k-idx{opacity:1}
.hw-gcard.flat[style*="leaf-hi"] .k-idx{background:rgba(7,30,23,.45);padding:5px 10px;border-radius:999px;top:14px;left:14px}
.hw-gleaf{position:absolute;right:-14%;top:-6%;width:78%;height:auto;opacity:.15;pointer-events:none;z-index:-1;transform:rotate(-8deg);transition:transform 1.2s var(--ease)}
.hw-gcard:hover .hw-gleaf{transform:rotate(4deg) scale(1.04)}
.hw-gcard:not(.flat) .k-idx{top:16px;left:16px;padding:7px 12px;border-radius:999px;background:rgba(7,30,23,.6);backdrop-filter:blur(8px);opacity:1}
@media (min-width:1101px){.hw-rail{grid-auto-columns:calc((100% - 42px)/4);cursor:default}.hw-railnav{display:none}}
@media (max-width:900px){.hw-railnav{display:none}}

/* closing band */
.hw-band .k-h{max-width:12ch}
.hw-band::after{background:linear-gradient(90deg,rgba(7,30,23,.9) 0%,rgba(7,30,23,.72) 38%,rgba(7,30,23,.25) 72%,rgba(7,30,23,.1) 100%),linear-gradient(180deg,rgba(7,30,23,.2) 0%,rgba(7,30,23,0) 40%,rgba(7,30,23,.7) 100%)}
@media (max-width:760px){.hw-band::after{background:linear-gradient(180deg,rgba(7,30,23,.3) 0%,rgba(7,30,23,.6) 35%,rgba(7,30,23,.94) 100%)}}

@media (prefers-reduced-motion:reduce){.hw-live{animation:none}.hw-gleaf{transition:none}}

/* faq */
.hw-faqg{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,6vw,110px);align-items:start}
.hw-faqhead{position:sticky;top:110px}
.hw-faqhead .k-h{font-size:clamp(42px,4.6vw,76px)}
@media (max-width:900px){.hw-faqg{grid-template-columns:minmax(0,1fr)}.hw-faqhead{position:relative;top:0}}

.hw-goal{position:relative;display:flex!important;flex-direction:column;justify-content:center;align-items:center;background:radial-gradient(70% 60% at 70% 25%,rgba(217,178,106,.16),transparent 70%),radial-gradient(80% 70% at 20% 90%,rgba(47,138,99,.25),transparent 70%),#04140F;overflow:hidden}
.hw-goal svg{width:100%;height:100%;max-height:100%;position:absolute;inset:0}
.hg-t{font:600 15px var(--display);letter-spacing:.2em;text-transform:uppercase;fill:rgba(244,239,230,.62)}.hg-tg{fill:#E6C68A;font-size:17px}
.hg-ms circle{fill:#04140F;stroke:#7CE0A8;stroke-width:2.5}
.hg-path,.hg-glow{stroke-dasharray:1;stroke-dashoffset:0}
.hg-target circle:nth-child(1){transform-origin:452px 170px;animation:hgp 2.6s ease-out infinite}
@keyframes hgp{0%{transform:scale(.6);opacity:1}100%{transform:scale(1.5);opacity:0}}
.hg-chips{position:absolute;left:0;right:0;bottom:22px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;list-style:none;margin:0;padding:0 16px}
.k-steps .hg-chips li{min-height:0;opacity:1;display:block;border-top:1px solid rgba(230,198,138,.4);padding:7px 13px;border-radius:999px;border:1px solid rgba(230,198,138,.4);background:rgba(4,20,15,.7);color:var(--cream);font-size:12px;font-weight:600;letter-spacing:.04em}
.on .hg-path,.on .hg-glow,.k-mob .hg-path,.k-mob .hg-glow{animation:hgd 2.4s cubic-bezier(.6,0,.2,1) both}
@keyframes hgd{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.on .hg-ms circle,.k-mob .hg-ms circle{animation:hgm .5s ease-out both}.hg-ms circle:nth-child(1){animation-delay:.6s!important}.hg-ms circle:nth-child(2){animation-delay:1.2s!important}.hg-ms circle:nth-child(3){animation-delay:1.7s!important}
@keyframes hgm{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:none}}.hg-ms circle{transform-box:fill-box;transform-origin:center}
.k-steps li .k-mob:has(.hw-goal){aspect-ratio:4/5}.k-mob .hw-goal{position:relative;width:100%;height:100%}
@media (prefers-reduced-motion: reduce){.hg-path,.hg-glow,.hg-ms circle,.hg-target circle{animation:none!important}}

.hf-tg{fill:#7CE0A8;font-size:17px}
.hf-path,.hf-glow{stroke-dasharray:1;stroke-dashoffset:0}
.on .hf-path,.on .hf-glow,.k-mob .hf-path,.k-mob .hf-glow{animation:hgd 1.4s cubic-bezier(.6,0,.2,1) both}
.hf-ring{transform-box:fill-box;transform-origin:center;animation:hgp 2.4s ease-out infinite}
.on .hf-ms,.k-mob .hf-ms{animation:hgm .5s 1.2s ease-out both}.hf-ms{transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion: reduce){.hf-path,.hf-glow,.hf-ms,.hf-ring{animation:none!important}}
"""

_HW_JS = """  document.querySelectorAll('.hw-goal svg').forEach(function(sv,n){ sv.querySelectorAll('[id]').forEach(function(d){ var o=d.id, nu=o+'_'+n; d.id=nu; sv.querySelectorAll('*').forEach(function(e){ ['fill','stroke','filter'].forEach(function(at){ var v=e.getAttribute(at); if(v&&v.indexOf('#'+o+')')>-1) e.setAttribute(at,v.replace('#'+o+')','#'+nu+')')); }); }); }); });
  var SC={muscle:'#2F8A63',fat:'#D9B26A',base:'rgba(244,239,230,.08)',ink:'#F4EFE6'};
  document.querySelectorAll('[data-scan]').forEach(function(el){ drawScan(el,SC); });
  drawScan(document.getElementById('scanH'),SC);
  var pin=document.querySelector('.hw-steps .k-pin'), lis=[].slice.call(document.querySelectorAll('.hw-steps ol>li'));
  if(pin&&'IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) pin.setAttribute('data-n',('0'+(lis.indexOf(e.target)+1)).slice(-2)); }); },{rootMargin:'-45% 0px -45% 0px'}); lis.forEach(function(l){ io.observe(l); }); }"""

page("how-it-works.html", "How it works", "", _HW_BODY, css=_HW_CSS, js=_HW_JS)


# ================================================================= FREE SCAN (booking)
_FS_BODY = f'''<section class="fs-book gut" id="book" data-k-calm aria-label="Booking"><div class="wrap fs-grid">
  <div class="fs-intro">
    <span class="k-label">Free consultation</span>
    <h1 class="fs-h1">Book your free body composition <span class="it">assessment.</span></h1>
    <p class="fs-sub">Free body composition assessment · 25–30 minutes · Strada Sevastopol 24, near Piața Victoriei. Leave your name and number and Gabriel will message you on WhatsApp to arrange a time. Or message us on WhatsApp directly.</p>
    <div class="fs-ctas"><a class="btn btn-brass" href="book.html">Pick your time now <span class="ar">→</span></a><a class="btn btn-ghost fs-mob" href="#bookform">Prefer a form? Fill it in below ↓</a>{_VF_WAQ}</div>
  </div>

  <div class="fs-card">
  <div class="flow" id="flow">
  <form class="form" id="bookform" name="consultatie-en" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field" novalidate aria-label="Booking request">
    <input type="hidden" name="form-name" value="consultatie-en"><input type="hidden" name="lang" value="en"><input type="hidden" name="referrer" value="">
    <p class="vh" aria-hidden="true"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <div class="fs-cardhead"><span class="k-label">Booking</span><h2 class="fs-h2">Leave your name and number</h2></div>
    <div class="prog" aria-hidden="true"><i><b>01</b><span>Goal</span></i><i><b>02</b><span>When</span></i><i><b>03</b><span>You</span></i></div>
    <fieldset class="step on" data-step="1"><legend class="sl">1 / 3 · Main goal (optional)</legend><div class="chips big fs-goals">
      <label><input type="radio" name="obiectiv" id="g1" value="Healthy weight loss"><span>Healthy weight loss</span></label><label><input type="radio" name="obiectiv" id="g2" value="Build muscle"><span>Build muscle</span></label><label><input type="radio" name="obiectiv" id="g3" value="More energy"><span>More energy</span></label><label><input type="radio" name="obiectiv" id="g4" value="Know my starting point"><span>Know my starting point</span></label></div>
      <div class="row nav2"><button type="button" class="btn btn-bottle" data-next>Continue <span class="ar">→</span></button></div></fieldset>
    <fieldset class="step" data-step="2"><legend class="sl">2 / 3 · When would suit you? (optional)</legend>
      <label for="when" class="vh">When would suit you? (optional)</label><input id="when" name="cand" placeholder="e.g. Tuesday after 17:00">
      <div class="chips" id="quick"><label><input type="checkbox" value="Morning"><span>Morning</span></label><label><input type="checkbox" value="Midday"><span>Midday</span></label><label><input type="checkbox" value="Evening"><span>Evening</span></label><label><input type="checkbox" value="Sunday"><span>Sunday</span></label></div>
      <p class="small muted fs-note">Mon–Fri 07:00 – 20:00/21:00 · Sat closed · Sun 10:00 – 18:00</p>
      <div class="row nav2"><button type="button" class="btn btn-ghost" data-back>Back</button><button type="button" class="btn btn-bottle" data-next>Continue <span class="ar">→</span></button></div></fieldset>
    <fieldset class="step" data-step="3"><legend class="sl">3 / 3 · You</legend>
      <div class="fs-two"><label for="fn">First name *<input id="fn" name="prenume" required placeholder="e.g. Maria" autocomplete="given-name"></label>
      <label for="ph">Phone *<input id="ph" name="telefon" required placeholder="e.g. +40 722 000 000" autocomplete="tel" inputmode="tel"></label></div>
      <fieldset class="fs-src"><legend>How did you hear about us? (optional)</legend><div class="chips">
        <label><input type="radio" name="aflat" id="s1" value="Google"><span>Google</span></label><label><input type="radio" name="aflat" id="s2" value="Instagram"><span>Instagram</span></label><label><input type="radio" name="aflat" id="s3" value="A friend"><span>A friend</span></label><label><input type="radio" name="aflat" id="s4" value="On the street"><span>On the street</span></label><label><input type="radio" name="aflat" id="s5" value="Other"><span>Other</span></label></div></fieldset>
      <p class="small muted fs-note">We use these details to manage your booking and contact you about it. Read how your data is processed in our Privacy Policy.</p>
      <p class="err" id="err" role="alert" hidden></p>
      <div class="row nav2"><button type="button" class="btn btn-ghost" data-back>Back</button><button class="btn btn-brass" type="submit" id="sendb">Send <span class="ar">→</span></button></div>
      <p class="small muted fs-note fs-trust">Free consultation · We message you on WhatsApp · Protected information</p></fieldset>
  </form>
  <div class="done" id="done" hidden tabindex="-1"><span class="big" aria-hidden="true">✓</span><h3 class="fs-h2">Thank you! We got your request.</h3><p class="muted" style="margin-top:14px">Gabriel will message you on WhatsApp shortly to arrange a time. Want it faster? <a href="{WA}" target="_blank" rel="noopener">Message us on WhatsApp</a>.</p></div>
  </div>
  </div>

  <div class="fs-details">
    <dl class="fs-facts">
      <div><dt>Complete session</dt><dd>25–30 minutes</dd></div>
      <div><dt>Professional</dt><dd>Body composition analyser</dd></div>
      <div><dt>Explained in plain language</dt><dd>Results on the spot</dd></div>
      <div><dt>Strada Sevastopol 24</dt><dd>Piața Victoriei</dd></div>
    </dl>
    <div class="fs-info">
      <div class="fs-hours"><h3>Boost Club hours</h3><div class="hours"><div><span>Monday – Friday</span><span>07:00 – 20:00/21:00</span></div><div><span>Saturday</span><span>Closed</span></div><div><span>Sunday</span><span>10:00 – 18:00</span></div></div><p>Strada Sevastopol 24, Sector 1 · Call: +40 726 205 752</p></div>
      <div class="fs-wa"><h3>Prefer WhatsApp?</h3><p>Message us directly and we'll confirm your slot in minutes.</p>{WAB}</div>
    </div>
  </div>
</div></section>

<section class="fs-visit" aria-labelledby="fs-visit-h"><div class="fs-visitg">
  <div class="fs-photo" data-k="clip" data-slot="REAL · scan moment at the analyser"><img src="img/scan.jpg" alt="A client going through her scan printout with the coach" loading="lazy">
    <div class="fs-mini" data-slot="REAL · a real printout from the analyser"><div id="miniScan"></div><span class="cap">Example scan · segmental</span></div></div>
  <div class="fs-visittxt gut">
    <span class="k-label">At your visit</span>
    <h2 class="k-h" id="fs-visit-h" data-k="lines">What you get in <span class="it">25–30 minutes</span></h2>
    <ul class="fs-get" data-k="rise"><li><span>01</span>Professional body composition analysis</li><li><span>02</span>Results explained in plain language</li><li><span>03</span>Discussion about your goals</li><li><span>04</span>Personalised recommendations for you</li></ul>
    <a class="k-link" href="how-it-works.html">How it works. Full details →</a>
  </div>
</div></section>

<section class="sec oat gut fs-faq"><div class="wrap fs-faqg"><div class="fs-faqhead"><span class="k-label">Before you fill in</span><h2 class="k-h" data-k="lines">Frequently asked <span class="it">questions.</span></h2></div><div>'''

_FS_BODY += faq([("Is the consultation really free?", "Yes. The body assessment and first consultation are free."),
                 ("How long does the first visit take?", "About 25–30 minutes: the body composition scan, results explained, and a discussion about your goals."),
                 ("How do I know my booking is confirmed?", "Gabriel messages you on WhatsApp to agree on a time. Your visit is confirmed once he sends you the day, time and address. If you haven't heard from us, message us on WhatsApp.")]) + AFTER + "</div></div></section>"

_FS_CSS = """
/* ---------- the booking room: dark, calm, one luminous card ---------- */
.fs-book{position:relative;background:var(--night);color:var(--cream);padding-top:clamp(108px,10vw,150px);padding-bottom:clamp(72px,8vw,128px);overflow:clip;isolation:isolate}
.fs-book::before{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(60% 55% at 12% 8%,rgba(47,138,99,.30),transparent 70%),radial-gradient(50% 50% at 92% 100%,rgba(217,178,106,.12),transparent 70%)}
.fs-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);grid-template-areas:"intro card" "details card";column-gap:clamp(40px,6vw,112px);row-gap:clamp(40px,4vw,64px);align-items:start}
.fs-intro{grid-area:intro}
.fs-card{grid-area:card;position:sticky;top:92px}
.fs-details{grid-area:details}
.fs-intro .k-label{margin-bottom:26px}
.fs-h1{font-size:clamp(46px,5.4vw,88px);line-height:.93;letter-spacing:-.055em;font-weight:600;max-width:13ch;text-wrap:balance}
.fs-h1 .it{color:var(--brass);font-weight:500}
html[lang=ro] .fs-h1,html[lang=ru] .fs-h1{text-wrap:wrap;max-width:14ch}
.fs-sub{margin:28px 0 0;font-size:clamp(17px,1.3vw,19px);line-height:1.55;color:rgba(244,239,230,.74);max-width:44ch}
.fs-ctas{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px;margin-top:30px}
.fs-waq{color:var(--cream);font-size:15px}
.fs-mob{display:none}

/* facts: four hairline cells, value big, label small */
.fs-facts{margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--line-d)}
.fs-facts>div{padding:22px 16px 20px 0;border-bottom:1px solid var(--line-d);display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:8px}
.fs-facts>div:nth-child(even){padding-left:22px;border-left:1px solid var(--line-d)}
.fs-facts dd{margin:0;font-size:clamp(22px,2vw,30px);font-weight:600;letter-spacing:-.04em;line-height:1.05}
.fs-facts dt{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,239,230,.55)}
.fs-info{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(22px,3vw,44px);margin-top:clamp(32px,3.4vw,48px)}
.fs-info h3{font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass);margin-bottom:14px;line-height:1.3}
.fs-hours .hours>div{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-bottom:1px solid var(--line-d);font-size:15px}
.fs-hours .hours>div span:last-child{font-variant-numeric:tabular-nums;color:rgba(244,239,230,.86)}
.fs-hours p,.fs-wa p{margin:14px 0 0;font-size:13.5px;line-height:1.55;color:rgba(244,239,230,.6)}
.fs-wa p{margin:0 0 18px;font-size:15px;color:rgba(244,239,230,.74)}
.fs-wa .btn{height:50px;padding:0 22px;font-size:15px;color:var(--cream);box-shadow:inset 0 0 0 1px rgba(244,239,230,.4)}

/* the card */
.fs-card{background:var(--bone);color:var(--ink);border-radius:6px;padding:clamp(26px,3.2vw,52px);box-shadow:0 40px 90px -30px rgba(0,0,0,.6),0 0 0 1px rgba(244,239,230,.06)}
.fs-cardhead .k-label{margin-bottom:16px}
.fs-h2{font-size:clamp(30px,2.7vw,44px);letter-spacing:-.045em;line-height:1;font-weight:600}
.fs-card .form{gap:22px}
.fs-card .prog{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:10px 0 6px}
.fs-card .prog i{display:flex;align-items:baseline;gap:10px;height:auto;padding-top:14px;border-radius:0;background:none;border-top:2px solid var(--line-l);font-style:normal;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--stone);transition:border-color .45s var(--ease),color .45s var(--ease)}
.fs-card .prog i b{font-weight:600;color:inherit;font-variant-numeric:tabular-nums}
.fs-card .prog i.on{border-color:var(--leaf);color:var(--ink)}
.fs-card .prog i.on b{color:var(--leaf)}
.fs-card .step{gap:20px}
.fs-card .sl{font-size:14px;font-weight:500;letter-spacing:.01em;color:var(--stone);margin-bottom:10px;padding:0}
/* goal tiles */
.fs-goals{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.fs-goals label{display:block;position:relative}
.fs-goals span{display:flex!important;align-items:center;justify-content:space-between;gap:12px;height:auto!important;min-height:84px;padding:18px 20px!important;border-radius:6px!important;border:1px solid var(--line-l)!important;background:#fff;font-size:17px!important;font-weight:600!important;letter-spacing:-.02em;line-height:1.2;transition:border-color .2s,background .25s var(--ease),color .25s var(--ease),transform .25s var(--ease)}
.fs-goals span::after{content:'';flex:none;width:20px;height:20px;border-radius:50%;border:1px solid #CFC6B5;transition:all .25s var(--ease)}
.fs-goals label:hover span{border-color:var(--leaf)!important}
.fs-goals input:checked+span{background:var(--bottle);color:var(--cream);border-color:var(--bottle)!important}
.fs-goals input:checked+span::after{border-color:var(--brass);background:var(--brass);box-shadow:inset 0 0 0 4px var(--bottle)}
/* inputs: calm, generous */
.fs-card .form input:not([type=radio]):not([type=checkbox]){height:60px;border-radius:6px;border:1px solid var(--line-l);background:#fff;font-size:17px;padding:0 18px}
.fs-card .form input:focus{border:1px solid var(--leaf);box-shadow:0 0 0 3px rgba(31,107,79,.14);outline:none}
.fs-card .form label{font-size:13px;font-weight:600;gap:8px}
.fs-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.fs-card .form label{min-width:0}.fs-card .form input:not([type=radio]):not([type=checkbox]){width:100%;min-width:0}
.fs-card .done:focus{outline:none}
@media (min-width:961px) and (max-width:1240px){.fs-two{grid-template-columns:minmax(0,1fr)}.fs-goals span{font-size:16px!important;padding:16px!important}}
.fs-src{border:0;padding:0;margin:0}
.fs-src legend{font-size:13px;font-weight:600;margin-bottom:10px;padding:0}
.fs-card .chips:not(.fs-goals) span{height:44px;padding:0 18px;border-color:var(--line-l);font-size:14.5px}
.fs-card .chips:not(.fs-goals) label{display:block}
.fs-note{margin:0;font-size:13.5px;line-height:1.55}
.fs-trust{padding-top:16px;border-top:1px solid var(--line-l);letter-spacing:.01em}
.fs-card .nav2{margin-top:4px}
.fs-card .nav2 .btn{height:56px}
.fs-card .nav2 .btn-bottle,.fs-card .nav2 .btn-brass{flex:1;max-width:260px}
.fs-card .vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.fs-card .err{color:#B23A3A;font-size:14px;margin:0;padding:12px 14px;border-radius:6px;background:rgba(178,58,58,.07)}
.fs-card .step.on{display:grid;animation:fsstep .5s var(--ease)}
.fs-card .step{border:0;padding:0;margin:0;display:none}
@keyframes fsstep{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.fs-card .done{padding:18px 0 6px}
.fs-card .done .big{display:grid;place-items:center;width:76px;height:76px;border-radius:50%;background:var(--leaf);color:#fff;font-size:32px;margin-bottom:26px;animation:fspop .6s var(--ease)}
@keyframes fspop{from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}}
.fs-card .done #sum{margin-top:22px;padding-top:16px;border-top:1px solid var(--line-l)}
.fs-card .done a{color:var(--leaf);font-weight:600}

@media (max-width:1100px){.fs-info{grid-template-columns:minmax(0,1fr)}}
@media (max-width:960px){
  .fs-grid{grid-template-columns:minmax(0,1fr);grid-template-areas:"intro" "card" "details"}
  .fs-card{position:relative;top:0}
  .fs-info{grid-template-columns:repeat(2,minmax(0,1fr))}
  .fs-h1{max-width:13ch}
}
@media (max-width:640px){
  .fs-book{padding-top:100px}
  .fs-mob{display:inline-flex}
  .fs-ctas{gap:16px}
  .fs-goals{grid-template-columns:minmax(0,1fr)}
  .fs-goals span{min-height:64px}
  .fs-two{grid-template-columns:minmax(0,1fr)}
  .fs-info{grid-template-columns:minmax(0,1fr)}
  .fs-card{margin-inline:-6px;padding:26px 20px 28px}
  .fs-card .prog i{font-size:11px;letter-spacing:.12em;gap:6px}
  .fs-card .nav2 .btn{flex:1;padding:0 18px}
  .fs-card .nav2 .btn-bottle,.fs-card .nav2 .btn-brass{max-width:none}
}

/* ---------- at your visit: edge-to-edge photo + the instrument ---------- */
.fs-visitg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:min(100svh,920px);background:var(--bone)}
.fs-photo{position:relative;overflow:hidden;background:var(--pine);min-height:520px}
.fs-photo>img{position:absolute;inset:-40px;width:calc(100% + 80px);height:calc(100% + 80px);max-width:none;object-fit:cover;object-position:40% 50%;filter:blur(9px) brightness(.55) saturate(.9)}
.fs-mini{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(78%,400px);box-shadow:0 30px 70px rgba(0,0,0,.4);background:rgba(7,30,23,.86);backdrop-filter:blur(12px);border:1px solid rgba(244,239,230,.12);border-radius:6px;padding:16px 16px 12px;display:flex;flex-direction:column;align-items:center;color:var(--cream)}
.fs-mini #miniScan{width:100%}
.fs-mini #miniScan svg{width:100%;height:auto;display:block;overflow:visible}
.fs-mini .cap{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass);margin-top:6px;text-align:center}
.fs-visittxt{align-self:center;padding-block:clamp(72px,9vw,140px);max-width:680px}
.fs-visittxt .k-label{margin-bottom:22px}
.fs-visittxt .k-h{font-size:clamp(42px,4.8vw,80px)}
.fs-get{list-style:none;margin:clamp(32px,3.4vw,48px) 0 30px;padding:0;border-top:1px solid var(--line-l)}
.fs-get li{display:grid;grid-template-columns:44px minmax(0,1fr);align-items:baseline;padding:18px 0;border-bottom:1px solid var(--line-l);font-size:clamp(18px,1.5vw,22px);font-weight:600;letter-spacing:-.025em;line-height:1.25}
.fs-get li span{font-size:12px;font-weight:600;letter-spacing:.2em;color:var(--brass-ink)}
@media (max-width:900px){.fs-visitg{grid-template-columns:minmax(0,1fr)}.fs-photo{min-height:0;aspect-ratio:4/4.4}.fs-visittxt{max-width:none}}

@media (prefers-reduced-motion:reduce){.fs-card .step.on,.fs-card .done .big{animation:none}}

/* ---------- faq ---------- */
.fs-faqg{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,6vw,110px);align-items:start}
.fs-faqhead{position:sticky;top:110px}
.fs-faqhead .k-label{margin-bottom:22px}
.fs-faqhead .k-h{font-size:clamp(42px,4.6vw,76px)}
@media (max-width:900px){.fs-faqg{grid-template-columns:minmax(0,1fr)}.fs-faqhead{position:relative;top:0}}
"""

# the booking flow script: build.py's, unchanged (ids, names, prefill, validation, done state)
_FS_JS = """  drawScan(document.getElementById('miniScan'),{muscle:'#2F8A63',fat:'#D9B26A',base:'rgba(244,239,230,.08)',ink:'#F4EFE6'});
  var f=document.getElementById('bookform'), steps=f.querySelectorAll('.step'), bars=f.querySelectorAll('.prog i'), cur=0;
  function show(n){ cur=n; steps.forEach(function(s,i){ s.classList.toggle('on',i===n); }); bars.forEach(function(b,i){ b.classList.toggle('on',i<=n); }); var x=steps[n].querySelector('input'); if(x&&n>0) x.focus({preventScroll:true}); }
  f.addEventListener('click',function(e){ if(e.target.closest('[data-next]')) show(Math.min(2,cur+1)); if(e.target.closest('[data-back]')) show(Math.max(0,cur-1)); });
  f.querySelectorAll('input[name=obiectiv]').forEach(function(r){ r.addEventListener('change',function(){ setTimeout(function(){show(1)},250); }); });
  var when=document.getElementById('when');
  document.querySelectorAll('#quick input').forEach(function(c){ c.addEventListener('change',function(){ var v=[].slice.call(document.querySelectorAll('#quick input:checked')).map(function(x){return x.value}).join(', '); when.value=v; }); });
  var q=new URLSearchParams(location.search); if(q.get('when')){ when.value=q.get('when'); }
  var gq=q.get('goal'); if(gq){ var m={loss:'g1',muscle:'g2',energy:'g3'}[gq]; if(m) document.getElementById(m).checked=true; }
  // Posts to Netlify Forms like the live site: consultatie / consultatie-en / consultatie-ru, then the
  // submission-created function writes person + action + note to the CRM. Field names are the live ones.
  var LG=document.documentElement.lang||'en', FN={ro:'consultatie',ru:'consultatie-ru'}[LG]||'consultatie-en';
  f.setAttribute('name',FN); f.elements['form-name'].value=FN; f.elements['lang'].value=LG;
  var sendb=document.getElementById('sendb'), sendL=sendb.innerHTML;
  f.addEventListener('submit',function(e){ e.preventDefault(); var fn=document.getElementById('fn'), ph=document.getElementById('ph'), err=document.getElementById('err');
    var digits=(ph.value||'').replace(/[^0-9]/g,'');
    if(!fn.value.trim()){ err.hidden=false; err.textContent='Please add your first name so Gabriel knows who to message.'; fn.focus(); return; }
    if(digits.length<9){ err.hidden=false; err.textContent='Please check the phone number. We message you on WhatsApp, so it needs the full number.'; ph.focus(); return; }
    if(sendb.disabled) return;
    err.hidden=true; f.elements['referrer'].value=location.href; sendb.disabled=true; sendb.textContent='Sending…';
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
      .then(function(r){ if(!r.ok) throw new Error(r.status); f.hidden=true; var d=document.getElementById('done'); d.hidden=false; d.focus(); })
      .catch(function(){ sendb.disabled=false; sendb.innerHTML=sendL; err.hidden=false;
        err.textContent='We could not send your request. Please message us on WhatsApp instead and we will book you in.'+' ';
        var wl=document.createElement('a'); wl.href=document.querySelector('.fs-waq').href; wl.target='_blank'; wl.rel='noopener'; wl.textContent='Open WhatsApp →'; err.appendChild(wl); });
  });
  bars[0].classList.add('on');"""

_FS_GSAP = """  gsap.from('.fs-intro>*',{y:28,opacity:0,duration:1,stagger:.07,ease:'power3.out'});
  gsap.from('.fs-card',{y:40,opacity:0,duration:1.1,delay:.15,ease:'power3.out',clearProps:'transform'});
  gsap.from('.fs-details>*',{y:24,opacity:0,duration:.9,stagger:.08,delay:.3,ease:'power3.out'});"""

page("free-scan.html", "Free consultation", "scan", _FS_BODY, css=_FS_CSS, js=_FS_JS, gsapjs=_FS_GSAP,
     light=False, cfg=' data-norbar="1" data-solid-at="0.12"')

