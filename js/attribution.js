(function () {
  "use strict";
  if (window.BoostAttribution) return;

  var STORAGE_KEY = "bc-attribution-v1";
  var TRACKED_PARAMS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "gclid", "gbraid", "wbraid"
  ];

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === "x" ? r : (r & 3 | 8);
      return v.toString(16);
    });
  }

  function readStored() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") || {};
    } catch (err) {
      return {};
    }
  }

  function writeStored(value) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch (err) { /* no-op */ }
  }

  function captureLanding() {
    var stored = readStored();
    var params = new URLSearchParams(location.search);
    TRACKED_PARAMS.forEach(function (key) {
      if (!stored[key] && params.get(key)) stored[key] = params.get(key).slice(0, 300);
    });
    if (!stored.landing_page) stored.landing_page = location.pathname;
    if (!stored.referrer && document.referrer) stored.referrer = document.referrer.slice(0, 500);
    if (!stored.first_seen_at) stored.first_seen_at = new Date().toISOString();
    writeStored(stored);
    return stored;
  }

  function track(action, label, params) {
    if (typeof window.bcTrack === "function") {
      window.bcTrack(action, label, params || {});
      return;
    }
    try {
      var payload = Object.assign({ event_label: label || "" }, params || {});
      if (typeof window.gtag === "function") window.gtag("event", action, payload);
      else if (window.dataLayer) window.dataLayer.push(Object.assign({ event: action }, payload));
    } catch (err) { /* no-op */ }
  }

  var attribution = captureLanding();

  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest('a[href*="wa.me/"]') : null;
    if (!link) return;

    var clickId = "bc-" + uuid();
    try {
      var url = new URL(link.href, location.href);
      var original = url.searchParams.get("text") || "";
      original = original.replace(/\n\nRef Boost Club: bc-[0-9a-f-]+[^\n]*/gi, "");
      url.searchParams.set("text", original + "\n\nRef Boost Club: " + clickId + " · " + location.pathname);
      link.href = url.toString();
      link.dataset.bcClickId = clickId;
    } catch (err) { /* keep the original link usable */ }

    attribution.last_whatsapp_click_id = clickId;
    attribution.last_whatsapp_page = location.pathname;
    writeStored(attribution);
    track("whatsapp_click", location.pathname, {
      click_id: clickId,
      page_path: location.pathname
    });
  }, true);

  window.BoostAttribution = {
    current: function () { return Object.assign({}, attribution); },
    newId: uuid,
    track: track
  };
})();
