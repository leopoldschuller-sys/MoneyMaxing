// Skit 6 — "when she asks what he's thinking about 💭"
// Under the northern lights she dreams about their future; in his head a salmon swims in circles.
// He saves it with "I was thinking about you" ... and in his head the salmon now wears her bow.
useCuteLook();
const HIM6 = 350, HER6 = 730, SIT6 = 1565;

makeSkit({
  name: '06_what_are_you_thinking',
  duration: 26.5,
  mix: { sfx: 0.55, music: 0.85, rms: 0.11 },
  setup(S) {
    S.music(0, 9.85, 'dreamy', { gain: 0.55 });
    S.say('her', 2.4, 'what are you thinking about? 🥰', { mood: 'sweet', dur: 1.5, hold: 0.5 });
    S.think('her', 4.3, "our future… our wedding… what we'd name our cubs 🥹💍", { dur: 2.8, at: [600, 640] });
    S.sfx(4.3, 'softpop');
    S.say('him', 7.3, 'hm? nothing', { dur: 0.8, hold: 0.5 });
    S.say('her', 8.5, 'come on, tell me 🥺', { mood: 'sweet', dur: 1.0, hold: 0.4 });
    S.sfx(9.9, 'whoosh', { dur: 0.4, gain: 0.35 });
    S.music(9.95, 14.45, 'bouncy', { gain: 0.45 });
    S.say('her', 14.6, '…are you thinking about salmon again? 😑', { dur: 1.6, hold: 0.4 });
    S.music(14.5, 26.5, 'dreamy', { gain: 0.55 });
    S.say('him', 16.6, '…no 😅', { dur: 0.6, hold: 0.5 });
    S.say('him', 18.0, 'I was thinking about you ❤️', { mood: 'sweet', dur: 1.3, hold: 0.7 });
    S.sfx(19.4, 'chime', { notes: [76, 79, 84, 88] });
    S.sfx(21.2, 'whoosh', { dur: 0.4, gain: 0.35 });
    S.sfx(21.6, 'softpop');
  },

  draw(ctx, t, S) {
    const close = ease.inOutCubic(seg(t, 17.7, 18.3));
    const pink = ease.inOut(seg(t, 19.4, 20.6));
    const cam = {
      x: key(t, [[0, 540], [14.4, 540], [17.6, 540], [18.3, 545]]),
      y: key(t, [[0, 1250], [2.2, 1240], [26.5, 1230]]),
      zoom: key(t, [[0, 1.3], [2.2, 1.36], [9.8, 1.42], [14.5, 1.38], [18.2, 1.44], [26.5, 1.52]]),
    };
    const sway = Math.sin(t * 1.6) * 0.03;

    const him = bearState('him', { x: lerp(HIM6, 445, close), y: SIT6, s: 1.0, pose: 'sit', arms: 'hold', headTilt: sway });
    const her = bearState('her', { x: lerp(HER6, 650, close), y: SIT6, s: 0.94, pose: 'sit', arms: 'hold', headTilt: -sway });
    him.eyeOpen = blink(t, 6); her.eyeOpen = blink(t, 11, 2.7);
    if (t < 2.4) {
      him.lookY = -0.7; her.lookY = -0.7; him.pupil = [0.2, -0.9]; her.pupil = [-0.2, -0.9];
      him.mouth = 'smile'; her.mouth = 'smile';
    }
    if (inRange(t, 2.4, 9.8)) { her.look = -0.5; her.eyes = t > 4.3 && t < 7.2 ? 'sparkle' : 'dot'; her.blush = 1; her.mouth = 'smile'; }
    if (inRange(t, 4.3, 7.2)) { her.lookY = -0.5; her.headTilt = 0.12; her.blushLines = 1; }
    if (inRange(t, 7.2, 9.8)) { him.look = 0.5; him.mouth = 'w'; }
    if (inRange(t, 8.5, 9.8)) { her.eyes = 'sparkle'; her.mouth = 'pout'; her.headTilt = 0.15; }
    if (inRange(t, 9.8, 14.5)) { him.eyes = 'dot'; him.eyeScale = 0.8; him.mouth = 'o'; him.lookY = -0.3; him.look = 0; }
    if (inRange(t, 14.5, 17.7)) {
      her.look = -0.6; her.lid = 0.42; her.brows = 'flat'; her.mouth = 'flat';
      him.look = 0.4; if (t > 16.4) { him.sweat = 1; him.mouth = 'wobbly'; him.eyes = 'dot'; him.pupil = [-0.6, 0]; }
    }
    if (t >= 17.7) { him.look = 0.5; him.mouth = 'smile'; him.blush = 1; him.headTilt = 0.1; her.look = -0.5; }
    if (t >= 19.4) { her.eyes = 'heart'; her.blush = 1; her.blushLines = 1; her.mouth = 'smile'; her.headTilt = -0.16; him.eyes = 'happy'; }
    him.talk = S.mouth('him', t); her.talk = S.mouth('her', t);

    ctx.save();
    applyCamera(ctx, cam, t);
    drawAuroraNight(ctx, t, { pink });
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    if (t >= 19.4) floatingHearts(ctx, 560, 900, t, seg(t, 19.4, 19.8), 170);
    auroraForeground(ctx, t);
    ctx.restore();

    // dim the world while we are inside his head
    const inHead = Math.max(Math.sin(Math.PI * seg(t, 9.85, 14.45)) > 0 ? clamp(seg(t, 9.85, 10.2) * (1 - seg(t, 14.15, 14.45))) : 0,
      clamp(seg(t, 21.2, 21.55) * (1 - seg(t, 26.2, 26.5))));
    if (inHead > 0) { ctx.fillStyle = `rgba(40,20,70,${0.45 * inHead})`; ctx.fillRect(0, 0, W, H); }
    const headPt = worldToScreen(cam, [him.x + 60, him.y - 560]);
    bigThought(ctx, 560, 880, 820, 640, t, 9.95, 14.45, headPt, (c, tt) => {
      const sx = Math.sin(tt * 0.9) * 170;
      const dir = Math.cos(tt * 0.9) >= 0 ? 1 : -1;
      c.save(); c.translate(sx, 20 + Math.sin(tt * 3) * 14); c.scale(-dir, 1);
      drawSalmon(c, 0, 0, 1.6, 0, false, tt);
      c.restore();
      c.font = '52px "Noto Color Emoji"'; c.textAlign = 'center';
      c.fillText('🎵', 260, -150 + Math.sin(tt * 4) * 10);
      c.fillText('🫧', -250, -110 - ((tt * 40) % 60));
    });
    bigThought(ctx, 560, 880, 820, 640, t, 21.3, 26.5, headPt, (c, tt) => {
      const sx = Math.sin(tt * 0.9) * 150;
      const dir = Math.cos(tt * 0.9) >= 0 ? 1 : -1;
      c.save(); c.translate(sx, 30 + Math.sin(tt * 3) * 14); c.scale(-dir, 1);
      drawSalmon(c, 0, 0, 1.6, 0, true, tt);
      c.restore();
      floatingHearts(c, 0, 140, tt, 1, 260);
    });

    hookText(ctx, "when she asks what\nhe's thinking about 💭");
    narration(ctx, '*meanwhile in his head*', 540, 520, t, 9.95, 14.4, { size: 50 });
    narration(ctx, 'technically not a lie 🐟🎀', 540, 520, t, 21.6, 26.5, { size: 54 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
