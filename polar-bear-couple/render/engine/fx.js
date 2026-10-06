// Screen-space overlays (TikTok-style text, speech/thought bubbles, labels) and little
// cartoon effects (Zzz, hearts, sparkles, speed lines, lighting).
'use strict';

const SAFE = { left: 50, right: W - 150, top: 470, bottom: 1480 };
const ACCENT = { him: '#4C8DFF', her: '#FF5FA2' };

// Persistent hook caption at the top (visible from frame 0 so it works as the thumbnail).
function hookText(ctx, text) {
  drawText(ctx, text, W / 2, 320, {
    size: 64, weight: 800, maxWidth: 930, color: '#fff', stroke: '#111', strokeWidth: 10,
    shadow: 'rgba(0,0,0,0.35)', shadowBlur: 12, lineHeight: 1.15,
  });
}

function popScale(t, t0, t1, out = 0.14) {
  const kin = ease.outBack(seg(t, t0, t0 + 0.2));
  const kout = 1 - ease.inQuad(seg(t, t1 - out, t1));
  return { s: lerp(0.55, 1, kin) * lerp(0.8, 1, kout), a: clamp(seg(t, t0, t0 + 0.08)) * kout };
}

function speechBubble(ctx, text, cx, cy, tail, t, t0, t1, o = {}) {
  const size = o.size || 50;
  const { lines, w } = measureLines(ctx, text, size, 700, o.maxWidth || 640);
  const lh = size * 1.18;
  const bw = w + 56, bh = lines.length * lh + 34;
  cx = clamp(cx, SAFE.left + bw / 2, SAFE.right - bw / 2);
  cy = clamp(cy, SAFE.top + bh / 2, SAFE.bottom - bh / 2);
  const { s, a } = popScale(t, t0, t1);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  const ox = tail ? clamp(tail[0], cx - bw / 2 + 40, cx + bw / 2 - 40) : cx;
  ctx.translate(ox, cy);
  ctx.scale(s, s);
  ctx.translate(-ox, -cy);
  const border = o.border || '#1d1f26';
  const fill = o.fill || '#fff';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 34);
  if (tail) {
    // tail towards the speaker
    const dx = tail[0] - cx, dy = tail[1] - cy;
    const below = dy > 0;
    const by = below ? cy + bh / 2 - 2 : cy - bh / 2 + 2;
    const bx = clamp(tail[0], cx - bw / 2 + 50, cx + bw / 2 - 50);
    const dist = Math.hypot(tail[0] - bx, tail[1] - by);
    const len = Math.min(70, Math.max(30, dist - 30));
    const ux = (tail[0] - bx) / (dist || 1), uy = (tail[1] - by) / (dist || 1);
    ctx.moveTo(bx - 20, by);
    ctx.lineTo(bx + ux * len, by + uy * len);
    ctx.lineTo(bx + 20, by);
    void dx;
  }
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 6;
  ctx.strokeStyle = border;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // re-fill the bubble body to hide the tail seam
  ctx.beginPath();
  ctx.roundRect(cx - bw / 2 + 3, cy - bh / 2 + 3, bw - 6, bh - 6, 31);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.font = font(size, 700);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = o.color || '#15171c';
  lines.forEach((ln, i) => ctx.fillText(ln, cx, cy - ((lines.length - 1) * lh) / 2 + i * lh + 2));
  ctx.restore();
}

