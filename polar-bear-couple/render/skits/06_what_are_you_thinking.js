// Skit 6 — "when she asks what he's thinking about 💭" (pillow talk in bed, smooth version)
// She dreams about their future; in his head a salmon swims in circles. "I was thinking about
// you ❤️" saves him ... and in his head the salmon now wears her bow.
useCuteLook();
const E = ease.inOutCubic;

const him6 = new Actor('him', { x: BED3.him, y: BED3.feetY, s: 1.0, blush: 0.6 }, {
  x: [[0, BED3.him], [17.5, BED3.him], [18.3, 448, E]],
  lean: [[0, 0], [17.5, 0], [18.3, 0.07, E]],
  look: [[0, 0.12], [7.0, 0.12], [7.35, 0.55, E], [9.8, 0.55], [10.1, 0.0, E], [14.5, 0], [14.85, 0.5, E], [16.4, 0.5], [16.6, -0.35, E], [17.4, -0.35], [17.75, 0.55, E]],
  lookY: [[0, 0], [9.9, 0], [10.3, -0.25, E], [14.2, -0.25], [14.6, 0, E]],
  pupil: [[0, [0, 0]], [16.45, [0, 0]], [16.65, [-0.8, 0.1], E], [17.45, [-0.8, 0.1]], [17.7, [0, 0], E]],
  eyes: [[0, 'dot'], [20.55, 'happy']],
  mouth: [[0, 'smile'], [7.0, 'w'], [9.95, 'o'], [14.45, 'w'], [16.4, 'wobbly'], [17.6, 'smile']],
  smileEyes: [[0, 0.5], [7.0, 0.5], [7.3, 0, E], [17.8, 0], [18.25, 0.8, E]],
  sweat: [[0, 0], [16.45, 0], [16.8, 1, E], [17.6, 1], [18.0, 0, E]],
  blush: [[0, 0.6], [18.0, 0.6], [18.4, 1, E]],
  blushLines: [[0, 0], [18.2, 0], [18.6, 0.8, E]],
  arms4: [[0, ARMS.lap], [17.5, ARMS.lap], [18.25, [0.2, 1.35, 1.45, 1.15], E]],
  talkArm: [[0, 'L'], [17.6, 'none']],
  impulses: [[16.55, 'flinch'], [19.55, 'nod', 0.7]],
});

const her6 = new Actor('her', { x: BED3.her, y: BED3.feetY, s: 0.95, blush: 1 }, {
  x: [[0, BED3.her], [8.4, BED3.her], [8.75, 682, E], [14.3, 682], [14.65, BED3.her, E], [20.3, BED3.her], [21.1, 590, E]],
  lean: [[0, 0], [8.4, 0], [8.75, -0.05, E], [14.3, -0.05], [14.65, 0, E], [20.3, 0], [21.1, -0.1, E]],
  headTilt: [[0, -0.05], [4.2, -0.05], [4.65, 0.14, E], [6.9, 0.14], [7.25, 0, E], [8.5, 0], [8.85, 0.12, E], [9.8, 0.12], [10.1, 0, E], [20.3, 0], [21.1, -0.3, E]],
  look: [[0, -0.25], [2.3, -0.25], [2.55, -0.55, E], [4.2, -0.55], [4.55, 0.2, E], [7.0, 0.2], [7.25, -0.55, E], [19.4, -0.55], [19.7, -0.2, E]],
  lookY: [[0, 0], [4.2, 0], [4.6, -0.5, E], [6.9, -0.5], [7.25, 0, E]],
  eyes: [[0, 'dot'], [4.3, 'sparkle'], [7.05, 'dot'], [8.5, 'sparkle'], [9.85, 'dot'], [19.5, 'heart'], [20.6, 'happy']],
  lid: [[0, 0], [14.5, 0], [14.95, 0.42, E], [19.3, 0.42], [19.5, 0, E]],
  brows: [[0, null], [14.6, 'flat'], [19.45, null]],
  mouth: [[0, 'smile'], [2.3, 'w'], [4.25, 'smile'], [8.45, 'pout'], [9.85, 'w'], [14.5, 'flat'], [19.5, 'smile']],
  smileEyes: [[0, 0.5], [2.3, 0.5], [2.45, 0, E], [4.2, 0], [4.55, 0.6, E], [6.95, 0.6], [7.2, 0, E]],
  blushLines: [[0, 0], [4.3, 0], [4.65, 1, E], [7.0, 1], [7.25, 0, E], [19.45, 0], [19.75, 1, E]],
  arms4: [[0, ARMS.lap], [14.45, ARMS.lap], [14.9, ARMS.crossed, E], [19.35, ARMS.crossed], [19.8, ARMS.cheeks, ease.outBack], [20.35, ARMS.cheeks], [20.9, ARMS.lap, E]],
  talkArm: [[0, 'L'], [14.4, 'none']],
  impulses: [[2.4, 'lean', -0.6], [8.6, 'wiggle', 0.8], [19.5, 'surprise', 0.5], [19.75, 'hop', 0.6]],
});

const IN_HEAD = [[9.95, 14.45], [21.3, 26.6]];

