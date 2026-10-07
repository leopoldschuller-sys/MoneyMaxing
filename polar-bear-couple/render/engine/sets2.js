// Softer, prettier sets for the "cute" skits (06+): aurora night, snowy park, cosy evening room,
// plus small props (phones, polaroids, food chips). Pastel palette, soft light, gentle motion.
'use strict';

const SOFT_OUT = '#5B4A60';

let _auroraCanvas = null;
function auroraCanvas(w, h) {
  if (!_auroraCanvas) { _auroraCanvas = document.createElement('canvas'); _auroraCanvas.width = w; _auroraCanvas.height = h; }
  return _auroraCanvas;
}

function softGlow(ctx, x, y, r, rgb, a) { glow(ctx, x, y, r, rgb, a); }

function fallingSnow(ctx, t, n = 50, speed = 1, alpha = 0.9, seed = 21) {
  const r = mulberry32(seed);
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  for (let i = 0; i < n; i++) {
    const sz = 3 + r() * 6;
    const x = (r() * (W + 400) - 200) + Math.sin(t * (0.6 + r()) + i) * 26;
    const y = ((r() * 2400 + t * speed * (40 + sz * 12)) % 2400) - 240;
    ellipse(ctx, x, y, sz, sz);
    ctx.fill();
  }
  ctx.restore();
}

function twinkleStars(ctx, t, x0, y0, w, h, n = 60, seed = 4) {
  const r = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + r() * h;
    const tw = 0.5 + 0.5 * Math.sin(t * (1.2 + r() * 2.5) + i);
    const s = 1.5 + r() * 3;
    ctx.globalAlpha = 0.35 + 0.65 * tw;
    if (s > 3.6) sparkle(ctx, x, y, s * 2.4, 0, '#FFF7D6');
    else { ellipse(ctx, x, y, s, s); ctx.fillStyle = '#FFF7E8'; ctx.fill(); }
  }
  ctx.restore();
}

// Rolling hill silhouette.
function hills(ctx, yBase, amp, freq, phase, color, extra = 0) {
  ctx.beginPath();
  ctx.moveTo(-400, H + 400);
  for (let x = -400; x <= W + 400; x += 20) {
    const y = yBase - amp * (0.5 + 0.5 * Math.sin(x * freq + phase)) - extra * Math.sin(x * freq * 2.3 + phase * 1.7);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W + 400, H + 400);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function pineTree(ctx, x, y, s, col = '#6FA48F', snow = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  rrect(ctx, -12, -10, 24, 50, 6);
  ctx.fillStyle = '#8B6A5A'; ctx.fill();
  for (let i = 0; i < 3; i++) {
    const w = 120 - i * 28, yy = -i * 70;
    ctx.beginPath();
    ctx.moveTo(-w, yy);
    ctx.quadraticCurveTo(0, yy - 150 - i * 6, w, yy);
    ctx.quadraticCurveTo(0, yy + 22, -w, yy);
    ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
    if (snow) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.55, yy - 52);
      ctx.quadraticCurveTo(0, yy - 150 - i * 6 + 30, w * 0.55, yy - 52);
      ctx.quadraticCurveTo(w * 0.2, yy - 40, 0, yy - 50);
      ctx.quadraticCurveTo(-w * 0.2, yy - 40, -w * 0.55, yy - 52);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
    }
  }
  ctx.restore();
}

