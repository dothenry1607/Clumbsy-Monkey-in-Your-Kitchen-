const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const monkeyImage = new Image();
monkeyImage.src = 'monkey.gif';

const bananaImage = new Image();
bananaImage.src = 'banana.gif';

const peeledBananaImage = new Image();
peeledBananaImage.src = 'peeled_bana.gif';

const eggImage = new Image();
eggImage.src = 'egg.png';

const eggCrack1Image = new Image();
eggCrack1Image.src = 'egg_crack_1.png';

const eggCrack2Image = new Image();
eggCrack2Image.src = 'egg_crack_2.png';

const eggCrackFinalImage = new Image();
eggCrackFinalImage.src = 'egg_crack.png';

const kitchenBackground = new Image();
kitchenBackground.src = 'kitchen.jpg';

const gameSong = new Audio('gamesong.mp3');
const monkeySound = new Audio('monkeysound.mp3');
const eggCrackSound = new Audio('egg_crack.mp3');
const uiClickSound = new Audio('monkeysound.mp3');
const stageCompleteSound = new Audio('yaysound.mp3');
const peelPingSound = new Audio('ping.mp3');
gameSong.loop = true;
gameSong.volume = 0.35;
monkeySound.volume = 0.6;
eggCrackSound.volume = 0.8;
uiClickSound.volume = 0.4;
stageCompleteSound.volume = 0.8;
peelPingSound.volume = 0.7;

const W = canvas.width;
const H = canvas.height;
const centerX = W / 2;

const state = {
  screen: 'title',
  playButton: {
    x: centerX - 180,
    y: 520,
    width: 360,
    height: 150,
  },
  banana: {
    x: centerX - 360,
    y: 80,
    width: 720,
    height: 620,
    gripX: centerX,
    gripY: 150,
    gripRadius: 80,
    dragStartY: 0,
    peelProgress: 0,
    peelHoldTimer: 0,
    peelHoldDuration: 700,
    peelPasses: 0,
    peelPassesNeeded: 3,
    dragging: false,
    peeled: false,
    finishedPeel: false,
  },
  nextButton: {
    x: W - 260,
    y: 700,
    width: 180,
    height: 70,
  },
  egg: {
    x: centerX - 170,
    y: 180,
    width: 340,
    height: 420,
    crackLevel: 0,
    cracked: false,
  },
};

function roundedRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function drawMonkeySide(x, y, flip = 1) {
  if (!monkeyImage.complete) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);
  ctx.drawImage(monkeyImage, 0, 0, 320, 270);
  ctx.restore();
}

function drawTitleBanner() {
  const x = centerX - 390;
  const y = 80;
  const width = 780;
  const height = 320;

  roundedRectPath(x, y, width, height, 28);
  ctx.fillStyle = '#1eea45';
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#ff3b30';
  ctx.stroke();

  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 42px "Comic Sans MS", cursive';
  ctx.fillText('CLUMSY', centerX, 150);
  ctx.fillText('MONKEY', centerX, 210);

  ctx.font = 'bold 26px "Comic Sans MS", cursive';
  ctx.fillText('IN', centerX, 270);

  ctx.font = 'bold 42px "Comic Sans MS", cursive';
  ctx.fillText('YOUR', centerX, 320);
  ctx.fillText('KITCHEN', centerX, 375);
}

function drawPlayButton() {
  const { x, y, width, height } = state.playButton;

  roundedRectPath(x, y, width, height, 28);
  ctx.fillStyle = '#1eea45';
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#2b2bf0';
  ctx.stroke();

  ctx.fillStyle = '#111111';
  ctx.font = 'bold 30px "Comic Sans MS", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PLAY', centerX, y + height / 2);
}

function isInsidePlayButton(x, y) {
  const button = state.playButton;
  return x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height;
}

function isInsideNextButton(x, y) {
  const button = state.nextButton;
  return x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height;
}

