// Skit 9 — "him vs her: taking a shower 🚿" (bathroom, almost no text)
// HIM: ice cold, one "10 in 1" bottle, two minutes, shakes himself dry into a puffball.
// HER: lava hot, a whole army of bottles, a shower concert, the room turns into a sauna, 1 h 47 min.
// US: knob war (he melts, she freezes) ... until she does puppy eyes and he melts for her.
useCuteLook();
const E = ease.inOutCubic, OB = ease.outBack, LIN = ease.linear;
const GRIP = [885, 1046];
const SHELF_SPOT = [285, 1228];
const SEG = { him: [0, 7.85], her: [7.85, 19.85], us: [19.85, 31.0] };

// ---------------- HIM ----------------
const scrubArms = [[0, ARMS.lap], [3.72, ARMS.lap]];
for (let k = 0, tt = 3.82; tt < 4.55; tt += 0.1, k++) scrubArms.push([tt, k % 2 ? [0.3, 1.0, 0.5, 1.85] : [0.5, 1.85, 0.3, 1.0], E]);
scrubArms.push([4.7, ARMS.lap, E], [5.85, ARMS.lap], [6.05, [0.95, 0.35, 0.95, 0.35], E], [6.5, [0.95, 0.35, 0.95, 0.35]],
  [6.75, ARMS.cheer, OB], [7.3, ARMS.cheer], [7.65, ARMS.lap, E]);

const himA = new Actor('him', { x: 565, y: BATH.feetY, s: 1.0, blush: 0.7, reachR: GRIP }, {
  x: [[0, 565], [0.7, 565], [1.05, 600, E], [1.5, 600], [1.9, 565, E], [4.85, 565], [5.15, 600, E], [5.45, 600], [5.8, 565, E]],
  lean: [[0, 0], [0.7, 0], [1.05, 0.07, E], [1.5, 0.07], [1.9, 0, E], [2.2, 0], [2.55, -0.06, E], [3.0, 0.02, E], [3.4, 0.02], [3.75, 0, E],
    [4.85, 0], [5.15, 0.07, E], [5.45, 0.07], [5.8, 0, E]],
  reachRw: [[0, 0], [0.7, 0], [1.05, 1, E], [1.5, 1], [1.9, 0, E], [4.85, 0], [5.15, 1, E], [5.45, 1], [5.8, 0, E]],
  reachL: [[0, [300, 1162]], [2.55, [300, 1162]], [3.0, [452, 905], E], [3.35, [452, 905]]],
  reachLw: [[0, 0], [2.2, 0], [2.55, 1, E], [3.35, 1], [3.7, 0, E]],
  look: [[0, 0.1], [0.6, 0.1], [0.85, 0.55, E], [1.45, 0.55], [1.7, 0, E], [2.1, 0], [2.3, -0.6, E], [2.6, -0.6], [2.9, -0.25, E],
    [3.4, -0.25], [3.6, 0, E], [4.8, 0], [5.0, 0.55, E], [5.45, 0.55], [5.65, 0, E]],
  lookY: [[0, 0], [2.6, 0], [2.85, -0.5, E], [3.35, -0.5], [3.6, 0, E]],
  eyes: [[0, 'dot'], [1.45, 'happy'], [2.15, 'dot'], [3.12, 'happy'], [5.0, 'dot'], [6.62, 'happy']],
  mouth: [[0, 'smile'], [1.45, 'grin'], [2.15, 'smile'], [3.12, 'grin'], [4.65, 'smile'], [5.45, 'flat'], [6.62, 'grin'], [7.3, 'smile']],
  frost: [[0, 0], [1.45, 0], [2.2, 0.22, E], [5.3, 0.22], [5.6, 0, E]],
  foam: [[0, 0], [3.08, 0], [3.42, 1, OB], [4.55, 1], [4.95, 0, E]],
  wet: [[0, 0], [5.3, 0], [5.6, 1, E], [6.58, 1], [6.62, 0, LIN]],
  puff: [[0, 0], [6.6, 0], [6.92, 1, OB]],
  blushLines: [[0, 0], [6.62, 0], [6.9, 1, E]],
  arms4: scrubArms,
  impulses: [[1.5, 'sigh', 0.8], [3.42, 'hop', 0.4], [3.85, 'wiggle', 1], [4.25, 'wiggle', 1], [5.92, 'dogshake', 1], [6.62, 'surprise', 0.7], [7.05, 'nod', 0.5]],
});

