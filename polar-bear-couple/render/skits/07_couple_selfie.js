// Skit 7 — "taking a cute couple selfie 📸" (on the couch, smooth version)
// He blinks, looks scared, sneezes; the one where he looks great, she blinked. 98 photos later
// he's asleep on her shoulder ... and that's the one she posts, because SHE looks perfect.
useCuteLook();
const E7 = ease.inOutCubic;
const HIM7 = 385, HER7 = 695, SEAT7 = 1548;
const SHOTS = [2.7, 6.2, 9.95, 12.6];
const BURST = [16.4, 16.8, 17.2, 17.6, 18.0, 18.4, 18.8, 19.2];
const SELFIE = [0.2, 1.35, 2.25, 0.35];

const him7 = new Actor('him', { x: HIM7, y: SEAT7, s: 1.0, blush: 0.6 }, {
  x: [[0, HIM7], [16.6, HIM7], [18.6, 455, E7], [25.5, 455], [25.8, 420, E7]],
  lean: [[0, 0], [16.6, 0], [18.6, 0.06, E7], [25.5, 0.06], [25.8, 0, E7], [9.0, 0], [9.85, -0.05, E7], [10.05, 0.12, ease.outCubic], [10.6, 0, E7]].sort((a, b) => a[0] - b[0]),
  headTilt: [[0, 0], [16.6, 0], [18.6, 0.32, E7], [25.5, 0.32], [25.75, 0, ease.outBack]],
  look: [[0, 0.2], [4.1, 0.2], [4.3, 0.45, E7], [5.5, 0.45], [5.7, 0.05, E7], [25.6, 0.05], [25.8, 0.5, E7]],
  lookY: [[0, 0], [9.0, 0], [9.8, -0.45, E7], [9.95, 0.35, ease.outCubic], [10.5, 0, E7]],
  eyes: [[0, 'dot'], [2.6, 'sleep'], [2.95, 'dot'], [6.0, 'shock'], [7.6, 'dot'], [9.3, 'line'], [10.4, 'dot'], [12.4, 'happy'], [14.05, 'dot'], [17.9, 'sleep'], [25.55, 'shock'], [26.6, 'dot']],
  lid: [[0, 0], [16.6, 0], [17.8, 0.55, E7], [17.9, 0]],
  mouth: [[0, 'smile'], [4.8, 'wobbly'], [5.6, 'smile'], [6.0, 'teeth'], [7.6, 'w'], [9.0, 'o'], [10.4, 'w'], [12.4, 'grin'], [14.05, 'smile'], [15.1, 'flat'], [17.9, 'o'], [25.55, 'bigO'], [26.6, 'w']],
  mouthScale: [[0, 1], [9.0, 0.8], [9.85, 1.5, E7], [9.95, 1]],
  eyeScale: [[0, 1], [6.0, 1], [6.15, 1.25, ease.outBack], [7.5, 1.25], [7.65, 1]],
  sweat: [[0, 0], [4.8, 0], [5.0, 1, E7], [5.6, 1], [5.9, 0, E7], [6.2, 0], [6.4, 1, E7], [7.5, 1], [7.8, 0, E7]],
  smileEyes: [[0, 0.4], [12.3, 0.4], [14.0, 0.4], [14.2, 0.7, E7], [15.0, 0.7], [15.2, 0, E7]],
  snot: [[0, 0], [18.6, 0], [19.0, 0.6, E7], [20.0, 0.25, E7], [21.0, 0.6, E7], [22.0, 0.25, E7], [23.0, 0.6, E7], [24.0, 0.25, E7], [25.0, 0.6, E7], [25.5, 0]],
  arms4: [[0, ARMS.lap]],
  talkArm: [[0, 'L']],
  impulses: [[4.85, 'flinch', 0.6], [9.95, 'surprise', 1.2], [14.1, 'nod', 0.8], [15.3, 'sigh'], [25.55, 'surprise', 1.0]],
});

