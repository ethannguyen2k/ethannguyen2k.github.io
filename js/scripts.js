document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#nav-bar a');
    const tocLinks = document.querySelectorAll('#toc a');
    const sections = document.querySelectorAll('section');
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const divs = document.querySelectorAll('div.fade-in');
    const surpriseMeButton = document.getElementById('surprise-me');
    const videoSection = document.getElementById('video-section');
    const surpriseVideo = document.getElementById('surprise-video');
    const videoUrls = [
        'https://www.youtube.com/embed/dQw4w9WgXcQ?si=nhLRH2FJPDz-8NZF',
        'https://www.youtube.com/embed/VIDEO_ID2',
        'https://www.youtube.com/embed/VIDEO_ID3',
        'https://www.youtube.com/embed/VIDEO_ID4',
        'https://www.youtube.com/embed/VIDEO_ID5'
    ];

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

    function getRandomVideoUrl() {
        const randomIndex = Math.floor(Math.random() * videoUrls.length);
        return videoUrls[randomIndex];
    }

    surpriseMeButton.addEventListener('click', function() {
        if (videoSection.classList.contains('hidden')) {
            videoSection.classList.remove('hidden');
            videoSection.classList.add('visible');
        } 
        surpriseVideo.src = getRandomVideoUrl();
    });
});
