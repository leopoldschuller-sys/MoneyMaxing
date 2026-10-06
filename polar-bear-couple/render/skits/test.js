// Character sheet used to check the rig: both bears with a few expressions.
makeSkit({
  name: 'test',
  duration: 2,
  setup(S) {
    S.say('her', 0.2, 'are you even listening?!', { mood: 'angry' });
  },
  draw(ctx, t, S) {
    drawStudio(ctx);
    const him = bearState('him', { x: 320, y: 1250 });
    const her = bearState('her', { x: 770, y: 1250, look: -0.5, eyes: 'dot', arms: 'hips', brows: 'angry', lid: 0.35, lidTilt: 1, anger: 1 });
    her.talk = S.mouth('her', t); her.talkMood = 'angry';
    him.aR = 2.4; him.bR = 0.2; him.padR = true; him.mouth = 'smile'; him.look = 0.4;
    drawBear(ctx, him, t);
    drawBear(ctx, her, t);
    const row = ['dot', 'happy', 'sleep', 'shock', 'heart', 'sparkle', 'teary', 'spiral'];
    row.forEach((e, i) => {
      const b = bearState(i % 2 ? 'her' : 'him', { pose: 'head', x: 140 + (i % 4) * 265, y: 1480 + Math.floor(i / 4) * 280, s: 0.62, eyes: e });
      if (e === 'shock') b.mouth = 'bigO';
      if (e === 'teary') { b.mouth = 'frown'; b.tears = 0.8; }
      if (e === 'sleep') { b.snot = 0.7; b.mouth = 'o'; }
      if (e === 'happy') b.mouth = 'grin';
      if (e === 'sparkle') b.mouth = 'pout';
      drawBear(ctx, b, t);
    });
    hookText(ctx, 'him vs me trying to fall asleep 😴');
    drawLines(ctx, S, t, { him, her });
  },
});
