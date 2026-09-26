(function () {
  'use strict';
  if (window.BoostAnalytics) return;
  // No destination, cookies, storage or network requests are installed here.
  // An approved consent manager must supply consent and an approved adapter.
  var consent = { analytics: false, marketing: false };
  var sink = null;
  var sent = new Set();
  var started = new WeakSet();
  var events = new Set(['booking_cta_click','whatsapp_click','phone_click','directions_click',
    'booking_started','booking_completed','reviews_viewed','results_viewed',
    'partner_program_viewed','partner_lead_started','partner_lead_completed']);
  var language = /^(en|ru)$/.test(document.documentElement.lang) ? document.documentElement.lang : 'ro';
  var slug = location.pathname.split('/').filter(Boolean).pop() || 'index';
  if (['ro','en','ru'].includes(slug)) slug = 'index';
  var knownPages = new Set(['index','consultatie-gratuita','cum-functioneaza','recenzii','rezultate','gabriel','gabi','contact','business','ambasador','cookies','confidentialitate','termeni','multumim']);
  var pagePath = knownPages.has(slug) ? (language === 'ro' ? '/' : '/' + language + '/') + (slug === 'index' ? '' : slug) : '/404';

  function track(name, options) {
    if (!consent.analytics || !sink || !events.has(name)) return false;
    var key = options && options.onceKey;
    if (key && sent.has(key)) return false;
    var payload = { language: language, page_path: pagePath };
    try {
      sink(name, payload);
      if (key) sent.add(key);
      return true;
    } catch (_) { return false; }
  }
  function view() {
    var event = { recenzii: 'reviews_viewed', rezultate: 'results_viewed', business: 'partner_program_viewed' }[slug];
    if (event) track(event, { onceKey: event });
  }
  window.BoostConsent = {
    current: function () { return Object.assign({}, consent); },
    update: function (next) {
      consent = { analytics: next && next.analytics === true, marketing: next && next.marketing === true };
      window.dispatchEvent(new CustomEvent('boost:consent', { detail: Object.assign({}, consent) }));
      view();
    }
  };
  window.BoostAnalytics = {
    track: track,
    setSink: function (adapter) { sink = typeof adapter === 'function' ? adapter : null; view(); }
  };
  // Compatibility contract; arbitrary labels/params are deliberately not forwarded.
  window.bcTrack = function (name) { return track(name); };
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (url.protocol === 'tel:') track('phone_click');
    else if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') track('whatsapp_click');
    else if (url.hostname === 'maps.app.goo.gl' || url.hostname === 'g.page' || (url.hostname.endsWith('google.com') && url.pathname.startsWith('/maps'))) track('directions_click');
    else if (url.origin === location.origin && (/\/consultatie-gratuita(?:\.html)?$/.test(url.pathname) || (slug === 'consultatie-gratuita' && /^#(?:form|formular)$/.test(url.hash)))) track('booking_cta_click');
  }, true);
  document.addEventListener('focusin', function (event) {
    var form = event.target.closest ? event.target.closest('form') : null;
    if (!form || started.has(form)) return;
    var name = form.id === 'booking-form' ? 'booking_started' : form.getAttribute('name') === 'partner-lead' ? 'partner_lead_started' : null;
    if (name && track(name)) started.add(form);
  });
})();
