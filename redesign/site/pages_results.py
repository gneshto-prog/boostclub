# Results page (overrides the base version in build.py). Runs inside build.py's globals.
# Pairs are the live site's results-wall cards (wider community, NOT Boost Club clients: set A is team
# material, set B is Liz's clients), split into separate before/after halves by crop + resize only.
# Captions = the figure printed on that card, in English. Never add a figure that is not on the card.
import json as _json, html as _html

_RS = _json.load(open(os.path.join(D, "results", "sizes.json")))
# id, caption printed on the live card (English), alt before, alt after
_PAIRS = [
    ("D17", "", "older man in a grey t-shirt and patterned shorts, front view", "the same man in a black t-shirt, same room"),
    ("A11", "Aug – Oct 2022", "woman in a black sports top and leggings, back view", "the same woman in the same outfit, back view"),
    ("A13", "−16 kg", "man in a light blue t-shirt standing in a living room", "the same man in a grey t-shirt standing in a garden"),
    ("D09", "", "woman in a black top, side view against a red curtain", "the same woman, side view, same curtain"),
    ("A06", "−31 kg · 5.5 months", "man in a blue t-shirt and shorts standing in a gym, front view", "the same man in a dark t-shirt and grey trousers, same spot"),
    ("D10", "−31 kg · 7 months", "woman taking a mirror selfie in a black sports top", "the same woman, mirror selfie in a black top"),
    ("C03", "−15 kg · 3 months", "young woman outdoors in a grey t-shirt", "the same woman, mirror selfie in a grey t-shirt"),
    ("D18", "−18 kg", "older man in a checked shirt, front view", "the same man in a light blue shirt, front view"),
    ("E05", "−9 kg", "woman taking a mirror selfie in a floral dress", "the same woman in the same floral dress"),
    ("D13", "Apr 2024 – Apr 2025", "woman in a white t-shirt and black leggings, front view", "the same woman in a white top and black shorts"),
    ("C05", "", "young woman in a black crop top and leggings, front view", "the same woman in a black sports top and shorts"),
    ("A12", "", "man by a swimming pool, shirtless, front view", "the same man, shirtless, indoors"),
    # 31 Oct (Gabi: "add ALL the transformations we have on this computer"): every other pair in
    # ~/Desktop/Boost Club Results Wall/manifest.json. Left out: A17 + E06 (Gabi's own, on his About page),
    # E03 (the same two photos as A07), D14 + A09 (a small child in the photos; site rule: no children added).
    ("D03", "", "heavy-set man in a dark sweatshirt and trousers, front view", "the same man in a dark suit and white shirt, front view"),
    ("A07", "Age 33 · now 37", "woman in a dark patterned dress, full length", "the same woman in a blue polka-dot dress, full length"),
    ("A16", "−60 kg", "woman in a patterned bikini on a beach", "the same woman in a white top, holding a red clutch"),
    ("C07", "−25 kg", "woman in a red suit, front view", "the same woman in a black sports top and leggings"),
    ("D11", "Age 38 · now 49", "woman in a blue bikini and white cap on a beach", "the same woman in a blue bikini on a beach, arms open"),
    ("A15", "Age 43 · now 49.5", "smiling woman in an orange t-shirt", "the same woman in a pink top, smiling"),
    ("C06", "Age 42 · now 60", "woman in a leopard-print top and jeans", "the same woman in a gold fringe dress"),
    ("D04", "Age 36 · now 45", "woman in a blue polo shirt", "the same woman in a pink sports top, holding dumbbells"),
    ("B09", "−13 kg", "woman with blonde hair in a white sleeveless dress", "the same woman in a striped top and dark trousers, outdoors"),
    ("E02", "−13 kg", "man in a grey sweatshirt", "the same man in a black t-shirt"),
    ("A01", "", "young man, shirtless, front view", "the same man, shirtless, against a green background"),
    ("D15", "", "man in a black t-shirt and denim shorts, outdoors", "the same man, shirtless, flexing in a home gym"),
    ("A08", "", "woman in black underwear, front view", "the same woman on a fitness competition stage, wearing a medal"),
    ("D05", "", "woman in a light blue sweatshirt and black trousers", "the same woman in a white blouse and dark skirt"),
    ("B05", "", "woman in a green dress and black leather jacket", "the same woman in a long black dress"),
    ("B11", "", "woman taking a mirror selfie in a tie-dye sweatshirt", "the same woman, mirror selfie in a teal t-shirt"),
    ("B10", "", "older woman in a light t-shirt with a shoulder bag", "the same woman in a white sleeveless top and white trousers"),
    ("B08", "", "woman in a lilac dress", "the same woman, mirror selfie in a patterned top and black leggings"),
    ("A03", "", "woman in a black sports top and purple leggings", "the same woman in a black crop top"),
    ("A05", "", "woman taking a mirror selfie in a black sports bra", "the same woman, mirror selfie in a black sports top"),
    ("B04", "", "woman in a striped sweater", "the same woman in a striped t-shirt and jeans"),
    ("D12", "", "young man, shirtless, in red shorts outdoors", "the same man, shirtless, mirror selfie"),
    ("A14", "", "man in a black polo shirt holding a skewer", "the same man in a green polo shirt holding a cup"),
    ("B01", "", "bearded man in a dark shirt", "the same man, mirror selfie in a white t-shirt"),
    ("B03", "", "man, shirtless, side view", "the same man, shirtless, front view"),
    ("B12", "", "woman in a black bra, selfie", "the same woman, mirror selfie in a black sports top"),
    ("B02", "", "man, shirtless, front view", "the same man, shirtless, mirror selfie"),
    ("C01", "", "woman in a bra, back view", "the same woman, back view, same wall"),
    ("C02", "Age 39 · now 51", "woman in a black outfit, full length", "the same woman in a navy top and white trousers, by a tree"),
    ("D01", "Oct 2023 – Nov 2024", "man in a pink tank top, outdoors", "the same man in a red tank top, in a gym"),
    ("D02", "Age 47 · now 48", "man in a white tank top", "the same man in a black tank top, smiling"),
    ("E01", "−30 kg · −35 kg", "a couple at an event, she holds a microphone", "the same couple in white, side by side"),
    ("D06", "", "man in a dark shirt, smiling, holding a glass", "the same man in a suit and tie"),
    ("D16", "", "close-up of an older man's face, with glasses", "close-up of the same man, with glasses"),
    ("D08", "", "pregnant woman in a black top and red shorts", "the same woman in a knit top and black leggings"),
    ("B07", "", "woman, back view", "the same woman, back view, in a sports top"),
    ("B06", "", "woman, side view, face covered by an emoji", "the same woman, side view, face covered by an emoji"),
    ("D19", "", "woman in red leggings, side view", "the same woman in blue leggings, side view"),
    ("A04", "", "two photos of a young man, back and side views", "two photos of the same man, front and side views"),
    ("D07", "", "close-up of a woman's face", "close-up of the same woman's face"),
    ("E04", "", "close-up of a woman's face, eyes covered by a bar", "close-up of the same woman's face"),
    ("C04", "", "close-up of the skin on a leg", "close-up of the same leg"),
    ("A02", "", "close-up of a fist with dry, cracked skin", "close-up of the same fist"),
]
_FEAT_IDS = ["A06", "D17", "D09", "A11"]   # the guy from pair 05 leads; all four stand full length in matching rooms
_FIRST = 16                                # tiles shown before "Show all"
_data = [dict(id=i, n=f"{k+1:02d}", cap=c, a=round(_RS[i]["w"] / _RS[i]["h"], 4),
              b=f"results/img/{i}-before.webp", f=f"results/img/{i}-after.webp",
              bs=f"results/img/{i}-before-s.webp", fs=f"results/img/{i}-after-s.webp",
              ab="Before: " + ab, af="After: " + af) for k, (i, c, ab, af) in enumerate(_PAIRS)]
