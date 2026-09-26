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
})();
