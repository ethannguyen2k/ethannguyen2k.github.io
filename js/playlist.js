document.addEventListener('DOMContentLoaded', function() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    const playlistBody = document.getElementById('playlist-body');

    let originalBackground = playlistBody.style.backgroundImage;

    // Function to initialize TVScreen flicker effect
    function initializeTVScreen(container, bgImage) {
        var tvScreen = new TVScreen(container, '100%', '100vh');
        tvScreen.loadContent('<img src="' + bgImage + '" style="width:100%; height:100%;">');
        return tvScreen;
    }

    // Function to remove TVScreen flicker effect
    function removeTVScreen(tvScreen) {
        if (tvScreen && tvScreen.interval) {
            clearInterval(tvScreen.interval);
        }
        $(container).empty();
        playlistBody.style.backgroundImage = originalBackground;
    }

    let activeTVScreen = null;

    playlistItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            const bgImage = item.getAttribute('data-bg');
            originalBackground = playlistBody.style.backgroundImage;
            if (activeTVScreen) {
                removeTVScreen(activeTVScreen);
            }
            activeTVScreen = initializeTVScreen('#playlist-body', bgImage);
        });

        item.addEventListener('mouseout', () => {
            removeTVScreen(activeTVScreen);
            activeTVScreen = null;
        });
    });
});
