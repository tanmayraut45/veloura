/* ============================================================
   VELOURA — motion engine
   Lenis smooth scroll + GSAP ScrollTrigger.
   Degrades to a fully readable static page with no JS and
   under prefers-reduced-motion.
   ============================================================ */

(() => {
  "use strict";

  const CFG = window.VELOURA || {};
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";
  let lenis = null;

  /* ---------- WhatsApp link builder ----------
     Any element with data-wa="general|service|bridal|offer"
     becomes a wa.me link; data-service fills the {service}
     or {package} placeholder. */
  function waHref(type, name) {
    const messages = CFG.messages || {};
    let msg = messages[type] || messages.general || "Hi!";
    if (name) msg = msg.replace("{service}", name).replace("{package}", name);
    return `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  function initWhatsAppLinks() {
    document.querySelectorAll("[data-wa]").forEach((el) => {
      el.setAttribute("href", waHref(el.dataset.wa, el.dataset.service));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Smooth scroll ---------- */
  function initLenis() {
    if (REDUCED || typeof Lenis === "undefined" || !hasGSAP) return;
    lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
    }
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const hash = a.getAttribute("href");
        if (hash.length < 2) return;
        e.preventDefault();
        closeMenu();
        scrollToTarget(hash);
      });
    });
  }

  /* ---------- Preloader ---------- */
  function runPreloader() {
    const pre = document.getElementById("preloader");
    const done = () => {
      if (pre) pre.remove();
      document.body.classList.remove("is-loading");
      if (hasGSAP) ScrollTrigger.refresh();
    };

    if (!pre) return Promise.resolve();
    if (REDUCED || !hasGSAP) {
      done();
      return Promise.resolve();
    }

    history.scrollRestoration = "manual";
    const mono = pre.querySelector(".preloader-mono");
    gsap.set(mono, { strokeDasharray: 1, strokeDashoffset: 1, visibility: "visible" });

    return new Promise((resolve) => {
      const finish = () => {
        done();
        resolve();
      };
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
        gsap
          .timeline({ onComplete: finish })
          .to(mono, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
          .to(pre.querySelector(".preloader-word"), { autoAlpha: 0, duration: 0.3 }, "-=0.2")
          .to(pre, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" }, "-=0.1");
      });
    });
  }

  /* ---------- Signature ribbon (kajal stroke) ----------
     Both ribbon paths carry pathLength="1", so the draw is a
     normalized dashoffset scrub — no measuring, no resize math. */
  function initRibbon() {
    document.querySelectorAll(".ribbon-path").forEach((path) => {
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1, visibility: "visible" });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  /* ---------- Act color morph (noir <-> porcelain) ---------- */
  function initActs() {
    const setAct = (theme) => document.body.classList.toggle("act-light", theme === "light");
    const sections = gsap.utils.toArray("[data-theme]");
    sections.forEach((sec, i) => {
      const prev = sections[i - 1];
      ScrollTrigger.create({
        trigger: sec,
        start: "top 55%",
        end: "top 55%",
        onEnter: () => setAct(sec.dataset.theme),
        onLeaveBack: () => prev && setAct(prev.dataset.theme),
      });
    });
    if (sections[0]) setAct(sections[0].dataset.theme);
  }

  /* ---------- Reveals ---------- */
  function initReveals() {
    document.fonts.ready.then(() => {
      if (typeof SplitText === "undefined") return;
      gsap.utils.toArray('[data-reveal="mask"]').forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.09,
              delay: parseFloat(el.dataset.revealDelay || 0),
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
      });
    });

    const PRESETS = {
      up: { y: 48, autoAlpha: 0 },
      fade: { autoAlpha: 0 },
    };
    gsap.utils.toArray('[data-reveal="up"], [data-reveal="fade"]').forEach((el) => {
      const base = {
        ...PRESETS[el.dataset.reveal],
        duration: 1,
        ease: "power3.out",
        delay: parseFloat(el.dataset.revealDelay || 0),
      };
      /* anything already in the first viewport plays immediately —
         a scroll trigger would leave it hidden until the user moves */
      if (el.getBoundingClientRect().top < window.innerHeight) {
        gsap.from(el, base);
      } else {
        gsap.from(el, { ...base, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      }
    });

    /* drawn underline swashes */
    gsap.utils.toArray(".swash-draw").forEach((path) => {
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.inOut",
        delay: 0.35,
        scrollTrigger: { trigger: path.closest("section") || path, start: "top 70%", once: true },
      });
    });
  }

  /* ---------- Parallax inside arch masks ---------- */
  function initParallax() {
    gsap.utils.toArray(".arch img, .frame img").forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".arch, .frame"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }

  /* ---------- Stats count-up ---------- */
  function initStats() {
    gsap.utils.toArray(".stat b").forEach((el) => {
      const raw = el.textContent.trim();
      const num = parseFloat(raw.replace(/[^\d.]/g, ""));
      if (Number.isNaN(num)) return;
      const suffix = raw.replace(/[\d.]/g, "");
      const decimals = (raw.split(".")[1] || "").replace(/\D/g, "").length;
      const counter = { v: 0 };
      gsap.to(counter, {
        v: num,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = counter.v.toFixed(decimals) + suffix;
        },
      });
    });
  }

  /* ---------- Pinned horizontal gallery (desktop only) ---------- */
  function initGallery() {
    const wrap = document.querySelector(".gallery-track-wrap");
    const track = document.querySelector(".gallery-track");
    if (!wrap || !track) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const dist = () => track.scrollWidth - document.documentElement.clientWidth;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery",
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger && tween.scrollTrigger.kill();
    });
  }

  /* ---------- Nav state + floating CTAs ---------- */
  function initScrollUI() {
    const nav = document.querySelector(".nav");
    const waFloat = document.querySelector(".wa-float");
    const bookBar = document.querySelector(".book-bar");
    const update = (y) => {
      if (nav) nav.classList.toggle("is-scrolled", y > 24);
      const past = y > window.innerHeight * 0.7;
      if (waFloat) waFloat.classList.toggle("is-visible", past);
      if (bookBar) bookBar.classList.toggle("is-visible", past);
    };
    if (lenis) {
      lenis.on("scroll", ({ scroll }) => update(scroll));
    } else {
      window.addEventListener("scroll", () => update(window.scrollY), { passive: true });
    }
    update(window.scrollY);
  }

  /* ---------- Mobile menu ---------- */
  const menuOverlay = () => document.getElementById("menu");
  const menuToggle = () => document.querySelector(".nav-toggle");

  function closeMenu() {
    const overlay = menuOverlay();
    const toggle = menuToggle();
    if (!overlay || !overlay.classList.contains("is-open")) return;
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (lenis) lenis.start();
    document.body.style.overflow = "";
  }

  function initMenu() {
    const overlay = menuOverlay();
    const toggle = menuToggle();
    if (!overlay || !toggle) return;
    toggle.addEventListener("click", () => {
      const open = overlay.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Services menu tabs ---------- */
  function initTabs() {
    const tabs = Array.from(document.querySelectorAll(".menu-tab"));
    const panels = Array.from(document.querySelectorAll(".menu-panel"));
    if (!tabs.length) return;

    const select = (tab) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.setAttribute("aria-selected", String(active));
        t.setAttribute("tabindex", active ? "0" : "-1");
      });
      panels.forEach((p) => {
        p.classList.toggle("is-active", p.id === tab.getAttribute("aria-controls"));
      });
      if (hasGSAP) ScrollTrigger.refresh();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) {
          e.preventDefault();
          next.focus();
          select(next);
        }
      });
    });
  }

  /* ---------- Offer popup ---------- */
  function initOffer() {
    const offerCfg = CFG.offer || {};
    const dialog = document.getElementById("offer");
    if (!dialog || offerCfg.enabled === false) return;

    const KEY = "veloura-offer-seen";
    if (offerCfg.oncePerSession !== false && sessionStorage.getItem(KEY)) return;

    let fired = false;
    let lastFocused = null;
    let timer = null;
    let st = null;

    const open = () => {
      if (fired || dialog.open) return;
      fired = true;
      if (offerCfg.oncePerSession !== false) sessionStorage.setItem(KEY, "1");
      if (timer) clearTimeout(timer);
      if (st) st.kill();
      lastFocused = document.activeElement;
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      dialog.showModal();
      requestAnimationFrame(() => dialog.classList.add("is-open"));
    };

    const animateClose = () => {
      dialog.classList.remove("is-open");
      if (REDUCED) {
        dialog.close();
      } else {
        setTimeout(() => dialog.close(), 450);
      }
    };

    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      animateClose();
    });
    dialog.addEventListener("close", () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    });
    dialog.querySelectorAll("[data-offer-close]").forEach((btn) => {
      btn.addEventListener("click", animateClose);
    });
    dialog.querySelector('[data-wa="offer"]')?.addEventListener("click", () => {
      setTimeout(animateClose, 300);
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) animateClose();
    });

    const depth = offerCfg.scrollDepth ?? 0.38;
    if (hasGSAP && !REDUCED) {
      st = ScrollTrigger.create({
        start: () => ScrollTrigger.maxScroll(window) * depth,
        once: true,
        onEnter: open,
      });
    } else {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= depth) {
          open();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    timer = setTimeout(open, offerCfg.fallbackDelay ?? 30000);
  }

  /* ---------- Boot ---------- */
  function boot() {
    initWhatsAppLinks();
    initMenu();
    initTabs();
    initAnchors();

    if (REDUCED) document.body.classList.add("no-motion");

    if (!hasGSAP) {
      /* CDN failed: static page, working links */
      document.body.classList.add("is-static", "no-motion");
      document.body.classList.remove("is-loading");
      const pre = document.getElementById("preloader");
      if (pre) pre.remove();
      initScrollUI();
      initOffer();
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
    initLenis();
    initScrollUI();

    runPreloader().then(() => {
      if (!REDUCED) {
        initRibbon();
        initReveals();
        initParallax();
        initStats();
        initGallery();
      }
      initActs();
      initOffer();
      ScrollTrigger.refresh();
    });

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