// ---------- 1) aurora night on the ice ----------
const SNOWBANK_Y = 1500;
function drawAuroraNight(ctx, t, o = {}) {
  const pink = o.pink || 0; // 0..1 shifts the aurora towards pink (romantic beat)
  ctx.fillStyle = vgrad(ctx, -400, 1500, [[0, '#0E1236'], [0.45, '#2A2466'], [0.8, '#6A4C93'], [1, '#C98BB9']]);
  ctx.fillRect(-400, -400, W + 800, 2400);
  twinkleStars(ctx, t, -300, -300, W + 600, 1250, 90, 8);
  // moon
  softGlow(ctx, 860, 760, 260, '255,236,200', 0.45);
  ellipse(ctx, 860, 760, 62, 62); ctx.fillStyle = '#FFF4D8'; ctx.fill();
  ctx.fillStyle = 'rgba(230,210,180,0.5)';
  for (const [dx, dy, r] of [[-18, -12, 11], [16, 14, 8], [-6, 22, 6]]) { ellipse(ctx, 860 + dx, 760 + dy, r, r); ctx.fill(); }
  // aurora ribbons: drawn small on an offscreen canvas and scaled up (soft glow, cheap)
  const AS = 6, ax0 = -300, ay0 = 200, aw = W + 600, ah = 1000;
  const off = auroraCanvas(Math.ceil(aw / AS), Math.ceil(ah / AS));
  const o2 = off.getContext('2d');
  o2.setTransform(1, 0, 0, 1, 0, 0);
  o2.clearRect(0, 0, off.width, off.height);
  o2.scale(1 / AS, 1 / AS);
  o2.translate(-ax0, -ay0);
  const cols = [
    [lerp(90, 255, pink), lerp(255, 140, pink), lerp(190, 200, pink)],
    [lerp(110, 230, pink), lerp(210, 130, pink), lerp(255, 255, pink)],
    [lerp(190, 255, pink), lerp(130, 175, pink), lerp(255, 225, pink)],
  ];
  for (let k = 0; k < 3; k++) {
    const yb = 820 + k * 70;
    const edge = (x) => yb + Math.sin(x * 0.005 + t * 0.5 + k * 1.7) * 110 + Math.sin(x * 0.012 - t * 0.8 + k) * 35;
    const height = (x) => 300 + 140 * (0.5 + 0.5 * Math.sin(x * 0.008 + t * 0.35 + k * 2));
    const [r, gg, bb] = cols[k].map(Math.round);
    for (let x = -300; x < W + 300; x += 30) {
      const e0 = edge(x), e1 = edge(x + 30), h0 = height(x), h1 = height(x + 30);
      const g = o2.createLinearGradient(0, e0 - h0, 0, e0);
      g.addColorStop(0, `rgba(${r},${gg},${bb},0)`);
      g.addColorStop(0.75, `rgba(${r},${gg},${bb},0.32)`);
      g.addColorStop(1, `rgba(${r},${gg},${bb},0.55)`);
      o2.fillStyle = g;
      o2.beginPath();
      o2.moveTo(x - 1, e0 - h0); o2.lineTo(x + 31, e1 - h1); o2.lineTo(x + 31, e1); o2.lineTo(x - 1, e0);
      o2.closePath(); o2.fill();
    }
  }
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.filter = 'blur(3px)';
  ctx.drawImage(off, ax0, ay0, aw, ah);
  ctx.filter = 'none';
  ctx.restore();
  // distant mountains + hills
  ctx.beginPath();
  ctx.moveTo(-400, 1260);
  const peaks = [[-200, 980], [80, 1100], [260, 940], [470, 1120], [700, 990], [930, 1090], [1150, 960], [1400, 1200]];
  for (const [px, py] of peaks) ctx.lineTo(px, py);
  ctx.lineTo(1500, 1300); ctx.lineTo(-400, 1300); ctx.closePath();
  ctx.fillStyle = '#4B4785'; ctx.fill();
  // snow caps
  ctx.fillStyle = 'rgba(235,230,255,0.75)';
  for (const [px, py] of [[260, 940], [700, 990], [1150, 960], [-200, 980]]) {
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 60, py + 70); ctx.lineTo(px - 20, py + 58); ctx.lineTo(px + 10, py + 76); ctx.lineTo(px + 60, py + 66); ctx.closePath(); ctx.fill();
  }
  hills(ctx, 1330, 70, 0.006, 1.1, '#8F8AC7', 12);
  hills(ctx, 1420, 60, 0.008, 2.3, '#B7B3E3', 10);
  // pines
  for (const [x, y, s] of [[-30, 1430, 0.9], [90, 1460, 0.65], [1010, 1440, 0.85], [1110, 1470, 0.6]]) pineTree(ctx, x, y, s, '#5E8C88');
  // igloo with warm glowing door
  ctx.save();
  ctx.translate(905, 1440);
  ellipse(ctx, 0, 0, 150, 120);
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, 400, 200); ctx.clip();
  ellipse(ctx, 0, 0, 150, 120); fillStroke(ctx, '#F2F0FF', SOFT_OUT, 5);
  ctx.strokeStyle = 'rgba(140,130,190,0.6)'; ctx.lineWidth = 4;
  for (const yy of [-40, -80]) { ctx.beginPath(); ctx.ellipse(0, 0, 150, 120 + yy * 0.2, 0, Math.PI, TAU); ctx.stroke(); }
  ctx.restore();
  rrect(ctx, -42, -78, 84, 80, [40, 40, 0, 0]);
  ctx.fillStyle = '#FFC978'; ctx.fill();
  ctx.restore();
  softGlow(ctx, 905, 1400, 200, '255,200,120', 0.55);
  // fairy lights on the igloo
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.08 + 0.84 * i / 8);
    const lx = 905 + Math.cos(a) * 158, ly = 1440 + Math.sin(a) * 128;
    const on = 0.6 + 0.4 * Math.sin(t * 3 + i * 1.3);
    softGlow(ctx, lx, ly, 34, i % 2 ? '255,170,200' : '255,230,150', 0.7 * on);
    ellipse(ctx, lx, ly, 7, 7); ctx.fillStyle = i % 2 ? '#FFC4DA' : '#FFE9A8'; ctx.fill();
  }
  // foreground snow bank the bears sit on
  ctx.beginPath();
  ctx.moveTo(-400, H + 400);
  ctx.lineTo(-400, SNOWBANK_Y + 30);
  ctx.bezierCurveTo(150, SNOWBANK_Y - 60, 900, SNOWBANK_Y - 70, W + 400, SNOWBANK_Y + 40);
  ctx.lineTo(W + 400, H + 400);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, SNOWBANK_Y - 80, H, [[0, '#F7F4FF'], [1, '#C9C3EC']]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(91,74,96,0.25)'; ctx.lineWidth = 4; ctx.stroke();
}

