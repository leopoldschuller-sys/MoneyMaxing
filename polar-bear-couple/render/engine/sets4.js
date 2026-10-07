// Cosy bathroom for the shower skit: tiled wall, pink clawfoot tub, rain shower, curtain,
// temperature knob, caddy shelves with bottles, wall clock, a round mirror that fogs up, steam.
// Same pastel palette as sets2/sets3; world coordinates of a 1080x1920 frame.
'use strict';

const BATH = {
  x0: 135, x1: 985, cx: 560, rim: 1400, bottom: 1690, feetY: 1530,
  knob: [885, 1002], knobR: 54,
  head: [560, 805],
  shelf: { x0: 196, x1: 372, ys: [1062, 1228] },
  clock: [262, 850], mirror: [792, 800],
  rodY: 748,
};
const BRASS = '#F2C77E', BRASS_LIGHT = '#FBE2AE';

// ---------- background ----------
function drawCozyBathroom(ctx, t, o = {}) {
  // upper wall: soft lilac with a bubble pattern
  ctx.fillStyle = vgrad(ctx, -400, 1000, [[0, '#E6DAF4'], [1, '#F4E6F2']]);
  ctx.fillRect(-400, -400, W + 800, 1420);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3;
  for (let y = -300, row = 0; y < 960; y += 105, row++) {
    for (let x = -300 + (row % 2) * 52; x < W + 300; x += 105) {
      const r = 9 + ((x * 7 + y * 3) % 5);
      ellipse(ctx, x, y, r, r); ctx.stroke();
      ellipse(ctx, x - r * 0.35, y - r * 0.35, r * 0.25, r * 0.18); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
    }
  }
  // tiled lower wall
  const ty = 985;
  ctx.fillStyle = '#CFE6F4';
  ctx.fillRect(-400, ty, W + 800, 700);
  const ts = 74;
  for (let y = ty, r = 0; y < 1640; y += ts, r++) {
    for (let x = -400, c = 0; x < W + 400; x += ts, c++) {
      if ((r * 3 + c * 5) % 11 === 0) { ctx.fillStyle = '#F8D2E0'; ctx.fillRect(x + 2, y + 2, ts - 4, ts - 4); }
      else if ((r + c) % 2 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x + 2, y + 2, ts - 4, ts - 4); }
    }
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4;
  for (let y = ty; y < 1640; y += ts) { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); ctx.stroke(); }
  for (let x = -400; x < W + 400; x += ts) { ctx.beginPath(); ctx.moveTo(x, ty); ctx.lineTo(x, 1640); ctx.stroke(); }
  rrect(ctx, -400, ty - 16, W + 800, 24, 8); fillStroke(ctx, '#FFFFFF', 'rgba(91,74,96,0.35)', 3);
  // floor: cream/pink checker + fluffy bath mat
  ctx.fillStyle = '#FFF4EE'; ctx.fillRect(-400, 1630, W + 800, 800);
  ctx.fillStyle = '#F9D9E4';
  for (let y = 1630, r = 0; y < 2400; y += 90, r++) for (let x = -400 + (r % 2) * 90; x < W + 400; x += 180) ctx.fillRect(x, y, 90, 90);
  ctx.fillStyle = 'rgba(91,74,96,0.12)'; ctx.fillRect(-400, 1630, W + 800, 14);

  drawWallClock(ctx, BATH.clock[0], BATH.clock[1], 66, o.clock ?? 7.25);
  drawRoundMirror(ctx, BATH.mirror[0], BATH.mirror[1], 86, o.fog || 0, o.heart || 0, t);
  drawShelves(ctx);
  drawTempKnob(ctx, BATH.knob[0], BATH.knob[1], BATH.knobR, o.knob || 0, t);
  drawShowerHead(ctx, BATH.head[0], BATH.head[1], t, o);
  // trailing pothos from the end of the curtain rod
  drawPothos(ctx, 1000, BATH.rodY + 6, t);
}

function drawWallClock(ctx, x, y, R, hours) {
  ellipse(ctx, x, y, R, R); fillStroke(ctx, '#FFB8CC', SOFT_OUT, 5);
  ellipse(ctx, x, y, R * 0.8, R * 0.8); ctx.fillStyle = '#FFF9F4'; ctx.fill();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const big = i % 3 === 0;
    ellipse(ctx, x + Math.cos(a) * R * 0.64, y + Math.sin(a) * R * 0.64, big ? 5 : 3, big ? 5 : 3);
    ctx.fillStyle = big ? '#FF8FBA' : 'rgba(91,74,96,0.45)'; ctx.fill();
  }
  const ha = ((hours % 12) / 12) * TAU - Math.PI / 2;
  const ma = ((hours % 1)) * TAU - Math.PI / 2;
  ctx.lineCap = 'round'; ctx.strokeStyle = SOFT_OUT;
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ha) * R * 0.36, y + Math.sin(ha) * R * 0.36); ctx.stroke();
  ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ma) * R * 0.56, y + Math.sin(ma) * R * 0.56); ctx.stroke();
  ellipse(ctx, x, y, 7, 7); ctx.fillStyle = '#FF7FB0'; ctx.fill();
}