function thoughtBubble(ctx, text, cx, cy, from, t, t0, t1, o = {}) {
  const size = o.size || 48;
  const { lines, w } = measureLines(ctx, text, size, 700, o.maxWidth || 600);
  const lh = size * 1.18;
  const bw = w + 90, bh = lines.length * lh + 70;
  cx = clamp(cx, SAFE.left + bw / 2, SAFE.right - bw / 2);
  cy = clamp(cy, SAFE.top + bh / 2, SAFE.bottom - bh / 2);
  const { s, a } = popScale(t, t0, t1, 0.2);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  // trailing dots towards the thinker
  if (from) {
    for (let i = 0; i < 3; i++) {
      const k = 0.3 + i * 0.22;
      const px = lerp(from[0], cx, 1 - k), py = lerp(from[1], cy + bh / 2, 1 - k);
      const show = seg(t, t0 + i * 0.06, t0 + i * 0.06 + 0.12);
      ellipse(ctx, px, py, (10 + i * 6) * show, (9 + i * 5) * show);
      fillStroke(ctx, '#fff', '#1d1f26', 5);
    }
  }
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  // cloud: ring of overlapping circles
  const bumps = [];
  const nx = Math.max(3, Math.round(bw / 120)), ny = Math.max(1, Math.round(bh / 120));
  for (let i = 0; i <= nx; i++) { bumps.push([-bw / 2 + (i / nx) * bw, -bh / 2]); bumps.push([-bw / 2 + (i / nx) * bw, bh / 2]); }
  for (let j = 1; j < ny + 1; j++) { bumps.push([-bw / 2, -bh / 2 + (j / (ny + 1)) * bh]); bumps.push([bw / 2, -bh / 2 + (j / (ny + 1)) * bh]); }
  const r = Math.min(70, Math.max(46, bh * 0.42));
  ctx.lineWidth = 11;
  ctx.strokeStyle = '#1d1f26';
  for (const [x, y] of bumps) { ellipse(ctx, x * 0.92, y * 0.8, r, r * 0.85); ctx.stroke(); }
  rrect(ctx, -bw / 2, -bh / 2, bw, bh, 40); ctx.stroke();
  ctx.fillStyle = '#fff';
  for (const [x, y] of bumps) { ellipse(ctx, x * 0.92, y * 0.8, r, r * 0.85); ctx.fill(); }
  rrect(ctx, -bw / 2, -bh / 2, bw, bh, 40); ctx.fill();
  ctx.font = font(size, 700);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#15171c';
  lines.forEach((ln, i) => ctx.fillText(ln, 0, -((lines.length - 1) * lh) / 2 + i * lh + 2));
  ctx.restore();
}

// Draws every dialogue line visible at t. anchors: {him: bearState, her: bearState}, cam: camera.
function drawLines(ctx, skit, t, anchors, cam = CAM0) {
  for (const l of skit.visibleLines(t)) {
    const b = anchors[l.who];
    const t1 = l.end + l.hold;
    const top = b ? worldToScreen(cam, bearTop(b)) : [W / 2, 900];
    const mouth = b ? worldToScreen(cam, bearMouth(b)) : null;
    if (l.kind === 'say') {
      const pos = l.o.at || [top[0], top[1] - 70];
      speechBubble(ctx, l.text, pos[0], pos[1], l.o.noTail ? null : mouth, t, l.t, t1, l.o);
    } else {
      const pos = l.o.at || [top[0] + 60, top[1] - 120];
      thoughtBubble(ctx, l.text, pos[0], pos[1], l.o.noTail ? null : [top[0], top[1] + 10], t, l.t, t1, l.o);
    }
  }
}

// Big pill label like "HIM:" / "ME:".
function label(ctx, text, x, y, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const { s, a } = popScale(t, t0, t1);
  const size = o.size || 58;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y);
  ctx.rotate(o.rot || -0.04);
  ctx.scale(s, s);
  ctx.font = font(size, 900);
  const w = ctx.measureText(text).width + 60, h = size + 34;
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
  rrect(ctx, -w / 2, -h / 2, w, h, h / 2);
  ctx.fillStyle = o.bg || '#111';
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
  ctx.fillStyle = o.color || '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 3);
  ctx.restore();
}

// Small info chip, e.g. a timer or the clock.
function chip(ctx, text, x, y, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const { s, a } = popScale(t, t0, t1);
  const size = o.size || 44;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.font = font(size, 800);
  const w = ctx.measureText(text).width + 44, h = size + 26;
  rrect(ctx, -w / 2, -h / 2, w, h, 18);
  ctx.fillStyle = o.bg || 'rgba(17,17,20,0.88)';
  ctx.fill();
  ctx.fillStyle = o.color || '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 2);
  ctx.restore();
}

