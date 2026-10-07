// Sick-day props for the couch skit: blanket burrito, ice pack, thermometer, tissues, hand bell,
// soup tray, phone search card, the little ghost (soul leaving the body), vacuum cleaner,
// laptop, laundry pile and the polar-bear version of chicken soup (salmon on ice).
'use strict';

// Blanket cocoon around a sitting bear; (x, top) = middle of the collar, bottom = seat level.
function drawBurrito(ctx, x, top, bottom, w, t, o = {}) {
  const col = o.col || '#BFD8FF', dark = o.dark || '#93B6EE';
  const half = w / 2;
  const shape = () => {
    ctx.beginPath();
    ctx.moveTo(x - half * 0.78, top + 10);
    ctx.bezierCurveTo(x - half * 1.08, top + 40, x - half * 1.05, bottom - 40, x - half * 0.92, bottom);
    ctx.lineTo(x + half * 0.92, bottom);
    ctx.bezierCurveTo(x + half * 1.05, bottom - 40, x + half * 1.08, top + 40, x + half * 0.78, top + 10);
    ctx.quadraticCurveTo(x, top + 34, x - half * 0.78, top + 10);
    ctx.closePath();
  };
  shape();
  ctx.fillStyle = vgrad(ctx, top, bottom, [[0, col], [1, dark]]);
  ctx.fill();
  ctx.save(); shape(); ctx.clip();
  // little stars + quilting lines
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let yy = top + 70, r = 0; yy < bottom; yy += 74, r++) for (let xx = x - half + (r % 2) * 40; xx < x + half; xx += 80) sparkle(ctx, xx, yy, 10, 0.3, 'rgba(255,255,255,0.8)');
  ctx.strokeStyle = 'rgba(91,74,96,0.18)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - half * 0.15, top + 40); ctx.quadraticCurveTo(x - half * 0.3, (top + bottom) / 2, x - half * 0.1, bottom); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + half * 0.5, top + 50); ctx.quadraticCurveTo(x + half * 0.35, (top + bottom) / 2, x + half * 0.6, bottom); ctx.stroke();
  ctx.restore();
  shape();
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 5.5; ctx.lineJoin = 'round'; ctx.stroke();
  // rolled collar under the chin
  ctx.beginPath();
  ctx.moveTo(x - half * 0.82, top + 6);
  ctx.quadraticCurveTo(x, top + 52, x + half * 0.82, top + 6);
  ctx.quadraticCurveTo(x + half * 0.9, top + 46, x + half * 0.7, top + 58);
  ctx.quadraticCurveTo(x, top + 92, x - half * 0.7, top + 58);
  ctx.quadraticCurveTo(x - half * 0.9, top + 46, x - half * 0.82, top + 6);
  ctx.closePath();
  fillStroke(ctx, '#E3EEFF', SOFT_OUT, 5);
}

// Folded wet towel / ice pack lying on the forehead (follows head position + tilt).
function drawIcePack(ctx, b, amt = 1) {
  if (amt <= 0) return;
  const [hx, hy] = headWorld(b);
  const g = headGeom(b);
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(b.headTilt || 0);
  ctx.scale(b.s * amt, b.s);
  const y = -g.ry * 0.72;
  rrect(ctx, -g.rx * 0.62, y - 30, g.rx * 1.24, 58, 22);
  fillStroke(ctx, '#D8F0FF', SOFT_OUT, 5);
  ctx.strokeStyle = 'rgba(111,168,245,0.55)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-g.rx * 0.5, y - 8); ctx.lineTo(g.rx * 0.5, y - 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-g.rx * 0.5, y + 10); ctx.lineTo(g.rx * 0.5, y + 10); ctx.stroke();
  sparkle(ctx, g.rx * 0.42, y - 30, 12, 0, '#FFFFFF');
  ctx.restore();
}