const her7 = new Actor('her', { x: HER7, y: SEAT7, s: 0.95, blush: 1 }, {
  x: [[0, HER7], [0.6, HER7], [1.2, 640, E7]],
  lean: [[0, 0], [0.6, 0], [1.2, -0.07, E7], [9.95, -0.07], [10.2, 0.03, ease.outCubic], [10.7, -0.07, E7]],
  headTilt: [[0, 0], [1.2, -0.16, E7], [3.9, -0.16], [4.2, 0, E7], [12.3, 0], [12.5, -0.16, E7], [15.0, -0.16], [15.2, 0, E7],
    [16.3, -0.18], [16.6, 0.1, E7], [17.0, -0.2, E7], [17.4, 0.08, E7], [17.8, -0.2, E7], [18.2, 0.1, E7], [18.6, -0.18, E7], [19.0, 0.1, E7], [19.6, -0.12, E7]],
  look: [[0, -0.3], [1.2, -0.1, E7], [4.0, -0.1], [4.2, -0.55, E7], [5.6, -0.55], [5.8, -0.1, E7], [7.6, -0.1], [7.8, -0.55, E7], [8.9, -0.55], [9.1, -0.1, E7], [15.0, -0.1], [15.2, 0.25, E7], [16.2, 0.25], [16.4, -0.05, E7], [26.3, -0.05], [26.5, -0.45, E7]],
  lookY: [[0, 0], [15.0, 0], [15.2, -0.35, E7], [16.2, -0.35], [16.4, 0, E7]],
  eyes: [[0, 'dot'], [1.3, 'happy'], [4.05, 'dot'], [7.7, 'happy'], [9.0, 'dot'], [12.5, 'sleep'], [12.75, 'dot'], [16.3, 'sparkle'], [19.8, 'happy'], [21.0, 'dot'], [26.35, 'happy']],
  lid: [[0, 0], [4.05, 0], [4.25, 0.42, E7], [5.5, 0.42], [5.7, 0, E7], [15.0, 0], [15.2, 0.4, E7], [16.2, 0.4], [16.3, 0, E7]],
  brows: [[0, null], [4.1, 'flat'], [5.6, null], [15.1, 'flat'], [16.3, null]],
  mouth: [[0, 'smile'], [4.05, 'flat'], [5.6, 'smile'], [7.7, 'grin'], [9.0, 'o'], [10.5, 'flat'], [12.5, 'smile'], [15.0, 'flat'], [16.3, 'pout'], [19.8, 'grin'], [21.0, 'smile']],
  smileEyes: [[0, 0], [1.2, 0], [1.4, 0.5, E7], [3.9, 0.5], [4.05, 0]],
  blushLines: [[0, 0], [19.8, 0], [20.1, 1, E7]],
  arms4: [[0, ARMS.lap], [0.8, ARMS.lap], [1.35, SELFIE, E7], [19.7, SELFIE], [20.3, ARMS.lap, E7], [25.6, ARMS.lap]],
  talkArm: [[0, 'none']],
  impulses: [[7.75, 'laugh'], [10.0, 'flinch', 1.0], [11.55, 'sigh'], [19.8, 'hop', 0.8]],
});

function phoneOnly(ctx, x, y, s, rot) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -60, -110, 120, 220, 26); fillStroke(ctx, '#FF9EC4', SOFT_OUT, 5);
  rrect(ctx, -46, -96, 44, 44, 14); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
  ellipse(ctx, -32, -82, 9, 9); fillStroke(ctx, '#22202A', '#77708A', 2.5);
  ellipse(ctx, -16, -66, 9, 9); fillStroke(ctx, '#22202A', '#77708A', 2.5);
  drawBow(ctx, 18, 40, 0.42, -0.2);
  ctx.restore();
}

// The couch scene as a photo; bears are evaluated at the moment of the shot.
function couchShot(c, w, h, t, S, mods = {}, blur = 0) {
  const k = w / 560;
  c.save();
  if (blur) c.filter = `blur(${blur}px)`;
  c.scale(k, k);
  c.translate(-262, -900);
  drawCozyRoom(c, t);
  const a = him7.at(t, S), b = her7.at(t, S);
  Object.assign(a, mods.him || {});
  Object.assign(b, mods.her || {}, { aR: 0.2, bR: 1.35 });
  drawBear(c, a, t);
  drawBear(c, b, t);
  drawCozyCouchFront(c, t);
  c.filter = 'none';
  c.restore();
}

