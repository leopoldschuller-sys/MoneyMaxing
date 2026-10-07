// The two polar bears. Both share one rig; "her" is a little smaller with bigger eyes,
// lashes, rosier cheeks and a pink bow, "him" has a little tuft of fur on top of his head.
'use strict';

const PAL = {
  fur: '#FDFDFB',
  shade: '#E3E9F0',
  shade2: '#CDD6E1',
  out: '#333A47',
  nose: '#23262F',
  eye: '#191C24',
  muzzle: '#FFFFFF',
  innerEar: { him: '#DCC7CF', her: '#F6B9C9' },
  blush: '255,120,155',
  pad: '#CDB7C2',
  mouthIn: '#6A2638',
  tongue: '#F68CA3',
  bow: '#FF6FA8',
  bowDark: '#D94A8C',
  bowLight: '#FFC0DA',
  tear: '#86CCFF',
  sweat: '#9BD5FF',
};
let LW = 6.5;

// "Cute" look (used by the newer skits): bigger head, smaller body, bigger sparkly eyes set
// lower on the face, softer warm outlines and pastel shading. Old skits keep the classic look.
let CUTE = false;
function useCuteStyle() {
  CUTE = true;
  LW = 5.5;
  Object.assign(PAL, {
    fur: '#FFFDF9', shade: '#EEE6F2', shade2: '#DCD0E4', out: '#5B4A60', nose: '#3E3042',
    eye: '#2B2032', muzzle: '#FFFFFF', blush: '255,138,170', pad: '#F3BFD0',
    innerEar: { him: '#F6C9D6', her: '#FFB8CC' },
  });
}

function bearState(who, o = {}) {
  return Object.assign({
    who, x: 540, y: 1500, s: who === 'her' ? 0.92 : 1, flip: 1,
    pose: 'stand', // stand | sit | head (head only, e.g. on a pillow) | burrito
    bob: 0, lean: 0, headTilt: 0, look: 0, lookY: 0, squash: 1, headSquash: 1,
    arms: 'free', aL: 0.22, aR: 0.22, bL: 0, bR: 0, padL: false, padR: false, foreLen: 60,
    walk: 0, walkAmt: 0, hop: 0,
    eyes: 'dot', eyeOpen: 1, eyeScale: 1, pupil: [0, 0], lid: 0, lidTilt: 0,
    brows: null, browY: 0,
    mouth: 'w', talk: 0, talkMood: 'normal', mouthScale: 1,
    blush: CUTE ? (who === 'her' ? 1 : 0.7) : (who === 'her' ? 0.75 : 0.35), blushLines: 0,
    sweat: 0, anger: 0, tears: 0, bags: 0, steam: 0, snot: 0, shiver: 0,
    cheekPuff: 0, crumbs: 0, fishTail: 0, frost: 0, melt: 0, cobweb: 0, redFace: 0,
    wet: 0, puff: 0, foam: 0, foamCol: null, turban: 0, iceBlock: 0, reachLw: 1, reachRw: 1, reachArcL: 0, reachArcR: 0, redNose: 0,
    hideBody: false, reachL: null, reachR: null,
  }, o);
}