// Digital thermometer sticking out of the mouth. side: 1 = to the right, -1 = to the left.
function drawThermometer(ctx, b, text, side = 1, amt = 1) {
  if (amt <= 0) return;
  const [mx, my] = bearMouth(b);
  ctx.save();
  ctx.translate(mx + side * 6 * b.s, my + 8 * b.s);
  ctx.rotate(side * 0.42);
  ctx.scale(side * b.s * amt, b.s * amt);
  rrect(ctx, 0, -9, 150, 18, 9); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  rrect(ctx, 60, -16, 98, 32, 12); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  rrect(ctx, 68, -11, 76, 22, 6); ctx.fillStyle = '#CFF2E2'; ctx.fill();
  ctx.save();
  ctx.translate(106, 1);
  ctx.scale(side, 1);
  ctx.font = font(17, 700); ctx.fillStyle = '#3A5A4A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 1);
  ctx.restore();
  ellipse(ctx, 4, 0, 8, 8); ctx.fillStyle = '#C9C2D6'; ctx.fill();
  ctx.restore();
}

function drawTissue(ctx, x, y, s = 1, rot = 0) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath();
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU;
    const r = 30 * (0.78 + 0.22 * Math.sin(i * 2.7 + 1));
    const px = Math.cos(a) * r * 1.15, py = Math.sin(a) * r * 0.9;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  fillStroke(ctx, '#FFFFFF', 'rgba(91,74,96,0.75)', 3.5);
  ctx.strokeStyle = 'rgba(150,140,170,0.6)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(4, 2); ctx.lineTo(-2, 14); ctx.moveTo(8, -14); ctx.lineTo(16, 0); ctx.stroke();
  ctx.restore();
}

// A pile of used tissues: n tissues spread over a mound.
function tissuePile(ctx, x, y, w, n, seed = 3) {
  const r = mulberry32(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const u = r() * 2 - 1;
    const h = (1 - u * u) * w * 0.32;
    pts.push([x + u * w / 2, y - r() * h, 0.8 + r() * 0.5, r() * 6]);
  }
  pts.sort((a, b) => a[1] - b[1]);
  for (const [px, py, s, rot] of pts) drawTissue(ctx, px, py, s, rot);
}

function drawTissueBox(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -70, -70, 140, 70, 12); fillStroke(ctx, '#FFC9DE', SOFT_OUT, 4.5);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = -2; i <= 2; i++) { heartPath(ctx, i * 26, -28, 7); ctx.fill(); }
  ellipse(ctx, 0, -70, 34, 8); ctx.fillStyle = '#5B4A60'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-26, -70); ctx.quadraticCurveTo(-30, -120, 4, -128); ctx.quadraticCurveTo(10, -100, 26, -70); ctx.closePath();
  fillStroke(ctx, '#FFFFFF', SOFT_OUT, 3.5);
  ctx.restore();
}

function drawHandBell(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -9, -78, 18, 46, 8); fillStroke(ctx, '#C99A86', SOFT_OUT, 4);
  ellipse(ctx, 0, -80, 13, 13); fillStroke(ctx, '#C99A86', SOFT_OUT, 4);
  ctx.beginPath();
  ctx.moveTo(-14, -34); ctx.quadraticCurveTo(-18, -4, -40, 22); ctx.lineTo(40, 22); ctx.quadraticCurveTo(18, -4, 14, -34); ctx.closePath();
  fillStroke(ctx, BRASS, SOFT_OUT, 4.5);
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; rrect(ctx, -14, -24, 8, 34, 4); ctx.fill();
  ellipse(ctx, 0, 28, 10, 10); fillStroke(ctx, BRASS_LIGHT, SOFT_OUT, 3.5);
  ctx.restore();
}

