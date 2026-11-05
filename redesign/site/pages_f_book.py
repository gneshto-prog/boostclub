# Self-serve booking page book.html -> boostclub.ro/book (Gabi's pick "Own page (B)", 5 Nov 2026; v2 same day).
# Runs inside build.py's globals, after pages_b_visitflow.py (reuses its _FS_CSS card styles).
#   /book            pick a time (one screen, morning / afternoon / evening filter), name + phone, booked
#   /book?i=<token>  personal link Gabriel sends on WhatsApp: "Hi Ana", pick a time, one tap, booked
#   /book?m=<token>  their own "change or cancel" link from the confirmation
# APIs: /api/booking/slots, /api/booking/book, /api/booking/me (netlify/functions/booking-*.mts).
# Copy is DRAFT until Gabi OKs it. NOTE: the i18n engine rewrites JS string literals that equal a
# dictionary entry ('days' became 'de zile'), so JS keys here are non-words (bkp, bkf, ...).

_BK_WA_NUM = "40726205752"

_BK_BODY = f'''<section class="fs-book gut" id="book" data-k-calm aria-label="Book a time"><div class="wrap fs-grid">
  <div class="fs-intro">
    <span class="k-label">Free consultation</span>
    <h1 class="fs-h1">Pick your time for the free body <span class="it">scan.</span></h1>
    <p class="fs-sub">Free body composition scan and consultation · 30 minutes · Strada Sevastopol 24, near Piața Victoriei. Choose a time below and it is yours straight away.</p>
    <a class="bk-proof" href="reviews.html"><b>5.0</b> <span aria-hidden="true">★★★★★</span> <span>169 Google reviews</span></a>
    <div class="fs-ctas">{_VF_WAQ}</div>
  </div>

  <div class="fs-card">
  <div class="flow" id="bkflow">
    <div class="fs-cardhead"><span class="k-label" id="bk-kick">Booking</span><h2 class="fs-h2" id="bk-h">Choose a time</h2></div>
    <div class="prog bk-prog" aria-hidden="true"><i class="on"><b>01</b><span>Time</span></i><i><b>02</b><span>You</span></i></div>

    <div class="bk-load" id="bk-load" role="status"><span class="bk-spin" aria-hidden="true"></span><span>Loading free times…</span></div>
    <div class="bk-fail" id="bk-fail" hidden><p>Online booking is not available right now. Message us on WhatsApp and we will book you in.</p>{WAB}</div>
    <div class="bk-note" id="bk-note" hidden></div>

    <div class="bk-step" id="bk-pick" hidden>
      <div class="bk-filter" role="radiogroup" aria-label="Time of day">
        <label><input type="radio" name="bkpart" value="all" checked><span>Any time</span></label><label><input type="radio" name="bkpart" value="am"><span>Morning</span></label><label><input type="radio" name="bkpart" value="mid"><span>Afternoon</span></label><label><input type="radio" name="bkpart" value="pm"><span>Evening</span></label>
      </div>
      <div class="bk-days" id="bk-daylist" role="tablist" aria-label="Day"></div>
      <p class="bk-picked" id="bk-day-picked" aria-live="polite"></p>
      <div id="bk-sugg-wrap" hidden><p class="sl">Recommended</p><div class="bk-grid" id="bk-sugg"></div></div>
      <div class="bk-grid" id="bk-all"></div>
      <p class="bk-empty" id="bk-empty" hidden>No free times in this part of the day. Try another day or Any time.</p>
    </div>

    <form class="form bk-step" id="bkform" novalidate hidden aria-label="Your details">
      <p class="bk-picked bk-sel" id="bk-slot-picked"></p>
      <p class="vh" aria-hidden="true"><label>Leave this field empty <input name="website" tabindex="-1" autocomplete="off"></label></p>
      <div class="bk-who" id="bk-who">
        <div class="fs-two"><label for="bk-fn">First name *<input id="bk-fn" name="name" required placeholder="e.g. Maria" autocomplete="given-name"></label>
        <label for="bk-ph">Phone (WhatsApp) *<input id="bk-ph" name="phone" required placeholder="e.g. +40 722 000 000" autocomplete="tel" inputmode="tel"></label></div>
        <label for="bk-em">Email (optional, for a calendar invite)<input id="bk-em" name="email" type="email" placeholder="e.g. maria@gmail.com" autocomplete="email" inputmode="email"></label>
      </div>
      <fieldset class="fs-src"><legend>Main goal (optional)</legend><div class="chips">
        <label><input type="radio" name="goal" value="loss"><span>Lose weight</span></label><label><input type="radio" name="goal" value="muscle"><span>Build muscle</span></label><label><input type="radio" name="goal" value="energy"><span>More energy</span></label><label><input type="radio" name="goal" value="other"><span>Something else</span></label></div></fieldset>
      <fieldset class="fs-src"><legend>If the plan fits you, when would you like to start? (optional)</legend><div class="chips">
        <label><input type="radio" name="ready" value="now"><span>Right away</span></label><label><input type="radio" name="ready" value="weeks"><span>In the next few weeks</span></label><label><input type="radio" name="ready" value="curious"><span>Just curious for now</span></label></div></fieldset>
      <p class="small muted fs-note">We use these details to manage your booking and contact you about it. Read how your data is processed in our Privacy Policy.</p>
      <p class="err" id="bk-err" role="alert" hidden></p>
      <div class="row nav2"><button type="button" class="btn btn-ghost" id="bk-back">Back</button><button class="btn btn-brass" type="submit" id="bk-send">Book my free scan <span class="ar">→</span></button></div>
    </form>

    <div class="bk-step" id="bk-mine" hidden>
      <p class="bk-when" id="bk-mine-when"></p>
      <p class="muted">Boost Club, Strada Sevastopol 24, Sector 1, near Piața Victoriei.</p>
      <div class="row bk-acts"><button type="button" class="btn btn-bottle" id="bk-change">Change the time</button><button type="button" class="btn btn-ghost" id="bk-cancel">Cancel my visit</button></div>
      <div class="bk-confirm" id="bk-cancel-q" hidden><p>Cancel your visit? The time goes back to other people.</p><div class="row"><button type="button" class="btn btn-ghost" id="bk-cancel-no">Keep it</button><button type="button" class="btn btn-bottle" id="bk-cancel-yes">Yes, cancel</button></div></div>
      <p class="err" id="bk-mine-err" role="alert" hidden></p>
    </div>

    <div class="bk-step" id="bk-moveq" hidden>
      <p class="bk-picked bk-sel" id="bk-move-to"></p>
      <p class="err" id="bk-move-err" role="alert" hidden></p>
      <div class="row nav2"><button type="button" class="btn btn-ghost" id="bk-move-back">Back</button><button type="button" class="btn btn-brass" id="bk-move-yes">Move my visit <span class="ar">→</span></button></div>
    </div>

    <div class="done" id="bk-done" hidden tabindex="-1"><span class="big" aria-hidden="true">✓</span><h3 class="fs-h2" id="bk-done-h">You're booked.</h3>
      <p class="bk-when" id="bk-when"></p>
      <p class="muted">Boost Club, Strada Sevastopol 24, Sector 1, near Piața Victoriei.</p>
      <div class="bk-hi"><p><b>Last step: say hi on WhatsApp.</b> It takes one tap and Gabriel confirms your visit in the same chat.</p>
        <a class="btn btn-bottle bk-wa" id="bk-wa" href="#" target="_blank" rel="noopener">Say hi on WhatsApp</a></div>
      <div class="row bk-acts"><a class="btn btn-ghost" id="bk-gcal" href="#" target="_blank" rel="noopener">Add to Google Calendar</a><a class="btn btn-ghost" id="bk-ics" href="#" download="boost-club-visit.ics">Add to Apple / Outlook</a></div>
      <ul class="bk-links"><li><a href="{MAPS}" target="_blank" rel="noopener">Directions on Google Maps →</a></li><li><a href="how-it-works.html">How the visit works →</a></li><li id="bk-manage-li" hidden><a id="bk-manage" href="#">Need to change it? Change or cancel →</a></li></ul>
      <div class="bk-prep"><p><b>Before you come</b></p><p>Drink water normally on the day. Avoid alcohol or a lot of fluid a few hours before, it can affect the measurement. Light, comfortable clothes, no sportswear needed.</p></div>
    </div>

    <div class="done" id="bk-gone" hidden tabindex="-1"><h3 class="fs-h2">Your visit is cancelled.</h3>
      <p class="muted" style="margin-top:14px">Thank you for letting us know. Whenever you want a new time, pick one here.</p>
      <div class="row bk-acts"><a class="btn btn-brass" href="book.html">Pick a new time <span class="ar">→</span></a></div></div>
  </div>
  </div>

  <div class="fs-details">
    <dl class="fs-facts">
      <div><dt>Complete session</dt><dd>30 minutes</dd></div>
      <div><dt>Price</dt><dd>Free</dd></div>
      <div><dt>Explained in plain language</dt><dd>Results on the spot</dd></div>
      <div><dt>Strada Sevastopol 24</dt><dd>Piața Victoriei</dd></div>
    </dl>
    <div class="fs-info">
      <div class="fs-wa"><h3>Prefer WhatsApp?</h3><p>Message us directly and we'll find you a time.</p>{WAB}</div>
    </div>
  </div>
</div></section>'''

