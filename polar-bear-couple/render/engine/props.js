// Sets and props. Every set is drawn in world coordinates of a 1080x1920 frame.
'use strict';

const OUT = '#333A47';

function vgrad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([k, c]) => g.addColorStop(k, c));
  return g;
}

function woodFloor(ctx, y0, base = '#C7976A', line = 'rgba(110,70,40,0.35)') {
  ctx.fillStyle = base;
  ctx.fillRect(-400, y0, W + 800, H - y0 + 800);
  ctx.strokeStyle = line;
  ctx.lineWidth = 4;
  const r = mulberry32(9);
  for (let y = y0 + 70, row = 0; y < H + 400; y += 78, row++) {
    ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); ctx.stroke();
    for (let x = -400 + (row % 2) * 180 + r() * 60; x < W + 400; x += 360) {
      ctx.beginPath(); ctx.moveTo(x, y - 78); ctx.lineTo(x, y); ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(-400, y0, W + 800, 16);
}

function windowFrame(ctx, x, y, w, h, t, o = {}) {
  // sky
  rrect(ctx, x, y, w, h, 14);
  ctx.fillStyle = o.night
    ? vgrad(ctx, y, y + h, [[0, '#1B2350'], [1, '#4B3C7A']])
    : vgrad(ctx, y, y + h, [[0, '#7EC8F8'], [1, '#CDEBFF']]);
  ctx.fill();
  ctx.save();
  rrect(ctx, x, y, w, h, 14);
  ctx.clip();
  if (o.night) {
    const r = mulberry32(5);
    for (let i = 0; i < 26; i++) {
      const sx = x + r() * w, sy = y + r() * h;
      const tw = 0.5 + 0.5 * Math.sin(t * (2 + r() * 3) + i);
      sparkle(ctx, sx, sy, 4 + 7 * tw, 0, `rgba(255,250,210,${0.4 + 0.6 * tw})`);
    }
    // crescent moon
    const mx = x + w * 0.68, my = y + h * 0.3;
    ellipse(ctx, mx, my, 46, 46);
    ctx.fillStyle = '#FFF4C2'; ctx.fill();
    ellipse(ctx, mx + 22, my - 12, 42, 42);
    ctx.fillStyle = '#26285A'; ctx.fill();
  } else {
    // clouds
    for (const [cx, cy, s] of [[x + w * 0.3 + (t * 8) % 60, y + h * 0.3, 1], [x + w * 0.75, y + h * 0.62, 0.8]]) {
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      for (const [dx, dy, r] of [[-40, 0, 30], [0, -16, 40], [40, 0, 30], [0, 10, 34]]) {
        ellipse(ctx, cx + dx * s, cy + dy * s, r * s, r * s * 0.9); ctx.fill();
      }
    }
  }
  if (o.snow) {
    const r = mulberry32(17);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 40; i++) {
      const sx = x + ((r() * w + Math.sin(t + i) * 20) % w);
      const sy = y + ((r() * h + t * (60 + r() * 60)) % h);
      ellipse(ctx, sx, sy, 4 + r() * 4, 4 + r() * 4); ctx.fill();
    }
    // snow piled up on the sill
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    for (let i = 0; i <= 10; i++) ctx.lineTo(x + (i / 10) * w, y + h - 16 - 8 * Math.sin(i * 1.7));
    ctx.lineTo(x + w, y + h);
    ctx.fillStyle = '#fff'; ctx.fill();
  }
  ctx.restore();
  // frame + cross bars
  ctx.lineWidth = 16;
  ctx.strokeStyle = o.frame || '#FFFFFF';
  rrect(ctx, x, y, w, h, 14); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
  ctx.lineWidth = 10; ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - 8, y - 8, w + 16, h + 16, 18); ctx.stroke();
  // sill
  rrect(ctx, x - 26, y + h + 4, w + 52, 24, 8);
  ctx.fillStyle = o.frame || '#FFFFFF'; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.stroke();
  // curtains
  if (o.curtains) {
    for (const side of [-1, 1]) {
      const cx = side < 0 ? x - 30 : x + w + 30;
      ctx.beginPath();
      ctx.moveTo(cx - 50, y - 40);
      ctx.lineTo(cx + 50, y - 40);
      ctx.quadraticCurveTo(cx + 30 - side * 30, y + h * 0.5, cx + 60 * -side + 50, y + h + 60);
      ctx.lineTo(cx - 60, y + h + 60);
      ctx.quadraticCurveTo(cx - 40, y + h * 0.5, cx - 50, y - 40);
      ctx.closePath();
      fillStroke(ctx, o.curtains, 'rgba(0,0,0,0.25)', 4);
    }
    rrect(ctx, x - 110, y - 56, w + 220, 22, 11);
    ctx.fillStyle = '#8A5A3B'; ctx.fill();
  }
}

function pictureFrame(ctx, x, y, w, h, drawInner, frame = '#8A5A3B') {
  rrect(ctx, x, y, w, h, 10);
  fillStroke(ctx, frame, 'rgba(0,0,0,0.3)', 4);
  rrect(ctx, x + 16, y + 16, w - 32, h - 32, 6);
  ctx.fillStyle = '#FFF8EC'; ctx.fill();
  ctx.save();
  rrect(ctx, x + 16, y + 16, w - 32, h - 32, 6);
  ctx.clip();
  drawInner(x + 16, y + 16, w - 32, h - 32);
  ctx.restore();
}