// Bowl seen from the front. kind: 'soup' (warm, steaming) | 'fish' (salmon on ice, frosty).
function drawBowl(ctx, x, y, s, t, kind = 'soup') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'fish') {
    // salmon diving head-first into icy water, tail sticking out + ice cubes
    ctx.save(); ctx.translate(14, -58); ctx.rotate(-1.25 + Math.sin(t * 7) * 0.08);
    drawSalmon(ctx, 0, 0, 0.9, 0, false, t);
    ctx.restore();
    for (const [ix, iy, rot] of [[-62, -44, 0.3], [-30, -56, -0.2], [52, -48, 0.5]]) {
      ctx.save(); ctx.translate(ix, iy); ctx.rotate(rot);
      rrect(ctx, -18, -18, 36, 36, 8); fillStroke(ctx, 'rgba(210,240,255,0.95)', '#78B4E4', 3.5);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillRect(-10, -12, 6, 14);
      ctx.restore();
    }
  }
  // bowl body
  ctx.beginPath();
  ctx.moveTo(-100, -40); ctx.lineTo(100, -40); ctx.quadraticCurveTo(96, 40, 0, 46); ctx.quadraticCurveTo(-96, 40, -100, -40); ctx.closePath();
  fillStroke(ctx, kind === 'fish' ? '#CFE6FF' : '#FFE3B3', SOFT_OUT, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = -2; i <= 2; i++) { heartPath(ctx, i * 34, 2, 8); ctx.fill(); }
  ellipse(ctx, 0, -40, 100, 18); fillStroke(ctx, kind === 'fish' ? '#9ED0F5' : '#F7C26B', SOFT_OUT, 4.5);
  if (kind === 'soup') {
    for (const [cx, cy, c] of [[-40, -42, '#FF9F5A'], [10, -38, '#8CC79F'], [44, -43, '#FFE07A']]) { ellipse(ctx, cx, cy, 12, 6); ctx.fillStyle = c; ctx.fill(); }
  }
  ctx.restore();
  // steam (soup) or cold mist (fish)
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    ctx.globalAlpha = 0.75 * Math.sin(Math.PI * k);
    ctx.beginPath();
    const sx = x + (i - 1) * 40 * s;
    if (kind === 'soup') {
      ctx.moveTo(sx, y - 60 * s - k * 90 * s);
      ctx.quadraticCurveTo(sx + 18 * s, y - 85 * s - k * 90 * s, sx, y - 110 * s - k * 90 * s);
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 9 * s; ctx.lineCap = 'round'; ctx.stroke();
    } else {
      ellipse(ctx, sx, y - 60 * s + k * 30 * s, (22 + k * 30) * s, (14 + k * 16) * s);
      ctx.fillStyle = 'rgba(220,240,255,0.9)'; ctx.fill();
    }
  }
  ctx.restore();
}

function drawSpoon(ctx, x, y, s = 1, rot = 0, full = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -6, -4, 90, 12, 6); fillStroke(ctx, '#F4F1FA', SOFT_OUT, 3.5);
  ellipse(ctx, -16, 2, 24, 16); fillStroke(ctx, '#F4F1FA', SOFT_OUT, 3.5);
  if (full) { ellipse(ctx, -16, 0, 17, 10); ctx.fillStyle = '#FFC46B'; ctx.fill(); }
  ctx.restore();
}

function drawTray(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -170, -14, 340, 30, 14); fillStroke(ctx, '#E8C3AE', SOFT_OUT, 5);
  ctx.restore();
  if (o.bowl !== false) drawBowl(ctx, x - (o.cup === false ? 0 : 50) * s, y - 50 * s, 0.8 * s, t, o.kind || 'soup');
  if (o.cup !== false) drawCupCute(ctx, x + 110 * s, y - 12 * s, 0.85 * s, '#FFB8CC', t);
}

// Big search bar card (screen space), e.g. googling symptoms.
function searchCard(ctx, text, t, t0, t1, y = 700) {
  if (t < t0 || t > t1) return;
  const { s, a } = popScale(t, t0, t1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(W / 2, y);
  ctx.scale(s, s);
  ctx.shadowColor = 'rgba(74,46,79,0.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  rrect(ctx, -420, -64, 840, 128, 64); ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 6; ctx.strokeStyle = '#D9CDE6'; ctx.stroke();
  ctx.font = '54px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🔍', -350, 4);
  // typed letter by letter
  const n = Math.floor(clamp((t - t0 - 0.15) / 0.9) * text.length);
  ctx.font = font(52, 600); ctx.textAlign = 'left'; ctx.fillStyle = UI.bubbleText;
  ctx.fillText(text.slice(0, n), -290, 4);
  if (n < text.length || Math.floor(t * 3) % 2) {
    const w = ctx.measureText(text.slice(0, n)).width;
    ctx.fillStyle = '#6F9CF2'; ctx.fillRect(-286 + w, -28, 5, 60);
  }
  ctx.restore();
}