// ---------- shape paths ----------
function headShape(ctx, cx, cy, rx, ry, fluff, t, puff = 0) {
  const N = puff > 0 ? 360 : 180;
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU;
    let r = 1;
    // freshly shaken dry: round fluffy scallops all the way around
    if (puff > 0) r += puff * (0.05 + 0.075 * Math.pow(Math.abs(Math.sin(a * 11 + 0.4)), 0.7));
    // fur tufts on the lower cheeks (canvas angles: 0 = right, PI/2 = down)
    for (const [a0, a1] of [[0.06 * Math.PI, 0.36 * Math.PI], [0.64 * Math.PI, 0.94 * Math.PI]]) {
      if (a > a0 && a < a1) {
        const u = (a - a0) / (a1 - a0);
        const tri = 1 - Math.abs(((u * 3) % 1) * 2 - 1);
        r += fluff * 0.055 * tri * Math.sin(Math.PI * u);
      }
    }
    const x = cx + Math.cos(a) * rx * r;
    const y = cy + Math.sin(a) * ry * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function bodyShape(ctx, cx, cy, rx, ry, puff = 0) {
  const N = puff > 0 ? 300 : 120;
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU;
    const p = puff > 0 ? 1 + puff * (0.06 + 0.08 * Math.pow(Math.abs(Math.sin(a * 9 + 1.1)), 0.7)) : 1;
    const x = cx + Math.cos(a) * rx * (1 + 0.1 * Math.sin(a)) * p;
    const y = cy + Math.sin(a) * ry * p;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Fill a closed path with fur + a cel-shaded crescent at the lower right, then outline it.
function furFill(ctx, pathFn, shadeOffset = [-14, -16], frost = 0, grad = null) {
  if (CUTE && grad) {
    // soft volume: light from the upper left fading into a lavender shade at the edges
    const [gx, gy, gr] = grad;
    const g = ctx.createRadialGradient(gx, gy, gr * 0.05, gx, gy, gr);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(0.5, PAL.fur);
    g.addColorStop(0.82, PAL.shade);
    g.addColorStop(1, PAL.shade2);
    pathFn();
    ctx.fillStyle = g;
    ctx.fill();
  } else {
    pathFn();
    ctx.fillStyle = PAL.shade;
    ctx.fill();
    ctx.save();
    pathFn();
    ctx.clip();
    ctx.translate(shadeOffset[0], shadeOffset[1]);
    pathFn();
    ctx.fillStyle = PAL.fur;
    ctx.fill();
    ctx.restore();
  }
  if (frost > 0) {
    ctx.save();
    pathFn();
    ctx.globalAlpha = 0.55 * frost;
    ctx.fillStyle = '#9FD3FF';
    ctx.fill();
    ctx.restore();
  }
  pathFn();
  ctx.strokeStyle = PAL.out;
  ctx.lineWidth = LW;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function drawPaw(ctx, x, y, r, pad = false, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ellipse(ctx, 0, 0, r, r * 0.95);
  fillStroke(ctx, PAL.fur, PAL.out, LW);
  if (!pad) {
    // toe lines so it reads as a paw
    ctx.beginPath();
    for (const k of [-1, 1]) { ctx.moveTo(k * r * 0.3, -r * 0.95); ctx.lineTo(k * r * 0.3, -r * 0.55); }
    ctx.strokeStyle = PAL.out; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
  }
  if (pad) {
    ellipse(ctx, 0, r * 0.18, r * 0.42, r * 0.32);
    ctx.fillStyle = PAL.pad; ctx.fill();
    for (const k of [-1, 0, 1]) {
      ellipse(ctx, k * r * 0.38, -r * 0.32 - (k === 0 ? r * 0.08 : 0), r * 0.15, r * 0.17);
      ctx.fill();
    }
  }
  ctx.restore();
}

// ---------- arms ----------
const ARM_PRESETS = {
  free: null,
  crossed: { aL: 0.18, bL: 2.05, aR: 0.18, bR: 2.0 },
  hips: { aL: 0.95, bL: 1.55, aR: 0.95, bR: 1.55 },
  up: { aL: 2.55, bL: 0.25, aR: 2.55, bR: 0.25 },
  hold: { aL: 0.22, bL: 1.45, aR: 0.22, bR: 1.45 },
  shrug: { aL: 0.9, bL: -0.9, aR: 0.9, bR: -0.9 },
};

function armPoints(side, a, bend, s, foreLen) {
  const sx = side * (CUTE ? 100 : 112), sy = CUTE ? -268 : -285;
  const d1 = [side * Math.sin(a), Math.cos(a)];
  const up = CUTE ? 50 : 62;
  if (CUTE) foreLen = Math.min(foreLen, 50);
  const el = [sx + d1[0] * up, sy + d1[1] * up];
  const a2 = a - bend;
  const d2 = [side * Math.sin(a2), Math.cos(a2)];
  const paw = [el[0] + d2[0] * foreLen, el[1] + d2[1] * foreLen];
  return [[sx, sy], el, paw];
}

// Exact mapping between a bear's local rig coordinates and world coordinates
// (same transform chain as drawBear: position, hop, scale/flip, lean, squash/melt, body bob).
function bearSquash(b) { return b.squash * (1 - 0.6 * (b.melt || 0)); }
function sqOf(b) { return bearSquash(b) * b.s; }
function bearBodyBob(b) { return b.bob + (b.walkAmt ? Math.abs(Math.sin(b.walk)) * 10 * b.walkAmt : 0); }
function localToWorld(b, p) {
  const sq = bearSquash(b);
  let x = p[0] / Math.sqrt(sq), y = (p[1] - bearBodyBob(b)) * sq;
  const a = b.lean * b.flip, c = Math.cos(a), s = Math.sin(a);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [b.x + x * b.s * b.flip, b.y - b.hop + y * b.s];
}
function worldToLocal(b, w) {
  const sq = bearSquash(b);
  let x = (w[0] - b.x) / (b.s * b.flip), y = (w[1] - b.y + b.hop) / b.s;
  const a = -b.lean * b.flip, c = Math.cos(a), s = Math.sin(a);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x * Math.sqrt(sq), y / sq + bearBodyBob(b)];
}
// Cute look: arm that blends from its normal pose (w = 0) to reaching a world point (w = 1).
function cuteArmPoints(b, side) {
  const p = ARM_PRESETS[b.arms] || {};
  const a = side < 0 ? (p.aL ?? b.aL) : (p.aR ?? b.aR);
  const bend = side < 0 ? (p.bL ?? b.bL) : (p.bR ?? b.bR);
  const pts = armPoints(side, a, bend, b.s, b.foreLen);
  const reach = side < 0 ? b.reachL : b.reachR;
  const w = reach ? clamp(side < 0 ? (b.reachLw ?? 1) : (b.reachRw ?? 1)) : 0;
  if (w <= 0) return pts;
  const tl = worldToLocal(b, reach);
  const tgt = [lerp(pts[2][0], tl[0], w), lerp(pts[2][1], tl[1], w)];
  const arc = (side < 0 ? b.reachArcL : b.reachArcR) || 0;
  const straight = [lerp(pts[0][0], tgt[0], 0.5), lerp(pts[0][1], tgt[1], 0.5) + 12 + arc / sqOf(b)];
  return [pts[0], [lerp(pts[1][0], straight[0], w), lerp(pts[1][1], straight[1], w)], tgt];
}
// World position of a paw in the cute look (follows reaching too).
function pawWorldCute(b, side) { return localToWorld(b, cuteArmPoints(b, side)[2]); }

function drawArm(ctx, b, side) {
  const reach = side < 0 ? b.reachL : b.reachR;
  if (reach && !CUTE) {
    // stretchy cartoon arm straight to a world-space target
    const lx = (reach[0] - b.x) / (b.s * b.flip);
    const ly = (reach[1] - b.y) / b.s + b.bob;
    const sx = side * (CUTE ? 100 : 112), sy = CUTE ? -268 : -285;
    const mid = [lerp(sx, lx, 0.5), lerp(sy, ly, 0.5) + 14];
    const th = (b.who === 'her' ? 52 : 57) * (CUTE ? 0.92 : 1);
    outlinedStroke(ctx, [[sx, sy], mid, [lx, ly]], th, PAL.fur, PAL.out, LW);
    return [lx, ly];
  }
  const p = ARM_PRESETS[b.arms] || {};
  const a = side < 0 ? (p.aL ?? b.aL) : (p.aR ?? b.aR);
  const bend = side < 0 ? (p.bL ?? b.bL) : (p.bR ?? b.bR);
  const pts = CUTE ? cuteArmPoints(b, side) : armPoints(side, a, bend, b.s, b.foreLen);
  const th = (b.who === 'her' ? 52 : 57) * (CUTE ? 0.92 : 1);
  outlinedStroke(ctx, pts, th, PAL.fur, PAL.out, LW, CUTE);
  if (CUTE) {
    // round little paw at the end + soft shade, no hard elbow
    const pad = side < 0 ? b.padL : b.padR;
    if (!pad) {
      ellipse(ctx, pts[2][0], pts[2][1], th * 0.56, th * 0.54);
      fillStroke(ctx, PAL.fur, PAL.out, LW);
      ctx.beginPath();
      for (const k of [-1, 1]) { ctx.moveTo(pts[2][0] + k * th * 0.16, pts[2][1] + th * 0.2); ctx.lineTo(pts[2][0] + k * th * 0.16, pts[2][1] + th * 0.42); }
      ctx.strokeStyle = PAL.out; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.stroke();
    } else drawPaw(ctx, pts[2][0], pts[2][1], th / 2 + 4, true, 0);
    return pts[2];
  }
  // soft shading along the underside of the arm
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(pts[1][0], pts[1][1] + th * 0.28);
  ctx.lineTo(pts[2][0], pts[2][1] + th * 0.28);
  ctx.strokeStyle = PAL.shade;
  ctx.lineWidth = th * 0.25;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
  const pad = side < 0 ? b.padL : b.padR;
  if (pad) drawPaw(ctx, pts[2][0], pts[2][1], th / 2 + 2, true, 0);
  return pts[2];
}

// ---------- body ----------
function drawBody(ctx, b, t) {
  const her = b.who === 'her';
  const bk = CUTE ? 0.88 : 1;
  const rx = (her ? 136 : 146) * bk, ry = (her ? 160 : 168) * (CUTE ? 0.86 : 1);
  const wk = b.walkAmt;
  const liftL = wk * 26 * Math.max(0, Math.sin(b.walk));
  const liftR = wk * 26 * Math.max(0, -Math.sin(b.walk));
  if (b.pose === 'sit') {
    // legs stick out to the front, soles towards the camera
    for (const side of [-1, 1]) {
      ellipse(ctx, side * 78, -26, 50, 44);
      fillStroke(ctx, PAL.fur, PAL.out, LW);
      ellipse(ctx, side * 78, -18, 22, 17);
      ctx.fillStyle = PAL.pad; ctx.fill();
      for (const k of [-1, 0, 1]) { ellipse(ctx, side * 78 + k * 18, -46 - (k === 0 ? 4 : 0), 7.5, 8.5); ctx.fill(); }
    }
  } else {
    for (const side of [-1, 1]) {
      const lift = side < 0 ? liftL : liftR;
      ellipse(ctx, side * 64, -26 - lift, 50, 30);
      fillStroke(ctx, PAL.fur, PAL.out, LW);
      // toes
      ctx.beginPath();
      for (const k of [-1, 1]) { ctx.moveTo(side * 64 + k * 14, -12 - lift); ctx.lineTo(side * 64 + k * 14, -22 - lift); }
      ctx.strokeStyle = PAL.out; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
    }
  }
  const cy = (b.pose === 'sit' ? -200 : -192) + (CUTE ? 18 : 0);
  const wk2 = 1 - 0.07 * (b.wet || 0);
  const bodyPath = () => bodyShape(ctx, 0, cy, rx * wk2, (b.pose === 'sit' ? ry * 0.95 : ry), b.puff || 0);
  furFill(ctx, bodyPath, [-16, -18], b.frost, [-rx * 0.3, cy - ry * 0.45, ry * 1.7]);
  if (b.wet > 0) wetTint(ctx, bodyPath, b.wet);
  // belly
  ellipse(ctx, 0, cy + 30, rx * 0.62, ry * 0.62);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
}

// ---------- head ----------
function headGeom(b) {
  const her = b.who === 'her';
  const k = CUTE ? 1.1 : 1;
  return { rx: (her ? 146 : 152) * k, ry: (her ? 130 : 134) * k };
}

function drawEars(ctx, b, hx, hy, rx, ry, look) {
  for (const side of [-1, 1]) {
    const pf = b.puff || 0;
    const ex = hx + side * rx * (0.66 + 0.07 * pf) + look * rx * 0.06;
    const ey = hy - ry * ((CUTE ? 0.78 : 0.8) + 0.12 * pf);
    ellipse(ctx, ex, ey, rx * (CUTE ? 0.25 : 0.27), rx * (CUTE ? 0.25 : 0.26));
    fillStroke(ctx, PAL.fur, PAL.out, LW);
    ellipse(ctx, ex + side * 2, ey + 3, rx * 0.15, rx * 0.14);
    ctx.fillStyle = PAL.innerEar[b.who];
    ctx.fill();
  }
}

function drawTuft(ctx, hx, hy, ry) {
  ctx.beginPath();
  ctx.moveTo(hx - 30, hy - ry + 14);
  ctx.quadraticCurveTo(hx - 26, hy - ry - 30, hx - 6, hy - ry - 38);
  ctx.quadraticCurveTo(hx - 10, hy - ry - 16, hx + 2, hy - ry - 12);
  ctx.quadraticCurveTo(hx + 16, hy - ry - 40, hx + 36, hy - ry - 30);
  ctx.quadraticCurveTo(hx + 22, hy - ry - 14, hx + 30, hy - ry + 14);
  ctx.closePath();
  fillStroke(ctx, PAL.fur, PAL.out, LW);
}

function drawBow(ctx, x, y, s, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(side * 30, -46, side * 74, -36, side * 70, 0);
    ctx.bezierCurveTo(side * 74, 36, side * 30, 46, 0, 0);
    ctx.closePath();
    fillStroke(ctx, PAL.bow, PAL.out, LW);
    ctx.beginPath();
    ctx.moveTo(side * 16, -6);
    ctx.quadraticCurveTo(side * 40, -24, side * 56, -14);
    ctx.strokeStyle = PAL.bowLight; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(side * 20, 10);
    ctx.quadraticCurveTo(side * 42, 22, side * 58, 12);
    ctx.strokeStyle = PAL.bowDark; ctx.lineWidth = 5; ctx.stroke();
  }
  rrect(ctx, -17, -19, 34, 38, 12);
  fillStroke(ctx, PAL.bowDark, PAL.out, LW);
  ctx.restore();
}

function drawEye(ctx, b, ex, ey, side, t) {
  const her = b.who === 'her';
  const sc = (her ? 1.12 : 1) * b.eyeScale * (CUTE ? 1.25 : 1);
  const type = b.eyes;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (type === 'dot' || type === 'sparkle') {
    const big = type === 'sparkle';
    const rx = (big ? 22 : 13.5) * sc, ry0 = (big ? 26 : 17) * sc;
    const ry = ry0 * b.eyeOpen;
    const px = ex + b.pupil[0] * 6, py = ey + b.pupil[1] * 5;
    if (b.eyeOpen < 0.18) {
      ctx.beginPath();
      ctx.moveTo(px - rx, py);
      ctx.quadraticCurveTo(px, py + 5, px + rx, py);
      ctx.strokeStyle = PAL.eye; ctx.lineWidth = 6; ctx.stroke();
    } else {
      ellipse(ctx, px, py, rx, ry);
      ctx.fillStyle = PAL.eye; ctx.fill();
      if (big) {
        ctx.save();
        ellipse(ctx, px, py, rx, ry); ctx.clip();
        ellipse(ctx, px, py + ry * 0.75, rx * 1.1, ry * 0.6);
        ctx.fillStyle = 'rgba(110,170,255,0.45)'; ctx.fill();
        ctx.restore();
      }
      const hs = big ? 1.9 : 1;
      ctx.fillStyle = '#fff';
      ellipse(ctx, px - rx * 0.32, py - ry * 0.36, 5.2 * sc * hs, 5.2 * sc * hs * Math.min(1, b.eyeOpen * 1.3)); ctx.fill();
      ellipse(ctx, px + rx * 0.3, py + ry * 0.3, 2.4 * sc * hs, 2.4 * sc * hs * b.eyeOpen); ctx.fill();
      if (big || CUTE) { ellipse(ctx, px + rx * 0.38, py - ry * 0.5, 2.6 * sc, 2.6 * sc * b.eyeOpen); ctx.fill(); }
      if (CUTE && !big) {
        ctx.save();
        ellipse(ctx, px, py, rx, ry); ctx.clip();
        ellipse(ctx, px, py + ry * 0.9, rx * 0.95, ry * 0.45);
        ctx.fillStyle = 'rgba(150,120,200,0.35)'; ctx.fill();
        ctx.restore();
      }
    }
    if (b.smileEyes > 0 && b.eyeOpen >= 0.18) {
      // cheeks push the lower lids up: happy squint
      const lift = b.smileEyes * ry * 0.75;
      ctx.save();
      ellipse(ctx, px, py + ry * 1.35 - lift, rx * 1.7, ry * 0.95);
      ctx.fillStyle = PAL.fur; ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px, py + ry * 1.35 - lift, rx * 1.15, ry * 0.95, 0, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = PAL.eye; ctx.lineWidth = 4; ctx.stroke();
      ctx.restore();
    }
    if (her && b.eyeOpen >= 0.18) {
      // lashes on the outer corner
      ctx.strokeStyle = PAL.eye; ctx.lineWidth = 4.5;
      for (const k of [0, 1]) {
        ctx.beginPath();
        const ax = px + side * rx * 0.75, ay = py - ry * (0.55 - k * 0.45);
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + side * (13 - k * 2), ay - 8 + k * 2);
        ctx.stroke();
      }
    }
  } else if (type === 'happy') {
    ctx.beginPath();
    ctx.arc(ex, ey + 8, 15 * sc, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = PAL.eye; ctx.lineWidth = 7; ctx.stroke();
  } else if (type === 'sleep') {
    ctx.beginPath();
    ctx.arc(ex, ey - 6, 15 * sc, Math.PI * 0.15, Math.PI * 0.85);
    ctx.strokeStyle = PAL.eye; ctx.lineWidth = 6.5; ctx.stroke();
    if (her) {
      ctx.beginPath();
      ctx.moveTo(ex + side * 13 * sc, ey + 2);
      ctx.lineTo(ex + side * 22 * sc, ey + 8);
      ctx.lineWidth = 4.5; ctx.stroke();
    }
  } else if (type === 'shock') {
    ellipse(ctx, ex, ey - 4, 22 * sc, 27 * sc);
    fillStroke(ctx, '#fff', PAL.out, 5);
    ellipse(ctx, ex + b.pupil[0] * 7, ey - 4 + b.pupil[1] * 7, 7 * sc, 7.5 * sc);
    ctx.fillStyle = PAL.eye; ctx.fill();
  } else if (type === 'heart') {
    const pulse = 1 + 0.12 * Math.sin(t * 14);
    heartPath(ctx, ex, ey + 2, 21 * sc * pulse);
    fillStroke(ctx, '#FF4D6D', PAL.out, 4);
    ellipse(ctx, ex - 7 * sc, ey - 8 * sc, 4, 3); ctx.fillStyle = '#fff'; ctx.fill();
  } else if (type === 'spiral') {
    ctx.beginPath();
    for (let i = 0; i < 60; i++) {
      const a = i * 0.32 + t * 9 * side;
      const r = i * 0.33 * sc;
      const x = ex + Math.cos(a) * r, y = ey + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = PAL.eye; ctx.lineWidth = 4.5; ctx.stroke();
  } else if (type === 'x') {
    ctx.beginPath();
    ctx.moveTo(ex - 12, ey - 12); ctx.lineTo(ex + 12, ey + 12);
    ctx.moveTo(ex + 12, ey - 12); ctx.lineTo(ex - 12, ey + 12);
    ctx.strokeStyle = PAL.eye; ctx.lineWidth = 6.5; ctx.stroke();
  } else if (type === 'line') {
    ctx.beginPath();
    ctx.moveTo(ex - 15, ey); ctx.lineTo(ex + 15, ey);
    ctx.strokeStyle = PAL.eye; ctx.lineWidth = 6.5; ctx.stroke();
  } else if (type === 'teary') {
    ellipse(ctx, ex, ey, 18 * sc, 21 * sc);
    ctx.fillStyle = PAL.eye; ctx.fill();
    ctx.fillStyle = '#fff';
    ellipse(ctx, ex - 6 * sc, ey - 7 * sc, 7 * sc, 7 * sc); ctx.fill();
    ellipse(ctx, ex + 6 * sc, ey + 7 * sc, 3.5 * sc, 3.5 * sc); ctx.fill();
    ctx.save();
    ellipse(ctx, ex, ey, 18 * sc, 21 * sc); ctx.clip();
    ellipse(ctx, ex, ey + 18 * sc, 22 * sc, 12 * sc);
    ctx.fillStyle = 'rgba(130,190,255,0.6)'; ctx.fill();
    ctx.restore();
  }
  // upper lid (half-closed / angry glare). lidTilt > 0 lowers the inner corner.
  if (b.lid > 0 && ['dot', 'sparkle', 'teary', 'shock'].includes(type) && b.eyeOpen >= 0.18) {
    const r = (type === 'shock' ? 30 : 22) * sc;
    const yl = ey - r + 2 * r * b.lid;
    const tilt = b.lidTilt * 14;
    const xin = ex - side * r * 1.4, xout = ex + side * r * 1.4;
    ctx.beginPath();
    ctx.moveTo(xout, yl - tilt);
    ctx.lineTo(xin, yl + tilt);
    ctx.lineTo(xin, ey - r * 2.2);
    ctx.lineTo(xout, ey - r * 2.2);
    ctx.closePath();
    ctx.fillStyle = PAL.fur;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ex + side * r * 0.95, yl - tilt * 0.68);
    ctx.lineTo(ex - side * r * 0.95, yl + tilt * 0.68);
    ctx.strokeStyle = PAL.out; ctx.lineWidth = 5.5; ctx.stroke();
  }
  ctx.restore();
}

function drawBrow(ctx, b, ex, ey, side) {
  if (!b.brows) return;
  const yy = ey - 40 + b.browY;
  let inner, outer, mid = null;
  const xi = ex - side * 18, xo = ex + side * 20;
  if (b.brows === 'angry') { inner = [xi, yy + 16]; outer = [xo, yy - 6]; }
  else if (b.brows === 'sad' || b.brows === 'worried') { inner = [xi, yy - 8]; outer = [xo, yy + 8]; }
  else if (b.brows === 'raised') { inner = [xi, yy - 6]; outer = [xo, yy - 4]; mid = [ex, yy - 18]; }
  else if (b.brows === 'sus') {
    if (side < 0) { inner = [xi, yy + 10]; outer = [xo, yy + 10]; }
    else { inner = [xi, yy - 4]; outer = [xo, yy - 6]; mid = [ex, yy - 18]; }
  } else { inner = [xi, yy]; outer = [xo, yy]; }
  ctx.beginPath();
  ctx.moveTo(outer[0], outer[1]);
  if (mid) ctx.quadraticCurveTo(mid[0], mid[1], inner[0], inner[1]); else ctx.lineTo(inner[0], inner[1]);
  ctx.strokeStyle = PAL.out;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawMouth(ctx, b, mx, my, t) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PAL.out;
  ctx.lineWidth = 5.5;
  const ms = b.mouthScale;
  ctx.translate(mx, my);
  ctx.scale(ms, ms);
  const open = clamp(b.talk, 0, 1.3);
  let type = b.mouth;
  if (open > 0.06) type = b.talkMood === 'angry' || b.talkMood === 'shout' ? 'talkAngry' : 'talk';

  const openShape = (rx, ry, oy) => {
    ellipse(ctx, 0, oy, rx, ry);
    ctx.fillStyle = PAL.mouthIn; ctx.fill();
    ctx.save();
    ellipse(ctx, 0, oy, rx, ry); ctx.clip();
    ellipse(ctx, 0, oy + ry * 0.85, rx * 0.75, ry * 0.55);
    ctx.fillStyle = PAL.tongue; ctx.fill();
    ctx.restore();
    ellipse(ctx, 0, oy, rx, ry);
    ctx.stroke();
  };

  // philtrum: short line from nose to mouth
  if (!['yawn', 'scream'].includes(type)) {
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, 0); ctx.stroke();
  }
  switch (type) {
    case 'w':
      ctx.beginPath();
      ctx.arc(-11, 0, 11, 0, Math.PI);
      ctx.moveTo(22, 0);
      ctx.arc(11, 0, 11, 0, Math.PI);
      ctx.stroke();
      break;
    case 'smile':
      ctx.beginPath();
      ctx.moveTo(-26, 2); ctx.quadraticCurveTo(0, 24, 26, 2); ctx.stroke();
      break;
    case 'grin':
      ctx.beginPath();
      ctx.moveTo(-30, 2); ctx.quadraticCurveTo(0, 50, 30, 2); ctx.closePath();
      ctx.fillStyle = PAL.mouthIn; ctx.fill();
      ctx.save(); ctx.clip();
      ellipse(ctx, 0, 30, 18, 12); ctx.fillStyle = PAL.tongue; ctx.fill();
      ctx.restore();
      ctx.stroke();
      break;
    case 'frown':
      ctx.beginPath(); ctx.moveTo(-22, 16); ctx.quadraticCurveTo(0, -4, 22, 16); ctx.stroke();
      break;
    case 'flat':
      ctx.beginPath(); ctx.moveTo(-20, 8); ctx.lineTo(20, 8); ctx.stroke();
      break;
    case 'o':
      openShape(10, 12, 12);
      break;
    case 'bigO':
      openShape(18, 24, 20);
      break;
    case 'yawn': {
      const k = 0.7 + 0.3 * Math.sin(t * 3);
      openShape(26, 40 * k, 30);
      break;
    }
    case 'scream':
      openShape(30, 44, 30);
      break;
    case 'wobbly':
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const x = -24 + i * 6, y = 8 + (i % 2 ? -5 : 5);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    case 'smirk':
      ctx.beginPath(); ctx.moveTo(-20, 8); ctx.quadraticCurveTo(4, 16, 24, -4); ctx.stroke();
      break;
    case 'pout':
      ellipse(ctx, 0, 10, 11, 8);
      ctx.fillStyle = '#F27C98'; ctx.fill(); ctx.stroke();
      break;
    case 'teeth':
      rrect(ctx, -28, 0, 56, 26, 8);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-28, 13); ctx.lineTo(28, 13);
      for (const x of [-14, 0, 14]) { ctx.moveTo(x, 0); ctx.lineTo(x, 26); }
      ctx.lineWidth = 3.5; ctx.stroke();
      break;
    case 'tongue':
      openShape(20, 14, 10);
      ctx.beginPath();
      ctx.moveTo(-12, 14);
      ctx.quadraticCurveTo(-14, 46 + 4 * Math.sin(t * 12), 0, 48 + 4 * Math.sin(t * 12));
      ctx.quadraticCurveTo(14, 46 + 4 * Math.sin(t * 12), 12, 14);
      ctx.closePath();
      ctx.fillStyle = PAL.tongue; ctx.fill(); ctx.stroke();
      break;
    case 'chew': {
      const c = Math.sin(t * 16);
      ctx.beginPath();
      ctx.moveTo(-16, 8 + c * 3); ctx.quadraticCurveTo(0, 14 - c * 4, 16, 8 + c * 3);
      ctx.stroke();
      break;
    }
    case 'talk':
      openShape(14 + 6 * open, 5 + 17 * open, 8 + 8 * open);
      break;
    case 'talkAngry': {
      const w = 22 + 8 * open, h = 8 + 20 * open;
      rrect(ctx, -w, 4, w * 2, h, 10);
      ctx.fillStyle = PAL.mouthIn; ctx.fill();
      ctx.save(); ctx.clip();
      rrect(ctx, -w, 4, w * 2, 8, 2); ctx.fillStyle = '#fff'; ctx.fill();
      ellipse(ctx, 0, 4 + h, w * 0.6, h * 0.4); ctx.fillStyle = PAL.tongue; ctx.fill();
      ctx.restore();
      rrect(ctx, -w, 4, w * 2, h, 10); ctx.stroke();
      break;
    }
    case 'none':
      break;
    default:
      break;
  }
  ctx.restore();
}

