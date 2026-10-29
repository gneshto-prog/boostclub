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
  // Carry utm_* from the landing URL onto links to the consultation page, so a Google
  // listing visit that lands on the homepage still reaches the form tagged. Nothing is
  // stored; the tag only lives in the next URL (29 Oct 2026).
  function carryTags() {
    var params = new URLSearchParams(location.search), tags = [];
    fields.slice(0, 5).forEach(function (name) {
      var value = params.get(name);
      if (value && /^[\w .-]{1,150}$/.test(value)) tags.push([name, value]);
    });
    if (!tags.length) return;
    document.querySelectorAll('a[href*="consultatie-gratuita"]').forEach(function (link) {
      try {
        var url = new URL(link.getAttribute('href'), location.href);
        if (url.origin !== location.origin || url.searchParams.has('utm_source')) return;
        tags.forEach(function (tag) { url.searchParams.set(tag[0], tag[1]); });
        link.setAttribute('href', url.pathname + url.search + url.hash);
      } catch (_) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', carryTags);
  else carryTags();
  window.addEventListener('boost:consent',current);
  current();
})();
