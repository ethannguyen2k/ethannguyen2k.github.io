// Shared chrome behavior for cyanotype pages.
//
// Load AFTER js/scripts.js (in body, not head). Each page must still inline
// the pre-paint theme migration in <head> so data-theme is set before paint.

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    const sun  = btn.querySelector('#themeIconSun');
    const moon = btn.querySelector('#themeIconMoon');

    const sync = () => {
      const isNight = document.documentElement.getAttribute('data-theme') === 'night';
      if (sun)  sun.style.display  = isNight ? 'none' : '';
      if (moon) moon.style.display = isNight ? '' : 'none';
      btn.setAttribute('aria-pressed', isNight ? 'true' : 'false');
      btn.setAttribute('aria-label', isNight ? 'Switch to paper theme' : 'Switch to night theme');
    };
    sync();

    btn.addEventListener('click', () => {
      const cur  = document.documentElement.getAttribute('data-theme');
      const next = cur === 'night' ? 'paper' : 'night';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      sync();
    });
  }

  // -- Project-page lightbox (self-contained) ----------------------------
  // Owns the lightbox entirely on project pages: hero plate image,
  // example-image grids, close button, and backdrop.
  //
  // The legacy markup nests #lightbox inside .stage, which has
  // position: relative + z-index: 5 — that creates a stacking context and
  // traps the lightbox behind any sibling with higher z-index. Move it to
  // <body> root so its z-index actually means what it says.
  if (document.body.classList.contains('project-page')) {
    const box   = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-caption');

    if (box && lbImg && lbCap) {
      if (box.parentNode !== document.body) {
        document.body.appendChild(box);
      }

      const closeBtn = box.querySelector('.close');
      let trigger = null;

      const open = (img) => {
        trigger = img;
        lbImg.src = img.currentSrc || img.src;
        lbCap.textContent = img.alt || '';
        box.classList.add('is-open');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
      };
      const close = () => {
        box.classList.remove('is-open');
        if (trigger) {
          trigger.focus({ preventScroll: true });
          trigger = null;
        }
      };

      const hero = document.querySelector('.project-image');
      if (hero) {
        hero.style.cursor = 'zoom-in';
        hero.setAttribute('tabindex', '0');
        hero.setAttribute('role', 'button');
        hero.setAttribute('aria-label', 'Open image preview');
        hero.addEventListener('click', () => open(hero));
        hero.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(hero); }
        });
      }

      document.querySelectorAll('.example-image img').forEach((img) => {
        img.style.cursor = 'zoom-in';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Open image preview');
        img.addEventListener('click', () => open(img));
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', close);

      box.addEventListener('click', (e) => {
        if (e.target === box) close();
      });

      document.addEventListener('keydown', (e) => {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'Tab') {
          // Only the close button is focusable inside the dialog — trap focus on it.
          e.preventDefault();
          if (closeBtn) closeBtn.focus({ preventScroll: true });
        }
      });
    }
  }
});