function drawRoundMirror(ctx, x, y, R, fog, heart, t) {
  ellipse(ctx, x, y, R + 15, R + 15); fillStroke(ctx, BRASS, SOFT_OUT, 5);
  ellipse(ctx, x, y, R, R);
  const g = ctx.createLinearGradient(x - R, y - R, x + R, y + R);
  g.addColorStop(0, '#F1F8FF'); g.addColorStop(1, '#C9DDF2');
  ctx.fillStyle = g; ctx.fill();
  ctx.save();
  ellipse(ctx, x, y, R, R); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineCap = 'round';
  ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x - R * 0.6, y + R * 0.1); ctx.lineTo(x - R * 0.05, y - R * 0.55); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x - R * 0.35, y + R * 0.4); ctx.lineTo(x + R * 0.2, y - R * 0.15); ctx.stroke();
  if (fog > 0) {
    // condensation: milky layer with soft blotches and a few droplets
    ctx.fillStyle = `rgba(250,250,255,${0.88 * fog})`;
    ctx.fillRect(x - R, y - R, R * 2, R * 2);
    const r = mulberry32(12);
    for (let i = 0; i < 14; i++) {
      ellipse(ctx, x + (r() - 0.5) * R * 1.8, y + (r() - 0.5) * R * 1.8, 4 + r() * 5, 5 + r() * 6);
      ctx.fillStyle = `rgba(190,215,240,${0.5 * fog})`; ctx.fill();
    }
    if (heart > 0) {
      // a heart drawn into the fog with a finger
      ctx.save();
      heartPath(ctx, x, y + 12, 44);
      ctx.setLineDash([400 * heart, 1000]);
      ctx.lineWidth = 13; ctx.strokeStyle = 'rgba(205,228,250,0.95)'; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
  ellipse(ctx, x, y, R, R); ctx.strokeStyle = 'rgba(91,74,96,0.4)'; ctx.lineWidth = 3; ctx.stroke();
}

function drawShelves(ctx) {
  const { x0, x1, ys } = BATH.shelf;
  for (const y of ys) {
    // brass brackets
    for (const bx of [x0 + 26, x1 - 26]) {
      ctx.beginPath(); ctx.moveTo(bx, y + 8); ctx.lineTo(bx, y + 44); ctx.lineTo(bx + 18, y + 8); ctx.closePath();
      fillStroke(ctx, BRASS, SOFT_OUT, 3.5);
    }
    rrect(ctx, x0, y - 4, x1 - x0, 16, 8);
    fillStroke(ctx, 'rgba(225,245,255,0.95)', SOFT_OUT, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillRect(x0 + 12, y - 1, (x1 - x0) * 0.4, 3);
  }
}

// Single-lever temperature knob: v = -1 ice cold ... +1 hot (> 1 = overheated, glowing).
function drawTempKnob(ctx, x, y, R, v, t) {
  if (v > 1) softGlow(ctx, x, y, R * 3.2, '255,110,90', clamp((v - 1) * 4) * (0.75 + 0.25 * Math.sin(t * 18)));
  rrect(ctx, x - R * 1.32, y - R * 1.32, R * 2.64, R * 2.64, R * 0.6);
  fillStroke(ctx, '#FFF8F3', SOFT_OUT, 5);
  // gauge over the top: blue -> lilac -> red
  const a0 = Math.PI * 0.78, a1 = Math.PI * 2.22, n = 26;
  const cA = [111, 183, 255], cM = [205, 165, 235], cB = [255, 104, 112];
  ctx.lineWidth = R * 0.24;
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1);
    const c = k < 0.5 ? cA.map((a, j) => lerp(a, cM[j], k * 2)) : cM.map((a, j) => lerp(a, cB[j], k * 2 - 1));
    ctx.strokeStyle = `rgb(${c.map(Math.round).join(',')})`;
    ctx.lineCap = i === 0 || i === n - 1 ? 'round' : 'butt';
    ctx.beginPath(); ctx.arc(x, y, R * 1.02, lerp(a0, a1, i / n) - 0.002, lerp(a0, a1, (i + 1) / n) + 0.002); ctx.stroke();
  }
  ctx.font = `${Math.round(R * 0.5)}px "Noto Color Emoji"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('❄️', x - R * 0.78, y + R * 0.95);
  ctx.fillText('🔥', x + R * 0.78, y + R * 0.95);
  // knob with a pointer
  const ang = Math.PI * 1.5 + clamp(v, -1.2, 1.4) * Math.PI * 0.66;
  ctx.save();
  ctx.translate(x, y);
  ellipse(ctx, 0, 0, R * 0.62, R * 0.62);
  const g = ctx.createRadialGradient(-R * 0.2, -R * 0.25, 2, 0, 0, R * 0.62);
  g.addColorStop(0, BRASS_LIGHT); g.addColorStop(1, BRASS);
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 5; ctx.stroke();
  ctx.rotate(ang);
  rrect(ctx, -R * 0.1, -R * 0.13, R * 0.9, R * 0.26, R * 0.13);
  fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  ellipse(ctx, R * 0.74, 0, R * 0.07, R * 0.07); ctx.fillStyle = v > 0.05 ? '#FF6870' : v < -0.05 ? '#6FB7FF' : '#B9A6C9'; ctx.fill();
  ctx.restore();
}

function drawShowerHead(ctx, x, y, t, o = {}) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, y - 44); ctx.stroke();
  ctx.strokeStyle = BRASS; ctx.lineWidth = 16; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x - 3, -400); ctx.lineTo(x - 3, y - 50); ctx.stroke();
  // shower head: cone + wide face with holes
  const hot = o.hot || 0, icy = o.icy || 0;
  if (hot > 0) softGlow(ctx, x, y, 170, '255,150,110', 0.6 * hot);
  ctx.beginPath();
  ctx.moveTo(x - 20, y - 48); ctx.lineTo(x + 20, y - 48); ctx.lineTo(x + 72, y - 6); ctx.lineTo(x - 72, y - 6); ctx.closePath();
  fillStroke(ctx, BRASS, SOFT_OUT, 5);
  ellipse(ctx, x, y - 2, 98, 24); fillStroke(ctx, BRASS_LIGHT, SOFT_OUT, 5);
  ctx.fillStyle = 'rgba(91,74,96,0.45)';
  for (let i = -3; i <= 3; i++) for (const dy of [-6, 6]) { ellipse(ctx, x + i * 23 + (dy > 0 ? 11 : 0), y - 2 + dy, 3.6, 2.4); ctx.fill(); }
  if (icy > 0) {
    // little icicles hanging from the shower head
    ctx.save();
    ctx.globalAlpha = clamp(icy * 1.4);
    for (const [ox, len] of [[-80, 26], [-52, 40], [-20, 30], [14, 44], [46, 28], [76, 36]]) {
      ctx.beginPath();
      const ix = x + ox, iy = y + 16 - Math.abs(ox) * 0.1;
      ctx.moveTo(ix - 8, iy); ctx.lineTo(ix + 8, iy); ctx.lineTo(ix, iy + len * icy); ctx.closePath();
      fillStroke(ctx, '#DDF4FF', '#6FA9D8', 3);
    }
    ctx.restore();
  }
}

function drawPothos(ctx, x, y, t) {
  ctx.save();
  rrect(ctx, x - 40, y, 80, 62, [6, 6, 20, 20]); fillStroke(ctx, '#FFFFFF', SOFT_OUT, 4);
  ctx.fillStyle = '#FF8FBA'; ctx.fillRect(x - 38, y + 18, 76, 10);
  for (const [vx, n, ph] of [[-22, 7, 0], [6, 9, 1.2], [26, 5, 2.1]]) {
    let px = x + vx, py = y + 50;
    for (let i = 0; i < n; i++) {
      const sw = Math.sin(t * 1.1 + ph + i * 0.4) * 3;
      const nx = px + Math.sin(i * 0.9 + ph) * 10 + sw, ny = py + 34;
      ctx.strokeStyle = '#6F9E7E'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
      ctx.save(); ctx.translate(nx, ny); ctx.rotate((i % 2 ? 0.8 : -0.8));
      ellipse(ctx, 10, 0, 14, 9); fillStroke(ctx, i % 2 ? '#8CC79F' : '#A6D6B1', SOFT_OUT, 2.5);
      ctx.restore();
      px = nx; py = ny;
    }
  }
  ctx.restore();
}

// ---------- bottles ----------
// y = bottom of the bottle. spec: {kind: pump|flip|tube|jar|round, col, cap, w, h, icon, label}
function drawBottle(ctx, x, y, s, spec, rot = 0) {
  const { kind = 'flip', col = '#FFB8CC', cap = '#FFFFFF', w = 52, h = 100 } = spec;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  if (kind === 'pump') {
    rrect(ctx, -w / 2, -h, w, h, 14); fillStroke(ctx, col, SOFT_OUT, 4);
    rrect(ctx, -9, -h - 16, 18, 18, 4); fillStroke(ctx, cap, SOFT_OUT, 3.5);
    rrect(ctx, -16, -h - 30, 40, 14, 6); fillStroke(ctx, cap, SOFT_OUT, 3.5);
  } else if (kind === 'tube') {
    rrect(ctx, -w * 0.34, -26, w * 0.68, 26, 6); fillStroke(ctx, cap, SOFT_OUT, 3.5);
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, -24); ctx.lineTo(-w * 0.5, -h + 10); ctx.lineTo(w * 0.5, -h + 10); ctx.lineTo(w * 0.3, -24); ctx.closePath();
    fillStroke(ctx, col, SOFT_OUT, 4);
    rrect(ctx, -w * 0.52, -h, w * 1.04, 14, 4); fillStroke(ctx, col, SOFT_OUT, 3.5);
  } else if (kind === 'jar') {
    rrect(ctx, -w / 2, -h, w, h, 16); fillStroke(ctx, col, SOFT_OUT, 4);
    rrect(ctx, -w / 2 - 4, -h - 16, w + 8, 20, 8); fillStroke(ctx, cap, SOFT_OUT, 3.5);
  } else if (kind === 'round') {
    ellipse(ctx, 0, -h * 0.42, w * 0.55, h * 0.42); fillStroke(ctx, col, SOFT_OUT, 4);
    rrect(ctx, -9, -h - 12, 18, 30, 5); fillStroke(ctx, cap, SOFT_OUT, 3.5);
  } else {
    rrect(ctx, -w / 2, -h, w, h, [18, 18, 12, 12]); fillStroke(ctx, col, SOFT_OUT, 4);
    rrect(ctx, -w * 0.32, -h - 14, w * 0.64, 18, 6); fillStroke(ctx, cap, SOFT_OUT, 3.5);
  }
  // shine + label
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  if (kind !== 'round') { rrect(ctx, -w / 2 + 7, -h + 12, 7, h * 0.5, 4); ctx.fill(); }
  if (spec.label) {
    const lw = w - 12, lh = Math.min(h * 0.46, 64), ly = -h * 0.62;
    rrect(ctx, -lw / 2, ly - lh / 2, lw, lh, 10); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = spec.labelCol || SOFT_OUT;
    const lines = spec.label.split('\n');
    lines.forEach((ln, i) => {
      ctx.font = font(i === 0 ? spec.labelSize || 26 : (spec.labelSize || 26) * 0.62, 700);
      ctx.fillText(ln, 0, ly + (i - (lines.length - 1) / 2) * (spec.labelSize || 26) * 0.82 + 2);
    });
  } else if (spec.icon) {
    const iy = kind === 'round' ? -h * 0.42 : -h * 0.55;
    ellipse(ctx, 0, iy, w * 0.3, w * 0.3); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
    ctx.fillStyle = spec.iconCol || '#FF7FB0';
    if (spec.icon === 'heart') { heartPath(ctx, 0, iy + 3, w * 0.2); ctx.fill(); }
    else if (spec.icon === 'star') { sparkle(ctx, 0, iy, w * 0.22, 0, spec.iconCol || '#FFB547'); }
    else if (spec.icon === 'leaf') { ellipse(ctx, 0, iy, w * 0.1, w * 0.2, 0.6); ctx.fillStyle = '#7FBF92'; ctx.fill(); }
    else { ellipse(ctx, 0, iy, w * 0.13, w * 0.13); ctx.fill(); }
  }
  ctx.restore();
}

// Her collection, in the order they pop onto the shelves / tub rim.
const HER_BOTTLES = [
  { x: 222, y: 1062, kind: 'pump', col: '#FFB8CC', w: 46, h: 96, icon: 'heart' },
  { x: 268, y: 1062, kind: 'flip', col: '#C9B5F2', w: 44, h: 116, icon: 'star' },
  { x: 312, y: 1062, kind: 'round', col: '#BDE6D2', w: 52, h: 84, icon: 'leaf' },
  { x: 352, y: 1062, kind: 'tube', col: '#FFD59E', w: 40, h: 104, icon: 'dot' },
  { x: 222, y: 1228, kind: 'jar', col: '#FFC9DE', w: 50, h: 56, icon: 'heart' },
  { x: 342, y: 1228, kind: 'pump', col: '#B8DBFF', w: 44, h: 106, icon: 'star', iconCol: '#6FA8F5' },
  { x: 268, y: 1228, kind: 'flip', col: '#FF9EC4', w: 42, h: 92, icon: 'dot' },
  { x: 170, y: 1376, kind: 'tube', col: '#D8C2FF', w: 42, h: 96, icon: 'heart' },
  { x: 216, y: 1376, kind: 'round', col: '#FFC2A8', w: 46, h: 80, icon: 'star' },
  { x: 905, y: 1376, kind: 'flip', col: '#C3EBDD', w: 44, h: 104, icon: 'leaf' },
  { x: 948, y: 1376, kind: 'pump', col: '#FFB8CC', w: 42, h: 90, icon: 'heart' },
  { x: 312, y: 1228, kind: 'jar', col: '#E8D5FF', w: 44, h: 50, icon: 'star' },
  { x: 262, y: 1376, kind: 'jar', col: '#CDEFE3', w: 44, h: 46, icon: 'dot' },
];
const HIS_BOTTLE = { kind: 'flip', col: '#7FA8F5', cap: '#4D6FB8', w: 74, h: 140, label: '10\nin 1', labelSize: 34, labelCol: '#3D5A99' };

// n = how many of her bottles are out (fractional part = the one popping in right now).
// which: 'wall' (shelves, drawn behind the bears), 'rim' (tub rim, drawn in front), or both.
function drawHerBottles(ctx, t, n, which = null) {
  for (let i = 0; i < HER_BOTTLES.length; i++) {
    const k = clamp(n - i);
    if (k <= 0) continue;
    const b = HER_BOTTLES[i];
    if (which === 'wall' && b.y > 1300) continue;
    if (which === 'rim' && b.y <= 1300) continue;
    const s = ease.outBack(k);
    const drop = (1 - ease.outCubic(k)) * 60;
    drawBottle(ctx, b.x, b.y - drop, s, b, Math.sin(i * 1.7) * 0.04);
  }
}

// ---------- tub front, curtain, water, steam ----------
function drawTubFront(ctx, t, o = {}) {
  const { x0, x1, rim, bottom } = BATH;
  // claw feet
  for (const [fx, side] of [[x0 + 120, -1], [x1 - 120, 1]]) {
    ctx.beginPath();
    ctx.moveTo(fx - 34, bottom - 20);
    ctx.quadraticCurveTo(fx + side * 6, bottom + 40, fx + side * 34, bottom + 52);
    ctx.lineTo(fx + side * 50, bottom + 60);
    ctx.quadraticCurveTo(fx - side * 30, bottom + 70, fx - side * 40, bottom + 52);
    ctx.quadraticCurveTo(fx - side * 30, bottom + 10, fx + 34, bottom - 20);
    ctx.closePath();
    fillStroke(ctx, BRASS, SOFT_OUT, 4.5);
  }
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(x0 - 22, rim);
    ctx.lineTo(x1 + 22, rim);
    ctx.bezierCurveTo(x1 + 14, bottom - 70, x1 - 40, bottom + 4, x1 - 170, bottom + 4);
    ctx.lineTo(x0 + 170, bottom + 4);
    ctx.bezierCurveTo(x0 + 40, bottom + 4, x0 - 14, bottom - 70, x0 - 22, rim);
    ctx.closePath();
  };
  body();
  ctx.fillStyle = vgrad(ctx, rim, bottom, [[0, '#FFD0DD'], [1, '#F6A9C1']]);
  ctx.fill();
  ctx.save(); ctx.clip();
  // soft highlight + a row of little white hearts
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  rrect(ctx, x0 + 40, rim + 40, (x1 - x0) * 0.55, 26, 13); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let x = x0 + 70; x < x1 - 40; x += 92) { heartPath(ctx, x, rim + 150 + Math.sin(x) * 4, 14); ctx.fill(); }
  ctx.restore();
  body();
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.stroke();
  // rolled rim
  rrect(ctx, x0 - 50, rim - 28, x1 - x0 + 100, 56, 28);
  fillStroke(ctx, '#FFFDFB', SOFT_OUT, 6);
  ctx.fillStyle = 'rgba(200,180,215,0.35)';
  rrect(ctx, x0 - 36, rim + 6, x1 - x0 + 72, 14, 7); ctx.fill();
  if (o.duck !== false) drawDuck(ctx, o.duckX ?? 832, rim - 26, 0.9, t, o.duckRot || 0);
}

function drawDuck(ctx, x, y, s, t, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot + Math.sin(t * 2) * 0.04);
  ctx.scale(s, s);
  ellipse(ctx, 0, -26, 46, 30); fillStroke(ctx, '#FFE07A', SOFT_OUT, 4);
  ellipse(ctx, -18, -64, 26, 24); fillStroke(ctx, '#FFE07A', SOFT_OUT, 4);
  ctx.beginPath(); ctx.moveTo(-42, -62); ctx.quadraticCurveTo(-64, -58, -46, -50); ctx.closePath();
  fillStroke(ctx, '#FF9F5A', SOFT_OUT, 3.5);
  ellipse(ctx, -24, -70, 4.5, 5.5); ctx.fillStyle = SOFT_OUT; ctx.fill();
  ellipse(ctx, -14, -58, 7, 4); ctx.fillStyle = 'rgba(255,130,160,0.5)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(4, -34); ctx.quadraticCurveTo(22, -46, 34, -30); ctx.strokeStyle = 'rgba(91,74,96,0.5)'; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.restore();
}

// Shower curtain on a rod; open = 1 bunched up on the left, 0 = closed.
function drawShowerCurtain(ctx, t, open) {
  const ry = BATH.rodY, xl = 70, xr = 1040, yb = 1585;
  const right = lerp(xr, xl + 125, clamp(open));
  const w = right - xl;
  const folds = Math.max(4, Math.round(w / 64));
  const sway = Math.sin(t * 1.4) * 5 * (1 - open * 0.5);
  // curtain body
  const edge = (i) => xl + (i / folds) * w;
  ctx.save();
  const shape = () => {
    ctx.beginPath();
    ctx.moveTo(xl, ry + 10);
    ctx.lineTo(right, ry + 10);
    ctx.quadraticCurveTo(right + 6 + sway, ry + 460, right + sway * 1.6, yb);
    for (let i = folds; i > 0; i--) {
      const xa = edge(i) + sway * 1.6 * (i / folds), xb = edge(i - 1) + sway * 1.6 * ((i - 1) / folds);
      ctx.quadraticCurveTo((xa + xb) / 2, yb + 26, xb, yb);
    }
    ctx.quadraticCurveTo(xl - 4, ry + 460, xl, ry + 10);
    ctx.closePath();
  };
  shape();
  ctx.fillStyle = '#FFE1EA';
  ctx.fill();
  ctx.save(); ctx.clip();
  // folds: soft vertical shading bands
  for (let i = 0; i < folds; i++) {
    const xa = edge(i), xb = edge(i + 1);
    const g = ctx.createLinearGradient(xa, 0, xb, 0);
    g.addColorStop(0, 'rgba(240,150,185,0.0)');
    g.addColorStop(0.55, 'rgba(240,150,185,0.10)');
    g.addColorStop(1, 'rgba(200,110,150,0.30)');
    ctx.fillStyle = g;
    ctx.fillRect(xa, ry, xb - xa + sway * 1.6, yb - ry + 40);
  }
  // polka dots + little bubbles
  for (let y = ry + 60, r = 0; y < yb; y += 92, r++) {
    for (let x = xl + 28 + (r % 2) * 46; x < right; x += 92) {
      ellipse(ctx, x + sway * ((y - ry) / (yb - ry)), y, 13, 13);
      ctx.fillStyle = r % 3 === 0 ? 'rgba(255,255,255,0.95)' : 'rgba(255,143,186,0.55)'; ctx.fill();
    }
  }
  ctx.restore();
  shape();
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke();
  // fold lines
  ctx.strokeStyle = 'rgba(200,110,150,0.45)'; ctx.lineWidth = 4;
  for (let i = 1; i < folds; i++) {
    const x = edge(i);
    ctx.beginPath(); ctx.moveTo(x, ry + 24); ctx.quadraticCurveTo(x + sway * 0.8, ry + 500, x + sway * 1.6 * (i / folds), yb - 6); ctx.stroke();
  }
  // tie-back when open
  if (open > 0.85) {
    const a = seg(open, 0.85, 1);
    ctx.globalAlpha = a;
    rrect(ctx, xl - 6, ry + 520, right - xl + 12, 30, 15); fillStroke(ctx, '#FF8FBA', SOFT_OUT, 4);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // rod + rings
  ctx.lineCap = 'round';
  ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 20;
  ctx.beginPath(); ctx.moveTo(40, ry); ctx.lineTo(1060, ry); ctx.stroke();
  ctx.strokeStyle = BRASS; ctx.lineWidth = 11; ctx.stroke();
  for (let i = 0; i <= folds; i++) {
    const x = edge(i);
    ellipse(ctx, x, ry + 4, 13, 15); ctx.strokeStyle = SOFT_OUT; ctx.lineWidth = 8; ctx.stroke();
    ctx.strokeStyle = BRASS; ctx.lineWidth = 4; ctx.stroke();
  }
}

// Where the falling water lands on a bear (top of head / shoulders), or null.
function bearTopAt(b, x) {
  const s = b.s;
  const sq = b.squash * (1 - 0.6 * (b.melt || 0));
  const g = headGeom(b);
  const [hx, hy] = headWorld(b);
  const rx = g.rx * s / Math.sqrt(sq) * (1 + 0.1 * (b.puff || 0)), ry = g.ry * s * sq * (1 + 0.1 * (b.puff || 0));
  let best = null;
  const dx = (x - hx) / rx;
  if (Math.abs(dx) < 1) best = hy - ry * Math.sqrt(1 - dx * dx) * 0.96;
  // shoulders / arms
  const bx = (x - b.x) / (200 * s);
  if (Math.abs(bx) < 1) {
    const sy = b.y - b.hop + (-268 - b.bob) * s * sq + 30 * s * bx * bx;
    if (best == null || sy < best) best = Math.min(best ?? 1e9, sy);
  }
  return best;
}

function waterColor(temp) {
  const cold = clamp(-temp), hot = clamp(temp);
  return [lerp(lerp(205, 175, cold), 255, hot), lerp(lerp(230, 225, cold), 185, hot), lerp(lerp(255, 255, cold), 175, hot)].map(Math.round).join(',');
}

// Soft veil of spray behind the bears (gives the water some volume).
function drawShowerWaterBack(ctx, t, o = {}) {
  const on = o.on ?? 0;
  if (on <= 0.001) return;
  const [hx, hy] = o.head || BATH.head;
  const aim = o.aim || 0;
  const yEnd = BATH.rim + 30;
  const col = waterColor(o.temp ?? 0);
  const g = ctx.createLinearGradient(0, hy, 0, yEnd);
  g.addColorStop(0, `rgba(${col},${0.42 * on})`);
  g.addColorStop(1, `rgba(${col},${0.16 * on})`);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(hx - 88, hy + 8); ctx.lineTo(hx + 88, hy + 8);
  ctx.lineTo(hx + aim + 300, yEnd); ctx.lineTo(hx + aim - 300, yEnd);
  ctx.closePath();
  ctx.fillStyle = g; ctx.fill();
  ctx.restore();
}

// Rain-shower water. o: {on 0..1, temp -1..1, aim (x offset at the bottom), bears: [bearState], head:[x,y]}
function drawShowerWater(ctx, t, o = {}) {
  const on = o.on ?? 0;
  if (on <= 0.001) return;
  const temp = o.temp ?? 0;
  const [hx, hy] = o.head || BATH.head;
  const aim = o.aim || 0;
  const yEnd = BATH.rim + 30;
  const total = yEnd - hy;
  const cold = clamp(-temp);
  const col = waterColor(temp);
  const r = mulberry32(77);
  ctx.save();
  ctx.lineCap = 'round';
  const hits = [];
  const N = 54;
  for (let i = 0; i < N; i++) {
    const u = r() * 2 - 1;
    const sp = 1700 + r() * 800;
    const len = 70 + r() * 70;
    const ph = r();
    const x0 = hx + u * 82;
    const x1 = hx + aim + u * (240 + 40 * Math.abs(u));
    const xAt = (y) => lerp(x0, x1, (y - hy) / total);
    // first bear surface along the path
    let stop = yEnd;
    for (const b of o.bears || []) {
      const ys = bearTopAt(b, xAt(1100));
      if (ys != null && ys > hy + 30 && ys < stop) stop = ys;
    }
    const reach = on * (total + 200);
    const d = (t * sp + ph * total) % total;
    const yHead = hy + d, yTail = yHead - len;
    if (yTail > stop || yHead - hy > reach) continue;
    const y2 = Math.min(yHead, stop), y1 = Math.max(hy + 14, yTail);
    if (y2 <= y1) continue;
    if (yHead >= stop && stop < yEnd) hits.push([xAt(stop), stop]);
    ctx.strokeStyle = `rgba(${col},${0.75 * on})`;
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(xAt(y1), y1); ctx.lineTo(xAt(y2), y2); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${0.75 * on})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(xAt(y1) - 1.5, y1); ctx.lineTo(xAt(y2) - 1.5, y2); ctx.stroke();
  }
  // splashes where the water lands on fur
  for (const b of o.bears || []) {
    const g = headGeom(b);
    const [bx] = headWorld(b);
    for (let j = 0; j < 10; j++) {
      const rr = mulberry32(300 + j);
      const k = (t * (2.2 + rr()) + rr()) % 1;
      const side = rr() < 0.5 ? -1 : 1;
      const sx = bx + (rr() - 0.5) * g.rx * b.s * 1.3;
      const top = bearTopAt(b, sx);
      if (top == null) continue;
      const px = sx + side * k * (40 + rr() * 50), py = top - 6 - Math.sin(Math.PI * k) * (26 + rr() * 30) + k * 18;
      ctx.globalAlpha = on * (1 - k);
      ellipse(ctx, px, py, 5.5, 6.5);
      ctx.fillStyle = `rgb(${col})`; ctx.fill();
      ctx.strokeStyle = 'rgba(80,130,190,0.6)'; ctx.lineWidth = 2; ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  // ice-cold: snowflakes tumble out with the water
  if (cold > 0.3) {
    const rs = mulberry32(91);
    for (let i = 0; i < 14; i++) {
      const u = rs() * 2 - 1, sp = 330 + rs() * 200, ph = rs();
      const d = (t * sp + ph * total) % total;
      if (d > on * (total + 200)) continue;
      const x = lerp(hx + u * 80, hx + aim + u * 260, d / total) + Math.sin(t * 3 + i) * 10;
      ctx.globalAlpha = (cold - 0.3) / 0.7 * on;
      sparkle(ctx, x, hy + d, 11 + (i % 3) * 3, t * 2 + i, '#FFFFFF');
      sparkle(ctx, x, hy + d, 6, t * 2 + i, '#BFE6FF');
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// Steam in world space: soft rising clouds + a milky haze that eventually fills the room.
function drawSteam(ctx, t, amt, o = {}) {
  if (amt <= 0.001) return;
  const cx = o.x ?? BATH.head[0];
  ctx.save();
  const haze = Math.pow(clamp(amt), 1.6);
  if (haze > 0) {
    ctx.fillStyle = `rgba(255,247,251,${0.86 * haze})`;
    ctx.fillRect(-600, -600, W + 1200, 3200);
  }
  const r = mulberry32(31);
  const n = 30;
  for (let i = 0; i < n; i++) {
    const spread = lerp(260, 900, clamp(amt * 1.3));
    const x0 = cx + (r() * 2 - 1) * spread;
    const sp = 45 + r() * 60;
    const life = 1700;
    const y = 1560 - ((t * sp + r() * life) % life);
    const k = (1560 - y) / life;
    const rad = (110 + r() * 150) * (0.6 + k * 0.9);
    const a = Math.min(1, amt * 1.4) * 0.5 * Math.sin(Math.PI * k);
    if (a <= 0.01) continue;
    const x = x0 + Math.sin(t * 0.6 + i) * 40;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.6, `rgba(255,250,253,${a * 0.55})`);
    g.addColorStop(1, 'rgba(255,250,253,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  ctx.restore();
}

// Little puffs of steam rising off something hot (a bear, the shower head ...).
function steamPuffs(ctx, x, y, t, amt, spread = 90) {
  if (amt <= 0) return;
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const k = (t * 0.9 + i / 6) % 1;
    const px = x + (i - 2.5) * spread * 0.35 + Math.sin(k * 5 + i) * 18, py = y - k * 190;
    ctx.globalAlpha = amt * Math.sin(Math.PI * k) * 0.9;
    ellipse(ctx, px, py, 26 + k * 34, 22 + k * 28);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.strokeStyle = 'rgba(160,150,180,0.5)'; ctx.lineWidth = 3; ctx.stroke();
  }
  ctx.restore();
}

// Water droplets flying off a bear that shakes itself dry.
function shakeSpray(ctx, x, y, t, t0, t1) {
  if (t < t0 || t > t1 + 0.6) return;
  const r = mulberry32(55);
  ctx.save();
  for (let i = 0; i < 46; i++) {
    const born = t0 + r() * (t1 - t0);
    const k = (t - born) / 0.55;
    const a = r() * TAU, sp = 260 + r() * 360, rad = 6 + r() * 6;
    if (k < 0 || k > 1) continue;
    const px = x + Math.cos(a) * (70 + sp * k), py = y + Math.sin(a) * (60 + sp * k * 0.8) + 260 * k * k;
    ctx.globalAlpha = 1 - k;
    ellipse(ctx, px, py, rad, rad * 1.2, a);
    fillStroke(ctx, '#BFE3FF', '#5E9AD6', 2.5);
  }
  ctx.restore();
}

// Music notes floating up (shower concert).
function musicNotes(ctx, x, y, t, amt = 1) {
  if (amt <= 0) return;
  ctx.save();
  for (let i = 0; i < 4; i++) {
    const k = (t * 0.55 + i / 4) % 1;
    const px = x + (i % 2 ? 1 : -1) * (30 + k * 90) + Math.sin(k * 7 + i) * 16, py = y - k * 260;
    ctx.globalAlpha = amt * Math.sin(Math.PI * k);
    ctx.font = `${56 + (i % 2) * 14}px "Noto Color Emoji"`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(i % 2 ? '🎶' : '🎵', px, py);
  }
  ctx.restore();
}