function auroraForeground(ctx, t) {
  fallingSnow(ctx, t, 36, 0.5, 0.75, 33);
}

// ---------- 2) snowy park in the afternoon ----------
function drawSnowPark(ctx, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, -400, 1450, [[0, '#9CC8F2'], [0.55, '#F6C9DA'], [1, '#FFE4C8']]);
  ctx.fillRect(-400, -400, W + 800, 2400);
  softGlow(ctx, 260, 760, 380, '255,240,200', 0.6);
  ellipse(ctx, 260, 760, 70, 70); ctx.fillStyle = '#FFF6DC'; ctx.fill();
  // soft clouds
  for (const [cx, cy, s] of [[760 + Math.sin(t * 0.2) * 20, 620, 1.1], [120, 520, 0.8], [980, 860, 0.7]]) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (const [dx, dy, r] of [[-60, 0, 44], [0, -24, 58], [62, 0, 44], [0, 16, 50]]) { ellipse(ctx, cx + dx * s, cy + dy * s, r * s, r * s * 0.9); ctx.fill(); }
  }
  hills(ctx, 1180, 120, 0.004, 0.4, '#C7B8E6', 20);
  hills(ctx, 1300, 80, 0.007, 2.0, '#E2D8F2', 14);
  for (const [x, y, s] of [[60, 1330, 0.8], [190, 1360, 0.6], [880, 1320, 0.85], [1040, 1350, 0.7], [-60, 1370, 0.7]]) pineTree(ctx, x, y, s, '#7FB59E');
  // snowy ground
  ctx.beginPath();
  ctx.moveTo(-400, H + 400);
  ctx.lineTo(-400, 1380);
  ctx.bezierCurveTo(200, 1330, 800, 1350, W + 400, 1390);
  ctx.lineTo(W + 400, H + 400);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, 1330, H, [[0, '#FFFFFF'], [1, '#DCD6F2']]);
  ctx.fill();
  // little fence
  ctx.strokeStyle = '#C79E8A'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  for (let x = 300; x < 820; x += 70) { ctx.beginPath(); ctx.moveTo(x, 1390); ctx.lineTo(x, 1330); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(290, 1350); ctx.lineTo(830, 1350); ctx.stroke();
  // snowman friend
  ctx.save();
  ctx.translate(o.snowmanX ?? 960, 1500);
  ellipse(ctx, 0, -40, 70, 60); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  ellipse(ctx, 0, -130, 48, 44); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  ctx.fillStyle = SOFT_OUT; ellipse(ctx, -14, -136, 5, 6); ctx.fill(); ellipse(ctx, 14, -136, 5, 6); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -124); ctx.lineTo(32, -118); ctx.lineTo(0, -114); ctx.closePath(); ctx.fillStyle = '#FF9F5A'; ctx.fill();
  rrect(ctx, -50, -96, 100, 20, 10); ctx.fillStyle = '#FF8FBA'; ctx.fill();
  ctx.restore();
}

