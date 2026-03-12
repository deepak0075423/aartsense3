/**
 * AART SENSE STUDIOS — animations.js
 * Scroll-triggered reveals, counters, hero entrance, stagger grids.
 * Drop <script src="animations.js" defer></script> into any page — no HTML changes needed.
 */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════════════
     1. HERO ENTRANCE — staggered fade-up for hero children
  ══════════════════════════════════════════════════════ */
  const heroInner = document.querySelector('.page-hero-inner');
  if (heroInner && !REDUCED) {
    const kids = Array.from(heroInner.children);
    kids.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition =
        `opacity .65s ease ${0.07 + i * 0.13}s,` +
        `transform .65s cubic-bezier(.22,.68,0,1.1) ${0.07 + i * 0.13}s`;
    });
    // Double rAF ensures styles are applied before triggering transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        kids.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     2. NAVBAR — centralised scroll shadow
  ══════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow =
        window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,.1)' : 'none';
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     3. CHAT BUBBLE — spring pop-in on load
  ══════════════════════════════════════════════════════ */
  const bubble = document.querySelector('.chat-bubble');
  if (bubble && !REDUCED) {
    bubble.style.opacity = '0';
    bubble.style.transform = 'scale(.55) translateY(10px)';
    bubble.style.transition =
      'opacity .4s ease .85s, transform .45s cubic-bezier(.34,1.56,.64,1) .85s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bubble.style.opacity = '1';
        bubble.style.transform = 'scale(1) translateY(0)';
      });
    });
  }

  // Everything below uses scroll detection — skip for reduced-motion users
  if (REDUCED) return;

  /* ══════════════════════════════════════════════════════
     4. SCROLL REVEAL — IntersectionObserver-based fade-up
  ══════════════════════════════════════════════════════ */

  // Elements that reveal individually (no stagger)
  const SOLO_SELECTORS = [
    // Investors page
    '.pillar-card', '.opp-item', '.ci-row',
    // About page
    '.timeline-item', '.award-card', '.press-card', '.portrait-card',
    // Services page
    '.service-card', '.step-block',
    // Contact page
    '.info-card', '.office-card', '.faq-contact-card',
    // Brand page
    '.client-card', '.film-card', '.press-kit-item',
    // Landing page
    '.playlist-item', '.feature-item', '.test-item', '.artist-card',
    // Shared
    '.fm-brand',
  ];

  // Grid/list parents whose direct children get sequential stagger delays
  const STAGGER_PARENTS = [
    // Investors
    '.pillars-grid',
    '.opp-grid',
    '.traction-inner',
    '.company-info',
    // About
    '.awards-grid',
    '.timeline',
    '.press-grid',
    // Services
    '.services-grid',
    '.step-list',
    '.brands-row',
    // Contact
    '.offices-grid',
    // Landing
    '.playlists-grid',
    '.features-grid',
    '.test-grid',
    '.brand-grid',
    '.artists-row',
  ];

  // Section headings animate in without stagger
  const HEADING_SELECTORS = [
    '.overview-text h2',
    '.section-inner > h2',
    '.pillars-inner > h2',
    '.opportunity-inner > h2',
    '.investor-contact-inner > h2',
    '.contact-intro h2',
    '.faq-category-title',
  ];

  // Core IntersectionObserver
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.opacity = '1';
      el.style.transform = 'none';
      revealObs.unobserve(el);
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -28px 0px' });

  function prepReveal(el, delayMs) {
    if (el._anim) return;       // already set up
    el._anim = true;
    const d = delayMs || 0;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition =
      `opacity .58s ease ${d}ms, transform .58s cubic-bezier(.22,.68,0,1.1) ${d}ms`;
    el.style.willChange = 'opacity, transform';
    revealObs.observe(el);
  }

  // Apply to individual elements
  SOLO_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => prepReveal(el));
  });

  // Apply headings
  HEADING_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => prepReveal(el));
  });

  // Apply staggered to grid children
  STAGGER_PARENTS.forEach(sel => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    Array.from(parent.children).forEach((child, i) => {
      prepReveal(child, i * 85);
    });
  });

  /* ══════════════════════════════════════════════════════
     5. HAMBURGER MENU — mobile nav drawer toggle
  ══════════════════════════════════════════════════════ */
  (function () {
    var btn     = document.getElementById('navHamburger');
    var menu    = document.getElementById('mobileMenu');
    var overlay = document.getElementById('mobileMenuOverlay');
    var close   = document.getElementById('mobileMenuClose');
    if (!btn || !menu) return;

    function openMenu() {
      btn.classList.add('open');
      menu.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      btn.classList.remove('open');
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (close) close.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  })();

  /* ══════════════════════════════════════════════════════
     6. COUNTER ANIMATION — animated number roll-up
  ══════════════════════════════════════════════════════ */

  function parseNum(text) {
    const n = parseInt(text.replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? null : n;
  }

  function formatNum(n, template) {
    // Preserve original suffix ("+", " Years", etc.) and comma-format thousands
    const suffix = template.replace(/[\d,\s]/g, '');
    const numStr = n >= 1000 ? n.toLocaleString('en-GB') : String(n);
    return numStr + suffix;
  }

  function animateCount(el) {
    const original = el.textContent.trim();
    const target = parseNum(original);
    if (!target) return;
    const duration = 1300;
    const t0 = performance.now();

    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      // Ease-out exponential
      const eased = 1 - Math.pow(2, -10 * p);
      el.textContent = formatNum(Math.round(eased * target), original);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = original; // restore exact original at end
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.tr-num, .ph-stat strong').forEach(el => {
    counterObs.observe(el);
  });

  /* ══════════════════════════════════════════════════════
     6. SECTION LABEL — clip slide-up reveal
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.section-label').forEach(el => {
    const text = el.textContent;
    el.style.overflow = 'hidden';
    el.style.display = 'block'; // ensure overflow hidden works

    const inner = document.createElement('span');
    inner.textContent = text;
    inner.style.cssText =
      'display:inline-block;' +
      'transform:translateY(110%);' +
      'transition:transform 0.52s cubic-bezier(.22,.68,0,1.1);';

    el.textContent = '';
    el.appendChild(inner);

    const lo = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      inner.style.transform = 'translateY(0)';
      lo.disconnect();
    }, { threshold: 0.8 });
    lo.observe(el);
  });

  /* ══════════════════════════════════════════════════════
     7. PAGE-HERO META STATS — subtle scale-in on load
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.ph-stat').forEach((el, i) => {
    if (REDUCED) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition =
      `opacity .5s ease ${0.4 + i * 0.1}s, transform .5s ease ${0.4 + i * 0.1}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
  });

  /* ══════════════════════════════════════════════════════
     8. CTA STRIP — scale-in heading
  ══════════════════════════════════════════════════════ */
  const ctaH2 = document.querySelector('.cta-strip h2');
  if (ctaH2) {
    ctaH2.style.opacity = '0';
    ctaH2.style.transform = 'translateY(20px)';
    ctaH2.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.1)';

    const ctaObs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      ctaH2.style.opacity = '1';
      ctaH2.style.transform = 'none';

      // Stagger the paragraph and buttons after
      const sib = ctaH2.nextElementSibling;
      const btns = document.querySelector('.cta-strip-btns');
      [sib, btns].forEach((node, i) => {
        if (!node) return;
        node.style.opacity = '0';
        node.style.transform = 'translateY(14px)';
        node.style.transition = `opacity .5s ease ${0.18 + i * 0.12}s, transform .5s ease ${0.18 + i * 0.12}s`;
        setTimeout(() => {
          node.style.opacity = '1';
          node.style.transform = 'none';
        }, (0.18 + i * 0.12) * 1000);
      });

      ctaObs.disconnect();
    }, { threshold: 0.4 });
    ctaObs.observe(ctaH2);
  }

})();
