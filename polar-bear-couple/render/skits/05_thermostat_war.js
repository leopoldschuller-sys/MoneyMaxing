// Skit 5 — "him vs her: the thermostat"
// She's freezing (as a polar bear), cranks the heat. He walks in melting, cranks the cold —
// it snows indoors. Thermostat war until the dial breaks. Her solution: he is the heater now.
// He melts. Worth it.
const COUCH_X = 300, SEAT5 = 1480;
const WAR0 = 12.1, WAR1 = 15.6;

// switch times during the war, getting faster
const SWITCHES = (() => {
  const out = [];
  let tt = WAR0 + 0.2, gap = 0.5;
  while (tt < WAR1 - 0.05) { out.push(tt); tt += gap; gap = Math.max(0.09, gap * 0.8); }
  return out;
})();

function dialAt(t) {
  if (t < 3.1) return 0.45;
  if (t < 8.5) return lerp(0.45, 1, ease.outBack(seg(t, 3.1, 3.5)));
  if (t < WAR0) return lerp(1, 0, ease.outBack(seg(t, 8.5, 8.9)));
  let v = 0, idx = -1;
  SWITCHES.forEach((s, i) => { if (t >= s) idx = i; });
  if (idx < 0) return 0;
  const from = idx % 2 ? 0 : 1 - 1, to = idx % 2 ? 0 : 1;
  v = lerp(idx % 2 ? 1 : 0, to, ease.outCubic(seg(t, SWITCHES[idx], SWITCHES[idx] + 0.08)));
  void from;
  return v;
}