// The bear's soul floating up: see-through head with a halo and tiny wings.
function drawGhost(ctx, b, x, y, s, t, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  // wavy ghost tail
  ctx.beginPath();
  ctx.moveTo(x - 120 * s, y + 40 * s);
  for (let i = 0; i <= 6; i++) {
    const k = i / 6;
    ctx.quadraticCurveTo(x - 120 * s + (k - 1 / 12) * 240 * s, y + (150 + 26 * Math.sin(t * 9 + i)) * s, x - 120 * s + k * 240 * s, y + 120 * s);
  }
  ctx.lineTo(x + 120 * s, y + 40 * s);
  ctx.closePath();
  fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  // wings
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(x + side * 150 * s, y - 10 * s); ctx.rotate(side * (0.3 + 0.25 * Math.sin(t * 12)));
    ctx.beginPath();
    ctx.ellipse(side * 40 * s, -10 * s, 54 * s, 30 * s, side * -0.4, 0, TAU);
    fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
    ctx.restore();
  }
  const g = bearState(b.who, { x, y, s: s * 0.9, pose: 'head', eyes: 'happy', mouth: 'smile', blush: 0.6, headTilt: Math.sin(t * 3) * 0.12 });
  drawBear(ctx, g, t);
  // halo
  ellipse(ctx, x, y - 170 * s, 70 * s, 18 * s);
  ctx.strokeStyle = '#FFD45E'; ctx.lineWidth = 12 * s; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4 * s; ctx.stroke();
  ctx.restore();
  softGlow(ctx, x, y - 170 * s, 120 * s, '255,230,150', 0.4 * alpha);
}

// Upright vacuum cleaner; (x, y) = floor point under the nozzle, handle grip returned.
function drawVacuum(ctx, x, y, s, t, on = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const buzz = on ? Math.sin(t * 60) * 1.2 : 0;
  ctx.translate(buzz, 0);
  // nozzle on the floor
  rrect(ctx, -90, -40, 180, 40, 16); fillStroke(ctx, '#B8DBFF', SOFT_OUT, 5);
  ellipse(ctx, -60, -2, 14, 10); ctx.fillStyle = SOFT_OUT; ctx.fill();
  ellipse(ctx, 60, -2, 14, 10); ctx.fill();
  // body
  ctx.save(); ctx.rotate(0.28);
  rrect(ctx, -46, -260, 92, 210, 40); fillStroke(ctx, '#FFB8CC', SOFT_OUT, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; rrect(ctx, -30, -240, 16, 150, 8); ctx.fill();
  ellipse(ctx, 0, -150, 24, 24); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  heartPath(ctx, 0, -146, 12); ctx.fillStyle = '#FF7FB0'; ctx.fill();
  // stick + handle
  rrect(ctx, -8, -420, 16, 170, 8); fillStroke(ctx, '#D9D3E6', SOFT_OUT, 4);
  rrect(ctx, -30, -440, 60, 30, 14); fillStroke(ctx, '#B58CE8', SOFT_OUT, 4.5);
  ctx.restore();
  ctx.restore();
  const a = 0.28;
  return [x + buzz * s + Math.sin(a) * 425 * s, y - Math.cos(a) * 425 * s];
}

// Laptop on a lap, seen from behind the lid.
function drawLaptopBack(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -130, -10, 260, 20, 8); fillStroke(ctx, '#D9D3E6', SOFT_OUT, 4.5);
  rrect(ctx, -120, -175, 240, 168, 18); fillStroke(ctx, '#E9E2F5', SOFT_OUT, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; rrect(ctx, -104, -160, 26, 110, 10); ctx.fill();
  heartPath(ctx, 0, -86, 26); ctx.fillStyle = '#FF9EC4'; ctx.fill();
  drawBow(ctx, 70, -140, 0.38, 0.3);
  ctx.restore();
}

function drawLaundryPile(ctx, x, y, s = 1) {
  const cols = ['#FFC9DE', '#BFE3D3', '#C9B5F2', '#FFE3A3', '#B8DBFF', '#FFB8CC'];
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < cols.length; i++) {
    const w = 150 - (i % 2) * 14, yy = -i * 34;
    rrect(ctx, -w / 2 + Math.sin(i * 2.3) * 8, yy - 34, w, 34, 10);
    fillStroke(ctx, cols[i], SOFT_OUT, 4);
    ctx.strokeStyle = 'rgba(91,74,96,0.25)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-w / 2 + 16 + Math.sin(i * 2.3) * 8, yy - 17); ctx.lineTo(w / 2 - 16 + Math.sin(i * 2.3) * 8, yy - 17); ctx.stroke();
  }
  ctx.restore();
}