// ---------------- HER ----------------
const singTilt = [[7.85, 0], [11.75, 0]];
for (let k = 0, tt = 12.05; tt < 13.5; tt += 0.42, k++) singTilt.push([tt, k % 2 ? -0.13 : 0.13, E]);
singTilt.push([13.9, 0, E]);
const MIC = [0.2, 1.35, 0.85, 2.45];
const herB = new Actor('her', { x: 565, y: BATH.feetY, s: 0.95, blush: 1, reachR: GRIP, foamCol: '#FFE3EE' }, {
  x: [[7.85, 565], [8.6, 565], [8.95, 598, E], [9.6, 598], [9.95, 565, E]],
  lean: [[7.85, 0], [8.6, 0], [8.95, 0.07, E], [9.6, 0.07], [9.95, 0, E]],
  reachRw: [[7.85, 0], [8.6, 0], [8.95, 1, E], [9.6, 1], [9.95, 0, E]],
  look: [[7.85, 0], [8.5, 0], [8.75, 0.55, E], [9.6, 0.55], [9.85, 0.1, E], [10.05, 0.1], [10.3, -0.6, E], [11.45, -0.6], [11.7, 0, E]],
  lookY: [[7.85, 0], [10.1, 0], [10.35, -0.15, E], [11.45, -0.15], [11.7, 0, E]],
  headTilt: singTilt,
  eyes: [[7.85, 'dot'], [9.5, 'happy'], [10.12, 'sparkle'], [11.7, 'happy'], [16.35, 'sparkle'], [17.2, 'happy']],
  mouth: [[7.85, 'smile'], [9.5, 'grin'], [10.12, 'smile'], [11.78, 'bigO'], [12.1, 'o'], [12.3, 'bigO'], [12.75, 'o'], [12.95, 'bigO'],
    [13.4, 'o'], [13.6, 'bigO'], [15.0, 'smile'], [16.35, 'grin'], [17.2, 'smile']],
  foam: [[7.85, 0], [11.55, 0], [11.9, 1, OB], [14.95, 1], [15.0, 0, LIN]],
  turban: [[7.85, 0], [15.0, 0], [15.02, 1, LIN]],
  redFace: [[7.85, 0], [15.0, 0], [15.02, 0.22, LIN]],
  blushLines: [[7.85, 0], [9.5, 0], [9.8, 1, E], [10.2, 1], [10.5, 0, E], [15.0, 0], [15.02, 1, LIN]],
  arms4: [[7.85, ARMS.lap], [11.55, ARMS.lap], [11.8, MIC, E], [12.4, MIC], [12.6, [2.0, 0.2, 0.85, 2.45], OB], [13.3, [2.0, 0.2, 0.85, 2.45]],
    [13.6, MIC, E], [15.0, MIC], [15.02, ARMS.lap, LIN], [16.4, ARMS.lap], [16.7, ARMS.cheeks, OB], [17.7, ARMS.cheeks], [18.1, ARMS.lap, E]],
  impulses: [[9.55, 'wiggle', 1], [9.75, 'hop', 0.5], [10.15, 'surprise', 0.4], [12.58, 'hop', 0.6], [16.0, 'surprise', 0.5],
    [16.7, 'wiggle', 0.8], [17.3, 'nod', 0.6], [18.2, 'hop', 0.35]],
});

