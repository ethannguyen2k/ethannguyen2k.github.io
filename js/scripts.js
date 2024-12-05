function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Call it immediately
applyTheme();

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    const navLinks = document.querySelectorAll('#nav-bar a');
    const tocLinks = document.querySelectorAll('#toc a');
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
        let fromTop = window.scrollY;
        let offset = 150;  // Adjust this value if necessary

        tocLinks.forEach(function(link) {
            let section = document.querySelector(link.getAttribute('href'));
            let sectionTop = section.offsetTop - offset;
            let sectionBottom = sectionTop + section.offsetHeight;

            if (fromTop >= sectionTop && fromTop < sectionBottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Check if the user has scrolled to the bottom of the page
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            tocLinks.forEach(function(link) {
                link.classList.remove('active');
            });
            tocLinks[tocLinks.length - 1].classList.add('active');
        }

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
