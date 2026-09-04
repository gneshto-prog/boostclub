(function () {
    /* Preselect part/full-time from CTA buttons */
    document.querySelectorAll('[data-start]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-start');
        var radio = document.querySelector('input[name="start"][value="' + val + '"]');
        if (radio) radio.checked = true;
      });
    });

    /* Form submit — local preview; Netlify handles on deploy */
    var form = document.getElementById('ambasador-form');
    var successMsg = document.getElementById('success-msg');
    var nameInput = document.getElementById('prenume');
    var successName = document.getElementById('success-name');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        if (window.bcTrack) window.bcTrack('form_submit', form.getAttribute('name'));
        if (successMsg) {
          successMsg.classList.add('visible');
          if (successName && nameInput) successName.textContent = nameInput.value.trim();
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.style.display = 'none';
      }).catch(function () {
        if (btn) btn.disabled = false;
        alert('Nu am putut trimite cererea. Te rugăm să încerci din nou sau scrie-ne pe WhatsApp.');
      });
    });
  })();
