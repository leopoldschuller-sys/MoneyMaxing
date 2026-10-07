// Skit 10 — "him vs her: being sick 🤒" (couch, the man-flu cliché, almost no text)
// HIM, 37.1 °C: blanket burrito, ice pack, tissue mountain, rings a bell for service, googles
// "is 37.1° fatal?", dies dramatically ... she grabs his soul and stuffs it back in.
// HER, 39.4 °C: vacuums, sneezes, keeps working on the laptop: "I'm fine 🙂".
// Then he takes care of her the polar-bear way: soup = a salmon on ice. He tried 🥹
useCuteLook();
const E = ease.inOutCubic, OB = ease.outBack, LIN = ease.linear, OC = ease.outCubic;
const SEAT = 1548, FLOOR = 1720, STAND = 1760;
const T_V1 = 11.15, T_V2 = 14.75, T_V3 = 18.45, T_END = 25.0;

// ---------------- HIM is sick ----------------
const himA = new Actor('him', { x: 400, y: SEAT, s: 1.0, hideBody: true, blush: 0.5, bags: 0.8, redNose: 1, sweat: 0.55 }, {
  look: [[0, 0.1], [2.8, 0.1], [3.1, 0.5, E], [5.2, 0.5], [5.45, -0.45, E], [7.3, -0.45], [7.5, 0, E], [9.3, 0], [9.5, 0.35, E]],
  lookY: [[0, 0], [5.2, 0], [5.45, 0.15, E], [7.3, 0.15], [7.5, 0, E]],
  headTilt: [[0, 0.06], [1.0, 0.06], [1.2, 0, E], [1.6, 0], [2.0, 0.1, E], [7.35, 0.1], [7.65, -0.36, OC], [9.3, -0.36], [9.55, 0, E],
    [9.85, 0], [10.15, 0.14, E], [11.15, 0.14]],
  lean: [[0, 0], [7.35, 0], [7.65, -0.06, OC], [9.3, -0.06], [9.55, 0, E]],
  eyes: [[0, 'teary'], [1.05, 'shock'], [1.6, 'teary'], [3.25, 'sparkle'], [4.3, 'teary'], [4.55, 'happy'], [5.3, 'teary'], [7.4, 'x'], [9.3, 'dot'], [9.95, 'happy']],
  mouth: [[0, 'wobbly'], [1.05, 'o'], [1.6, 'wobbly'], [2.1, 'o'], [3.25, 'pout'], [4.3, 'o'], [4.55, 'chew'], [5.1, 'smile'], [5.3, 'wobbly'],
    [7.4, 'tongue'], [9.3, 'o'], [9.95, 'smile']],
  tears: [[0, 0.15], [1.6, 0.15], [2.0, 0.6, E], [3.2, 0.6], [3.6, 0.1, E], [5.3, 0.1], [5.6, 0.5, E], [7.3, 0.5], [7.45, 0, E]],
  blushLines: [[0, 0], [9.95, 0], [10.2, 1, E]],
  impulses: [[1.05, 'surprise', 0.8], [1.7, 'shiver', 1.0], [2.2, 'wiggle', 0.5], [3.3, 'wiggle', 0.4], [4.6, 'nod', 0.4], [7.42, 'flinch', 1.2],
    [9.3, 'surprise', 1.0], [10.1, 'nod', 0.35], [10.4, 'nod', 0.35]],
});
// ghost path (his soul leaving and being stuffed back in)
const ghostX = (t) => key(t, [[7.8, 400], [8.55, 455, OC], [8.8, 455], [9.25, 402, ease.inCubic]]);
const ghostY = (t) => key(t, [[7.8, 1110], [8.55, 925, OC], [8.8, 945], [9.25, 1120, ease.inCubic]]);
const ghostA = (t) => key(t, [[7.8, 0], [8.0, 0.82], [9.05, 0.82], [9.28, 0, LIN]]);
const ghostS = (t) => key(t, [[7.8, 0.5], [8.3, 0.72, OC], [9.0, 0.72], [9.28, 0.3, ease.inCubic]]);
const ghostTail = (t) => [ghostX(t), ghostY(t) + 100];

