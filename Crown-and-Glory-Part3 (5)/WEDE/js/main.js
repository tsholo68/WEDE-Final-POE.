/* Crown & Glory - shared interactions: nav, scroll animations, accordion, tabs, modal helper */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.getElementById('nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });
  }

  /* ---------- Scroll-reveal animation (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.card, .panel, .feature, .location-card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Accordion (event delegation: one listener for the whole page) ---------- */
  document.addEventListener('click', function (e) {
    var header = e.target.closest('.accordion-header');
    if (!header) return;
    var panel = document.getElementById(header.getAttribute('aria-controls'));
    var isOpen = header.getAttribute('aria-expanded') === 'true';
    var group = header.closest('.accordion');
    // close the others so only one is open at a time
    group.querySelectorAll('.accordion-header').forEach(function (h) {
      h.setAttribute('aria-expanded', 'false');
      document.getElementById(h.getAttribute('aria-controls')).style.maxHeight = null;
    });
    if (!isOpen) {
      header.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });

  /* ---------- Tabs (with arrow-key support) ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    function select(btn) {
      buttons.forEach(function (b) {
        var active = b === btn;
        b.setAttribute('aria-selected', String(active));
        b.tabIndex = active ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !active;
      });
      btn.focus();
    }
    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { select(btn); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select(buttons[(i + 1) % buttons.length]);
        if (e.key === 'ArrowLeft') select(buttons[(i - 1 + buttons.length) % buttons.length]);
      });
    });
  });

  /* ---------- Overlay (modal / lightbox) helper, shared via window.CG ---------- */
  var lastFocus = null;
  function openOverlay(el) {
    lastFocus = document.activeElement;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    var close = el.querySelector('.modal-close');
    if (close) close.focus();
  }
  function closeOverlay(el) {
    el.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var overlay = e.target.closest('.overlay');
    if (!overlay) return;
    if (e.target === overlay || e.target.closest('.modal-close')) closeOverlay(overlay);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = document.querySelector('.overlay.open');
      if (open) closeOverlay(open);
    }
  });
  window.CG = { openOverlay: openOverlay, closeOverlay: closeOverlay };

  /* ---------- Footer year (small DOM update) ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
