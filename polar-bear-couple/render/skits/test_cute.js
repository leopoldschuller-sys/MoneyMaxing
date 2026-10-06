// Character sheet for the cute look: sets + expressions.
useCuteLook();
makeSkit({
  name: 'test_cute',
  duration: 2,
  setup(S) { S.say('her', 0.2, 'what are you thinking about? 🥰', { mood: 'sweet' }); },
  draw(ctx, t, S) {
    const scene = Math.floor(t);
    if (scene === 0) drawAuroraNight(ctx, t, {}); else drawCozyRoom(ctx, t);
    const him = bearState('him', { x: 340, y: 1560, s: 1, pose: 'sit', look: 0.4 });
    const her = bearState('her', { x: 740, y: 1560, s: 0.94, pose: 'sit', look: -0.4 });
    her.talk = S.mouth('her', t);
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    if (scene === 1) drawCozyCouchFront(ctx, t); else auroraForeground(ctx, t);
    hookText(ctx, 'when she asks what\nhe\'s thinking about 💭');
    drawLines(ctx, S, t, { him, her });
    label(ctx, 'HIM:', 540, 540, t, 0, 2, { bg: ACCENT.him });
  },
});
