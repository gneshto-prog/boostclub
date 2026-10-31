s=open('site.js').read()
def rep(a,b,cnt=1):
    global s
    if a not in s: raise SystemExit('MISSING: '+a[:90])
    s=s.replace(a,b,cnt)
rep("var LINKS=[,'scan'],","var LINKS=[['free-scan.html','Free consultation','scan'],")
rep("var inner = l[2]==='fit' ? '<img class=\"bfl d\" src=\"brand/boostfit-on-dark.svg\" alt=\"Boost Fit\"><img class=\"bfl l\" src=\"brand/boostfit-on-light.svg\" alt=\"Boost Fit\">' : l[1];",
    "var inner = l[2]==='fit' ? '<img class=\"bfl d\" src=\"'+P+'brand/boostfit-on-dark.svg\" alt=\"Boost Fit\"><img class=\"bfl l\" src=\"'+P+'brand/boostfit-on-light.svg\" alt=\"Boost Fit\">' : T(l[1]);")
rep("'<div class=\"r\"><span class=\"lang\">RO · <b>EN</b> · RU</span><a class=\"btn btn-brass btn-sm\" href=\"#\" data-reserve>Reserve a visit</a><button class=\"mb\" aria-label=\"Open menu\" aria-expanded=\"false\"><i></i></button></div>';",
    "'<div class=\"r\"><span class=\"lang\">'+['ro','en','ru'].map(function(l){ return l===LANG?'<b>'+l.toUpperCase()+'</b>':'<a href=\"'+langHref(l)+'\" hreflang=\"'+l+'\">'+l.toUpperCase()+'</a>'; }).join(' · ')+'</span><a class=\"btn btn-brass btn-sm\" href=\"#\" data-reserve>'+T('Reserve a visit')+'</a><button class=\"mb\" aria-label=\"'+T('Open menu')+'\" aria-expanded=\"false\"><i></i></button></div>';")
rep("'<a class=\"brand\" href=\"index.html\" aria-label=\"Boost Club home\"><img class=\"c\" src=\"img/wm-cream.png\" alt=\"Boost Club\"><img class=\"d\" src=\"img/wm-dark.png\" alt=\"Boost Club\"></a>'+",
    "'<a class=\"brand\" href=\"index.html\" aria-label=\"Boost Club home\"><img class=\"c\" src=\"'+P+'img/wm-cream.png\" alt=\"Boost Club\"><img class=\"d\" src=\"'+P+'img/wm-dark.png\" alt=\"Boost Club\"></a>'+")
rep("sheet.innerHTML='<div class=\"top\"><img src=\"img/wm-cream.png\" alt=\"Boost Club\"><button class=\"x\" aria-label=\"Close menu\">✕</button></div><nav aria-label=\"Menu\">'+",
    "sheet.innerHTML='<div class=\"top\"><img src=\"'+P+'img/wm-cream.png\" alt=\"Boost Club\"><button class=\"x\" aria-label=\"'+T('Close menu')+'\">✕</button></div><nav aria-label=\"Menu\">'+")
rep("map(function(l){return '<a href=\"'+l[0]+'\">'+(l[2]==='fit'?'<img src=\"brand/boostfit-on-dark.svg\" alt=\"Boost Fit\" style=\"height:.62em;width:auto;display:inline-block;vertical-align:baseline\">':l[1])+'</a>'}).join('')+",
    "map(function(l){return '<a href=\"'+l[0]+'\">'+(l[2]==='fit'?'<img src=\"'+P+'brand/boostfit-on-dark.svg\" alt=\"Boost Fit\" style=\"height:.62em;width:auto;display:inline-block;vertical-align:baseline\">':T(l[1]))+'</a>'}).join('')+")
rep("'</nav><div class=\"bot\"><span>RO · <b style=\"color:var(--brass)\">EN</b> · RU</span><span>+40 726 205 752</span></div>';",
    "'</nav><div class=\"bot\"><span>'+['ro','en','ru'].map(function(l){ return l===LANG?'<b style=\"color:var(--brass)\">'+l.toUpperCase()+'</b>':'<a href=\"'+langHref(l)+'\" style=\"text-decoration:none\">'+l.toUpperCase()+'</a>'; }).join(' · ')+'</span><span>+40 726 205 752</span></div>';")
