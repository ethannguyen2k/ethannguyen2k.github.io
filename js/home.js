// Home page interactivity (cyanotype). Loaded with `defer`, so DOM is ready.

// ---- Footer year + date stamp -----------------------------------------
{
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const d = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const stamp = document.getElementById('dateStamp');
  if (stamp) {
    stamp.textContent =
      String(d.getDate()).padStart(2,'0') + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }
}

// ---- Theme toggle ------------------------------------------------------
{
  const btn  = document.getElementById('themeToggle');
  const sun  = document.getElementById('themeIconSun');
  const moon = document.getElementById('themeIconMoon');

  function syncIcon() {
    const isNight = document.documentElement.getAttribute('data-theme') === 'night';
    sun.style.display  = isNight ? 'none' : '';
    moon.style.display = isNight ? '' : 'none';
  }
  syncIcon();

  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'night' ? 'paper' : 'night';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncIcon();
  });
}

// ---- Gacha hover on the Surprise plate --------------------------------
// At rest: silhouette. On hover: 14 stickers burst in with random
// positions, rotations, and stagger. Each hover regenerates positions
// so it never feels static.
{
  const stage = document.getElementById('gachaStage');
  const plate = document.getElementById('surpriseBtn');
  const sources = [
    'images/surpriseicon/SurpriseIcon.webp',
    'images/surpriseicon/SurpriseIcon2.webp',
    'images/surpriseicon/SurpriseIcon2 (2).jpg',
    'images/surpriseicon/SurpriseIcon3.webp',
    'images/surpriseicon/SurpriseIcon4.webp',
    'images/surpriseicon/SurpriseIcon5.webp',
    'images/surpriseicon/SurpriseIcon6.webp',
    'images/surpriseicon/SurpriseIcon7.webp',
    'images/surpriseicon/SurpriseIcon8.webp',
    'images/surpriseicon/SurpriseIcon9.webp',
    'images/surpriseicon/SurpriseIcon10.webp',
    'images/surpriseicon/SurpriseIcon11.webp',
    'images/surpriseicon/SurpriseIcon12.webp',
    'images/surpriseicon/SurpriseIcon13.gif',
  ];

  // Pre-create the 14 sticker elements. Each one is positioned at the
  // plate's center; hover sets per-element CSS variables to scatter them.
  const stickers = sources.map((src, i) => {
    const el = document.createElement('div');
    el.className = 'gacha-sticker';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.draggable = false;
    el.appendChild(img);
    stage.appendChild(el);
    return el;
  });

  function scatter() {
    const rect = plate.getBoundingClientRect();
    // Spread radius scaled to plate dimensions.
    const rx = rect.width  * 0.36;
    const ry = rect.height * 0.36;
    stickers.forEach((el, i) => {
      const tx = (Math.random() * 2 - 1) * rx;
      const ty = (Math.random() * 2 - 1) * ry;
      const r  = (Math.random() * 2 - 1) * 28;       // ±28°
      const d  = i * 28 + Math.random() * 60;         // staggered delay
      el.style.setProperty('--tx', tx.toFixed(1) + 'px');
      el.style.setProperty('--ty', ty.toFixed(1) + 'px');
      el.style.setProperty('--r',  r.toFixed(1) + 'deg');
      el.style.setProperty('--d',  d.toFixed(0) + 'ms');
    });
  }

  plate.addEventListener('mouseenter', scatter);
  // Click also triggers the side-panel surprise video — see below.
}

