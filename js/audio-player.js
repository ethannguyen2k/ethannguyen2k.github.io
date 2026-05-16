/**
 * Cyanotype custom audio player.
 *
 * DOM contract (see blog/.../mlp-mnist.html):
 *   #blog-audio, #playBtn (with child <i>), #restartBtn, #playbackSpeed,
 *   #audioProgress, #audioProgressFill,
 *   #audioTime containing <span class="now"> and <span class="dur">.
 */
document.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('blog-audio');
  if (!audio) return;

  const playBtn     = document.getElementById('playBtn');
  const playIcon    = playBtn.querySelector('i');
  const restartBtn  = document.getElementById('restartBtn');
  const speedSelect = document.getElementById('playbackSpeed');
  const progressEl  = document.getElementById('audioProgress');
  const fillEl      = document.getElementById('audioProgressFill');
  const timeEl      = document.getElementById('audioTime');
  const nowEl       = timeEl.querySelector('.now');
  const durEl       = timeEl.querySelector('.dur');

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m  = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  const render = () => {
    const dur = audio.duration;
    fillEl.style.width = dur ? `${(audio.currentTime / dur) * 100}%` : '0%';
    nowEl.textContent  = fmt(audio.currentTime);
  };

  const updateIcon = () => {
    playIcon.className = audio.paused || audio.ended
      ? 'fa-solid fa-play'
      : 'fa-solid fa-pause';
  };

  playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });

  audio.addEventListener('play',           updateIcon);
  audio.addEventListener('pause',          updateIcon);
  audio.addEventListener('ended',          updateIcon);
  audio.addEventListener('timeupdate',     render);
  audio.addEventListener('loadedmetadata', () => {
    durEl.textContent = fmt(audio.duration);
    render();
  });

  progressEl.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressEl.getBoundingClientRect();
    const pos  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(1, pos)) * audio.duration;
  });

  restartBtn.addEventListener('click', () => { audio.currentTime = 0; });
  speedSelect.addEventListener('change', () => {
    audio.playbackRate = parseFloat(speedSelect.value);
  });

  render();
});
