// Skit 2 — "when he falls asleep in the middle of an argument"
// She is mid-rant, he dozes off. Her "subtle" wake-up attempts fail (he's a polar bear, the
// stolen blanket only makes him happier). He sleep-talks "I love you…" — she melts —
// "…salmon". WHO IS SALMON. Pillow. Round 2.
const HIM_X2 = 345, HEAD_Y2 = 960, HER_X2 = 735;
const SNORE2 = 2.2;

makeSkit({
  name: '02_asleep_mid_argument',
  duration: 27.5,
  setup(S) {
    S.music(0, 4.75, 'tense', { gain: 0.4 });
    S.say('her', 0.3, 'and ANOTHER thing…', { mood: 'angry', dur: 1.25, hold: 0.3 });
    S.say('him', 1.85, 'mhm…', { mood: 'sleepy', dur: 0.6, hold: 0.3 });
    S.say('her', 2.75, 'are you even listening?! 😤', { mood: 'angry', dur: 1.45, hold: 0.4 });
    for (let tt = 4.65; tt < 22.3; tt += SNORE2) S.sfx(tt, 'snore', { gain: 0.9 });
    S.sfx(4.8, 'scratch');
    S.sfx(5.35, 'sting', { kind: 'dundun' });
    S.say('her', 6.2, 'excuse me??', { mood: 'shout', dur: 0.85, hold: 0.6 });
    S.music(6.2, 14.55, 'sneaky', { gain: 0.5 });
    S.sfx(7.7, 'whoosh', { dur: 1.1, gain: 1.3 });
    S.sfx(8.85, 'thud', { gain: 0.6 });
    S.sfx(9.7, 'click');
    S.sfx(9.75, 'sparkle', { gain: 0.6 });
    S.sfx(11.8, 'whoosh', { dur: 0.5 });
    S.say('him', 12.55, 'ahh… so refreshing ❄️', { mood: 'sleepy', dur: 1.4, hold: 0.5 });
    S.sfx(13.6, 'pop');
    S.music(14.6, 16.95, 'tense', { gain: 0.5 });
    S.sfx(14.7, 'kettle');
    S.say('him', 17.0, 'mmm… I love you…', { mood: 'sleepy', dur: 1.3, hold: 0.9 });
    S.music(17.0, 20.4, 'romantic', { gain: 0.55 });
    S.sfx(17.7, 'hearts');
    S.say('him', 19.75, '…salmon 🐟', { mood: 'sleepy', dur: 0.75, hold: 0.9 });
    S.sfx(20.45, 'scratch');
    S.say('her', 21.0, 'WHO IS SALMON?!', { mood: 'shout', dur: 1.2, hold: 0.7 });
    S.sfx(21.0, 'sting', { kind: 'dun' });
    S.sfx(22.45, 'whoosh', { dur: 0.3 });
    S.sfx(22.7, 'thud');
    S.sfx(22.72, 'boing');
    S.say('him', 23.35, "huh?? what'd I do??", { mood: 'excited', dur: 1.1, hold: 0.6 });
    S.sfx(24.9, 'bell_round');
    S.music(21.0, 22.65, 'tense', { gain: 0.5 });
    S.music(22.7, 27.5, 'chaos', { gain: 0.5 });
  },

  draw(ctx, t, S) {
    const cam = {
      x: key(t, [[0, 540], [5.1, 540], [5.9, 715, ease.outCubic], [7.4, 715], [7.7, 540], [20.8, 540], [21.05, 700, ease.outCubic], [22.2, 700], [22.4, 540]]),
      y: key(t, [[0, 990], [5.1, 990], [5.9, 860, ease.outCubic], [7.4, 860], [7.7, 990], [20.8, 990], [21.05, 860, ease.outCubic], [22.2, 860], [22.4, 990]]),
      zoom: key(t, [[0, 1.2], [5.1, 1.2], [5.9, 1.62, ease.outCubic], [7.4, 1.65], [7.7, 1.2], [20.8, 1.2], [21.05, 1.75, ease.outCubic], [22.2, 1.8], [22.4, 1.2], [24.9, 1.2], [25.2, 1.28, ease.outBack], [27.5, 1.3]]),
      shake: inRange(t, 21.0, 21.8) ? 12 : inRange(t, 22.7, 23.0) ? 14 : inRange(t, 15.2, 16.9) ? 3 : 0,
    };
    const asleep = t >= 4.45 && t < 22.7;
    const sPh = ((t - 4.65) % SNORE2 + SNORE2) % SNORE2 / SNORE2;
    const breath = sPh < 0.55 ? ease.inOut(sPh / 0.55) : 1 - ease.inOut((sPh - 0.55) / 0.45);
    const lightsOn = inRange(t, 9.7, 11.6);
    const pulled = ease.outBack(seg(t, 11.8, 12.15));

    // ---- him ----
    const him = bearState('him', { pose: 'head', x: HIM_X2, y: HEAD_Y2, s: 0.95, look: 0.5 });
    him.lid = lerp(0.35, 0.6, seg(t, 1.8, 4.2));
    him.eyeOpen = 1 - seg(t, 4.1, 4.45);
    if (asleep) {
      him.eyes = 'sleep'; him.look = 0.1; him.lid = 0;
      him.snot = breath * 0.8; him.mouth = 'o';
      him.headTilt = -0.05 + 0.03 * breath;
    }
    if (inRange(t, 12.4, 14.6)) { him.mouth = 'smile'; him.blush = 0.8; him.snot = 0; }
    if (inRange(t, 16.9, 21.0)) { him.mouth = 'smile'; him.blush = 0.9; him.snot = 0; }
    if (t >= 22.7) {
      him.eyes = 'shock'; him.mouth = 'bigO'; him.look = 0.6; him.snot = 0;
      him.headTilt = 0.1 * Math.sin(t * 30) * (1 - seg(t, 22.7, 23.2));
      if (t > 24.0) { him.eyes = 'dot'; him.eyeScale = 1.2; him.mouth = 'wobbly'; him.sweat = 1; }
    }
    him.talk = S.mouth('him', t);

    // ---- her (sitting up) ----
    const her = bearState('her', { x: HER_X2, y: 1190, s: 0.9, arms: 'crossed', look: -0.55 });
    her.eyes = 'dot'; her.brows = 'angry'; her.lid = 0.35; her.lidTilt = 1; her.anger = 1;
    her.eyeOpen = blink(t, 21, 2.8);
    her.talkMood = 'angry';
    her.bob = Math.sin(t * 9) * 3 * (S.talking('her', t) ? 1 : 0);
    if (inRange(t, 4.6, 6.2)) {
      // freeze, then slowly turn
      her.anger = 0; her.brows = null; her.lid = 0; her.eyes = 'dot'; her.eyeScale = 1.15;
      her.look = lerp(-0.1, -0.85, ease.inOut(seg(t, 5.0, 5.8)));
      her.mouth = 'flat';
    }
    if (inRange(t, 6.2, 7.4)) { her.talkMood = 'shout'; her.arms = 'hips'; }
    if (inRange(t, 7.6, 9.4)) {
      // big sigh
      const k = Math.sin(Math.PI * seg(t, 7.7, 8.8));
      her.squash = 1 + 0.06 * k; her.lid = 0.45; her.lidTilt = -0.5; her.brows = 'flat'; her.anger = 0;
      her.mouth = k > 0.2 ? 'o' : 'flat'; her.headTilt = -0.1 * k; her.look = -0.6;
    }
    if (inRange(t, 9.4, 11.6)) { her.arms = 'free'; her.aR = 2.2; her.bR = 0.4; her.padR = true; her.mouth = 'smirk'; her.anger = 0; her.look = -0.5; }
    if (inRange(t, 11.6, 14.6)) {
      her.arms = 'hold'; her.mouth = t < 12.5 ? 'smirk' : 'frown';
      if (t >= 12.5) { her.eyes = 'dot'; her.lid = 0.5; her.lidTilt = 0; her.brows = 'flat'; her.anger = 0; her.look = -0.7; }
    }
    if (inRange(t, 14.6, 17.0)) {
      const k = seg(t, 14.7, 16.3);
      her.redFace = k; her.steam = seg(t, 15.1, 15.5); her.shiver = 0.4 + 0.8 * k; her.mouth = 'teeth';
      her.lid = 0.45; her.anger = 1.3; her.look = -0.8;
    }
    if (inRange(t, 17.5, 20.45)) {
      her.eyes = 'heart'; her.lid = 0; her.brows = null; her.anger = 0; her.mouth = 'smile'; her.blush = 1; her.blushLines = 1;
      her.arms = 'free'; her.aL = 0.3; her.aR = 0.3; her.headTilt = -0.12 + 0.04 * Math.sin(t * 4); her.look = -0.4;
    }
    if (inRange(t, 20.45, 21.0)) { her.eyes = 'shock'; her.brows = null; her.lid = 0; her.anger = 0; her.mouth = 'flat'; her.arms = 'free'; }
    if (inRange(t, 21.0, 22.5)) { her.eyes = 'shock'; her.pupil = [-0.5, 0]; her.lid = 0.2; her.lidTilt = 1; her.brows = 'angry'; her.talkMood = 'shout'; her.arms = 'up'; her.redFace = 0.8; }
    if (inRange(t, 22.2, 22.7)) { her.arms = 'free'; her.aR = 2.6; her.bR = -0.4; her.aL = 0.4; }
    if (t >= 22.7) { her.arms = 'crossed'; her.eyes = 'dot'; her.lid = 0.4; her.lidTilt = 1; her.brows = 'angry'; her.anger = 1; her.mouth = 'smirk'; }
    her.talk = S.mouth('her', t);

    // ---- world ----
    ctx.save();
    applyCamera(ctx, cam, t);
    drawBedroomBack(ctx, t, { lamp: 1, clock: '1:12' });
    drawLyingBody(ctx, HIM_X2, 1040, 0.85);
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    drawBlanket(ctx, t, { humps: [HIM_X2 + pulled * 300, HER_X2], pulled });
    if (lightsOn) {
      // paw over his eyes against the light
      drawPaw(ctx, HIM_X2 - 20, 930, 34, true, -0.3);
    }
    glow(ctx, 1035, 1010, 500, '255,214,140', 0.5);
    // thrown pillow
    if (inRange(t, 22.2, 24.5)) {
      const k = seg(t, 22.3, 22.7);
      const fly = ease.inQuad(k);
      const px = t < 22.7 ? lerp(HER_X2 + 60, HIM_X2 + 10, fly) : lerp(HIM_X2 + 10, HIM_X2 - 160, ease.outQuad(seg(t, 22.7, 23.3)));
      const py = t < 22.7 ? lerp(700, 940, fly) - Math.sin(Math.PI * k) * 160 : lerp(940, 1180, ease.inQuad(seg(t, 22.7, 23.3)));
      drawThrowPillow(ctx, px, py, 0.8, t < 22.7 ? -k * 6 : -0.4 - seg(t, 22.7, 23.3) * 2);
      feathers(ctx, HIM_X2, 930, t, 22.7, 12);
    }
    if (asleep && !inRange(t, 12.4, 14.6) && !inRange(t, 16.9, 21.0)) zzz(ctx, HIM_X2 + 110, HEAD_Y2 - 100, t, 1, { size: 50 });
    if (inRange(t, 17.0, 20.4)) floatingHearts(ctx, 560, 800, t, seg(t, 17.0, 17.4) * (1 - seg(t, 20.2, 20.4)), 160);
    if (lightsOn) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255,250,220,${0.35 * (1 - 0.3 * seg(t, 9.75, 10.2))})`;
      ctx.fillRect(-400, -400, W + 800, H + 800);
      ctx.restore();
    }
    ctx.restore();

    flash(ctx, 0.9 * (1 - seg(t, 9.7, 10.0)) * (t >= 9.7 ? 1 : 0));
    if (inRange(t, 21.0, 21.9)) flash(ctx, 0.25 * (1 - seg(t, 21.0, 21.9)), '255,40,60');
    if (inRange(t, 21.0, 22.2)) speedLines(ctx, W / 2, 900, t, 0.7 * (1 - seg(t, 21.6, 22.2)));
    if (inRange(t, 4.6, 7.4)) vignette(ctx, 0.35 * seg(t, 4.8, 5.4));

    // ---- overlays ----
    hookText(ctx, 'when he falls asleep in the\nmiddle of an argument 🙂');
    narration(ctx, '*sighs at 100 decibels*', 540, 560, t, 7.65, 9.4);
    narration(ctx, '*turns on ALL the lights*', 540, 560, t, 9.7, 11.6);
    narration(ctx, '*steals the whole blanket*', 540, 560, t, 11.85, 13.5);
    narration(ctx, "he's literally a polar bear 🙃", 540, 560, t, 13.6, 14.6, { color: '#9FE7FF' });
    narration(ctx, '*throws pillow*', 540, 560, t, 22.25, 23.3);
    bigText(ctx, 'ROUND 2 🥊', 540, 640, t, 24.9, 27.5, { size: 120, rot: -0.05, color: '#FFE45C' });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
