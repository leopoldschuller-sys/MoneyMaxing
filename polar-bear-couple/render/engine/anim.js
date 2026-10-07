// Smooth character animation for the newer skits.
// An Actor is described by keyframed tracks (eased, never snapping) plus procedural "life":
// breathing, idle sway, natural blinks, little eye saccades, talking motion, eased expression
// changes (eyes/mouth switch while briefly closed/small), reaction impulses with anticipation,
// squash & stretch, and follow-through on her bow / his tuft.
'use strict';

const DISCRETE_TRACKS = new Set(['eyes', 'mouth', 'brows', 'padL', 'padR', 'pose', 'hideBody', 'talkArm']);

// 0 -> 1 -> 0 over [0, w] with soft ends.
function bump(x, w) {
  if (x <= 0 || x >= w) return 0;
  const s = Math.sin(Math.PI * x / w);
  return s * s;
}
const smooth01 = (x) => { const k = clamp(x); return k * k * (3 - 2 * k); };

// Arm poses as [aL, bL, aR, bR] so they can be keyframed and blended.
const ARMS = {
  rest: [0.2, 0, 0.2, 0],
  lap: [0.2, 1.35, 0.2, 1.35],
  hug: [0.35, 1.9, 0.35, 1.9],
  crossed: [0.18, 2.05, 0.18, 2.0],
  hips: [0.95, 1.55, 0.95, 1.55],
  up: [2.55, 0.25, 2.55, 0.25],
  cheer: [2.2, -0.2, 2.2, -0.2],
  shrug: [0.95, -0.95, 0.95, -0.95],
  waveR: [0.2, 1.3, 2.5, 0.5],
  cheekR: [0.2, 1.35, 1.0, 2.55],
  cheeks: [1.0, 2.55, 1.0, 2.55],
  pointR: [0.2, 1.35, 1.55, 0.1],
  phoneUp: [1.05, 2.35, 1.6, 0.45],
  table: [0.45, 1.55, 0.45, 1.55],
  thinkR: [0.2, 1.35, 0.75, 2.75],
};

class Actor {
  constructor(who, base, spec = {}) {
    this.who = who;
    this.base = base;
    this.spec = spec;
    this.seed = who === 'her' ? 7 : 3;
    this.phase = who === 'her' ? 1.9 : 0.4;
    this.changes = {};
    for (const name of ['eyes', 'mouth']) {
      const fr = spec[name] || [];
      this.changes[name] = fr.slice(1).filter((f, i) => f[1] !== fr[i][1]).map((f) => f[0]);
    }
    // random blink schedule
    const r = mulberry32(this.seed * 101);
    this.blinks = [];
    for (let tt = 0.8 + r() * 2; tt < 120; tt += 2.2 + r() * 2.8) this.blinks.push(tt);
  }

  // Keyframed values + impulses, without idle life (also used for follow-through).
  raw(t) {
    const o = Object.assign({}, this.base);
    for (const [name, frames] of Object.entries(this.spec)) {
      if (name === 'impulses' || name === 'idle' || !Array.isArray(frames) || !frames.length) continue;
      if (DISCRETE_TRACKS.has(name)) o[name] = step(t, frames, o[name]);
      else o[name] = key(t, frames);
    }
    o.squash = o.squash ?? 1;
    o.hop = o.hop ?? 0;
    o.headTilt = o.headTilt ?? 0;
    o.look = o.look ?? 0;
    o.lookY = o.lookY ?? 0;
    o.lean = o.lean ?? 0;
    o.eyeScale = o.eyeScale ?? 1;
    o.x = o.x ?? 540;
    for (const imp of this.spec.impulses || []) {
      const [ti, kind, amp = 1] = imp;
      const d = t - ti;
      if (d < -0.2 || d > 2.2) continue;
      if (kind === 'surprise') {
        o.squash *= 1 - 0.06 * amp * bump(d + 0.12, 0.12) + 0.11 * amp * bump(d, 0.34);
        o.hop += 26 * amp * bump(d, 0.34);
        o.eyeScale *= 1 + 0.22 * amp * bump(d, 0.6);
      } else if (kind === 'hop') {
        o.squash *= 1 - 0.08 * amp * bump(d + 0.09, 0.09) + 0.06 * amp * bump(d, 0.36) - 0.07 * amp * bump(d - 0.36, 0.16);
        o.hop += 38 * amp * bump(d, 0.36);
      } else if (kind === 'nod') {
        o.lookY += 0.38 * amp * bump(d, 0.34);
        o.headTilt += 0.03 * amp * bump(d, 0.34);
      } else if (kind === 'nod2') {
        o.lookY += 0.3 * amp * (bump(d, 0.28) + bump(d - 0.3, 0.28));
      } else if (kind === 'shake') {
        o.look += 0.32 * amp * Math.sin(d * 24) * bump(d, 0.75);
      } else if (kind === 'flinch') {
        o.lean -= 0.09 * amp * bump(d, 0.45);
        o.squash *= 1 - 0.06 * amp * bump(d, 0.45);
      } else if (kind === 'laugh') {
        o.squash *= 1 + 0.03 * amp * Math.sin(d * 38) * bump(d, 1.0);
        o.headTilt += 0.06 * amp * Math.sin(d * 19) * bump(d, 1.0);
      } else if (kind === 'sigh') {
        o.squash *= 1 + 0.05 * amp * bump(d, 0.7) - 0.06 * amp * bump(d - 0.6, 0.9);
        o.lookY += 0.3 * amp * bump(d - 0.5, 1.1);
      } else if (kind === 'wiggle') {
        o.x += 7 * amp * Math.sin(d * 34) * bump(d, 0.7);
      } else if (kind === 'shiver') {
        o.x += 4 * amp * Math.sin(d * 55) * bump(d, 1.2);
      } else if (kind === 'lean') {
        o.lean += 0.06 * amp * bump(d, 0.8);
      } else if (kind === 'dogshake') {
        // shaking off water like a wet dog
        const e = bump(d, 0.85);
        o.lean += 0.13 * amp * Math.sin(d * 42) * e;
        o.headTilt += 0.24 * amp * Math.sin(d * 42 + 0.9) * e;
        o.x += 10 * amp * Math.sin(d * 42) * e;
        o.squash *= 1 - 0.05 * amp * e;
      } else if (kind === 'shiver2') {
        // strong freezing shiver
        o.x += 6 * amp * Math.sin(d * 70) * bump(d, 1.6);
        o.squash *= 1 - 0.03 * amp * bump(d, 1.6);
      }
    }
    return o;
  }

