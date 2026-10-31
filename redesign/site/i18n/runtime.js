/* Runtime pass for RO/RU pages: translates what site.js, results.js and reviews.js write without T()
   (body-scan labels, slider aria text, review filter message, a few aria-labels), localises
   WhatsApp prefills and live-site links, and keeps the photos.html working link pointing at the English page. */
(function(){
  var L='__LANG__', D=window.BC_T||{};
  function plural(n,one,few,many){ var a=n%10,b=n%100; if(a===1&&b!==11) return one; if(a>=2&&a<=4&&(b<10||b>=20)) return few; return many; }
  var IN={ro:{'all languages':'în toate limbile','English':'în engleză','Romanian':'în română','Russian':'în rusă','Ukrainian':'în ucraineană'},
          ru:{'all languages':'на всех языках','English':'на английском','Romanian':'на румынском','Russian':'на русском','Ukrainian':'на украинском'}}[L];
  var RX=[
    [/^Showing (\d+)% before, (\d+)% after$/, {ro:'$1% înainte, $2% după', ru:'$1% до, $2% после'}[L]],
    [/^Before and after comparison, transformation (\d+)$/, {ro:'Comparație înainte și după, transformarea $1', ru:'Сравнение до и после, трансформация $1'}[L]],
    [/^(\d+)% lean$/, {ro:'$1% masă slabă', ru:'$1% сух. масса'}[L]],
    [/^(.+) shake on a bold background$/, {ro:'Shake $1 pe fundal colorat', ru:'Шейк $1 на ярком фоне'}[L]],
    [/^Showing (\d+) reviews? in (.+)\.$/, function(m,n,w){ n=+n; w=IN[w]||w;
      return L==='ro' ? 'Se afișează '+n+' '+(n===1?'recenzie':(n%100>=20||n%100===0?'de recenzii':'recenzii'))+' '+w+'.'
                      : 'Показано '+n+' '+plural(n,'отзыв','отзыва','отзывов')+' '+w+'.'; }]
  ];
  function tr(s){
    var k=s.replace(/\s+/g,' ').trim(); if(!k||!/[A-Za-z]/.test(k)) return null;
    var t=D[k];
    if(t===undefined){ for(var i=0;i<RX.length;i++){ if(RX[i][0].test(k)){ t=k.replace(RX[i][0],RX[i][1]); break; } } }
    if(t===undefined||t===k) return null;
    var lead=s.match(/^\s*/)[0], trail=s.match(/\s*$/)[0];
    return lead+t+trail;
  }
  function foreign(el){ if(el&&el.closest&&el.closest('[data-i18n-keep]')) return true; var x=el&&el.closest&&el.closest('[lang]'); return x&&x!==document.documentElement&&x.getAttribute('lang')!==L; }
  var ATTR=['alt','aria-label','aria-valuetext','title','placeholder'];
  function fixEl(el){
    if(el.nodeType!==1||foreign(el)) return;
    ATTR.forEach(function(a){ var v=el.getAttribute(a); if(v){ var t=tr(v); if(t!==null) el.setAttribute(a,t); } });
    if(el.tagName==='A'){ fixLink(el); }
  }
  var LIVE={ro:'/ro/',ru:'/ru/'}[L];
  function fixLink(a){
    var h=a.getAttribute('href')||'';
    if(h==='photos.html'){ a.setAttribute('href','../photos.html'); return; }
    var m=h.match(/^(https:\/\/wa\.me\/\d+\?(?:[^#]*&)?text=)([^&#]*)(.*)$/);
    if(m){ try{ var en=decodeURIComponent(m[2]); var t=D[en.replace(/\s+/g,' ').trim()]; if(t) a.setAttribute('href',m[1]+encodeURIComponent(t)+m[3]); }catch(e){} return; }
    var b=h.match(/^https:\/\/boostclub\.ro\/(confidentialitate|termeni|cookies|business|recenzii|rezultate|contact|ambasador)\/?$/);
    if(b) a.setAttribute('href','https://boostclub.ro'+LIVE+b[1]);
  }
  function walk(root){
    if(!root) return;
    if(root.nodeType===3){ var p=root.parentNode; if(p&&!/^(SCRIPT|STYLE)$/.test(p.nodeName)&&!foreign(p)){ var t=tr(root.nodeValue); if(t!==null) root.nodeValue=t; } return; }
    if(root.nodeType!==1||/^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
    if(foreign(root)) return;
    fixEl(root);
    var tw=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null), n;
    while((n=tw.nextNode())){
      if(n.nodeType===1){ fixEl(n); }
      else { var pp=n.parentNode; if(pp&&!/^(SCRIPT|STYLE)$/.test(pp.nodeName)&&!foreign(pp)){ var tt=tr(n.nodeValue); if(tt!==null) n.nodeValue=tt; } }
    }
  }
  function start(){
    var ls=document.querySelector('select[name=lang]');
    if(ls){ [].forEach.call(ls.options,function(o){ o.setAttribute('data-i18n-keep',''); }); ls.value={ro:'Română',ru:'Русский'}[L]; }
    walk(document.body);
    if(!window.MutationObserver) return;
    new MutationObserver(function(ms){ ms.forEach(function(m){
      if(m.type==='childList') m.addedNodes.forEach(walk);
      else if(m.type==='characterData') walk(m.target);
      else if(m.type==='attributes'){ var v=m.target.getAttribute(m.attributeName); if(v){ var t=tr(v); if(t!==null) m.target.setAttribute(m.attributeName,t); } }
    }); }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTR});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
