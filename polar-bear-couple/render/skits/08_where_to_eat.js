// Skit 8 — "asking her where she wants to eat 🍣" (at the kitchen table, smooth version)
// Sushi? nah. Pizza? too heavy. ... 47 minutes later she knows exactly what she wants: sushi.
useCuteLook();
const E8 = ease.inOutCubic;
const HIM8 = TABLE3.him, HER8 = TABLE3.her, Y8 = TABLE3.feetY;
const OFFERS = [
  [3.1, 'sushi? 🍣', '🍣', 3.9, 'nah'],
  [4.7, 'pizza? 🍕', '🍕', 5.45, 'too heavy'],
  [6.3, 'burgers? 🍔', '🍔', 7.05, 'had that last week'],
  [8.2, 'tacos? 🌮', '🌮', 8.95, 'hmm… no'],
];
const MONTAGE = [['🍜', 10.1], ['🥗', 10.45], ['🥞', 10.8], ['🍝', 11.15], ['🥟', 11.5], ['🍛', 11.85], ['🌯', 12.2]];
const PHONE_ARMS = [0.45, 1.55, 0.55, 2.15];

const him8 = new Actor('him', { x: HIM8, y: Y8, s: 1.0, blush: 0.6 }, {
  y: [[0, Y8], [9.9, Y8], [13.3, Y8 + 55, E8], [13.6, Y8 + 30, E8], [22.8, Y8 + 30], [23.2, Y8 + 112, ease.inCubic]],
  squash: [[0, 1], [9.9, 1], [13.3, 0.95, E8], [13.6, 1, E8]],
  look: [[0, 0.1], [1.6, 0.1], [1.8, 0.5, E8], [13.4, 0.5], [13.7, 0.35, E8], [17.3, 0.35], [17.6, 0.05, E8], [18.8, 0.05], [19.0, 0.45, E8], [22.8, 0.45], [23.2, 0, E8]],
  lookY: [[0, 0.45], [1.6, 0.45], [1.8, 0, E8], [22.8, 0], [23.2, 0.2, E8]],
  headTilt: [[0, 0], [22.8, 0], [23.25, 0.18, ease.outBack]],
  eyes: [[0, 'dot'], [11.6, 'spiral'], [13.5, 'dot'], [23.15, 'x']],
  eyeScale: [[0, 1], [17.2, 1], [17.6, 0.7, E8], [18.8, 0.7], [19.0, 1, E8]],
  lid: [[0, 0], [13.4, 0], [13.6, 0.45, E8], [17.2, 0.45], [17.4, 0.12, E8], [23.0, 0.12], [23.1, 0]],
  mouth: [[0, 'smile'], [9.5, 'wobbly'], [13.5, 'flat'], [23.15, 'wobbly']],
  sweat: [[0, 0], [9.6, 0], [10.6, 1, E8], [13.4, 1], [13.8, 0.4, E8], [17.0, 0.4], [17.3, 0, E8]],
  arms4: [[0, PHONE_ARMS], [13.4, PHONE_ARMS], [13.9, ARMS.table, E8], [22.8, ARMS.table], [23.2, [0.95, 1.2, 0.95, 1.2], E8]],
  talkArm: [[0, 'L']],
  impulses: [[3.95, 'sigh', 0.4], [5.5, 'sigh', 0.5], [7.1, 'sigh', 0.6], [9.0, 'sigh', 0.8], [13.6, 'sigh', 1], [16.85, 'surprise', 0.6], [23.2, 'flinch', 1.4]],
});