makeSkit({
  name: '05_thermostat_war',
  duration: 27.0,
  setup(S) {
    S.sfx(0.1, 'chatter', { dur: 1.7 });
    S.music(0.0, 8.45, 'silly', { gain: 0.5 });
    S.music(8.5, 12.05, 'night', { gain: 0.5 });
    S.say('her', 0.35, "babe… I'm freezing 🥶", { mood: 'sad', dur: 1.3, hold: 0.4 });
    for (const tt of [2.0, 2.35, 2.7]) S.sfx(tt, 'boing', { gain: 0.6 });
    S.sfx(3.1, 'dial');
    S.sfx(3.3, 'fire', { dur: 2.0, gain: 0.7 });
    S.say('her', 3.8, 'ahh 😌', { mood: 'sweet', dur: 0.6, hold: 0.4 });
    for (const tt of [4.45, 4.8, 5.15]) S.sfx(tt, 'boing', { gain: 0.5 });
    S.say('him', 6.6, 'why is it 1000 degrees in here?! 🥵', { dur: 1.6, hold: 0.3 });
    S.sfx(8.5, 'dial');
    S.sfx(8.6, 'wind', { dur: 3.4, gain: 0.9 });
    S.say('him', 9.15, 'ahh… perfect ❄️', { mood: 'sweet', dur: 0.95, hold: 0.4 });
    S.sfx(10.3, 'chatter', { dur: 1.7 });
    S.music(WAR0, WAR1, 'chaos', { gain: 0.5 });
    for (const tt of SWITCHES) S.sfx(tt, 'dial', { gain: 0.8 });
    S.sfx(WAR1, 'crash');
    S.sfx(WAR1 + 0.05, 'boing');
    S.sfx(WAR1 + 0.6, 'crickets', { dur: 2.2, gain: 0.6 });
    S.sfx(18.0, 'ding');
    S.say('her', 18.15, 'wait… I have an idea 😏', { mood: 'sweet', dur: 1.2, hold: 0.3 });
    S.sfx(19.55, 'whoosh', { dur: 0.3 });
    S.sfx(19.75, 'hearts');
    S.music(18.0, 19.55, 'sneaky', { gain: 0.5 });
    S.music(19.6, 27.0, 'romantic', { gain: 0.55 });
    S.say('her', 19.9, "you're my heater now 🥰", { mood: 'sweet', dur: 1.3, hold: 0.6 });
    for (let tt = 22.1; tt < 24.6; tt += 0.42) S.sfx(tt, 'drip', { gain: 0.7 });
    S.say('him', 23.2, 'worth it 🫠', { mood: 'sleepy', dur: 0.8, hold: 0.8 });
  },

  draw(ctx, t, S) {
    const dial = dialAt(t);
    const war = inRange(t, WAR0, WAR1);
    const broken = t >= WAR1;
    const warmth = broken ? 0 : t < 3.3 ? 0 : t < 8.5 ? seg(t, 3.3, 4.0) : war ? (dial > 0.5 ? 1 : -1) : -seg(t, 8.5, 9.1);
    const cam = {
      x: key(t, [[0, 500], [1.9, 500], [2.6, 610], [4.6, 610], [5.4, 500], [8.0, 560], [WAR0 - 0.2, 560], [WAR0, 660, ease.outCubic], [WAR1 + 2.3, 660], [WAR1 + 2.6, 560], [27, 560]]),
      y: key(t, [[0, 1190], [WAR0 - 0.2, 1190], [WAR0, 1150, ease.outCubic], [WAR1 + 2.3, 1150], [WAR1 + 2.6, 1200], [27, 1200]]),
      zoom: key(t, [[0, 1.32], [WAR0 - 0.2, 1.32], [WAR0, 1.5, ease.outCubic], [WAR1, 1.6], [WAR1 + 2.3, 1.55], [WAR1 + 2.6, 1.42], [24.5, 1.45], [27, 1.55]]),
      shake: war ? 2 + 12 * seg(t, WAR0, WAR1) : inRange(t, WAR1, WAR1 + 0.4) ? 16 : 0,
    };

    // ---- her (burrito) ----
    const her = bearState('her', { x: COUCH_X - 50, y: SEAT5, s: 0.9, hideBody: true });
    her.eyeOpen = blink(t, 17, 3.0);
    her.shiver = t < 1.9 ? 1.2 : 0; her.frost = t < 3.3 ? 0.35 : 0;
    her.eyes = 'teary'; her.mouth = 'wobbly'; her.blush = 0.4;
    // hop to the thermostat and back
    const hopTo = seg(t, 1.9, 2.95), hopBack = seg(t, 4.4, 5.4);
    if (t >= 1.9 && t < 5.4) {
      her.x = t < 4.4 ? lerp(COUCH_X - 50, THERMO.x + 110, hopTo) : lerp(THERMO.x + 110, COUCH_X - 50, hopBack);
      her.y = t < 4.4 ? lerp(SEAT5, 1640, Math.min(1, hopTo * 3)) : lerp(1640, SEAT5, Math.max(0, hopBack * 3 - 2));
      const hk = t < 4.4 ? hopTo : hopBack;
      her.hop = (t < 2.95 || t >= 4.4) ? Math.abs(Math.sin(hk * Math.PI * 3)) * 70 : 0;
    }
    if (inRange(t, 3.1, 8.5)) { her.eyes = 'happy'; her.mouth = 'smile'; her.blush = 1; her.shiver = 0; }
    if (inRange(t, 8.6, WAR0)) {
      her.eyes = 'dot'; her.mouth = 'teeth'; her.frost = seg(t, 8.8, 10.0); her.shiver = 1.6; her.bags = 0.3;
      her.look = 0.6;
    }
    if (war || broken) { her.x = THERMO.x + 120; her.y = 1640; }
    if (war) {
      her.eyes = 'dot'; her.lid = 0.4; her.lidTilt = 1; her.brows = 'angry'; her.anger = 1; her.mouth = 'teeth'; her.look = -0.7;
      her.frost = dial < 0.5 ? 0.7 : 0;
    }
    if (broken) { her.eyes = 'shock'; her.mouth = 'o'; her.look = -0.3; her.pupil = [-0.15, 0.1]; her.frost = 0.3; }
    if (t >= 17.4 && t < 19.5) { her.look = -0.7; her.pupil = [-0.8, 0]; }
    if (t >= 18.0 && t < 19.5) { her.eyes = 'dot'; her.lid = 0.35; her.lidTilt = -0.3; her.mouth = 'smirk'; her.brows = 'raised'; }
    const cuddle = ease.inOutCubic(seg(t, 19.5, 19.9));
    if (t >= 19.5) {
      her.x = lerp(THERMO.x + 120, 650, cuddle); her.y = lerp(1640, 1660, cuddle);
      her.eyes = 'happy'; her.mouth = 'smile'; her.blush = 1; her.frost = 0; her.headTilt = -0.18;
    }
    her.talk = S.mouth('her', t);

    // ---- him ----
    const him = bearState('him', { x: -300, y: 1650, s: 1.0 });
    him.eyeOpen = blink(t, 2);
    if (t >= 5.4) {
      const walkK = seg(t, 5.4, 6.6);
      him.x = lerp(-280, THERMO.x - 190, walkK); him.walk = t * 11; him.walkAmt = walkK < 1 ? 1 : 0;
      him.mouth = 'tongue'; him.sweat = 1; him.eyes = 'dot'; him.lid = 0.45; him.melt = 0.12; him.look = 0.4;
      him.redFace = 0.35;
    }
    if (inRange(t, 8.4, 8.9)) { him.reachR = [THERMO.x - 30, THERMO.y + 40]; }
    if (inRange(t, 8.9, WAR0)) { him.mouth = 'smile'; him.eyes = 'happy'; him.sweat = 0; him.melt = 0; him.redFace = 0; him.blush = 0.6; }
    if (war) {
      him.x = THERMO.x - 190; him.eyes = 'dot'; him.lid = 0.4; him.lidTilt = 1; him.brows = 'angry'; him.anger = 1; him.mouth = 'teeth';
      him.look = 0.7; him.sweat = dial > 0.5 ? 1 : 0; him.melt = 0; him.redFace = dial > 0.5 ? 0.4 : 0;
    }
    if (broken) { him.x = THERMO.x - 190; him.eyes = 'shock'; him.lid = 0; him.brows = null; him.anger = 0; him.mouth = 'o'; him.pupil = [0.15, 0.1]; him.look = 0.3; him.sweat = 0; him.redFace = 0; }
    if (t >= 17.4) { him.look = 0.7; him.pupil = [0.8, 0]; }
    if (t >= 19.5) {
      him.x = lerp(THERMO.x - 190, 470, cuddle);
      him.lid = 0; him.eyes = t < 21.6 ? 'heart' : 'happy'; him.mouth = 'smile'; him.blush = 1; him.blushLines = 1; him.look = 0.4; him.pupil = [0, 0];
      him.sweat = seg(t, 21.0, 21.4);
      him.melt = ease.inOutCubic(seg(t, 21.8, 24.4));
      him.redFace = 0.3 * seg(t, 21.0, 22.0);
    }
    him.talk = S.mouth('him', t);

    // who is turning the dial right now (during the war)
    let turner = null;
    if (war) {
      let idx = -1; SWITCHES.forEach((s, i) => { if (t >= s - 0.12) idx = i; });
      turner = idx < 0 ? null : idx % 2 ? 'him' : 'her';
    }
    if (turner === 'him') him.reachR = [THERMO.x - 40, THERMO.y + 30];
    if (inRange(t, 3.0, 3.6)) her.reachR = null;

    // ---- world ----
    ctx.save();
    applyCamera(ctx, cam, t);
    drawLivingRoom(ctx, t, { dial, broken: broken ? 1 : 0, warm: warmth });
    drawCouch(ctx, COUCH_X, 1500, 660);
    const herOnCouch = !(t >= 1.9 && t < 5.4) && !war && !broken && t < 19.5;
    if (herOnCouch) { drawBear(ctx, her, t); drawBurritoWrap(ctx, her, t); }
    drawCouchFront(ctx, COUCH_X, 1500, 660);
    if (!herOnCouch) { drawBear(ctx, her, t); drawBurritoWrap(ctx, her, t); }
    // her paw poking out of the burrito to turn the dial
    if (inRange(t, 3.0, 3.6) || turner === 'her') {
      const px = THERMO.x + 40, py = THERMO.y + 30;
      outlinedStroke(ctx, [[her.x - 60, her.y - 300], [px, py]], 44, '#FF9EC4', PAL.out, LW);
      drawPaw(ctx, px, py, 26, true);
    }
    drawBear(ctx, him, t);
    if (inRange(t, 5.4, 8.5) || (war && dial > 0.5)) heatWaves(ctx, t, 1, 120, 980);
    if (t >= 8.6 && (t < WAR0 || (war && dial < 0.5))) indoorSnow(ctx, t, t < WAR0 ? seg(t, 8.6, 9.2) : 1);
    if (broken && t < WAR1 + 1.2) {
      // pieces of the thermostat flying off (upwards and out of frame)
      const k = t - WAR1;
      const r = mulberry32(3);
      ctx.save();
      ctx.globalAlpha = 1 - seg(k, 0.4, 0.7);
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI * (0.15 + 0.7 * r()), sp = 700 + r() * 500;
        rrect(ctx, THERMO.x + Math.cos(a) * sp * k - 12, THERMO.y + Math.sin(a) * sp * k + 600 * k * k - 8, 24, 16, 4);
        fillStroke(ctx, i % 2 ? '#C9D2DE' : '#F7F8FA', PAL.out, 3);
      }
      ctx.restore();
      // spring
      ctx.save();
      ctx.translate(THERMO.x + 60, THERMO.y - 40 - 300 * Math.min(k, 0.4));
      ctx.strokeStyle = PAL.out; ctx.lineWidth = 5;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) ctx.lineTo(Math.sin(i * 1.2) * 18, -i * 3);
      ctx.stroke();
      ctx.restore();
    }
    if (inRange(t, 19.7, 27)) floatingHearts(ctx, 560, 1000, t, seg(t, 19.7, 20.1), 180);
    ctx.restore();

    if (war) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = dial > 0.5 ? '#FF6A00' : '#2E8BFF';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      speedLines(ctx, W / 2, 800, t, 0.35 + 0.4 * seg(t, WAR0, WAR1));
    }
    flash(ctx, broken ? 0.9 * (1 - seg(t, WAR1, WAR1 + 0.35)) : 0);

    // ---- overlays ----
    hookText(ctx, 'him vs her: the thermostat 🥶🔥');
    narration(ctx, '*cranks the heat*', 540, 560, t, 3.15, 4.4);
    narration(ctx, 'polar bear. still cold. 🥶', 540, 560, t, 10.3, 12.0, { color: '#9FE7FF' });
    if (war) {
      const idx = SWITCHES.filter((s) => t >= s).length;
      chip(ctx, idx % 2 ? '🔥 HER' : '❄️ HIM', 540, 1380, t, WAR0, WAR1, { size: 56, bg: idx % 2 ? 'rgba(220,70,20,0.9)' : 'rgba(30,110,230,0.9)' });
    }
    emojiPop(ctx, '💡', worldToScreen(cam, bearTop(her))[0] + 40, worldToScreen(cam, bearTop(her))[1] - 30, t, 18.0, 19.2, 110);
    bigText(ctx, "he'd literally\nmelt for her 🫠❤️", 540, 640, t, 24.6, 27.0, { size: 84 });
    drawLines(ctx, S, t, { him, her }, cam);
  },
});