// Tiny doodle of the two bears for picture frames.
function miniCouple(ctx, x, y, w, h) {
  ctx.fillStyle = '#DDEBFF';
  ctx.fillRect(x, y, w, h);
  for (const [cx, bow] of [[x + w * 0.33, false], [x + w * 0.67, true]]) {
    const cy = y + h * 0.62, r = w * 0.17;
    ellipse(ctx, cx - r * 0.7, cy - r * 0.8, r * 0.3, r * 0.3); fillStroke(ctx, '#fff', OUT, 2.5);
    ellipse(ctx, cx + r * 0.7, cy - r * 0.8, r * 0.3, r * 0.3); fillStroke(ctx, '#fff', OUT, 2.5);
    ellipse(ctx, cx, cy, r, r * 0.9); fillStroke(ctx, '#fff', OUT, 2.5);
    ctx.fillStyle = OUT;
    ellipse(ctx, cx - r * 0.35, cy - r * 0.1, 2.6, 3.2); ctx.fill();
    ellipse(ctx, cx + r * 0.35, cy - r * 0.1, 2.6, 3.2); ctx.fill();
    ellipse(ctx, cx, cy + r * 0.25, 5, 3.5); ctx.fill();
    if (bow) { ctx.fillStyle = PAL.bow; ellipse(ctx, cx + r * 0.55, cy - r * 0.95, 8, 6); ctx.fill(); }
  }
  heartPath(ctx, x + w / 2, y + h * 0.25, 14);
  ctx.fillStyle = '#FF5D7E'; ctx.fill();
}

// ---------- bedroom (camera looks at the bed from its foot end) ----------
const BED = { x0: 110, x1: 970, headTop: 740, blanketTop: 1075, foot: 1420 };
const BED_SPOTS = { him: [345, 990], her: [735, 990] };

function drawBedroomBack(ctx, t, o = {}) {
  // wall
  ctx.fillStyle = vgrad(ctx, 0, 1500, [[0, '#A9B5E6'], [1, '#C9C2EC']]);
  ctx.fillRect(-400, -400, W + 800, 1900);
  // soft wallpaper dots
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (let y = 40; y < 1500; y += 90) for (let x = (y / 90) % 2 ? 0 : 45; x < W; x += 90) { ellipse(ctx, x, y, 7, 7); ctx.fill(); }
  windowFrame(ctx, 70, 420, 270, 270, t, { night: o.night !== false, curtains: '#F1A7C1', frame: '#F8F4FF' });
  pictureFrame(ctx, 770, 470, 200, 170, (x, y, w, h) => miniCouple(ctx, x, y, w, h));
  woodFloor(ctx, 1390, '#B98A60');
  // rug peeking out at the bottom
  ellipse(ctx, W / 2, 1640, 560, 120);
  ctx.fillStyle = '#E98FA8'; ctx.fill();
  ellipse(ctx, W / 2, 1640, 500, 92);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 8; ctx.setLineDash([22, 16]); ctx.stroke(); ctx.setLineDash([]);

  // headboard
  ctx.beginPath();
  ctx.moveTo(BED.x0 + 10, 1110);
  ctx.lineTo(BED.x0 + 10, BED.headTop + 70);
  ctx.quadraticCurveTo(BED.x0 + 10, BED.headTop, BED.x0 + 90, BED.headTop);
  ctx.lineTo(BED.x1 - 90, BED.headTop);
  ctx.quadraticCurveTo(BED.x1 - 10, BED.headTop, BED.x1 - 10, BED.headTop + 70);
  ctx.lineTo(BED.x1 - 10, 1110);
  ctx.closePath();
  fillStroke(ctx, '#9C6A47', OUT, 6);
  rrect(ctx, BED.x0 + 50, BED.headTop + 40, BED.x1 - BED.x0 - 100, 240, 40);
  fillStroke(ctx, '#B98159', 'rgba(60,30,10,0.35)', 4);
  // tufted buttons
  ctx.fillStyle = 'rgba(80,45,20,0.45)';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { ellipse(ctx, BED.x0 + 130 + i * 116, BED.headTop + 110 + j * 110, 7, 7); ctx.fill(); }

  // nightstands
  for (const [x, w] of [[-60, 180], [960, 180]]) {
    rrect(ctx, x, 1110, w, 300, 12);
    fillStroke(ctx, '#C48D62', OUT, 6);
    rrect(ctx, x + 18, 1190, w - 36, 90, 8);
    fillStroke(ctx, '#D7A47A', 'rgba(60,30,10,0.4)', 4);
    ellipse(ctx, x + w / 2, 1235, 9, 9); ctx.fillStyle = '#7A4E2E'; ctx.fill();
  }
  // lamp (right)
  const lampOn = o.lamp == null ? 1 : o.lamp;
  rrect(ctx, 1010, 1060, 50, 52, 10); fillStroke(ctx, '#E9D7C0', OUT, 5);
  ctx.beginPath();
  ctx.moveTo(985, 1060); ctx.lineTo(1085, 1060); ctx.lineTo(1065, 950); ctx.lineTo(1005, 950); ctx.closePath();
  fillStroke(ctx, lampOn > 0.5 ? '#FFE7A3' : '#E8D9B8', OUT, 5);
  // alarm clock (left)
  const clk = o.clock || '11:02';
  rrect(ctx, -6, 1020, 118, 92, 16); fillStroke(ctx, '#3A3F52', OUT, 5);
  rrect(ctx, 4, 1034, 98, 58, 8); ctx.fillStyle = '#0F1322'; ctx.fill();
  ctx.font = font(clk.length > 4 ? 34 : 38, 800);
  ctx.fillStyle = '#FF5A5A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(clk, 53, 1064);

  // pillows
  for (const [who, [px, py]] of Object.entries(BED_SPOTS)) {
    rrect(ctx, px - 180, py - 80, 360, 160, 64);
    fillStroke(ctx, who === 'him' ? '#DCE8FF' : '#FFE0EC', OUT, 6);
    ctx.beginPath();
    ctx.moveTo(px - 130, py - 52); ctx.quadraticCurveTo(px, py - 34, px + 130, py - 52);
    ctx.strokeStyle = 'rgba(51,58,71,0.2)'; ctx.lineWidth = 4; ctx.stroke();
  }
  // mattress / bed sheet
  rrect(ctx, BED.x0 - 10, 1080, BED.x1 - BED.x0 + 20, BED.foot - 1020, 30);
  fillStroke(ctx, '#F4F1EA', OUT, 6);
}

