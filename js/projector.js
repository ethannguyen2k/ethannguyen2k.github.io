// Channel IV — CRT screen controller.
//
// Drives the tube TV on playlist.html: tunes a channel into the
// screen (4 stacked layers handle base + R/C chromatic offset +
// tear-glitch slice), surfaces the now-tuning panel, and runs the
// "TUNE IN?" confirm modal that hands off to YouTube Music.

class TVScreen {
  constructor(root) {
    this.root      = root;
    this.layers    = root.querySelectorAll('.tv-art .layer');
    this.info      = root.querySelector('.tv-info');
    this.infoTitle = root.querySelector('#info-title');
    this.infoDesc  = root.querySelector('#info-desc');
    this.infoNo    = root.querySelector('#info-no');
    this.confirm   = root.querySelector('.tv-confirm');
    this.cfTitle   = root.querySelector('#cf-title');
    this.cfYes     = root.querySelector('#cf-yes');
    this.cfNo      = root.querySelector('#cf-no');
    this.led       = document.querySelector('.tv-led');

    this._currentHref = null;
  }

  tuneIn(card) {
    const url = card.dataset.bg;
    this.layers.forEach((l) => { l.style.backgroundImage = `url("${url}")`; });
    this.root.classList.add('lit');
    this.info.hidden = false;
    this.infoTitle.textContent = card.dataset.title;
    this.infoDesc.textContent  = card.dataset.desc;
    this.infoNo.textContent    = card.dataset.no;
    if (this.led) this.led.classList.add('lit');
  }

  standby() {
    this.root.classList.remove('lit');
    this.info.hidden = true;
    this.layers.forEach((l) => { l.style.backgroundImage = ''; });
    if (this.led) this.led.classList.remove('lit');
  }

  openConfirm(card) {
    this.cfTitle.textContent = card.dataset.title;
    this._currentHref = card.dataset.href || null;
    this.confirm.hidden = false;
    this.cfYes.focus({ preventScroll: true });
  }

  closeConfirm() {
    this.confirm.hidden = true;
    this._currentHref = null;
  }

  isConfirmOpen() { return !this.confirm.hidden; }
  href()          { return this._currentHref; }
}
