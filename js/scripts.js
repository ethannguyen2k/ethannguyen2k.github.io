function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Call it immediately
applyTheme();

// Musical Notes System
let audioContext = null;
let currentNoteIndex = 0;
let audioInitialized = false;
const noteFrequencies = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, // C4–B4
    523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77  // C5–B5
];

function initAudioContext() {
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInitialized = true;
        
        // Hide the nudge once audio is initialized
        const audioNudge = document.getElementById('audio-nudge');
        if (audioNudge) {
            audioNudge.classList.add('hidden');
        }
    }
}

function playNote(frequency) {
    if (!audioInitialized) {
        initAudioContext();
    }

    const t = audioContext.currentTime;
    const dur = 1.2;  // total note length — long natural decay

    // Two-oscillator voice: sine fundamental + soft detuned octave for shimmer
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, t);
    osc2.frequency.setValueAtTime(frequency * 2, t);
    osc2.detune.setValueAtTime(6, t);  // ~6 cents up — chorus shimmer

    const mix1 = audioContext.createGain();
    const mix2 = audioContext.createGain();
    mix1.gain.value = 1.0;
    mix2.gain.value = 0.10;  // octave is decoration, not lead

    // Warm low-pass to file off triangle harshness
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, t);
    filter.Q.setValueAtTime(0.6, t);

    // Envelope: exponential attack avoids click, long exp release rings out.
    // exponentialRampToValueAtTime requires a positive target → use 0.0001.
    const env = audioContext.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.16, t + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    // Narrow random pan so rapid hovers don't whip across the head
    const pan = audioContext.createStereoPanner();
    pan.pan.setValueAtTime((Math.random() - 0.5) * 0.6, t);

    osc1.connect(mix1);
    osc2.connect(mix2);
    mix1.connect(filter);
    mix2.connect(filter);
    filter.connect(env);
    env.connect(pan);
    pan.connect(audioContext.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + dur + 0.05);
    osc2.stop(t + dur + 0.05);
}

function playNextNote() {
    playNote(noteFrequencies[currentNoteIndex]);
    currentNoteIndex = (currentNoteIndex + 1) % noteFrequencies.length;
}

document.addEventListener('DOMContentLoaded', function() {
    // Scroll Prompt functionality
    const scrollPrompt = document.getElementById('scroll-prompt');

    if (scrollPrompt) {
        // Hide the scroll prompt when user is near the bottom of the page
        window.addEventListener('scroll', function () {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
    
            // Hide when near the bottom (e.g., within 100px)
            if (scrollPosition + windowHeight >= documentHeight - 100) {
                scrollPrompt.style.opacity = '0';
                setTimeout(() => {
                    scrollPrompt.style.display = 'none';
                }, 300);
            } else {
                scrollPrompt.style.display = 'flex';
                setTimeout(() => {
                    scrollPrompt.style.opacity = '0.8';
                }, 10);
            }
        });
    
        // Smooth scroll down when clicked
        scrollPrompt.addEventListener('click', function () {
            const windowHeight = window.innerHeight;
            window.scrollTo({
                top: windowHeight,
                behavior: 'smooth'
            });
        });
    
        // Initial check
        setTimeout(() => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
    
            if (scrollPosition + windowHeight < documentHeight - 100) {
                scrollPrompt.style.display = 'flex';
                scrollPrompt.style.opacity = '0.8';
            } else {
                scrollPrompt.style.display = 'none';
            }
        }, 1000);
    }    
    
    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Always show audio nudge when page loads
    const audioNudge = document.getElementById('audio-nudge');
    if (audioNudge) {
        audioNudge.classList.remove('hidden');
    }
    
    // Initialize audio context on first user interaction
    document.addEventListener('click', function initAudioOnce() {
        initAudioContext();
        document.removeEventListener('click', initAudioOnce);
    }, { once: true });
    
    // Tech bubble music functionality
    const techBubbles = document.querySelectorAll('.tech-bubble');
    if (techBubbles) {
        techBubbles.forEach(bubble => {
            bubble.addEventListener('mouseenter', function() {
                playNextNote();
            });
        });
    }  

    // Add music to TOC links on hover
    const tocLinks = document.querySelectorAll('#toc a');
    if (tocLinks) {
        tocLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                playNextNote();
            });
        });
    }

    const navLinks = document.querySelectorAll('#nav-bar a');

    let currentUrl = window.location.pathname.split('/').pop();
    navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('current');
        }
    });

    const revealTargets = document.querySelectorAll('.fade-in, section');
    if (revealTargets.length) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -150px 0px' });
        revealTargets.forEach(function(el) { revealObserver.observe(el); });
    }

    tocLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});

// Anchor highlight functionality for blog references
document.addEventListener('DOMContentLoaded', function() {
    // Check if the URL contains a hash (anchor)
    if (window.location.hash) {
        // Wait a brief moment to ensure the page has scrolled to the anchor
        setTimeout(() => {
            const targetElement = document.getElementById(window.location.hash.substring(1));
            
            if (targetElement) {
                // Remove any existing highlight
                const previousHighlight = document.querySelector('.anchor-highlight');
                if (previousHighlight) {
                    previousHighlight.classList.remove('anchor-highlight');
                }
                
                // Add highlight class
                targetElement.classList.add('anchor-highlight');
                
                // Optional: Ensure the element is visible and centered in view
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    }
    
    // Handle clicks on any internal anchor links
    document.body.addEventListener('click', function(e) {
        // Check if the clicked element is an anchor link
        if (e.target.tagName === 'A' && e.target.hash && e.target.origin === window.location.origin) {
            // Get the target element
            const targetId = e.target.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                // Remove any existing highlight
                const previousHighlight = document.querySelector('.anchor-highlight');
                if (previousHighlight) {
                    previousHighlight.classList.remove('anchor-highlight');
                }
                
                // Wait for the browser to navigate to the anchor
                setTimeout(() => {
                    // Add highlight class
                    targetElement.classList.add('anchor-highlight');
                }, 100);
            }
        }
    });
});

// Accordion toggle (used by .accordion-heading onclick attributes in long blog posts).
function toggleAccordion(element) {
    element.parentElement.classList.toggle('open');
}

// Mobile menu toggle for blog page sidebars. No-op if the page has no .sidebar.
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const toggle = document.createElement('button');
    toggle.classList.add('mobile-menu-toggle');
    toggle.innerHTML = '<i aria-hidden="true" class="fas fa-bars"></i>';
    toggle.setAttribute('aria-label', 'Toggle menu');
    document.body.insertBefore(toggle, document.body.firstChild);

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        toggle.classList.toggle('toggle-active');
    });

    document.querySelectorAll('#nav-bar a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('sidebar-open');
                toggle.classList.remove('toggle-active');
            }
        });
    });
});