// Blanket covering the bodies; humps follow who is in bed. o.pulled: blanket slides to her side.
function drawBlanket(ctx, t, o = {}) {
  const top = BED.blanketTop;
  const pull = o.pulled || 0;
  const x0 = BED.x0 + pull * 360;
  const x1 = BED.x1;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, top + 20);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.25), top - 18, lerp(x0, x1, 0.5), top + 6);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.75), top - 18, x1, top + 20);
  ctx.lineTo(x1 + 30, BED.foot);
  ctx.lineTo(x0 - 30, BED.foot);
  ctx.closePath();
  const quilt = o.color || '#F2B36B';
  ctx.fillStyle = quilt;
  ctx.fill();
  ctx.save();
  ctx.clip();
  // quilt stitching
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 12]);
  for (let i = -6; i < 12; i++) {
    ctx.beginPath(); ctx.moveTo(BED.x0 + i * 110, top); ctx.lineTo(BED.x0 + i * 110 + 520, BED.foot); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(BED.x1 - i * 110, top); ctx.lineTo(BED.x1 - i * 110 - 520, BED.foot); ctx.stroke();
  }
  ctx.setLineDash([]);
  // body humps
  for (const hx of o.humps || []) {
    const g = ctx.createLinearGradient(hx - 170, 0, hx + 170, 0);
    g.addColorStop(0, 'rgba(0,0,30,0.18)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.12)');
    g.addColorStop(0.65, 'rgba(255,255,255,0.08)');
    g.addColorStop(1, 'rgba(0,0,30,0.2)');
    ctx.fillStyle = g;
    ctx.fillRect(hx - 170, top, 340, BED.foot - top);
  }
  ctx.restore();
  // sheet fold at the top
  ctx.beginPath();
  ctx.moveTo(x0, top + 20);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.25), top - 18, lerp(x0, x1, 0.5), top + 6);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.75), top - 18, x1, top + 20);
  ctx.lineTo(x1 + 4, top + 74);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.5), top + 56, x0 - 4, top + 74);
  ctx.closePath();
  fillStroke(ctx, '#FFFFFF', OUT, 6);
  ctx.beginPath();
  ctx.moveTo(x0, top + 20);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.25), top - 18, lerp(x0, x1, 0.5), top + 6);
  ctx.quadraticCurveTo(lerp(x0, x1, 0.75), top - 18, x1, top + 20);
  ctx.lineTo(x1 + 30, BED.foot);
  ctx.lineTo(x0 - 30, BED.foot);
  ctx.closePath();
  ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
  // feet bumps at the end of the bed
  for (const hx of o.humps || []) {
    for (const s of [-1, 1]) {
      const wig = o.wiggle ? Math.sin(t * 12 + s) * 6 : 0;
      ellipse(ctx, hx + s * 50, BED.foot - 40 + wig, 46, 30);
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fill();
    }
  }
  // footboard
  rrect(ctx, BED.x0 - 30, BED.foot - 10, BED.x1 - BED.x0 + 60, 110, 26);
  fillStroke(ctx, '#9C6A47', OUT, 6);
  rrect(ctx, BED.x0 + 10, BED.foot + 14, BED.x1 - BED.x0 - 20, 60, 18);
  fillStroke(ctx, '#B98159', 'rgba(60,30,10,0.35)', 4);
  ctx.restore();
}

// Bear lying on his back under the blanket, seen from the foot of the bed (body only).
function drawLyingBody(ctx, x, top, s = 1) {
  ctx.save();
  ctx.translate(x, top);
  ctx.scale(s, s);
  for (const side of [-1, 1]) {
    ellipse(ctx, side * 70, 390, 52, 38);
    fillStroke(ctx, PAL.fur, PAL.out, LW);
  }
  furFill(ctx, () => bodyShape(ctx, 0, 190, 170, 215), [-14, -16]);
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 150, 140);
    ctx.rotate(side * -0.15);
    ellipse(ctx, 0, 0, 44, 105);
    fillStroke(ctx, PAL.fur, PAL.out, LW);
    ctx.restore();
  }
  ellipse(ctx, 0, 215, 105, 135);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
  ctx.restore();
}

// Pink throw pillow (for pillow fights).
function drawThrowPillow(ctx, x, y, s, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-110, -70);
  ctx.quadraticCurveTo(0, -50, 110, -70);
  ctx.quadraticCurveTo(90, 0, 110, 70);
  ctx.quadraticCurveTo(0, 50, -110, 70);
  ctx.quadraticCurveTo(-90, 0, -110, -70);
  ctx.closePath();
  fillStroke(ctx, '#FFC2D8', PAL.out, LW);
  heartPath(ctx, 0, 8, 26);
  ctx.fillStyle = '#FF6FA8';
  ctx.fill();
  ctx.restore();
}