const BOWL_ARM = [0.45, 1.55, 0.45, 1.55];
const herA = new Actor('her', { x: 1250, y: FLOOR, s: 0.95, blush: 0.9 }, {
  x: [[0, 1250], [2.9, 1250], [3.85, 650, OC]],
  walk: [[2.9, 0], [3.85, 13, OC]],
  walkAmt: [[2.9, 0], [3.0, 1, E], [3.65, 1], [3.9, 0, E]],
  look: [[0, -0.5], [5.4, -0.5], [5.6, -0.75, E], [7.3, -0.75], [7.45, -0.5, E], [8.3, -0.5], [8.45, -0.2, E], [9.3, -0.2], [9.45, -0.5, E],
    [10.25, -0.5], [10.4, 0.1, E], [10.75, 0.1], [10.9, -0.4, E]],
  lookY: [[0, 0], [8.3, 0], [8.45, -0.45, E], [8.9, -0.45], [9.15, 0.1, E], [9.4, 0, E], [10.25, 0], [10.4, -0.45, E], [10.75, -0.45], [10.9, 0, E]],
  eyes: [[0, 'dot'], [4.45, 'happy'], [4.95, 'dot']],
  lid: [[0, 0], [5.8, 0], [6.05, 0.45, E], [7.3, 0.45], [7.45, 0, E], [8.35, 0], [8.5, 0.4, E], [11.15, 0.4]],
  brows: [[0, 'worried'], [4.4, null], [5.85, 'flat'], [7.42, 'worried'], [8.35, 'flat']],
  mouth: [[0, 'frown'], [3.95, 'smile'], [5.85, 'flat'], [7.42, 'o'], [8.35, 'flat'], [10.7, 'smile']],
  arms4: [[0, BOWL_ARM]],
  reachL: [[0, [425, 1215]], [7.0, [425, 1215]], [8.55, ghostTail(8.55)], [8.8, ghostTail(8.8)], [9.25, ghostTail(9.25), ease.inCubic],
    [9.5, [492, 1012], E], [10.05, [492, 1012]], [10.2, [490, 1030], E], [10.35, [492, 1010], E], [10.5, [490, 1030], E], [10.65, [492, 1012], E]],
  reachLw: [[0, 0], [4.0, 0], [4.42, 1, E], [4.6, 1], [4.95, 0, E], [8.45, 0], [8.7, 1, OC], [10.65, 1], [10.95, 0, E]],
  impulses: [[3.86, 'hop', 0.25], [6.1, 'sigh', 0.9], [8.5, 'hop', 0.55], [10.42, 'sigh', 0.6]],
});