// Stage-direction text like "*sighs at 100 decibels*".
function narration(ctx, text, x, y, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const { s, a } = popScale(t, t0, t1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y);
  ctx.scale(s, s);
  drawText(ctx, text, 0, 0, {
    size: o.size || 52, weight: 900, color: o.color || '#FFE45C', stroke: '#111', strokeWidth: 11,
    maxWidth: o.maxWidth || 860, shadow: 'rgba(0,0,0,0.3)',
  });
  ctx.restore();
}

// Huge centred punchline text.
function bigText(ctx, text, x, y, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const k = ease.outBack(seg(t, t0, t0 + 0.25));
  const a = 1 - seg(t, t1 - 0.12, t1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y);
  ctx.rotate(o.rot || 0);
  ctx.scale(lerp(1.8, 1, k), lerp(1.8, 1, k));
  drawText(ctx, text, 0, 0, {
    size: o.size || 92, weight: 900, color: o.color || '#fff', stroke: '#111', strokeWidth: 16,
    maxWidth: o.maxWidth || 900, shadow: 'rgba(0,0,0,0.4)', shadowBlur: 20,
  });
  ctx.restore();
}

function zzz(ctx, x, y, t, amt = 1, o = {}) {
  if (amt <= 0) return;
  ctx.save();
  const n = 3;
  for (let i = 0; i < n; i++) {
    const k = (t * (o.speed || 0.55) + i / n) % 1;
    const size = (o.size || 46) * (0.6 + k * 0.9);
    ctx.globalAlpha = amt * Math.sin(Math.PI * k);
    ctx.font = font(size, 900);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const px = x + k * 90 + Math.sin(k * 6 + i) * 14, py = y - k * 170;
    ctx.lineWidth = 8; ctx.strokeStyle = '#1b2440'; ctx.lineJoin = 'round';
    ctx.strokeText('Z', px, py);
    ctx.fillStyle = o.color || '#CFE3FF';
    ctx.fillText('Z', px, py);
  }
  ctx.restore();
}

function floatingHearts(ctx, x, y, t, amt = 1, spread = 120) {
  if (amt <= 0) return;
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const k = (t * 0.6 + i / 5) % 1;
    const px = x + Math.sin(i * 2.3 + k * 4) * spread * 0.6 + (i - 2) * spread * 0.25;
    const py = y - k * 220;
    ctx.globalAlpha = amt * Math.sin(Math.PI * k);
    heartPath(ctx, px, py, 30 + 10 * Math.sin(i));
    fillStroke(ctx, i % 2 ? '#FF6B8B' : '#FF4D6D', '#7a1430', 3.5);
  }
  ctx.restore();
}

function sparkle(ctx, x, y, r, rot = 0, color = '#FFF6B0') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    const rr = i % 2 ? r * 0.28 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function sparkles(ctx, x, y, t, amt = 1, spread = 160, seed = 3) {
  if (amt <= 0) return;
  const r = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < 9; i++) {
    const px = x + (r() - 0.5) * spread * 2, py = y + (r() - 0.5) * spread * 1.4;
    const ph = r() * TAU, sp = 3 + r() * 4;
    const k = Math.max(0, Math.sin(t * sp + ph));
    ctx.globalAlpha = amt * k;
    sparkle(ctx, px, py, 10 + 18 * k, t + i, i % 3 ? '#FFF6B0' : '#ffffff');
  }
  ctx.restore();
}