// ---------------- US ----------------
// knob war: he turns it cold, she turns it hot ...
const WAR = [[25.5, 1], [25.68, -1], [25.86, 1], [26.04, -1], [26.2, 1], [26.36, -1]];
const knobWar = [[25.43, -1]];
for (const [tt, v] of WAR) knobWar.push([tt, v, E]);
const OVER = [[520, 1000], [610, 890], [760, 868], [866, 1030]];
const overR = [[19.85, OVER[0]]], overArc = [[19.85, 0]], overW = [[19.85, 0]];
for (const [go, back] of [[22.75, 23.55], [24.85, 26.42], [27.1, 27.85]]) {
  overR.push([go, OVER[0]], [go + 0.15, OVER[1], E], [go + 0.32, OVER[2], E], [go + 0.5, OVER[3], E],
    [back, OVER[3]], [back + 0.15, OVER[2], E], [back + 0.3, OVER[1], E], [back + 0.42, OVER[0], E]);
  overArc.push([go, 0], [go + 0.15, -30, E], [go + 0.32, -150, E], [go + 0.5, -300, E],
    [back, -300], [back + 0.15, -150, E], [back + 0.3, -30, E], [back + 0.42, 0, E]);
  overW.push([go, 0], [go + 0.15, 1, E], [back + 0.27, 1], [back + 0.42, 0, E]);
}
const himC = new Actor('him', { x: 390, y: BATH.feetY, s: 0.92, blush: 0.7 }, {
  reachR: overR,
  reachArcR: overArc,
  look: [[19.85, 0.45], [21.5, 0.45], [21.7, 0.1, E], [22.7, 0.1], [22.95, 0.6, E], [23.6, 0.6], [23.8, 0.3, E], [24.3, 0.3], [24.5, 0.55, E], [26.5, 0.55], [26.7, 0.4, E]],
  lookY: [[19.85, 0], [26.9, 0], [27.3, 0.3, E], [27.6, 0.3], [27.8, -0.1, E]],
  reachRw: overW,
  eyes: [[19.85, 'dot'], [20.3, 'happy'], [21.0, 'dot'], [21.58, 'shock'], [22.25, 'spiral'], [23.55, 'happy'], [24.4, 'dot'], [25.0, 'spiral'],
    [25.45, 'dot'], [26.45, 'dot'], [28.05, 'heart']],
  brows: [[19.85, null], [25.4, 'angry'], [26.45, null]],
  mouth: [[19.85, 'smile'], [21.58, 'o'], [22.25, 'wobbly'], [23.55, 'grin'], [24.4, 'smile'], [25.0, 'wobbly'], [25.45, 'teeth'], [26.45, 'flat'], [28.05, 'smile']],
  lid: [[19.85, 0], [26.6, 0], [26.85, 0.35, E], [27.9, 0.35], [28.05, 0, E]],
  redFace: [[19.85, 0], [21.7, 0], [22.5, 0.55, E], [23.45, 0.55], [23.9, 0, E], [24.95, 0], [25.3, 0.5, E], [25.45, 0.3, E], [26.45, 0.15], [26.9, 0, E],
    [27.95, 0], [28.6, 0.45, E]],
  sweat: [[19.85, 0], [21.8, 0], [22.1, 1, E], [23.5, 1], [23.8, 0, E], [25.0, 0], [25.2, 1, E], [26.5, 1], [26.8, 0, E]],
  steam: [[19.85, 0], [21.85, 0], [22.2, 1, E], [23.45, 1], [23.7, 0, E], [25.0, 0], [25.2, 0.8, E], [25.45, 0, E], [28.0, 0], [28.4, 0.8, E]],
  melt: [[19.85, 0], [21.95, 0], [22.65, 0.3, E], [23.5, 0.3], [24.0, 0, E], [24.95, 0], [25.3, 0.22, E], [25.45, 0.05, E], [28.05, 0], [29.5, 0.62, E]],
  blush: [[19.85, 0.9], [20.9, 0.9], [21.2, 0.7, E]],
  arms4: [[19.85, ARMS.lap]],
  impulses: [[20.4, 'nod', 0.5], [21.55, 'surprise', 0.9], [23.5, 'sigh', 0.7], [25.45, 'shiver', 1], [26.9, 'sigh', 1.1], [28.1, 'surprise', 0.4]],
});
const herC = new Actor('her', { x: 700, y: BATH.feetY, s: 0.88, blush: 1, reachR: [902, 1056] }, {
  x: [[19.85, 700], [27.85, 700], [28.3, 645, E]],
  lean: [[19.85, 0], [20.85, 0], [21.15, 0.06, E], [21.5, 0.06], [21.8, 0, E], [24.6, 0], [24.8, 0.06, E], [26.4, 0.06], [26.6, 0, E],
    [27.85, 0], [28.3, -0.08, E]],
  look: [[19.85, -0.45], [20.8, -0.45], [21.0, 0.5, E], [21.5, 0.5], [21.7, 0, E], [24.35, 0], [24.55, -0.6, E], [24.7, 0.4, E], [25.4, 0.4],
    [25.55, -0.3, E], [26.3, -0.3], [26.45, -0.6, E], [27.8, -0.6], [28.0, -0.3, E]],
  headTilt: [[19.85, 0], [26.35, 0], [26.6, 0.22, E], [27.6, 0.22], [27.9, -0.12, E]],
  reachRw: [[19.85, 0], [20.85, 0], [21.15, 1, E], [21.5, 1], [21.8, 0, E], [24.6, 0], [24.8, 1, E], [26.4, 1], [26.6, 0, E]],
  eyes: [[19.85, 'dot'], [20.3, 'happy'], [21.0, 'dot'], [21.45, 'happy'], [23.48, 'shock'], [24.38, 'dot'], [25.5, 'dot'], [26.4, 'sparkle'], [27.85, 'happy']],
  eyeScale: [[19.85, 1], [26.35, 1], [26.6, 1.28, OB], [27.7, 1.28], [27.9, 1, E]],
  brows: [[19.85, null], [24.38, 'angry'], [26.4, 'worried'], [27.85, null]],
  lid: [[19.85, 0], [24.38, 0], [24.5, 0.3, E], [26.3, 0.3], [26.45, 0, E]],
  anger: [[19.85, 0], [24.4, 0], [24.6, 1, E], [26.3, 1], [26.45, 0, E]],
  mouth: [[19.85, 'smile'], [21.45, 'grin'], [23.48, 'o'], [24.38, 'flat'], [25.5, 'teeth'], [26.4, 'pout'], [27.85, 'grin']],
  frost: [[19.85, 0], [23.4, 0], [23.6, 0.3, E], [24.3, 0.3], [24.8, 0.12, E], [25.35, 0.12], [25.5, 0.28, E], [26.4, 0.28], [26.9, 0, E]],
  iceBlock: [[19.85, 0], [23.45, 0], [23.62, 1, LIN], [24.3, 1], [24.36, 0, LIN]],
  blushLines: [[19.85, 0], [20.2, 0], [20.5, 1, E], [21.0, 1], [21.3, 0, E], [26.4, 0], [26.6, 1, E]],
  arms4: [[19.85, ARMS.lap], [27.85, ARMS.lap], [28.25, ARMS.hug, E]],
  impulses: [[20.35, 'wiggle', 0.6], [21.5, 'wiggle', 0.9], [24.4, 'shake', 0.6], [25.45, 'shiver2', 1], [26.4, 'surprise', 0.6], [27.9, 'hop', 0.8]],
});