_BK_CSS = _FS_CSS + """
.bk-step{display:grid;gap:16px}
.bk-step[hidden],.bk-load[hidden],.bk-fail[hidden],.bk-note[hidden],.bk-prog[hidden],.bk-who[hidden]{display:none}
.bk-proof{display:inline-flex;align-items:center;gap:8px;margin-top:22px;color:var(--cream);text-decoration:none;font-size:14.5px}
.bk-proof b{font-size:17px}.bk-proof span[aria-hidden]{color:var(--brass);letter-spacing:.08em}.bk-proof span:last-child{color:rgba(244,239,230,.74);border-bottom:1px solid rgba(244,239,230,.3)}
.bk-load{display:flex;align-items:center;gap:12px;color:var(--stone);font-size:15px;padding:18px 0}
.bk-spin{width:18px;height:18px;border-radius:50%;border:2px solid var(--line-l);border-top-color:var(--leaf);animation:bkspin .8s linear infinite}
@keyframes bkspin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.bk-spin{animation:none}}
.bk-fail p,.bk-note p{margin:0 0 14px;color:var(--ink)}
.bk-note p{margin:0}
.bk-note{padding:16px 18px;border-radius:6px;background:var(--oat)}
.bk-filter{display:flex;flex-wrap:wrap;gap:6px}
.bk-filter label{position:relative}
.bk-filter input{position:absolute;opacity:0;pointer-events:none}
.bk-filter span{display:inline-flex;align-items:center;height:38px;padding:0 14px;border-radius:999px;border:1px solid var(--line-l);background:#fff;font-size:14px;font-weight:600;cursor:pointer}
.bk-filter input:checked+span{background:var(--bottle);border-color:var(--bottle);color:#fff}
.bk-filter input:focus-visible+span{outline:2px solid var(--brass);outline-offset:2px}
.bk-days{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(64px,1fr);gap:6px;overflow-x:auto;padding:2px 2px 6px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.bk-day{scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px;border-radius:6px;border:1px solid var(--line-l);background:#fff;font:inherit;color:var(--ink);cursor:pointer;min-width:64px}
.bk-day small{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--stone)}
.bk-day b{font-size:20px;font-weight:600;letter-spacing:-.03em;line-height:1.1}
.bk-day i{font-style:normal;font-size:11.5px;color:var(--stone)}
.bk-day[aria-selected=true]{background:var(--bottle);border-color:var(--bottle);color:#fff}
.bk-day[aria-selected=true] small,.bk-day[aria-selected=true] i{color:rgba(255,255,255,.75)}
.bk-day:disabled{opacity:.38;cursor:default}
.bk-day:focus-visible,.bk-t:focus-visible{outline:2px solid var(--brass);outline-offset:2px}
.bk-picked{margin:0;font-size:15px;font-weight:600;color:var(--leaf)}
.bk-sel{font-size:17px;color:var(--ink)}
.bk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px}
.bk-t{height:48px;border-radius:999px;border:1px solid var(--line-l);background:#fff;font:600 15px var(--display);font-variant-numeric:tabular-nums;color:var(--ink);cursor:pointer;transition:border-color .2s,background .2s}
.bk-t:hover{border-color:var(--leaf)}
.bk-t.sg{border-color:var(--leaf);background:rgba(31,107,79,.07)}
.bk-empty{margin:0;color:var(--stone);font-size:14.5px}
.bk-empty[hidden]{display:none}
.bk-when{margin:14px 0 6px;font-size:clamp(20px,1.8vw,26px);font-weight:600;letter-spacing:-.03em;line-height:1.2}
.bk-acts{margin:16px 0 4px;gap:10px;flex-wrap:wrap}
.bk-acts .btn{height:50px;padding:0 20px;font-size:15px}
.fs-card .done .bk-acts .btn-bottle,.fs-card .done .bk-wa,.bk-step .btn-bottle{color:#fff}.fs-card .done .bk-acts .btn-ghost{color:var(--ink)}
.bk-hi{margin:20px 0 6px;padding:18px;border-radius:6px;border:1px solid var(--leaf);background:rgba(31,107,79,.06)}
.bk-hi p{margin:0 0 14px;font-size:15px;line-height:1.5}
.bk-wa{height:52px;padding:0 22px;font-size:15.5px;width:100%;justify-content:center}
.bk-links{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:8px}
.bk-links a{color:var(--leaf);font-weight:600;text-decoration:none}
.bk-links a:hover{text-decoration:underline}
.bk-links li[hidden]{display:none}
.bk-prep{margin:20px 0 6px;padding:16px 18px;border-radius:6px;background:var(--oat)}
.bk-prep p{margin:0;font-size:14.5px;line-height:1.55}.bk-prep p+p{margin-top:6px}
.bk-confirm{padding:16px 18px;border-radius:6px;background:var(--oat)}
.bk-confirm p{margin:0 0 12px}
.bk-confirm[hidden]{display:none}
"""

