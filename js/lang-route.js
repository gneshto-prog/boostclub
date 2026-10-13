// Language routing (13 Oct 2026): English is the root site. A phone whose first language is
// Romanian lands on /ro/ automatically, unless the visitor has picked a language on the switcher.
(function () {
  'use strict';
  var KEY = 'bc_lang';
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[hreflang]');
    if (link && /^(ro|en|ru)$/.test(link.getAttribute('hreflang'))) save(link.getAttribute('hreflang'));
  }, true);

  var path = location.pathname;
  if (/^\/(ro|ru)(\/|$)/.test(path)) return;
  if (/bot|crawl|spider|slurp|lighthouse|preview/i.test(navigator.userAgent || '')) return;
  var choice = saved();
  var first = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
  if (choice === 'ro' || (!choice && first.indexOf('ro') === 0)) {
    location.replace('/ro' + (path === '/' ? '/' : path.replace(/\.html$/, '')) + location.search + location.hash);
  }
})();