// ---------------- HER is sick ----------------
const himSleep = new Actor('him', { x: 400, y: SEAT, s: 1.0, hideBody: true, blush: 0.6, eyes: 'sleep', mouth: 'o' }, {
  headTilt: [[T_V1, 0.16]],
  snot: [[T_V1, 0.3], [T_V1 + 0.9, 0.75, E], [T_V1 + 1.8, 0.3, E], [T_V1 + 2.7, 0.75, E], [T_V1 + 3.6, 0.3, E], [T_V2 + 0.6, 0.75, E], [16.15, 0.85, E], [16.2, 0, LIN]],
  eyes: [[T_V1, 'sleep'], [16.2, 'dot']],
  mouth: [[T_V1, 'o'], [16.2, 'flat'], [16.55, 'frown']],
  brows: [[T_V1, null], [16.5, 'worried']],
  look: [[T_V1, 0], [16.3, 0], [16.55, 0.5, E]],
  impulses: [[16.2, 'surprise', 0.6]],
});
const herV1 = new Actor('her', { x: 600, y: STAND, s: 0.95, blush: 0.9, bags: 1, redNose: 1, sweat: 0.7 }, {
  look: [[T_V1, 0.25]],
  lookY: [[T_V1, 0.25], [13.0, 0.25], [13.3, -0.35, E], [13.42, 0.35, OC], [13.9, 0.25, E]],
  headTilt: [[T_V1, 0], [13.0, 0], [13.3, -0.16, E], [13.42, 0.2, OC], [13.9, 0, E]],
  eyes: [[T_V1, 'dot'], [13.05, 'line'], [13.6, 'dot']],
  lid: [[T_V1, 0.3]],
  brows: [[T_V1, 'flat']],
  mouth: [[T_V1, 'flat'], [13.05, 'o'], [13.38, 'bigO'], [13.6, 'wobbly'], [13.95, 'flat']],
  arms4: [[T_V1, ARMS.lap]],
  impulses: [[13.42, 'flinch', 1.5], [13.44, 'surprise', 0.5], [14.05, 'sigh', 0.6]],
});
const herV2 = new Actor('her', { x: 690, y: SEAT, s: 0.95, blush: 0.9, bags: 1, redNose: 1, sweat: 0.7 }, {
  look: [[T_V2, -0.1], [16.6, -0.1], [16.8, -0.5, E]],
  lookY: [[T_V2, 0.38], [16.6, 0.38], [16.8, 0, E]],
  eyes: [[T_V2, 'dot']],
  lid: [[T_V2, 0.32], [16.8, 0.32], [16.9, 0.1, E], [17.15, 0.1], [17.2, 0.45, LIN], [17.3, 0.1, LIN], [17.7, 0.1], [17.75, 0.45, LIN], [17.85, 0.1, LIN]],
  brows: [[T_V2, 'flat'], [16.8, null]],
  mouth: [[T_V2, 'flat'], [16.8, 'smile']],
  arms4: [[T_V2, ARMS.table]],
  talkArm: [[T_V2, 'none']],
  impulses: [[16.8, 'nod', 0.4]],
});
// V3: she's in his burrito now, he serves "soup"
const herV3 = new Actor('her', { x: 690, y: SEAT, s: 0.95, hideBody: true, blush: 1, redNose: 0.6, bags: 0.5 }, {
  look: [[T_V3, -0.2], [19.1, -0.2], [19.35, -0.55, E], [21.4, -0.55], [21.6, -0.3, E]],
  lookY: [[T_V3, 0], [19.1, 0], [19.35, 0.35, E], [20.0, 0.35], [20.2, 0, E]],
  headTilt: [[T_V3, 0], [20.1, 0], [20.4, -0.12, E], [21.5, -0.12], [21.8, -0.2, E]],
  eyes: [[T_V3, 'dot'], [20.1, 'happy']],
  lid: [[T_V3, 0], [19.3, 0], [19.5, 0.45, E], [20.0, 0.45], [20.1, 0, E]],
  mouth: [[T_V3, 'smile'], [19.3, 'flat'], [20.1, 'grin'], [21.0, 'smile']],
  blushLines: [[T_V3, 0], [20.1, 0], [20.4, 1, E]],
  impulses: [[19.55, 'nod2', 0.5], [20.15, 'laugh', 1.0], [21.7, 'wiggle', 0.5]],
});
const himV3 = new Actor('him', { x: 330, y: STAND, s: 1.0, blush: 1 }, {
  lean: [[T_V3, -0.05]],
  look: [[T_V3, 0.45]],
  eyes: [[T_V3, 'sparkle'], [20.15, 'happy']],
  mouth: [[T_V3, 'grin'], [20.15, 'smile']],
  blushLines: [[T_V3, 0.8]],
  arms4: [[T_V3, BOWL_ARM]],
  impulses: [[18.7, 'hop', 0.4], [20.2, 'hop', 0.8], [20.6, 'hop', 0.5], [21.1, 'hop', 0.5]],
});