function photoCard(ctx, t, t0, idx, inner, caption) {
  if (t < t0) return;
  const kIn = ease.outBack(seg(t, t0, t0 + 0.4));
  const kFly = E7(seg(t, t0 + 1.25, t0 + 1.75));
  const x = lerp(540, 905 + idx * 16, kFly), y = lerp(960, 575 + idx * 8, kFly);
  const s = lerp(lerp(0.55, 1, kIn), 0.3, kFly);
  const rot = lerp(idx % 2 ? 0.04 : -0.05, -0.14 + idx * 0.09, kFly);
  const w = 440, h = 540;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.globalAlpha = clamp(kIn * 1.6);
  ctx.shadowColor = 'rgba(60,30,70,0.35)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 14;
  rrect(ctx, -w / 2 - 24, -h / 2 - 24, w + 48, h + 130, 16); ctx.fillStyle = '#FFFDF8'; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.save(); rrect(ctx, -w / 2, -h / 2, w, h, 8); ctx.clip(); ctx.translate(-w / 2, -h / 2); inner(ctx, w, h); ctx.restore();
  ctx.font = font(46, 600); ctx.fillStyle = '#5B4A60'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(caption, 0, h / 2 + 55);
  ctx.restore();
}

makeSkit({
  name: '07_couple_selfie',
  duration: 27.5,
  fps: 60,
  mix: { sfx: 0.5, music: 0.85, rms: 0.11 },
  setup(S) {
    S.music(0, 27.5, 'lofi', { gain: 0.6 });
    S.say('her', 0.35, "let's take a cute pic 🥰", { mood: 'sweet', dur: 1.2, hold: 0.3 });
    S.say('her', 1.85, 'say cheese! 📸', { mood: 'excited', dur: 0.7, hold: 0.1 });
    for (const tt of SHOTS) { S.sfx(tt, 'shutter'); S.sfx(tt + 0.12, 'softpop', { gain: 0.6 }); }
    S.say('her', 4.2, 'you blinked 😑', { dur: 0.8, hold: 0.3 });
    S.say('him', 4.95, 'oops 😅', { dur: 0.5, hold: 0.25 });
    S.say('her', 5.55, 'again!', { dur: 0.4, hold: 0.1 });
    S.say('her', 7.75, 'why do you look scared?? 😭', { mood: 'excited', dur: 1.1, hold: 0.25 });
    S.say('him', 9.0, 'ah… ah…', { dur: 0.75, hold: 0.0 });
    S.say('him', 9.95, 'ACHOO! 🤧', { mood: 'shout', dur: 0.5, hold: 0.5 });
    S.sfx(9.95, 'whoosh', { dur: 0.35, gain: 0.45 });
    S.say('her', 11.55, 'ok… last one', { mood: 'sad', dur: 0.8, hold: 0.2 });
    S.say('him', 14.15, "that one's perfect! 😎", { mood: 'excited', dur: 1.0, hold: 0.3 });
    S.say('her', 15.3, 'I look terrible. again.', { dur: 1.0, hold: 0.2 });
    for (const tt of BURST) S.sfx(tt, 'shutter', { gain: 0.7 });
    S.say('her', 19.8, 'PERFECT ✨', { mood: 'excited', dur: 0.7, hold: 0.6 });
    S.sfx(19.85, 'chime', { notes: [79, 84, 88] });
    S.sfx(20.7, 'softpop', { gain: 0.6 });
    S.say('him', 25.7, 'huh? 😳 did we take one?', { dur: 1.0, hold: 0.2 });
    S.say('her', 26.45, 'yep 🥰', { mood: 'sweet', dur: 0.5, hold: 0.5 });
  },

  draw(ctx, t, S) {
    const cam = {
      x: key(t, [[0, 545], [9.6, 545], [10.0, 520, ease.outCubic], [10.5, 545, E7], [16.2, 545], [19.4, 560, E7]]),
      y: key(t, [[0, 1170], [16.2, 1170], [19.4, 1140, E7]]),
      zoom: key(t, [[0, 1.17], [2.4, 1.2, E7], [9.6, 1.22], [10.0, 1.3, ease.outCubic], [10.6, 1.22, E7], [16.2, 1.22], [19.4, 1.32, E7], [25.4, 1.32], [26.0, 1.4, E7]]),
      shake: inRange(t, 9.95, 10.3) ? 7 * (1 - seg(t, 9.95, 10.3)) : 0,
    };
    const him = him7.at(t, S), her = her7.at(t, S);

    ctx.save();
    applyCamera(ctx, cam, t);
    drawCozyRoom(ctx, t);
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    drawCozyCouchFront(ctx, t);
    // phone in her raised paw
    const armUp = seg(t, 0.8, 1.35) * (1 - seg(t, 19.7, 20.3));
    if (armUp > 0.05) {
      const p = pawWorld(her, 1);
      phoneOnly(ctx, p[0] + 6, p[1] - 70, 0.62 * armUp + 0.2, -0.22);
    }
    if (inRange(t, 18.4, 25.5)) zzz(ctx, him.x - 40, him.y - 600, t, seg(t, 18.4, 18.8), { size: 40, speed: 0.4 });
    if (inRange(t, 19.8, 21.2)) sparkles(ctx, her.x, her.y - 480, t, 1 - seg(t, 20.8, 21.2), 220, 6);
    ctx.restore();

    // shutter flashes
    for (const tt of SHOTS) if (inRange(t, tt - 0.03, tt + 0.22)) flash(ctx, 0.36 * smooth01((t - tt + 0.03) / 0.03) * (1 - seg(t, tt, tt + 0.22)));
    for (const tt of BURST) if (inRange(t, tt - 0.03, tt + 0.16)) flash(ctx, 0.16 * smooth01((t - tt + 0.03) / 0.03) * (1 - seg(t, tt, tt + 0.16)));

    // photo previews that then fly into the camera roll stack
    const caps = ['📸 1', '📸 2', '📸 3', '📸 4'];
    photoCard(ctx, t, SHOTS[0] + 0.1, 0, (c, w, h) => couchShot(c, w, h, SHOTS[0], S, { him: { eyes: 'sleep' } }), caps[0]);
    photoCard(ctx, t, SHOTS[1] + 0.1, 1, (c, w, h) => couchShot(c, w, h, SHOTS[1] + 0.1, S), caps[1]);
    photoCard(ctx, t, SHOTS[2] + 0.12, 2, (c, w, h) => couchShot(c, w, h, SHOTS[2] + 0.05, S, {}, 7), caps[2]);
    photoCard(ctx, t, SHOTS[3] + 0.1, 3, (c, w, h) => couchShot(c, w, h, SHOTS[3], S, { her: { eyes: 'sleep' }, him: { eyes: 'happy', mouth: 'grin' } }), caps[3]);
    if (inRange(t, 16.3, 20.6)) {
      const n = [0, 12, 21, 34, 47, 58, 71, 86, 98][BURST.filter((b) => t >= b).length];
      chip(ctx, `📸 ${n}`, 540, 1420, t, 16.35, 20.6, { size: 50, bg: 'rgba(255,127,176,0.92)' });
    }
    // the post
    const postT = 20.7;
    if (inRange(t, postT, 25.5)) {
      ctx.save();
      ctx.globalAlpha = 1 - seg(t, 25.1, 25.5);
      postedCard(ctx, 540, 1075, 540, t, postT, 25.5, (c, w, h) => couchShot(c, w, h, 19.5, S, {
        her: { eyes: 'sparkle', mouth: 'smile', blushLines: 1, headTilt: -0.12 },
        him: { eyes: 'sleep', mouth: 'o', snot: 0.6 },
      }), '2,031');
      ctx.restore();
    }

    hookText(ctx, 'taking a cute couple\nselfie 📸');
    narration(ctx, 'she always posts the one where\nonly SHE looks good 🙃', 540, 545, t, 21.3, 25.4, { size: 48 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
