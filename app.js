(() => {
  'use strict';

  const activities = Object.freeze({
    yemek: 'Yemek',
    kahve: 'Kahve',
    'gol-yuruyusu': 'Göl yürüyüşü',
    sinema: 'Sinema'
  });
  const steps = ['ask', 'activity', 'schedule', 'card'];
  const stepElements = Object.fromEntries(steps.map(key => [key, document.getElementById(`step-${key}`)]));
  const yesButton = document.getElementById('yes-button');
  const noButton = document.getElementById('no-button');
  const answerArena = document.getElementById('answer-arena');
  const form = document.getElementById('schedule-form');
  const dateInput = document.getElementById('date-input');
  const timeInput = document.getElementById('time-input');
  const nameInput = document.getElementById('guest-name');
  const errorBox = document.getElementById('form-error');
  const deliveryStatus = document.getElementById('delivery-status');
  const envelope = document.querySelector('.envelope-scene');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { activity: null, date: '', time: '', name: '', id: createId(), noMoves: 0 };

  function createId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `invite-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function localToday() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function showStep(key) {
    for (const step of steps) {
      const active = step === key;
      stepElements[step].hidden = !active;
      stepElements[step].classList.toggle('is-active', active);
    }
    if (key !== 'ask') resetNoButton();
    if (key === 'schedule') {
      dateInput.min = localToday();
      window.setTimeout(() => dateInput.focus({ preventScroll: true }), 100);
    }
    if (key === 'card') window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }

  function resetNoButton() {
    if (noButton.parentElement !== answerArena) answerArena.appendChild(noButton);
    noButton.classList.remove('is-escaping');
    noButton.style.left = '';
    noButton.style.top = '';
    noButton.style.transform = '';
    state.noMoves = 0;
  }

  function randomBetween(min, max) {
    return min + Math.random() * Math.max(0, max - min);
  }

  function intersects(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function moveNoButton(event) {
    if (event) event.preventDefault();
    if (stepElements.ask.hidden) return;

    if (!noButton.classList.contains('is-escaping')) {
      const initial = noButton.getBoundingClientRect();
      document.body.appendChild(noButton);
      noButton.classList.add('is-escaping');
      noButton.style.left = `${initial.left}px`;
      noButton.style.top = `${initial.top}px`;
    }

    state.noMoves += 1;
    const scale = Math.max(.54, 1 - state.noMoves * .09);
    const buttonWidth = noButton.offsetWidth * scale;
    const buttonHeight = noButton.offsetHeight * scale;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const minX = Math.max(18, viewWidth * .13);
    const maxX = Math.max(minX, Math.min(viewWidth * .77 - buttonWidth, viewWidth - 20 - buttonWidth));
    const minY = Math.max(30, viewHeight * .31);
    const maxY = Math.max(minY, Math.min(viewHeight * .74 - buttonHeight, viewHeight - 30 - buttonHeight));
    const yesRect = yesButton.getBoundingClientRect();
    const avoid = { left: yesRect.left - 38, right: yesRect.right + 38, top: yesRect.top - 38, bottom: yesRect.bottom + 38 };
    let point = { x: minX, y: minY };

    for (let attempt = 0; attempt < 35; attempt += 1) {
      point = { x: randomBetween(minX, maxX), y: randomBetween(minY, maxY) };
      const candidate = { left: point.x, right: point.x + buttonWidth, top: point.y, bottom: point.y + buttonHeight };
      if (!intersects(candidate, avoid)) break;
    }

    noButton.style.transform = `scale(${scale})`;
    noButton.style.left = `${Math.round(point.x)}px`;
    noButton.style.top = `${Math.round(point.y)}px`;
  }

  noButton.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') moveNoButton(event);
  });
  noButton.addEventListener('click', moveNoButton);
  noButton.addEventListener('touchstart', moveNoButton, { passive: false });

  yesButton.addEventListener('click', () => {
    showStep('activity');
    celebrate();
  });

  document.querySelectorAll('[data-activity]').forEach(button => {
    button.addEventListener('click', () => {
      state.activity = button.dataset.activity;
      showStep('schedule');
    });
  });
  document.getElementById('back-to-ask').addEventListener('click', () => showStep('ask'));
  document.getElementById('back-to-activity').addEventListener('click', () => showStep('activity'));
  document.getElementById('edit-button').addEventListener('click', () => showStep('schedule'));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    errorBox.hidden = true;
    const selectedDate = dateInput.value;
    const selectedTime = timeInput.value;
    const selected = new Date(`${selectedDate}T${selectedTime}:00`);
    if (!state.activity || !selectedDate || !selectedTime || Number.isNaN(selected.getTime())) {
      showError('Lütfen geçerli bir tarih ve saat seç.');
      return;
    }
    if (selected.getTime() < Date.now() - 60000) {
      showError('Buluşmamız için gelecekte bir tarih ve saat seçelim.');
      return;
    }

    state.date = selectedDate;
    state.time = selectedTime;
    state.name = nameInput.value.trim().slice(0, 40);
    fillCard();
    showStep('card');
    envelope.classList.remove('is-open');
    void envelope.offsetWidth;
    envelope.classList.add('is-open');
    await sendInvitation();
  });

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function formattedDate() {
    const date = new Date(`${state.date}T12:00:00`);
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).format(date);
  }

  function fillCard() {
    document.getElementById('card-greeting').textContent = state.name ? `${state.name}, seninle bir gün…` : 'Seninle bir gün…';
    document.getElementById('card-activity').textContent = activities[state.activity];
    document.getElementById('card-date').textContent = formattedDate();
    document.getElementById('card-time').textContent = state.time;
  }

  function setDelivery(message, kind = '') {
    deliveryStatus.textContent = message;
    deliveryStatus.className = `delivery-status ${kind}`.trim();
  }

  async function sendInvitation() {
    const endpoint = window.DATE_INVITE_CONFIG && window.DATE_INVITE_CONFIG.endpoint;
    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?.*)?$/.test(endpoint || '')) {
      setDelivery('Davetiyen hazır! Site sahibi kayıt bağlantısını henüz kurmadığı için seçimin iletilmedi.', 'error');
      return;
    }

    setDelivery('Seçimlerin iletiliyor…');
    const payload = new URLSearchParams({
      id: state.id,
      activity: state.activity,
      date: state.date,
      time: state.time,
      name: state.name,
      submittedAt: new Date().toISOString()
    });
    try {
      // Apps Script yanıtı başka bir adrese yönlendirdiği için tarayıcı yanıt içeriğini okuyamaz.
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: payload, keepalive: true });
      setDelivery('Gönderim isteği iletildi. Davetiyeni saklamak istersen planı kopyalayabilirsin.', 'success');
    } catch {
      setDelivery('Seçimlerin iletilemedi. Lütfen bağlantını kontrol edip tekrar dene veya planı kopyala.', 'error');
    }
  }

  document.getElementById('copy-button').addEventListener('click', async () => {
    const details = `Buluşma davetiyesi ♡\n${state.name ? `Ad: ${state.name}\n` : ''}Plan: ${activities[state.activity]}\nTarih: ${formattedDate()}\nSaat: ${state.time}`;
    try {
      await navigator.clipboard.writeText(details);
      document.getElementById('copy-button').textContent = 'Kopyalandı! ✓';
      window.setTimeout(() => { document.getElementById('copy-button').textContent = 'Planı kopyala'; }, 2200);
    } catch {
      setDelivery('Tarayıcı kopyalamaya izin vermedi; davetiyedeki bilgileri elle paylaşabilirsin.', 'error');
    }
  });

  function celebrate() {
    if (reduceMotion.matches) return;
    const canvas = document.getElementById('confetti');
    const context = canvas.getContext('2d');
    if (!context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const colors = ['#cc6372', '#efb7aa', '#f4d39a', '#ffffff', '#d88ba8'];
    const pieces = Array.from({ length: 155 }, (_, index) => ({
      x: window.innerWidth / 2 + randomBetween(-65, 65),
      y: window.innerHeight * .43 + randomBetween(-25, 25),
      vx: randomBetween(-6.2, 6.2),
      vy: randomBetween(-11, -3),
      rotation: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-.15, .15),
      width: randomBetween(4, 9),
      height: randomBetween(6, 13),
      color: colors[index % colors.length]
    }));
    let frame = 0;
    function draw() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const piece of pieces) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += .19;
        piece.vx *= .994;
        piece.rotation += piece.spin;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        context.restore();
      }
      frame += 1;
      if (frame < 155) requestAnimationFrame(draw);
      else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(draw);
  }

  dateInput.min = localToday();
})();