// ---------------- props ----------------
// his bottle: on the shelf, then in his paw, tossed back; later knocked off by her collection.
function hisBottlePose(t, getHim) {
  if (t < 2.55) return { p: SHELF_SPOT, rot: 0, held: false };
  if (t < 3.35) {
    const paw = pawWorldCute(getHim(), -1);
    const rot = key(t, [[2.95, 0], [3.1, 2.16, E]]);
    return { p: paw, rot, held: true };
  }
  if (t < 3.75) {
    const k = seg(t, 3.35, 3.75);
    const p0 = [452 - 66 * Math.sin(2.16), 905 + 66 * Math.cos(2.16)];
    const x = lerp(p0[0], SHELF_SPOT[0], k), y = lerp(p0[1], SHELF_SPOT[1], k) - Math.sin(Math.PI * k) * 170;
    return { p: [x, y], rot: lerp(2.16, TAU, k), held: false };
  }
  if (t < SEG.her[0]) {
    const b = 1 - 0.12 * bump(t - 3.75, 0.2);
    return { p: SHELF_SPOT, rot: 0, held: false, sq: b };
  }
  if (t < 10.68) return { p: SHELF_SPOT, rot: 0, held: false };
  if (t < 11.05) {
    const k = seg(t, 10.68, 11.05);
    return { p: [lerp(SHELF_SPOT[0], 360, k), SHELF_SPOT[1] - 130 * Math.sin(Math.PI * k * 0.8) + 300 * k * k], rot: -4 * k, held: false };
  }
  return null;
}
function drawHisBottle(ctx, pose) {
  if (!pose) return;
  const sq = pose.sq || 1;
  if (pose.held) {
    // grip point is the middle of the bottle
    const [gx, gy] = pose.p;
    const bx = gx - Math.sin(pose.rot) * 66, by = gy + Math.cos(pose.rot) * 66;
    drawBottle(ctx, bx, by, 1, HIS_BOTTLE, pose.rot);
  } else {
    ctx.save();
    ctx.translate(pose.p[0], pose.p[1]);
    ctx.scale(1 / sq, sq);
    drawBottle(ctx, 0, 0, 1, HIS_BOTTLE, pose.rot);
    ctx.restore();
  }
}

// paw drawn again on top of a held prop
function pawOnTop(ctx, b, side) {
  const p = pawWorldCute(b, side);
  const th = (b.who === 'her' ? 52 : 57) * 0.92 * b.s;
  ellipse(ctx, p[0], p[1], th * 0.56, th * 0.54);
  fillStroke(ctx, PAL.fur, PAL.out, LW * b.s);
  ctx.beginPath();
  for (const k of [-1, 1]) { ctx.moveTo(p[0] + k * th * 0.16, p[1] + th * 0.2); ctx.lineTo(p[0] + k * th * 0.16, p[1] + th * 0.42); }
  ctx.strokeStyle = PAL.out; ctx.lineWidth = 3.5 * b.s; ctx.lineCap = 'round'; ctx.stroke();
}

