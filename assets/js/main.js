/* ============================================================
   Kelvin Gameli Enam — Portfolio
   Interactions: mobile menu, scroll spy, reveal animations,
   nav state, research summary toggle, session timer, contact form
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile navigation menu ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("menu-icon-open");
  var iconClose = document.getElementById("menu-icon-close");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      if (iconOpen) iconOpen.classList.toggle("hidden", !isOpen);
      if (iconClose) iconClose.classList.toggle("hidden", isOpen);
    });

    // Close the menu whenever a link inside it is clicked
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        if (iconOpen) iconOpen.classList.remove("hidden");
        if (iconClose) iconClose.classList.add("hidden");
      });
    });
  }

  /* ---------- Scroll spy: highlight the nav link for the visible section ---------- */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    // The middle "band" of the viewport decides which section is current —
    // works reliably scrolling both up and down.
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ---------- Reveal sections on scroll ----------
     The .reveal class is only added here in JS, so content stays fully
     visible if JavaScript is disabled or fails to load. */
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("main section").forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ---------- Floating nav: solid background after scrolling ---------- */
  var headerNav = document.getElementById("primary-nav");
  function updateNavState() {
    if (headerNav) headerNav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });

  /* ---------- Research summary expand / collapse ---------- */
  var researchToggle = document.getElementById("research-toggle");
  var researchDetails = document.getElementById("research-details");

  if (researchToggle && researchDetails) {
    researchToggle.addEventListener("click", function () {
      var isHidden = researchDetails.hasAttribute("hidden");
      if (isHidden) {
        researchDetails.removeAttribute("hidden");
      } else {
        researchDetails.setAttribute("hidden", "");
      }
      researchToggle.setAttribute("aria-expanded", String(isHidden));
      var label = researchToggle.querySelector("[data-label]");
      var chevron = researchToggle.querySelector("[data-chevron]");
      if (label) label.textContent = isHidden ? "Hide Research Summary" : "View Research Summary";
      if (chevron) chevron.classList.toggle("rotate-180", isHidden);
    });
  }

  /* ---------- Session uptime counter (research dashboard widget) ---------- */
  var uptimeEl = document.getElementById("session-uptime");
  if (uptimeEl) {
    var startTime = Date.now();
    var pad = function (n) {
      return String(n).padStart(2, "0");
    };
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      var h = Math.floor(elapsed / 3600);
      var m = Math.floor((elapsed % 3600) / 60);
      var s = elapsed % 60;
      uptimeEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
    }, 1000);
  }

  /* ---------- Contact form ----------
     No backend on GitHub Pages, so the form composes an email in the
     visitor's own mail client (nothing is stored or sent elsewhere).
     TODO: set your receiving address in the form's data-recipient
     attribute in index.html. */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var recipient = contactForm.getAttribute("data-recipient") || "";
      var name = (contactForm.querySelector("#contact-name") || {}).value || "";
      var email = (contactForm.querySelector("#contact-email") || {}).value || "";
      var subject = (contactForm.querySelector("#contact-subject") || {}).value || "";
      var message = (contactForm.querySelector("#contact-message") || {}).value || "";

      var finalSubject = subject || "Portfolio inquiry";
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;

      window.location.href =
        "mailto:" + recipient +
        "?subject=" + encodeURIComponent(finalSubject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Footer: keep the copyright year current ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* ============================================================
   ECG MONITOR BACKGROUND
   Continuously sweeping electrocardiogram trace on a fixed
   canvas behind the whole page. No library required.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("ecg-bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  /* ---- Tuning knobs ---------------------------------------- */
  var SPEED = 2;                 // px per frame the trace advances
  var BEAT = 150;                // px between heartbeats (smaller = faster pulse)
  var FADE = 0.06;               // trail fade per frame (smaller = longer trail)
  var AMP = 70;                  // spike height px (auto-scaled on short screens)
  var LINE = 1.6;                // line thickness
  var TRACE = "34, 211, 238";    // cyan accent #22d3ee (RGB)
  /* ----------------------------------------------------------- */

  var w, h, midY, amp, x, prevY;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    midY = h * 0.55; // trace sits slightly below centre
    amp = Math.min(AMP, h * 0.14);
    x = 0;
    prevY = null;
    ctx.clearRect(0, 0, w, h);
  }

  /* One heartbeat shape: P wave → QRS complex → T wave */
  function ecgValue(t) {
    // t = position inside one beat, 0..1
    function g(c, s) {
      var d = t - c;
      return Math.exp(-(d * d) / (2 * s * s));
    }
    return (
      0.16 * g(0.18, 0.03) +   // P wave
      -0.12 * g(0.36, 0.012) + // Q dip
      1.0 * g(0.4, 0.01) +     // R spike
      -0.26 * g(0.44, 0.013) + // S dip
      0.32 * g(0.66, 0.045)    // T wave
    );
  }

  function yAt(px) {
    var t = (((px % BEAT) + BEAT) % BEAT) / BEAT;
    return midY - ecgValue(t) * amp;
  }

  function sweep() {
    /* Phosphor-persistence fade → glowing trailing trail */
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, " + FADE + ")";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    /* Draw the next glowing segment */
    var y = yAt(x);
    if (prevY !== null) {
      ctx.beginPath();
      ctx.moveTo(x - SPEED, prevY);
      ctx.lineTo(x, y);
      ctx.lineWidth = LINE;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(" + TRACE + ", 0.9)";
      ctx.shadowColor = "rgba(" + TRACE + ", 0.9)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    prevY = y;
    x += SPEED;
    if (x > w + 20) {
      x = 0;
      prevY = null; // sweep restarts at the left edge
    }
    requestAnimationFrame(sweep);
  }

  resize();
  window.addEventListener("resize", resize);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    /* Reduced motion: draw one static trace instead of animating */
    ctx.beginPath();
    for (var px = 0; px <= w; px += 2) {
      var y = yAt(px);
      if (px === 0) {
        ctx.moveTo(px, y);
      } else {
        ctx.lineTo(px, y);
      }
    }
    ctx.lineWidth = LINE;
    ctx.strokeStyle = "rgba(" + TRACE + ", 0.35)";
    ctx.stroke();
  } else {
    requestAnimationFrame(sweep);
  }
})();