// ---------- 3) cosy evening living room ----------
const COSY = { couchX: 540, seatY: 1520 };
function drawCozyRoom(ctx, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, -400, 1500, [[0, '#F3C9C4'], [1, '#F7DCCF']]);
  ctx.fillRect(-400, -400, W + 800, 2400);
  // soft wallpaper hearts
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let y = -300; y < 1450; y += 110) for (let x = (Math.floor(y / 110) % 2) ? -300 : -245; x < W + 300; x += 110) { heartPath(ctx, x, y, 9); ctx.fill(); }
  // window at dusk
  const wx = 110, wy = 700, ww = 360, wh = 400;
  rrect(ctx, wx, wy, ww, wh, [180, 180, 18, 18]);
  ctx.fillStyle = vgrad(ctx, wy, wy + wh, [[0, '#4C4A8F'], [0.6, '#B67DB0'], [1, '#F6B49A']]);
  ctx.fill();
  ctx.save(); rrect(ctx, wx, wy, ww, wh, [180, 180, 18, 18]); ctx.clip();
  twinkleStars(ctx, t, wx, wy, ww, wh * 0.5, 14, 3);
  hills(ctx, wy + wh - 40, 50, 0.02, 1, '#7A6AA8');
  for (const [x, y, s] of [[wx + 60, wy + wh - 30, 0.4], [wx + 290, wy + wh - 26, 0.45]]) pineTree(ctx, x, y, s, '#4F6E78');
  fallingSnow(ctx, t, 30, 0.4, 0.8, 7);
  ctx.restore();
  ctx.lineWidth = 14; ctx.strokeStyle = '#FFF8F2';
  rrect(ctx, wx, wy, ww, wh, [180, 180, 18, 18]); ctx.stroke();
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy + 10); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * 0.55); ctx.lineTo(wx + ww, wy + wh * 0.55); ctx.stroke();
  rrect(ctx, wx - 24, wy + wh, ww + 48, 26, 10); ctx.fillStyle = '#FFF8F2'; ctx.fill();
  // little plant on the sill
  rrect(ctx, wx + 270, wy + wh - 56, 60, 58, 12); fillStroke(ctx, '#E9A28C', SOFT_OUT, 4);
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(wx + 300, wy + wh - 56); ctx.rotate(-0.9 + i * 0.6); ellipse(ctx, 0, -36, 15, 34); fillStroke(ctx, '#8CC79F', SOFT_OUT, 3.5); ctx.restore(); }
  // framed photo of the couple
  pictureFrame(ctx, 650, 740, 200, 170, (x, y, w, h) => miniCouple(ctx, x, y, w, h), '#C99A86');
  // fairy-light garland across the top
  ctx.strokeStyle = 'rgba(91,74,96,0.6)'; ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = -100; x <= W + 100; x += 10) ctx.lineTo(x, 470 + 46 * Math.sin((x + 100) / (W + 200) * Math.PI * 3) ** 2);
  ctx.stroke();
  for (let i = 0; i < 16; i++) {
    const x = -60 + i * 78, y = 476 + 46 * Math.sin((x + 100) / (W + 200) * Math.PI * 3) ** 2;
    const on = 0.65 + 0.35 * Math.sin(t * 2.5 + i * 1.7);
    const c = ['255,214,130', '255,170,200', '170,210,255'][i % 3];
    softGlow(ctx, x, y + 8, 44, c, 0.75 * on);
    ellipse(ctx, x, y + 10, 9, 12); ctx.fillStyle = `rgb(${c})`; ctx.fill();
  }
  // floor lamp
  ctx.strokeStyle = '#8A6F78'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(990, 1560); ctx.lineTo(990, 900); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(925, 900); ctx.lineTo(1055, 900); ctx.lineTo(1030, 800); ctx.lineTo(950, 800); ctx.closePath();
  fillStroke(ctx, '#FFE3B0', SOFT_OUT, 4);
  softGlow(ctx, 990, 900, 420, '255,214,150', 0.5);
  // floor + rug
  ctx.fillStyle = vgrad(ctx, 1500, H, [[0, '#D8B39C'], [1, '#C79F88']]);
  ctx.fillRect(-400, 1500, W + 800, 900);
  ellipse(ctx, 540, 1700, 560, 120); ctx.fillStyle = '#F1E2EC'; ctx.fill();
  ellipse(ctx, 540, 1700, 500, 92); ctx.strokeStyle = 'rgba(255,143,186,0.55)'; ctx.lineWidth = 8; ctx.setLineDash([24, 16]); ctx.stroke(); ctx.setLineDash([]);
  // couch back
  const cx = COSY.couchX;
  rrect(ctx, cx - 430, 1140, 860, 300, 90);
  fillStroke(ctx, '#A8C9B4', SOFT_OUT, 5);
  for (const dx of [-205, 205]) { rrect(ctx, cx + dx - 180, 1170, 360, 230, 70); fillStroke(ctx, '#BBD7C4', 'rgba(91,74,96,0.25)', 4); }
}

