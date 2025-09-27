// Mobile menu toggle, right-aligned hamburger animation, and anchor scroll offset

(function () {
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
    const offset = headerHeight() + 8; // small buffer so H2 is fully visible
    window.scrollTo({ top: Math.max(0, y - offset), behavior: 'smooth' });
  }

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

  function init() {
    setupMenuToggle();
    adjustBodyOffset();
    window.addEventListener('resize', adjustBodyOffset);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