// Feathers bursting out of a pillow hit.
function feathers(ctx, x, y, t, t0, n = 10) {
  const k = t - t0;
  if (k < 0 || k > 2.2) return;
  const r = mulberry32(31);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, sp = 220 + r() * 260;
    const px = x + Math.cos(a) * sp * Math.min(k, 0.35) + Math.sin(k * 3 + i) * 30 * k;
    const py = y + Math.sin(a) * sp * Math.min(k, 0.35) + 90 * k * k;
    ctx.globalAlpha = 1 - seg(k, 1.4, 2.2);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(a + k * 2);
    ellipse(ctx, 0, 0, 18, 7);
    fillStroke(ctx, '#ffffff', 'rgba(51,58,71,0.6)', 2.5);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- phone ----------
function drawPhone(ctx, x, y, s, rot, screen = '#9FD0FF', t = 0, content = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  rrect(ctx, -46, -84, 92, 168, 18);
  fillStroke(ctx, '#2B2F3A', OUT, 5);
  rrect(ctx, -38, -72, 76, 144, 10);
  ctx.fillStyle = screen;
  ctx.fill();
  if (content) content(ctx, t);
  ctx.restore();
}

// ---------- kitchen / dining ----------
const TABLE_Y = 1290;
function drawKitchen(ctx, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, 0, 1500, [[0, '#BFE6D3'], [1, '#D9F0E3']]);
  ctx.fillRect(-400, -400, W + 800, 2000);
  // wallpaper stripes
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let x = -400; x < W + 400; x += 80) ctx.fillRect(x, -400, 34, 1900);
  windowFrame(ctx, 90, 520, 300, 300, t, { night: !!o.night, curtains: '#FFD27A', frame: '#FFFFFF' });
  // shelf with jars
  rrect(ctx, 650, 700, 340, 22, 6); fillStroke(ctx, '#A8744E', OUT, 5);
  const jars = [[690, '#FFB3B3', 70], [770, '#FFE08A', 90], [850, '#B8E0FF', 60], [930, '#C9F2C2', 80]];
  for (const [jx, c, h] of jars) {
    rrect(ctx, jx - 28, 700 - h, 56, h, 12); fillStroke(ctx, c, OUT, 5);
    rrect(ctx, jx - 31, 700 - h - 12, 62, 16, 5); fillStroke(ctx, '#E9E2D6', OUT, 4);
  }
  // pendant lamp
  ctx.beginPath(); ctx.moveTo(540, -50); ctx.lineTo(540, 560); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(470, 640); ctx.quadraticCurveTo(540, 520, 610, 640); ctx.closePath();
  fillStroke(ctx, '#FF8E72', OUT, 6);
  ellipse(ctx, 540, 645, 26, 14); ctx.fillStyle = '#FFF3B0'; ctx.fill();
  glow(ctx, 540, 660, 260, '255,236,170', 0.35);
  woodFloor(ctx, 1500, '#C9A27A');
  // chairs behind the table
  for (const cx of o.chairs || [330, 750]) {
    rrect(ctx, cx - 150, 900, 300, 420, 50);
    fillStroke(ctx, '#E59A5C', OUT, 6);
    rrect(ctx, cx - 110, 940, 220, 200, 40);
    fillStroke(ctx, '#F0B47F', 'rgba(80,40,10,0.3)', 4);
  }
}

function drawTable(ctx, t) {
  // checkered tablecloth seen from the front
  const top = TABLE_Y, front = 1350, bottom = 1640;
  ctx.beginPath();
  ctx.moveTo(-40, top);
  ctx.lineTo(W + 40, top);
  ctx.lineTo(W + 40, front);
  ctx.lineTo(-40, front);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(255,92,120,0.55)';
  for (let x = -40, i = 0; x < W + 40; x += 60, i++) {
    for (let y = top, j = 0; y < front; y += 20, j++) if ((i + j) % 2) ctx.fillRect(x, y, 60, 20);
  }
  ctx.restore();
  ctx.strokeStyle = OUT; ctx.lineWidth = 6;
  ctx.strokeRect(-40, top, W + 80, front - top);
  // hanging front with scalloped hem
  ctx.beginPath();
  ctx.moveTo(-40, front);
  ctx.lineTo(W + 40, front);
  ctx.lineTo(W + 40, bottom);
  for (let x = W + 40; x > -40; x -= 90) ctx.quadraticCurveTo(x - 45, bottom + 34, x - 90, bottom);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(255,92,120,0.6)';
  for (let x = -40, i = 0; x < W + 40; x += 70, i++) {
    for (let y = front, j = 0; y < bottom + 40; y += 70, j++) if ((i + j) % 2) ctx.fillRect(x, y, 70, 70);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(-40, front, W + 80, 30);
  ctx.restore();
  ctx.stroke();
}

function drawFish(ctx, x, y, s, eaten = 0, rot = 0) {
  // grilled fish on its side; eaten (0..1) removes it from the head end, leaving bones
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  // bones visible where eaten
  if (eaten > 0) {
    ctx.strokeStyle = '#E9E4D8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(80, 0); ctx.stroke();
    for (let i = -90; i < 70; i += 22) { ctx.beginPath(); ctx.moveTo(i, -26); ctx.lineTo(i + 8, 0); ctx.lineTo(i, 26); ctx.stroke(); }
  }
  ctx.save();
  if (eaten > 0) { ctx.beginPath(); ctx.rect(-130 + eaten * 210, -80, 400, 160); ctx.clip(); }
  // body
  ctx.beginPath();
  ctx.moveTo(-120, 0);
  ctx.quadraticCurveTo(-60, -62, 40, -40);
  ctx.quadraticCurveTo(80, -30, 92, 0);
  ctx.quadraticCurveTo(80, 30, 40, 40);
  ctx.quadraticCurveTo(-60, 62, -120, 0);
  ctx.closePath();
  fillStroke(ctx, '#E9A25A', OUT, 5);
  // grill marks
  ctx.save(); ctx.clip();
  ctx.strokeStyle = 'rgba(110,50,10,0.55)'; ctx.lineWidth = 9;
  for (let i = -80; i < 80; i += 34) { ctx.beginPath(); ctx.moveTo(i, -60); ctx.lineTo(i + 30, 60); ctx.stroke(); }
  ctx.restore();
  // eye
  if (eaten < 0.05) {
    ellipse(ctx, -82, -8, 9, 9); fillStroke(ctx, '#fff', OUT, 3);
    ellipse(ctx, -80, -8, 4, 4); ctx.fillStyle = OUT; ctx.fill();
  }
  ctx.restore();
  // tail always stays
  ctx.beginPath();
  ctx.moveTo(86, 0); ctx.lineTo(140, -40); ctx.quadraticCurveTo(126, 0, 140, 40); ctx.closePath();
  fillStroke(ctx, '#D98C45', OUT, 5);
  ctx.restore();
}

function drawPlate(ctx, x, y, s = 1) {
  ellipse(ctx, x, y, 190 * s, 56 * s);
  fillStroke(ctx, '#FFFFFF', OUT, 6);
  ellipse(ctx, x, y, 140 * s, 38 * s);
  ctx.strokeStyle = 'rgba(51,58,71,0.2)'; ctx.lineWidth = 4; ctx.stroke();
}

function drawFries(ctx, x, y, s, left = 1, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // fries sticking out
  const n = Math.round(9 * left);
  const r = mulberry32(77);
  for (let i = 0; i < 9; i++) {
    const fx = -44 + i * 11 + (r() - 0.5) * 6, h = 70 + r() * 40, rot = (r() - 0.5) * 0.3;
    if (i >= n) continue;
    ctx.save();
    ctx.translate(fx, -40);
    ctx.rotate(rot);
    rrect(ctx, -7, -h, 14, h + 20, 4);
    fillStroke(ctx, '#FFD25A', OUT, 3.5);
    ctx.restore();
  }
  // carton
  ctx.beginPath();
  ctx.moveTo(-62, -60); ctx.lineTo(62, -60); ctx.lineTo(48, 50); ctx.lineTo(-48, 50); ctx.closePath();
  fillStroke(ctx, '#FF5A4E', OUT, 5);
  ctx.beginPath(); ctx.moveTo(-62, -60); ctx.quadraticCurveTo(0, -30, 62, -60);
  ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
  heartPath(ctx, 0, 0, 16); ctx.fillStyle = '#FFE066'; ctx.fill();
  ctx.restore();
}

function drawGlass(ctx, x, y, s = 1, fill = 0.7) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-34, -90); ctx.lineTo(34, -90); ctx.lineTo(26, 0); ctx.lineTo(-26, 0); ctx.closePath();
  ctx.fillStyle = 'rgba(220,240,255,0.6)'; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = '#FF9F43';
  ctx.fillRect(-40, -90 * fill, 80, 90 * fill);
  ctx.restore();
  ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -90); ctx.lineTo(30, -140); ctx.strokeStyle = '#FF5D8F'; ctx.lineWidth = 8; ctx.stroke();
  ctx.restore();
}