// Radial speed lines for dramatic zooms.
function speedLines(ctx, cx, cy, t, amt = 1, color = 'rgba(255,255,255,0.85)') {
  if (amt <= 0) return;
  const r = mulberry32(Math.floor(t * 20));
  ctx.save();
  ctx.globalAlpha = amt;
  ctx.fillStyle = color;
  for (let i = 0; i < 46; i++) {
    const a = r() * TAU;
    const w = 0.01 + r() * 0.02;
    const r0 = 420 + r() * 260;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a - w) * r0, cy + Math.sin(a - w) * r0);
    ctx.lineTo(cx + Math.cos(a) * 1600, cy + Math.sin(a) * 1600);
    ctx.lineTo(cx + Math.cos(a + w) * r0, cy + Math.sin(a + w) * r0);
    ctx.fill();
  }
  ctx.restore();
}

// Comic burst behind title cards.
function burst(ctx, cx, cy, r, t, c1 = '#FFD23F', c2 = '#FF8A3D') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 0.3);
  const n = 18;
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, (i / n) * TAU, ((i + 1) / n) * TAU);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? c1 : c2;
    ctx.fill();
  }
  ctx.restore();
}

function titleCard(ctx, text, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  ctx.save();
  burst(ctx, W / 2, H / 2, 1500, t, o.c1, o.c2);
  const k = ease.outBack(seg(t, t0, t0 + 0.3));
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.06);
  ctx.scale(lerp(0.3, 1, k), lerp(0.3, 1, k));
  drawText(ctx, text, 0, 0, {
    size: o.size || 104, weight: 900, color: '#fff', stroke: '#2a1440', strokeWidth: 18,
    maxWidth: 900, lineHeight: 1.08, shadow: 'rgba(0,0,0,0.35)', shadowBlur: 24,
  });
  ctx.restore();
}

function vignette(ctx, amt = 0.5, color = '0,0,0') {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, `rgba(${color},0)`);
  g.addColorStop(1, `rgba(${color},${amt})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function flash(ctx, amt, color = '255,255,255') {
  if (amt <= 0) return;
  ctx.fillStyle = `rgba(${color},${amt})`;
  ctx.fillRect(0, 0, W, H);
}

// Darken a scene for night time: multiply with a deep blue.
function nightTint(ctx, amt, color = '40,52,110') {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = `rgba(${color},${amt})`;
  ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  ctx.restore();
}

// Additive light pool (lamp, phone screen ...).
function glow(ctx, x, y, r, rgb, amt) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${0.8 * amt})`);
  g.addColorStop(0.45, `rgba(${rgb},${0.35 * amt})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

// Horizontal motion streaks for fast moves.
function motionLines(ctx, x, y, dir, amt = 1, n = 4, len = 120) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalAlpha = amt;
  ctx.strokeStyle = 'rgba(40,45,60,0.8)';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const yy = y + (i - (n - 1) / 2) * 46;
    ctx.beginPath();
    ctx.moveTo(x - dir * 30, yy);
    ctx.lineTo(x - dir * (30 + len * (0.6 + 0.4 * ((i * 7) % 3) / 2)), yy);
    ctx.stroke();
  }
  ctx.restore();
}

// Little shake marks around something that rattles / shivers.
function shakeMarks(ctx, x, y, w, t, amt = 1) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalAlpha = amt;
  ctx.strokeStyle = '#2a2f3a';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const yy = y + (i - 1) * 50;
      const o = Math.sin(t * 40 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(x + side * (w + 10 + o), yy - 14);
      ctx.quadraticCurveTo(x + side * (w + 26 + o), yy, x + side * (w + 10 + o), yy + 14);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// Simple emoji/icon popping at a point.
function emojiPop(ctx, e, x, y, t, t0, t1, size = 90) {
  if (t < t0 || t > t1) return;
  const { s, a } = popScale(t, t0, t1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y - 20 * seg(t, t0, t1));
  ctx.scale(s, s);
  ctx.font = `${size}px "Noto Color Emoji"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(e, 0, 0);
  ctx.restore();
}

// Small "TikTok-ish" progress-free end card: series tag in the corner.
function seriesTag(ctx, text) {
  ctx.save();
  ctx.font = font(34, 800);
  const w = ctx.measureText(text).width + 36;
  rrect(ctx, 40, 150, w, 56, 28);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 58, 179);
  ctx.restore();
}
