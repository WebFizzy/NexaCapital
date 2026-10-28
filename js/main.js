
(() => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const header = $(".site-header"),
    menu = $(".menu-toggle"),
    nav = $(".nav-links");
  if (header) {
    const sc = () => header.classList.toggle("scrolled", scrollY > 10);
    addEventListener("scroll", sc, { passive: true });
    sc();
  }
  if (menu && nav)
    menu.addEventListener("click", () => {
      const o = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(o));
      menu.textContent = o ? "×" : "☰";
      menu.setAttribute(
        "aria-label",
        o ? "Close navigation menu" : "Open navigation menu",
      );
    });
  $$(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav?.classList.remove("open");
      menu?.setAttribute("aria-expanded", "false");
      if (menu) menu.textContent = "☰";
    }),
  );
  const reveals = $$(".reveal");
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    reveals.forEach((e) => io.observe(e));
  } else reveals.forEach((e) => e.classList.add("visible"));
  window.showToast = (msg) => {
    let region = $(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.append(region);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    region.append(t);
    setTimeout(() => t.remove(), 3500);
  };
  $$("[data-demo-action]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(
        b.dataset.demoMessage ||
          "Demo action only. No transaction was performed.",
      );
    }),
  );
  $$(".faq-question").forEach((b) =>
    b.addEventListener("click", () => {
      const was = b.getAttribute("aria-expanded") === "true";
      const list = b.closest(".faq-list") || document;
      $$(".faq-question", list).forEach((x) => {
        x.setAttribute("aria-expanded", "false");
        if (x.nextElementSibling) x.nextElementSibling.hidden = true;
      });
      b.setAttribute("aria-expanded", String(!was));
      if (b.nextElementSibling) b.nextElementSibling.hidden = was;
    }),
  );
  $("[data-dismiss]")?.addEventListener("click", (e) =>
    e.currentTarget.closest(".topbar")?.remove(),
  );
  const modal = $("#video-modal"),
    play = $("[data-open-video]"),
    close = () => {
      modal?.classList.remove("open");
      document.body.classList.remove("no-scroll");
    };
  if (play && modal)
    play.addEventListener("click", () => {
      modal.classList.add("open");
      document.body.classList.add("no-scroll");
    });
  if (modal) {
    $$("[data-close-modal]", modal).forEach((x) =>
      x.addEventListener("click", close),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
  }
  const fs = $("#faq-search");
  if (fs)
    fs.addEventListener("input", () => {
      const q = fs.value.toLowerCase().trim();
      $$(".faq-item").forEach((i) =>
        i.classList.toggle("hidden", !i.textContent.toLowerCase().includes(q)),
      );
    });
  $$("form[data-demo-form]").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = f.querySelector(":invalid");
      if (invalid) {
        invalid.focus();
        showToast("Please check the highlighted fields.");
        return;
      }
      if (f.id === "register-form") {
        const p = $("#password", f),
          c = $("#confirm-password", f);
        if (p && c && p.value !== c.value) {
          c.setCustomValidity("Passwords do not match");
          c.reportValidity();
          c.setCustomValidity("");
          return;
        }
      }
      showToast(
        f.dataset.successMessage ||
          "Demo form validated. No information was sent to a server.",
      );
      f.reset();
    }),
  );
  $$("[data-password-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = document.getElementById(b.dataset.passwordToggle);
      if (i) {
        i.type = i.type === "password" ? "text" : "password";
        b.textContent = i.type === "password" ? "Show" : "Hide";
      }
    }),
  );
  const pass = $("#password"),
    strength = $("#password-strength");
  if (pass && strength)
    pass.addEventListener("input", () => {
      let s = 0,
        v = pass.value;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/[0-9]/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      strength.textContent = !v
        ? "Use at least 8 characters."
        : s <= 1
          ? "Strength: needs improvement"
          : s === 2
            ? "Strength: fair"
            : s === 3
              ? "Strength: good"
              : "Strength: strong";
    });
  const key = "nexa_demo_watchlist",
    read = () => {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch {
        return [];
      }
    };
  $$("[data-watch]").forEach((b) => {
    const n = b.dataset.watch;
    const update = () => {
      const active = read().includes(n);
      b.textContent = active ? "★ Saved" : "☆ Save project";
      b.setAttribute("aria-pressed", String(active));
    };
    update();
    b.addEventListener("click", () => {
      const a = read(),
        next = a.includes(n) ? a.filter((x) => x !== n) : [...a, n];
      localStorage.setItem(key, JSON.stringify(next));
      update();
      showToast(
        next.includes(n)
          ? "Saved to your local demo watchlist."
          : "Removed from your demo watchlist.",
      );
    });
  });
  const canvas = $("#portfolio-chart");
  if (canvas) {
    const ctx = canvas.getContext("2d"),
      pts = [
        0.68, 0.62, 0.66, 0.54, 0.59, 0.48, 0.52, 0.41, 0.46, 0.35, 0.4, 0.29,
        0.33, 0.22, 0.27, 0.18, 0.23, 0.13,
      ];
    const draw = () => {
      const r = canvas.getBoundingClientRect(),
        d = window.devicePixelRatio || 1;
      canvas.width = r.width * d;
      canvas.height = r.height * d;
      ctx.scale(d, d);
      const w = r.width,
        h = r.height,
        p = 12;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#e7ebf1";
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h * i) / 5);
        ctx.lineTo(w, (h * i) / 5);
        ctx.stroke();
      }
      const c = pts.map((v, i) => ({
        x: p + (i * (w - 2 * p)) / (pts.length - 1),
        y: p + v * (h - 2 * p),
      }));
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(76,141,255,.25)");
      g.addColorStop(1, "rgba(76,141,255,0)");
      ctx.beginPath();
      c.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)));
      ctx.lineTo(w - p, h);
      ctx.lineTo(p, h);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      c.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)));
      ctx.strokeStyle = "#4c8dff";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    };
    new ResizeObserver(draw).observe(canvas);
  }
  $("#chart-range")?.addEventListener("change", () =>
    showToast("Chart range changed for demonstration purposes."),
  );
  const wc = $("#watch-count");
  if (wc) wc.textContent = String(read().length);
})();
