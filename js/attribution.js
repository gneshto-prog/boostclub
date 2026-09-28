(function () {
  'use strict';
  if (window.BoostAttribution) return;
  var key = 'bc-attribution-v1';
  var fields = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'];
  function permitted() {
    var consent = window.BoostConsent && window.BoostConsent.current();
    return consent && consent.analytics && consent.marketing;
  }
  function current() {
    if (!permitted()) { try { sessionStorage.removeItem(key); } catch (_) {} return {}; }
    var result = {};
    try { result = JSON.parse(sessionStorage.getItem(key) || '{}'); } catch (_) {}
    var params = new URLSearchParams(location.search);
    fields.forEach(function (name) {
      var value = params.get(name);
      if (value && /^[\w .-]{1,150}$/.test(value)) result[name] = value;
    });
    // Never retain query strings or a full external referrer URL.
    result.landing_page = location.pathname;
    try { if (document.referrer) result.referrer = new URL(document.referrer).origin; } catch (_) {}
    try { sessionStorage.setItem(key, JSON.stringify(result)); } catch (_) {}
    return result;
  }
  function newId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});
  }
  window.BoostAttribution = { current: current, newId: newId, track: function (event) {
    return window.BoostAnalytics ? window.BoostAnalytics.track(event) : false;
  } };
  window.addEventListener('boost:consent',current);
  current();

  // First-party reference in the WhatsApp message the visitor sends themselves,
  // so website leads can be found in WhatsApp. Kept in memory only, never stored
  // and never sent to analytics, so it does not depend on consent.
  var lastClickId = '';
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a[href*="wa.me/"]') : null;
    if (!link) return;
    try {
      var url = new URL(link.href, location.href);
      var text = (url.searchParams.get('text') || '').replace(/\n*Ref Boost Club: bc-[0-9a-f-]+[^\n]*/gi, '');
      lastClickId = 'bc-' + newId();
      url.searchParams.set('text', (text ? text + '\n\n' : '') + 'Ref Boost Club: ' + lastClickId + ' · ' + location.pathname);
      link.href = url.toString();
    } catch (_) { /* keep the original link usable */ }
  }, true);
  window.BoostAttribution.lastWhatsAppClickId = function () { return lastClickId; };
})();