// ---------- living room ----------
const THERMO = { x: 720, y: 1030, r: 100 };
function drawLivingRoom(ctx, t, o = {}) {
  const warm = o.warm || 0; // -1 cold .. +1 hot tint of the wall
  ctx.fillStyle = vgrad(ctx, 0, 1500, [[0, '#C3DCEF'], [1, '#DCEAF5']]);
  ctx.fillRect(-400, -400, W + 800, 2000);
  if (warm > 0) { ctx.fillStyle = `rgba(255,120,60,${0.35 * warm})`; ctx.fillRect(-400, -400, W + 800, 2000); }
  if (warm < 0) { ctx.fillStyle = `rgba(90,170,255,${0.35 * -warm})`; ctx.fillRect(-400, -400, W + 800, 2000); }
  // wainscoting
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillRect(-400, 1180, W + 800, 320);
  ctx.strokeStyle = 'rgba(80,100,130,0.25)'; ctx.lineWidth = 4;
  for (let x = -380; x < W + 400; x += 160) { rrect(ctx, x, 1210, 120, 250, 10); ctx.stroke(); }
  windowFrame(ctx, 90, 560, 360, 340, t, { night: false, snow: true, curtains: '#F6C35B', frame: '#FFFFFF' });
  pictureFrame(ctx, 870, 600, 150, 190, (x, y, w, h) => miniCouple(ctx, x, y, w, h), '#6B8FB5');
  drawThermostat(ctx, THERMO.x, THERMO.y, o.dial == null ? 0.5 : o.dial, t, o.broken || 0);
  woodFloor(ctx, 1500, '#C69C72');
  ellipse(ctx, W / 2, 1760, 520, 130); ctx.fillStyle = '#F2D06B'; ctx.fill();
  ellipse(ctx, W / 2, 1760, 460, 100); ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 8; ctx.stroke();
  // plant
  rrect(ctx, 960, 1330, 100, 150, 18); fillStroke(ctx, '#E07A5F', OUT, 5);
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.translate(1010, 1335);
    ctx.rotate(-1.1 + i * 0.44);
    ellipse(ctx, 0, -90, 28, 80);
    fillStroke(ctx, i % 2 ? '#5DBB7A' : '#4AA368', OUT, 4);
    ctx.restore();
  }
}