_BK_JS = r"""  (function(){
  var T=window.BC_T_fn||function(x){return x;}, LANG=document.documentElement.lang||'en';
  var LOC={en:'en-GB',ro:'ro-RO',ru:'ru-RU'}[LANG]||'en-GB', TZ='Europe/Bucharest', WA='__WA__';
  var $=function(id){return document.getElementById(id);};
  var qs=new URLSearchParams(location.search), INV=qs.get('i'), MAN=qs.get('m');
  if(INV&&!/^[A-Za-z0-9_-]{16,64}$/.test(INV)) INV=null; if(MAN&&!/^[A-Za-z0-9_-]{16,64}$/.test(MAN)) MAN=null;
  var qpart=qs.get('part'), qwd=+(qs.get('wd')||0);
  var days=[], day=null, slot=null, part=/^(am|mid|pm)$/.test(qpart||'')?qpart:'all', mode='bkn', who='', key=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():null, busy=false;
  var prog=[].slice.call(document.querySelectorAll('#bkflow .bk-prog i'));
  var panes={bkp:$('bk-pick'),bkf:$('bkform'),bkm:$('bk-mine'),bkq:$('bk-moveq')};
  function fmt(iso,o){ o.timeZone=TZ; return new Intl.DateTimeFormat(LOC,o).format(new Date(iso)); }
  function noon(d){ return d+'T10:00:00Z'; }
  function longDay(d){ return fmt(noon(d),{weekday:'long',day:'numeric',month:'long'}); }
  function show(name,head){
    Object.keys(panes).forEach(function(k){ panes[k].hidden=(k!==name); });
    prog.forEach(function(p,i){ p.classList.toggle('on',i<=(name==='bkf'?1:0)); });
    document.querySelector('#bkflow .bk-prog').hidden=(name==='bkm');
    if(head) $('bk-h').textContent=head;
  }
  function note(html){ var n=$('bk-note'); n.innerHTML=html; n.hidden=!html; }
  function fail(){ $('bk-load').hidden=true; $('bk-fail').hidden=false; Object.keys(panes).forEach(function(k){ panes[k].hidden=true; }); }
  function inPart(t){ var h=+t.slice(0,2); return part==='all'||(part==='am'&&h<12)||(part==='mid'&&h>=12&&h<17)||(part==='pm'&&h>=17); }
  function load(){
    $('bk-load').hidden=false; $('bk-fail').hidden=true;
    return fetch('/api/booking/slots',{headers:{Accept:'application/json'}}).then(function(r){ return r.json(); }).then(function(j){
      $('bk-load').hidden=true;
      if(!j||!j.ok||!(j.days||[]).length){ fail(); return false; }
      days=j.days; drawDays(); return true;
    }).catch(function(){ fail(); return false; });
  }
  function drawDays(){
    var list=$('bk-daylist'); list.innerHTML=''; var first=null, pref=null;
    days.forEach(function(d){
      var n=d.slots.filter(function(s){return inPart(s.time);}).length;
      var b=document.createElement('button'); b.type='button'; b.className='bk-day'; b.setAttribute('role','tab');
      b.innerHTML='<small></small><b></b><i></i>';
      b.querySelector('small').textContent=fmt(noon(d.date),{weekday:'short'});
      b.querySelector('b').textContent=fmt(noon(d.date),{day:'numeric'});
      b.querySelector('i').textContent=fmt(noon(d.date),{month:'short'});
      b.setAttribute('aria-label',longDay(d.date)+', '+n);
      b.disabled=!n; b.dataset.date=d.date;
      b.addEventListener('click',function(){ pickDay(d); });
      list.appendChild(b); if(n&&!first) first=d;
      if(n&&qwd&&!pref){ var w=new Date(d.date+'T12:00:00Z').getUTCDay()||7; if(w===qwd) pref=d; }
    });
    if(pref){ first=pref; qwd=0; }
    var keep=day&&days.filter(function(x){return x.date===day.date&&x.slots.some(function(s){return inPart(s.time);});})[0];
    if(keep||first) pickDay(keep||first); else { $('bk-day-picked').textContent=''; $('bk-all').innerHTML=''; $('bk-sugg-wrap').hidden=true; $('bk-empty').hidden=false; }
  }
  function timeBtn(s,sg){
    var b=document.createElement('button'); b.type='button'; b.className='bk-t'+(sg?' sg':''); b.textContent=s.time;
    b.setAttribute('aria-label',longDay(day.date)+', '+s.time);
    b.addEventListener('click',function(){ pickSlot(s); }); return b;
  }
  function pickDay(d){
    day=d;
    [].forEach.call(document.querySelectorAll('.bk-day'),function(b){ var on=b.dataset.date===d.date; b.setAttribute('aria-selected',on?'true':'false'); });
    var list=d.slots.filter(function(s){return inPart(s.time);});
    $('bk-day-picked').textContent=longDay(d.date);
    var sg=list.filter(function(s){return s.nextToSit;}).slice(0,3);
    $('bk-sugg-wrap').hidden=!sg.length||list.length<6; $('bk-sugg').innerHTML=''; sg.forEach(function(s){ $('bk-sugg').appendChild(timeBtn(s,true)); });
    $('bk-all').innerHTML=''; list.forEach(function(s){ $('bk-all').appendChild(timeBtn(s,false)); });
    $('bk-empty').hidden=!!list.length;
  }
  [].forEach.call(document.querySelectorAll('input[name=bkpart]'),function(r){ r.checked=(r.value===part); r.addEventListener('change',function(){ part=r.value; drawDays(); }); });
  function hello(){ return who?T('Hi')+' '+who+'! ':''; }
  function pickSlot(s){
    slot=s; var label=longDay(day.date)+' · '+s.time;
    if(mode==='bkc'){ $('bk-move-to').textContent=T('Move your visit to')+' '+label+'?'; $('bk-move-err').hidden=true; show('bkq',T('Confirm the new time')); return; }
    $('bk-slot-picked').textContent=label+' · 30 min'; $('bk-err').hidden=true; show('bkf',who?hello()+T('Confirm your visit'):T('Your details'));
    if(!who) $('bk-fn').focus({preventScroll:true}); $('bkform').scrollIntoView({block:'nearest'});
  }
  $('bk-back').addEventListener('click',function(){ show('bkp',who?hello()+T('Pick your time'):T('Choose a time')); });
  try{ var g=qs.get('goal'); var gi=g&&document.querySelector('#bkform input[name=goal][value="'+g.replace(/[^a-z]/g,'')+'"]'); if(gi) gi.checked=true; }catch(e){}

  function phoneOk(v){
    var d=v.replace(/[^0-9+]/g,''); if(d.indexOf('00')===0) d='+'+d.slice(2); if(d.charAt(0)==='0') d='+40'+d.slice(1); if(d.charAt(0)!=='+'&&d.indexOf('40')===0) d='+'+d;
    if(!/^\+[1-9][0-9]{6,14}$/.test(d)) return false; return d.indexOf('+40')!==0||/^\+407[2-9][0-9]{7}$/.test(d);
  }
  function err(id,msg){ var e=$(id); e.textContent=msg; e.hidden=false; }
  function stamp(iso){ return iso.replace(/[-:]/g,'').replace(/\.\d{3}/,''); }
  function waHref(d,t){ return 'https://wa.me/'+WA+'?text='+encodeURIComponent(T('Hi! I just booked my free scan for {d} at {t}.').replace('{d}',d).replace('{t}',t)); }
  function finish(j,moved){
    var d=fmt(j.startAt,{weekday:'long',day:'numeric',month:'long'});
    $('bk-done-h').textContent=moved?T('Your visit is moved.'):T("You're booked.");
    $('bk-when').textContent=d+' · '+j.time;
    $('bk-wa').href=waHref(d,j.time);
    var title=T('Boost Club · free body scan'), loc='Boost Club, Strada Sevastopol 24, Sector 1, Bucuresti';
    var det=T('Free body composition scan and consultation, 30 minutes.')+' https://www.google.com/maps/dir/?api=1&destination=Strada+Sevastopol+24+Bucuresti';
    $('bk-gcal').href='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(title)+'&dates='+stamp(j.startAt)+'/'+stamp(j.endAt)+'&location='+encodeURIComponent(loc)+'&details='+encodeURIComponent(det);
    var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Boost Club//Booking//EN','BEGIN:VEVENT','UID:'+(key||Date.now())+'@boostclub.ro','DTSTAMP:'+stamp(new Date().toISOString()),'DTSTART:'+stamp(j.startAt),'DTEND:'+stamp(j.endAt),'SUMMARY:'+title,'LOCATION:'+loc.replace(/,/g,'\\,'),'DESCRIPTION:'+det.replace(/,/g,'\\,'),'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY','DESCRIPTION:'+title,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
    $('bk-ics').href='data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
    var m=j.manage||(MAN?location.href:null); $('bk-manage-li').hidden=!m; if(m) $('bk-manage').href=m;
    Object.keys(panes).forEach(function(k){ panes[k].hidden=true; }); note('');
    document.querySelector('#bkflow .bk-prog').hidden=true; document.querySelector('#bkflow .fs-cardhead').hidden=true;
    $('bk-done').hidden=false; $('bk-done').focus();
    try{ if(!moved){ if(window.fbq) fbq('track','Schedule'); if(window.gtag) gtag('event','book_appointment'); } }catch(e){}
  }

  $('bkform').addEventListener('submit',function(ev){
    ev.preventDefault(); if(busy||!slot) return;
    var f=ev.target, name=f.name.value.trim(), phone=f.phone.value.trim(), email=f.email.value.trim();
    if(!INV){
      if(name.length<2){ err('bk-err',T('Please write your first name.')); f.name.focus(); return; }
      if(!phoneOk(phone)){ err('bk-err',T('Please check your phone number, e.g. +40 722 000 000.')); f.phone.focus(); return; }
      if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err('bk-err',T('Please check your email, or leave it empty.')); f.email.focus(); return; }
    }
    if(!key){ err('bk-err',T('Your browser could not start the booking. Message us on WhatsApp and we will book you in.')); return; }
    var pick=function(n){ var x=f.querySelector('input[name='+n+']:checked'); return x?x.value:''; };
    busy=true; var btn=$('bk-send'); btn.disabled=true; $('bk-err').hidden=true;
    fetch('/api/booking/book',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      key:key, startAt:slot.startAt, name:name, phone:phone, email:email, goal:pick('goal'), ready:pick('ready'),
      lang:LANG, page:location.origin+location.pathname+location.search.replace(/([?&])(i|m)=[^&]*/g,'$1'), website:f.website.value, invite:INV||''
    })}).then(function(r){ return r.json().catch(function(){ return {ok:false}; }); }).then(function(j){
      busy=false; btn.disabled=false;
      if(j&&j.ok&&j.startAt){ finish(j,false); return; }
      var c=j&&j.code;
      if(c==='SLOT_TAKEN'){ err('bk-err',T('Someone just took that time. Please pick another one.')); load().then(function(ok){ if(ok) show('bkp'); }); return; }
      if(c==='ALREADY_BOOKED'){ err('bk-err',T('You already have a visit booked')+(j.day?': '+j.day+', '+j.time:'')+'. '+T('Need another time? Message us on WhatsApp.')); return; }
      if(c==='INVALID_INVITE'){ INV=null; who=''; $('bk-who').hidden=false; err('bk-err',T('This personal link has expired. Please add your name and phone.')); return; }
      if(c==='INVALID_PHONE'||c==='INVALID_INPUT'){ err('bk-err',T('Please check your phone number, e.g. +40 722 000 000.')); return; }
      err('bk-err',T('We could not book this online. Message us on WhatsApp and we will book you in.'));
    }).catch(function(){ busy=false; btn.disabled=false; err('bk-err',T('No connection. Please try again, or message us on WhatsApp.')); });
  });

  // ---- their own booking (?m=)
  function showMine(j){
    $('bk-kick').textContent=T('Your visit');
    if(j.state==='cancelled'){ Object.keys(panes).forEach(function(k){ panes[k].hidden=true; }); document.querySelector('#bkflow .fs-cardhead').hidden=true; document.querySelector('#bkflow .bk-prog').hidden=true; $('bk-gone').hidden=false; return; }
    $('bk-mine-when').textContent=fmt(j.startAt,{weekday:'long',day:'numeric',month:'long'})+' · '+j.time;
    $('bk-change').hidden=$('bk-cancel').hidden=(j.state!=='booked');
    if(j.state!=='booked') err('bk-mine-err',T('This visit can no longer be changed online. Message us on WhatsApp.'));
    if(j.state==='booked'&&!j.canMove) $('bk-change').hidden=true;
    show('bkm',(j.firstName?j.firstName+', ':'')+T('here is your visit'));
  }
  $('bk-change').addEventListener('click',function(){ mode='bkc'; load().then(function(ok){ if(ok) show('bkp',T('Pick a new time')); }); });
  $('bk-move-back').addEventListener('click',function(){ show('bkp',T('Pick a new time')); });
  $('bk-move-yes').addEventListener('click',function(){
    if(busy) return; busy=true; var b=this; b.disabled=true; $('bk-move-err').hidden=true;
    fetch('/api/booking/me',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({m:MAN,action:'move',startAt:slot.startAt})})
    .then(function(r){ return r.json().catch(function(){ return {ok:false}; }); }).then(function(j){
      busy=false; b.disabled=false;
      if(j&&j.ok){ finish(j,true); return; }
      var c=j&&j.code;
      if(c==='SLOT_TAKEN'){ err('bk-move-err',T('Someone just took that time. Please pick another one.')); return; }
      if(c==='TOO_MANY_CHANGES'){ err('bk-move-err',T('This visit was already changed several times. Message us on WhatsApp and we will sort it out.')); return; }
      err('bk-move-err',T('We could not change this online. Message us on WhatsApp and we will sort it out.'));
    }).catch(function(){ busy=false; b.disabled=false; err('bk-move-err',T('No connection. Please try again, or message us on WhatsApp.')); });
  });
  $('bk-cancel').addEventListener('click',function(){ $('bk-cancel-q').hidden=false; $('bk-cancel-yes').focus(); });
  $('bk-cancel-no').addEventListener('click',function(){ $('bk-cancel-q').hidden=true; });
  $('bk-cancel-yes').addEventListener('click',function(){
    if(busy) return; busy=true; var b=this; b.disabled=true;
    fetch('/api/booking/me',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({m:MAN,action:'cancel'})})
    .then(function(r){ return r.json().catch(function(){ return {ok:false}; }); }).then(function(j){
      busy=false; b.disabled=false;
      if(j&&j.ok){ showMine({state:'cancelled'}); return; }
      $('bk-cancel-q').hidden=true; err('bk-mine-err',T('We could not change this online. Message us on WhatsApp and we will sort it out.'));
    }).catch(function(){ busy=false; b.disabled=false; err('bk-mine-err',T('No connection. Please try again, or message us on WhatsApp.')); });
  });

  // ---- start
  if(MAN){
    fetch('/api/booking/me?m='+encodeURIComponent(MAN)).then(function(r){ return r.json(); }).then(function(j){
      $('bk-load').hidden=true;
      if(j&&j.ok){ showMine(j); return; }
      MAN=null; note('<p>'+T('This link is not valid any more. You can pick a new time below.')+'</p>'); load().then(function(ok){ if(ok) show('bkp',T('Choose a time')); });
    }).catch(fail);
  } else {
    var start=load();
    if(INV){
      Promise.all([start,fetch('/api/booking/me?i='+encodeURIComponent(INV)).then(function(r){ return r.json(); }).catch(function(){ return null; })]).then(function(v){
        var j=v[1];
        if(j&&j.ok){
          who=j.firstName||''; $('bk-who').hidden=true; $('bk-send').firstChild.nodeValue=T('Confirm my visit')+' ';
          if(j.openDay){ note('<p>'+T('You already have a visit booked')+': <b></b>. '+T('Need another time? Message us on WhatsApp.')+'</p>'); $('bk-note').querySelector('b').textContent=j.openDay+', '+j.openTime; }
          if(v[0]) show('bkp',hello()+T('Pick your time'));
        } else { INV=null; if(v[0]) show('bkp',T('Choose a time')); }
      });
    } else start.then(function(ok){ if(ok) show('bkp',T('Choose a time')); });
  }
  })();
""".replace("__WA__", _BK_WA_NUM)

DESC["book.html"] = "Pick your own time for a free body composition scan and consultation at Boost Club, Strada Sevastopol 24, near Piața Victoriei. 30 minutes."
page("book.html", "Book your free scan", "scan", _BK_BODY, css=_BK_CSS, js=_BK_JS, gsapjs=_FS_GSAP,
     light=False, cfg=' data-norbar="1" data-solid-at="0.12"')