_IDX = {p["id"]: k for k, p in enumerate(_data)}
_NFIG = sum(1 for p in _data if p["cap"])
_esc = _html.escape
_CT = "Community transformation"

_KNOB = '<svg viewBox="0 0 24 12" aria-hidden="true"><path d="M7 1 2 6l5 5M17 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def _ba(p, cls="", eager=False, mina=0):
    """The comparison slider: after underneath, before clipped on top, a focusable slider handle."""
    ld = ' fetchpriority="high"' if eager else ' loading="lazy"'
    w, h = _RS[p["id"]]["w"], _RS[p["id"]]["h"]
    a = max(p["a"], mina)
    mn = f' data-mina="{mina}"' if mina else ""
    return f'''<div class="ba {cls}" style="--a:{a};--p:50%" data-ba{mn}>
  <img class="ba-fill" src="{p["fs"]}" alt="" aria-hidden="true"{ld} draggable="false">
  <img class="ba-img ba-after" src="{p["f"]}" alt="{_esc(p["af"])}" width="{w}" height="{h}"{ld} draggable="false">
  <img class="ba-img ba-before" src="{p["b"]}" alt="{_esc(p["ab"])}" width="{w}" height="{h}"{ld} draggable="false">
  <span class="ba-tag ba-tb" aria-hidden="true">Before</span><span class="ba-tag ba-ta" aria-hidden="true">After</span>
  <div class="ba-line" aria-hidden="true"></div>
  <div class="ba-h" role="slider" tabindex="0" aria-label="Before and after comparison, transformation {p["n"]}" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Showing 50% before, 50% after"><span class="ba-ring" aria-hidden="true"></span><span class="ba-knob">{_KNOB}</span></div>
</div>'''

