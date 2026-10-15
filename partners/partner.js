// Partner pages: every WhatsApp button opens a 2-field sheet (first name + phone). The details go to
// Netlify Forms ("partner-page" -> CRM via submission-created), then WhatsApp opens with the partner,
// message pre-written. Without JS or <dialog>, the buttons are plain wa.me links.
(function () {
  'use strict';
  var sheet = document.getElementById('lead-sheet');
  var form = document.getElementById('partner-form');
  if (!sheet || !form || typeof sheet.showModal !== 'function') return;

  var errorBox = document.getElementById('form-error');
  var nameInput = form.elements.firstname;
  var phoneInput = form.elements.phone;

  function fail(message, field) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    if (field) field.focus();
  }

  // Romanian mobiles are 072-079 (071x is a typo at the tap); foreign numbers need a + or 00 prefix.
  function normalizePhone(raw) {
    var v = String(raw || '').replace(/[^\d+]/g, '');
    if (v.indexOf('00') === 0) v = '+' + v.slice(2);
    if (v.indexOf('+40') === 0) v = v.slice(3);
    else if (v.indexOf('40') === 0 && v.length === 11) v = v.slice(2);
    else if (v.charAt(0) === '+') return /^\+[1-9]\d{7,14}$/.test(v) ? { ok: v } : { err: 'phone' };
    if (v.charAt(0) === '0') v = v.slice(1);
    if (!/^\d{9}$/.test(v)) return { err: 'phone' };
    if (!/^7[2-9]/.test(v)) return { err: 'prefix' };
    return { ok: '+40' + v };
  }

  document.querySelectorAll('[data-open-sheet]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      errorBox.hidden = true;
      sheet.showModal();
      nameInput.focus();
    });
  });
  sheet.querySelector('[data-close]').addEventListener('click', function () { sheet.close(); });
  sheet.addEventListener('click', function (event) { if (event.target === sheet) sheet.close(); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.hidden = true;
    var name = nameInput.value.trim().replace(/\s+/g, ' ').slice(0, 60);
    if (!name) return fail(form.dataset.errName, nameInput);
    var phone = normalizePhone(phoneInput.value);
    if (phone.err) return fail(phone.err === 'prefix' ? form.dataset.errPrefix : form.dataset.errPhone, phoneInput);

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    var data = new FormData(form);
    data.set('firstname', name);
    data.set('phone', phone.ok);
    var sent = fetch('/', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    }).catch(function () {});
    var timeout = new Promise(function (resolve) { setTimeout(resolve, 1500); });

    Promise.race([sent, timeout]).then(function () {
      if (window.gtag) window.gtag('event', 'generate_lead', { form_name: 'partner-page', partner: form.elements.partner.value });
      var text = form.dataset.waText.replace('{name}', name);
      location.href = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(text);
      setTimeout(function () { button.disabled = false; sheet.close(); }, 800);
    });
  });
})();
