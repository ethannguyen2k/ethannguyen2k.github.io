document.addEventListener('DOMContentLoaded', function() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    const tvContainer = document.getElementById('tv-container');
    const tvScreenElement = document.getElementById('tv-screen');
    let tvScreen = new TVScreen(tvScreenElement, '100%', '100%');

    playlistItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            const imageUrl = item.getAttribute('data-bg');
            tvScreen.loadContent(`
                <div style="position: relative; width: 100%; height: 100%;">
                    <div style="position: absolute; width: 100%; height: 100%; background: url(${imageUrl}) center center / cover no-repeat;"></div>
                    <div style="position: absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7);"></div>
                </div>
            `);
            tvContainer.style.zIndex = 1;
        });

        item.addEventListener('mouseout', function() {
            tvScreen.loadContent('');
            tvContainer.style.zIndex = -1;
        });
    });
});
