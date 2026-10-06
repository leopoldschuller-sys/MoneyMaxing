// Cosy home sets for the smooth skits: bedroom (sitting up in bed) and kitchen table.
// Same pastel palette as sets2.js; everything drawn in world coordinates of a 1080x1920 frame.
'use strict';

const BED3 = { x0: 120, x1: 960, blanketTop: 1300, bottom: 1780, him: 375, her: 705, feetY: 1405 };

function fairyGarland(ctx, t, y0, amp = 44, n = 16) {
  ctx.strokeStyle = 'rgba(91,74,96,0.55)'; ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = -100; x <= W + 100; x += 10) ctx.lineTo(x, y0 + amp * Math.sin((x + 100) / (W + 200) * Math.PI * 3) ** 2);
  ctx.stroke();
  for (let i = 0; i < n; i++) {
    const x = -60 + i * 78, y = y0 + 6 + amp * Math.sin((x + 100) / (W + 200) * Math.PI * 3) ** 2;
    const on = 0.65 + 0.35 * Math.sin(t * 2.2 + i * 1.7);
    const c = ['255,214,130', '255,170,200', '180,215,255'][i % 3];
    softGlow(ctx, x, y + 6, 46, c, 0.8 * on);
    ellipse(ctx, x, y + 8, 9, 12); ctx.fillStyle = `rgb(${c})`; ctx.fill();
  }
}

function nightWindow(ctx, t, x, y, w, h, curtain = '#F8BFD3') {
  rrect(ctx, x, y, w, h, [w / 2, w / 2, 16, 16]);
  ctx.fillStyle = vgrad(ctx, y, y + h, [[0, '#2C2C6E'], [0.65, '#6B5AA6'], [1, '#B98BC2']]);
  ctx.fill();
  ctx.save(); rrect(ctx, x, y, w, h, [w / 2, w / 2, 16, 16]); ctx.clip();
  twinkleStars(ctx, t, x, y, w, h * 0.7, 18, 12);
  softGlow(ctx, x + w * 0.68, y + h * 0.3, 120, '255,240,200', 0.5);
  ellipse(ctx, x + w * 0.68, y + h * 0.3, 34, 34); ctx.fillStyle = '#FFF3D2'; ctx.fill();
  hills(ctx, y + h - 30, 40, 0.025, 2, '#4C4580');
  fallingSnow(ctx, t, 18, 0.35, 0.8, 5);
  ctx.restore();
  ctx.lineWidth = 14; ctx.strokeStyle = '#FFF8F4';
  rrect(ctx, x, y, w, h, [w / 2, w / 2, 16, 16]); ctx.stroke();
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(x + w / 2, y + 8); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h * 0.56); ctx.lineTo(x + w, y + h * 0.56); ctx.stroke();
  // curtains, gently swaying
  for (const side of [-1, 1]) {
    const cx = side < 0 ? x - 18 : x + w + 18;
    const sway = Math.sin(t * 0.9 + side) * 6;
    ctx.beginPath();
    ctx.moveTo(cx - 46, y - 30);
    ctx.lineTo(cx + 46, y - 30);
    ctx.quadraticCurveTo(cx - side * 30 + sway, y + h * 0.5, cx + side * 6 + sway, y + h + 50);
    ctx.lineTo(cx - side * 60 + sway, y + h + 50);
    ctx.quadraticCurveTo(cx - side * 20, y + h * 0.5, cx - side * 46, y - 30);
    ctx.closePath();
    fillStroke(ctx, curtain, SOFT_OUT, 4);
  }
  rrect(ctx, x - 90, y - 46, w + 180, 18, 9); ctx.fillStyle = '#C9A08E'; ctx.fill();
}