const T_CUDDLE = 21.6;
const himF = new Actor('him', { x: 468, y: SEAT, s: 1.0, hideBody: true, blush: 1, eyes: 'happy', mouth: 'smile', blushLines: 0.8 }, {
  headTilt: [[T_CUDDLE, 0.05], [T_CUDDLE + 0.5, 0.2, E]],
  impulses: [[T_CUDDLE + 0.05, 'surprise', 0.5], [T_CUDDLE + 1.4, 'nod', 0.4]],
});
const herF = new Actor('her', { x: 688, y: SEAT, s: 0.95, hideBody: true, blush: 1, eyes: 'happy', mouth: 'grin', blushLines: 1, redNose: 0.5 }, {
  headTilt: [[T_CUDDLE, -0.05], [T_CUDDLE + 0.5, -0.2, E]],
  mouth: [[T_CUDDLE, 'grin'], [T_CUDDLE + 1.2, 'smile']],
  impulses: [[T_CUDDLE + 0.05, 'surprise', 0.5], [T_CUDDLE + 0.9, 'wiggle', 0.5]],
});

// ---------------- helpers ----------------
function poofCloud(ctx, x, y, t, t0, spread = 1) {
  const k = (t - t0) / 0.6;
  if (k < 0 || k > 1) return;
  ctx.save();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU + 0.3;
    const r = (40 + 260 * ease.outCubic(k)) * spread;
    const rr = (90 + 25 * Math.sin(i * 2.1)) * (1 - k * 0.35) * spread;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.7;
    const g = ctx.createRadialGradient(px - rr * 0.3, py - rr * 0.3, 2, px, py, rr);
    const al = 1 - ease.inQuad(k);
    g.addColorStop(0, `rgba(255,255,255,${al})`); g.addColorStop(0.75, `rgba(250,246,255,${0.95 * al})`); g.addColorStop(1, 'rgba(235,225,245,0)');
    ctx.fillStyle = g;
    ellipse(ctx, px, py, rr, rr * 0.9); ctx.fill();
  }
  // solid core while the swap happens
  const core = seg(k, 0.0, 0.18) * (1 - seg(k, 0.55, 0.9));
  if (core > 0) {
    const g = ctx.createRadialGradient(x, y, 10, x, y, 330 * spread);
    g.addColorStop(0, `rgba(255,255,255,${core})`); g.addColorStop(0.72, `rgba(255,252,255,${core})`); g.addColorStop(1, 'rgba(255,252,255,0)');
    ctx.fillStyle = g; ellipse(ctx, x, y, 330 * spread, 300 * spread); ctx.fill();
  }
  ctx.restore();
}

// ---------------- helpers (props) ----------------
function pawAt(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 30, 29); fillStroke(ctx, PAL.fur, PAL.out, LW);
  ctx.beginPath();
  for (const k of [-1, 1]) { ctx.moveTo(k * 9, -27); ctx.lineTo(k * 9, -15); }
  ctx.strokeStyle = PAL.out; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}
function pawOnTop(ctx, b, side) {
  const p = pawWorldCute(b, side);
  pawAt(ctx, p[0], p[1], b.s * 0.92, 0);
}
function searchScreen(c, t) {
  c.fillStyle = '#FFFFFF'; c.fillRect(-70, -140, 140, 280);
  rrect(c, -60, -118, 120, 30, 15); c.fillStyle = '#F1ECF7'; c.fill();
  c.font = font(13, 600); c.fillStyle = UI.bubbleText; c.textAlign = 'left'; c.textBaseline = 'middle';
  c.fillText('is 37.1° fatal?', -52, -102);
  for (let i = 0; i < 4; i++) {
    rrect(c, -58, -70 + i * 46, 116, 12, 6); c.fillStyle = '#C9B5F2'; c.fill();
    rrect(c, -58, -52 + i * 46, 84, 9, 5); c.fillStyle = '#E4DDEE'; c.fill();
  }
}
// horizontal streaks for the whip-pan cuts
function whipFx(ctx, amt) {
  if (amt <= 0) return;
  ctx.save();
  ctx.globalAlpha = 0.55 * amt;
  ctx.fillStyle = '#FFFFFF';
  const r = mulberry32(5);
  for (let i = 0; i < 26; i++) {
    const y = r() * H, w = 300 + r() * 700, x = r() * W - w / 2;
    rrect(ctx, x, y, w, 8 + r() * 14, 8); ctx.fill();
  }
  ctx.restore();
}
// camera offset for a whip pan that leaves at t1 and arrives at t0 of the next scene
function whip(t, cuts) {
  let dx = 0, fx = 0;
  for (const c of cuts) {
    const out = seg(t, c - 0.24, c), inn = seg(t, c, c + 0.26);
    if (t < c && t > c - 0.24) { dx += 560 * ease.inCubic(out); fx = Math.max(fx, out); }
    if (t >= c && t < c + 0.26) { dx -= 560 * (1 - ease.outCubic(inn)); fx = Math.max(fx, 1 - inn); }
  }
  return { dx, fx };
}

