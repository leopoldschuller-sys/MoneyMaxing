// Skit 4 — "him vs her getting ready"
// Him: shakes himself like a wet dog, done in 3 seconds. Her: brushing, "which bow?" (they're
// identical), outfit montage, 2 hours later ... and somehow it's HIS fault they're late.
const MID = 540, FLOOR4 = 1640;
const ACC = ['sunglasses', 'necklace', 'tophat', 'scarf', 'flowers'];
const MONT0 = 14.6, MONT_STEP = 0.62;

makeSkit({
  name: '04_getting_ready',
  duration: 28.8,
  setup(S) {
    S.music(0, 3.9, 'silly', { gain: 0.4 });
    S.say('him', 0.3, 'ok, getting ready', { dur: 0.95, hold: 0.2 });
    S.sfx(1.35, 'shake', { dur: 1.05 });
    S.say('him', 2.55, 'done 😎', { mood: 'excited', dur: 0.55, hold: 0.7 });
    S.sfx(2.55, 'sparkle', { gain: 0.6 });
    S.sfx(2.9, 'ding');
    S.sfx(3.95, 'whoosh');
    S.music(4.0, 14.5, 'cozy', { gain: 0.38 });
    for (let tt = 4.5; tt < 6.6; tt += 0.42) S.sfx(tt, 'scroll', { gain: 1.4 });
    S.sfx(4.6, 'sparkle', { gain: 0.5 });
    S.say('her', 6.9, 'which one? 🎀', { mood: 'sweet', dur: 0.95, hold: 0.9 });
    S.sfx(8.25, 'whoosh', { dur: 0.3, gain: 0.5 });
    S.say('him', 8.45, "they're literally the same", { dur: 1.35, hold: 0.4 });
    S.sfx(10.0, 'sting', { kind: 'dundun' });
    S.say('him', 10.95, '…the left one? 😅', { dur: 0.95, hold: 0.4 });
    S.say('her', 12.15, 'wrong.', { mood: 'angry', dur: 0.55, hold: 0.6 });
    S.sfx(12.95, 'whoosh', { dur: 0.3 });
    S.sfx(13.45, 'pop');
    S.sfx(13.5, 'sparkle', { gain: 0.6 });
    S.music(MONT0, MONT0 + ACC.length * MONT_STEP * 1.0 + 0.9, 'glam', { gain: 0.5 });
    for (let i = 0; i <= ACC.length; i++) { S.sfx(MONT0 + i * MONT_STEP, 'whoosh', { dur: 0.25, gain: 0.5 }); S.sfx(MONT0 + i * MONT_STEP + 0.18, 'pop', { gain: 0.6 }); }
    S.sfx(18.5, 'tada');
    S.sfx(19.9, 'crickets', { dur: 1.6, gain: 0.6 });
    S.sfx(21.0, 'whoosh', { dur: 0.35 });
    S.sfx(21.2, 'sparkle');
    S.say('her', 21.25, "ok I'm ready! let's go ✨", { mood: 'excited', dur: 1.35, hold: 0.3 });
    S.sfx(22.75, 'gasp');
    S.sfx(22.8, 'pop');
    S.say('her', 23.4, "why aren't you ready?? we're gonna be late 😤", { mood: 'angry', dur: 2.1, hold: 0.6 });
    S.sfx(25.9, 'sting', { kind: 'blink' });
    S.music(25.9, 28.8, 'sad', { gain: 0.4 });
  },

  draw(ctx, t, S) {
    const herPart = t >= 4.0;
    const later = t >= 19.8;
    const cam = {
      x: key(t, [[0, MID], [9.9, MID], [10.2, 600, ease.outCubic], [10.85, 600], [11.0, MID], [19.8, MID], [19.81, 430], [22.6, 440], [23.3, 535]]),
      y: key(t, [[0, 1250], [9.9, 1250], [10.2, 1150, ease.outCubic], [10.85, 1150], [11.0, 1250], [19.8, 1250], [19.81, 1200], [22.6, 1200], [23.3, 1250]]),
      zoom: key(t, [[0, 1.55], [9.9, 1.55], [10.2, 1.95, ease.outCubic], [10.85, 1.98], [11.0, 1.55], [19.8, 1.55], [19.81, 1.7], [22.6, 1.74], [23.3, 1.42]]),
      shake: inRange(t, 1.35, 2.4) ? 4 : inRange(t, 22.7, 23.0) ? 8 : 0,
    };

    // ---- him ----
    const him = bearState('him', { x: MID, y: FLOOR4, s: 1.05 });
    him.eyeOpen = blink(t, 4);
    if (inRange(t, 1.35, 2.4)) {
      him.shiver = 3.2; him.eyes = 'happy'; him.mouth = 'grin';
      him.squash = 1 + 0.05 * Math.sin(t * 50); him.headTilt = 0.12 * Math.sin(t * 34);
      him.aL = 0.7 + 0.4 * Math.sin(t * 40); him.aR = 0.7 + 0.4 * Math.sin(t * 40 + 1);
    }
    if (inRange(t, 2.4, 4.0)) { him.aR = 2.5; him.bR = 0.3; him.padR = true; him.mouth = 'smirk'; him.lid = 0.3; him.look = 0.15; }
    // peeking in from the left during her part
    const peek = ease.outBack(seg(t, 8.25, 8.55)) * (1 - ease.inQuad(seg(t, 12.6, 12.9)));
    if (herPart && !later) {
      him.x = lerp(-260, 175, peek); him.look = 0.7; him.s = 1.0;
      if (t > 10.0) { him.sweat = 1; him.mouth = 'wobbly'; him.brows = 'worried'; }
    }
    if (later) {
      him.x = 300; him.s = 1.0;
      const awake = t >= 22.7;
      him.eyes = awake ? (t < 25.5 ? 'shock' : 'dot') : 'sleep';
      him.mouth = awake ? (t < 25.5 ? 'bigO' : 'flat') : 'o';
      him.look = awake ? 0.6 : 0;
      if (t >= 25.5) { him.eyeScale = 1.2; him.lid = 0.15; }
      him.blush = 0.2;
    }
    him.talk = S.mouth('him', t);

    // ---- her ----
    const her = bearState('her', { x: MID, y: FLOOR4, s: 1.0 });
    her.eyeOpen = blink(t, 12, 2.9);
    let brushing = false, twoBows = false;
    if (inRange(t, 4.3, 6.7)) {
      brushing = true; her.eyes = 'happy'; her.mouth = 'smile'; her.blush = 1;
      her.aR = 2.75 + 0.18 * Math.sin(t * 13); her.bR = 1.25; her.headTilt = 0.08;
    }
    if (inRange(t, 6.7, 12.9)) {
      twoBows = true; her.aL = 1.25; her.bL = 0.5; her.aR = 1.25; her.bR = 0.5;
      her.eyes = 'sparkle'; her.mouth = 'w'; her.look = t > 8.3 ? -0.5 : 0;
      if (t >= 10.0) { her.eyes = 'dot'; her.lid = 0.42; her.lidTilt = 1; her.brows = 'angry'; her.anger = 1; her.mouth = 'flat'; her.look = -0.8; her.talkMood = 'angry'; }
    }
    if (inRange(t, 12.9, 14.5)) { her.eyes = 'happy'; her.mouth = 'smile'; her.blush = 1; }
    // montage: spin + accessories
    let acc = null;
    if (inRange(t, MONT0, MONT0 + (ACC.length + 1) * MONT_STEP)) {
      const i = Math.floor((t - MONT0) / MONT_STEP);
      const k = ((t - MONT0) % MONT_STEP) / MONT_STEP;
      her.flip = Math.cos(Math.min(1, k / 0.35) * TAU) || 0.01;
      acc = ACC[i] || null;
      her.eyes = i % 2 ? 'happy' : 'sparkle'; her.mouth = i % 2 ? 'grin' : 'pout'; her.blush = 1;
      her.aR = i % 2 ? 2.5 : 0.9; her.bR = 0.3; her.aL = 0.5; her.padR = true; her.headTilt = (i % 2 ? 1 : -1) * 0.1;
    }
    if (later) {
      her.x = lerp(1400, 770, ease.outCubic(seg(t, 21.0, 21.35)));
      her.eyes = 'sparkle'; her.mouth = 'grin'; her.blush = 1; her.aR = 2.6; her.bR = 0.3; her.padR = true;
      if (t >= 23.3) { her.eyes = 'dot'; her.lid = 0.4; her.lidTilt = 1; her.brows = 'angry'; her.anger = 1; her.arms = 'hips'; her.look = -0.7; her.talkMood = 'angry'; }
    }
    her.talk = S.mouth('her', t);

    // ---- world ----
    ctx.save();
    applyCamera(ctx, cam, t);
    drawVanity(ctx, t, {});
    if (!herPart) {
      drawBear(ctx, him, t);
      furTufts(ctx, him.x, him.y - 330, t, 1.35, 2.4);
      if (inRange(t, 1.35, 2.4)) shakeMarks(ctx, him.x, him.y - 300, 210, t, 1);
      if (inRange(t, 2.5, 4.0)) sparkles(ctx, him.x, him.y - 420, t, 1, 200, 4);
    } else if (!later) {
      drawBear(ctx, her, t);
      if (acc) drawAccessory(ctx, her, acc, t);
      if (brushing) {
        const p = pawWorld(her, 1);
        drawBrush(ctx, p[0] - 10, p[1] - 20, -0.6 + 0.2 * Math.sin(t * 13), 0.9);
        sparkles(ctx, her.x, her.y - 470, t, 1, 190, 6);
      }
      if (twoBows) {
        const pl = pawWorld(her, -1), pr = pawWorld(her, 1);
        if (t < 12.9) {
          drawBow(ctx, pl[0], pl[1] - 30, 0.95, -0.2);
          drawBow(ctx, pr[0], pr[1] - 30, 0.95, 0.2);
        }
      }
      if (inRange(t, 12.9, 13.5)) {
        // the two bows get tossed away
        const k = seg(t, 12.9, 13.5);
        drawBow(ctx, lerp(300, -200, k), lerp(1150, 900, k) + 600 * k * k, 0.9, -k * 8);
        drawBow(ctx, lerp(780, 1300, k), lerp(1150, 900, k) + 600 * k * k, 0.9, k * 8);
      }
      if (inRange(t, 13.4, 14.5)) sparkles(ctx, her.x + 70, her.y - 560, t, 1, 120, 9);
      drawBear(ctx, him, t);
    } else {
      drawBear(ctx, him, t);
      drawBeard(ctx, him, t < 22.7 ? 1 : 1);
      drawCobwebs(ctx, him.x, him.y - 420 * him.s, him.s, t, t < 22.7 ? 1 : 1 - seg(t, 22.7, 23.0));
      if (inRange(t, 22.7, 23.2)) {
        const r = mulberry32(5);
        for (let i = 0; i < 10; i++) {
          const k = seg(t, 22.7, 23.2);
          ellipse(ctx, him.x + (r() - 0.5) * 380 * (0.6 + k), him.y - 420 + (r() - 0.5) * 300 * (0.6 + k), 50 * (1 - k) + 10, 40 * (1 - k) + 8);
          fillStroke(ctx, 'rgba(240,240,245,0.9)', 'rgba(51,58,71,0.5)', 3);
        }
      }
      spotlight(ctx, her.x, her.y - 300, inRange(t, 21.0, 23.3) ? 1 - seg(t, 23.0, 23.3) : 0);
      drawBear(ctx, her, t);
      if (inRange(t, 21.1, 23.3)) sparkles(ctx, her.x, her.y - 420, t, 1, 220, 11);
      if (t < 22.7) zzz(ctx, him.x + 120, him.y - 560, t, 1, { size: 52 });
    }
    ctx.restore();

    titleCard(ctx, '2 HOURS\nLATER…', t, 18.4, 19.8, { size: 120, c1: '#B9A2FF', c2: '#8E7CF0' });

    // ---- overlays ----
    hookText(ctx, 'him vs her getting ready 💅');
    label(ctx, 'HIM:', 540, 520, t, 0.1, 3.9, { bg: ACCENT.him });
    label(ctx, 'HER:', 540, 520, t, 4.1, 5.8, { bg: ACCENT.her });
    chip(ctx, '⏱️ 3 seconds', 540, 1400, t, 2.9, 3.9, { size: 56 });
    const clock = t < MONT0 ? '🕕 6:00 PM' : t < MONT0 + 1.3 ? '🕡 6:40 PM' : t < MONT0 + 2.5 ? '🕖 7:15 PM' : '🕗 8:05 PM';
    chip(ctx, clock, 540, 1400, t, 4.3, 18.4, { size: 50 });
    narration(ctx, '*picks a 3rd identical bow*', 540, 600, t, 12.95, 14.5);
    narration(ctx, 'it’s always my\nfault somehow 🙃', 540, 600, t, 25.9, 28.8, { size: 60 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