function drawCozyCouchFront(ctx, t) {
  const cx = COSY.couchX;
  rrect(ctx, cx - 400, COSY.seatY - 90, 800, 150, 40);
  fillStroke(ctx, '#BBD7C4', SOFT_OUT, 5);
  for (const side of [-1, 1]) {
    rrect(ctx, cx + side * 440 - 70, COSY.seatY - 250, 140, 330, 60);
    fillStroke(ctx, '#A8C9B4', SOFT_OUT, 5);
  }
  rrect(ctx, cx - 450, COSY.seatY + 40, 900, 70, 26);
  fillStroke(ctx, '#93B9A2', SOFT_OUT, 5);
  // knit throw on the right arm
  ctx.save();
  ctx.translate(cx + 400, COSY.seatY - 200);
  rrect(ctx, -40, 0, 120, 260, 30); fillStroke(ctx, '#F7C6D9', SOFT_OUT, 4);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 5;
  for (let y = 24; y < 250; y += 28) { ctx.beginPath(); ctx.moveTo(-36, y); ctx.lineTo(76, y); ctx.stroke(); }
  ctx.restore();
}

// ---------- props ----------
// Phone seen from behind, held up by two paws (over-the-shoulder POV).
function drawPhoneBack(ctx, x, y, s, rot, caseCol = '#3B3446', sticker = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  rrect(ctx, -90, -170, 180, 340, 34);
  fillStroke(ctx, caseCol, SOFT_OUT, 6);
  rrect(ctx, -70, -150, 70, 70, 20); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fill();
  for (const [dx, dy] of [[-48, -128], [-22, -104]]) { ellipse(ctx, dx, dy, 14, 14); fillStroke(ctx, '#20202A', '#77708A', 3); }
  if (sticker) drawBow(ctx, 30, 40, 0.6, -0.2);
  ctx.restore();
  drawPaw(ctx, x - 92 * s, y + 60 * s, 34 * s, false, -0.3);
  drawPaw(ctx, x + 92 * s, y + 60 * s, 34 * s, false, 0.3);
}

