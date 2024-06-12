// js/scripts.js
document.addEventListener('DOMContentLoaded', function() {
    var navLinks = document.querySelectorAll('#nav-bar a');
    var currentUrl = window.location.pathname.split('/').pop(); // Get the current page name
    navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('current');
        }
    });
});