const her8 = new Actor('her', { x: HER8, y: Y8, s: 0.95, blush: 1 }, {
  look: [[0, -0.35], [14.9, -0.35], [15.1, 0.1, E8], [16.7, 0.1], [16.9, -0.4, E8]],
  lookY: [[0, 0], [14.9, 0], [15.2, -0.5, E8], [16.7, -0.5], [16.9, 0, E8]],
  headTilt: [[0, -0.06], [14.9, -0.06], [15.2, 0.12, E8], [16.7, 0.12], [16.9, -0.1, E8], [20.6, -0.1], [20.9, -0.16, E8]],
  eyes: [[0, 'dot'], [3.85, 'happy'], [9.9, 'dot'], [16.8, 'sparkle'], [18.6, 'happy']],
  pupil: [[0, [0, 0]], [15.0, [0, 0]], [15.2, [0.5, -0.8], E8], [16.7, [0.5, -0.8]], [16.9, [0, 0], E8]],
  mouth: [[0, 'smile'], [3.85, 'w'], [15.0, 'pout'], [16.8, 'grin'], [18.6, 'smile']],
  smileEyes: [[0, 0.4], [3.7, 0.4], [3.85, 0], [20.6, 0], [20.9, 0.6, E8]],
  blushLines: [[0, 0], [16.8, 0], [17.1, 1, E8], [18.6, 1], [18.9, 0, E8]],
  arms4: [[0, ARMS.table], [1.75, ARMS.table], [2.1, ARMS.shrug, E8], [2.9, ARMS.shrug], [3.25, ARMS.table, E8],
    [8.85, ARMS.table], [9.2, ARMS.thinkR, E8], [9.8, ARMS.thinkR], [10.1, ARMS.table, E8],
    [14.9, ARMS.table], [15.25, ARMS.thinkR, E8], [16.65, ARMS.thinkR], [16.85, ARMS.cheer, ease.outBack], [18.3, ARMS.cheer], [18.7, ARMS.table, E8],
    [24.2, ARMS.table], [24.6, [1.55, 0.25, 0.45, 1.55], E8], [27.5, [1.55, 0.25, 0.45, 1.55]]],
  talkArm: [[0, 'none']],
  impulses: [[3.95, 'shake', 0.8], [5.5, 'shake', 0.7], [7.1, 'shake', 0.6], [9.0, 'shake', 0.5],
    ...MONTAGE.map(([, tt]) => [tt + 0.05, 'shake', 0.45]), [16.85, 'hop', 0.9], [24.7, 'nod', 0.5], [25.2, 'nod', 0.5], [25.7, 'nod', 0.5]],
});

function deliveryApp(c, t) {
  c.fillStyle = '#FFF0F5'; c.fillRect(-70, -140, 140, 280);
  c.fillStyle = '#FF8FBA'; c.fillRect(-70, -140, 140, 44);
  c.font = font(22, 700); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('food 🛵', 0, -118);
  const items = ['🍣', '🍕', '🍔', '🌮', '🍜', '🥗'];
  const scroll = (t * 40) % 90;
  for (let i = 0; i < 8; i++) {
    const y = -78 + i * 45 - scroll;
    if (y < -100 || y > 140) continue;
    rrect(c, -60, y - 18, 120, 38, 10); c.fillStyle = '#FFFFFF'; c.fill();
    c.font = '26px "Noto Color Emoji"'; c.fillText(items[i % items.length], -36, y + 2);
    rrect(c, -14, y - 6, 64, 10, 5); c.fillStyle = '#F2D7E2'; c.fill();
  }
}