// shampoo squirting out of the upside-down bottle onto his head
function squirt(ctx, t, from, to) {
  if (t < 3.08 || t > 3.42) return;
  for (let i = 0; i < 6; i++) {
    const k = clamp((t - 3.08 - i * 0.035) / 0.2);
    if (k <= 0 || k >= 1) continue;
    const x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k) - Math.sin(Math.PI * k) * 20;
    ellipse(ctx, x, y, 13 - i, 15 - i);
    fillStroke(ctx, '#D9E8FF', '#6F9CF2', 3);
  }
}

// fluffy "poof" cloud ring
function poofCloud(ctx, x, y, t, t0) {
  const k = (t - t0) / 0.55;
  if (k < 0 || k > 1) return;
  ctx.save();
  ctx.globalAlpha = 1 - ease.inQuad(k);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU + 0.2;
    const r = 130 + 240 * ease.outCubic(k);
    const rr = (54 + 14 * Math.sin(i * 2.1)) * (1 - k * 0.45);
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.85;
    const g = ctx.createRadialGradient(px - rr * 0.3, py - rr * 0.3, 2, px, py, rr);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.75, 'rgba(250,246,255,0.95)'); g.addColorStop(1, 'rgba(235,225,245,0)');
    ctx.fillStyle = g;
    ellipse(ctx, px, py, rr, rr * 0.9); ctx.fill();
  }
  ctx.restore();
}

// ice shards when her ice block breaks
function iceShards(ctx, x, y, t, t0) {
  const k = (t - t0) / 0.7;
  if (k < 0 || k > 1) return;
  const r = mulberry32(64);
  ctx.save();
  for (let i = 0; i < 14; i++) {
    const a = r() * TAU, sp = 220 + r() * 300, rot = r() * 6;
    const px = x + Math.cos(a) * sp * k, py = y + Math.sin(a) * sp * k * 0.8 + 380 * k * k;
    ctx.globalAlpha = 1 - k;
    ctx.save(); ctx.translate(px, py); ctx.rotate(rot + k * 5);
    ctx.beginPath(); ctx.moveTo(-18, -10); ctx.lineTo(16, -16); ctx.lineTo(8, 18); ctx.closePath();
    fillStroke(ctx, 'rgba(200,236,255,0.9)', '#78B4E4', 3);
    ctx.restore();
  }
  ctx.restore();
}

// her bow on top of the steam (only thing you can still see)
function bowOverFog(ctx, b, amt) {
  if (amt <= 0) return;
  const g = headGeom(b);
  const hyl = -404 - bearBodyBob(b) * 0.4;
  const sq = bearSquash(b);
  ctx.save();
  ctx.globalAlpha = amt;
  ctx.translate(b.x, b.y - b.hop);
  ctx.scale(b.s * b.flip, b.s);
  ctx.rotate(b.lean * b.flip);
  ctx.scale(1 / Math.sqrt(sq), sq);
  ctx.translate(0, -bearBodyBob(b));
  ctx.translate(0, hyl); ctx.rotate(b.headTilt); ctx.translate(0, -hyl);
  const look = clamp(b.look * b.flip, -1, 1);
  drawBow(ctx, g.rx * 0.5 + look * 10, hyl - g.ry * 0.84 - (b.foam > 0 ? 26 * b.foam : 0), 0.92, 0.32 + (b.bowSwing || 0));
  ctx.restore();
}

function emojiAbove(ctx, cam, b, e, t, t0, t1, size = 100, dx = 0) {
  const p = worldToScreen(cam, bearTop(b));
  emojiPop(ctx, e, p[0] + dx, p[1] - 10, t, t0, t1, size);
}

