/* Booking form — CRM first, then Netlify Forms archival. */
  (function () {
    var form       = document.getElementById('booking-form');
    var successMsg = document.getElementById('success-msg');
    var nameInput  = document.getElementById('prenume');
    var successName = document.getElementById('success-name');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!window.BoostBookingSlots.validate(form)) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      window.BoostLeadPipeline.submit(form).then(function (result) {
        if (successMsg) {
          successMsg.classList.add('visible');
          if (successName && nameInput) successName.textContent = nameInput.value.trim();
        }
        window.BoostBookingSlots.confirm(result);
      }).catch(function (error) {
        if (btn) btn.disabled = false;
        if (error && error.message === 'BOOKING_SLOT_UNAVAILABLE') window.BoostBookingSlots.refresh(form);
        alert(window.BoostBookingSlots.errorMessage(error));
      });
    });
  })();