  talkEnv(S, t) {
    let env = 0;
    for (const l of S.lines) {
      if (l.who !== this.who || l.kind !== 'say' || l.o.silent) continue;
      const e = smooth01((t - l.t + 0.05) / 0.18) * smooth01((l.end + 0.18 - t) / 0.2);
      env = Math.max(env, e);
    }
    return env;
  }

  at(t, S) {
    const o = this.raw(t);
    const idle = this.spec.idle || {};
    const ph = this.phase;
    // breathing + sway
    const br = Math.sin((TAU * t) / 3.3 + ph);
    o.squash *= 1 + 0.012 * (idle.breathe ?? 1) * br;
    o.bob = (o.bob || 0) + 2.5 * (idle.breathe ?? 1) * br;
    o.headTilt += 0.022 * (idle.sway ?? 1) * Math.sin((TAU * t) / 5.3 + ph * 2);
    o.look += 0.035 * (idle.sway ?? 1) * Math.sin((TAU * t) / 6.7 + ph);
    // eye saccades (small, eased)
    const sp = 1.45, k = (t + ph) / sp, i = Math.floor(k);
    const rnd = (n) => { const r = mulberry32(this.seed * 977 + n); return [(r() - 0.5) * 0.5, (r() - 0.5) * 0.35]; };
    const a = rnd(i - 1), b = rnd(i), m = smooth01((k - i) / 0.09);
    const pup = o.pupil || [0, 0];
    o.pupil = [pup[0] + lerp(a[0], b[0], m) * (idle.saccade ?? 1), pup[1] + lerp(a[1], b[1], m) * (idle.saccade ?? 1)];
    // talking: head bob, little nods, gesturing arm
    const env = this.talkEnv(S, t);
    if (env > 0) {
      o.headTilt += 0.03 * env * Math.sin(t * 6.3 + ph);
      o.lookY += 0.045 * env * Math.sin(t * 8.7);
      o.bob += 4 * env * Math.abs(Math.sin(t * 8.7));
      const arm = o.talkArm || 'none';
      if (arm === 'R' || arm === 'L') {
        const g = env * (0.55 + 0.45 * Math.sin(t * 4.1 + ph));
        if (arm === 'R') { o.aR = (o.aR ?? 0.2) + 0.55 * g; o.bR = (o.bR ?? 0) + 0.7 * g; }
        else { o.aL = (o.aL ?? 0.2) + 0.55 * g; o.bL = (o.bL ?? 0) + 0.7 * g; }
      }
    }
    o.talk = S.mouth(this.who, t);
    // blinks: natural ones + closing the eyes exactly when the eye shape changes
    let open = o.eyeOpen ?? 1;
    for (const bt of this.blinks) { const d = t - bt; if (d > -0.1 && d < 0.1) open = Math.min(open, 1 - bump(d + 0.1, 0.2)); }
    let dEye = 9;
    for (const tc of this.changes.eyes) dEye = Math.min(dEye, Math.abs(t - tc));
    if (dEye < 0.1) { open = Math.min(open, dEye / 0.1); o.eyeScale *= 0.6 + 0.4 * (dEye / 0.1); }
    o.eyeOpen = open;
    let dMouth = 9;
    for (const tc of this.changes.mouth) dMouth = Math.min(dMouth, Math.abs(t - tc));
    if (dMouth < 0.08) o.mouthScale = (o.mouthScale ?? 1) * (0.45 + 0.55 * (dMouth / 0.08));
    // follow-through: bow / tuft lag behind head and body motion
    const p1 = this.raw(t - 0.06), p2 = this.raw(t - 0.12);
    const v1 = (o.headTilt - p1.headTilt) + (o.x - p1.x) * 0.004 + (o.hop - p1.hop) * -0.004;
    const v2 = (p1.headTilt - p2.headTilt) + (p1.x - p2.x) * 0.004 + (p1.hop - p2.hop) * -0.004;
    o.bowSwing = clamp(-v1 * 5 + v2 * 2.2, -0.55, 0.55);
    o.tuftSwing = clamp(-v1 * 3.5 + v2 * 1.6, -0.4, 0.4);
    // arms as array track
    if (o.arms4) { [o.aL, o.bL, o.aR, o.bR] = o.arms4; }
    delete o.arms4;
    delete o.talkArm;
    return bearState(this.who, o);
  }
}

// Shorthand to build keyframes for arms: arm(t, 'hug') -> [t, [..4 angles..]]
function armKey(t, pose, e) { return [t, ARMS[pose] || pose, e]; }