makeSkit({
  name: '10_sick_him_vs_her',
  duration: T_END,
  fps: 60,
  mix: { sfx: 0.5, music: 0.85, rms: 0.11 },
  setup(S) {
    // HIM
    S.music(0, 7.4, 'sad', { gain: 0.55, fadeOut: 0.2 });
    S.sfx(0.55, 'beep', { n: 3 });
    S.sfx(1.05, 'sting', { kind: 'blink', gain: 0.5 });
    S.sfx(2.12, 'handbell', { n: 5 });
    S.sfx(2.95, 'whoosh', { dur: 0.35, gain: 0.2 });
    for (let k = 0; k < 6; k++) S.sfx(3.0 + k * 0.15, 'softpop', { pitch: 0.7, gain: 0.35 });
    S.sfx(4.42, 'click', { gain: 0.35 });
    S.sfx(4.62, 'gulp', { gain: 0.6 });
    S.sfx(5.3, 'scroll', { gain: 0.8 });
    S.sfx(5.5, 'typing', { dur: 0.9 });
    S.sfx(7.4, 'sting', { kind: 'dun', gain: 0.6 });
    S.music(7.8, 9.3, 'dreamy', { gain: 0.5, fadeIn: 0.2, fadeOut: 0.2 });
    S.sfx(7.85, 'chime', { notes: [72, 76, 79, 84, 88], gain: 0.5 });
    S.sfx(8.62, 'boop', { gain: 0.5 });
    S.sfx(9.25, 'pop', { gain: 0.6 });
    S.music(9.3, 11.1, 'silly', { gain: 0.45, fadeIn: 0.1, fadeOut: 0.2 });
    for (const tt of [10.2, 10.5]) S.sfx(tt, 'softpop', { pitch: 1.2, gain: 0.4 });
    S.sfx(10.93, 'whoosh', { dur: 0.45, gain: 0.35 });
    // HER
    S.music(T_V1, T_V3 - 0.1, 'lofi', { gain: 0.5, fadeIn: 0.2, fadeOut: 0.25 });
    S.sfx(T_V1 + 0.05, 'vacuum', { dur: T_V2 - T_V1 - 0.1, gain: 0.7 });
    S.sfx(T_V1 + 0.5, 'beep', { n: 3 });
    S.sfx(13.42, 'poof', { gain: 0.7 });
    S.sfx(T_V2 - 0.24, 'whoosh', { dur: 0.45, gain: 0.35 });
    S.sfx(15.0, 'typing', { dur: 1.6 });
    for (const tt of [15.2, 15.7, 16.1]) S.sfx(tt, 'boop', { gain: 0.3 });
    S.sfx(16.2, 'bubble_pop', { gain: 0.4 });
    S.say('her', 16.85, "I'm fine 🙂", { dur: 0.8, hold: 0.8 });
    S.sfx(T_V3 - 0.24, 'whoosh', { dur: 0.45, gain: 0.35 });
    S.music(T_V3, T_END, 'romantic', { gain: 0.5, fadeIn: 0.2 });
    S.sfx(18.75, 'tada', { gain: 0.4 });
    S.sfx(20.15, 'hearts', { gain: 0.45 });
    S.sfx(T_CUDDLE - 0.3, 'poof', { gain: 0.6 });
    S.sfx(T_CUDDLE + 0.2, 'sparkle', { gain: 0.6 });
  },

  draw(ctx, t, S) {
    const segHim = t < T_V1, segV1 = t >= T_V1 && t < T_V2, segV2 = t >= T_V2 && t < T_V3, segV3 = t >= T_V3;
    let him = null, her = null, herStanding = false;
    if (segHim) { him = himA.at(t, S); her = herA.at(t, S); herStanding = true; }
    if (segV1) { him = himSleep.at(t, S); her = herV1.at(t, S); herStanding = true; }
    if (segV2) { him = himSleep.at(t, S); her = herV2.at(t, S); }
    const cuddle = t >= T_CUDDLE;
    if (segV3) { him = cuddle ? himF.at(t, S) : himV3.at(t, S); her = cuddle ? herF.at(t, S) : herV3.at(t, S); }

    // vacuum (V1): cleaner swings left/right, her paw on the handle, her body sways along
    let vac = null;
    if (segV1) {
      const k = (t - T_V1) * 3.0;
      const vx = 712 + 48 * Math.sin(k);
      her.x += 12 * Math.sin(k - 0.4);
      her.lean += 0.03 * Math.sin(k - 0.4);
      vac = { x: vx, grip: null };
    }
    // typing (V2): little bobbing
    if (segV2 && t < 16.6) { her.bob += 2.2 * Math.abs(Math.sin(t * 22)); }

    // ---- camera ----
    let cam;
    if (segHim) {
      cam = {
        x: key(t, [[0, 450], [2.75, 450], [3.6, 560, E], [5.1, 560], [5.4, 500, E], [7.3, 500], [7.6, 440, OC], [7.9, 440], [8.4, 520, E], [9.4, 520], [9.8, 540, E]]),
        y: key(t, [[0, 1230], [2.75, 1230], [3.6, 1330, E], [5.1, 1330], [5.4, 1280, E], [7.3, 1280], [7.6, 1180, OC], [7.9, 1180], [8.4, 1220, E], [9.4, 1220], [9.8, 1300, E]]),
        zoom: key(t, [[0, 1.42], [2.75, 1.42], [3.6, 1.22, E], [5.1, 1.22], [5.4, 1.32, E], [7.3, 1.32], [7.6, 1.55, OC], [7.9, 1.55], [8.4, 1.22, E], [9.4, 1.22], [9.8, 1.25, E]]),
      };
    } else if (segV1) cam = { x: 560, y: 1335, zoom: key(t, [[T_V1, 1.22], [T_V2, 1.28, LIN]]) };
    else if (segV2) cam = { x: key(t, [[T_V2, 560], [16.5, 560], [16.9, 600, E]]), y: key(t, [[T_V2, 1330], [16.5, 1330], [16.9, 1290, E]]), zoom: key(t, [[T_V2, 1.25], [16.5, 1.25], [16.9, 1.4, E]]) };
    else cam = { x: key(t, [[T_V3, 520], [T_CUDDLE, 520], [T_CUDDLE + 0.6, 572, E]]), y: key(t, [[T_V3, 1330], [T_CUDDLE, 1330], [T_CUDDLE + 0.6, 1260, E]]),
      zoom: key(t, [[T_V3, 1.22], [T_CUDDLE, 1.22], [T_CUDDLE + 0.6, 1.4, E], [T_END, 1.46, LIN]]) };
    const wp = whip(t, [T_V1, T_V2, T_V3]);
    cam.x += wp.dx;

    ctx.save();
    applyCamera(ctx, cam, t);
    // wider plain wall/floor behind the room so fast pans never show the canvas edge
    ctx.fillStyle = '#F5D3CA'; ctx.fillRect(-2400, -2000, W + 4800, 3500);
    ctx.fillStyle = '#D2AC95'; ctx.fillRect(-2400, 1500, W + 4800, 2500);
    drawCozyRoom(ctx, t);
    // ---- sitting bears + what's on the couch ----
    const sitting = [];
    if (!herStanding) sitting.push(her);
    if (!segV3 || cuddle) sitting.unshift(him);
    for (const b of sitting) drawBear(ctx, b, t);
    // blanket burritos
    if (!segV3) drawBurrito(ctx, him.x, 1262, 1560, 340, t, {});
    if (segV3 && !cuddle) drawBurrito(ctx, her.x, 1272, 1560, 320, t, { col: '#FFD1E0', dark: '#F7A8C4' });
    if (cuddle) drawBurrito(ctx, 578, 1266, 1560, 600, t, { col: '#E6D8FF', dark: '#C9B5F2' });
    // ice packs, thermometers
    if (!segV3) drawIcePack(ctx, him);
    if (segV3) drawIcePack(ctx, her);
    if (segHim) drawThermometer(ctx, him, '37.1°', 1, key(t, [[3.2, 1], [3.5, 0, E], [99, 0]]));
    // tissues on the seat
    if (segHim || segV1 || segV2) tissuePile(ctx, 205, 1445, 190, segHim ? 12 : 6, 4);
    if (segHim) tissuePile(ctx, 590, 1452, 150, 7, 9);
    // his paws out of the burrito: bell (ringing) / phone
    if (segHim && t > 1.95 && t < 3.25) {
      const k = seg(t, 1.95, 2.15) * (1 - seg(t, 3.0, 3.25));
      const ring = t > 2.1 && t < 3.0 ? Math.sin(t * 34) * 0.5 : 0;
      const px = 560, py = lerp(1450, 1330, ease.outBack(k));
      ctx.save(); ctx.globalAlpha = clamp(k * 3);
      drawHandBell(ctx, px + 4, py - 40, 0.9, ring);
      pawAt(ctx, px, py, 1.0, 0.3);
      ctx.restore();
    }
    if (segHim && t > 5.05 && t < 7.75) {
      const k = seg(t, 5.05, 5.3) * (1 - seg(t, 7.42, 7.75));
      const py = lerp(1450, 1210, ease.outBack(k)) + (t > 7.42 ? 120 * ease.inQuad(seg(t, 7.42, 7.75)) : 0);
      const rot = t > 7.42 ? -1.2 * ease.inQuad(seg(t, 7.42, 7.75)) : -0.08;
      ctx.save(); ctx.globalAlpha = clamp(k * 3);
      drawPhoneFront(ctx, 238, py, 0.8, rot, searchScreen, t);
      pawAt(ctx, 238 + 30, py + 110, 1.0, -0.3);
      ctx.restore();
    }
    // laptop + tea on her lap (V2)
    drawCozyCouchFront(ctx, t);
    drawTissueBox(ctx, 100, 1272, 0.85);
    if (segV2) {
      drawLaptopBack(ctx, her.x, 1458, 0.82, t);
      softGlow(ctx, her.x, 1250, 200, '170,210,255', 0.35);
      notifPops(ctx, her.x, 1320, t, [15.2, 15.7, 16.1]);
    }
    // floor: tissue mountain (his part), laundry + parked vacuum (hers)
    if (segHim) tissuePile(ctx, 300, 1745, 300, 16, 7);
    if (segV2) { drawLaundryPile(ctx, 905, 1740, 0.9); drawVacuum(ctx, 1010, 1745, 0.75, t, 0); }
    // ---- standing bears ----
    if (herStanding) {
      if (segV1) {
        const grip = drawVacuum(ctx, vac.x, 1790, 0.85, t, 1);
        her.reachR = grip; her.reachRw = 1;
      }
      drawBear(ctx, her, t);
      if (segHim) {
        // bowl in her right paw, spoon in the left
        const pr = pawWorldCute(her, 1), pl = pawWorldCute(her, -1);
        if (t < 4.8 || t > 4.9) drawBowl(ctx, pr[0] + 10, pr[1] - 22, 0.62, t, 'soup');
        pawOnTop(ctx, her, 1);
        if (t < 8.4) {
          // spoon held at the end of its handle, bowl pointing at him
          const rot = key(t, [[0, -1.0], [4.0, -1.0], [4.4, -0.15, E], [4.6, -0.15], [4.95, -1.0, E]]);
          ctx.save(); ctx.translate(pl[0], pl[1]); ctx.rotate(rot);
          drawSpoon(ctx, -84, -2, 1.0, 0, t < 4.5);
          ctx.restore();
        }
        pawOnTop(ctx, her, -1);
      }
      if (segV1) {
        pawOnTop(ctx, her, 1);
        const [mx, my] = bearMouth(her);
        sneezePuff(ctx, mx - 175 * her.s, my - 10, t, 13.42, -1);
      }
      drawThermometer(ctx, her, '39.4°', -1, segV1 ? 1 : 0);
    }
    if (segV2) drawThermometer(ctx, her, '39.4°', 1, 1);
    if (segV3 && !cuddle) {
      drawBear(ctx, him, t);
      const pr = pawWorldCute(him, 1), pl = pawWorldCute(him, -1);
      drawTray(ctx, (pr[0] + pl[0]) / 2, Math.min(pr[1], pl[1]) - 4, 0.85, t, { cup: false, kind: 'fish' });
      pawOnTop(ctx, him, -1);
      pawOnTop(ctx, him, 1);
    }
    if (cuddle) drawTray(ctx, 300, 1800, 0.85, t, { cup: false, kind: 'fish' });
    // ---- effects ----
    if (segHim) {
      drawGhost(ctx, him, ghostX(t), ghostY(t), ghostS(t), t, ghostA(t));
      if (t > 8.55 && t < 9.4) pawOnTop(ctx, her, -1);
      sparkles(ctx, him.x, 980, t, key(t, [[9.3, 0], [9.5, 1], [10.0, 0]]), 160, 3);
    }
    if (segV1 || (segV2 && t < 16.2)) zzz(ctx, him.x + 120, 1000, t, 1, { color: '#CFE3FF', size: 40 });
    if (segV3 && t > 20.15) floatingHearts(ctx, cuddle ? 578 : her.x - 40, 960, t, seg(t, 20.15, 20.6), cuddle ? 260 : 170);
    if (segV3) poofCloud(ctx, 500, 1440, t, T_CUDDLE - 0.3, 1.45);
    ctx.restore();

    // ---- overlays ----
    whipFx(ctx, wp.fx);
    hookText(ctx, 'him vs her:\nbeing sick 🤒');
    const LY = 1565;
    label(ctx, 'HIM', 385, LY, t, 0.3, T_V1 - 0.2, { bg: ACCENT.him, size: 64 });
    label(ctx, 'HER', 385, LY, t, T_V1 + 0.25, T_V3 - 0.2, { bg: ACCENT.her, size: 64 });
    chip(ctx, '🌡️ 37.1 °C', 650, LY, t, 0.75, T_V1 - 0.2, { size: 54, bg: 'rgba(111,156,242,0.95)' });
    chip(ctx, '🌡️ 39.4 °C', 650, LY, t, T_V1 + 0.6, T_V3 - 0.2, { size: 54, bg: 'rgba(255,95,126,0.95)' });
    searchCard(ctx, 'is 37.1° fatal?', t, 5.35, 7.35, 630);
    if (segHim) emojiPop(ctx, '😇', 820, 700, t, 7.9, 9.1, 110);
    drawLines(ctx, S, t, { him, her }, cam);
    narration(ctx, 'he tried 🥹', 540, 470, t, 20.6, T_END, { size: 60 });
  },
});