// ---- Side panel (surprise / links / contact) --------------------------
{
  const container = document.getElementById('contentContainer');
  const pane      = document.getElementById('secondaryPane');
  const inner     = document.getElementById('paneInner');
  const back      = document.getElementById('paneBack');

  function showPanel(html) {
    inner.innerHTML = html;
    container.classList.add('active');
    pane.setAttribute('aria-hidden', 'false');
    inner.scrollTop = 0;
  }

  function closePanel() {
    const iframe = inner.querySelector('iframe');
    if (iframe) iframe.src = '';   // stop YouTube playback
    container.classList.remove('active');
    pane.setAttribute('aria-hidden', 'true');
    setTimeout(() => { inner.innerHTML = ''; }, 480);
  }

  back.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && container.classList.contains('active')) closePanel();
  });

  // ---- Surprise: cycling YouTube embeds -------------------------------
  {
    const videos = [
      { id: 'CiHfAO1XE4U', desc: 'a heartfelt thanks to my friends for an amazing gift, still searching for the perfect spot.' },
      { id: 'dQw4w9WgXcQ', desc: 'dQw4w9WgXcQ…' },
      { id: '6GCNUeTFSbA', desc: '༼ つ ◕_◕ ༽つ ༼ つ ◕_◕ ༽つ' },
      { id: '6b5DkEzP9Jw', desc: 'no matter where you are' },
      { id: 'nrZNzc9AjP8', desc: 'disillusionment' },
      { id: 'OPf0YbXqDm0', desc: 'Bruno Mars funky never fails ~(=^‥^)/' },
    ];
    let i = 0;

    function renderSurprise() {
      const { id, desc } = videos[i];
      const isLast = i === videos.length - 1;
      i = (i + 1) % videos.length;
      showPanel(`
        <div class="pane-eyebrow">Pl. I.6 · Latent</div>
        <h2 class="pane-heading">a small surprise</h2>
        <div class="video-mount">
          <iframe
            src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
          <div class="caption">${desc}</div>
        </div>
        <button type="button" class="surprise-again" data-again>
          ${isLast ? 'start over →' : 'surprise me again →'}
        </button>
      `);
      inner.querySelector('[data-again]').addEventListener('click', renderSurprise);
    }

    document.getElementById('surpriseBtn').addEventListener('click', e => {
      e.preventDefault();
      renderSurprise();
    });
  }

  // ---- Links panel ---------------------------------------------------
  document.getElementById('socialLinksBtn').addEventListener('click', e => {
    e.preventDefault();
    showPanel(`
      <div class="pane-eyebrow">Pl. I.4 · Nodi</div>
      <h2 class="pane-heading">connect with me</h2>
      <ul class="links-list">
        <li>
          <span class="num">01</span>
          <a href="https://github.com/ethannguyen2k" target="_blank" rel="noopener">github</a>
          <span class="handle">@ethannguyen2k</span>
        </li>
        <li>
          <span class="num">02</span>
          <a href="https://linkedin.com/in/ethan-2k" target="_blank" rel="noopener">linkedin</a>
          <span class="handle">/ethan-2k</span>
        </li>
        <li>
          <span class="num">03</span>
          <a href="https://www.facebook.com/killthemallpro" target="_blank" rel="noopener">facebook</a>
          <span class="handle">/killthemallpro</span>
        </li>
      </ul>
      <p class="contact-note" style="font-style: italic;">each opens in a new tab.</p>
    `);
  });

  // ---- Contact panel -------------------------------------------------
  document.getElementById('contactBtn').addEventListener('click', e => {
    e.preventDefault();
    showPanel(`
      <div class="pane-eyebrow">Pl. I.3 · Epistula</div>
      <h2 class="pane-heading">say hello</h2>
      <div class="contact-block">
        <div class="contact-eyebrow">the easiest way</div>
        <a href="mailto:phatnguyenground@gmail.com" class="contact-email">phatnguyenground@gmail.com</a>
        <p class="contact-note">i don't really check social messages — email lands best. or use the button below to open your mail app.</p>
        <a href="mailto:phatnguyenground@gmail.com" class="contact-send">send → email</a>
      </div>
    `);
  });

  // ---- About panel — cloned from <template id="aboutTemplate"> ------
  document.getElementById('aboutBtn').addEventListener('click', () => {
    const tpl = document.getElementById('aboutTemplate');
    const frag = tpl.content.cloneNode(true);

    // Fill any [data-collage] containers with the requested number of items.
    frag.querySelectorAll('[data-collage]').forEach(host => {
      const count = parseInt(host.dataset.count, 10) || 20;
      for (let n = 1; n <= count; n++) {
        const num = String(n).padStart(2, '0');
        const div = document.createElement('div');
        div.className = 'collage-item';
        const img = document.createElement('img');
        img.src = `images/collage-modal/collage_${num}.webp`;
        img.alt = `Collage ${n}`;
        img.loading = 'lazy';
        div.appendChild(img);
        host.appendChild(div);
      }
    });

    // Replace pane content with the cloned template.
    inner.innerHTML = '';
    inner.appendChild(frag);
    container.classList.add('active');
    pane.setAttribute('aria-hidden', 'false');
    inner.scrollTop = 0;

    // Stagger the collage into view after the panel slide-in.
    const items = inner.querySelectorAll('.collage-item');
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 480 + 60 * i);
      el.addEventListener('click', () => {
        const src = el.querySelector('img')?.src;
        if (src) openCollageLightbox(src);
      });
    });
  });

  // ---- Collage lightbox ----------------------------------------------
  const lightbox = document.getElementById('collageLightbox');
  const lightboxImg = lightbox.querySelector('img');

  function openCollageLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeCollageLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    setTimeout(() => { lightboxImg.src = ''; }, 240);
  }
  lightbox.addEventListener('click', closeCollageLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeCollageLightbox();
    }
  });
}
