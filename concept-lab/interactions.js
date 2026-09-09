(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionToggle = document.querySelector("[data-motion-toggle]");

  if (reducedMotion.matches) root.dataset.motion = "off";

  const updateMotionControl = () => {
    if (!motionToggle) return;
    const isOn = root.dataset.motion !== "off";
    motionToggle.setAttribute("aria-pressed", String(isOn));
    motionToggle.textContent = isOn ? "Motion on" : "Motion off";
  };

  motionToggle?.addEventListener("click", () => {
    root.dataset.motion = root.dataset.motion === "off" ? "on" : "off";
    updateMotionControl();
  });
  updateMotionControl();

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

  const goalContent = {
    energy: [
      "Start with what fuels your day.",
      "We will map your current rhythm and find the easiest win to repeat.",
    ],
    strength: [
      "Build from the body you have today.",
      "Your composition data helps us connect nutrition, recovery and training with purpose.",
    ],
    balance: [
      "Create a rhythm with space to live.",
      "We will simplify the variables and shape a plan that can flex with real life.",
    ],
  };
  const goalAnswer = document.querySelector("[data-goal-answer]");
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-goal]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      const [title, copy] = goalContent[button.dataset.goal];
      goalAnswer?.querySelector("strong")?.replaceChildren(title);
      goalAnswer?.querySelector("span")?.replaceChildren(copy);
    });
  });

  const progressBar = document.querySelector(".scroll-progress");
  let progressFrame = 0;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    root.style.setProperty("--scroll-progress", String(progress));
    progressFrame = 0;
  };
  if (progressBar) {
    updateProgress();
    window.addEventListener(
      "scroll",
      () => {
        if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
      },
      { passive: true },
    );
  }

  const themeTabs = document.querySelector(".theme-tabs");
  const activeThemeTab = themeTabs?.querySelector('[aria-current="page"]');
  if (themeTabs && activeThemeTab) {
    themeTabs.scrollLeft = Math.max(0, activeThemeTab.offsetLeft - (themeTabs.clientWidth - activeThemeTab.clientWidth) / 2);
  }

  const roundTabs = document.querySelector(".round-tabs");
  if (roundTabs && "IntersectionObserver" in window) {
    const roundLinks = [...roundTabs.querySelectorAll('a[href^="#"]')];
    const roundSections = roundLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        roundLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${visible.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, 0.1, 0.4] },
    );
    roundSections.forEach((section) => sectionObserver.observe(section));
  }

  const parallaxTargets = document.querySelectorAll(".ag-dashboard, .ke-photo, .of-photo, .organic-visual, .cinematic-frame, .round-parallax");
  parallaxTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      if (root.dataset.motion === "off") return;
      const bounds = target.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
      target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
})();
