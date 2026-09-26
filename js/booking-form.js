(function () {
  'use strict';
  var form = document.getElementById('booking-form');
  if (!form) return;
  var errorNode = document.createElement('div');
  errorNode.className = 'booking-submit-error';
  errorNode.setAttribute('role', 'alert');
  errorNode.tabIndex = -1;
  errorNode.hidden = true;
  form.prepend(errorNode);
  var pending = false;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending || !window.BoostBookingSlots.validate(form)) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    errorNode.hidden = true;
    var button = form.querySelector('[type="submit"]');
    pending = true;
    if (button) button.disabled = true;
    window.BoostLeadPipeline.submit(form).then(function (result) {
      // Validate the server confirmation before showing any success state.
      var redirecting = window.BoostBookingSlots.confirm(result);
      if (redirecting) return;
      // A blocked sessionStorage must not turn a confirmed booking into an error.
      var success = document.getElementById('success-msg');
      if (success) {
        success.classList.add('visible');
        success.tabIndex = -1;
        var detail = document.createElement('p');
        detail.textContent = new Intl.DateTimeFormat(document.documentElement.lang, {
          dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Bucharest'
        }).format(new Date(result.calendarStartAt)) + ' · Strada Sevastopol 24';
        success.appendChild(detail);
        success.focus();
      }
      form.hidden = true;
    }).catch(function (error) {
      pending = false;
      if (button) button.disabled = false;
      if (error.message === 'BOOKING_SLOT_UNAVAILABLE') window.BoostBookingSlots.refresh(form);
      errorNode.textContent = window.BoostBookingSlots.errorMessage(error);
      errorNode.hidden = false;
      errorNode.focus();
    });
  });
})();
