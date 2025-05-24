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
// Remove the localStorage check so nudge appears on every visit
// const nudgeShown = localStorage.getItem('audioNudgeShown') === 'true';
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
            // Remove this to prevent storing the nudge shown state
            // localStorage.setItem('audioNudgeShown', 'true');
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
    console.log("DOM fully loaded");

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
    
    // Update footer with current year
    updateFooterYear();
    
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

    // Update footer with current year
    updateFooterYear();
    
    const navLinks = document.querySelectorAll('#nav-bar a');
    const sections = document.querySelectorAll('section');
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const divs = document.querySelectorAll('div.fade-in');
    const tooltipTrigger = document.getElementById("tooltip-trigger");
    const tooltipContainer = document.getElementById("tooltip-container");
    const surpriseMeBtn = document.getElementById('surpriseMe');
    const videoSection = document.getElementById('videoSection');
    const videoDescription = document.getElementById('videoDescription');
    const videoIds = [
        'CiHfAO1XE4U', // My own
        'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
        '6GCNUeTFSbA',  // Micheal Sembello - Maniac
        '6b5DkEzP9Jw', // Luke Chiang - Home
        'nrZNzc9AjP8', // Good Kid - Second Rate Town
        'OPf0YbXqDm0', // Mark Ronson - Uptown Funk ft. Bruno Mars
    ];
    const videoDescriptions = [
        'A heartfelt thanks to my friends for an amazing gift, still searching for the perfect spot.<br>Click Surprise me for more!',
        'Rick...<br>Click Surprise me for more!',
        '༼ つ ◕_◕ ༽つ༼ つ ◕_◕ ༽つ<br>Click Surprise me for more!',
        'no matter where you are<br>Click Surprise me for more!',
        'disillusionment<br>Click Surprise me for more!',
        'Bruno Mars funky never fails ~(=^‥^)/<br>The surprise ends here, but click again if you want to start over!',
    ];

    let currentVideoIndex = 0;

    if (surpriseMeBtn && videoSection && videoDescription) {
        surpriseMeBtn.addEventListener('click', function() {
            const videoId = videoIds[currentVideoIndex];
            const description = videoDescriptions[currentVideoIndex];
    
            videoSection.innerHTML = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            `;
            videoDescription.innerHTML = description;
            
            videoSection.classList.remove('hidden');
            setTimeout(() => {
                videoSection.classList.add('visible');
            }, 50); // small delay to ensure transition
            
            // Scroll to video section
            videoSection.scrollIntoView({ behavior: 'smooth' });
    
            // Move to the next video, loop back to the start if we've reached the end
            currentVideoIndex = (currentVideoIndex + 1) % videoIds.length;
        });
    }

    // Tooltip functionality
    let tooltipTimeout;
    if (tooltipTrigger && tooltipContainer) {
        tooltipTrigger.addEventListener("mouseenter", function() {
            tooltipTimeout = setTimeout(function() {
                tooltipContainer.style.display = "block";
            });
        });

        tooltipTrigger.addEventListener("mouseleave", function() {
            tooltipContainer.style.display = "none";
        });

        document.addEventListener("mousemove", function(event) {
            if (tooltipContainer.style.display === "block") {
                tooltipContainer.style.top = (event.clientY + 20) + "px";
                tooltipContainer.style.left = (event.clientX + 20) + "px";
            }
        });
    }

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
        
        // Debug log
        console.log('Theme switched to:', newTheme);
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

// Function to update the footer year dynamically
function updateFooterYear() {
    const footerYear = document.querySelectorAll('footer p');
    if (footerYear.length > 0) {
        const currentYear = new Date().getFullYear();
        footerYear.forEach(p => {
            p.innerHTML = p.innerHTML.replace(/\d{4}/, currentYear);
        });
    }
}

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