// Sneeze: cartoon cloud burst + droplets + speed lines in direction dir (1 right, -1 left).
function sneezePuff(ctx, x, y, t, t0, dir = 1) {
  const k = (t - t0) / 0.75;
  if (k < 0 || k > 1) return;
  ctx.save();
  ctx.globalAlpha = 1 - ease.inQuad(k);
  const r = mulberry32(21);
  const blobs = [];
  for (let i = 0; i < 8; i++) {
    const a = (r() - 0.5) * 1.1;
    const d = (30 + r() * 210) * ease.outCubic(k);
    const rr = (34 + r() * 30) * (0.6 + k * 0.6);
    blobs.push([x + dir * Math.cos(a) * d, y + Math.sin(a) * d * 0.8, rr]);
  }
  ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(91,74,96,0.55)';
  for (const [px, py, rr] of blobs) { ellipse(ctx, px, py, rr, rr * 0.85); ctx.stroke(); }
  ctx.fillStyle = '#F4FAFF';
  for (const [px, py, rr] of blobs) { ellipse(ctx, px, py, rr, rr * 0.85); ctx.fill(); }
  ctx.fillStyle = 'rgba(190,220,255,0.55)';
  for (const [px, py, rr] of blobs) { ellipse(ctx, px + rr * 0.15, py + rr * 0.25, rr * 0.6, rr * 0.4); ctx.fill(); }
  // speed lines
  ctx.strokeStyle = 'rgba(91,74,96,0.6)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const yy = y - 50 + i * 34, x0 = x + dir * (30 + 120 * k), len = 60 + 40 * (i % 2);
    ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + dir * len, yy + (i - 1.5) * 8); ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const a = (r() - 0.5) * 1.6, d = (80 + r() * 220) * k;
    ellipse(ctx, x + dir * Math.cos(a) * d, y + Math.sin(a) * d + 60 * k * k, 7, 8);
    fillStroke(ctx, '#BFE3FF', '#5E9AD6', 2);
  }
  ctx.restore();
}

// Notification bubbles popping out of something (laptop / phone).
function notifPops(ctx, x, y, t, times, icons = ['📧', '💬', '📅', '🔔']) {
  times.forEach((t0, i) => {
    const k = (t - t0) / 1.0;
    if (k < 0 || k > 1) return;
    const { s } = popScale(t, t0, t0 + 1.0, 0.25);
    ctx.save();
    ctx.globalAlpha = 1 - ease.inQuad(k);
    ctx.translate(x + ((i * 53) % 120) - 60, y - 40 - k * 120);
    ctx.scale(s, s);
    rrect(ctx, -38, -38, 76, 76, 22); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
    ctx.font = '46px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(icons[i % icons.length], 0, 3);
    ellipse(ctx, 30, -30, 13, 13); ctx.fillStyle = '#FF5F7E'; ctx.fill();
    ctx.restore();
  });
}
