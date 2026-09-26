(function () {
  'use strict';
  document.querySelectorAll('[data-map-src]').forEach(function (button) {
    button.addEventListener('click', function () {
      var placeholder=button.closest('.map-consent');
      var frame=document.createElement('iframe');
      frame.src=button.dataset.mapSrc;
      frame.title=button.dataset.mapTitle || 'Google Maps';
      frame.referrerPolicy='no-referrer';
      frame.allowFullscreen=true;
      var directions=placeholder.querySelector('a');
      var fallback=document.createElement('p');
      fallback.className='small mt-2';
      if(directions)fallback.appendChild(directions);
      placeholder.parentElement.insertAdjacentElement('afterend',fallback);
      placeholder.replaceWith(frame);
    }, {once:true});
  });
})();