// Polaroid-style photo card; drawInner(ctx, w, h) draws the picture in local coords.
function polaroid(ctx, x, y, w, h, rot, t, t0, drawInner, caption) {
  if (t < t0) return;
  const k = ease.outBack(seg(t, t0, t0 + 0.35));
  ctx.save();
  ctx.translate(x, y + (1 - k) * 200);
  ctx.rotate(rot * k);
  ctx.scale(lerp(0.6, 1, k), lerp(0.6, 1, k));
  ctx.globalAlpha = clamp(k * 1.5);
  ctx.shadowColor = 'rgba(60,30,70,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
  rrect(ctx, -w / 2 - 22, -h / 2 - 22, w + 44, h + 120, 14);
  ctx.fillStyle = '#FFFDF8'; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.save();
  rrect(ctx, -w / 2, -h / 2, w, h, 6); ctx.clip();
  ctx.translate(-w / 2, -h / 2);
  drawInner(ctx, w, h);
  ctx.restore();
  if (caption) {
    ctx.font = font(40, 600);
    ctx.fillStyle = '#5B4A60'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(caption, 0, h / 2 + 50);
  }
  ctx.restore();
}

// Food emoji chip flying in (used in the "where to eat" montage).
function foodChip(ctx, e, x, y, t, t0, t1, crossed) {
  if (t < t0 || t > t1) return;
  const k = ease.outBack(seg(t, t0, t0 + 0.25));
  const out = seg(t, t1 - 0.2, t1);
  ctx.save();
  ctx.globalAlpha = 1 - out;
  ctx.translate(x, y - out * 40);
  ctx.scale(k, k);
  ellipse(ctx, 0, 0, 78, 78);
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = '#F2A7C3'; ctx.stroke();
  ctx.font = '84px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(e, 0, 6);
  if (crossed && t > t0 + 0.35) {
    const c = ease.outCubic(seg(t, t0 + 0.35, t0 + 0.5));
    ctx.strokeStyle = '#FF6B8B'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-55, -55); ctx.lineTo(-55 + 110 * c, -55 + 110 * c); ctx.stroke();
  }
  ctx.restore();
}

// Fish thought icon (for "what are you thinking about").
function drawSalmon(ctx, x, y, s, rot = 0, bow = false, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  const wig = Math.sin(t * 8) * 0.18;
  ctx.save(); ctx.translate(95, 0); ctx.rotate(wig);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(55, -42); ctx.quadraticCurveTo(40, 0, 55, 42); ctx.closePath();
  fillStroke(ctx, '#FF9F8A', SOFT_OUT, 5);
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(-110, 0);
  ctx.bezierCurveTo(-90, -70, 60, -70, 100, 0);
  ctx.bezierCurveTo(60, 70, -90, 70, -110, 0);
  ctx.closePath();
  fillStroke(ctx, '#FFB49E', SOFT_OUT, 5);
  ctx.save(); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ellipse(ctx, -10, 26, 90, 22); ctx.fill();
  ctx.restore();
  ellipse(ctx, -62, -10, 10, 11); ctx.fillStyle = SOFT_OUT; ctx.fill();
  ellipse(ctx, -65, -14, 3.5, 3.5); ctx.fillStyle = '#fff'; ctx.fill();
  ellipse(ctx, -50, 14, 13, 8); ctx.fillStyle = 'rgba(255,120,150,0.5)'; ctx.fill();
  ctx.beginPath(); ctx.arc(-88, 6, 9, 0.2, Math.PI - 0.2); ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 4; ctx.stroke();
  if (bow) drawBow(ctx, -30, -52, 0.55, -0.3);
  ctx.restore();
}

