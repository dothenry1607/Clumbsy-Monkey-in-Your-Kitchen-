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

const emptyBowlImage = new Image();
emptyBowlImage.src = 'empty_bowl.png';

const filledBowlImage = new Image();
filledBowlImage.src = 'bowl.png';

const bowlTopDownImage = new Image();
bowlTopDownImage.src = 'bowl_topdown.png';

const panEmptyImage = new Image();
panEmptyImage.src = 'pan_empty.png';

const panPancakeImage = new Image();
panPancakeImage.src = 'pan_pancake.png';

const panPancakeBurntImage = new Image();
panPancakeBurntImage.src = 'pan_pancake_burnt.png';

const panPancakeCookedImage = new Image();
panPancakeCookedImage.src = 'pan_pancake_cooked.png';

const fireImage = new Image();
fireImage.src = 'fire.png';

const whiskImage = new Image();
whiskImage.src = 'whisk.png';

const kitchenBackground = new Image();
kitchenBackground.src = 'kitchen.jpg';

const monkeyParty1Image = new Image();
monkeyParty1Image.src = 'monkey_party1.png';

const monkeyParty2Image = new Image();
monkeyParty2Image.src = 'monkey_party2.png';

const pancakesImage = new Image();
pancakesImage.src = 'pancakes.png';

const gameSong = new Audio('gamesong.mp3');
const monkeySound = new Audio('monkeysound.mp3');
const eggCrackSound = new Audio('egg_crack.mp3');
const uiClickSound = new Audio('monkeysound.mp3');
const stageCompleteSound = new Audio('yaysound.mp3');
const peelPingSound = new Audio('ping.mp3');
const sizzlingSound = new Audio('sizzling.mp3');
gameSong.loop = true;
gameSong.volume = 0.35;
monkeySound.volume = 0.6;
eggCrackSound.volume = 0.8;
uiClickSound.volume = 0.4;
stageCompleteSound.volume = 0.8;
peelPingSound.volume = 0.7;
sizzlingSound.loop = true;
sizzlingSound.volume = 0.8;

