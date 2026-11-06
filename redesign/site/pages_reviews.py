# Reviews page (overrides the base version in build.py). Runs inside build.py's globals.
# Every review is a public Google review already shown on the live boostclub.ro (recenzii + homepage),
# kept in its original language and wording. Excerpts are exact substrings, checked below.
import json as _json, html as _html

_R = _json.load(open(os.path.join(D, "reviews", "reviews.json")))
_BYN = {r["name"]: r for r in _R}
_GMAPS = "https://www.google.com/maps/search/?api=1&query=Boost+Club+Sevastopol+24+Bucuresti"
_GWRITE = "https://g.page/r/CUSJCWfOpKRSEAE/review"
_e = _html.escape
for _r in _R:
    assert not any(b in _r["name"].lower() for b in ("oleg", "semyon", "cristi h")), _r["name"]

def _ex(name, s):
    assert s in _BYN[name]["text"], (name, s)   # never paraphrase
    return (name, s)

_ROW1 = [_ex("Theo", "Gabriel explains everything clearly and takes the time to make sure you understand the process."),
         _ex("Buduianu Filofteia", "Thanks to their analysis I understand my body better and where i need to keep working."),
         _ex("Andreea Marinescu", "Am avut o discuție foarte plăcută cu Gabriel, mi - a explicat foarte clar planul de nutriție."),
         _ex("shahaf waitzman", "I’ve been coming for a few weeks and my energy levels have improved a lot."),
         _ex("Sami Chemais", "Great Community, Gabriel is an amazing listener, very educated about his craft and very positive energy."),
         _ex("Diana", "The body composition assessment was free and everything was explained to me in a friendly, clear and professional way.")]
_ROW2 = [_ex("Marius Gasparel", "I highly recommend at least having a chat with them, they might help you more than you think."),
         _ex("Flavius RO", "o scanare foarte detaliata a corpului,totul este premium si personalul este liber sa te ajute cu orice intrebare"),
         _ex("Andreea Popa", "I learned a lot about nutrition in a way that was easy to understand and apply in everyday life."),
         _ex("Antonio", "The atmosphere is so welcoming, positive, and motivating from the moment you walk in."),
         _ex("Ionuț-Alexandru Stan", "Had a great conversation with Gabriel about nutrition and good habits."),
         _ex("Jaja", "What stands out most is the community and support.")]
_FEAT = _ex("Theo", "Great atmosphere, great people, and an amazing place to spend your mornings.")

def _mq_set(row, hidden=False):
    ah = ' aria-hidden="true"' if hidden else ""
    return f'<ul class="mq-set"{ah}>' + "".join(
        f'<li lang="{_BYN[n]["lang"]}"><p>{_e(s)}</p><span class="mq-n">{_e(n)}</span></li>' for n, s in row) + "</ul>"

def _marquee(row, rev=False):
    return f'<div class="mq-row{" rev" if rev else ""}">{_mq_set(row)}{_mq_set(row, True)}</div>'

_STARS = '<span class="stars" role="img" aria-label="5 out of 5 stars">★★★★★</span>'
_n_en = sum(1 for r in _R if r["lang"] == "en"); _n_ro = sum(1 for r in _R if r["lang"] == "ro"); _n_ru = sum(1 for r in _R if r["lang"] == "ru"); _n_uk = sum(1 for r in _R if r["lang"] == "uk")
_LANGN = {"ro": " · in Romanian", "ru": " · in Russian", "uk": " · in Ukrainian"}

def _rv(r, i):
    txt = r["text"]  # live HTML already holds <br><br> paragraph breaks (Jaja); everything else is escaped text
    body = "".join(f"<p>{_e(p)}</p>" for p in txt.split("<br><br>"))
    ln = len(txt)
    size = "s" if ln < 140 else ("m" if ln < 260 else "l")
    anchor = ' id="theo"' if r["name"] == "Theo" else ""
    return f'''<figure class="rv rv-{size}" data-lang="{r["lang"]}"{anchor}>
  <div class="rv-top"><span class="stars" role="img" aria-label="{r.get("stars",5)} out of 5 stars">{"★"*r.get("stars",5)}{"☆"*(5-r.get("stars",5))}</span><span class="rv-tag">{_e(r["tag"])}</span></div>
  <blockquote lang="{r["lang"]}">{body}</blockquote>
  <figcaption><span class="rv-mono" aria-hidden="true">{_e(r["name"][0].upper())}</span><span class="rv-who"><b>{_e(r["name"])}</b><span>Google review{_LANGN.get(r["lang"], "")}</span></span></figcaption>
</figure>'''

_order = ["Theo", "Diana", "Antonio", "Andreea Marinescu", "Marius Gasparel", "Sami Chemais", "Jaja", "shahaf waitzman",
          "Flavius RO", "Andreea Popa", "Buduianu Filofteia", "Ionuț-Alexandru Stan"]
assert set(_order) <= set(_BYN)
_order = _order + [r["name"] for r in _R if r["name"] not in _order]
_wall = "".join(_rv(_BYN[n], k) for k, n in enumerate(_order))

