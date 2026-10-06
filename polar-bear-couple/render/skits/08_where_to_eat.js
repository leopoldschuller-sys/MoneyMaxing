// Skit 8 — "asking her where she wants to eat 🍽️"
// Sushi? nah. Pizza? too heavy. ... 47 minutes later she knows exactly what she wants: sushi.
useCuteLook();
const HIM8 = 360, HER8 = 720, SEAT8 = 1545;

const OFFERS = [
  [3.2, 'sushi? 🍣', '🍣', 4.0, 'nah'],
  [4.8, 'pizza? 🍕', '🍕', 5.55, 'too heavy'],
  [6.4, 'burgers? 🍔', '🍔', 7.15, 'had that last week'],
  [8.3, 'tacos? 🌮', '🌮', 9.05, 'hmm… no'],
];
const MONTAGE = [['🍜', 10.1], ['🥗', 10.45], ['🥞', 10.8], ['🍝', 11.15], ['🥟', 11.5], ['🍛', 11.85], ['🌯', 12.2]];

makeSkit({
  name: '08_where_to_eat',
  duration: 27.0,
  mix: { sfx: 0.5, music: 0.85, rms: 0.11 },
  setup(S) {
    S.music(0, 13.4, 'bouncy', { gain: 0.5 });
    S.say('him', 0.4, 'where do you wanna eat? 🤔', { dur: 1.2, hold: 0.3 });
    S.say('her', 1.9, 'idk, you choose 🙂', { mood: 'sweet', dur: 0.9, hold: 0.3 });
    for (const [t0, q, , t1, a] of OFFERS) {
      S.say('him', t0, q, { dur: 0.6, hold: 0.2 });
      S.sfx(t0 + 0.05, 'softpop');
      S.say('her', t1, a, { dur: 0.6, hold: 0.25 });
    }
    for (const [, tt] of MONTAGE) S.sfx(tt, 'softpop', { gain: 0.7 });
    S.music(13.45, 16.7, 'dreamy', { gain: 0.5 });
    S.say('him', 13.6, 'ok what do YOU want?', { mood: 'sad', dur: 1.1, hold: 0.4 });
    S.think('her', 15.1, 'hmm… 🤔', { dur: 1.5, at: [720, 650] });
    S.say('her', 16.8, 'sushi! 🍣✨', { mood: 'excited', dur: 0.8, hold: 0.8 });
    S.sfx(16.8, 'chime', { notes: [84, 88, 91] });
    S.music(17.0, 27.0, 'lofi', { gain: 0.55 });
    S.say('him', 18.9, '…I literally said sushi first', { dur: 1.4, hold: 0.4 });
    S.say('her', 20.7, 'yeah but you said it like you didn’t mean it 🙂', { mood: 'sweet', dur: 1.9, hold: 0.5 });
    S.sfx(23.1, 'thud', { gain: 0.25 });
  },

  draw(ctx, t, S) {
    const melt = ease.inOutCubic(seg(t, 9.8, 13.4)) * (1 - ease.inOutCubic(seg(t, 13.4, 13.8)) * 0.5);
    const flop = ease.outBounce(seg(t, 23.0, 23.6));
    const cam = {
      x: key(t, [[0, 540], [17.6, 540], [18.6, 430], [20.5, 430], [20.8, 560], [22.8, 560], [23.0, 520]]),
      y: key(t, [[0, 1220], [17.6, 1220], [18.6, 1180], [20.5, 1180], [20.8, 1210]]),
      zoom: key(t, [[0, 1.26], [17.6, 1.3], [18.6, 1.6, ease.inOutCubic], [20.5, 1.62], [20.8, 1.32], [27, 1.38]]),
    };

    const him = bearState('him', { x: HIM8, y: SEAT8, s: 1.0, arms: 'hold', look: 0.35 });
    const her = bearState('her', { x: HER8, y: SEAT8, s: 0.94, arms: 'hold', look: -0.35 });
    him.eyeOpen = blink(t, 7); her.eyeOpen = blink(t, 13, 2.8);
    her.mouth = 'smile';
    // she shakes her head while saying no
    if (t > 3.9 && t < 13.0 && S.talking('her', t)) her.headTilt = 0.12 * Math.sin(t * 20);
    if (t > 3.9 && t < 13.0) { her.eyes = 'happy'; her.mouth = 'w'; }
    for (const [, tt] of MONTAGE) if (inRange(t, tt, tt + 0.3)) her.headTilt = 0.12 * Math.sin(t * 24);
    // he slowly sinks into the couch
    him.y = SEAT8 + 70 * melt; him.squash = 1 - 0.06 * melt;
    if (t > 9.0) { him.sweat = clamp(melt * 2); him.mouth = 'wobbly'; }
    if (inRange(t, 11.5, 13.6)) { him.eyes = 'spiral'; }
    if (inRange(t, 13.6, 16.8)) { him.eyes = 'dot'; him.lid = 0.5; him.mouth = 'flat'; him.sweat = 0.6; }
    if (inRange(t, 15.0, 16.8)) { her.eyes = 'dot'; her.lookY = -0.6; her.pupil = [0.5, -0.8]; her.mouth = 'pout'; her.headTilt = 0.1; }
    if (inRange(t, 16.8, 18.8)) { her.eyes = 'sparkle'; her.mouth = 'grin'; her.blush = 1; her.arms = 'up'; }
    if (t >= 17.4) { him.eyes = 'dot'; him.eyeScale = 0.75; him.lid = 0.15; him.mouth = 'flat'; him.sweat = 0; him.look = 0.1; }
    if (t >= 20.6) { her.eyes = 'happy'; her.mouth = 'smile'; her.headTilt = -0.1; }
    if (t >= 23.0) {
      him.eyes = 'x'; him.mouth = 'wobbly'; him.lean = -0.4 * flop; him.y = SEAT8 + 70 * melt + 40 * flop; him.look = -0.2;
    }
    him.talk = S.mouth('him', t); her.talk = S.mouth('her', t);

    ctx.save();
    applyCamera(ctx, cam, t);
    drawCozyRoom(ctx, t);
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    drawCozyCouchFront(ctx, t);
    if (inRange(t, 16.8, 18.6)) sparkles(ctx, her.x, her.y - 470, t, 1, 200, 7);
    ctx.restore();

    // food suggestions
    for (const [t0, , e, t1] of OFFERS) foodChip(ctx, e, 540, 1390, t, t0 + 0.05, t1 + 0.7, true);
    MONTAGE.forEach(([e, tt], i) => foodChip(ctx, e, 220 + (i % 4) * 215, 1310 + (i % 2) * 150, t, tt, 13.3, true));
    foodChip(ctx, '🍣', 540, 1390, t, 16.8, 18.8, false);
    chip(ctx, '⏱️ 47 minutes later…', 540, 560, t, 12.3, 13.5, { size: 46, bg: 'rgba(91,74,96,0.88)' });

    hookText(ctx, 'asking her where she\nwants to eat 🍣');
    bigText(ctx, 'every couple ever 🙃', 540, 600, t, 23.8, 27.0, { size: 78 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