makeSkit({
  name: '06_what_are_you_thinking',
  duration: 27.0,
  fps: 60,
  mix: { sfx: 0.5, music: 0.85, rms: 0.11 },
  setup(S) {
    S.music(0, 9.9, 'dreamy', { gain: 0.55 });
    S.say('her', 2.45, 'what are you thinking about? 🥰', { mood: 'sweet', dur: 1.5, hold: 0.5 });
    S.think('her', 4.35, "our future… our wedding… what we'd name our cubs 🥹💍", { dur: 2.75, at: [560, 560] });
    S.sfx(4.35, 'softpop', { gain: 0.6 });
    S.say('him', 7.35, 'hm? nothing', { dur: 0.8, hold: 0.5 });
    S.say('her', 8.55, 'come on, tell me 🥺', { mood: 'sweet', dur: 1.0, hold: 0.4 });
    S.sfx(9.95, 'whoosh', { dur: 0.5, gain: 0.3 });
    S.music(9.95, 14.45, 'bouncy', { gain: 0.42, fadeIn: 0.4 });
    S.say('her', 14.75, '…are you thinking about salmon again? 😑', { dur: 1.6, hold: 0.3 });
    S.music(14.5, 27.0, 'dreamy', { gain: 0.55, fadeIn: 0.5 });
    S.say('him', 16.6, '…no 😅', { dur: 0.6, hold: 0.5 });
    S.say('him', 18.05, 'I was thinking about you ❤️', { mood: 'sweet', dur: 1.3, hold: 0.6 });
    S.sfx(19.5, 'chime', { notes: [76, 79, 84, 88] });
    S.sfx(21.3, 'whoosh', { dur: 0.5, gain: 0.3 });
    S.sfx(21.7, 'softpop', { gain: 0.6 });
  },

  draw(ctx, t, S) {
    const cam = {
      x: key(t, [[0, 540], [2.3, 540], [4.0, 575, E], [14.4, 575], [15.2, 650, E], [16.2, 650], [17.0, 470, E], [17.5, 470], [18.4, 545, E]]),
      y: key(t, [[0, 1135], [2.3, 1135], [4.0, 1120, E], [14.4, 1120], [15.2, 1060, E], [16.2, 1060], [17.0, 1080, E], [17.5, 1080], [18.4, 1110, E]]),
      zoom: key(t, [[0, 1.14], [2.3, 1.16], [4.0, 1.22, E], [14.4, 1.24], [15.2, 1.48, E], [16.2, 1.5], [17.0, 1.46, E], [17.5, 1.46], [18.4, 1.26, E], [27, 1.36, E]]),
    };
    const him = him6.at(t, S), her = her6.at(t, S);

    ctx.save();
    applyCamera(ctx, cam, t);
    drawCozyBedroom(ctx, t, { lamp: 1, clock: '11:47' });
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    drawCozyBlanket(ctx, t, { him: him.x, her: her.x });
    bedroomLight(ctx, t);
    if (t >= 19.5) floatingHearts(ctx, (him.x + her.x) / 2, 860, t, seg(t, 19.5, 19.9), 170);
    ctx.restore();

    // inside his head: dim the room, show the big thought cloud
    let dim = 0;
    for (const [a, b] of IN_HEAD) dim = Math.max(dim, smooth01((t - a) / 0.35) * smooth01((b - t) / 0.35));
    if (dim > 0) { ctx.fillStyle = `rgba(45,25,70,${0.42 * dim})`; ctx.fillRect(0, 0, W, H); }
    const headPt = worldToScreen(cam, [him.x + 70, him.y - 560]);
    const swim = (c, tt, bow) => {
      const sx = Math.sin(tt * 0.95) * 165;
      const turn = -Math.tanh(Math.cos(tt * 0.95) * 3);
      c.save();
      c.translate(sx, 25 + Math.sin(tt * 2.6) * 14);
      c.rotate(Math.cos(tt * 2.6) * 0.06);
      c.scale(turn, 1);
      drawSalmon(c, 0, 0, 1.6, 0, bow, tt);
      c.restore();
    };
    bigThought(ctx, 560, 900, 820, 640, t, IN_HEAD[0][0], IN_HEAD[0][1], headPt, (c, tt) => {
      swim(c, tt, false);
      c.font = '52px "Noto Color Emoji"'; c.textAlign = 'center';
      c.fillText('🎵', 255, -150 + Math.sin(tt * 4) * 10);
      c.globalAlpha = 0.8;
      c.fillText('🫧', -240, -100 - ((tt * 40) % 60));
    });
    bigThought(ctx, 560, 900, 820, 640, t, IN_HEAD[1][0], IN_HEAD[1][1], headPt, (c, tt) => {
      swim(c, tt, true);
      floatingHearts(c, 0, 150, tt, 1, 260);
    });

    hookText(ctx, "when she asks what\nhe's thinking about 💭");
    narration(ctx, '*meanwhile in his head*', 540, 520, t, 10.0, 14.35, { size: 50 });
    narration(ctx, 'technically not a lie 🐟🎀', 540, 520, t, 21.7, 26.9, { size: 54 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