makeSkit({
  name: '09_shower_him_vs_her',
  duration: 31.0,
  fps: 60,
  mix: { sfx: 0.5, music: 0.85, rms: 0.11 },
  setup(S) {
    // HIM
    S.music(0, 7.75, 'bouncy', { gain: 0.5, fadeOut: 0.4 });
    S.sfx(1.02, 'ratchet', { dur: 0.32 });
    S.sfx(1.3, 'shower', { dur: 4.15, gain: 0.8 });
    S.sfx(1.55, 'ice', { gain: 0.45 });
    S.sfx(2.52, 'click', { gain: 0.45 });
    S.sfx(3.08, 'squirt');
    S.sfx(3.38, 'whoosh', { dur: 0.35, gain: 0.3 });
    S.sfx(3.74, 'click', { gain: 0.55 });
    S.sfx(3.82, 'scrub', { dur: 0.75 });
    S.sfx(5.12, 'ratchet', { dur: 0.25 });
    S.sfx(5.6, 'boop', { gain: 0.5 });
    S.sfx(5.92, 'shake', { dur: 0.75, gain: 0.8 });
    S.sfx(5.98, 'splash');
    S.sfx(6.6, 'poof', { gain: 0.7 });
    S.sfx(6.7, 'sparkle', { gain: 0.6 });
    S.sfx(7.38, 'whoosh', { dur: 0.45, gain: 0.35 });
    // HER
    S.sfx(8.0, 'whoosh', { dur: 0.4, gain: 0.3 });
    S.music(8.1, 13.4, 'glam', { gain: 0.42, fadeIn: 0.3, fadeOut: 0.12 });
    S.sfx(8.93, 'ratchet', { dur: 0.55 });
    S.sfx(9.3, 'shower', { dur: 5.8, gain: 0.8 });
    S.sfx(9.42, 'sizzle', { dur: 0.7, gain: 0.6 });
    for (let i = 0; i < HER_BOTTLES.length; i++) S.sfx(10.0 + i * 0.114, 'softpop', { pitch: 1 + i * 0.045, gain: 0.5 });
    S.sfx(10.7, 'boing', { gain: 0.35 });
    S.sfx(11.02, 'plop', { gain: 0.55 });
    S.music(13.4, 15.45, 'glam', { gain: 0.42, tempo: 1.7, fadeIn: 0.05, fadeOut: 0.35 });
    S.sfx(13.4, 'clockfast', { dur: 2.0 });
    S.music(15.4, 19.9, 'dreamy', { gain: 0.55, fadeIn: 0.4, fadeOut: 0.3 });
    S.sfx(15.5, 'sparkle', { gain: 0.6 });
    S.sfx(15.85, 'boop', { gain: 0.5 });
    S.sfx(16.3, 'squeak', { gain: 0.22 });
    S.sfx(19.38, 'whoosh', { dur: 0.45, gain: 0.35 });
    // US
    S.sfx(20.0, 'whoosh', { dur: 0.4, gain: 0.3 });
    S.music(20.1, 25.45, 'silly', { gain: 0.48, fadeIn: 0.3, fadeOut: 0.1 });
    S.sfx(21.13, 'ratchet', { dur: 0.32 });
    S.sfx(21.35, 'shower', { dur: 9.65, gain: 0.8 });
    S.sfx(21.9, 'sizzle', { dur: 0.9, gain: 0.45 });
    S.sfx(22.3, 'wobble', { gain: 0.45 });
    S.sfx(23.22, 'ratchet', { dur: 0.2 });
    S.sfx(23.45, 'ice', { gain: 0.7 });
    S.sfx(24.3, 'shatter', { gain: 0.55 });
    S.sfx(24.8, 'ratchet', { dur: 0.18 });
    S.sfx(25.25, 'ratchet', { dur: 0.15 });
    S.music(25.45, 26.4, 'chaos', { gain: 0.42, fadeOut: 0.1 });
    for (const [tt] of WAR) S.sfx(tt - 0.12, 'ratchet', { dur: 0.12 });
    S.sfx(26.4, 'sting', { kind: 'blink' });
    S.music(26.4, 31.0, 'romantic', { gain: 0.5, fadeIn: 0.25 });
    S.sfx(27.55, 'ratchet', { dur: 0.25 });
    S.sfx(28.05, 'hearts', { gain: 0.45 });
    S.sfx(28.3, 'wobble', { gain: 0.4 });
  },

  draw(ctx, t, S) {
    const inHim = t < SEG.him[1], inHer = !inHim && t < SEG.her[1], inUs = t >= SEG.her[1];

    // ---- scene state ----
    const knob = key(t, [[0, 0], [1.05, 0], [1.38, -1, E], [5.15, -1], [5.4, 0, E],
      [8.95, 0], [9.22, 1, E], [9.3, 1], [9.5, 1.28, OB], [15.0, 1.28], [15.1, 0],
      [21.2, 0], [21.45, 1, E], [23.25, 1], [23.42, -1, E], [24.85, -1], [24.98, 1, E], [25.33, 1], ...knobWar,
      [27.6, -1], [27.8, 1, E]]);
    let water = 0, temp = 0;
    if (inHim) { water = key(t, [[1.3, 0], [1.5, 1, LIN], [5.28, 1], [5.45, 0, LIN]]); temp = -1; }
    if (inHer) { water = key(t, [[9.3, 0], [9.45, 1, LIN], [15.0, 1], [15.12, 0, LIN]]); temp = 1; }
    if (inUs) { water = key(t, [[21.35, 0], [21.5, 1, LIN]]); temp = clamp(knob, -1, 1); }
    const icy = inHim ? key(t, [[1.4, 0], [2.2, 1, E], [5.4, 1], [6.6, 0, E]]) : inUs ? key(t, [[23.3, 0], [23.8, 1, E], [24.85, 1], [25.1, 0, E]]) : 0;
    const hot = inHer ? key(t, [[9.3, 0], [9.6, 1, E], [15.0, 1], [15.6, 0, E]]) : inUs ? clamp(knob) * water : 0;
    const steam = inHer ? key(t, [[9.4, 0], [11.6, 0.3, E], [13.4, 0.42], [14.7, 1.0, E], [15.5, 1.0], [16.3, 0.16, E]])
      : inUs ? key(t, [[21.4, 0], [22.4, 0.22, E], [23.3, 0.24], [23.8, 0.05, E], [25.0, 0.05], [25.4, 0.15, E], [28.0, 0.15], [29.5, 0.3, E]]) : 0;
    const fog = inHer ? key(t, [[9.8, 0], [12.0, 0.9, E], [19.85, 1]]) : inUs ? 1 : 0;
    const heart = inHer ? key(t, [[16.3, 0], [17.1, 1, E]]) : inUs ? 1 : 0;
    const clockH = inHer ? key(t, [[7.85, 7.25], [13.4, 7.4], [15.4, 9.0, E]]) : inUs ? 9.1 + (t - 19.85) / 600 : 7.0 + t / 600;
    const nBottles = inHer ? key(t, [[10.0, 0], [10.0 + HER_BOTTLES.length * 0.114, HER_BOTTLES.length, LIN]]) : inUs ? HER_BOTTLES.length : 0;
    const curtain = key(t, [[0, 1], [7.4, 1], [7.85, 0, E], [8.05, 0], [8.5, 1, E], [19.4, 1], [19.85, 0, E], [20.05, 0], [20.5, 1, E]]);

    // ---- bears ----
    const bears = [];
    let him = null, her = null;
    if (inHim) { him = himA.at(t, S); bears.push(him); }
    if (inHer) { her = herB.at(t, S); bears.push(her); }
    if (inUs) { him = himC.at(t, S); her = herC.at(t, S); bears.push(her, him); }

    // ---- camera ----
    let cam;
    if (inHim) {
      cam = {
        x: key(t, [[0, 560], [6.5, 565], [6.75, 565, E], [7.4, 565], [7.8, 560, E]]),
        y: key(t, [[0, 1150], [1.4, 1150], [5.2, 1135, E], [6.5, 1130], [6.75, 1105, E], [7.3, 1105], [7.8, 1150, E]]),
        zoom: key(t, [[0, 1.3], [1.4, 1.3], [5.2, 1.36, E], [6.5, 1.36], [6.75, 1.5, E], [7.3, 1.5], [7.8, 1.3, E]]),
      };
    } else if (inHer) {
      cam = {
        x: key(t, [[7.85, 560], [10.0, 560], [10.4, 470, E], [11.5, 470], [11.85, 565, E], [15.4, 565], [16.0, 565, E], [19.0, 565], [19.6, 560, E]]),
        y: key(t, [[7.85, 1150], [10.0, 1150], [10.4, 1120, E], [11.5, 1120], [11.85, 1125, E], [15.4, 1130], [16.0, 1110, E], [19.0, 1110], [19.6, 1150, E]]),
        zoom: key(t, [[7.85, 1.3], [10.0, 1.3], [10.4, 1.4, E], [11.5, 1.4], [11.85, 1.42, E], [13.4, 1.45], [15.4, 1.3, E], [16.0, 1.46, E], [19.0, 1.5], [19.6, 1.3, E]]),
      };
    } else {
      cam = {
        x: key(t, [[19.85, 560], [20.1, 560], [20.6, 552, E], [25.3, 552], [25.5, 640, E], [26.3, 640], [26.5, 690, E], [27.5, 690], [28.3, 552, E]]),
        y: key(t, [[19.85, 1150], [25.3, 1150], [25.5, 1080, E], [26.3, 1080], [26.5, 1115, E], [27.5, 1115], [28.3, 1160, E]]),
        zoom: key(t, [[19.85, 1.3], [20.1, 1.3], [20.6, 1.25, E], [25.3, 1.25], [25.5, 1.4, E], [26.3, 1.4], [26.5, 1.62, E], [27.5, 1.62], [28.3, 1.28, E], [31, 1.36, E]]),
        shake: key(t, [[25.4, 0], [25.5, 6], [26.3, 6], [26.4, 0]]),
      };
    }

    ctx.save();
    applyCamera(ctx, cam, t);
    drawCozyBathroom(ctx, t, { knob, fog, heart, clock: clockH, icy, hot });
    // wall bottles (shelves) first, rim bottles in front of the tub later
    drawHerBottles(ctx, t, nBottles, 'wall');
    const hb = (inHim || inHer) ? hisBottlePose(t, () => him) : null;
    drawHisBottle(ctx, hb);
    drawShowerWaterBack(ctx, t, { on: water, temp });
    for (const b of bears) drawBear(ctx, b, t);
    drawShowerWater(ctx, t, { on: water, temp, bears });
    if (inHim) {
      if (t > 3.0 && t < 3.45) {
        const pw = pawWorldCute(him, -1);
        const cap = [pw[0] + Math.sin(2.16) * 80, pw[1] - Math.cos(2.16) * 80];
        squirt(ctx, t, cap, [565, 985]);
      }
      shakeSpray(ctx, him.x, him.y - 380, t, 5.92, 6.55);
      if (t > 5.3 && t < 5.95) {
        // little drips gathering under the wet bear
      }
    }
    if (inHer && t > 11.6 && t < 15.02) {
      // shampoo-bottle microphone
      const pw = pawWorldCute(her, 1);
      const spec = { kind: 'pump', col: '#FF9EC4', w: 40, h: 92, icon: 'heart' };
      const rot = -0.62;
      drawBottle(ctx, pw[0] - Math.sin(rot) * 38, pw[1] + Math.cos(rot) * 38, 0.95, spec, rot);
      pawOnTop(ctx, her, 1);
    }
    drawTubFront(ctx, t, {});
    drawHerBottles(ctx, t, nBottles, 'rim');
    drawShowerCurtain(ctx, t, curtain);
    if (inHer) musicNotes(ctx, her.x + 40, her.y - 600, t, key(t, [[11.75, 0], [12.0, 1], [15.0, 1], [15.2, 0]]));
    if (inHim) poofCloud(ctx, him.x, him.y - 380, t, 6.58);
    if (inUs) {
      if (him.steam > 0) steamPuffs(ctx, him.x, him.y - 600, t, him.steam * 0.6, 120);
      iceShards(ctx, her.x, her.y - 380, t, 24.32);
      if (t >= 28.1) floatingHearts(ctx, (him.x + her.x) / 2, him.y - 620, t, seg(t, 28.1, 28.5), 200);
    }
    drawSteam(ctx, t, steam);
    if (inHer) {
      const fogTop = key(t, [[14.2, 0], [14.7, 1, E], [15.4, 1], [15.8, 0, E]]);
      bowOverFog(ctx, her, fogTop);
      musicNotes(ctx, her.x + 40, her.y - 600, t, fogTop * (t < 15.05 ? 1 : 0));
    }
    ctx.restore();

    // ---- overlays (screen space) ----
    if (inHim) sparkles(ctx, 545, 930, t, key(t, [[6.62, 0], [6.8, 1], [7.4, 1], [7.7, 0]]), 280, 5);
    if (inHer) sparkles(ctx, 545, 930, t, key(t, [[15.4, 0], [15.7, 1], [18.8, 1], [19.3, 0]]), 300, 9);
    if (inHer) emojiPop(ctx, '🔥', 930, 640, t, 9.45, 10.3, 110);
    if (inUs) {
      emojiAbove(ctx, cam, him, '🥵', t, 22.0, 23.3, 110, 40);
      emojiAbove(ctx, cam, her, '🥶', t, 23.6, 24.3, 110, -30);
    }

    hookText(ctx, 'him vs her:\ntaking a shower 🚿');
    const LY = 1490;
    label(ctx, 'HIM', 540, LY, t, 0.3, 7.6, { bg: ACCENT.him, size: 64 });
    label(ctx, 'HER', 540, LY, t, 8.2, 19.6, { bg: ACCENT.her, size: 64 });
    label(ctx, 'US', 540, LY, t, 20.2, 28.3, { bg: '#B58CE8', size: 64 });
    chip(ctx, '⏱️ 2 min', 540, LY + 105, t, 5.6, 7.6, { size: 44, bg: 'rgba(111,156,242,0.95)' });
    if (inHer && t > 13.4 && t < 15.5) {
      const mins = Math.floor(lerp(9, 107, seg(t, 13.45, 15.3)));
      const txt = mins < 60 ? `⏱️ ${mins} min` : `⏱️ ${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} min`;
      chip(ctx, txt, 540, LY + 105, t, 13.4, 15.5, { size: 44, bg: 'rgba(91,74,96,0.9)' });
    }
    chip(ctx, '⏱️ 1 h 47 min', 540, LY + 105, t, 15.55, 19.6, { size: 44, bg: 'rgba(255,127,176,0.95)' });
    narration(ctx, 'the things I do for her 🫠', 540, 560, t, 28.5, 31.0, { size: 56 });
  },
});