function drawThermostat(ctx, x, y, dial, t, broken = 0) {
  // dial 0 = max cold, 1 = max hot
  ctx.save();
  ctx.translate(x, y);
  if (broken > 0) ctx.rotate(0.3 * broken);
  ellipse(ctx, 0, 0, THERMO.r, THERMO.r);
  fillStroke(ctx, '#F7F8FA', OUT, 7);
  // colour arc
  const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
  const N = 40;
  for (let i = 0; i < N; i++) {
    const k = i / N;
    ctx.beginPath();
    ctx.arc(0, 0, THERMO.r - 22, lerp(a0, a1, k), lerp(a0, a1, k + 1 / N) + 0.01);
    const c = k < 0.5 ? `rgb(${lerp(70, 245, k * 2)},${lerp(150, 230, k * 2)},${lerp(255, 120, k * 2)})` : `rgb(255,${lerp(230, 70, (k - 0.5) * 2)},${lerp(120, 50, (k - 0.5) * 2)})`;
    ctx.strokeStyle = c;
    ctx.lineWidth = 18;
    ctx.stroke();
  }
  ctx.font = '34px "Noto Color Emoji"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('❄️', Math.cos(a0) * (THERMO.r + 34), Math.sin(a0) * (THERMO.r + 34));
  ctx.fillText('🔥', Math.cos(a1) * (THERMO.r + 34), Math.sin(a1) * (THERMO.r + 34));
  // needle
  if (broken < 0.5) {
    const a = lerp(a0, a1, clamp(dial));
    ctx.beginPath();
    ctx.moveTo(Math.cos(a + Math.PI / 2) * 9, Math.sin(a + Math.PI / 2) * 9);
    ctx.lineTo(Math.cos(a) * (THERMO.r - 36), Math.sin(a) * (THERMO.r - 36));
    ctx.lineTo(Math.cos(a - Math.PI / 2) * 9, Math.sin(a - Math.PI / 2) * 9);
    ctx.closePath();
    ctx.fillStyle = OUT; ctx.fill();
  }
  ellipse(ctx, 0, 0, 22, 22); fillStroke(ctx, '#C9D2DE', OUT, 5);
  if (broken > 0) {
    ctx.strokeStyle = OUT; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-60, -70); ctx.lineTo(-20, -20); ctx.lineTo(-40, 10); ctx.lineTo(10, 60); ctx.stroke();
  }
  ctx.restore();
}

function drawCouch(ctx, x, y, w, o = {}) {
  // back
  rrect(ctx, x - w / 2, y - 330, w, 300, 70);
  fillStroke(ctx, o.color || '#F08E7C', OUT, 6);
  // back cushions
  for (let i = 0; i < 2; i++) {
    rrect(ctx, x - w / 2 + 50 + i * (w / 2 - 40), y - 300, w / 2 - 70, 220, 50);
    fillStroke(ctx, o.light || '#F6A897', 'rgba(80,20,10,0.25)', 4);
  }
}
function drawCouchFront(ctx, x, y, w, o = {}) {
  // seat front + arms (drawn after the bears so they sit "in" the couch)
  rrect(ctx, x - w / 2 + 40, y - 70, w - 80, 150, 30);
  fillStroke(ctx, o.light || '#F6A897', OUT, 6);
  for (const side of [-1, 1]) {
    rrect(ctx, x + side * (w / 2) - (side > 0 ? 110 : 0), y - 220, 110, 300, 50);
    fillStroke(ctx, o.color || '#F08E7C', OUT, 6);
  }
  rrect(ctx, x - w / 2 + 20, y + 60, w - 40, 60, 20);
  fillStroke(ctx, o.dark || '#D9735F', OUT, 6);
  for (const side of [-1, 1]) {
    rrect(ctx, x + side * (w / 2 - 70) - 14, y + 110, 28, 46, 8);
    fillStroke(ctx, '#7A4E2E', OUT, 5);
  }
}

// Big cosy blanket burrito around a bear (drawn over drawBear, leaves the face visible).
function drawBurritoWrap(ctx, b, t, color = '#FF9EC4') {
  ctx.save();
  let jx = 0;
  if (b.shiver > 0) jx = noise1(t * 70, 11) * 7 * b.shiver;
  ctx.translate(b.x + jx, b.y - b.hop);
  ctx.scale(b.s, b.s);
  const hy = -404;
  ctx.beginPath();
  // outer shape
  ctx.moveTo(-190, 0);
  ctx.quadraticCurveTo(-230, -300, -170, hy - 60);
  ctx.quadraticCurveTo(-120, hy - 210, 0, hy - 215);
  ctx.quadraticCurveTo(120, hy - 210, 170, hy - 60);
  ctx.quadraticCurveTo(230, -300, 190, 0);
  ctx.closePath();
  // face opening
  ctx.moveTo(118, hy + 10);
  ctx.ellipse(0, hy + 10, 118, 112, 0, 0, TAU, true);
  ctx.fillStyle = color;
  ctx.fill('evenodd');
  ctx.save();
  ctx.clip('evenodd');
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  const r = mulberry32(8);
  for (let i = 0; i < 40; i++) { ellipse(ctx, (r() - 0.5) * 440, -r() * 640, 10, 10); ctx.fill(); }
  ctx.fillStyle = 'rgba(120,20,60,0.12)';
  ctx.fillRect(40, -700, 300, 800);
  ctx.restore();
  ctx.strokeStyle = OUT;
  ctx.lineWidth = LW;
  ctx.stroke();
  // fold lines
  ctx.beginPath();
  ctx.moveTo(-150, -120); ctx.quadraticCurveTo(-20, -60, 150, -150);
  ctx.moveTo(-170, -230); ctx.quadraticCurveTo(-60, -170, 120, -250);
  ctx.strokeStyle = 'rgba(120,20,60,0.35)'; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
}

