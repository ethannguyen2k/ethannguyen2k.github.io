document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#nav-bar a');
    const tocLinks = document.querySelectorAll('#toc a');
    const sections = document.querySelectorAll('section');
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");

    // Highlight the current nav link
    let currentUrl = window.location.pathname.split('/').pop();
    navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('current');
        }
    });

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

        tocLinks.forEach(function(link) {
            let section = document.querySelector(link.getAttribute('href'));

            if (
                section.offsetTop <= fromTop + 50 &&
                section.offsetTop + section.offsetHeight > fromTop + 50
            ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
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