function drawGreenGuideCircle(x, y, radius, alpha = 0.2) {
  ctx.beginPath();
  ctx.fillStyle = `rgba(40, 214, 90, ${alpha})`;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = '#2adf5d';
  ctx.lineWidth = 5;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function isInsideEgg(x, y) {
  const egg = state.egg;
  return x >= egg.x && x <= egg.x + egg.width && y >= egg.y && y <= egg.y + egg.height;
}

function drawEgg() {
  const egg = state.egg;
  let image = eggImage;

  if (egg.crackLevel === 1) image = eggCrack1Image;
  else if (egg.crackLevel === 2) image = eggCrack2Image;
  else if (egg.crackLevel >= 3) image = eggCrackFinalImage;

  if (image.complete) {
    ctx.drawImage(image, egg.x, egg.y, egg.width, egg.height);
  }
}

function drawEggStage() {
  const egg = state.egg;
  const pulse = (Math.sin(Date.now() * 0.008) + 1) / 2;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 34px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.fillStyle = '#0d7a2c';
  const message = egg.cracked ? 'EGG CRACKED!' : 'CLICK THE EGG';
  ctx.strokeText(message, centerX, 90);
  ctx.fillText(message, centerX, 90);
  ctx.restore();

  drawEgg();

  if (!egg.cracked) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 210, 80, ${0.15 + pulse * 0.25})`;
    ctx.arc(egg.x + egg.width / 2, egg.y + egg.height / 2, 190, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (egg.cracked) {
    const button = state.nextButton;
    roundedRectPath(button.x, button.y, button.width, button.height, 20);
    ctx.fillStyle = '#1eea45';
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2b2bf0';
    ctx.stroke();

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 26px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEXT', button.x + button.width / 2, button.y + button.height / 2);
  }
}

function drawBanana() {
  const banana = state.banana;
  const currentMirror = banana.peelPasses % 2 === 0 ? 1 : -1;
  const showPeeled = banana.finishedPeel || banana.peelHoldTimer > 0;

  ctx.save();
  ctx.translate(banana.x + banana.width / 2, 0);
  ctx.scale(currentMirror, 1);
  ctx.translate(-(banana.x + banana.width / 2), 0);

  if (showPeeled) {
    ctx.drawImage(peeledBananaImage, banana.x, banana.y, banana.width, banana.height);
  } else {
    ctx.drawImage(bananaImage, banana.x, banana.y, banana.width, banana.height);
  }

  ctx.restore();
}

function drawStageOne() {
  const banana = state.banana;
  const pulse = (Math.sin(Date.now() * 0.006) + 1) / 2;
  const ringAlpha = 0.12 + pulse * 0.7;

  if (!banana.finishedPeel) {
    const remaining = banana.peelPassesNeeded - banana.peelPasses;
    const message = remaining === banana.peelPassesNeeded ? 'HOLD TOP AND DRAG DOWN' : `PEEL ${remaining} MORE`;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 34px "Arial Black", Impact, sans-serif';
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.fillStyle = '#0d7a2c';
    ctx.strokeText(message, centerX, 110);
    ctx.fillText(message, centerX, 110);
    ctx.restore();
  }

  drawBanana();

  if (!banana.finishedPeel) {
    ctx.save();
    ctx.setLineDash([14, 12]);
    ctx.lineDashOffset = -Date.now() * 0.03;
    ctx.strokeStyle = `rgba(42, 223, 93, ${0.45 + pulse * 0.55})`;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(centerX, banana.gripY + banana.gripRadius + 16);
    ctx.lineTo(centerX, banana.y + banana.height - 26);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `rgba(40, 214, 90, ${0.10 + pulse * 0.18})`;
    ctx.arc(banana.gripX, banana.gripY, banana.gripRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = `rgba(42, 223, 93, ${ringAlpha})`;
    ctx.lineWidth = 6;
    ctx.arc(banana.gripX, banana.gripY, banana.gripRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (banana.finishedPeel) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 34px "Arial Black", Impact, sans-serif';
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.fillStyle = '#0d7a2c';
    ctx.strokeText('PEEL COMPLETE!', centerX, 710);
    ctx.fillText('PEEL COMPLETE!', centerX, 710);
    ctx.restore();

    const button = state.nextButton;
    roundedRectPath(button.x, button.y, button.width, button.height, 20);
    ctx.fillStyle = '#1eea45';
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2b2bf0';
    ctx.stroke();

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 26px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEXT', button.x + button.width / 2, button.y + button.height / 2);
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, W, H);

  if (kitchenBackground.complete) {
    ctx.drawImage(kitchenBackground, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#efefef';
    ctx.fillRect(0, 0, W, H);
  }

  if (state.screen === 'title') {
    drawMonkeySide(110, 500, 1);
    drawMonkeySide(W - 110, 500, -1);
  }
}

function drawHUD() {
  drawBackground();

  if (state.screen === 'title') {
    drawTitleBanner();
    drawPlayButton();
    return;
  }

  if (state.screen === 'eggStage') {
    drawEggStage();
    return;
  }

  drawStageOne();
}

function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function playMonkeySound() {
  monkeySound.currentTime = 0;
  monkeySound.play().catch(() => {});
}

function playPeelPingSound() {
  peelPingSound.currentTime = 0;
  peelPingSound.play().catch(() => {});
}

function playUIClickSound() {
  uiClickSound.currentTime = 0;
  uiClickSound.play().catch(() => {});
}

function playStageCompleteSound() {
  stageCompleteSound.currentTime = 0;
  stageCompleteSound.play().catch(() => {});
}

function startGameSong() {
  if (gameSong.paused) {
    gameSong.play().catch(() => {});
  }
}

function startPeelStage() {
  state.screen = 'peelStage';
  state.banana.dragging = false;
  state.banana.peelProgress = 0;
  state.banana.peelHoldTimer = 0;
  state.banana.peelPasses = 0;
  state.banana.peeled = false;
  state.banana.finishedPeel = false;
  startGameSong();
}

function startEggStage() {
  state.screen = 'eggStage';
  state.egg.crackLevel = 0;
  state.egg.cracked = false;
}

canvas.addEventListener('pointerdown', (event) => {
  const pointer = getPointerPosition(event);

  if (state.screen === 'title') {
    if (isInsidePlayButton(pointer.x, pointer.y)) {
      playUIClickSound();
      playMonkeySound();
      startPeelStage();
    }
    return;
  }

  if (state.screen === 'eggStage') {
    if (state.egg.cracked && isInsideNextButton(pointer.x, pointer.y)) {
      playUIClickSound();
      state.screen = 'next';
      return;
    }

    if (isInsideEgg(pointer.x, pointer.y) && !state.egg.cracked) {
      state.egg.crackLevel += 1;
      if (state.egg.crackLevel >= 3) {
        state.egg.cracked = true;
        eggCrackSound.currentTime = 0;
        eggCrackSound.play().catch(() => {});
        playStageCompleteSound();
      }
    }
    return;
  }

  if (state.banana.finishedPeel && isInsideNextButton(pointer.x, pointer.y)) {
    playUIClickSound();
    startEggStage();
    return;
  }

  const banana = state.banana;
  if (banana.peelHoldTimer > 0 || banana.finishedPeel) return;

  const dx = pointer.x - banana.gripX;
  const dy = pointer.y - banana.gripY;
  const distance = Math.hypot(dx, dy);

  if (distance <= banana.gripRadius + 10) {
    banana.dragging = true;
    banana.dragStartY = pointer.y;
  }
});

canvas.addEventListener('pointermove', (event) => {
  if (state.screen !== 'peelStage' || !state.banana.dragging) return;
  if (state.banana.peelHoldTimer > 0 || state.banana.finishedPeel) return;

  const pointer = getPointerPosition(event);
  const deltaY = pointer.y - state.banana.dragStartY;

  if (deltaY > 0) {
    state.banana.peelProgress = clamp(deltaY / 240, 0, 1);
  }

  if (state.banana.peelProgress >= 1) {
    state.banana.peelPasses += 1;
    state.banana.peelProgress = 0;
    state.banana.dragging = false;
    state.banana.peelHoldTimer = state.banana.peelHoldDuration;
    state.banana.peeled = true;
    playMonkeySound();
    playPeelPingSound();

    if (state.banana.peelPasses >= state.banana.peelPassesNeeded) {
      state.banana.finishedPeel = true;
      playStageCompleteSound();
    }
  }
});

window.addEventListener('pointerup', () => {
  if (state.screen !== 'peelStage') return;

  if (state.banana.peelHoldTimer > 0) {
    state.banana.dragging = false;
    return;
  }

  if (!state.banana.finishedPeel) {
    state.banana.peelProgress = 0;
  }

  state.banana.dragging = false;
});

monkeyImage.onload = drawHUD;
bananaImage.onload = drawHUD;
peeledBananaImage.onload = drawHUD;
eggImage.onload = drawHUD;
eggCrack1Image.onload = drawHUD;
eggCrack2Image.onload = drawHUD;
eggCrackFinalImage.onload = drawHUD;
kitchenBackground.onload = drawHUD;
drawHUD();

function gameLoop() {
  const banana = state.banana;

  if (state.screen === 'peelStage' && banana.peelHoldTimer > 0) {
    banana.peelHoldTimer = Math.max(0, banana.peelHoldTimer - 16.7);

    if (banana.peelHoldTimer === 0) {
      banana.peeled = banana.finishedPeel;
    }
  }

  drawHUD();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