makeSkit({
  name: '08_where_to_eat',
  duration: 27.5,
  fps: 60,
  mix: { sfx: 0.5, music: 0.85, rms: 0.11 },
  setup(S) {
    S.music(0, 13.45, 'bouncy', { gain: 0.48 });
    S.say('him', 0.35, 'where do you wanna eat? 🤔', { dur: 1.2, hold: 0.3 });
    S.say('her', 1.85, 'idk, you choose 🙂', { mood: 'sweet', dur: 0.9, hold: 0.3 });
    for (const [t0, q, , t1, a] of OFFERS) {
      S.say('him', t0, q, { dur: 0.6, hold: 0.2 });
      S.sfx(t0 + 0.05, 'softpop', { gain: 0.7 });
      S.say('her', t1, a, { dur: 0.6, hold: 0.25 });
    }
    for (const [, tt] of MONTAGE) S.sfx(tt, 'softpop', { gain: 0.55 });
    S.music(13.5, 16.75, 'dreamy', { gain: 0.5, fadeIn: 0.3 });
    S.say('him', 13.7, 'ok… what do YOU want?', { mood: 'sad', dur: 1.1, hold: 0.3 });
    S.think('her', 15.15, 'hmm… 🤔', { dur: 1.5, at: [770, 560] });
    S.say('her', 16.85, 'sushi! 🍣✨', { mood: 'excited', dur: 0.8, hold: 0.8 });
    S.sfx(16.85, 'chime', { notes: [84, 88, 91] });
    S.music(17.0, 27.5, 'lofi', { gain: 0.55, fadeIn: 0.4 });
    S.say('him', 19.0, '…I literally said sushi first', { dur: 1.4, hold: 0.4 });
    S.say('her', 20.85, 'yeah but you said it like you didn’t mean it 🙂', { mood: 'sweet', dur: 1.9, hold: 0.5 });
    S.sfx(23.2, 'thud', { gain: 0.22 });
    S.sfx(24.7, 'softpop', { gain: 0.35 });
    S.sfx(25.2, 'softpop', { gain: 0.35 });
    S.sfx(25.7, 'softpop', { gain: 0.35 });
  },

  draw(ctx, t, S) {
    const cam = {
      x: key(t, [[0, 540], [17.3, 540], [18.4, 400, E8], [20.5, 400], [21.1, 560, E8], [22.7, 560], [23.3, 520, E8]]),
      y: key(t, [[0, 1225], [17.3, 1225], [18.4, 1150, E8], [20.5, 1150], [21.1, 1215, E8]]),
      zoom: key(t, [[0, 1.18], [9.8, 1.2], [13.3, 1.26, E8], [17.3, 1.24], [18.4, 1.62, E8], [20.5, 1.65], [21.1, 1.26, E8], [22.7, 1.26], [23.3, 1.34, E8], [27.5, 1.4]]),
    };
    const him = him8.at(t, S), her = her8.at(t, S);

    ctx.save();
    applyCamera(ctx, cam, t);
    drawCozyKitchen(ctx, t, { evening: 1 });
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    drawCozyTable(ctx, t);
    drawPlateCute(ctx, 300, 1402, 0.85);
    drawPlateCute(ctx, 780, 1402, 0.85);
    drawCupCute(ctx, 150, 1408, 0.85, '#BFE3D3', t);
    drawCupCute(ctx, 930, 1408, 0.85, '#FFB8CC', t);
    // little vase with a flower in the middle
    rrect(ctx, 520, 1330, 40, 72, 16); fillStroke(ctx, '#C8E3F5', SOFT_OUT, 4);
    ctx.strokeStyle = '#7FB59E'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(540, 1332); ctx.quadraticCurveTo(536, 1290, 548, 1262); ctx.stroke();
    for (let i = 0; i < 5; i++) { ellipse(ctx, 548 + Math.cos(i * 1.256) * 13, 1252 + Math.sin(i * 1.256) * 13, 10, 10); fillStroke(ctx, '#FFB8CC', SOFT_OUT, 3); }
    ellipse(ctx, 548, 1252, 8, 8); ctx.fillStyle = '#FFE3A3'; ctx.fill();
    // phone: in his paw with the delivery app, then he puts it down on the table (eased)
    const put = E8(seg(t, 13.45, 13.85));
    const p = pawWorld(him, 1);
    const px = lerp(p[0] + 10, 440, put), py = lerp(p[1] - 70, 1392, put);
    if (put < 0.5) drawPhoneFront(ctx, px, py, 0.62, lerp(0.12, 0, put * 2), deliveryApp, t);
    else {
      ctx.save(); ctx.translate(px, py); ctx.scale(1, lerp(1, 0.32, (put - 0.5) * 2));
      rrect(ctx, -60, -110, 120, 220, 24); fillStroke(ctx, '#FFC6DA', SOFT_OUT, 6);
      ctx.restore();
    }
    if (inRange(t, 16.85, 18.6)) sparkles(ctx, her.x, her.y - 470, t, 1 - seg(t, 18.2, 18.6), 210, 7);
    ctx.restore();

    // food suggestions pop over the table
    const tableScr = worldToScreen(cam, [540, 1520]);
    for (const [t0, , e, t1] of OFFERS) foodChip(ctx, e, tableScr[0], tableScr[1], t, t0 + 0.05, t1 + 0.75, true);
    MONTAGE.forEach(([e, tt], i) => {
      const a = -Math.PI / 2 + (i - 3) * 0.55;
      foodChip(ctx, e, tableScr[0] + Math.cos(a) * 330, tableScr[1] + 170 + Math.sin(a) * 150, t, tt, 13.3, true);
    });
    foodChip(ctx, '🍣', tableScr[0], tableScr[1], t, 16.85, 18.9, false);
    chip(ctx, '⏱️ 47 minutes later…', 540, 560, t, 12.3, 13.5, { size: 46, bg: 'rgba(91,74,96,0.88)' });

    hookText(ctx, 'asking her where she\nwants to eat 🍣');
    bigText(ctx, 'every couple ever 🙃', 540, 600, t, 23.8, 27.5, { size: 78 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
