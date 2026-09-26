(function () {
  'use strict';
  var form = document.getElementById('leadForm');
  if (!form) return;
  var copy = {
    ro: 'Nu am putut confirma primirea cererii. Datele ar putea fi deja salvate. Încearcă din nou cu aceleași date sau contactează-ne pe WhatsApp ori la +40 726 205 752.',
    en: 'We could not confirm receipt of your enquiry. Your details may already be saved. Try again with the same details, or contact us on WhatsApp or +40 726 205 752.',
    ru: 'Не удалось подтвердить получение запроса. Данные могли уже сохраниться. Повторите попытку с теми же данными или свяжитесь с нами через WhatsApp либо по телефону +40 726 205 752.'
  };
  var error = document.createElement('p');
  error.className = 'lf-error'; error.setAttribute('role', 'alert'); error.tabIndex = -1; error.hidden = true;
  form.prepend(error);
  var pending = false;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending || !form.checkValidity()) { if (!pending) form.reportValidity(); return; }
    pending = true; error.hidden = true;
    var button = form.querySelector('[type="submit"]'); button.disabled = true;
    window.BoostLeadPipeline.submit(form).then(function () {
      form.hidden = true;
      var thanks = document.getElementById('leadThanks');
      if (thanks) { thanks.hidden = false; thanks.tabIndex = -1; thanks.focus(); }
    }).catch(function (failure) {
      pending = false; button.disabled = false;
      error.textContent = copy[document.documentElement.lang] || copy.ro;
      if (failure.requestId) error.textContent += ' (' + failure.requestId + ')';
      var link = document.createElement('a'); link.href = 'https://wa.me/40726205752'; link.textContent = ' WhatsApp';
      error.appendChild(link); error.hidden = false; error.focus();
    });
  });
})();