const W = canvas.width;
const H = canvas.height;
const centerX = W / 2;
canvas.style.touchAction = 'none';

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
  bowlStage: {
    egg: {
      x: 260,
      y: 220,
      width: 220,
      height: 220,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    },
    bowl: {
      x: centerX - 180,
      y: 430,
      width: 360,
      height: 240,
    },
    decorativeEgg: {
      x: centerX + 220,
      y: 170,
      width: 220,
      height: 220,
    },
    complete: false,
  },
  whiskStage: {
    bowl: {
      x: centerX - 220,
      y: 180,
      width: 440,
      height: 300,
    },
    whisk: {
      x: 120,
      y: 300,
      width: 200,
      height: 180,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      lastX: 0,
      lastY: 0,
      lastAngle: 0,
    },
    progress: 0,
    requiredProgress: 1500,
    complete: false,
  },
  bananaStage: {
    bowl: {
      x: centerX - 180,
      y: 420,
      width: 360,
      height: 220,
    },
    bananas: [],
    complete: false,
    total: 3,
  },
  panStage: {
    bowl: {
      x: 120,
      y: 180,
      width: 290,
      height: 200,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      startX: 120,
      startY: 180,
    },
    pan: {
      x: centerX - 285,
      y: 410,
      width: 570,
      height: 270,
    },
    complete: false,
  },
  fryStage: {
    pan: {
      x: centerX - 300,
      y: 250,
      width: 600,
      height: 320,
    },
    progress: 0,
    duration: 10,
    spawnAccumulator: 0,
    showFireEvery: 0.5,
    fires: [],
    missCount: 0,
    totalSpawns: 20,
    complete: false,
    failed: false,
    soundsStarted: false,
    nextSpawnId: 0,
  },
  endingState: {
    soundsPlayed: false,
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

function isInsideRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
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

function drawBowlStage() {
  const bowlStage = state.bowlStage;
  const bowl = bowlStage.bowl;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 34px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.fillStyle = '#0d7a2c';
  const message = bowlStage.complete ? 'BOWL READY!' : 'HOLD THE EGG AND DROP IT IN';
  ctx.strokeText(message, centerX, 90);
  ctx.fillText(message, centerX, 90);
  ctx.restore();

  if (emptyBowlImage.complete && !bowlStage.complete) {
    ctx.drawImage(emptyBowlImage, bowl.x, bowl.y, bowl.width, bowl.height);
  } else if (filledBowlImage.complete) {
    ctx.drawImage(filledBowlImage, bowl.x, bowl.y, bowl.width, bowl.height);
  }

  if (eggCrackFinalImage.complete && !bowlStage.complete) {
    ctx.drawImage(eggCrackFinalImage, bowlStage.egg.x, bowlStage.egg.y, bowlStage.egg.width, bowlStage.egg.height);
  }

  if (bowlStage.complete) {
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

function drawWhiskStage() {
  const whiskStage = state.whiskStage;
  const bowl = whiskStage.bowl;
  const whisk = whiskStage.whisk;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 32px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.fillStyle = '#0d7a2c';
  const message = whiskStage.complete ? 'WHISK COMPLETE!' : 'WHISK FOR 3 SECONDS';
  ctx.strokeText(message, centerX, 90);
  ctx.fillText(message, centerX, 90);
  ctx.restore();

  if (bowlTopDownImage.complete) {
    ctx.drawImage(bowlTopDownImage, bowl.x, bowl.y, bowl.width, bowl.height);
  }

  if (whiskImage.complete && !whiskStage.complete) {
    ctx.save();
    ctx.translate(whisk.x + whisk.width / 2, whisk.y + whisk.height / 2);
    ctx.rotate(Math.PI / 6);
    ctx.drawImage(whiskImage, -whisk.width / 2, -whisk.height / 2, whisk.width, whisk.height);
    ctx.restore();
  }

  const barX = 140;
  const barY = 760;
  const barWidth = 1120;
  const barHeight = 28;
  const fillWidth = (whiskStage.progress / whiskStage.requiredProgress) * barWidth;

  ctx.fillStyle = '#ffffff';
  roundedRectPath(barX, barY, barWidth, barHeight, 14);
  ctx.fill();

  ctx.fillStyle = '#2adf5d';
  roundedRectPath(barX, barY, fillWidth, barHeight, 14);
  ctx.fill();

  if (whiskStage.complete) {
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

function getBananaSpawnPoints() {
  const bowl = state.bananaStage.bowl;
  const bowlCenterX = bowl.x + bowl.width / 2;
  const bowlCenterY = bowl.y + bowl.height / 2;
  const bananaWidth = 180;
  const bananaHeight = 110;

  return [
    { x: 140, y: 120 },
    { x: W - 140 - bananaWidth, y: 120 },
    { x: bowlCenterX - bananaWidth / 2, y: 170 },
  ];
}

function startBananaStage() {
  state.screen = 'bananaStage';
  state.bananaStage.complete = false;
  state.bananaStage.bananas = getBananaSpawnPoints().map((spawn, index) => ({
    id: index,
    x: spawn.x,
    y: spawn.y,
    width: 180,
    height: 110,
    startX: spawn.x,
    startY: spawn.y,
    dragging: false,
    offsetX: 0,
    offsetY: 0,
    placed: false,
  }));
}

function drawBananaStage() {
  const bananaStage = state.bananaStage;
  const bowl = bananaStage.bowl;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 34px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.fillStyle = '#0d7a2c';
  const message = bananaStage.complete ? 'BANANAS IN! ' : `DROP ALL 3 BANANAS`;
  ctx.strokeText(message, centerX, 90);
  ctx.fillText(message, centerX, 90);
  ctx.restore();

  if (bowlTopDownImage.complete) {
    ctx.drawImage(bowlTopDownImage, bowl.x, bowl.y, bowl.width, bowl.height);
  }

  for (const banana of bananaStage.bananas) {
    if (banana.placed) continue;
    if (peeledBananaImage.complete) {
      ctx.drawImage(peeledBananaImage, banana.x, banana.y, banana.width, banana.height);
    }
  }

  if (bananaStage.complete) {
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

function startPanStage() {
  state.screen = 'panStage';
  state.panStage.complete = false;
  state.panStage.bowl.x = 120;
  state.panStage.bowl.y = 180;
  state.panStage.bowl.dragging = false;
}

function startFryStage() {
  state.screen = 'fryStage';
  state.fryStage.progress = 0;
  state.fryStage.spawnAccumulator = 0;
  state.fryStage.fires = [];
  state.fryStage.missCount = 0;
  state.fryStage.complete = false;
  state.fryStage.failed = false;
  state.fryStage.soundsStarted = false;
  state.fryStage.nextSpawnId = 0;
  if (sizzlingSound) {
    sizzlingSound.pause();
    sizzlingSound.currentTime = 0;
  }
}

function spawnFire() {
  const fryStage = state.fryStage;
  if (fryStage.fires.length >= fryStage.totalSpawns) return;

  const pan = fryStage.pan;
  const margin = 70;
  const fireWidth = 36 + Math.random() * 22;
  const fireHeight = fireWidth * 1.15;
  const x = pan.x + margin + Math.random() * (pan.width - margin * 2 - fireWidth);
  const y = pan.y + 30 + Math.random() * (pan.height * 0.56 - fireHeight);

  fryStage.fires.push({
    id: ++fryStage.nextSpawnId,
    x,
    y,
    width: fireWidth,
    height: fireHeight,
    bornAt: performance.now(),
    ttl: 1000,
    sizePulse: Math.random() * 0.8 + 0.5,
    caught: false,
  });
}

function drawPanStage() {
  const panStage = state.panStage;
  const pan = panStage.pan;
  const bowl = panStage.bowl;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 34px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.fillStyle = '#0d7a2c';
  const message = panStage.complete ? 'PANCAKE READY!' : 'DRAG THE BOWL INTO THE PAN';
  ctx.strokeText(message, centerX, 90);
  ctx.fillText(message, centerX, 90);
  ctx.restore();

  if (panEmptyImage.complete && !panStage.complete) {
    ctx.drawImage(panEmptyImage, pan.x, pan.y, pan.width, pan.height);
  }

  if (panPancakeImage.complete && panStage.complete) {
    ctx.drawImage(panPancakeImage, pan.x, pan.y, pan.width, pan.height);
  }

  if (!panStage.complete && filledBowlImage.complete) {
    ctx.drawImage(filledBowlImage, bowl.x, bowl.y, bowl.width, bowl.height);
  }

  if (panStage.complete) {
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

function drawFryStage() {
  const fryStage = state.fryStage;
  const pan = fryStage.pan;
  const barX = 120;
  const barY = 740;
  const barWidth = 1040;
  const barHeight = 26;
  const fillWidth = (fryStage.progress / fryStage.duration) * barWidth;

  if (panPancakeImage.complete) {
    ctx.drawImage(panPancakeImage, pan.x, pan.y, pan.width, pan.height);
  }

  for (const fire of fryStage.fires) {
    const age = performance.now() - fire.bornAt;
    const life = clamp(age / fire.ttl, 0, 1);
    const size = 0.5 + life * 1.4 + fire.sizePulse * 0.2;
    const alpha = 1 - life;
    if (alpha <= 0) continue;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(fire.x + fire.width / 2, fire.y + fire.height / 2);
    ctx.scale(size, size);
    ctx.drawImage(fireImage, -fire.width / 2, -fire.height / 2, fire.width, fire.height);
    ctx.restore();
  }

  ctx.fillStyle = '#ffffff';
  roundedRectPath(barX, barY, barWidth, barHeight, 14);
  ctx.fill();

  ctx.fillStyle = '#2adf5d';
  roundedRectPath(barX, barY, fillWidth, barHeight, 14);
  ctx.fill();

  if (fryStage.failed) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    if (panPancakeBurntImage.complete) {
      ctx.drawImage(panPancakeBurntImage, pan.x, pan.y, pan.width, pan.height);
    }

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff2a2a';
    ctx.font = 'bold 62px "Arial Black", Impact, sans-serif';
    ctx.fillText('YOU FAILED', centerX, 220);
    ctx.restore();

    const button = state.nextButton;
    const retryX = centerX - 150;
    const retryY = 620;
    roundedRectPath(retryX, retryY, 300, 90, 24);
    ctx.fillStyle = '#1eea45';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2b2bf0';
    ctx.stroke();
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 28px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TRY AGAIN', centerX, retryY + 45);
    return;
  }

  if (fryStage.complete && !fryStage.failed) {
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

  if (state.screen === 'bowlStage') {
    drawBowlStage();
    return;
  }

  if (state.screen === 'whiskStage') {
    drawWhiskStage();
    return;
  }

  if (state.screen === 'bananaStage') {
    drawBananaStage();
    return;
  }

  if (state.screen === 'panStage') {
    drawPanStage();
    return;
  }

  if (state.screen === 'fryStage') {
    drawFryStage();
    return;
  }

  if (state.screen === 'endingStage') {
    drawEndingStage();
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

function startBowlStage() {
  state.screen = 'bowlStage';
  state.bowlStage.complete = false;
  state.bowlStage.egg.x = 260;
  state.bowlStage.egg.y = 220;
  state.bowlStage.egg.dragging = false;
}

function startWhiskStage() {
  state.screen = 'whiskStage';
  state.whiskStage.progress = 0;
  state.whiskStage.complete = false;
  state.whiskStage.whisk.x = 120;
  state.whiskStage.whisk.y = 300;
  state.whiskStage.whisk.dragging = false;
  state.whiskStage.whisk.lastX = state.whiskStage.whisk.x;
  state.whiskStage.whisk.lastY = state.whiskStage.whisk.y;
  state.whiskStage.whisk.lastAngle = 0;
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
      startBowlStage();
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

  if (state.screen === 'bowlStage') {
    if (state.bowlStage.complete && isInsideNextButton(pointer.x, pointer.y)) {
      playUIClickSound();
      startWhiskStage();
      return;
    }

    const egg = state.bowlStage.egg;
    if (isInsideRect(pointer.x, pointer.y, egg)) {
      egg.dragging = true;
      egg.offsetX = pointer.x - egg.x;
      egg.offsetY = pointer.y - egg.y;
      if (event.pointerId !== undefined && canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    }
    return;
  }

  if (state.screen === 'whiskStage') {
    if (state.whiskStage.complete && isInsideNextButton(pointer.x, pointer.y)) {
      playUIClickSound();
      startBananaStage();
      return;
    }

    const whisk = state.whiskStage.whisk;
    if (isInsideRect(pointer.x, pointer.y, whisk)) {
      whisk.dragging = true;
      whisk.offsetX = pointer.x - whisk.x;
      whisk.offsetY = pointer.y - whisk.y;
      whisk.lastX = pointer.x;
      whisk.lastY = pointer.y;
      const bowl = state.whiskStage.bowl;
      const bowlCenterX = bowl.x + bowl.width / 2;
      const bowlCenterY = bowl.y + bowl.height / 2;
      whisk.lastAngle = Math.atan2(pointer.y - bowlCenterY, pointer.x - bowlCenterX);
      if (event.pointerId !== undefined && canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    }
    return;
  }

  if (state.screen === 'bananaStage') {
    if (state.bananaStage.complete && isInsideNextButton(pointer.x, pointer.y)) {
      playUIClickSound();
      startPanStage();
      return;
    }

    const activeBanana = state.bananaStage.bananas.find((banana) => !banana.placed);
    if (!activeBanana) return;

    if (isInsideRect(pointer.x, pointer.y, activeBanana)) {
      activeBanana.dragging = true;
      activeBanana.offsetX = pointer.x - activeBanana.x;
      activeBanana.offsetY = pointer.y - activeBanana.y;
      if (event.pointerId !== undefined && canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    }
    return;
  }

  if (state.screen === 'panStage') {
    if (state.panStage.complete && isInsideNextButton(pointer.x, pointer.y)) {
      playUIClickSound();
      startFryStage();
      return;
    }

    const bowl = state.panStage.bowl;
    if (isInsideRect(pointer.x, pointer.y, bowl)) {
      bowl.dragging = true;
      bowl.offsetX = pointer.x - bowl.x;
      bowl.offsetY = pointer.y - bowl.y;
      if (event.pointerId !== undefined && canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    }
    return;
  }

  if (state.screen === 'fryStage') {
    if (state.fryStage.failed) {
      const retryX = centerX - 150;
      const retryY = 620;
      const retryButton = { x: retryX, y: retryY, width: 300, height: 90 };
      if (pointer.x >= retryButton.x && pointer.x <= retryButton.x + retryButton.width && pointer.y >= retryButton.y && pointer.y <= retryButton.y + retryButton.height) {
        playUIClickSound();
        startPeelStage();
      }
      return;
    }

    if (state.fryStage.complete && isInsideNextButton(pointer.x, pointer.y)) {
      playUIClickSound();
      state.screen = 'endingStage';
      state.endingState.soundsPlayed = false;
      return;
    }

    const fires = [...state.fryStage.fires];
    for (let i = fires.length - 1; i >= 0; i -= 1) {
      const fire = fires[i];
      if (pointer.x >= fire.x && pointer.x <= fire.x + fire.width && pointer.y >= fire.y && pointer.y <= fire.y + fire.height) {
        playPeelPingSound();
        state.fryStage.fires = state.fryStage.fires.filter((item) => item.id !== fire.id);
        return;
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
  const pointer = getPointerPosition(event);

  if (state.screen === 'peelStage') {
    if (!state.banana.dragging) return;
    if (state.banana.peelHoldTimer > 0 || state.banana.finishedPeel) return;

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
    return;
  }

  if (state.screen === 'bowlStage') {
    const egg = state.bowlStage.egg;
    if (!egg.dragging) return;

    egg.x = clamp(pointer.x - egg.offsetX, 40, W - egg.width - 40);
    egg.y = clamp(pointer.y - egg.offsetY, 60, H - egg.height - 40);
    return;
  }

  if (state.screen === 'whiskStage') {
    const whisk = state.whiskStage.whisk;
    if (!whisk.dragging) return;

    whisk.x = clamp(pointer.x - whisk.offsetX, 20, W - whisk.width - 20);
    whisk.y = clamp(pointer.y - whisk.offsetY, 80, H - whisk.height - 60);

    const bowl = state.whiskStage.bowl;
    const whiskCenterX = whisk.x + whisk.width / 2;
    const whiskCenterY = whisk.y + whisk.height / 2;
    const bowlCenterX = bowl.x + bowl.width / 2;
    const bowlCenterY = bowl.y + bowl.height / 2;
    const offsetX = whiskCenterX - bowlCenterX;
    const offsetY = whiskCenterY - bowlCenterY;
    const distanceToCenter = Math.hypot(offsetX, offsetY);
    const insideBowl = distanceToCenter < Math.min(bowl.width, bowl.height) * 0.55;

    if (insideBowl) {
      const currentAngle = Math.atan2(offsetY, offsetX);
      const deltaAngle = Math.atan2(Math.sin(currentAngle - whisk.lastAngle), Math.cos(currentAngle - whisk.lastAngle));
      const movement = Math.hypot(pointer.x - whisk.lastX, pointer.y - whisk.lastY);

      if (movement > 6) {
        const degrees = Math.abs(deltaAngle) * (180 / Math.PI);
        const circularGain = Math.max(0, degrees - 12) * 0.45;
        state.whiskStage.progress = clamp(state.whiskStage.progress + circularGain, 0, state.whiskStage.requiredProgress);
      }

      whisk.lastAngle = currentAngle;
    }

    whisk.lastX = pointer.x;
    whisk.lastY = pointer.y;

    if (state.whiskStage.progress >= state.whiskStage.requiredProgress && !state.whiskStage.complete) {
      state.whiskStage.complete = true;
      playStageCompleteSound();
    }
    return;
  }

  if (state.screen === 'bananaStage') {
    const activeBanana = state.bananaStage.bananas.find((banana) => banana.dragging && !banana.placed);
    if (!activeBanana) return;

    activeBanana.x = clamp(pointer.x - activeBanana.offsetX, 30, W - activeBanana.width - 30);
    activeBanana.y = clamp(pointer.y - activeBanana.offsetY, 80, H - activeBanana.height - 20);
    return;
  }

  if (state.screen === 'panStage') {
    const bowl = state.panStage.bowl;
    if (!bowl.dragging) return;

    bowl.x = clamp(pointer.x - bowl.offsetX, 30, W - bowl.width - 30);
    bowl.y = clamp(pointer.y - bowl.offsetY, 80, H - bowl.height - 40);
  }
});

window.addEventListener('pointerup', (event) => {
  if (state.screen === 'peelStage') {
    if (state.banana.peelHoldTimer > 0) {
      state.banana.dragging = false;
      return;
    }

    if (!state.banana.finishedPeel) {
      state.banana.peelProgress = 0;
    }

    state.banana.dragging = false;
    return;
  }

  if (state.screen === 'bowlStage') {
    const egg = state.bowlStage.egg;
    const bowl = state.bowlStage.bowl;
    const eggCenterX = egg.x + egg.width / 2;
    const eggCenterY = egg.y + egg.height / 2;
    const bowlCenterX = bowl.x + bowl.width / 2;
    const bowlCenterY = bowl.y + bowl.height / 2;
    const insideBowl = Math.abs(eggCenterX - bowlCenterX) < bowl.width * 0.32 && Math.abs(eggCenterY - bowlCenterY) < bowl.height * 0.35;

    if (insideBowl && !state.bowlStage.complete) {
      state.bowlStage.complete = true;
      playStageCompleteSound();
    }

    egg.dragging = false;
    if (event.pointerId !== undefined && canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // no-op: pointer may already be released
      }
    }
    return;
  }

  if (state.screen === 'whiskStage') {
    state.whiskStage.whisk.dragging = false;
    if (event.pointerId !== undefined && canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // no-op: pointer may already be released
      }
    }
    return;
  }

  if (state.screen === 'bananaStage') {
    const bowl = state.bananaStage.bowl;
    const activeBanana = state.bananaStage.bananas.find((banana) => banana.dragging && !banana.placed);
    if (!activeBanana) {
      return;
    }

    const bananaCenterX = activeBanana.x + activeBanana.width / 2;
    const bananaCenterY = activeBanana.y + activeBanana.height / 2;
    const bowlCenterX = bowl.x + bowl.width / 2;
    const bowlCenterY = bowl.y + bowl.height / 2;
    const insideBowl = Math.abs(bananaCenterX - bowlCenterX) < bowl.width * 0.38 && Math.abs(bananaCenterY - bowlCenterY) < bowl.height * 0.42;

    if (insideBowl) {
      activeBanana.placed = true;
      activeBanana.dragging = false;
      playPeelPingSound();

      const placedCount = state.bananaStage.bananas.filter((banana) => banana.placed).length;
      if (placedCount >= state.bananaStage.total) {
        state.bananaStage.complete = true;
        playStageCompleteSound();
      }
    } else {
      activeBanana.x = activeBanana.startX;
      activeBanana.y = activeBanana.startY;
      activeBanana.dragging = false;
    }

    if (event.pointerId !== undefined && canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // no-op: pointer may already be released
      }
    }
    return;
  }

  if (state.screen === 'panStage') {
    const bowl = state.panStage.bowl;
    const pan = state.panStage.pan;
    const bowlCenterX = bowl.x + bowl.width / 2;
    const bowlCenterY = bowl.y + bowl.height / 2;
    const panCenterX = pan.x + pan.width / 2;
    const panCenterY = pan.y + pan.height / 2;
    const insidePan = Math.abs(bowlCenterX - panCenterX) < pan.width * 0.28 && Math.abs(bowlCenterY - panCenterY) < pan.height * 0.32;

    if (insidePan && !state.panStage.complete) {
      state.panStage.complete = true;
      playStageCompleteSound();
    } else {
      bowl.x = bowl.startX;
      bowl.y = bowl.startY;
    }

    bowl.dragging = false;
    if (event.pointerId !== undefined && canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // no-op: pointer may already be released
      }
    }
    return;
  }

  if (state.screen === 'fryStage') {
    if (state.fryStage.failed || state.fryStage.complete) {
      return;
    }
  }
});

monkeyImage.onload = drawHUD;
bananaImage.onload = drawHUD;
peeledBananaImage.onload = drawHUD;
eggImage.onload = drawHUD;
eggCrack1Image.onload = drawHUD;
eggCrack2Image.onload = drawHUD;
eggCrackFinalImage.onload = drawHUD;
emptyBowlImage.onload = drawHUD;
filledBowlImage.onload = drawHUD;
bowlTopDownImage.onload = drawHUD;
panEmptyImage.onload = drawHUD;
panPancakeImage.onload = drawHUD;
panPancakeBurntImage.onload = drawHUD;
panPancakeCookedImage.onload = drawHUD;
fireImage.onload = drawHUD;
whiskImage.onload = drawHUD;
kitchenBackground.onload = drawHUD;
monkeyParty1Image.onload = drawHUD;
monkeyParty2Image.onload = drawHUD;
pancakesImage.onload = drawHUD;
drawHUD();

function gameLoop() {
  const banana = state.banana;

  if (state.screen === 'peelStage' && banana.peelHoldTimer > 0) {
    banana.peelHoldTimer = Math.max(0, banana.peelHoldTimer - 16.7);

    if (banana.peelHoldTimer === 0) {
      banana.peeled = banana.finishedPeel;
    }
  }

  if (state.screen === 'fryStage') {
    const fryStage = state.fryStage;
    if (!fryStage.complete && !fryStage.failed) {
      if (!fryStage.soundsStarted) {
        fryStage.soundsStarted = true;
        sizzlingSound.currentTime = 0;
        sizzlingSound.play().catch(() => {});
      }

      fryStage.progress += 0.0167;
      fryStage.spawnAccumulator += 16.7;

      if (fryStage.spawnAccumulator >= fryStage.showFireEvery * 1000 && fryStage.fires.length < fryStage.totalSpawns) {
        fryStage.spawnAccumulator = 0;
        spawnFire();
      }

      const now = performance.now();
      for (let i = fryStage.fires.length - 1; i >= 0; i--) {
        const fire = fryStage.fires[i];
        const age = now - fire.bornAt;
        if (age >= fire.ttl) {
          fryStage.fires.splice(i, 1);
          fryStage.missCount += 1;
        }
      }

      if (fryStage.progress >= fryStage.duration) {
        fryStage.complete = true;
        sizzlingSound.pause();
        sizzlingSound.currentTime = 0;

        if (fryStage.missCount > 10) {
          fryStage.failed = true;
          if (panPancakeBurntImage.complete) {
            // burnt display is handled in drawFryStage
          }
        } else {
          playStageCompleteSound();
        }
      }
    }
  }

  if (state.screen === 'endingStage' && !state.endingState.soundsPlayed) {
    state.endingState.soundsPlayed = true;
    playMonkeySound();
    playStageCompleteSound();
  }

  drawHUD();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

function drawEndingStage() {
  ctx.fillStyle = '#efefef';
  ctx.fillRect(0, 0, W, H);

  if (kitchenBackground.complete) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(kitchenBackground, 0, 0, W, H);
    ctx.restore();
  }

  const partyFrame = Math.floor(performance.now() / 350) % 2 === 0
    ? monkeyParty1Image
    : monkeyParty2Image;

  if (partyFrame.complete) {
    ctx.drawImage(partyFrame, 0, 250, 390, 520);
  }

  if (pancakesImage.complete) {
    const pancakesWidth = 760;
    const pancakesHeight = 520;
    ctx.drawImage(
      pancakesImage,
      centerX - pancakesWidth / 2,
      170,
      pancakesWidth,
      pancakesHeight,
    );
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 64px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.fillStyle = '#0d7a2c';
  ctx.strokeText('PANCAKES DONE!', centerX, 100);
  ctx.fillText('PANCAKES DONE!', centerX, 100);
  ctx.restore();
}
