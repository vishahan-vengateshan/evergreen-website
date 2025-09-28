// Mobile menu toggle, right-aligned hamburger animation,
// dynamic header offset, anchor scrolling with sticky-header offset,
// logo click to hero, optional 10-digit mobile validation,
// and WhatsApp floating button handler.

(function () {
  // ---------- helpers ----------
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function headerHeight() {
    const h = qs('header');
    return h ? h.getBoundingClientRect().height : 0;
  }

  function adjustBodyOffset() {
    const h = headerHeight();
    document.body.style.paddingTop = h ? h + 'px' : '';
  }

  function smoothScrollToId(id) {
    const target = qs(id);
    if (!target) return;
    const y = window.scrollY + target.getBoundingClientRect().top;
    const offset = headerHeight() + 8; // ensure the H2 or hero title is fully visible
    window.scrollTo({ top: Math.max(0, y - offset), behavior: 'smooth' });
  }

  // ---------- navigation ----------
  function setupMenuToggle() {
    const btn = qs('.menu-toggle');
    const nav = qs('#site-nav');
    if (!btn || !nav) return;

    // Toggle open/close
    btn.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Intercept in-page links for offset scrolling
    qsa('nav a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            btn.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
          }
          smoothScrollToId(href);
        }
      });
    });

    // Close menu when resizing to desktop
    window.addEventListener('resize', function () {
      const isMobile = window.matchMedia('(max-width: 700px)').matches;
      if (!isMobile && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function setupLogoScroll() {
    const logo = qs('a.logo-link[href^="#"]');
    if (!logo) return;

    logo.addEventListener('click', function (e) {
      const href = logo.getAttribute('href');
      if (!href || href.length < 2) return;
      e.preventDefault();

      // Close mobile menu if open
      const nav = qs('#site-nav');
      const btn = qs('.menu-toggle');
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (btn) {
          btn.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      }

      smoothScrollToId(href);
    });
  }

  // ---------- optional mobile number validation ----------
  function setupMobileValidation() {
    const form = qs('form');
    const mobile = qs('#mobile');
    if (!form || !mobile) return;

    function isValidMobile(val) {
      return /^\d{10}$/.test(val);
    }

    // Keep only digits and cap at 10
    mobile.addEventListener('input', function () {
      const digits = mobile.value.replace(/\D+/g, '').slice(0, 10);
      if (mobile.value !== digits) mobile.value = digits;
      mobile.setCustomValidity('');
    });

    // Validate on blur if user entered something
    mobile.addEventListener('blur', function () {
      if (mobile.value && !isValidMobile(mobile.value)) {
        mobile.setCustomValidity('Enter a 10-digit mobile number');
      } else {
        mobile.setCustomValidity('');
      }
    });

    // Validate on submit only if field is filled (field is optional)
    form.addEventListener('submit', function (e) {
      if (mobile.value && !isValidMobile(mobile.value)) {
        e.preventDefault();
        mobile.reportValidity();
      }
    });
  }

  // ---------- init ----------
  function init() {
    setupMenuToggle();
    setupLogoScroll();
    setupMobileValidation();
    adjustBodyOffset();
    window.addEventListener('resize', adjustBodyOffset);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ---------- WhatsApp floating icon ----------
(function () {
  const whatsappFloat = document.getElementById('whatsapp-float');
  if (!whatsappFloat) return;

  // Replace with your phone number here, in international format without + or spaces
  // Example: 919999999999
  const phoneNumber = '919003790287';

  whatsappFloat.addEventListener('click', function (e) {
    e.preventDefault();
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank', 'noopener');
  });
})();
