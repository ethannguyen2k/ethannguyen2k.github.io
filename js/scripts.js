document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#nav-bar a');
    const tocLinks = document.querySelectorAll('#toc a');
    const sections = document.querySelectorAll('section');

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
});