// ---------- vanity (getting ready) ----------
const MIRROR = { x: 230, y: 600, w: 620, h: 600 };
function drawVanity(ctx, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, 0, 1500, [[0, '#EBD9F5'], [1, '#F6E8FA']]);
  ctx.fillRect(-400, -400, W + 800, 2000);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let y = 0; y < 1500; y += 120) for (let x = (y / 120) % 2 ? 0 : 60; x < W; x += 120) { heartPath(ctx, x, y, 10); ctx.fill(); }
  // mirror with bulbs
  rrect(ctx, MIRROR.x - 40, MIRROR.y - 40, MIRROR.w + 80, MIRROR.h + 80, 40);
  fillStroke(ctx, '#F7D7E6', OUT, 6);
  rrect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, 24);
  ctx.fillStyle = vgrad(ctx, MIRROR.y, MIRROR.y + MIRROR.h, [[0, '#DFF1FF'], [1, '#BFDDF5']]);
  ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.moveTo(MIRROR.x + 80, MIRROR.y + 260); ctx.lineTo(MIRROR.x + 300, MIRROR.y + 40); ctx.stroke();
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(MIRROR.x + 140, MIRROR.y + 300); ctx.lineTo(MIRROR.x + 360, MIRROR.y + 80); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = OUT; ctx.lineWidth = 5;
  rrect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, 24); ctx.stroke();
  const bulbs = [];
  for (let i = 0; i < 5; i++) bulbs.push([MIRROR.x - 20 + (i / 4) * (MIRROR.w + 40), MIRROR.y - 20]);
  for (let i = 1; i < 5; i++) { bulbs.push([MIRROR.x - 20, MIRROR.y - 20 + (i / 4) * (MIRROR.h + 40)]); bulbs.push([MIRROR.x + MIRROR.w + 20, MIRROR.y - 20 + (i / 4) * (MIRROR.h + 40)]); }
  for (const [bx, by] of bulbs) {
    glow(ctx, bx, by, 60, '255,240,190', 0.5);
    ellipse(ctx, bx, by, 17, 17); fillStroke(ctx, '#FFF6D2', OUT, 4);
  }
  woodFloor(ctx, 1500, '#D4B08C');
  // counter
  rrect(ctx, 120, 1250, 840, 60, 14); fillStroke(ctx, '#FFFFFF', OUT, 6);
  rrect(ctx, 150, 1310, 780, 200, 16); fillStroke(ctx, '#F4B6CF', OUT, 6);
  for (const dx of [0, 1]) { rrect(ctx, 185 + dx * 365, 1340, 345, 140, 12); fillStroke(ctx, '#F8CBDD', 'rgba(120,30,70,0.3)', 4); }
  // items on the counter
  if (o.items !== false) {
    rrect(ctx, 150, 1178, 46, 74, 10); fillStroke(ctx, '#B48CFF', OUT, 4); // perfume
    rrect(ctx, 162, 1160, 22, 22, 6); fillStroke(ctx, '#E8E2F8', OUT, 4);
    rrect(ctx, 890, 1188, 26, 64, 6); fillStroke(ctx, '#2B2F3A', OUT, 4); // lipstick
    rrect(ctx, 893, 1164, 20, 30, 8); fillStroke(ctx, '#FF3D6E', OUT, 4);
  }
}

// ---------- accessories (drawn on top of a bear, relative to its head) ----------
function drawAccessory(ctx, b, kind, t) {
  const [hx, hy, s] = headWorld(b);
  ctx.save();
  ctx.translate(hx, hy);
  ctx.scale(s * (b.flip || 1), s);
  ctx.rotate(b.headTilt || 0);
  if (kind === 'sunglasses') {
    for (const side of [-1, 1]) {
      rrect(ctx, side * 55 - 40, -48, 80, 56, 22);
      fillStroke(ctx, '#1E2230', PAL.out, 5);
      ctx.beginPath(); ctx.moveTo(side * 55 - 24, -36); ctx.lineTo(side * 55 - 6, -24);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-15, -26); ctx.quadraticCurveTo(0, -36, 15, -26);
    ctx.strokeStyle = '#1E2230'; ctx.lineWidth = 8; ctx.stroke();
  } else if (kind === 'necklace') {
    for (let i = 0; i < 13; i++) {
      const a = Math.PI * (0.18 + 0.64 * i / 12);
      ellipse(ctx, Math.cos(a) * 120, 95 + Math.sin(a) * 70, 13, 13);
      fillStroke(ctx, '#FFFDF5', PAL.out, 3.5);
    }
  } else if (kind === 'tophat') {
    ctx.translate(-30, -150);
    ctx.rotate(-0.18);
    rrect(ctx, -80, 40, 160, 24, 10); fillStroke(ctx, '#23262F', PAL.out, 5);
    rrect(ctx, -52, -60, 104, 104, 10); fillStroke(ctx, '#2B2F3A', PAL.out, 5);
    ctx.fillStyle = '#FF6FA8'; ctx.fillRect(-52, 18, 104, 18);
  } else if (kind === 'scarf') {
    rrect(ctx, -130, 92, 260, 56, 28); fillStroke(ctx, '#FF5A5F', PAL.out, 5);
    rrect(ctx, 50, 120, 54, 140, 22); fillStroke(ctx, '#FF5A5F', PAL.out, 5);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8;
    for (const x of [-80, -20, 40]) { ctx.beginPath(); ctx.moveTo(x, 96); ctx.lineTo(x + 12, 144); ctx.stroke(); }
  } else if (kind === 'flowers') {
    const cols = ['#FF8FB1', '#FFD166', '#9AD0FF', '#C3A6FF', '#FF8FB1'];
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * (1.15 + 0.7 * i / 4);
      const fx = Math.cos(a) * 140, fy = Math.sin(a) * 120 + 10;
      for (let k = 0; k < 5; k++) {
        ellipse(ctx, fx + Math.cos(k * TAU / 5) * 14, fy + Math.sin(k * TAU / 5) * 14, 12, 12);
        fillStroke(ctx, cols[i], PAL.out, 3);
      }
      ellipse(ctx, fx, fy, 9, 9); fillStroke(ctx, '#FFF3B0', PAL.out, 3);
    }
  }
  ctx.restore();
}

function drawBrush(ctx, x, y, rot, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  rrect(ctx, -12, 0, 24, 110, 12); fillStroke(ctx, '#FF8FB8', PAL.out, 5);
  ellipse(ctx, 0, -40, 40, 52); fillStroke(ctx, '#FFC6DC', PAL.out, 5);
  ctx.fillStyle = PAL.out;
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { ellipse(ctx, i * 12, -40 + j * 16, 3, 3); ctx.fill(); }
  ctx.restore();
}