// ---------- bedroom ----------
function drawCozyBedroom(ctx, t, o = {}) {
  const lamp = o.lamp ?? 1;
  ctx.fillStyle = vgrad(ctx, -400, 1500, [[0, '#E3D3F0'], [1, '#F3E3EE']]);
  ctx.fillRect(-400, -400, W + 800, 2400);
  // star wallpaper
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  for (let y = -300; y < 1400; y += 120) for (let x = (Math.floor(y / 120) % 2) ? -300 : -240; x < W + 300; x += 120) sparkle(ctx, x, y, 9, 0, 'rgba(255,255,255,0.55)');
  fairyGarland(ctx, t, 480);
  nightWindow(ctx, t, 70, 600, 300, 380);
  pictureFrame(ctx, 760, 640, 190, 160, (x, y, w, h) => miniCouple(ctx, x, y, w, h), '#C99A86');
  // nightstands + lamp + clock
  for (const [x, w] of [[-70, 200], [950, 200]]) {
    rrect(ctx, x, 1230, w, 330, 18); fillStroke(ctx, '#E8C3AE', SOFT_OUT, 5);
    rrect(ctx, x + 20, 1300, w - 40, 90, 12); fillStroke(ctx, '#F1D3C2', 'rgba(91,74,96,0.3)', 3);
    ellipse(ctx, x + w / 2, 1345, 8, 8); ctx.fillStyle = '#B98872'; ctx.fill();
  }
  // lamp (right)
  rrect(ctx, 1015, 1170, 50, 62, 14); fillStroke(ctx, '#FFF1E6', SOFT_OUT, 4);
  ctx.beginPath(); ctx.moveTo(985, 1170); ctx.lineTo(1095, 1170); ctx.lineTo(1070, 1060); ctx.lineTo(1010, 1060); ctx.closePath();
  fillStroke(ctx, lamp > 0.5 ? '#FFE3B3' : '#EBD8C8', SOFT_OUT, 4);
  // clock (left)
  rrect(ctx, 10, 1150, 120, 82, 22); fillStroke(ctx, '#FFF7F2', SOFT_OUT, 4);
  ctx.font = font(40, 700); ctx.fillStyle = '#FF7FB0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(o.clock || '11:47', 70, 1192);
  // headboard (upholstered, channel tufting)
  rrect(ctx, BED3.x0, 860, BED3.x1 - BED3.x0, 520, [170, 170, 30, 30]);
  fillStroke(ctx, '#F4C6B6', SOFT_OUT, 6);
  ctx.save();
  rrect(ctx, BED3.x0, 860, BED3.x1 - BED3.x0, 520, [170, 170, 30, 30]); ctx.clip();
  ctx.strokeStyle = 'rgba(200,120,110,0.35)'; ctx.lineWidth = 5;
  for (let x = BED3.x0 + 105; x < BED3.x1; x += 105) { ctx.beginPath(); ctx.moveTo(x, 860); ctx.lineTo(x, 1380); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(BED3.x0, 860, BED3.x1 - BED3.x0, 40);
  ctx.restore();
  // pillows behind the bears
  for (const [x, c] of [[BED3.him, '#D6E6FF'], [BED3.her, '#FFDCE8']]) {
    rrect(ctx, x - 165, 1050, 330, 190, 80); fillStroke(ctx, c, SOFT_OUT, 5);
    ctx.beginPath(); ctx.moveTo(x - 110, 1080); ctx.quadraticCurveTo(x, 1100, x + 110, 1080);
    ctx.strokeStyle = 'rgba(91,74,96,0.18)'; ctx.lineWidth = 4; ctx.stroke();
  }
  // mattress edge behind blanket
  rrect(ctx, BED3.x0 - 20, 1250, BED3.x1 - BED3.x0 + 40, 480, 40); fillStroke(ctx, '#FFF8F3', SOFT_OUT, 5);
}

function bedroomLight(ctx, t, o = {}) {
  const lamp = o.lamp ?? 1;
  softGlow(ctx, 1040, 1100, 520, '255,210,150', 0.45 * lamp);
  softGlow(ctx, 220, 790, 300, '190,180,255', 0.25);
}

// Blanket over the laps; humps follow the bears.
function drawCozyBlanket(ctx, t, o = {}) {
  const top = BED3.blanketTop;
  const hx = o.him ?? BED3.him, sx = o.her ?? BED3.her;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(BED3.x0 - 30, top + 30);
  ctx.bezierCurveTo(hx - 120, top - 30, hx + 120, top - 30, (hx + sx) / 2, top + 6);
  ctx.bezierCurveTo(sx - 120, top - 30, sx + 120, top - 30, BED3.x1 + 30, top + 30);
  ctx.lineTo(BED3.x1 + 50, BED3.bottom);
  ctx.lineTo(BED3.x0 - 50, BED3.bottom);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, top - 30, BED3.bottom, [[0, '#BFE3D3'], [1, '#A6D3C1']]);
  ctx.fill();
  ctx.save(); ctx.clip();
  // little hearts pattern
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  for (let y = top + 40; y < BED3.bottom; y += 90) for (let x = BED3.x0 + ((y / 90) % 2 ? 0 : 45); x < BED3.x1 + 40; x += 90) { heartPath(ctx, x, y, 12); ctx.fill(); }
  // soft folds
  ctx.strokeStyle = 'rgba(70,120,100,0.18)'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  for (const fx of [hx, sx]) {
    ctx.beginPath(); ctx.moveTo(fx - 60, top + 90); ctx.quadraticCurveTo(fx - 20, top + 260, fx - 70, BED3.bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx + 70, top + 110); ctx.quadraticCurveTo(fx + 40, top + 280, fx + 90, BED3.bottom); ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 6; ctx.stroke();
  // folded sheet band
  ctx.beginPath();
  ctx.moveTo(BED3.x0 - 30, top + 30);
  ctx.bezierCurveTo(hx - 120, top - 30, hx + 120, top - 30, (hx + sx) / 2, top + 6);
  ctx.bezierCurveTo(sx - 120, top - 30, sx + 120, top - 30, BED3.x1 + 30, top + 30);
  ctx.lineTo(BED3.x1 + 34, top + 92);
  ctx.bezierCurveTo(sx, top + 50, hx, top + 50, BED3.x0 - 34, top + 92);
  ctx.closePath();
  fillStroke(ctx, '#FFFDF8', SOFT_OUT, 5);
  ctx.restore();
  // footboard
  rrect(ctx, BED3.x0 - 50, BED3.bottom - 30, BED3.x1 - BED3.x0 + 100, 120, 40);
  fillStroke(ctx, '#F0BFAE', SOFT_OUT, 6);
}

// ---------- kitchen table ----------
const TABLE3 = { top: 1395, him: 360, her: 720, feetY: 1545 };
function drawCozyKitchen(ctx, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, -400, 1300, [[0, '#FBE3D3'], [1, '#FCEBDD']]);
  ctx.fillRect(-400, -400, W + 800, 2400);
  // tiles on the lower wall
  ctx.fillStyle = '#CDEBDD';
  ctx.fillRect(-400, 1110, W + 800, 900);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4;
  for (let y = 1110; y < 1900; y += 60) { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); ctx.stroke(); }
  for (let y = 1110, r = 0; y < 1900; y += 60, r++) for (let x = -400 + (r % 2) * 40; x < W + 400; x += 80) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 60); ctx.stroke(); }
  rrect(ctx, -400, 1096, W + 800, 18, 6); ctx.fillStyle = '#FFFFFF'; ctx.fill();
  // window with daylight/evening sky
  const ev = o.evening ?? 1;
  const wx = 360, wy = 760, ww = 360, wh = 300;
  rrect(ctx, wx, wy, ww, wh, 24);
  ctx.fillStyle = vgrad(ctx, wy, wy + wh, ev ? [[0, '#8D7CC9'], [0.6, '#F2A7B6'], [1, '#FFD6A8']] : [[0, '#9CCBF2'], [1, '#DDF0FF']]);
  ctx.fill();
  ctx.save(); rrect(ctx, wx, wy, ww, wh, 24); ctx.clip();
  softGlow(ctx, wx + ww * 0.3, wy + wh * 0.75, 160, '255,220,170', 0.6);
  hills(ctx, wy + wh - 20, 60, 0.012, 1.3, '#9B86C2');
  for (const [x, s] of [[wx + 70, 0.45], [wx + 330, 0.55], [wx + 380, 0.4]]) pineTree(ctx, x, wy + wh - 10, s, '#7C9DA8');
  ctx.restore();
  ctx.lineWidth = 14; ctx.strokeStyle = '#FFFFFF'; rrect(ctx, wx, wy, ww, wh, 24); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
  // cafe curtain
  ctx.beginPath(); ctx.moveTo(wx - 10, wy + wh * 0.55);
  for (let x = wx - 10; x <= wx + ww + 10; x += 30) ctx.quadraticCurveTo(x + 15, wy + wh * 0.55 + 18, x + 30, wy + wh * 0.55);
  ctx.lineTo(wx + ww + 10, wy + wh + 6); ctx.lineTo(wx - 10, wy + wh + 6); ctx.closePath();
  fillStroke(ctx, '#FFF4F7', 'rgba(91,74,96,0.4)', 3);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,143,186,0.35)';
  for (let x = wx; x < wx + ww; x += 40) for (let y = wy + wh * 0.55; y < wy + wh; y += 40) if (((x - wx) / 40 + (y - wy) / 40) % 2 < 1) ctx.fillRect(x, y, 20, 20);
  ctx.restore();
  rrect(ctx, wx - 26, wy + wh, ww + 52, 24, 10); ctx.fillStyle = '#FFFFFF'; ctx.fill();
  // shelf with cups and a plant
  rrect(ctx, 790, 860, 250, 18, 6); fillStroke(ctx, '#C99A86', SOFT_OUT, 4);
  for (const [x, c] of [[830, '#FFB8CC'], [885, '#BFE3D3'], [940, '#FFE3A3']]) {
    rrect(ctx, x - 22, 810, 44, 50, 10); fillStroke(ctx, c, SOFT_OUT, 3.5);
    ctx.beginPath(); ctx.arc(x + 24, 834, 10, -1.2, 1.2); ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 3.5; ctx.stroke();
  }
  rrect(ctx, 990, 800, 44, 60, 10); fillStroke(ctx, '#E9A28C', SOFT_OUT, 3.5);
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(1012, 800); ctx.rotate(-0.9 + i * 0.6); ellipse(ctx, 0, -30, 12, 28); fillStroke(ctx, '#8CC79F', SOFT_OUT, 3); ctx.restore(); }
  // a little hanging plant on the left
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(150, 500); ctx.lineTo(150, 820); ctx.stroke();
  rrect(ctx, 115, 820, 70, 56, 14); fillStroke(ctx, '#F7C6D9', SOFT_OUT, 3.5);
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(150 + (i - 2) * 16, 876); ctx.rotate((i - 2) * 0.25); ellipse(ctx, 0, 40 + (i % 2) * 18, 11, 30); fillStroke(ctx, '#8CC79F', SOFT_OUT, 3); ctx.restore(); }
  // pendant lamp
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 4;
  const lx = 540 + Math.sin(t * 0.8) * 4;
  ctx.beginPath(); ctx.moveTo(540, -100); ctx.lineTo(lx, 600); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lx - 80, 680); ctx.quadraticCurveTo(lx, 560, lx + 80, 680); ctx.closePath();
  fillStroke(ctx, '#FFC9A8', SOFT_OUT, 5);
  ellipse(ctx, lx, 682, 30, 12); ctx.fillStyle = '#FFF4C8'; ctx.fill();
  softGlow(ctx, lx, 720, 460, '255,226,170', 0.5);
  // chairs behind the bears
  for (const x of [TABLE3.him, TABLE3.her]) {
    rrect(ctx, x - 150, 1000, 300, 460, [120, 120, 30, 30]);
    fillStroke(ctx, '#FFE3A3', SOFT_OUT, 5);
    rrect(ctx, x - 105, 1040, 210, 170, [90, 90, 20, 20]);
    fillStroke(ctx, '#FFEDC4', 'rgba(91,74,96,0.25)', 3);
  }
}

