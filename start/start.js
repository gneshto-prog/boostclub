(function () {
  'use strict';
  var form = document.getElementById('start-form');
  if (!form) return;

  // Campaign tag for the CRM: "source/medium/campaign/content" from the ad URL's utm_* params.
  // Campaign labels only, no click ids, nothing stored in the browser.
  var params = new URLSearchParams(location.search);
  var clean = function (v) { return (v || '').replace(/[^\w .-]/g, '').slice(0, 60); };
  var tag = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(function (k) { return clean(params.get(k)); });
  if (tag.some(Boolean)) form.elements.campaign.value = tag.join('/');

  var errorBox = document.getElementById('form-error');
  function fail(message, field) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    if (field) field.focus();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.hidden = true;
    var name = form.elements.firstname;
    var phone = form.elements.phone;
    if (!name.value.trim()) return fail('Please add your first name.', name);
    if (phone.value.replace(/\D/g, '').length < 9) return fail('Please add a phone number we can reach on WhatsApp.', phone);

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      document.getElementById('success-name').textContent = ', ' + name.value.trim().split(' ')[0];
      form.hidden = true;
      document.getElementById('form-success').hidden = false;
      if (window.gtag) window.gtag('event', 'generate_lead', { form_name: 'start-en' });
    }).catch(function () {
      button.disabled = false;
      fail('Something went wrong. Please message us on WhatsApp instead.');
    });
  });
})();
