// Channel IV — broadcast wiring.
//
// Hover a rack card → card highlights (LED only, TV stays in standby).
// Click → TV tunes in (art + info panel) and the "TUNE IN?" modal
// asks before opening YouTube Music. Clicking a different channel
// while a channel is tuned switches with a CRT blackout cut.
//
// Y/Enter → opens YouTube Music, closes modal. Channel stays tuned.
// N       → closes modal. Channel stays tuned.
// Esc     → turns the TV off. Returns to the original standby screen.

const SWITCH_MS = 900;

document.addEventListener('DOMContentLoaded', () => {
  const screenEl = document.getElementById('tv-screen');
  const cards    = document.querySelectorAll('.ch-card');
  if (!screenEl || cards.length === 0) return;

  const tv = new TVScreen(screenEl);

  // Power-on flash on load.
  screenEl.classList.add('power-on');
  setTimeout(() => screenEl.classList.remove('power-on'), 900);

  let switching   = false;
  let switchTimer = null;

  const clearActive = () => {
    cards.forEach((c) => c.classList.remove('active'));
  };
  const setActive = (card) => {
    cards.forEach((c) => c.classList.toggle('active', c === card));
  };

  // Hard power-off — only Esc gets here. Cancels in-flight switches,
  // closes the modal, drops the channel art, and resets every
  // state-bearing class. Returns the screen to its initial standby.
  const forceStandby = () => {
    if (switchTimer) { clearTimeout(switchTimer); switchTimer = null; }
    switching = false;
    tv.closeConfirm();
    tv.standby();
    screenEl.classList.remove('lit', 'switching', 'power-on');
    clearActive();
  };

  // Tune-in routing. Standby→channel is instant; channel→channel
  // takes a CRT blackout cut. Re-clicking the active channel just
  // re-opens its modal (no blackout).
  const tuneTo = (card) => {
    if (switching) return;

    const isActive = card.classList.contains('active');
    if (isActive && tv.isConfirmOpen()) return;
    if (isActive && !tv.isConfirmOpen()) {
      tv.openConfirm(card);
      return;
    }

    const wasLit = screenEl.classList.contains('lit');
    if (wasLit) {
      switching = true;
      screenEl.classList.add('switching');
      switchTimer = setTimeout(() => {
        tv.tuneIn(card);
        tv.openConfirm(card);
        setActive(card);
        screenEl.classList.remove('switching');
        switching = false;
        switchTimer = null;
      }, SWITCH_MS);
    } else {
      tv.tuneIn(card);
      tv.openConfirm(card);
      setActive(card);
    }
  };

  // Y: open the link, close the modal. Channel stays tuned.
  const handleConfirm = () => {
    const href = tv.href();
    if (href) window.open(href, '_blank', 'noopener');
    tv.closeConfirm();
  };

  // N: close the modal. Channel stays tuned.
  const handleCancel = () => {
    tv.closeConfirm();
  };

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      tuneTo(card);
    });
  });

  tv.cfYes.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleConfirm();
  });
  tv.cfNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel();
  });

  document.addEventListener('keydown', (e) => {
    // Esc is the only "turn off the TV" path — works at any time.
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      forceStandby();
      return;
    }
    if (!tv.isConfirmOpen()) return;
    const k = e.key;
    if (k === 'y' || k === 'Y') {
      e.preventDefault();
      handleConfirm();
    } else if (k === 'n' || k === 'N') {
      e.preventDefault();
      handleCancel();
    } else if (k === 'Enter') {
      if (document.activeElement !== tv.cfYes &&
          document.activeElement !== tv.cfNo) {
        e.preventDefault();
        handleConfirm();
      }
    } else if (k === 'Tab') {
      // Trap focus between Y/N while the modal is open.
      e.preventDefault();
      const next = document.activeElement === tv.cfYes ? tv.cfNo : tv.cfYes;
      next.focus({ preventScroll: true });
    }
  });

  // Free-running wall clock — current local time in the tv-info panel.
  // Never resets on tune events.
  const timeEl = document.getElementById('info-time');
  if (timeEl) {
    const pad = (n) => String(n).padStart(2, '0');
    const update = () => {
      const d = new Date();
      timeEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    update();
    setInterval(update, 1000);
  }
});
