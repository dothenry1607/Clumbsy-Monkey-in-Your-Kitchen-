const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const monkeyImage = new Image();
monkeyImage.src = 'monkey.gif';

const W = canvas.width;
const H = canvas.height;
const centerX = W / 2;

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
  const x = centerX - 180;
  const y = 520;
  const width = 360;
  const height = 150;

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
  ctx.fillText('PLAY', centerX, 592);
}

function drawBackground() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#efefef';
  ctx.fillRect(0, 0, W, H);

  drawMonkeySide(110, 500, 1);
  drawMonkeySide(W - 110, 500, -1);
}

function drawHUD() {
  drawBackground();
  drawTitleBanner();
  drawPlayButton();
}

monkeyImage.onload = drawHUD;
drawHUD();
