// Core helpers: math, easing, keyframes, seeded randomness, camera and the Skit timeline
// (dialogue lines, sound cues, music cues). Everything is a pure function of time t so any
// frame can be rendered on its own.
'use strict';

const W = 1080;
const H = 1920;
const TAU = Math.PI * 2;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
// progress of t through [a, b], clamped to 0..1
const seg = (t, a, b) => clamp((t - a) / (b - a));
const inRange = (t, a, b) => t >= a && t < b;

const ease = {
  linear: (k) => k,
  inQuad: (k) => k * k,
  outQuad: (k) => 1 - (1 - k) * (1 - k),
  inOut: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  inOutCubic: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  outCubic: (k) => 1 - Math.pow(1 - k, 3),
  inCubic: (k) => k * k * k,
  outBack: (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  outElastic: (k) => (k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (TAU / 3)) + 1),
  outBounce: (k) => {
    const n1 = 7.5625, d1 = 2.75;
    if (k < 1 / d1) return n1 * k * k;
    if (k < 2 / d1) return n1 * (k -= 1.5 / d1) * k + 0.75;
    if (k < 2.5 / d1) return n1 * (k -= 2.25 / d1) * k + 0.9375;
    return n1 * (k -= 2.625 / d1) * k + 0.984375;
  },
};

// Piecewise keyframes: key(t, [[t0, v0], [t1, v1, easeFn], ...]); the ease on a frame shapes
// the segment that ends at that frame. Values may be numbers or arrays of numbers.
function key(t, frames) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1, e] = frames[i];
    if (t <= t1) {
      const [t0, v0] = frames[i - 1];
      const k = (e || ease.inOut)(t1 === t0 ? 1 : (t - t0) / (t1 - t0));
      if (Array.isArray(v0)) return v0.map((a, j) => lerp(a, v1[j], k));
      return lerp(v0, v1, k);
    }
  }
  return frames[frames.length - 1][1];
}

// Step function: last value whose time is <= t.
function step(t, frames, fallback) {
  let v = fallback;
  for (const [t0, val] of frames) if (t >= t0) v = val;
  return v;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth 1D value noise in -1..1, deterministic per seed.
function noise1(x, seed = 0) {
  const h = (n) => { const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
  const i = Math.floor(x), f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u);
}

// Periodic blink: returns eye openness 0..1 for a character with its own rhythm.
function blink(t, seed = 1, every = 3.4) {
  const r = mulberry32(seed);
  let start = 0.6 + r() * every;
  while (start < t + 1) {
    const d = t - start;
    if (d >= 0 && d < 0.16) return Math.abs(d - 0.08) / 0.08;
    start += every * (0.6 + r() * 0.8);
  }
  return 1;
}

// ---------- camera ----------
// cam: {x, y, zoom, rot, shake, seed}: world point (x, y) is drawn at the screen centre.
function applyCamera(ctx, cam, t) {
  const sh = cam.shake || 0;
  const sx = sh ? noise1(t * 38, 3) * sh : 0;
  const sy = sh ? noise1(t * 41, 7) * sh : 0;
  ctx.translate(W / 2 + sx, H / 2 + sy);
  ctx.scale(cam.zoom || 1, cam.zoom || 1);
  if (cam.rot) ctx.rotate(cam.rot);
  ctx.translate(-(cam.x == null ? W / 2 : cam.x), -(cam.y == null ? H / 2 : cam.y));
}
function worldToScreen(cam, p) {
  const z = cam.zoom || 1;
  const cx = cam.x == null ? W / 2 : cam.x, cy = cam.y == null ? H / 2 : cam.y;
  let x = (p[0] - cx) * z, y = (p[1] - cy) * z;
  if (cam.rot) { const c = Math.cos(cam.rot), s = Math.sin(cam.rot); [x, y] = [x * c - y * s, x * s + y * c]; }
  return [x + W / 2, y + H / 2];
}
const CAM0 = { x: W / 2, y: H / 2, zoom: 1 };

// ---------- shapes ----------
function ellipse(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, TAU);
}
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
function fillStroke(ctx, fill, stroke, lw) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && lw) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
// Thick rounded stroke with an outline (draws the outline first, then the fill on top).
function outlinedStroke(ctx, pts, width, fill, outline, olw) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = outline;
  ctx.lineWidth = width + olw * 2;
  ctx.stroke();
  ctx.strokeStyle = fill;
  ctx.lineWidth = width;
  ctx.stroke();
}
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 1.1, y - s * 0.45, x - s * 0.45, y - s * 1.15, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s * 1.15, x + s * 1.1, y - s * 0.45, x, y + s * 0.35);
  ctx.closePath();
}

// ---------- text ----------
const FONT = 'Inter, "Noto Color Emoji", sans-serif';
function font(size, weight = 800) { return `${weight} ${size}px ${FONT}`; }

function wrapText(ctx, text, maxWidth) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { out.push(line); line = w; } else line = test;
    }
    out.push(line);
  }
  return out;
}

// Draws (optionally outlined) multi-line text centred on (x, y). Returns the box it used.
function drawText(ctx, text, x, y, o = {}) {
  const size = o.size || 60;
  ctx.save();
  ctx.font = font(size, o.weight || 800);
  ctx.textAlign = o.align || 'center';
  ctx.textBaseline = 'middle';
  ctx.wordSpacing = (o.wordSpacing == null ? Math.round(size * 0.12) : o.wordSpacing) + 'px';
  const lines = wrapText(ctx, text, o.maxWidth || 900);
  const lh = size * (o.lineHeight || 1.18);
  const y0 = y - ((lines.length - 1) * lh) / 2;
  if (o.shadow) {
    ctx.shadowColor = o.shadow;
    ctx.shadowBlur = o.shadowBlur || 14;
    ctx.shadowOffsetY = o.shadowY == null ? 4 : o.shadowY;
  }
  lines.forEach((ln, i) => {
    if (o.stroke) {
      ctx.lineWidth = o.strokeWidth || size * 0.16;
      ctx.strokeStyle = o.stroke;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(ln, x, y0 + i * lh);
      ctx.shadowColor = 'transparent';
    }
    ctx.fillStyle = o.color || '#fff';
    ctx.fillText(ln, x, y0 + i * lh);
  });
  const widths = lines.map((l) => ctx.measureText(l).width);
  ctx.restore();
  return { w: Math.max(...widths), h: lines.length * lh, lines: lines.length };
}