_feat = [_data[_IDX[i]] for i in _FEAT_IDS]
_f0 = _feat[0]
_picker = "".join(
    f'<button type="button" class="pk" data-i="{_IDX[p["id"]]}" aria-pressed="{"true" if k == 0 else "false"}" aria-label="Show transformation {p["n"]}{(", " + p["cap"]) if p["cap"] else ""}">'
    f'<span class="pk-i"><img src="{p["bs"]}" alt=""><img src="{p["fs"]}" alt=""></span><span class="pk-n">{p["n"]}</span></button>'
    for k, p in enumerate(_feat))

def _tile(k, p):
    hid = " hidden" if k >= _FIRST else ""
    fig = " fig" if p["cap"] else ""
    return f'''<li class="rg-t{fig}" style="--a:{p["a"]};flex-grow:{round(p["a"] * 200, 2)}" data-k="{k}"{hid}>
  <button type="button" class="rg-b" data-open="{k}" aria-haspopup="dialog" aria-label="Open transformation {p["n"]} in the comparison slider{(", " + p["cap"]) if p["cap"] else ""}">
    <span class="rg-pair"><span class="rg-h rg-bf"><img src="{p["bs"]}" alt="{_esc(p["ab"])}" loading="lazy" decoding="async"><i>Before</i></span><span class="rg-h rg-af"><img src="{p["fs"]}" alt="{_esc(p["af"])}" loading="lazy" decoding="async"><i>After</i></span></span>
    <span class="rg-cap"><span class="rg-n">{p["n"]}</span><span class="rg-c{"" if p["cap"] else " nofig"}">{p["cap"] or _CT}</span></span>
    <span class="rg-plus" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></span>
  </button>
</li>'''

_tiles = "".join(_tile(k, p) for k, p in enumerate(_data))
_strip = "".join(
    f'<button type="button" class="lb-th" data-go="{k}" aria-label="Show transformation {p["n"]}{(", " + p["cap"]) if p["cap"] else ""}"><img src="{p["fs"]}" alt="" loading="lazy"><span>{p["n"]}</span></button>'
    for k, p in enumerate(_data))

