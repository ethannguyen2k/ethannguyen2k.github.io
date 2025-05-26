// JavaScript for dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard accessibility for dropdown
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
                
                // Focus the first link in the dropdown
                const firstLink = this.nextElementSibling.querySelector('a');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        });
    });

    // For mobile devices - close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        dropdownBtns.forEach(btn => {
            const dropdown = btn.parentElement;
            if (!dropdown.contains(e.target)) {
                const content = dropdown.querySelector('.dropdown-content');
                if (content) {
                    content.style.display = 'none';
                }
            }
        });
    });

    // Allow the dropdown to be toggleable on mobile
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.nextElementSibling;
            
            // Close all other dropdowns
            dropdownBtns.forEach(otherBtn => {
                if (otherBtn !== this) {
                    const otherContent = otherBtn.nextElementSibling;
                    if (otherContent) {
                        otherContent.style.display = 'none';
                    }
                }
            });
            
            // Toggle this dropdown
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});