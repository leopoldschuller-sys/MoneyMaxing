// Skit 1 — "him vs me trying to fall asleep"
// He says goodnight and is snoring 0.3 s later. She lies awake until 3:47 AM, pokes him,
// he cuddles her, she falls asleep instantly ... and now HE is awake with a dead arm.
const SNORE_T0 = 2.95, SNORE_P = 2.3, WAKE = 18.9;
const HIM_X = 345, HER_X = 735, HEAD_Y = 960;

makeSkit({
  name: '01_him_vs_me_sleep',
  duration: 29.5,
  setup(S) {
    S.music(0, 2.45, 'cozy', { gain: 0.55 });
    S.say('him', 1.25, 'night babe ❤️', { mood: 'sweet', hold: 0.7 });
    S.sfx(2.45, 'click');
    for (let tt = SNORE_T0; tt < WAKE - 0.3; tt += SNORE_P) S.sfx(tt, 'snore', { gain: tt > 13.9 ? 1.25 : 0.85 });
    S.sfx(3.05, 'ding');
    S.sfx(4.55, 'whoosh');
    S.sfx(4.7, 'crickets', { dur: 9.2, gain: 0.5 });
    S.music(2.5, 13.95, 'night', { gain: 0.45 });
    S.think('her', 6.0, 'did I lock the door? 🤔', { dur: 2.3, at: [600, 610] });
    S.sfx(6.0, 'pop');
    S.think('her', 8.5, 'that thing I said in 7th grade 😳', { dur: 2.3, at: [600, 610] });
    S.sfx(8.5, 'pop');
    S.sfx(8.8, 'squeak');
    S.sfx(10.9, 'tick');
    for (let tt = 11.5; tt < 13.8; tt += 0.55) S.sfx(tt, 'scroll');
    S.sfx(13.95, 'sting', { kind: 'dun' });
    S.music(13.95, 18.45, 'tense', { gain: 0.45 });
    S.music(18.5, 22.3, 'sad', { gain: 0.5 });
    S.sfx(15.7, 'sting', { kind: 'dundun' });
    S.think('her', 16.3, 'HOW does he do that 😤', { dur: 2.0, at: [560, 600] });
    S.sfx(18.5, 'boop');
    S.sfx(18.85, 'boop');
    S.sfx(18.9, 'bubble_pop');
    S.say('him', 19.4, 'hm? you okay? 🥺', { mood: 'sleepy', dur: 1.2 });
    S.say('her', 20.9, "I can't sleep 😭", { mood: 'sad', dur: 1.1 });
    S.say('him', 22.35, 'aww come here 🥰', { mood: 'sweet', dur: 0.95 });
    S.sfx(23.2, 'whoosh', { gain: 0.5 });
    S.sfx(23.6, 'hearts');
    S.music(22.35, 26.05, 'romantic', { gain: 0.55 });
    S.music(26.1, 29.5, 'night', { gain: 0.4 });
    S.sfx(24.45, 'ding');
    S.sfx(24.6, 'snore', { voice: 'her', gain: 0.5 });
    S.sfx(26.9, 'snore', { voice: 'her', gain: 0.5 });
    S.sfx(26.1, 'crickets', { dur: 3.4, gain: 0.55 });
    S.sfx(26.15, 'sting', { kind: 'blink' });
    S.think('him', 26.5, "can't feel my arm 🥲", { dur: 2.9, at: [500, 640] });
  },

  draw(ctx, t, S) {
    const lampOff = t >= 2.45;
    const cam = {
      x: key(t, [[0, 540], [4.5, 540], [4.95, 715, ease.outCubic], [13.9, 715], [14.25, 540, ease.outCubic], [15.6, 540], [16.6, 700], [18.25, 700], [18.6, 540], [26.0, 540], [26.9, 470], [29.5, 465]]),
      y: key(t, [[0, 1010], [4.5, 1010], [4.95, 975, ease.outCubic], [13.9, 975], [14.25, 1010, ease.outCubic], [15.6, 1010], [16.6, 970], [18.25, 970], [18.6, 1000], [26.0, 1000], [26.9, 975], [29.5, 970]]),
      zoom: key(t, [[0, 1.2], [4.5, 1.2], [4.95, 1.6, ease.outCubic], [13.9, 1.64], [14.25, 1.2, ease.outCubic], [15.6, 1.2], [16.6, 1.7], [18.25, 1.72], [18.6, 1.25], [26.0, 1.25], [26.9, 1.55], [29.5, 1.62]]),
      shake: inRange(t, 13.95, 14.3) ? 10 : 0,
    };
    const clock = t < 10.9 ? '11:02' : t < 13.95 ? '1:13' : t < 26.1 ? '3:47' : '3:52';

    // ---- him ----
    const asleep = t >= 2.7 && t < WAKE;
    const ph = ((t - SNORE_T0) % SNORE_P + SNORE_P) % SNORE_P / SNORE_P;
    const breath = ph < 0.55 ? ease.inOut(ph / 0.55) : 1 - ease.inOut((ph - 0.55) / 0.45);
    const cuddle = ease.inOutCubic(seg(t, 23.2, 23.8));
    const him = bearState('him', { pose: 'head', x: lerp(HIM_X, 440, cuddle), y: HEAD_Y, s: 0.95, headTilt: lerp(-0.06, 0.12, cuddle) });
    him.eyeOpen = blink(t, 3);
    if (t >= 0.3 && t < 1.1) { him.mouth = 'yawn'; him.eyes = 'happy'; him.headTilt = -0.12; }
    if (asleep) {
      him.eyes = 'sleep';
      him.mouth = t > 13.95 ? 'o' : 'w';
      him.snot = (t > 3.2 ? 1 : 0) * breath * (t > 13.95 ? 1 : 0.6);
      him.headTilt = -0.06 + 0.03 * breath;
      him.blush = 0.5;
    }
    if (t >= WAKE) {
      him.lid = t < 23 ? 0.45 : 0.2;
      him.look = t < 23.2 ? 0.7 : 0.4;
      him.mouth = 'w';
    }
    if (t >= 26.1) {
      him.eyes = 'shock'; him.lid = 0; him.eyeScale = 0.95; him.pupil = [0.1, -0.9]; him.eyeOpen = 1;
      him.mouth = 'flat'; him.look = 0.15;
      him.sweat = seg(t, 27.2, 27.6);
    }
    him.talk = S.mouth('him', t);

    // ---- her ----
    const her = bearState('her', { pose: 'head', x: lerp(HER_X, 672, cuddle), y: HEAD_Y + 2, s: 0.9, headTilt: lerp(0.05, -0.12, cuddle) });
    her.eyeOpen = blink(t, 8, 2.6);
    if (t >= 4.7 && t < 8.5) { her.eyeScale = 1.12; her.pupil = [0.6, -0.7]; her.look = 0.15; }
    const cringe = inRange(t, 8.75, 10.85);
    if (cringe) { her.blush = 1; her.blushLines = 1; her.shiver = 0.6; her.mouth = 'wobbly'; }
    const phone = inRange(t, 11.2, 13.95);
    if (phone) { her.lookY = 0.75; her.pupil = [0, 0.8]; her.eyeScale = 1.1; her.mouth = 'flat'; }
    if (t >= 13.95 && t < 18.5) {
      her.bags = 1; her.lid = 0.3 + ((t * 1.3) % 1 < 0.09 ? 0.25 : 0); her.mouth = 'flat';
      if (t >= 15.6) {
        const k = ease.inOut(seg(t, 15.6, 16.1));
        her.look = -k; her.lid = lerp(her.lid, 0.42, k); her.lidTilt = k; her.brows = k > 0.3 ? 'angry' : null;
        her.anger = seg(t, 16.0, 16.3); her.mouth = 'teeth';
      }
    }
    if (t >= 18.5 && t < 20.9) { her.bags = 1; her.look = -0.8; her.lid = 0.3; her.mouth = 'flat'; }
    if (t >= 20.9 && t < 23.2) { her.eyes = 'teary'; her.mouth = 'frown'; her.tears = t < 22.4 ? 0.35 : 0; her.look = -0.6; her.bags = 0.6; }
    if (t >= 23.2 && t < 24.4) { her.eyes = 'sparkle'; her.mouth = 'w'; her.blush = 1; }
    if (t >= 24.4) { her.eyes = 'sleep'; her.mouth = 'w'; her.blush = 1; her.headTilt = -0.16 + 0.02 * Math.sin(t * 2); }
    her.talk = S.mouth('her', t);

    // ---- draw world ----
    ctx.save();
    applyCamera(ctx, cam, t);
    drawBedroomBack(ctx, t, { lamp: lampOff ? 0 : 1, clock });
    // night: the room gets darker than the bears so they stay readable
    nightTint(ctx, lampOff ? 0.42 * seg(t, 2.45, 2.6) : 0);
    glow(ctx, 205, 555, 330, '170,190,255', lampOff ? 0.5 : 0.15);
    drawBear(ctx, him, t);
    if (cuddle > 0.5) {
      // his arm under her head
      outlinedStroke(ctx, [[him.x + 60, 1090], [him.x + 150, 1040], [her.x + 150, 1000]], 50, PAL.fur, PAL.out, LW);
      drawPaw(ctx, her.x + 158, 996, 27);
      if (t > 26.1) {
        // pins and needles
        ctx.save();
        ctx.strokeStyle = '#FFD84A'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < 3; i++) {
          const a = -0.9 + i * 0.7 + 0.15 * Math.sin(t * 20 + i);
          const cx = her.x + 158 + Math.cos(a) * 48, cy = 996 + Math.sin(a) * 48;
          ctx.beginPath();
          ctx.moveTo(cx, cy); ctx.lineTo(cx + 10 * Math.cos(a) + 8, cy + 10 * Math.sin(a) - 8);
          ctx.lineTo(cx + 22 * Math.cos(a), cy + 22 * Math.sin(a)); ctx.stroke();
        }
        ctx.restore();
      }
    }
    drawBear(ctx, her, t);
    drawBlanket(ctx, t, { humps: [lerp(HIM_X, 430, cuddle), lerp(HER_X, 690, cuddle)], wiggle: inRange(t, 0.3, 1.2) });

    const sp = her.x;
    if (phone) {
      const lift = ease.outBack(seg(t, 11.2, 11.5));
      drawPhone(ctx, sp, lerp(1150, 1100, lift), 0.9, 0.05, '#2B2F3A');
      drawPaw(ctx, sp - 56, 1124, 26);
      drawPaw(ctx, sp + 56, 1124, 26);
      drawPaw(ctx, sp + 22, 1060 + 10 * Math.sin(t * 11), 16);
    } else if (inRange(t, 18.2, 19.3)) {
      const reach = Math.max(ease.outCubic(seg(t, 18.2, 18.5)) * (1 - seg(t, 19.0, 19.3)), 0);
      const jab = (inRange(t, 18.5, 18.68) || inRange(t, 18.85, 19.0)) ? 1 : 0.82;
      const px = lerp(sp - 60, HIM_X + 105, reach * jab), py = lerp(1110, 1000, reach * jab);
      outlinedStroke(ctx, [[sp - 40, 1125], [px, py]], 44, PAL.fur, PAL.out, LW);
      drawPaw(ctx, px, py, 26);
    }
    if (cringe) {
      const k = ease.outBack(seg(t, 8.75, 9.0));
      drawPaw(ctx, her.x - 46, lerp(1120, 945, k), 30, true, -0.2);
      drawPaw(ctx, her.x + 46, lerp(1120, 945, k), 30, true, 0.2);
    }

    // night + lights
    nightTint(ctx, lampOff ? 0.22 * seg(t, 2.45, 2.6) : 0);
    if (!lampOff) glow(ctx, 1035, 1010, 500, '255,214,140', 0.55);
    if (phone) glow(ctx, sp, 1000, 320, '150,205,255', 0.9 * seg(t, 11.2, 11.4));
    if (asleep) zzz(ctx, him.x + 110, him.y - 100, t, 1, { size: t > 13.95 ? 60 : 46 });
    if (t >= 24.6) zzz(ctx, her.x + 95, her.y - 95, t, seg(t, 24.6, 25.0), { size: 36, color: '#FFD6E7', speed: 0.45 });
    if (inRange(t, 23.6, 26.0)) floatingHearts(ctx, 560, 830, t, seg(t, 23.6, 23.9) * (1 - seg(t, 25.6, 26.0)), 140);
    ctx.restore();

    if (lampOff) vignette(ctx, 0.45, '5,8,30');

    // ---- overlays ----
    hookText(ctx, 'him vs me trying\nto fall asleep 😴');
    label(ctx, 'HIM:', 540, 520, t, 0.15, 4.5, { bg: ACCENT.him });
    label(ctx, 'ME:', 540, 520, t, 4.7, 6.0, { bg: ACCENT.her });
    const hs = worldToScreen(cam, [him.x, him.y - 190]);
    chip(ctx, '⏱️ 0.3 seconds', hs[0] + 40, hs[1] - 40, t, 3.05, 4.5);
    chip(ctx, '🕐 1:13 AM', 540, 1400, t, 10.9, 13.85, { size: 52 });
    chip(ctx, '🕓 3:47 AM', 540, 1400, t, 13.95, 15.5, { size: 60, bg: 'rgba(170,20,40,0.92)' });
    narration(ctx, '*just one more video*', 540, 560, t, 11.6, 13.85, { size: 52 });
    const hs2 = worldToScreen(cam, [her.x, her.y - 175]);
    chip(ctx, '⏱️ 0.2 seconds', hs2[0] + 20, hs2[1] - 50, t, 24.5, 26.0);
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