function drawHead(ctx, b, t, hx, hy) {
  const her = b.who === 'her';
  const { rx, ry } = headGeom(b);
  const look = clamp(b.look * b.flip, -1, 1);
  const lookY = b.lookY;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(b.headTilt);
  ctx.scale(1 / Math.sqrt(b.headSquash), b.headSquash);
  ctx.translate(-hx, -hy);

  drawEars(ctx, b, hx, hy, rx, ry, look);
  if (!her) {
    ctx.save();
    ctx.translate(hx, hy - ry);
    ctx.rotate((b.tuftSwing || 0) + 0.55 * (b.wet || 0));
    ctx.translate(-hx, -(hy - ry));
    drawTuft(ctx, hx + look * 14, hy, ry);
    ctx.restore();
  }
  const hrx = rx * (1 - 0.05 * (b.wet || 0));
  const headPath = () => headShape(ctx, hx, hy, hrx, ry, 1 - (b.wet || 0), t, b.puff || 0);
  furFill(ctx, headPath, [-14, -16], b.frost, [hx - rx * 0.32, hy - ry * 0.42, Math.max(rx, ry) * 1.6]);
  if (b.wet > 0) wetTint(ctx, headPath, b.wet);
  if (b.redFace > 0) {
    ctx.save();
    headShape(ctx, hx, hy, rx, ry, 1, t); ctx.clip();
    const g = ctx.createLinearGradient(0, hy + ry, 0, hy - ry);
    g.addColorStop(0, `rgba(255,70,70,${0.75 * b.redFace})`);
    g.addColorStop(clamp(b.redFace), `rgba(255,70,70,${0.6 * b.redFace})`);
    g.addColorStop(Math.min(1, b.redFace + 0.01), 'rgba(255,70,70,0)');
    ctx.fillStyle = g;
    ctx.fillRect(hx - rx * 1.2, hy - ry * 1.2, rx * 2.4, ry * 2.4);
    ctx.restore();
  }

  // face features shift with look direction
  const fx = hx + look * rx * 0.2;
  const fy = hy + lookY * ry * 0.12;
  const spread = rx * (CUTE ? 0.39 : 0.36) * (1 - 0.12 * Math.abs(look));

  // muzzle
  const puff = b.cheekPuff;
  const mzx = fx + look * rx * 0.05, mzy = fy + ry * (CUTE ? 0.37 : 0.33);
  const mzw = rx * (CUTE ? 0.37 : 0.43), mzh = ry * (CUTE ? 0.28 : 0.33);
  if (puff > 0) {
    for (const side of [-1, 1]) {
      ellipse(ctx, mzx + side * (40 + 10 * puff), mzy + 4, 30 * puff + 8, 26 * puff + 8);
      fillStroke(ctx, PAL.muzzle, PAL.out, 4);
    }
  }
  ellipse(ctx, mzx, mzy, mzw + puff * 10, mzh);
  ctx.fillStyle = CUTE ? '#F2EAF4' : '#EDF1F6';
  ctx.fill();
  ctx.save();
  ellipse(ctx, mzx, mzy, mzw + puff * 10, mzh);
  ctx.clip();
  ellipse(ctx, mzx - 4, mzy - 9, mzw + puff * 10, mzh);
  ctx.fillStyle = PAL.muzzle;
  ctx.fill();
  ctx.restore();
  ellipse(ctx, mzx, mzy, mzw + puff * 10, mzh);
  ctx.strokeStyle = CUTE ? 'rgba(91,74,96,0.3)' : 'rgba(51,58,71,0.35)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // blush
  if (b.blush > 0) {
    for (const side of [-1, 1]) {
      const bx = fx + side * rx * (CUTE ? 0.62 : 0.6), by = fy + ry * (CUTE ? 0.26 : 0.2);
      const br = CUTE ? 44 : 34;
      const g = ctx.createRadialGradient(bx, by, 2, bx, by, br);
      g.addColorStop(0, `rgba(${PAL.blush},${0.55 * b.blush})`);
      g.addColorStop(1, `rgba(${PAL.blush},0)`);
      ctx.fillStyle = g;
      ellipse(ctx, bx, by, br + 2, br * 0.75);
      ctx.fill();
      if (b.blushLines > 0) {
        ctx.save();
        ctx.globalAlpha = b.blushLines;
        ctx.strokeStyle = '#F2557F'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
        ctx.beginPath();
        for (const k of [-1, 0, 1]) { ctx.moveTo(bx + k * 12 - 4, by + 7); ctx.lineTo(bx + k * 12 + 4, by - 7); }
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // under-eye bags
  if (b.bags > 0) {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.globalAlpha = b.bags;
      ctx.beginPath();
      const bx = fx + side * spread, by = fy - ry * 0.1 + 26;
      ctx.arc(bx, by - 10, 20, Math.PI * 0.2, Math.PI * 0.8);
      ctx.strokeStyle = '#8D7FA6'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by - 4, 22, Math.PI * 0.25, Math.PI * 0.75);
      ctx.strokeStyle = 'rgba(141,127,166,0.6)'; ctx.lineWidth = 4; ctx.stroke();
      ctx.restore();
    }
  }

  // eyes + brows
  for (const side of [-1, 1]) {
    const ex = fx + side * spread;
    const ey = fy - ry * (CUTE ? 0.03 : 0.12);
    drawEye(ctx, b, ex, ey, side, t);
    drawBrow(ctx, b, ex, ey, side);
  }

  // nose
  const nx = fx + look * rx * 0.08, ny = fy + ry * (CUTE ? 0.24 : 0.17);
  ctx.beginPath();
  ctx.moveTo(nx - 24, ny - 8);
  ctx.quadraticCurveTo(nx, ny - 20, nx + 24, ny - 8);
  ctx.quadraticCurveTo(nx + 22, ny + 8, nx, ny + 16);
  ctx.quadraticCurveTo(nx - 22, ny + 8, nx - 24, ny - 8);
  ctx.closePath();
  ctx.fillStyle = PAL.nose;
  ctx.fill();
  if (b.redNose > 0) {
    // sick: red, slightly swollen nose with a pink glow around it
    const g = ctx.createRadialGradient(nx, ny, 4, nx, ny, 46);
    g.addColorStop(0, `rgba(255,110,130,${0.55 * b.redNose})`); g.addColorStop(1, 'rgba(255,110,130,0)');
    ctx.fillStyle = g; ellipse(ctx, nx, ny, 46, 38); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(nx - 26, ny - 9);
    ctx.quadraticCurveTo(nx, ny - 23, nx + 26, ny - 9);
    ctx.quadraticCurveTo(nx + 24, ny + 10, nx, ny + 18);
    ctx.quadraticCurveTo(nx - 24, ny + 10, nx - 26, ny - 9);
    ctx.closePath();
    ctx.fillStyle = `rgba(232,72,98,${b.redNose})`; ctx.fill();
  }
  ellipse(ctx, nx - 7, ny - 7, 7, 4, -0.2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fill();

  // mouth
  drawMouth(ctx, b, nx, ny + 28, t);

  // snot bubble (sleeping)
  if (b.snot > 0) {
    const r = 6 + 34 * b.snot;
    const sx = nx + 22 + r * 0.7, sy = ny + 4 - r * 0.2;
    ellipse(ctx, sx, sy, r, r * 0.95);
    ctx.fillStyle = 'rgba(170,215,255,0.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(90,150,210,0.8)'; ctx.lineWidth = 3; ctx.stroke();
    ellipse(ctx, sx - r * 0.35, sy - r * 0.35, r * 0.22, r * 0.14, -0.6);
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
  }

  // crumbs around the mouth
  if (b.crumbs > 0) {
    const r = mulberry32(42);
    ctx.fillStyle = '#C98B3E';
    for (let i = 0; i < Math.round(9 * b.crumbs); i++) {
      ellipse(ctx, nx + (r() - 0.5) * 90, ny + 30 + r() * 40, 4 + r() * 3, 3 + r() * 3, r() * 3);
      ctx.fill();
    }
  }

  // fish tail sticking out of the mouth
  if (b.fishTail > 0) {
    ctx.save();
    ctx.translate(nx + 18, ny + 40);
    ctx.rotate(0.5 + 0.08 * Math.sin(t * 10));
    ctx.scale(b.fishTail, b.fishTail);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(34, -6);
    ctx.lineTo(58, -26); ctx.quadraticCurveTo(50, 0, 60, 24);
    ctx.lineTo(34, 8);
    ctx.closePath();
    fillStroke(ctx, '#7FA7C9', PAL.out, 4.5);
    ctx.restore();
  }

  // shampoo foam on top of the head
  if (b.foam > 0) drawFoam(ctx, hx + look * 8, hy, rx, ry, b.foam, t, b.foamCol);
  // towel turban after the shower (hides the bow)
  if (b.turban > 0) drawTurban(ctx, hx + look * 6, hy, rx, ry, b.turban);
  // pink bow
  if (her && b.turban < 0.5) drawBow(ctx, hx + rx * 0.5 + look * 10, hy - ry * 0.84 - (b.foam > 0 ? 26 * b.foam : 0), 0.92, 0.32 + (b.bowSwing || 0));

  // frost: icicles hanging from the chin
  if (b.frost > 0.3) {
    ctx.save();
    ctx.globalAlpha = clamp((b.frost - 0.3) / 0.4);
    for (const [ox, len] of [[-50, 26], [-18, 40], [16, 30], [48, 22]]) {
      ctx.beginPath();
      const ix = hx + ox, iy = hy + ry * 0.94 - Math.abs(ox) * 0.12;
      ctx.moveTo(ix - 9, iy); ctx.lineTo(ix + 9, iy); ctx.lineTo(ix, iy + len * b.frost);
      ctx.closePath();
      fillStroke(ctx, '#CFEFFF', '#6FA9D8', 3);
    }
    ctx.restore();
  }

  ctx.restore();

  // ----- effects that do not rotate with the head -----
  if (b.sweat > 0) {
    const sx = hx + rx * 0.82, sy = hy - ry * 0.35 + (t * 40 % 30) * b.sweat;
    ctx.save();
    ctx.globalAlpha = clamp(b.sweat * 1.5);
    ctx.beginPath();
    ctx.moveTo(sx, sy - 34);
    ctx.quadraticCurveTo(sx + 20, sy - 2, sx, sy + 8);
    ctx.quadraticCurveTo(sx - 20, sy - 2, sx, sy - 34);
    fillStroke(ctx, PAL.sweat, '#4B8FC9', 4);
    ellipse(ctx, sx - 5, sy - 6, 4, 6); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
  }
  if (b.anger > 0) {
    // opposite side of her bow so the two don't overlap
    const ax = hx + (her ? -1 : 1) * rx * 0.62, ay = hy - ry * 0.72;
    const p = (0.85 + 0.2 * Math.abs(Math.sin(t * 9))) * b.anger;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.scale(p, p);
    ctx.strokeStyle = '#FF3B4E';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate(i * Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(8, -26);
      ctx.quadraticCurveTo(8, -8, 26, -8);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
  if (b.tears > 0) {
    ctx.save();
    ctx.globalAlpha = 0.85;
    for (const side of [-1, 1]) {
      const ex = fx + side * spread, ey = fy - ry * 0.12 + 16;
      const len = 120 * b.tears;
      const w = 12 + 3 * Math.sin(t * 20 + side);
      rrect(ctx, ex - w / 2 + side * 6, ey, w, len, w / 2);
      ctx.fillStyle = PAL.tear; ctx.fill();
      for (let i = 0; i < 3; i++) {
        const k = ((t * 1.6 + i / 3) % 1);
        ellipse(ctx, ex + side * (14 + k * 30), ey + len + k * 60, 7, 9);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  if (b.steam > 0) {
    ctx.save();
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const k = (t * 1.4 + i / 4) % 1;
        const px = hx + side * (rx * 0.8 + k * 70), py = hy - ry * 0.6 - k * 140;
        ctx.globalAlpha = b.steam * (1 - k) * 0.9;
        ellipse(ctx, px, py, 18 + k * 30, 16 + k * 26);
        ctx.fillStyle = '#F2F4F7'; ctx.fill();
        ctx.strokeStyle = 'rgba(120,130,150,0.6)'; ctx.lineWidth = 3; ctx.stroke();
      }
    }
    ctx.restore();
  }
}

// Wet fur: cooler, slightly darker tint + a few clumped strands.
function wetTint(ctx, pathFn, amt) {
  ctx.save();
  pathFn(); ctx.clip();
  ctx.fillStyle = `rgba(150,175,215,${0.26 * amt})`;
  ctx.fillRect(-600, -1200, 1200, 1400);
  ctx.restore();
}

// Cloud of shampoo foam sitting on top of the head.
function drawFoam(ctx, hx, hy, rx, ry, amt, t, col) {
  const r = mulberry32(5);
  const blobs = [];
  for (let i = 0; i < 8; i++) {
    const k = i / 7;
    const a = Math.PI * (1.1 + 0.8 * k);
    const rr = (40 + r() * 20) * amt * (0.8 + 0.25 * Math.sin(Math.PI * k));
    blobs.push([hx + Math.cos(a) * rx * 0.8, hy + Math.sin(a) * ry * 0.88 - 12 + Math.sin(t * 3 + i) * 2, rr]);
  }
  blobs.push([hx - 12, hy - ry - 18 * amt, 50 * amt], [hx + 40, hy - ry - 6 * amt, 40 * amt]);
  ctx.save();
  // outline pass, then fill pass: one clean cloud silhouette
  ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(91,74,96,0.6)';
  for (const [x, y, rr] of blobs) { ellipse(ctx, x, y, rr, rr * 0.9); ctx.stroke(); }
  ctx.fillStyle = col || '#FFFFFF';
  for (const [x, y, rr] of blobs) { ellipse(ctx, x, y, rr, rr * 0.9); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [x, y, rr] of blobs) { ellipse(ctx, x - rr * 0.3, y - rr * 0.35, rr * 0.22, rr * 0.16, -0.5); ctx.fill(); }
  // little bubbles rising off the foam
  for (let i = 0; i < 5; i++) {
    const k = (t * 0.7 + i / 5) % 1;
    const bx = hx + (i - 2) * 46 + Math.sin(k * 6 + i) * 12, by = hy - ry - 30 - k * 170;
    ctx.globalAlpha = amt * Math.sin(Math.PI * k);
    ellipse(ctx, bx, by, 9 + (i % 3) * 4, 9 + (i % 3) * 4);
    ctx.fillStyle = 'rgba(220,240,255,0.5)'; ctx.fill();
    ctx.strokeStyle = 'rgba(120,150,200,0.8)'; ctx.lineWidth = 3; ctx.stroke();
    ellipse(ctx, bx - 3, by - 3, 3, 2); ctx.fillStyle = '#fff'; ctx.fill();
  }
  ctx.restore();
}

// Pink towel wrapped around the head like a turban: a soft dome, a twisted band across it
// and the tucked-in end sticking up at the back.
function drawTurban(ctx, hx, hy, rx, ry, amt) {
  ctx.save();
  ctx.translate(hx, hy - ry * 0.5);
  const s = ease.outBack(clamp(amt));
  ctx.scale(s, s);
  const col = '#FFB8CC', dark = '#EE8FB0', light = '#FFDCE7';
  // tucked end (behind the dome)
  ctx.beginPath();
  ctx.moveTo(rx * 0.25, -ry * 0.9);
  ctx.bezierCurveTo(rx * 0.4, -ry * 1.45, rx * 0.95, -ry * 1.4, rx * 0.98, -ry * 1.05);
  ctx.bezierCurveTo(rx * 0.9, -ry * 0.95, rx * 0.75, -ry * 0.8, rx * 0.7, -ry * 0.6);
  ctx.closePath();
  fillStroke(ctx, col, PAL.out, LW);
  ctx.strokeStyle = dark; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(rx * 0.45, -ry * 0.95); ctx.quadraticCurveTo(rx * 0.6, -ry * 1.25, rx * 0.86, -ry * 1.12); ctx.stroke();
  // dome
  const dome = () => {
    ctx.beginPath();
    ctx.moveTo(-rx * 1.05, ry * 0.22);
    ctx.bezierCurveTo(-rx * 1.25, -ry * 0.75, -rx * 0.55, -ry * 1.18, rx * 0.12, -ry * 1.12);
    ctx.bezierCurveTo(rx * 0.95, -ry * 1.06, rx * 1.28, -ry * 0.55, rx * 1.05, ry * 0.22);
    ctx.bezierCurveTo(rx * 0.55, ry * 0.04, -rx * 0.55, ry * 0.04, -rx * 1.05, ry * 0.22);
    ctx.closePath();
  };
  dome();
  fillStroke(ctx, col, PAL.out, LW);
  ctx.save();
  dome(); ctx.clip();
  ctx.fillStyle = light;
  ellipse(ctx, -rx * 0.42, -ry * 0.72, rx * 0.42, ry * 0.2, -0.35); ctx.fill();
  // twisted band crossing the dome: overlapping lobes read as a twisted towel
  for (let i = 0; i < 5; i++) {
    const k = i / 4;
    const x = lerp(-rx * 0.95, rx * 0.55, k), y = lerp(ry * 0.02, -ry * 0.95, k) + Math.sin(k * Math.PI) * -ry * 0.12;
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.75);
    ellipse(ctx, 0, 0, rx * 0.24, ry * 0.17);
    fillStroke(ctx, i % 2 ? col : '#FFC6D6', PAL.out, 4);
    ctx.beginPath(); ctx.moveTo(-rx * 0.12, -ry * 0.04); ctx.quadraticCurveTo(0, ry * 0.06, rx * 0.12, -ry * 0.04);
    ctx.strokeStyle = dark; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.restore();
  }
  // terry-cloth texture: tiny dots
  ctx.fillStyle = 'rgba(238,143,176,0.45)';
  const r = mulberry32(8);
  for (let i = 0; i < 40; i++) { ellipse(ctx, (r() - 0.5) * rx * 2.2, -r() * ry * 1.2 + ry * 0.1, 2.5, 2.5); ctx.fill(); }
  ctx.restore();
  // band edge over the forehead
  ctx.beginPath();
  ctx.moveTo(-rx * 1.05, ry * 0.22);
  ctx.bezierCurveTo(-rx * 0.55, ry * 0.04, rx * 0.55, ry * 0.04, rx * 1.05, ry * 0.22);
  ctx.strokeStyle = PAL.out; ctx.lineWidth = LW; ctx.stroke();
  ctx.restore();
}

// Cartoon freeze: the bear stuck in a clear block of ice (pops in with a little overshoot).
function drawIceBlock(ctx, b, t, hy) {
  const g = headGeom(b);
  const a = clamp(b.iceBlock);
  const top = hy - g.ry - 95, bottom = 20, w = g.rx + 70;
  const cy = (top + bottom) / 2;
  const s = ease.outBack(a);
  ctx.save();
  ctx.translate(0, cy); ctx.scale(s, s); ctx.translate(0, -cy);
  rrect(ctx, -w, top, w * 2, bottom - top, 46);
  ctx.fillStyle = 'rgba(185,228,255,0.45)'; ctx.fill();
  ctx.strokeStyle = '#78B4E4'; ctx.lineWidth = 8; ctx.stroke();
  ctx.save();
  rrect(ctx, -w, top, w * 2, bottom - top, 46); ctx.clip();
  // inner bevel + highlights
  rrect(ctx, -w + 16, top + 16, w * 2 - 32, bottom - top - 32, 34);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineCap = 'round';
  ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-w + 46, top + 70); ctx.lineTo(-w + 46, top + 220); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-w + 80, top + 52); ctx.lineTo(-w + 150, top + 40); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(w - 46, bottom - 150); ctx.lineTo(w - 46, bottom - 70); ctx.stroke();
  ctx.restore();
  sparkle(ctx, w - 30, top + 30, 20, t * 2, '#FFFFFF');
  sparkle(ctx, -w + 34, bottom - 40, 14, -t * 2, '#FFFFFF');
  ctx.restore();
}

// Drops running off wet fur.
function drawDrips(ctx, b, t, hy) {
  ctx.save();
  ctx.globalAlpha = clamp(b.wet * 1.5);
  const r = mulberry32(b.who === 'her' ? 17 : 9);
  for (let i = 0; i < 6; i++) {
    const x0 = (r() - 0.5) * 300, y0 = i < 3 ? hy + 120 + r() * 30 : -120 - r() * 120;
    const sp = 0.9 + r() * 0.6, ph = r();
    const k = (t * sp + ph) % 1;
    const y = y0 + k * k * 160;
    ctx.globalAlpha = clamp(b.wet * 1.5) * (1 - k);
    ctx.beginPath();
    ctx.moveTo(x0, y - 16); ctx.quadraticCurveTo(x0 + 9, y + 2, x0, y + 6); ctx.quadraticCurveTo(x0 - 9, y + 2, x0, y - 16);
    fillStroke(ctx, PAL.sweat, '#4B8FC9', 3);
  }
  ctx.restore();
}

// ---------- melting puddle ----------
function drawPuddle(ctx, b, t) {
  if (b.melt <= 0) return;
  const w = 140 + 260 * b.melt;
  ctx.beginPath();
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU;
    const wob = 1 + 0.07 * Math.sin(a * 5 + t * 2);
    const x = Math.cos(a) * w * wob, y = -6 + Math.sin(a) * (24 + 14 * b.melt) * wob;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  fillStroke(ctx, '#F4F8FC', PAL.out, LW);
  ellipse(ctx, -w * 0.4, -14, w * 0.25, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
}

// ---------- main entry ----------
function drawBear(ctx, b, t) {
  ctx.save();
  let jx = 0, jy = 0;
  if (b.shiver > 0) { jx = noise1(t * 70, 11) * 7 * b.shiver; jy = noise1(t * 63, 13) * 3 * b.shiver; }
  ctx.translate(b.x + jx, b.y + jy - b.hop);

  if (b.pose !== 'head') {
    // ground shadow (does not lean)
    ctx.save();
    ctx.scale(b.s, b.s);
    ellipse(ctx, 0, -4 + b.hop / b.s, 170 * (1 - b.hop / 900), 26);
    ctx.fillStyle = CUTE ? 'rgba(90,60,110,0.13)' : 'rgba(20,25,40,0.16)';
    ctx.fill();
    drawPuddle(ctx, b, t);
    ctx.restore();
  }

  ctx.scale(b.s * b.flip, b.s);
  ctx.rotate(b.lean * b.flip);
  const melt = b.melt;
  const sq = b.squash * (1 - 0.6 * melt);
  ctx.scale(1 / Math.sqrt(sq), sq);

  const bodyBob = b.bob + (b.walkAmt ? Math.abs(Math.sin(b.walk)) * 10 * b.walkAmt : 0);
  if (b.pose === 'head') {
    drawHead(ctx, b, t, 0, 0);
    ctx.restore();
    return;
  }
  ctx.translate(0, -bodyBob);
  if (!b.hideBody) {
    drawBody(ctx, b, t);
    if (b.arms !== 'face') { drawArm(ctx, b, -1); drawArm(ctx, b, 1); }
  }
  const hy = (b.pose === 'sit' ? -398 : -404) - bodyBob * 0.4;
  if (b.arms === 'face') {
    // arms go up behind the head, paws are drawn on top of the eyes afterwards
    const g = headGeom(b);
    for (const side of [-1, 1]) {
      outlinedStroke(ctx, [[side * 112, -285], [side * 130, -250], [side * g.rx * 0.38, hy - 10]], b.who === 'her' ? 52 : 57, PAL.fur, PAL.out, LW);
    }
  }
  drawHead(ctx, b, t, 0, hy);
  if (b.wet > 0) drawDrips(ctx, b, t, hy);
  if (b.iceBlock > 0) drawIceBlock(ctx, b, t, hy);
  if (b.arms === 'face') {
    const g = headGeom(b);
    for (const side of [-1, 1]) drawPaw(ctx, side * g.rx * 0.36, hy - g.ry * 0.12 + 4, 34, true, side * 0.2);
  }
  ctx.restore();
}

// World position of a paw for free/preset arms (ignores lean and squash).
function pawWorld(b, side) {
  const p = ARM_PRESETS[b.arms] || {};
  const a = side < 0 ? (p.aL ?? b.aL) : (p.aR ?? b.aR);
  const bend = side < 0 ? (p.bL ?? b.bL) : (p.bR ?? b.bR);
  const pts = armPoints(side, a, bend, b.s, b.foreLen);
  return [b.x + pts[2][0] * b.s * b.flip, b.y + (pts[2][1] - b.bob) * b.s];
}
// World centre of the head and its scale.
function headWorld(b) {
  if (b.pose === 'head') return [b.x, b.y, b.s];
  const hy = (b.pose === 'sit' ? -398 : -404) - b.bob;
  return [b.x, b.y - b.hop + hy * b.s * b.squash, b.s];
}

// Where a bear's mouth ends up in world coordinates (for speech-bubble tails).
function bearMouth(b) {
  if (b.pose === 'head') return [b.x, b.y + 50 * b.s];
  const hy = (b.pose === 'sit' ? -398 : -404) - b.bob;
  return [b.x + b.look * 30 * b.s, b.y - b.hop + (hy + 60) * b.s * b.squash];
}
function bearTop(b) {
  if (b.pose === 'head') return [b.x, b.y - 170 * b.s];
  const hy = (b.pose === 'sit' ? -398 : -404) - b.bob;
  return [b.x, b.y - b.hop + (hy - 150) * b.s * b.squash];
}