_STORIES = [
    ("Community", "I've been feeling much better since I started, and the community feels like a group of friends, not a typical nutrition place.", "Ionuț"),
    ("Energy", "Gabriel genuinely wants to help, not just sell. I use the shakes consistently and have more energy through the day.", "Alexandru"),
    ("Clarity", "Zero pressure. I left with a much better understanding of my health and started seeing noticeable improvements.", "Andrei"),
    ("Healthy weight loss", "The test gave me a clear starting point and Gabriel built a realistic plan with me. I've been coming ever since.", "Alex"),
]
_st0 = _STORIES[0]
_stories = (f'''<figure class="st-feat"><span class="st-mark" aria-hidden="true">“</span><span class="st-tag">{_st0[0]}</span><blockquote>"{_st0[1]}"</blockquote><figcaption><b>{_st0[2]}</b> · Shared on WhatsApp · published with permission</figcaption></figure>
  <div class="st-row" data-k="rise">'''
    + "".join(f'<figure><span class="st-i" aria-hidden="true">{k + 2:02d}</span><span class="st-tag">{t}</span><blockquote>"{q}"</blockquote><figcaption><b>{n}</b> · Shared on WhatsApp · published with permission</figcaption></figure>' for k, (t, q, n) in enumerate(_STORIES[1:]))
    + "</div>")

