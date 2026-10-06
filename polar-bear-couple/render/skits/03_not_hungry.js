// Skit 3 — "she said she's not hungry 🙂"
// He orders, she isn't hungry. Every time he looks away, his food gets shorter. Puppy eyes win
// the rest of the plate ... and then she's hungry, can they order something?
const HIM3 = 345, HER3 = 740, SEAT_Y = 1500;
const PLATE = [330, 1286], FRIES = [520, 1300];

makeSkit({
  name: '03_not_hungry',
  duration: 28.5,
  setup(S) {
    S.music(0, 5.6, 'silly', { gain: 0.42 });
    S.say('him', 0.35, "I'm ordering food, want anything? 🍔", { dur: 1.7, hold: 0.4 });
    S.say('her', 2.4, "no, I'm not hungry 🙂", { mood: 'sweet', dur: 1.15, hold: 0.6 });
    S.sfx(3.9, 'doorbell');
    S.sfx(4.35, 'whoosh', { dur: 0.35 });
    S.sfx(4.55, 'sparkle', { gain: 0.6 });
    S.say('him', 4.75, 'yesss 😋', { mood: 'excited', dur: 0.7, hold: 0.4 });
    S.music(5.6, 6.95, 'sneaky', { gain: 0.5 });
    S.sfx(5.95, 'whoosh', { dur: 0.25, gain: 0.6 });
    S.sfx(6.15, 'chomp');
    S.sfx(6.45, 'chomp');
    S.sfx(6.75, 'gulp');
    S.say('him', 7.3, 'did you eat my fries?', { dur: 1.1, hold: 0.5 });
    S.say('her', 8.75, 'no?? 😇', { mood: 'sweet', dur: 0.7, hold: 0.8 });
    S.music(10.4, 12.2, 'sneaky', { gain: 0.5, tempo: 1.25 });
    S.sfx(10.75, 'whoosh', { dur: 0.25, gain: 0.6 });
    for (const tt of [11.0, 11.25, 11.5, 11.75]) S.sfx(tt, 'chomp');
    S.sfx(12.3, 'sting', { kind: 'dun' });
    S.say('her', 13.1, "I'm not hungry 🙂", { mood: 'sweet', dur: 1.0, hold: 0.8 });
    S.sfx(15.0, 'whoosh', { dur: 0.3, gain: 0.5 });
    S.say('her', 16.3, 'just one bite? 🥺', { mood: 'sweet', dur: 1.1, hold: 0.8 });
    S.music(16.2, 18.4, 'sad', { gain: 0.5 });
    S.sfx(18.3, 'sigh', { voice: 'him', gain: 1.2 });
    S.sfx(19.0, 'whoosh', { dur: 0.3 });
    S.music(19.2, 20.3, 'chaos', { gain: 0.4 });
    for (let tt = 19.3; tt < 20.2; tt += 0.12) S.sfx(tt, 'chomp', { gain: 0.8 });
    S.sfx(20.35, 'sparkle');
    S.say('her', 21.0, 'babe…', { mood: 'sweet', dur: 0.6, hold: 0.5 });
    S.say('him', 21.9, 'what.', { dur: 0.45, hold: 0.5 });
    S.say('her', 22.8, "I'm hungry. can we order something? 🥺", { mood: 'sweet', dur: 1.9, hold: 0.7 });
    S.sfx(25.3, 'thud');
    S.sfx(25.35, 'wobble');
    S.sfx(26.0, 'sting', { kind: 'dundun' });
  },

  draw(ctx, t, S) {
    const cam = {
      x: key(t, [[0, 540], [12.25, 540], [12.45, 380, ease.outCubic], [13.05, 380], [13.25, 700, ease.outCubic], [14.8, 700], [15.0, 540], [16.2, 540], [16.45, 710, ease.outCubic], [18.2, 710], [18.4, 540]]),
      y: key(t, [[0, 1150], [12.25, 1150], [12.45, 1110], [13.05, 1110], [13.25, 1110], [14.8, 1110], [15.0, 1150], [16.2, 1150], [16.45, 1110], [18.2, 1110], [18.4, 1150]]),
      zoom: key(t, [[0, 1.38], [12.25, 1.38], [12.45, 1.85, ease.outCubic], [13.05, 1.88], [13.25, 1.85, ease.outCubic], [14.8, 1.85], [15.0, 1.38], [16.2, 1.38], [16.45, 1.9, ease.outCubic], [18.2, 1.92], [18.4, 1.38], [25.9, 1.38], [26.2, 1.46, ease.outBack], [28.5, 1.48]]),
      shake: inRange(t, 25.3, 25.6) ? 12 : 0,
    };
    const food = t >= 4.3;
    const slideIn = ease.outBack(seg(t, 4.3, 4.6));
    const friesLeft = t < 5.9 ? 1 : t < 6.8 ? lerp(1, 0.15, seg(t, 5.9, 6.8)) : 0.15;
    const fishEaten = t < 10.9 ? 0 : t < 11.9 ? 0.55 * seg(t, 10.9, 11.9) : t < 19.2 ? 0.55 : lerp(0.55, 1.0, seg(t, 19.2, 20.1));
    const plateGone = t >= 20.1;
    const plateToHer = ease.inOutCubic(seg(t, 18.9, 19.2));
    const guard = inRange(t, 15.0, 18.9) ? ease.outBack(seg(t, 15.0, 15.35)) : 0;
    const plateX = lerp(PLATE[0] + guard * 30, HER3 - 20, plateToHer);

    // ---- him ----
    const him = bearState('him', { x: HIM3, y: SEAT_Y, s: 1.0, look: 0.35 });
    him.eyeOpen = blink(t, 5);
    if (food && t < 5.6) { him.eyes = 'sparkle'; him.mouth = 'grin'; him.blush = 0.7; }
    const away1 = inRange(t, 5.6, 6.9), away2 = inRange(t, 10.4, 12.1);
    if (away1 || away2) {
      him.look = -1; him.headTilt = -0.08; him.lean = -0.05;
      him.reachL = [HIM3 - 215, 1240 + 10 * Math.sin(t * 8)];
      him.mouth = 'smile';
    }
    if (inRange(t, 6.9, 10.4)) { him.look = 0.7; him.eyes = 'dot'; him.lid = t > 9.6 ? 0.45 : 0; him.brows = t > 9.6 ? 'sus' : null; him.mouth = t > 9.6 ? 'flat' : 'w'; }
    if (inRange(t, 12.1, 15.0)) { him.look = 0.4; him.eyes = 'shock'; him.mouth = 'bigO'; him.pupil = [0.6, 0.3]; }
    if (inRange(t, 15.0, 18.3)) {
      him.look = 0.6; him.brows = 'angry'; him.lid = 0.35; him.lidTilt = 1; him.mouth = 'frown';
      him.reachR = [plateX + 120, 1262]; him.reachL = [plateX - 150, 1262];
      if (t > 16.5) { him.brows = 'sad'; him.lid = 0.2; him.lidTilt = -0.4; him.mouth = 'wobbly'; him.sweat = seg(t, 16.8, 17.2); }
    }
    if (inRange(t, 18.3, 19.0)) { him.eyes = 'sleep'; him.mouth = 'flat'; him.squash = 1 - 0.05 * Math.sin(Math.PI * seg(t, 18.3, 19.0)); }
    if (inRange(t, 19.0, 21.9)) { him.eyes = 'shock'; him.mouth = 'flat'; him.look = 0.7; him.pupil = [0.8, 0]; }
    if (t >= 21.9) { him.look = 0.6; him.eyes = 'dot'; him.lid = 0.55; him.mouth = 'flat'; }
    if (t >= 25.0) {
      // face-plant onto the table
      const k = ease.inQuad(seg(t, 25.0, 25.3));
      him.y = SEAT_Y + 118 * k; him.headTilt = 0.38 * k; him.eyes = 'x'; him.mouth = 'tongue'; him.lid = 0; him.look = 0;
    }
    him.talk = S.mouth('him', t);

    // ---- her ----
    const her = bearState('her', { x: HER3, y: SEAT_Y, s: 0.92, look: -0.35 });
    her.eyeOpen = blink(t, 9, 3.1);
    if (t < 4.3) { her.mouth = 'w'; }
    if (inRange(t, 5.7, 6.9)) {
      her.eyes = 'dot'; her.lid = 0.45; her.pupil = [-0.8, 0]; her.mouth = 'smirk'; her.look = -0.6;
      her.reachL = t < 6.4 ? [FRIES[0] + 10, FRIES[1] - 50] : null;
      her.cheekPuff = seg(t, 6.2, 6.4);
    }
    if (inRange(t, 6.9, 10.4)) {
      her.cheekPuff = t < 9.6 ? 1 : 0; her.mouth = 'chew'; her.crumbs = 1; her.look = 0.5; her.pupil = [0.6, -0.6];
      her.eyes = t > 8.6 && t < 9.6 ? 'happy' : 'dot';
      if (t > 9.6) { her.mouth = 'w'; her.look = -0.2; }
    }
    if (inRange(t, 10.4, 12.1)) {
      her.eyes = 'dot'; her.lid = 0.45; her.pupil = [-0.8, 0]; her.mouth = 'smirk'; her.look = -0.7;
      her.reachL = t < 11.0 ? [plateX + 20, 1270] : null;
      her.cheekPuff = seg(t, 11.0, 11.2); her.mouth = t > 11 ? 'chew' : 'smirk';
    }
    if (inRange(t, 12.1, 15.0)) { her.cheekPuff = 1; her.fishTail = 1; her.mouth = 'none'; her.look = 0.3; her.eyes = t > 12.9 ? 'happy' : 'dot'; her.crumbs = 1; }
    if (inRange(t, 15.0, 16.2)) { her.look = -0.6; her.eyes = 'dot'; her.mouth = 'pout'; }
    if (inRange(t, 16.2, 18.9)) { her.eyes = 'sparkle'; her.mouth = 'pout'; her.blush = 1; her.headTilt = -0.15; her.look = -0.6; her.arms = 'hold'; }
    if (inRange(t, 19.2, 20.2)) { her.shiver = 1.5; her.eyes = 'happy'; her.mouth = 'chew'; her.cheekPuff = 0.7; }
    if (inRange(t, 20.2, 25.0)) { her.eyes = 'happy'; her.mouth = 'smile'; her.blush = 1; her.look = -0.5; her.crumbs = 1; }
    if (inRange(t, 22.7, 25.0)) { her.eyes = 'sparkle'; her.mouth = 'pout'; her.headTilt = -0.12; }
    if (t >= 25.0) { her.eyes = 'dot'; her.mouth = 'o'; her.look = -0.6; her.pupil = [-0.5, 0.4]; }
    her.talk = S.mouth('her', t);

    // ---- world ----
    ctx.save();
    applyCamera(ctx, cam, t);
    drawKitchen(ctx, t, { chairs: [HIM3, HER3] });
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    drawTable(ctx, t);
    drawGlass(ctx, 185, 1300, 0.85, 0.75);
    if (food) {
      const sx = lerp(-300, 0, slideIn);
      if (!plateGone) {
        drawPlate(ctx, plateX + sx, PLATE[1] + 18, 0.85);
        drawFish(ctx, plateX + sx, PLATE[1] - 10, 0.85, fishEaten, 0);
      } else {
        drawPlate(ctx, HER3 - 20, PLATE[1] + 18, 0.85);
        sparkles(ctx, HER3 - 20, PLATE[1] - 10, t, 1 - seg(t, 21.5, 22.0), 110, 12);
      }
      drawFries(ctx, FRIES[0] + sx, FRIES[1], 0.85, friesLeft, t);
    }
    // paws resting on the table
    if (!(away1 || away2) && !inRange(t, 15.0, 18.3) && t < 25.0) {
      drawPaw(ctx, HIM3 - 95, 1292, 28);
      drawPaw(ctx, HIM3 + 95, 1292, 28);
    }
    if (!inRange(t, 5.7, 6.4) && !inRange(t, 10.4, 11.0) && !inRange(t, 16.2, 18.9)) {
      drawPaw(ctx, HER3 - 88, 1292, 26);
      drawPaw(ctx, HER3 + 88, 1292, 26);
    }
    if (inRange(t, 6.2, 6.6)) drawFries(ctx, HER3 - 40, 1150, 0.4, 0.4, t);
    // devouring whirlwind
    if (inRange(t, 19.2, 20.2)) {
      const r = mulberry32(Math.floor(t * 30));
      for (let i = 0; i < 14; i++) {
        ellipse(ctx, HER3 - 40 + (r() - 0.5) * 340, 1150 + (r() - 0.5) * 300, 40 + r() * 50, 34 + r() * 40);
        fillStroke(ctx, 'rgba(235,238,245,0.95)', 'rgba(51,58,71,0.7)', 4);
      }
    }
    ctx.restore();
    if (inRange(t, 12.25, 13.05)) speedLines(ctx, W / 2, 900, t, 0.6);

    // ---- overlays ----
    hookText(ctx, "she said she's\nnot hungry 🙂");
    narration(ctx, '*food arrives*', 540, 560, t, 4.3, 5.5);
    narration(ctx, '*looks away for 1 second*', 540, 560, t, 5.65, 6.9);
    narration(ctx, '*looks away again*', 540, 560, t, 10.45, 12.0);
    narration(ctx, '*protects the plate*', 540, 560, t, 15.05, 16.2);
    if (inRange(t, 19.2, 20.2)) bigText(ctx, 'NOM NOM NOM', 540, 620, t, 19.2, 20.2, { size: 96, color: '#FFE45C', rot: -0.06 });
    bigText(ctx, 'every. single.\ntime. 💀', 540, 640, t, 26.0, 28.5, { size: 86 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
