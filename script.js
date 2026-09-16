/* ============================================================
   Alejandro — personal site
   Interaction layer. Deliberately small: no dependencies,
   every effect respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Year ───────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Scroll progress ────────────────────────────────────── */
  var progress = document.getElementById('progress');

  /* ── Nav: stuck state, auto-hide, mobile panel ──────────── */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var hero = document.getElementById('home');
  var lastY = window.pageYOffset;
  var ticking = false;

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  if (navLinks) {
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Reveal on scroll ───────────────────────────────────── */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Active section → nav underline ─────────────────────── */
  var sections = document.querySelectorAll('main section[id]');
  var navMap = {};

  document.querySelectorAll('[data-nav]').forEach(function (a) {
    navMap[a.getAttribute('data-nav')] = a;
  });

  function setActive(id) {
    Object.keys(navMap).forEach(function (key) {
      navMap[key].classList.toggle('is-active', key === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ── Single scroll handler (rAF-throttled) ──────────────── */
  function onScroll() {
    var y = window.pageYOffset;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    /* progress bar */
    if (progress) {
      var pct = docH > 0 ? (y / docH) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    /* nav appearance */
    if (nav) {
      nav.classList.toggle('is-stuck', y > 24);

      var menuOpen = nav.classList.contains('is-open');
      var goingDown = y > lastY && y > 320;
      var nearTop = y < 120;

      if (!menuOpen && !nearTop) {
        nav.classList.toggle('is-hidden', goingDown);
      } else {
        nav.classList.remove('is-hidden');
      }
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /* ── Copy email ─────────────────────────────────────────── */
  var copyBtn = document.getElementById('copyBtn');

  if (copyBtn) {
    var label = copyBtn.querySelector('.copy__label');
    var original = label ? label.textContent : 'Copy';
    var resetTimer;

    copyBtn.addEventListener('click', function () {
      var value = copyBtn.getAttribute('data-mail') || '';

      function done() {
        copyBtn.classList.add('is-done');
        if (label) label.textContent = 'Copied';
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function () {
          copyBtn.classList.remove('is-done');
          if (label) label.textContent = original;
        }, 1900);
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:absolute;left:-9999px;top:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* no-op */ }
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ── Smooth anchor scroll with nav offset ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      var offset = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;

      window.scrollTo({
        top: top,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ── Hero parallax (subtle, desktop only) ───────────────── */
  if (!reduceMotion && hero && window.matchMedia('(min-width: 900px)').matches) {
    var orbs = hero.querySelectorAll('.orb');
    var heroTicking = false;

    window.addEventListener('scroll', function () {
      if (heroTicking) return;
      heroTicking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight) {
          orbs.forEach(function (orb, i) {
            var depth = 0.03 + i * 0.022;
            orb.style.marginTop = (y * depth).toFixed(2) + 'px';
          });
        }
        heroTicking = false;
      });
    }, { passive: true });
  }

  /* ── Keep layout honest on resize (desktop ⇄ mobile) ────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.innerWidth > 860) closeMenu();
    }, 150);
  });
})();
