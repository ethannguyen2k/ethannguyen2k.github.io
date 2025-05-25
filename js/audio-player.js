/**
 * Audio Player JavaScript
 * Controls playback speed and provides restart functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById('blog-audio');
    const restartBtn = document.getElementById('restartBtn');
    const speedSelect = document.getElementById('playbackSpeed');
    
    // Restart button functionality
    restartBtn.addEventListener('click', function() {
        audioElement.currentTime = 0;
    });
    
    // Playback speed functionality
    speedSelect.addEventListener('change', function() {
        audioElement.playbackRate = parseFloat(this.value);
    });
});