rep("l.rel=x[0]; l.href=x[1];","l.rel=x[0]; l.href=P+x[1];")
rb_old=s[s.index("    f.innerHTML='<div class=\"mini\">"):s.index("    B.appendChild(f);\n  }")]
rb_new="""    var O=function(v){ return '<option value="'+v+'">'+T(v)+'</option>'; };
    f.innerHTML='<div class="mini">'+T('Free body scan')+'<small>'+T('25 to 30 min · we confirm on WhatsApp')+'</small></div>'+
      '<label><span>'+T('Experience')+'</span><select name="exp">'+['Free body scan + consultation','Shake at the club','Boost Fit, Sunday'].map(O).join('')+'</select></label>'+
      '<label><span>'+T('Day')+'</span><select name="day">'+['Tomorrow','Monday','Tuesday','Wednesday','Thursday','Friday','Sunday'].map(O).join('')+'</select></label>'+
      '<label><span>'+T('Time')+'</span><select name="time">'+['Morning','Midday','Evening'].map(O).join('')+'</select></label>'+
      '<label><span>'+T('Language')+'</span><select name="lang"><option>English</option><option>Română</option><option>Русский</option></select></label>'+
      '<button class="btn btn-brass" type="submit">'+T('Reserve')+' <span class="ar">→</span></button>';
"""
s=s.replace(rb_old,rb_new,1)
rep("location.href='free-scan.html?when='+encodeURIComponent(d+', '+t+(x.indexOf('Free')===0?'':' · '+x))+'#book'; return;",
    "location.href='free-scan.html?when='+encodeURIComponent(T(d)+', '+T(f.time.value).toLowerCase()+(x.indexOf('Free')===0?'':' · '+T(x)))+'#book'; return;")
ft_old=s[s.index("    ft.innerHTML='<div class=\"wrap\"><div class=\"cols\">"):s.index("    B.appendChild(ft);")]
ft_new=ft_old
for a in ['Boost Club','Strada Sevastopol 24, Sector 1, Bucharest','5 minutes from Piața Victoriei','The club','People','Hours','Free consultation','How it works','Shake menu','Boost Fit','Bring a friend','Results','Reviews','About Gabriel','Visit','Photo options →','Saturday closed','Sunday 10:00 to 18:00','Business partnership →','Independent Herbalife Distributor. Boost Club provides wellness guidance and educational consultations. Consultations do not diagnose, treat or replace medical care. Results vary from person to person. · Privacy · Terms · Cookies']:
    ft_new=ft_new.replace('>'+a+'<',">'+T('"+a.replace("'","\\'")+"')+'<")
ft_new=ft_new.replace("Mon to Fri 07:00 to 20:00/21:00<br>","'+T('Mon to Fri 07:00 to 20:00/21:00')+'<br>").replace('Bucharest<br>5 minutes from Piața Victoriei',"Bucharest<br>'+T('5 minutes from Piața Victoriei')+'")
ft_new=ft_new.replace('src="brand/','src="\'+P+\'brand/').replace('src="img/','src="\'+P+\'img/')
s=s.replace(ft_old,ft_new,1)
rep("bt.textContent='Show photo slots';","bt.textContent=T('Show photo slots');")
rep("sb.textContent='Show photo slots';","sb.textContent=T('Show photo slots');")
rep("sb.textContent=B.classList.contains('slots')?'Hide photo slots':'Show photo slots';","sb.textContent=T(B.classList.contains('slots')?'Hide photo slots':'Show photo slots');")
rep("say('Concept only. Live, this sends the request and Gabriel messages you on WhatsApp.');","say(T('Concept only. Live, this sends the request and Gabriel messages you on WhatsApp.'));")
rep("src=\"cups/'+s.id+'.webp\" alt=\"\" aria-hidden=\"true\"><img class=\"cup\" src=\"cups/'+s.id+'.webp\"","src=\"'+P+'cups/'+s.id+'.webp\" alt=\"\" aria-hidden=\"true\"><img class=\"cup\" src=\"'+P+'cups/'+s.id+'.webp\"")
rep("<img src=\"'+s.shot+'\"","<img src=\"'+P+s.shot+'\"")
rep("<p>'+s.d+'</p><a class=\"go\" href=\"menu.html\">See it on the menu →</a>","<p>'+T(s.d)+'</p><a class=\"go\" href=\"menu.html\">'+T('See it on the menu →')+'</a>")
rep("<span>Signature '+String(i+1).padStart(2,'0')+'</span><span>18 on the menu</span>","<span>'+T('Signature')+' '+String(i+1).padStart(2,'0')+'</span><span>'+T('18 on the menu')+'</span>")
rep("<div class=\"d\">'+s.d+'</div></a>'","<div class=\"d\">'+T(s.d)+'</div></a>'")
open('site.js','w').write(s); print('ok')
