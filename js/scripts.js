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
            audioNudge.style.display = 'none';
        }
    }
}

function playNote(frequency) {
    if (!audioInitialized) {
        initAudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const panNode = audioContext.createStereoPanner();

    oscillator.type = 'triangle'; // slightly richer tone
    oscillator.frequency.setValueAtTime(frequency - 10, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);

    panNode.pan.value = Math.random() * 2 - 1;

    oscillator.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
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
        audioNudge.style.display = 'block';
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
    const sections = document.querySelectorAll('section');
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const divs = document.querySelectorAll('div.fade-in');

    // Highlight the current nav link
    let currentUrl = window.location.pathname.split('/').pop();
    navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('current');
        }
    });

    function handleScroll() {
        let offset = 150;  // Adjust this value if necessary

        divs.forEach(function(div) {
            if (div.getBoundingClientRect().top <= window.innerHeight - offset) {
                div.classList.add('visible');
            }
        });
    }

    // Initial check for divs already in view
    handleScroll();

    // Check divs on scroll
    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for TOC links
    tocLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add theme toggle initialization here
    const themeToggle = document.getElementById('themeToggle');
    
    // Toggle theme
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Highlight the TOC link while scrolling
    window.addEventListener('scroll', function() {
        let offset = 150;  // Adjust this value if necessary

        // Add fade-in effect
        sections.forEach(function(section) {
            if (section.getBoundingClientRect().top <= window.innerHeight - offset) {
                section.classList.add('visible');
            }
        });
    });

    // Initial check for sections already in view
    sections.forEach(function(section) {
        if (section.getBoundingClientRect().top <= window.innerHeight) {
            section.classList.add('visible');
        }
    });

    // Lightbox functionality
    const exampleImages = document.querySelectorAll('.example-image img');
    exampleImages.forEach(function(img) {
        img.addEventListener('click', function() {
            openLightbox(img);
        });
    });

    function openLightbox(img) {
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    document.querySelector('.close').addEventListener('click', closeLightbox);

    window.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
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
    toggle.innerHTML = '<i class="fas fa-bars"></i>';
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