_body = f'''<section class="rx-hero night" aria-labelledby="rx-h1">
  <div class="rx-amb" aria-hidden="true"><img src="{_f0["fs"]}" alt="" class="on" data-amb><img src="{_f0["fs"]}" alt="" data-amb2></div>
  <div class="gut"><div class="wrap rx-grid">
    <div class="rx-copy">
      <span class="eyebrow">Real results</span>
      <h1 class="h-xl rx-h1" id="rx-h1" data-k="lines">Transformations</h1>
      <p class="lead sub">Transformations from our wider community, published with their consent. Results may vary from person to person.</p>
      <div class="row rx-ctas"><a class="btn btn-brass" href="#" data-reserve>Book the free assessment <span class="ar">→</span></a><a class="btn btn-ghost" href="#gallery">See all {len(_data)} ↓</a></div>
    </div>
    <figure class="rx-stage">
      {_ba(_f0, "ba-hero", eager=True, mina=0.36)}
    </figure>
    <div class="rx-side">
      <p class="rx-read"><span class="rx-n" data-cap-n>{_f0["n"]}</span><span class="rx-fig{"" if _f0["cap"] else " nofig"}" data-cap-t>{_f0["cap"] or _CT}</span></p>
      <div class="pks" role="group" aria-label="Featured transformations">{_picker}</div>
      <div class="rh-how"><span class="rh-k">How to read it</span><p>Drag the line, or focus it and use the arrow keys. Left is before, right is after.</p></div>
    </div>
  </div></div>
</section>

<section class="rg-sec" id="gallery">
  <div class="gut"><div class="wrap k-head rg-head">
    <div><span class="k-label">Community gallery</span><h2 class="k-h" data-k="lines">Side by <span class="it">side.</span></h2></div>
    <aside>{len(_data)} pairs from the wider community. Open any pair to compare it with the slider. Where a figure is shown, it is the one printed with that photo.</aside>
  </div>
  <div class="wrap rg-bar"><div class="rg-fl" role="group" aria-label="Filter the gallery"><button type="button" class="rg-f" data-f="all" aria-pressed="true">All <span class="rg-fn">{len(_data)}</span></button><button type="button" class="rg-f" data-f="fig" aria-pressed="false">With numbers <span class="rg-fn">{_NFIG}</span></button></div></div></div>
  <ol class="rg" id="rg">{_tiles}</ol>
  <div class="gut rg-more"><button type="button" class="btn btn-bottle rg-mb" data-more aria-controls="rg">Show all {len(_data)} <span class="ar" aria-hidden="true">↓</span></button></div>
  <div class="gut"><div class="wrap"><p class="small rg-disc">Results vary from person to person depending on starting point, consistency, nutrition, lifestyle and other individual factors. These images reflect personal experiences of people from the wider community and are not a guarantee of similar results.</p></div></div>
</section>

<section class="k-band rx-wall" data-slot="REAL · results wall at the club">
  <img src="img/results-wall-wide.jpg" alt="A young man looking at the wall of printed before and after photos inside Boost Club" loading="lazy" data-k="par">
  <div class="wrap gut"><div class="rx-wtx">
    <span class="k-label">At the club</span>
    <h2 class="k-h" data-k="lines">The results <span class="it">wall.</span></h2>
    <p class="k-lead">Inside the club on Strada Sevastopol 24, printed pairs from the wider community hang on one wall. Come and look at them up close.</p>
    <div class="row"><a class="btn btn-brass" href="#" data-reserve>Book the free assessment <span class="ar">→</span></a><a class="btn btn-ghost" href="{MAPS}" target="_blank" rel="noopener">Directions</a></div>
  </div></div>
</section>

<section class="sec oat gut st-sec"><div class="wrap">
  <div class="k-head"><div><span class="k-label">In their own words</span><h2 class="k-h" data-k="lines">Longer client <span class="it">stories.</span></h2></div>
  <aside>Testimonials sent to us directly by clients on WhatsApp, published with their permission.</aside></div>
  <div class="stories">{_stories}</div>
  <div class="st-foot"><p class="small muted">Results vary from person to person depending on starting point, consistency, lifestyle and other individual factors. The stories above reflect clients' personal experiences and are not a guarantee of similar results.</p>
  <a class="k-link" href="reviews.html">Read the Google reviews <span class="ar">→</span></a></div>
</div></section>

<section class="sec on-dark gut endcta rx-end"><div class="wrap">
  <h2 class="h-xl" data-k="lines">Start your own <span class="it">story.</span></h2>
  <p class="lead muted">The first visit is free. Come in, get measured, see where you stand.</p>
  <div class="row"><a class="btn btn-brass" href="#" data-reserve>Book the free assessment <span class="ar">→</span></a><a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener">Message on WhatsApp</a></div>
</div></section>

<dialog class="lb" id="lb" aria-labelledby="lb-t">
  <div class="lb-amb" aria-hidden="true"><img src="{_data[0]["fs"]}" alt="" data-lb-amb></div>
  <div class="lb-in">
    <div class="lb-top"><p class="lb-t" id="lb-t"><span class="lb-n" data-lb-n>01</span> <span class="lb-c" data-lb-c></span></p><span class="lb-ct" data-lb-ct aria-live="polite"></span><button type="button" class="lb-x" data-lb-close aria-label="Close comparison"><span aria-hidden="true">✕</span></button></div>
    <div class="lb-mid">
      <button type="button" class="lb-nav lb-prev" data-lb-prev aria-label="Previous transformation"><span aria-hidden="true">←</span></button>
      <div class="lb-stage">{_ba(_data[0], "ba-lb", mina=0.4)}</div>
      <button type="button" class="lb-nav lb-next" data-lb-next aria-label="Next transformation"><span aria-hidden="true">→</span></button>
    </div>
    <div class="lb-bot"><div class="lb-strip" role="group" aria-label="Community gallery">{_strip}</div><p class="lb-note">Community result, published with consent. Results may vary from person to person.</p></div>
  </div>
</dialog>
<script type="application/json" id="pairs">{_json.dumps(_data, ensure_ascii=False)}</script>'''

page("results.html", "Results", "results", _body, light=False, cfg=' data-solid-at="0.1"',
     head='\n<link rel="stylesheet" href="results/results.css">\n<script defer src="results/results.js"></script>')
