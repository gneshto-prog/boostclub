(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const motionToggle = document.querySelector("[data-motion-toggle]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector(".mobile-nav");

  if (reducedMotion.matches) root.dataset.motion = "off";

  const updateThemeControl = () => {
    const dark = root.dataset.theme === "dark";
    if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
    themeToggle?.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#08382D" : "#0D5645");
    try {
      localStorage.setItem("boost-theme", theme);
    } catch {
      // The selected theme still applies for the current page.
    }
    updateThemeControl();
  };

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (document.startViewTransition && root.dataset.motion !== "off") {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  });
  updateThemeControl();

  const updateMotionControl = () => {
    if (!motionToggle) return;
    const enabled = root.dataset.motion !== "off";
    motionToggle.setAttribute("aria-pressed", String(enabled));
    motionToggle.textContent = enabled ? "Motion on" : "Motion off";
  };
  motionToggle?.addEventListener("click", () => {
    root.dataset.motion = root.dataset.motion === "off" ? "on" : "off";
    updateMotionControl();
  });
  updateMotionControl();

  const closeMenu = () => {
    mobileMenu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu?.classList.toggle("is-open", open);
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const reveals = [...document.querySelectorAll(".reveal")];
  if (root.dataset.motion === "off" || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    reveals.forEach((element) => observer.observe(element));
  }

  let frame = 0;
  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    root.style.setProperty("--scroll", String(value));
    frame = 0;
  };
  updateScroll();
  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(updateScroll);
  }, { passive: true });

  document.querySelectorAll("[data-parallax], .photo-brief").forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      if (root.dataset.motion === "off") return;
      const bounds = target.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2.5;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2.5;
      target.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });

  const goalContent = {
    energy: ["Start with the rhythm of your day.", "We will look at what currently drains your energy and find one change that feels realistic enough to repeat."],
    weight: ["Build a steadier route toward healthy weight loss.", "Your starting data helps shape practical nutrition habits without extreme promises or pressure."],
    muscle: ["Connect nutrition, recovery and training.", "Body composition gives us a clearer way to support measurable muscle-building progress."],
    clarity: ["See the whole picture before choosing a plan.", "We translate your body composition into plain language so your first decision is informed and personal."],
  };
  const goalResponse = document.querySelector("[data-goal-response]");
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-goal]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const [title, copy] = goalContent[button.dataset.goal];
      goalResponse?.querySelector("strong")?.replaceChildren(title);
      goalResponse?.querySelector("p")?.replaceChildren(copy);
    });
  });

  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  document.querySelectorAll(".faq-list details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      document.querySelectorAll(".faq-list details").forEach((other) => {
        if (other !== details) other.removeAttribute("open");
      });
    });
  });
})();
