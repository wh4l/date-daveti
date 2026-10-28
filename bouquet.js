(() => {
  'use strict';

  const overlay = document.getElementById('bouquet-overlay');
  const openButton = document.getElementById('bouquet-open');
  const closeButton = document.getElementById('bouquet-close');
  const replayButton = document.getElementById('bouquet-replay');
  const canvas = document.getElementById('bouquet-art');
  const context = canvas && canvas.getContext('2d');
  if (!overlay || !openButton || !closeButton || !replayButton || !context) return;

  const width = canvas.width;
  const height = canvas.height;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const inkCanvas = document.createElement('canvas');
  inkCanvas.width = width;
  inkCanvas.height = height;
  const ink = inkCanvas.getContext('2d');
  const source = new Image();
  source.decoding = 'async';
  source.src = 'bouquet-source.png';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let n = value;
      n = Math.imul(n ^ n >>> 15, n | 1);
      n ^= n + Math.imul(n ^ n >>> 7, n | 61);
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }

  const random = seededRandom(73194);
  const stars = Array.from({ length: 156 }, () => ({
    x: 9 + random() * (width - 18),
    y: 7 + random() * (height - 24),
    size: .35 + random() * .8,
    alpha: .12 + random() * .36
  }));
  const blooms = [
    { x: 245, y: 120, start: 1.45 },
    { x: 104, y: 142, start: 1.75 },
    { x: 359, y: 214, start: 2.05 },
    { x: 169, y: 266, start: 2.35 },
    { x: 292, y: 374, start: 2.65 },
    { x: 416, y: 350, start: 2.85 }
  ];
  let glyphs = [];
  let nextGlyph = 0;
  let frameId = 0;
  let startTime = 0;
  let previousFocus = null;
  let ready = false;
  let failed = false;

  function buildGlyphs() {
    const sample = document.createElement('canvas');
    sample.width = width;
    sample.height = height;
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    const scale = Math.min((width - 28) / source.naturalWidth, (height - 35) / source.naturalHeight);
    const drawWidth = source.naturalWidth * scale;
    const drawHeight = source.naturalHeight * scale;
    sampleContext.drawImage(source, (width - drawWidth) / 2, (height - drawHeight) / 2 - 3, drawWidth, drawHeight);
    const pixels = sampleContext.getImageData(0, 0, width, height).data;
    const result = [];
    const letters = ['.', ':', ';', '+', '*', '0', '1', '/', '{', '}', '#', '%', '@'];

    for (let y = 5; y < height - 8; y += 4.3) {
      for (let x = 9; x < width - 9; x += 3.8) {
        const index = (Math.floor(y) * width + Math.floor(x)) * 4;
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        if (alpha < 72 || (alpha < 170 && random() < .3)) continue;

        const stem = green > red * 1.18 && green > blue * 1.08;
        const nearest = blooms.reduce((best, bloom) => {
          const distance = Math.hypot(x - bloom.x, (y - bloom.y) * 1.08);
          return distance < best.distance ? { bloom, distance } : best;
        }, { bloom: blooms[0], distance: Infinity });
        const delay = stem
          ? y > 420
            ? .08 + (height - y) / 140 * 1.22 + random() * .14
            : 1.35 + (420 - y) * .003 + random() * .25
          : nearest.bloom.start + nearest.distance * .006 + random() * .32;
        const lift = stem ? 1.18 : 1.12;
        const r = Math.min(255, Math.round(red * lift + 9));
        const g = Math.min(255, Math.round(green * lift + 9));
        const b = Math.min(255, Math.round(blue * lift + 9));
        const brightness = (r + g + b) / 3;
        const letterIndex = Math.min(letters.length - 1, Math.max(0, Math.floor(brightness / 23) + Math.floor(random() * 4) - 1));
        result.push({
          x, y,
          char: letters[letterIndex],
          color: `rgb(${r}, ${g}, ${b})`,
          delay,
          size: stem ? 5.5 : 5.8
        });
      }
    }
    glyphs = result.sort((a, b) => a.delay - b.delay);
    ready = true;
    if (!overlay.hidden) play();
  }

  function background(seconds) {
    context.fillStyle = '#06070b';
    context.fillRect(0, 0, width, height);
    stars.forEach((star, index) => {
      context.globalAlpha = star.alpha * (.88 + .12 * Math.sin(seconds * 2.4 + index));
      context.fillStyle = '#fff9e9';
      context.fillRect(star.x, star.y, star.size, star.size);
    });
    context.globalAlpha = .28;
    context.font = '9px Consolas, monospace';
    context.fillStyle = '#75c595';
    context.fillText('const bloom = () => "for you";', 16, 548);
    context.globalAlpha = 1;
  }

  function drawGlyph(glyph) {
    ink.font = `${glyph.size}px Consolas, 'Courier New', monospace`;
    ink.textBaseline = 'middle';
    ink.fillStyle = glyph.color;
    ink.shadowColor = glyph.color;
    ink.shadowBlur = 5;
    ink.fillText(glyph.char, glyph.x, glyph.y);
  }

  function render(seconds) {
    while (nextGlyph < glyphs.length && glyphs[nextGlyph].delay <= seconds) {
      drawGlyph(glyphs[nextGlyph]);
      nextGlyph += 1;
    }
    ink.shadowBlur = 0;
    background(seconds);
    context.drawImage(inkCanvas, 0, 0);
  }

  function animate(now) {
    const seconds = (now - startTime) / 1000;
    render(seconds);
    if (nextGlyph < glyphs.length || seconds < 5.4) frameId = requestAnimationFrame(animate);
  }

  function play() {
    cancelAnimationFrame(frameId);
    ink.clearRect(0, 0, width, height);
    nextGlyph = 0;
    if (!ready) {
      background(0);
      if (failed) {
        context.fillStyle = '#f7e5cc';
        context.font = '15px Georgia, serif';
        context.textAlign = 'center';
        context.fillText('Buket yüklenemedi. Yeniden dene.', width / 2, height / 2);
        context.textAlign = 'start';
      }
      return;
    }
    if (reduceMotion.matches) {
      render(10);
      return;
    }
    startTime = performance.now();
    render(0);
    frameId = requestAnimationFrame(animate);
  }

  function open() {
    previousFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('bouquet-visible');
    closeButton.focus();
    play();
  }

  function close() {
    cancelAnimationFrame(frameId);
    overlay.hidden = true;
    document.body.classList.remove('bouquet-visible');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }

  source.addEventListener('load', buildGlyphs);
  source.addEventListener('error', () => { failed = true; if (!overlay.hidden) play(); });
  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  replayButton.addEventListener('click', play);
  document.getElementById('bouquet-backdrop').addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const target = event.shiftKey ? closeButton : replayButton;
      if (document.activeElement === target) {
        event.preventDefault();
        (event.shiftKey ? replayButton : closeButton).focus();
      }
    }
  });
})();