function measureLines(ctx, text, size, weight, maxWidth) {
  ctx.save();
  ctx.font = font(size, weight);
  const lines = wrapText(ctx, text, maxWidth);
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width));
  ctx.restore();
  return { lines, w };
}

// ---------- Skit timeline ----------
const VOICE = {
  him: { f0: 150, rate: 10.5 },
  her: { f0: 265, rate: 11.5 },
};
const MOODS = {
  normal: { rate: 1, pitch: 1, amp: 1 },
  sweet: { rate: 0.9, pitch: 1.08, amp: 0.85 },
  angry: { rate: 1.25, pitch: 1.06, amp: 1.15 },
  shout: { rate: 1.1, pitch: 1.22, amp: 1.35 },
  sleepy: { rate: 0.6, pitch: 0.85, amp: 0.7 },
  sad: { rate: 0.8, pitch: 0.95, amp: 0.8 },
  whisper: { rate: 1.0, pitch: 1.0, amp: 0.5 },
  excited: { rate: 1.2, pitch: 1.18, amp: 1.1 },
};

class Skit {
  constructor(def) {
    this.def = def;
    this.name = def.name;
    this.duration = def.duration;
  }

  build() {
    this.lines = [];
    this.syll = [];
    this.sfxList = [];
    this.musicList = [];
    this.rng = mulberry32(1234);
    this.def.setup(this);
    this.lines.sort((a, b) => a.t - b.t);
  }

  // Speech line with babble voice + bubble. o: {dur, mood, hold, at:[x,y], silent, style}
  say(who, t, text, o = {}) {
    const letters = text.replace(/[^\p{L}\p{N}]/gu, '').length;
    const mood = o.mood || 'normal';
    const m = MOODS[mood];
    const dur = o.dur || clamp(0.28 + letters * 0.055 / m.rate, 0.45, 2.8);
    const line = { kind: 'say', who, t, text, dur, end: t + dur, hold: o.hold == null ? 0.75 : o.hold, mood, o };
    if (!o.silent) this._babble(line);
    this.lines.push(line);
    return line;
  }

  // Thought bubble (no voice).
  think(who, t, text, o = {}) {
    const line = { kind: 'think', who, t, text, dur: o.dur || 2.2, hold: 0, o };
    line.end = t + line.dur;
    this.lines.push(line);
    return line;
  }

  _babble(line) {
    const v = VOICE[line.who];
    const m = MOODS[line.mood];
    const rate = v.rate * m.rate;
    const n = Math.max(2, Math.round(line.dur * rate));
    const r = mulberry32(Math.floor(line.t * 1000) + line.text.length * 17);
    const question = /\?\s*\S*$/.test(line.text) && !/!/.test(line.text);
    const exclaim = /!/.test(line.text);
    line.syll = [];
    for (let i = 0; i < n; i++) {
      const k = i / Math.max(1, n - 1);
      let contour = 1 + 0.06 * Math.sin(k * Math.PI) - 0.05 * k;
      if (question && i >= n - 2) contour *= 1.18 + 0.1 * (i - (n - 2));
      if (exclaim) contour *= 1 + 0.08 * (1 - k);
      const s = {
        who: line.who,
        t: line.t + i / rate + (r() - 0.5) * 0.012,
        d: (1 / rate) * (0.72 + r() * 0.2),
        f0: v.f0 * m.pitch * contour * (1 + (r() - 0.5) * 0.16),
        vowel: 'aeiou'[Math.floor(r() * 5)],
        cons: r() < 0.6 ? 'tkpsmnbdlh'[Math.floor(r() * 10)] : '',
        amp: m.amp * (0.8 + r() * 0.25),
        mood: line.mood,
      };
      line.syll.push(s);
      this.syll.push(s);
    }
  }

  sfx(t, name, o = {}) { this.sfxList.push({ t, name, ...o }); }
  music(t0, t1, mood, o = {}) { this.musicList.push({ t0, t1, mood, ...o }); }

  // Mouth openness 0..1 for a speaker at time t (from their babble syllables).
  mouth(who, t) {
    let v = 0;
    for (const l of this.lines) {
      if (l.who !== who || !l.syll || t < l.t - 0.05 || t > l.end + 0.2) continue;
      for (const s of l.syll) {
        if (t >= s.t && t <= s.t + s.d) v = Math.max(v, Math.sin(Math.PI * (t - s.t) / s.d) * Math.min(1.2, s.amp));
      }
    }
    return v;
  }
  talking(who, t) { return this.lines.some((l) => l.kind === 'say' && l.who === who && t >= l.t && t <= l.end); }
  visibleLines(t) { return this.lines.filter((l) => t >= l.t - 0.05 && t <= l.end + l.hold); }

  meta() {
    return {
      name: this.name,
      duration: this.duration,
      voices: this.syll,
      sfx: this.sfxList,
      music: this.musicList,
    };
  }

  render(ctx, t) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    this.def.draw(ctx, t, this);
    ctx.restore();
  }
}

function makeSkit(def) { const s = new Skit(def); window.SKIT = s; return s; }
