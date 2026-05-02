// Home page interactivity. Loaded with `defer`, so DOM is ready by the time
// this runs — no DOMContentLoaded wrapper needed.

// ---- Footer year -------------------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Theme toggle ------------------------------------------------------
document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ---- Logo quote tooltip ------------------------------------------------
{
    const logo = document.getElementById('logo');
    const tooltip = document.getElementById('quote-tooltip');
    let timer;

    logo.addEventListener('mouseenter', () => {
        const r = logo.getBoundingClientRect();
        tooltip.style.top = (r.bottom + 10) + 'px';
        tooltip.style.left = (r.left + r.width / 2 - 250) + 'px';
        clearTimeout(timer);
        timer = setTimeout(() => {
            tooltip.style.display = 'block';
            setTimeout(() => tooltip.classList.add('visible'), 10);
        }, 100);
    });

    logo.addEventListener('mouseleave', () => {
        clearTimeout(timer);
        tooltip.classList.remove('visible');
        setTimeout(() => { tooltip.style.display = 'none'; }, 300);
    });
}

// ---- Cycling surprise icon --------------------------------------------
{
    const icon = document.getElementById('cyclingIcon');
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
    let i = 0;
    document.querySelector('.cycling-icon-container').addEventListener('mouseenter', () => {
        i = (i + 1) % sources.length;
        icon.src = sources[i];
    });
}

// ---- Secondary-box panels (surprise / social / contact) ---------------
const contentContainer = document.getElementById('contentContainer');
const dynamicBox = document.getElementById('dynamicBox');

function showPanel(html) {
    dynamicBox.innerHTML = html + `
        <button class="back-button" data-back>
            <i class="fas fa-arrow-left"></i> Back
        </button>`;
    contentContainer.classList.add('active');
    dynamicBox.querySelector('[data-back]').addEventListener('click', () => {
        // Stop any embedded video by clearing its src.
        const iframe = dynamicBox.querySelector('iframe');
        if (iframe) iframe.src = '';
        contentContainer.classList.remove('active');
    });
}

// Surprise me
{
    const videos = [
        { id: 'CiHfAO1XE4U', desc: 'a heartfelt thanks to my friends for an amazing gift, still searching for the perfect spot.<br>click surprise me for more!' },
        { id: 'dQw4w9WgXcQ', desc: 'dQw4w9WgXcQ...<br>click surprise me for more!' },
        { id: '6GCNUeTFSbA', desc: '༼ つ ◕_◕ ༽つ༼ つ ◕_◕ ༽つ<br>click surprise me for more!' },
        { id: '6b5DkEzP9Jw', desc: 'no matter where you are<br>click surprise me for more!' },
        { id: 'nrZNzc9AjP8', desc: 'disillusionment<br>click surprise me for more!' },
        { id: 'OPf0YbXqDm0', desc: 'Bruno Mars funky never fails ~(=^‥^)/<br>the surprise ends here, but click again if you want to start over!' },
    ];
    let i = 0;
    function renderSurprise() {
        const { id, desc } = videos[i];
        i = (i + 1) % videos.length;
        showPanel(`
            <div class="video-container">
                <iframe
                    width="560" height="315"
                    src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen></iframe>
                <p class="video-description">${desc}</p>
                <button type="button" class="surprise-again" data-surprise-again>
                    <i class="fas fa-shuffle shuffle-ico"></i>
                    <span>surprise me again</span>
                    <i class="fas fa-arrow-right arrow-ico"></i>
                </button>
            </div>`);
        dynamicBox.querySelector('[data-surprise-again]')
            .addEventListener('click', renderSurprise);
    }
    document.getElementById('surpriseBtn').addEventListener('click', renderSurprise);
}

// Social links
document.getElementById('socialLinksBtn').addEventListener('click', () => {
    showPanel(`
        <h2 class="panel-heading">connect with me</h2>
        <div class="social-links">
            <a href="https://github.com/ethannguyen2k" target="_blank" class="social-link">
                <div class="social-circle"><i class="fab fa-github"></i></div>
                <span class="social-label">github</span>
            </a>
            <a href="https://linkedin.com/in/ethan-2k" target="_blank" class="social-link">
                <div class="social-circle"><i class="fab fa-linkedin"></i></div>
                <span class="social-label">linkedin</span>
            </a>
            <a href="https://www.facebook.com/killthemallpro" target="_blank" class="social-link">
                <div class="social-circle"><i class="fa-brands fa-facebook"></i></div>
                <span class="social-label">facebook</span>
            </a>
        </div>
        <p class="panel-center" style="margin-top: 20px;">click any icons will open up a new tab!</p>`);
});

// Contact
document.getElementById('contactBtn').addEventListener('click', () => {
    showPanel(`
        <h2 class="panel-heading">something something email</h2>
        <div class="panel-center">
            <p>the easiest way to contact me is through email! i don't really check my
            social media messages, so please send things to my email instead</p>
            <img src="images/email-icon.webp" alt="Email me" class="contact-icon">
            <p class="contact-email">phatnguyenground@gmail.com</p>
            <p>or press the button below to open your mail app.</p>
            <div style="margin-top: 20px;">
                <a href="mailto:phatnguyenground@gmail.com" style="text-decoration: none;">
                    <button class="contact-send-btn">send me an email!</button>
                </a>
            </div>
        </div>`);
});

// ---- About modal ------------------------------------------------------
{
    const modal = document.getElementById('aboutModal');
    const closeBtn = document.getElementById('aboutClose');

    document.getElementById('aboutBtn').addEventListener('click', () => modal.classList.add('visible'));
    closeBtn.addEventListener('click', () => modal.classList.remove('visible'));
    window.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('visible');
    });

    // Photo collage: build once, fade in on modal open, reset on close.
    const collage = document.getElementById('photoCollage');
    const COUNT = 20;
    const STAGGER_MS = 150;

    for (let n = 1; n <= COUNT; n++) {
        const num = String(n).padStart(2, '0');
        const div = document.createElement('div');
        div.className = 'collage-item';
        const img = document.createElement('img');
        img.src = `images/collage-modal/collage_${num}.webp`;
        img.alt = `Collage Image ${n}`;
        img.loading = 'lazy';
        div.appendChild(img);
        collage.appendChild(div);
    }

    modal.addEventListener('transitionend', e => {
        if (e.propertyName === 'opacity' && modal.classList.contains('visible')) {
            collage.querySelectorAll('.collage-item').forEach((item, idx) => {
                setTimeout(() => item.classList.add('visible'), STAGGER_MS * idx);
            });
        }
    });

    closeBtn.addEventListener('click', () => {
        collage.querySelectorAll('.collage-item').forEach(item => item.classList.remove('visible'));
    });
}