function drawCobwebs(ctx, x, y, s, t, amt = 1) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalAlpha = amt;
  ctx.strokeStyle = 'rgba(95,105,125,0.85)';
  ctx.lineWidth = 3.5;
  // web draped over the head
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (1.05 + 0.9 * i / 6);
    ctx.beginPath(); ctx.moveTo(x, y - 40 * s); ctx.lineTo(x + Math.cos(a) * 190 * s, y + Math.sin(a) * 170 * s); ctx.stroke();
  }
  for (let r = 50; r < 190; r += 40) {
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const a = Math.PI * (1.05 + 0.9 * i / 6);
      const px = x + Math.cos(a) * r * s, py = y - 40 * s + Math.sin(a) * r * 0.9 * s + 40 * s * (r / 190);
      if (i === 0) ctx.moveTo(px, py); else ctx.quadraticCurveTo(px - 10, py + 10, px, py);
    }
    ctx.stroke();
  }
  // dangling spider
  const sy = y - 260 * s + 40 * Math.sin(t * 1.5) * s;
  ctx.beginPath(); ctx.moveTo(x + 120 * s, y - 520 * s); ctx.lineTo(x + 120 * s, sy); ctx.strokeStyle = 'rgba(95,105,125,0.85)'; ctx.stroke();
  ctx.fillStyle = '#23262F';
  ellipse(ctx, x + 120 * s, sy + 16 * s, 16 * s, 14 * s); ctx.fill();
  ctx.strokeStyle = '#23262F'; ctx.lineWidth = 3;
  for (const k of [-1, 1]) for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(x + 120 * s, sy + 16 * s); ctx.lineTo(x + 120 * s + k * 26 * s, sy + (6 + i * 10) * s); ctx.stroke();
  }
  ctx.restore();
}

function drawBeard(ctx, b, len) {
  if (len <= 0) return;
  const [hx, hy, s] = headWorld(b);
  ctx.save();
  ctx.translate(hx, hy);
  ctx.scale(s, s);
  // long grey "waited for ages" beard hanging from the muzzle
  const L = 40 + 230 * len;
  ctx.beginPath();
  ctx.moveTo(-62, 62);
  ctx.bezierCurveTo(-80, 62 + L * 0.6, -30, 62 + L * 0.95, 0, 62 + L);
  ctx.bezierCurveTo(30, 62 + L * 0.95, 80, 62 + L * 0.6, 62, 62);
  ctx.quadraticCurveTo(0, 100, -62, 62);
  ctx.closePath();
  fillStroke(ctx, '#D3D9E2', PAL.out, 5);
  ctx.strokeStyle = 'rgba(90,100,120,0.55)';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  for (const k of [-36, -14, 10, 32]) {
    ctx.beginPath();
    ctx.moveTo(k, 92);
    ctx.quadraticCurveTo(k + 10, 62 + L * 0.5, k * 0.4, 62 + L * 0.85);
    ctx.stroke();
  }
  ctx.restore();
}

function spotlight(ctx, x, y, amt) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(x, -200, x, y + 200);
  g.addColorStop(0, `rgba(255,245,200,${0.55 * amt})`);
  g.addColorStop(1, `rgba(255,245,200,${0.05 * amt})`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 90, -300); ctx.lineTo(x + 90, -300); ctx.lineTo(x + 330, y + 200); ctx.lineTo(x - 330, y + 200);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Fur tufts flying off when a bear shakes itself.
function furTufts(ctx, x, y, t, t0, t1) {
  if (t < t0 || t > t1 + 0.6) return;
  const r = mulberry32(55);
  ctx.save();
  for (let i = 0; i < 16; i++) {
    const st = t0 + r() * (t1 - t0);
    const k = (t - st) / 0.6;
    if (k < 0 || k > 1) continue;
    const a = r() * TAU, d = 120 + 260 * k;
    ctx.globalAlpha = 1 - k;
    ellipse(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8 + 80 * k * k, 14, 9, a);
    fillStroke(ctx, '#ffffff', 'rgba(51,58,71,0.6)', 2.5);
  }
  ctx.restore();
}

// Snow falling inside the room (cartoon cold).
function indoorSnow(ctx, t, amt) {
  if (amt <= 0) return;
  const r = mulberry32(99);
  ctx.save();
  ctx.globalAlpha = amt;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(120,160,210,0.7)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 70; i++) {
    const x = r() * (W + 200) - 100 + Math.sin(t * 1.5 + i) * 30;
    const y = ((r() * 2200 + t * (120 + r() * 120)) % 2200) - 150;
    const rr = 5 + r() * 7;
    ellipse(ctx, x, y, rr, rr); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// Rising heat shimmer lines.
function heatWaves(ctx, t, amt, x0 = 0, x1 = W) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalAlpha = 0.55 * amt;
  ctx.strokeStyle = '#FF8A3D';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const x = lerp(x0, x1, (i + 0.5) / 7);
    const yb = 1500 - ((t * 160 + i * 230) % 900);
    ctx.beginPath();
    for (let k = 0; k <= 12; k++) {
      const y = yb - k * 18;
      const px = x + Math.sin(k * 0.9 + t * 6 + i) * 14;
      if (k === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- generic studio backdrop ----------
function drawStudio(ctx, c1 = '#FFD9E6', c2 = '#D5E4FF') {
  ctx.fillStyle = vgrad(ctx, 0, H, [[0, c1], [1, c2]]);
  ctx.fillRect(-400, -400, W + 800, H + 800);
  ellipse(ctx, W / 2, 1560, 520, 90);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
}
