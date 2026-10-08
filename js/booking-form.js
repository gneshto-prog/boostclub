(function () {
  'use strict';
  // Free-consultation request (8 Oct 2026, Gabi's call): no self-booking, no calendar.
  // The visitor leaves name + phone (+ an optional "when suits you"); the request goes to
  // Netlify Forms (form "consultatie"), which emails Gabi, and he replies on WhatsApp.
  // Deliberately independent of /api/lead and /api/availability so it cannot fail on
  // missing server credentials again.
  var form = document.getElementById('booking-form');
  if (!form) return;
  var copy = {
    ro: 'Nu am putut trimite cererea. Încearcă din nou sau scrie-ne pe WhatsApp: +40 726 205 752.',
    en: 'We could not send your request. Please try again or message us on WhatsApp: +40 726 205 752.',
    ru: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp: +40 726 205 752.'
  };
  var lang = (document.documentElement.lang || 'ro').toLowerCase();
  var errorNode = document.createElement('div');
  errorNode.className = 'booking-submit-error';
  errorNode.setAttribute('role', 'alert');
  errorNode.tabIndex = -1;
  errorNode.hidden = true;
  form.prepend(errorNode);
  var pending = false;
  var submitButton = form.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = false;

  function field(name, value) {
    var input = form.querySelector('input[name="' + name + '"]');
    if (input) input.value = value || '';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    errorNode.hidden = true;
    pending = true;
    if (submitButton) submitButton.disabled = true;
    field('landing_page', location.pathname);
    field('click_id', (window.BoostAttribution && window.BoostAttribution.lastWhatsAppClickId && window.BoostAttribution.lastWhatsAppClickId()) || '');
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (response) {
      if (!response.ok) throw new Error('FORM_POST_' + response.status);
      if (window.BoostAnalytics) {
        window.BoostAnalytics.track('booking_completed', { onceKey: 'completed:' + Date.now() });
      }
      var success = document.getElementById('success-msg');
      if (success) {
        success.classList.add('visible');
        success.tabIndex = -1;
        success.focus();
      }
      form.hidden = true;
    }).catch(function () {
      pending = false;
      if (submitButton) submitButton.disabled = false;
      errorNode.textContent = copy[lang] || copy.ro;
      errorNode.hidden = false;
      errorNode.focus();
    });
  });
})();
