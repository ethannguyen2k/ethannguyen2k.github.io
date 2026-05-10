// Shared chrome behavior for cyanotype pages.
//
// Load AFTER js/scripts.js (in body, not head). Each page must still inline
// the pre-paint theme migration in <head> so data-theme is set before paint.

document.addEventListener('DOMContentLoaded', () => {
  // -- Theme toggle override ---------------------------------------------
  // Drop the legacy light/dark listener scripts.js attached to #themeToggle
  // by clone-replacing the node, then bind a paper/night handler with
  // sun/moon icon sync.
  const btn = document.getElementById('themeToggle');
  if (btn) {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);

    const sun  = fresh.querySelector('#themeIconSun');
    const moon = fresh.querySelector('#themeIconMoon');

    const syncIcon = () => {
      const isNight = document.documentElement.getAttribute('data-theme') === 'night';
      if (sun)  sun.style.display  = isNight ? 'none' : '';
      if (moon) moon.style.display = isNight ? '' : 'none';
    };
    syncIcon();

    fresh.addEventListener('click', () => {
      const cur  = document.documentElement.getAttribute('data-theme');
      const next = cur === 'night' ? 'paper' : 'night';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon();
    });
  }

  // -- Project-page lightbox (self-contained) ----------------------------
  // Owns the lightbox entirely on project pages: hero plate image,
  // example-image grids, close button, and backdrop.
  //
  // The legacy markup nests #lightbox inside .container1, which has
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

      const open = (img) => {
        lbImg.src = img.currentSrc || img.src;
        lbCap.textContent = img.alt || '';
        box.style.display = 'flex';
      };
      const close = () => { box.style.display = 'none'; };

      // Hero plate image
      const hero = document.querySelector('.project-image');
      if (hero) {
        hero.style.cursor = 'zoom-in';
        hero.addEventListener('click', () => open(hero));
      }

      // Example-image grids (sna, uciadult, privacy, poker, totp)
      document.querySelectorAll('.example-image img').forEach((img) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(img));
      });

      // Close on × button
      const closeBtn = box.querySelector('.close');
      if (closeBtn) closeBtn.addEventListener('click', close);

      // Close on backdrop click
      box.addEventListener('click', (e) => {
        if (e.target === box) close();
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && box.style.display !== 'none' && box.style.display !== '') {
          close();
        }
      });
    }
  }
});