// Big "inside his head" thought cloud with custom content drawn at its centre.
function bigThought(ctx, cx, cy, w, h, t, t0, t1, from, content) {
  if (t < t0 || t > t1) return;
  const k = ease.outBack(seg(t, t0, t0 + 0.35));
  const out = seg(t, t1 - 0.25, t1);
  ctx.save();
  ctx.globalAlpha = 1 - out;
  if (from) {
    for (let i = 0; i < 3; i++) {
      const f = 0.25 + i * 0.22;
      const px = lerp(from[0], cx, f), py = lerp(from[1], cy + h / 2, f);
      const r = (14 + i * 9) * clamp(k * 1.4 - i * 0.15);
      ellipse(ctx, px, py, r, r * 0.9); fillStroke(ctx, '#fff', UI.bubbleBorder, 5);
    }
  }
  ctx.translate(cx, cy);
  ctx.scale(k, k);
  const bumps = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU;
    bumps.push([Math.cos(a) * w * 0.44, Math.sin(a) * h * 0.4, 90 + 30 * Math.sin(i * 2.1)]);
  }
  ctx.shadowColor = 'rgba(60,30,80,0.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#fff';
  ellipse(ctx, 0, 0, w * 0.46, h * 0.42); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 12; ctx.strokeStyle = UI.bubbleBorder;
  for (const [x, y, r] of bumps) { ellipse(ctx, x, y, r, r * 0.85); ctx.stroke(); }
  for (const [x, y, r] of bumps) { ellipse(ctx, x, y, r, r * 0.85); ctx.fill(); }
  ellipse(ctx, 0, 0, w * 0.46, h * 0.42); ctx.fill();
  ctx.save();
  ellipse(ctx, 0, 0, w * 0.5, h * 0.46); ctx.clip();
  const g = ctx.createRadialGradient(0, 0, 10, 0, 0, w * 0.5);
  g.addColorStop(0, '#EAF4FF'); g.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = g; ctx.fillRect(-w, -h, w * 2, h * 2);
  content(ctx, t);
  ctx.restore();
  ctx.restore();
}

// Instagram-ish "posted" card showing a picture.
function postedCard(ctx, x, y, w, t, t0, t1, drawInner, likes = '1,204') {
  if (t < t0 || t > t1) return;
  const k = ease.outBack(seg(t, t0, t0 + 0.35));
  const h = w * 1.25;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.shadowColor = 'rgba(60,30,80,0.35)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 14;
  rrect(ctx, -w / 2, -h / 2 - 70, w, h + 170, 34);
  ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.shadowColor = 'transparent';
  ellipse(ctx, -w / 2 + 50, -h / 2 - 34, 22, 22); ctx.fillStyle = '#FFB8CC'; ctx.fill();
  ctx.font = font(32, 700); ctx.fillStyle = '#3A2B3F'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('her.page', -w / 2 + 84, -h / 2 - 34);
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
  ctx.translate(-w / 2, -h / 2); drawInner(ctx, w, h); ctx.restore();
  ctx.font = '40px "Noto Color Emoji"'; ctx.fillText('❤️', -w / 2 + 26, h / 2 + 48);
  ctx.font = font(32, 700); ctx.fillStyle = '#3A2B3F';
  ctx.fillText(`${likes} likes`, -w / 2 + 84, h / 2 + 48);
  ctx.restore();
}
