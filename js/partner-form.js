(function () {
  'use strict';
  var form = document.getElementById('leadForm');
  if (!form) return;
  var copy = {
    ro: 'Nu am putut trimite cererea. Încearcă din nou sau scrie-ne direct pe WhatsApp ori sună la +40 726 205 752.',
    en: 'We could not send your enquiry. Please try again, or message us directly on WhatsApp or call +40 726 205 752.',
    ru: 'Не удалось отправить запрос. Попробуйте ещё раз или напишите нам в WhatsApp либо позвоните по номеру +40 726 205 752.'
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
