// Skit 7 — "him vs me taking pictures 📸"
// He takes 3 photos of her: blurry, thumb, forehead only. She takes 247 of him with a
// running commentary ... and then posts her own selfie.
useCuteLook();
const POSE_X = 540, FLOOR7 = 1640;

// Mini version of the scene for photos. region: [x, y, w, h] of the world shown in the photo.
function miniShot(c, w, h, region, t, bears, o = {}) {
  const [rx, ry, rw] = region;
  const k = w / rw;
  c.save();
  if (o.blur) c.filter = `blur(${o.blur}px)`;
  c.scale(k, k);
  c.translate(-rx, -ry);
  drawSnowPark(c, t, { snowmanX: 1200 });
  for (const b of bears) drawBear(c, b, t);
  c.filter = 'none';
  c.restore();
}

const INSTR = [
  [12.4, 'chin up'], [13.25, 'no, down'], [14.05, 'turn left'], [14.85, 'smile!'],
  [15.75, 'not like that 😭'], [16.7, 'relax…'], [17.6, 'be natural!!'],
];

makeSkit({
  name: '07_taking_pictures',
  duration: 26.5,
  mix: { sfx: 0.55, music: 0.85, rms: 0.11 },
  setup(S) {
    S.music(0, 11.55, 'lofi', { gain: 0.6 });
    for (const tt of [2.2, 4.2, 6.2]) S.sfx(tt, 'shutter');
    for (const tt of [2.45, 4.45, 6.45]) S.sfx(tt, 'softpop');
    S.say('her', 8.6, 'babe… 🙂', { dur: 0.7, hold: 0.6 });
    S.say('him', 9.9, 'you look great tho 👍', { dur: 1.1, hold: 0.5, at: [330, 640], noTail: true });
    S.sfx(11.6, 'whoosh', { dur: 0.4, gain: 0.35 });
    S.music(11.6, 19.5, 'bouncy', { gain: 0.5 });
    INSTR.forEach(([tt, txt]) => {
      S.say('her', tt, txt, { dur: 0.5, hold: 0.2, at: [740, 1150], noTail: true, silent: true });
      S.sfx(tt + 0.35, 'shutter', { gain: 0.8 });
    });
    S.say('her', 19.6, 'perfect ✨', { mood: 'sweet', dur: 0.7, hold: 1.0, at: [740, 1150], noTail: true });
    S.sfx(19.7, 'chime', { notes: [79, 84, 88] });
    S.music(19.6, 26.5, 'lofi', { gain: 0.6 });
    S.sfx(21.3, 'softpop');
    S.sfx(22.1, 'chime', { notes: [84, 91] });
  },

  draw(ctx, t, S) {
    const part2 = t >= 11.6;
    const cam = { x: POSE_X, y: 1230, zoom: key(t, [[0, 1.28], [11.5, 1.34], [11.6, 1.28], [21.0, 1.36]]) };

    // the bear in front of the camera
    const her = bearState('her', { x: POSE_X, y: FLOOR7, s: 1.05 });
    const him = bearState('him', { x: POSE_X, y: FLOOR7, s: 1.08 });
    her.eyeOpen = blink(t, 12, 2.9); him.eyeOpen = blink(t, 3);
    if (!part2) {
      const shot = Math.floor((t - 0.8) / 2);
      her.aR = 2.45; her.bR = 1.2; her.padR = true;
      her.headTilt = (shot % 2 ? 1 : -1) * 0.14;
      her.eyes = shot % 2 ? 'happy' : 'sparkle';
      her.mouth = shot % 2 ? 'smile' : 'pout';
      if (t >= 8.4) {
        her.aR = 0.22; her.bR = 0; her.padR = false; her.arms = 'hips'; her.headTilt = 0;
        her.eyes = 'dot'; her.lid = 0.42; her.lidTilt = 1; her.brows = 'angry'; her.mouth = 'flat'; her.look = -0.4;
      }
    } else {
      let step = -1;
      INSTR.forEach(([tt], i) => { if (t >= tt) step = i; });
      him.mouth = 'w'; him.look = 0;
      if (step === 0) { him.lookY = -0.7; him.headTilt = -0.05; }
      if (step === 1) { him.lookY = 0.7; }
      if (step === 2) { him.look = -0.85; }
      if (step === 3) { him.mouth = 'teeth'; him.eyeScale = 1.25; him.pupil = [0, -0.2]; }
      if (step === 4) { him.mouth = 'wobbly'; him.sweat = 1; him.brows = 'worried'; }
      if (step === 5) { him.eyes = 'line'; him.mouth = 'flat'; him.squash = 0.96; him.aL = 0.05; him.aR = 0.05; }
      if (step === 6) { him.eyes = 'spiral'; him.mouth = 'grin'; him.arms = 'up'; him.sweat = 1; him.headTilt = 0.12 * Math.sin(t * 12); }
      if (t >= 19.6) { him.eyes = 'x'; him.mouth = 'wobbly'; him.arms = 'free'; him.sweat = 1; him.headTilt = 0.08; }
    }
    her.talk = S.mouth('her', t); him.talk = S.mouth('him', t);

    ctx.save();
    applyCamera(ctx, cam, t);
    drawSnowPark(ctx, t, {});
    drawBear(ctx, part2 ? him : her, t);
    if (!part2 && t < 8.4) sparkles(ctx, POSE_X, FLOOR7 - 520, t, 0.8, 220, 5);
    fallingSnow(ctx, t, 30, 0.4, 0.8, 9);
    ctx.restore();

    // flash on every shutter
    for (const s of S.sfxList) if (s.name === 'shutter' && inRange(t, s.t, s.t + 0.15)) flash(ctx, 0.5 * (1 - seg(t, s.t, s.t + 0.15)));

    // foreground phone (over-the-shoulder)
    if (!part2) drawPhoneBack(ctx, 150, 1560, 0.85, -0.12, '#3B3446');
    else drawPhoneBack(ctx, 840, 1520, 1.0, 0.12, '#FF9EC4', true);

    // part 1: his three photos
    if (!part2) {
      const shots = [
        [2.45, 'blur', -0.08, 330],
        [4.45, 'thumb', 0.06, 560],
        [6.45, 'top', -0.05, 790],
      ];
      for (const [t0, kind, rot, x] of shots) {
        const sh = bearState('her', { x: POSE_X, y: FLOOR7, s: 1.05, aR: 2.45, bR: 1.2, padR: true, eyes: 'sparkle', mouth: 'pout', headTilt: -0.14 });
        const fade = 1 - seg(t, 11.1, 11.5);
        if (fade <= 0) continue;
        ctx.save(); ctx.globalAlpha = fade;
        polaroid(ctx, x, 1250, 200, 250, rot, t, t0, (c, w, h) => {
          if (kind === 'top') miniShot(c, w, h, [290, 520, 500], t, [sh]);
          else miniShot(c, w, h, [270, 980, 540], t, [sh], { blur: kind === 'blur' ? 9 : 0 });
          if (kind === 'thumb') {
            ellipse(c, 10, h * 0.62, w * 0.42, h * 0.55, 0.3);
            c.fillStyle = '#F5E6EC'; c.fill();
            c.strokeStyle = 'rgba(91,74,96,0.5)'; c.lineWidth = 4; c.stroke();
          }
        }, ['📸 1', '📸 2', '📸 3'][shots.findIndex((s) => s[0] === t0)]);
        ctx.restore();
      }
    }

    // part 2: counter and the "perfect" shot
    if (part2 && t < 21.2) {
      const n = t < 12.4 ? 0 : t < 14.0 ? 12 : t < 15.7 ? 87 : t < 17.5 ? 156 : t < 19.6 ? 214 : 247;
      chip(ctx, `📸 ${n}`, 540, 1400, t, 12.3, 21.2, { size: 50, bg: 'rgba(255,127,176,0.92)' });
    }
    if (inRange(t, 19.65, 21.3)) {
      const shot = bearState('him', { x: POSE_X, y: FLOOR7, s: 1.08, eyes: 'dot', eyeScale: 1.25, mouth: 'teeth', sweat: 1 });
      polaroid(ctx, 540, 760, 300, 370, 0.04, t, 19.65, (c, w, h) => miniShot(c, w, h, [250, 980, 580], t, [shot]), '#247 ✨');
    }
    // the post: her own selfie, him barely in it
    postedCard(ctx, 540, 1010, 520, t, 21.3, 26.5, (c, w, h) => {
      const me = bearState('her', { x: 470, y: FLOOR7, s: 1.05, eyes: 'sparkle', mouth: 'smile', headTilt: -0.12, aR: 2.45, bR: 1.2, padR: true, blush: 1 });
      const bf = bearState('him', { x: 860, y: FLOOR7 + 60, s: 1.08, eyes: 'x', mouth: 'wobbly', sweat: 1 });
      miniShot(c, w, h, [260, 860, 520], t, [bf, me]);
    }, '2,031');

    hookText(ctx, 'him vs me taking\npictures 📸');
    label(ctx, 'HIM:', 540, 515, t, 0.1, 2.2, { bg: ACCENT.him });
    label(ctx, 'ME:', 540, 515, t, 11.65, 13.2, { bg: ACCENT.her });
    narration(ctx, '…then posts her own selfie 🙃', 540, 530, t, 22.1, 26.5, { size: 54 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