_body = f'''<section class="vhero phero gut"><div class="wrap vh-grid">
  <div class="vh-copy"><span class="eyebrow">Reviews</span><h1 class="h-xl">What people say after their <span class="it">visit.</span></h1>
  <p class="lead sub">Public reviews from the Boost Club Google profile, shown in their original language and text.</p>
  <div class="row" style="margin-top:28px"><a class="btn btn-bottle" href="#all">Read the reviews ↓</a><a class="btn btn-ghost" href="{_GMAPS}" target="_blank" rel="noopener">Read all reviews on Google</a></div></div>
  <a class="plate" href="{_GMAPS}" target="_blank" rel="noopener" aria-label="5.0 out of 5 from 202 Google reviews. Read all reviews on Google">
    <span class="pl-k">Google rating</span>
    <span class="pl-num" aria-hidden="true">5.0</span>
    <span class="pl-stars" aria-hidden="true">★★★★★</span>
    <span class="pl-c" aria-hidden="true"><b data-count="202">202</b> Google reviews</span>
    <span class="pl-d" aria-hidden="true">Snapshot from 6 November 2026</span>
    <span class="pl-go" aria-hidden="true">Read all on Google <span class="ar">→</span></span>
  </a>
</div>
<div class="wrap">''' + stats([(str(len(_R)), "Reviews shown here"), ("36 years", "Family expertise in wellness"), ("ISSA", "Certified personal trainer"), ("Sector 1", "Strada Sevastopol 24")]) + f'''</div></section>

<section class="vph">
  <div class="vph-fr" data-slot="REAL · members at the club"><img src="img/real/group-table.jpg" alt="Gabriel taking a selfie with members sitting around the tables at the club" loading="lazy"></div>
  <span class="k-cap vph-cap">Members at the club, Strada Sevastopol 24.</span>
</section>

<section class="on-dark gut fq"><div class="wrap">
  <figure class="fq-fig">
    <span class="fq-mark" aria-hidden="true">“</span>
    <blockquote lang="en">{_e(_FEAT[1])}</blockquote>
    <figcaption><span class="pl-stars" aria-hidden="true">★★★★★</span><span><b>{_FEAT[0]}</b> · Google review · <a href="#theo">read it in full</a></span></figcaption>
  </figure>
</div></section>

<section class="mqsec oat" aria-labelledby="mq-h">
  <div class="gut"><div class="wrap mq-head"><div><span class="k-label">In their words</span><h2 class="k-h" id="mq-h" data-k="lines">One line at a <span class="it">time.</span></h2></div>
  <p class="muted">Short passages, word for word, from the reviews below.</p>
  <button type="button" class="mq-pause" aria-pressed="false"><span class="mq-pi" aria-hidden="true"></span><span class="mq-pl">Pause</span></button></div></div>
  <div class="mq" tabindex="-1">{_marquee(_ROW1)}{_marquee(_ROW2, True)}</div>
</section>

<section class="sec gut" id="all"><div class="wrap">
  <div class="k-head all-head"><div><span class="k-label">Google reviews</span><h2 class="k-h" data-k="lines">What our clients <span class="it">say.</span></h2></div>
  <aside>Every written review from our Google profile, word for word, in its original language. Updated 31 October 2026.</aside></div>
  <div class="chips-f" role="group" aria-label="Filter reviews by language">
    <button type="button" aria-pressed="true" data-f="all">All <span>{len(_R)}</span></button>
    <button type="button" aria-pressed="false" data-f="en">English <span>{_n_en}</span></button>
    <button type="button" aria-pressed="false" data-f="ro">Română <span>{_n_ro}</span></button>
    <button type="button" aria-pressed="false" data-f="ru">Русский <span>{_n_ru}</span></button>
    <button type="button" aria-pressed="false" data-f="uk">Українська <span>{_n_uk}</span></button>
  </div>
  <p class="vis" aria-live="polite" data-count-msg></p>
  <div class="wall">{_wall}</div>
  <div class="wall-more"><button type="button" class="btn btn-ghost" data-more>Show all <span data-more-n>{len(_R)}</span> <span class="ar">↓</span></button></div>
  <div class="wall-foot"><a class="btn btn-bottle" href="{_GMAPS}" target="_blank" rel="noopener">Read all reviews on Google <span class="ar">→</span></a></div>
</div></section>

<section class="sec oat gut"><div class="wrap k-split share">
  <div class="k-media land share-img" data-k="clip" data-slot="REAL · a member at the club"><img src="img/his/yougotthis.webp" alt="A member sitting at a table in the club, under a sign that reads You got this" loading="lazy"></div>
  <div class="k-txt"><span class="k-label">Been to Boost Club?</span><h2 class="k-h" data-k="lines">Share your <span class="it">experience.</span></h2>
  <p class="k-lead">If you've visited Boost Club, your honest Google review helps other people make an informed decision. We don't ask for positive reviews. We ask for authentic ones.</p>
  <div class="row"><a class="btn btn-bottle" href="{_GWRITE}" target="_blank" rel="noopener">Leave a Google review <span class="ar">→</span></a></div>
  <div class="share-more"><span class="eyebrow" style="margin:0">More</span><a href="results.html"><b>Detailed client stories &amp; real results</b><span>Read detailed client stories and see transformations from the wider community on the results page.</span><span class="ar" aria-hidden="true">→</span></a></div></div>
</div></section>

<section class="sec on-dark gut endcta vend"><div class="wrap">
  <h2 class="h-xl" data-k="lines">Come for the scan. Stay for the <span class="it">people.</span></h2>
  <p class="lead muted">The first visit is free. Come in, get measured, see where you stand.</p>
  <div class="row"><a class="btn btn-brass" href="#" data-reserve>Start with your free consultation <span class="ar">→</span></a><a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener">Message on WhatsApp</a></div>
</div></section>'''

page("reviews.html", "Reviews", "", _body, css=STATS_CSS,
     head='\n<link rel="stylesheet" href="reviews/reviews.css">\n<script defer src="reviews/reviews.js"></script>')