function drawCozyTable(ctx, t) {
  const top = TABLE3.top;
  // table top (front edge) with gingham cloth hanging down
  rrect(ctx, -60, top - 30, W + 120, 70, 24);
  fillStroke(ctx, '#FFF7FA', SOFT_OUT, 5);
  ctx.beginPath();
  ctx.moveTo(-60, top + 20);
  ctx.lineTo(W + 60, top + 20);
  ctx.lineTo(W + 60, 1760);
  for (let x = W + 60; x > -60; x -= 80) ctx.quadraticCurveTo(x - 40, 1792, x - 80, 1760);
  ctx.closePath();
  ctx.fillStyle = '#FFF4F7';
  ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = 'rgba(255,143,186,0.32)';
  for (let x = -60, i = 0; x < W + 60; x += 60, i++) ctx.fillRect(x, top, 30, 900);
  for (let y = top + 20, j = 0; y < 1800; y += 60, j++) { ctx.fillStyle = 'rgba(255,143,186,0.22)'; ctx.fillRect(-60, y, W + 120, 30); }
  ctx.fillStyle = 'rgba(91,74,96,0.08)'; ctx.fillRect(-60, top + 20, W + 120, 26);
  ctx.restore();
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 5; ctx.stroke();
}

// Small table props
function drawPlateCute(ctx, x, y, s = 1, food = null, t = 0) {
  ellipse(ctx, x, y, 120 * s, 34 * s); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  ellipse(ctx, x, y - 2, 86 * s, 22 * s); ctx.strokeStyle = 'rgba(255,143,186,0.45)'; ctx.lineWidth = 4; ctx.stroke();
  if (food) {
    ctx.font = `${Math.round(110 * s)}px "Noto Color Emoji"`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(food, x, y + 10 * s);
  }
}
function drawCupCute(ctx, x, y, s = 1, col = '#BFE3D3', t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -34, -78, 68, 78, [8, 8, 22, 22]); fillStroke(ctx, col, SOFT_OUT, 4);
  ctx.beginPath(); ctx.arc(36, -42, 16, -1.3, 1.3); ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 5; ctx.stroke();
  heartPath(ctx, 0, -38, 12); ctx.fillStyle = '#FF8FBA'; ctx.fill();
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 2; i++) {
    const k = (t * 0.6 + i * 0.5) % 1;
    ctx.beginPath(); ctx.moveTo(-10 + i * 18, -90 - k * 60);
    ctx.quadraticCurveTo(4 + i * 18, -110 - k * 60, -6 + i * 18, -130 - k * 60);
    ctx.strokeStyle = `rgba(255,255,255,${1 - k})`; ctx.lineWidth = 6; ctx.stroke();
  }
  ctx.restore();
}

// Phone held in a paw, screen facing the viewer (for showing app screens).
function drawPhoneFront(ctx, x, y, s, rot, drawScreen, t) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -80, -150, 160, 300, 30); fillStroke(ctx, '#3E3446', SOFT_OUT, 5);
  ctx.save(); rrect(ctx, -68, -136, 136, 272, 20); ctx.clip();
  ctx.fillStyle = '#FFF7FB'; ctx.fillRect(-70, -140, 140, 280);
  if (drawScreen) drawScreen(ctx, t);
  ctx.restore();
  ctx.restore();
}
