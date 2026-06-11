// ===== BOOST CLUB — main.js =====
// Small, simple scripts. Nothing heavy — speed is a feature.

// 1. Mobile menu open/close
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  // close menu after tapping a link
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );
}

// 2. FAQ accordions (used from Phase 4 onward)
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  });
});

// 3. Auto-update the year in the footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
