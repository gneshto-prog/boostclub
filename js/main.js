// ===== BOOST CLUB — main.js v3 "ALIVE" =====
// Vanilla, transform/opacity only, one IO + one rAF scroll loop.
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LEAF = '<path d="M2 22C2 10 10 2 22 2c0 12-8 20-20 20Z"/>';
  var SVGNS = "http://www.w3.org/2000/svg";

  function svgEl(cls, viewBox, inner) {
    var el = document.createElementNS(SVGNS, "svg");
    el.setAttribute("viewBox", viewBox);
    el.setAttribute("aria-hidden", "true");
    if (cls) el.setAttribute("class", cls);
    el.innerHTML = inner;
    return el;
  }

  /* ---------- 0. Intro curtain — once per session ---------- */
  if (!RM && !sessionStorage.getItem("bc-intro")) {
    sessionStorage.setItem("bc-intro", "1");
    var curtain = document.createElement("div");
    curtain.className = "curtain";
    curtain.setAttribute("aria-hidden", "true");
    curtain.innerHTML =
      '<div class="mark">B' +
      '<svg class="logo-leaf" viewBox="0 0 24 24"><path class="leaf-body" d="M2 22C2 10 10 2 22 2c0 12-8 20-20 20Z"/><path class="leaf-slash" d="M7.5 16.5l9-9"/></svg>' +
      '<svg class="logo-leaf" viewBox="0 0 24 24"><path class="leaf-body" d="M2 22C2 10 10 2 22 2c0 12-8 20-20 20Z"/><path class="leaf-slash" d="M7.5 16.5l9-9"/></svg>' +
      'st&nbsp;Club<span class="dot">.</span></div>';
    document.body.appendChild(curtain);
    var killCurtain = function () { curtain.classList.add("done"); };
    setTimeout(killCurtain, 1100);
    setTimeout(function () { if (curtain.parentNode) curtain.parentNode.removeChild(curtain); }, 1700);
    window.addEventListener("scroll", killCurtain, { once: true, passive: true });
  }

  /* ---------- 1. Header — transparent over dark hero, frosted on scroll ---------- */
  var header = document.querySelector(".site-header");
  var main = document.querySelector("main");
  var firstSection = main ? main.querySelector("section, .section-dark") : null;
  var hasDarkHero = !!(firstSection && firstSection.classList.contains("section-dark"));
  if (header && !hasDarkHero) header.classList.add("solid");

  /* ---------- 2. Decorate the dark hero: parallax leaves ---------- */
  var hero = hasDarkHero ? firstSection : null;
  if (hero) hero.classList.add("hero-enter");
  if (hero && !RM) {
    var l1 = svgEl("bg-leaf b1", "0 0 24 24", LEAF);
    var l2 = svgEl("bg-leaf b2", "0 0 24 24", LEAF);
    l1.setAttribute("data-speed", "-0.06");
    l2.setAttribute("data-speed", "0.05");
    hero.insertBefore(l2, hero.firstChild);
    hero.insertBefore(l1, hero.firstChild);
  }

  /* orbiting gold ring behind hero portrait */
  var heroFrame = hero ? hero.querySelector(".img-frame") : null;
  if (heroFrame && heroFrame.querySelector("img") && !RM) {
    heroFrame.appendChild(svgEl("orbit", "0 0 100 100",
      '<circle class="ring" cx="50" cy="50" r="48"/><circle class="sat" cx="50" cy="2" r="2.4"/>'));
  }

  /* ---------- 3. Organic wave dividers ---------- */
  var WAVE_D = "M0,70 C240,110 480,20 720,45 C960,70 1200,30 1440,60 L1440,110 L0,110 Z";
  function bgOf(el) {
    if (!el) return "";
    var bg = getComputedStyle(el).backgroundColor;
    return (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") ? "#F5F3EE" : bg;
  }
  function addWave(dark, where) {
    var sib = where === "after" ? dark.nextElementSibling : dark.previousElementSibling;
    if (sib && sib.classList && sib.classList.contains("section-dark")) return;
    var wave = svgEl("wave" + (where === "after" ? " wave-after" : ""), "0 0 1440 110",
      '<path d="' + WAVE_D + '"/>');
    wave.setAttribute("preserveAspectRatio", "none");
    var fill = bgOf(sib && sib.tagName !== "FOOTER" ? sib : null);
    wave.querySelector("path").setAttribute("fill", fill);
    if (where === "after") {
      dark.parentNode.insertBefore(wave, dark.nextSibling);
    } else {
      wave.style.transform = "rotate(180deg)";
      wave.style.marginBottom = "-1px";
      dark.parentNode.insertBefore(wave, dark);
    }
  }
  var darks = main ? [].slice.call(main.querySelectorAll(".section-dark")) : [];
  darks.forEach(function (d, i) {
    if (i === 0) { addWave(d, "after"); }
    else { addWave(d, "before"); if (d.nextElementSibling && d.nextElementSibling.tagName === "SECTION") addWave(d, "after"); }
  });

  /* ---------- 4. Auto-assign reveals ---------- */
  var REVEAL_SEL = [
    ".section-head", ".card", ".quote", ".step", ".faq-item", ".img-frame",
    ".trust-strip", ".review-story", ".cred-card", ".philosophy-card",
    ".step-card", ".highlight-band", ".apply-card", ".booking-card",
    ".wa-booking", ".map-wrap", ".photo-grid", ".criteria-card", ".contact-card"
  ].join(",");
  document.querySelectorAll(REVEAL_SEL).forEach(function (el) {
    if (!el.closest(".section-dark") && !el.hasAttribute("data-reveal")) el.classList.add("rv");
  });

  /* ---------- 5. Steps path (draws between 1-2-3) ---------- */
  document.querySelectorAll(".steps-grid").forEach(function (grid) {
    var path = svgEl("steps-path", "0 0 800 60",
      '<path d="M30,30 C160,-10 280,70 400,30 C520,-10 640,70 770,30"/>');
    path.setAttribute("preserveAspectRatio", "none");
    grid.insertBefore(path, grid.firstChild);
    grid.classList.add("rv");
  });

  /* ---------- 6. Watermark leaves inside cards ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    if (!card.querySelector(".wm-leaf")) {
      var wm = svgEl("wm-leaf", "0 0 24 24", LEAF);
      card.appendChild(wm);
    }
  });

  /* ---------- 7. Star fill + counters in trust strips ---------- */
  document.querySelectorAll(".trust-strip .item strong").forEach(function (strongEl) {
    // wrap star runs for staggered fill
    strongEl.childNodes.forEach(function (node) {
      if (node.nodeType === 3 && node.textContent.indexOf("★") > -1) {
        var span = document.createElement("span");
        span.innerHTML = node.textContent.replace(/★/g, '<i class="star-i">★</i>');
        strongEl.replaceChild(span, node);
      } else if (node.nodeType === 1 && node.textContent.indexOf("★") > -1 && node.children.length === 0) {
        node.innerHTML = node.textContent.replace(/★/g, '<i class="star-i">★</i>');
      }
    });
  });
  function countUp(el, target) {
    if (RM) { el.textContent = target; return; }
    var t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function armCounters(scope) {
    scope.querySelectorAll(".trust-strip .item strong").forEach(function (strongEl) {
      var first = strongEl.firstChild;
      // plain leading number: "36 de ani", "95 de țări", "46 years"...
      var src = null;
      if (first && first.nodeType === 3 && /^\s*\d{2,3}\b/.test(first.textContent) && first.textContent.indexOf("–") === -1) src = first;
      else if (first && first.nodeType === 1 && first.classList.contains("gold") && /^\d{2,3}$/.test(first.textContent.trim())) src = first;
      if (!src) return;
      var m = (src.textContent.match(/\d{2,3}/) || [])[0];
      if (!m) return;
      var target = parseInt(m, 10);
      var numSpan = document.createElement("span");
      numSpan.textContent = "0";
      if (src.nodeType === 3) {
        var rest = document.createTextNode(src.textContent.replace(/^\s*\d{2,3}/, ""));
        strongEl.replaceChild(rest, src);
        strongEl.insertBefore(numSpan, rest);
      } else {
        src.textContent = "";
        src.appendChild(numSpan);
      }
      countUp(numSpan, target);
    });
  }

  /* ---------- 8. IntersectionObserver — one for everything ---------- */
  var revealEls = document.querySelectorAll(".rv, [data-reveal]");
  if (RM || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    armCounters(document);
  } else {
    var counted = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (!counted && e.target.classList.contains("trust-strip")) { counted = true; armCounters(document); }
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // trust strips that aren't .rv targets themselves
    if (!document.querySelector(".trust-strip.rv")) armCounters(document);
  }

  /* ---------- 9. Scroll loop: header transform + peek + parallax ---------- */
  var pEls = RM ? [] : [].slice.call(document.querySelectorAll("[data-speed]"));
  var lastY = 0, ticking = false;
  var heroH = hero ? hero.offsetHeight : 200;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header && hasDarkHero) {
        header.classList.toggle("scrolled", y > Math.min(heroH * 0.55, 420));
        if (y > heroH && y > lastY + 8) header.classList.add("nav-away");
        else if (y < lastY - 8 || y <= heroH) header.classList.remove("nav-away");
      }
      lastY = y;
      for (var i = 0; i < pEls.length; i++) {
        var s = parseFloat(pEls[i].getAttribute("data-speed"));
        pEls[i].style.transform = "translateY(" + (y * s).toFixed(1) + "px)";
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { heroH = hero ? hero.offsetHeight : 200; }, { passive: true });
  onScroll();

  /* ---------- 10. Card tilt (fine pointers only) ---------- */
  if (!RM && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var rx = ((ev.clientY - r.top) / r.height - 0.5) * -2.4;
        var ry = ((ev.clientX - r.left) / r.width - 0.5) * 2.4;
        card.style.transform = "translateY(-6px) perspective(700px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- 11. Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && header) header.classList.add("scrolled");
      else window.dispatchEvent(new Event("scroll"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  /* ---------- 12. FAQ ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- 13. Floating WhatsApp hides at footer ---------- */
  var waFloat = document.querySelector(".wa-float");
  var footer = document.querySelector(".site-footer");
  if (waFloat && footer && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      waFloat.classList.toggle("away", entries[0].isIntersecting);
    }, { rootMargin: "60px" }).observe(footer);
  }

  /* ---------- 13b. Step aside while a form is on screen ---------- */
  var formZone = document.querySelector("#formular, #cerere");
  if (formZone && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle("form-in-view", entries[0].isIntersecting);
    }, { rootMargin: "-20% 0px -20% 0px" }).observe(formZone);
  }

  /* ---------- 14. Event tracking (GA4/dataLayer-ready) ---------- */
  window.bcTrack = function (action, label) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", action, { event_label: label || "" });
      else if (window.dataLayer) window.dataLayer.push({ event: action, label: label || "" });
    } catch (err) { /* no-op */ }
  };
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("wa.me") > -1) window.bcTrack("whatsapp_click", location.pathname);
    else if (href.indexOf("tel:") === 0) window.bcTrack("phone_click", location.pathname);
  }, true);

  /* ---------- 15. Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
