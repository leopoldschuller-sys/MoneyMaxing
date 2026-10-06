#!/usr/bin/env python3
"""Synthesises a skit's soundtrack from build/<skit>.cues.json -> build/<skit>.wav.

Everything is generated procedurally (no samples, no licensing issues):
  * bear "babble" voices: formant-synthesised gibberish syllables (Animal-Crossing style),
    timed exactly like the mouth animation in the renderer,
  * cartoon sound effects,
  * short original music loops in a few moods.
Usage: python3 render/audio.py <skit>
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, iirpeak, lfilter, sosfilt

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
RNG = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def tvec(d):
    return np.arange(int(max(d, 0) * SR)) / SR


def env_adsr(n, a=0.005, d=0.05, s=0.7, r=0.05):
    e = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n)
    e[:na] = np.linspace(0, 1, na, endpoint=False) if na else e[:na]
    nd = min(nd, max(n - na, 0))
    e[na:na + nd] = np.linspace(1, s, nd, endpoint=False) if nd else e[na:na + nd]
    nr = min(nr, n)
    if nr:
        e[n - nr:] *= np.linspace(1, 0, nr)
    return e


def exp_decay(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def bandpass(x, lo, hi, order=2):
    hi = min(hi, SR / 2 * 0.95)
    sos = butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return sosfilt(sos, x)


def lowpass(x, f, order=2):
    sos = butter(order, min(f, SR / 2 * 0.95), btype='low', fs=SR, output='sos')
    return sosfilt(sos, x)


def highpass(x, f, order=2):
    sos = butter(order, f, btype='high', fs=SR, output='sos')
    return sosfilt(sos, x)


def noise(n):
    return RNG.uniform(-1, 1, n)


def sweep_bandpass(x, fc_of_k, width=1.6, block=2048):
    """Band-pass whose centre frequency follows fc_of_k(k in 0..1); Hann overlap-add, click free."""
    n = len(x)
    out = np.zeros(n + block)
    win = np.hanning(block)
    xp = np.concatenate([x, np.zeros(block)])
    hop = block // 2
    for a in range(0, n, hop):
        fc = float(fc_of_k(min(1.0, a / max(1, n - 1))))
        seg_ = bandpass(xp[a:a + block] * win, fc / width, fc * width)
        out[a:a + block] += seg_
    return out[:n]


def fade_tail(x, ms=8):
    m = min(len(x), int(ms / 1000 * SR))
    if m:
        x = x.copy()
        x[-m:] *= np.linspace(1, 0, m)
    return x


def add(buf, t, sig, gain=1.0):
    i = int(round(t * SR))
    if i < 0:
        sig = sig[-i:]
        i = 0
    j = min(len(buf), i + len(sig))
    if j > i:
        buf[i:j] += sig[: j - i] * gain


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def comb(x, delay, g):
    """Feedback comb filter y[n] = x[n] + g*y[n-D], processed in blocks of D samples."""
    y = np.copy(x)
    for k in range(delay, len(y), delay):
        end = min(k + delay, len(y))
        y[k:end] += g * y[k - delay:end - delay]
    return y


def reverb(x, mix=0.25, size=1.0):
    combs = [int(d * size) for d in (1557, 1617, 1491, 1422)]
    wet = sum(comb(x, d, 0.78) for d in combs) / 4
    wet = lowpass(wet, 5000)
    for d, g in ((225, 0.5), (556, 0.5)):
        # allpass: y = -g*x + x[n-d] + g*y[n-d]  (approximated with comb + feedforward)
        wet = comb(wet, d, g) * (1 - g * g) - g * wet
    return x * (1 - mix) + wet * mix


# ---------------------------------------------------------------- voices
FORMANTS = {
    'a': ((800, 90, 1.0), (1250, 110, 0.55), (2600, 160, 0.25)),
    'e': ((470, 70, 1.0), (2000, 120, 0.45), (2650, 170, 0.25)),
    'i': ((320, 60, 1.0), (2300, 130, 0.4), (3000, 180, 0.22)),
    'o': ((520, 80, 1.0), (880, 100, 0.55), (2600, 160, 0.2)),
    'u': ((360, 60, 1.0), (760, 90, 0.5), (2450, 150, 0.18)),
}
VOICE_SHIFT = {'him': 1.1, 'her': 1.28}


def glottal(f, n, tilt=1.25, breath=0.0):
    phase = 2 * np.pi * np.cumsum(f[:n]) / SR
    out = np.zeros(n)
    kmax = int(min(40, 5500 / max(f.min(), 60)))
    for k in range(1, kmax + 1):
        out += np.sin(k * phase) / k ** tilt
    if breath:
        out += breath * bandpass(noise(n), 500, 6000) * 2.0
    return out


def formant_filter(src, vowel, shift):
    out = np.zeros_like(src)
    for f, bw, g in FORMANTS[vowel]:
        fc = min(f * shift, SR / 2 * 0.9)
        b, a = iirpeak(fc, fc / (bw * shift), fs=SR)
        out += lfilter(b, a, src) * g
    return out


def syllable(s):
    d, f0, mood, who = s['d'], s['f0'], s['mood'], s['who']
    n = int(d * SR)
    t = np.arange(n) / SR
    glide = {'angry': -0.12, 'shout': -0.1, 'sad': -0.08, 'sleepy': -0.1, 'excited': 0.08}.get(mood, -0.03)
    f = f0 * (1 + glide * t / max(d, 1e-3)) * (1 + 0.015 * np.sin(2 * np.pi * 6 * t))
    tilt = {'angry': 0.95, 'shout': 0.85, 'whisper': 1.3, 'sleepy': 1.5, 'sweet': 1.35}.get(mood, 1.2)
    breath = {'sleepy': 0.25, 'whisper': 1.2, 'sad': 0.12}.get(mood, 0.04)
    src = glottal(f, n, tilt, breath)
    if mood == 'whisper':
        src = bandpass(noise(n), 300, 7000)
    v = formant_filter(src, s['vowel'], VOICE_SHIFT[who])
    v /= (np.max(np.abs(v)) + 1e-9)
    if mood in ('angry', 'shout'):
        v = np.tanh(v * 2.2) / np.tanh(2.2)
    e = env_adsr(n, a=0.008, d=0.03, s=0.85, r=min(0.035, d * 0.4))
    out = v * e
    c = s.get('cons')
    if c:
        cn = int(0.018 * SR)
        if c == 's':
            burst = highpass(noise(cn), 4500) * exp_decay(cn, 0.012) * 0.5
        elif c in 'tkpdb':
            lo = {'t': 3000, 'k': 1800, 'p': 600, 'd': 2500, 'b': 400}[c]
            burst = bandpass(noise(cn), lo, lo * 2.2) * exp_decay(cn, 0.004) * 0.9
        elif c in 'mnl':
            tt = np.arange(cn) / SR
            burst = np.sin(2 * np.pi * f0 * tt) * 0.35 * np.linspace(0.2, 1, cn)
        else:  # h
            burst = bandpass(noise(cn), 800, 5000) * 0.25 * np.linspace(1, 0.3, cn)
        out = np.concatenate([burst, out])
    return out * s['amp'] * 0.55


def yawn(who):
    d = 0.85
    n = int(d * SR)
    t = np.arange(n) / SR
    f0 = (300 if who == 'her' else 230) * np.interp(t, [0, 0.25, 0.85], [1.0, 1.15, 0.45])
    src = glottal(f0, n, 1.4, 0.1)
    # vowel morph a -> o -> u by crossfading filtered versions
    a = formant_filter(src, 'a', VOICE_SHIFT[who])
    u = formant_filter(src, 'o', VOICE_SHIFT[who])
    k = np.clip(t / d, 0, 1)
    v = a * (1 - k) + u * k
    v /= np.max(np.abs(v)) + 1e-9
    return v * env_adsr(n, 0.08, 0.1, 0.9, 0.25) * 0.45


# ---------------------------------------------------------------- sfx
def sfx_click(c):
    n = int(0.05 * SR)
    x = bandpass(noise(n), 1500, 6000) * exp_decay(n, 0.004)
    t = np.arange(n) / SR
    x += np.sin(2 * np.pi * 2400 * t) * exp_decay(n, 0.006) * 0.5
    return x * 0.6


def sfx_pop(c):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 950 * np.exp(-t * 18) + 280
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(n, 0.03)
    return x * 0.55


def sfx_bubble_pop(c):
    x = sfx_pop(c)
    n = int(0.15 * SR)
    sp = bandpass(noise(n), 2000, 8000) * exp_decay(n, 0.02) * 0.35
    out = np.zeros(max(len(x), n))
    out[:len(x)] += x
    out[:n] += sp
    return out


def bell(freq, d=1.2, gain=0.5):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for ratio, tau, g in ((1, d * 0.5, 1), (2.76, d * 0.25, 0.45), (5.4, d * 0.12, 0.25), (8.93, d * 0.07, 0.15)):
        x += np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t / tau) * g
    return x * gain * env_adsr(n, 0.002, 0.01, 1, 0.02)


def sfx_ding(c):
    out = np.zeros(int(1.2 * SR))
    add(out, 0, bell(1568, 1.1, 0.4))
    add(out, 0.08, bell(2093, 0.9, 0.25))
    return out


def sfx_whoosh(c):
    d = c.get('dur', 0.42)
    n = int(d * SR)
    out = sweep_bandpass(noise(n), lambda k: 400 + 2600 * np.sin(np.pi * k), 1.5, 1024)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return out * e * 1.2


def sfx_crickets(c):
    d = c.get('dur', 5)
    n = int(d * SR)
    out = np.zeros(n)
    for freq, rate, off in ((4400, 0.95, 0.1), (4750, 1.3, 0.55)):
        t0 = off
        while t0 < d - 0.3:
            for p in range(3):
                m = int(0.022 * SR)
                tt = np.arange(m) / SR
                chirp = np.sin(2 * np.pi * freq * tt) * np.sin(np.pi * tt / 0.022) * (np.sin(2 * np.pi * 220 * tt) * 0.5 + 0.5)
                add(out, t0 + p * 0.045, chirp, 0.18)
            t0 += rate * (0.85 + 0.3 * RNG.random())
    fade = np.minimum(1, np.minimum(np.arange(n) / (0.4 * SR), (n - np.arange(n)) / (0.4 * SR)))
    return out * fade


def sfx_squeak(c):
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    f = 900 + 1100 * (t / 0.22) + 60 * np.sin(2 * np.pi * 28 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_adsr(n, 0.01, 0.05, 0.8, 0.06)
    return x * 0.35


def sfx_tick(c):
    out = np.zeros(int(0.7 * SR))
    for i in range(4):
        n = int(0.03 * SR)
        x = bandpass(noise(n), 2500, 7000) * exp_decay(n, 0.004) * (0.6 if i % 2 else 0.9)
        add(out, i * 0.09, x)
    w = sfx_whoosh({'dur': 0.35}) * 0.5
    add(out, 0.3, w)
    return out * 0.7


def sfx_scroll(c):
    n = int(0.11 * SR)
    x = bandpass(noise(n), 1800, 5200) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    t = np.arange(n) / SR
    x += np.sin(2 * np.pi * 3200 * t) * exp_decay(n, 0.003) * 0.3
    return x * 0.22


def brass_hit(root_midi, d=0.8, gain=0.5):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for m in (root_midi, root_midi + 7, root_midi + 12, root_midi + 15):
        f = midi(m)
        ph = 2 * np.pi * f * t
        saw = sum(np.sin(k * ph) / k for k in range(1, 14))
        x += saw
    x = lowpass(x, 1800)
    timp_n = n
    tf = 70 * np.exp(-t * 4) + 45
    timp = np.sin(2 * np.pi * np.cumsum(tf) / SR) * exp_decay(timp_n, 0.25) * 2.5
    out = (x / 4) * env_adsr(n, 0.01, 0.15, 0.6, 0.3) + timp * env_adsr(n, 0.003, 0.01, 1, 0.12)
    return fade_tail(out / (np.max(np.abs(out)) + 1e-9) * gain, 30)


def sfx_sting(c):
    kind = c.get('kind', 'dun')
    if kind == 'dun':
        return brass_hit(38, 1.0, 0.65)
    if kind == 'dundun':
        out = np.zeros(int(1.4 * SR))
        add(out, 0, brass_hit(40, 0.35, 0.45))
        add(out, 0.33, brass_hit(39, 1.0, 0.7))
        return out
    if kind == 'blink':
        out = np.zeros(int(0.6 * SR))
        for i in range(2):
            add(out, i * 0.18, bell(2637, 0.25, 0.25))
        return out
    if kind == 'record':
        return sfx_scratch(c)
    return brass_hit(38)


def sfx_scratch(c):
    d = 0.45
    n = int(d * SR)
    t = np.arange(n) / SR
    out = sweep_bandpass(noise(n), lambda k: 900 + 700 * np.sin(2 * np.pi * 7 * k * d), 1.5, 512)
    tone = np.sin(2 * np.pi * np.cumsum(300 + 250 * np.sin(2 * np.pi * 7 * t)) / SR) * 0.5
    return (out + tone) * env_adsr(n, 0.005, 0.05, 0.9, 0.1) * 0.7


def sfx_boop(c):
    n = int(0.13 * SR)
    t = np.arange(n) / SR
    f = 520 + 380 * (t / 0.13)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_adsr(n, 0.005, 0.03, 0.7, 0.05) * 0.45


def sfx_hearts(c):
    out = np.zeros(int(1.4 * SR))
    for i, m in enumerate((84, 88, 91, 96, 100)):
        add(out, i * 0.07, bell(midi(m), 0.9, 0.18))
    return out


def snore(who):
    if who == 'her':
        d = 1.3
        n = int(d * SR)
        t = np.arange(n) / SR
        inh = lowpass(noise(n), 1400) * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)) * np.sin(np.pi * np.clip(t / 0.6, 0, 1)) * (t < 0.6)
        wh = np.sin(2 * np.pi * np.cumsum(np.interp(t, [0.65, 1.25], [1500, 1100])) / SR) * np.sin(np.pi * np.clip((t - 0.65) / 0.6, 0, 1)) * (t >= 0.65) * 0.25
        return (inh * 0.25 + wh) * 0.6
    d = 1.9
    n = int(d * SR)
    t = np.arange(n) / SR
    # smooth 30 Hz flutter of the soft palate (no hard edges -> no clicks)
    rattle = 0.35 + 0.65 * np.sin(np.pi * 30 * t) ** 4
    inh_env = np.sin(np.pi * np.clip(t / 0.95, 0, 1)) * (t < 0.95)
    inh = lowpass(noise(n), 450, 4) * rattle * inh_env
    fry = lowpass(glottal(np.full(n, 58.0), n, 1.1), 900, 4) * rattle * inh_env * 0.5
    inh = lowpass(formant_filter(inh + fry, 'o', 0.75), 1400, 4)
    ex_env = np.sin(np.pi * np.clip((t - 1.0) / 0.85, 0, 1)) * (t >= 1.0)
    whistle = np.sin(2 * np.pi * np.cumsum(np.interp(t, [1.0, 1.85], [1150, 650])) / SR) * ex_env * 0.12
    breath = bandpass(noise(n), 300, 1500) * ex_env * 0.12
    out = inh / (np.max(np.abs(inh)) + 1e-9) * 0.8 + whistle + breath
    return out * 0.42


def sfx_snore(c):
    return snore(c.get('voice', 'him'))


def sfx_yawn(c):
    return yawn(c.get('voice', 'him'))


def sfx_thud(c):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 110 * np.exp(-t * 10) + 45
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(n, 0.09)
    x += lowpass(noise(n), 900) * exp_decay(n, 0.03) * 0.6
    return x * 0.8


def sfx_boing(c):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 180 + 260 * np.exp(-t * 5) * (1 + 0.5 * np.sin(2 * np.pi * 14 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(n, 0.18) * 0.5


def sfx_chomp(c):
    out = np.zeros(int(0.35 * SR))
    for i in range(3):
        n = int(0.06 * SR)
        x = bandpass(noise(n), 700, 4000) * exp_decay(n, 0.015)
        add(out, i * 0.09 + RNG.random() * 0.01, x, 0.6 - i * 0.12)
    return out


def sfx_gulp(c):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    f = 500 * np.exp(-t * 9) + 120
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_adsr(n, 0.01, 0.05, 0.7, 0.08) * 0.5


def sfx_doorbell(c):
    out = np.zeros(int(1.6 * SR))
    add(out, 0, bell(midi(76), 1.0, 0.35))
    add(out, 0.45, bell(midi(72), 1.1, 0.35))
    return out


def sfx_sparkle(c):
    out = np.zeros(int(1.0 * SR))
    for i in range(7):
        add(out, i * 0.05, bell(midi(88 + (i * 3) % 12), 0.4, 0.12))
    return out


def sfx_shake(c):
    d = c.get('dur', 0.8)
    n = int(d * SR)
    t = np.arange(n) / SR
    x = bandpass(noise(n), 300, 3000) * (0.5 + 0.5 * np.sin(2 * np.pi * 16 * t)) ** 2
    return x * env_adsr(n, 0.02, 0.05, 0.9, 0.1) * 0.45


def sfx_chatter(c):
    d = c.get('dur', 1.0)
    out = np.zeros(int(d * SR))
    k = 0.0
    while k < d - 0.04:
        n = int(0.012 * SR)
        add(out, k, bandpass(noise(n), 2500, 7000) * exp_decay(n, 0.003), 0.45)
        k += 0.055
    return out


def sfx_crash(c):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    x = bandpass(noise(n), 800, 9000) * exp_decay(n, 0.18)
    for f in (1830, 2470, 3320):
        x += np.sin(2 * np.pi * f * t) * exp_decay(n, 0.25) * 0.15
    return x * 0.55


def sfx_spring(c):
    return sfx_boing(c)


def sfx_kiss(c):
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(700 + 900 * t / 0.18) / SR) * env_adsr(n, 0.002, 0.03, 0.4, 0.08)
    x += bandpass(noise(n), 1500, 6000) * exp_decay(n, 0.01) * 0.6
    return x * 0.4


def sfx_hmph(c):
    who = c.get('voice', 'her')
    s = {'who': who, 'd': 0.32, 'f0': 300 if who == 'her' else 170, 'vowel': 'u', 'cons': 'h', 'amp': 1.2, 'mood': 'angry'}
    return syllable(s)


def sfx_sigh(c):
    who = c.get('voice', 'her')
    d = 1.1
    n = int(d * SR)
    t = np.arange(n) / SR
    f0 = (310 if who == 'her' else 180) * np.interp(t, [0, 1.1], [1.15, 0.7])
    src = glottal(f0, n, 1.6, 1.0)
    v = formant_filter(src, 'a', VOICE_SHIFT[who])
    v /= np.max(np.abs(v)) + 1e-9
    return v * env_adsr(n, 0.15, 0.2, 0.8, 0.5) * 0.5 * c.get('gain', 1)


def sfx_gasp(c):
    n = int(0.3 * SR)
    x = bandpass(noise(n), 900, 5000) * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.7
    return x * 0.5


def sfx_heartbeat(c):
    d = c.get('dur', 2.0)
    out = np.zeros(int(d * SR))
    k = 0.0
    while k < d - 0.3:
        for off, g in ((0, 1), (0.16, 0.7)):
            n = int(0.12 * SR)
            t = np.arange(n) / SR
            x = np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t * 8) + 40) / SR) * exp_decay(n, 0.05)
            x *= np.minimum(1, np.arange(n) / (0.004 * SR))
            add(out, k + off, fade_tail(x), g * 0.9)
        k += 0.75
    return out


def sfx_tada(c):
    out = np.zeros(int(1.5 * SR))
    add(out, 0, brass_hit(48, 0.2, 0.35))
    add(out, 0.18, brass_hit(55, 1.1, 0.5))
    add(out, 0.18, sfx_sparkle({}), 0.8)
    return out


def sfx_alarm(c):
    d = c.get('dur', 1.6)
    out = np.zeros(int(d * SR))
    k = 0.0
    while k < d - 0.1:
        for i in range(3):
            n = int(0.07 * SR)
            t = np.arange(n) / SR
            add(out, k + i * 0.11, np.sign(np.sin(2 * np.pi * 2100 * t)) * 0.18 * env_adsr(n, 0.002, 0.01, 1, 0.01))
        k += 0.55
    return out


def sfx_dial(c):
    n = int(0.25 * SR)
    out = np.zeros(n)
    for i in range(5):
        m = int(0.01 * SR)
        add(out, i * 0.045, bandpass(noise(m), 3000, 8000) * exp_decay(m, 0.002), 0.5)
    return out


def sfx_wobble(c):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = 300 + 120 * np.sin(2 * np.pi * 9 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_adsr(n, 0.02, 0.05, 0.8, 0.2) * 0.35


def sfx_drip(c):
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    f = 600 + 1400 * (t / 0.18) ** 0.5
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(n, 0.05) * 0.4


def sfx_fire(c):
    d = c.get('dur', 1.5)
    n = int(d * SR)
    x = lowpass(noise(n), 1200) * 0.6
    for _ in range(int(d * 14)):
        m = int(0.01 * SR)
        add(x, RNG.random() * d, bandpass(noise(m), 2000, 6000) * exp_decay(m, 0.003), 0.6)
    fade = np.minimum(1, np.minimum(np.arange(n) / (0.2 * SR), (n - np.arange(n)) / (0.3 * SR)))
    return x * fade * 0.35


def sfx_wind(c):
    d = c.get('dur', 2.0)
    n = int(d * SR)
    out = sweep_bandpass(noise(n), lambda k: 500 + 400 * np.sin(k * d * 7), 1.4, 4096)
    fade = np.minimum(1, np.minimum(np.arange(n) / (0.4 * SR), (n - np.arange(n)) / (0.4 * SR)))
    return out * fade * 0.5


def sfx_kettle(c):
    d = c.get('dur', 1.9)
    n = int(d * SR)
    t = np.arange(n) / SR
    f = np.interp(t, [0, d], [850, 2300]) * (1 + 0.012 * np.sin(2 * np.pi * 7 * t))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    air = bandpass(noise(n), 1500, 6000) * 0.25
    swell = np.clip(t / (d * 0.7), 0, 1) ** 1.5
    return (tone * 0.3 + air) * swell * env_adsr(n, 0.05, 0.1, 1, 0.08) * 0.45


def sfx_bell_round(c):
    out = np.zeros(int(1.6 * SR))
    for k in (0.0, 0.3):
        n = int(1.2 * SR)
        t = np.arange(n) / SR
        x = np.zeros(n)
        for ratio, tau, g in ((1, 0.9, 1), (2.41, 0.5, 0.6), (3.87, 0.3, 0.4), (5.38, 0.18, 0.3)):
            x += np.sin(2 * np.pi * 880 * ratio * t) * np.exp(-t / tau) * g
        add(out, k, x * 0.3)
    return out


SFX = {k[4:]: v for k, v in globals().items() if k.startswith('sfx_')}


# ---------------------------------------------------------------- instruments
def pluck(freq, d=0.6, bright=0.5, decay=0.996):
    """Karplus-Strong string with a 3-tap loop filter; low notes are darkened so they stay warm."""
    n = int(d * SR)
    period = max(2, int(SR / freq))
    buf = lowpass(noise(period * 3), 900 + 3500 * bright, 4)[period:period * 2]
    buf -= buf.mean()
    out = np.zeros(n)
    prev = buf
    for k in range(0, n, period):
        end = min(k + period, n)
        out[k:end] = prev[: end - k]
        prev = decay * (0.25 * np.roll(prev, 1) + 0.5 * prev + 0.25 * np.roll(prev, -1))
    out = lowpass(out, min(7000, freq * 14), 2)
    out /= np.max(np.abs(out)) + 1e-9
    return out * env_adsr(n, 0.002, 0.02, 1, 0.04) * 0.6


def kalimba(freq, d=0.9, gain=0.5):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * t) * np.exp(-t / (d * 0.35))
         + 0.35 * np.sin(2 * np.pi * freq * 4.2 * t) * np.exp(-t / 0.05)
         + 0.15 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / (d * 0.2)))
    return x * env_adsr(n, 0.002, 0.01, 1, 0.03) * gain


def musicbox(freq, d=1.2, gain=0.4):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t / 0.15)
         + 0.2 * np.sin(2 * np.pi * freq * 5.98 * t) * np.exp(-t / 0.06))
    return x * np.exp(-t / (d * 0.4)) * env_adsr(n, 0.002, 0.01, 1, 0.05) * gain


def epiano(freq, d=1.0, gain=0.35):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.3)
    x += 0.12 * np.sin(2 * np.pi * 7 * freq * t) * np.exp(-t / 0.02)
    x *= (1 + 0.08 * np.sin(2 * np.pi * 4.5 * t))
    return x * np.exp(-t / (d * 0.8)) * env_adsr(n, 0.004, 0.05, 1, 0.08) * gain


def pad(freq, d=2.0, gain=0.15):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for det in (-0.006, 0, 0.007):
        ph = 2 * np.pi * freq * (1 + det) * t
        x += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    return lowpass(x, 2500) * env_adsr(n, min(0.3, d / 3), 0.2, 0.9, min(0.5, d / 3)) * gain / 3


def bass(freq, d=0.5, gain=0.45):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)
    return x * env_adsr(n, 0.006, 0.08, 0.7, 0.06) * gain


def pizz(freq, d=0.25, gain=0.5):
    return pluck(freq, d, bright=0.3, decay=0.985) * gain


def kick(gain=0.6):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    f = 140 * np.exp(-t * 25) + 48
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(n, 0.09) * gain


def snare(gain=0.3):
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    x = bandpass(noise(n), 1200, 7000) * exp_decay(n, 0.05) + np.sin(2 * np.pi * 190 * t) * exp_decay(n, 0.04) * 0.6
    return x * gain


def hat(gain=0.12):
    n = int(0.05 * SR)
    return highpass(noise(n), 7000) * exp_decay(n, 0.012) * gain


def snap(gain=0.3):
    n = int(0.05 * SR)
    return bandpass(noise(n), 1500, 4500) * exp_decay(n, 0.008) * gain


def shaker(gain=0.07):
    n = int(0.07 * SR)
    return bandpass(noise(n), 5000, 12000) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * gain


# ---------------------------------------------------------------- music
def chord_notes(root, quality):
    iv = {'maj': (0, 4, 7), 'min': (0, 3, 7), 'maj7': (0, 4, 7, 11), 'min7': (0, 3, 7, 10), 'dom7': (0, 4, 7, 10)}[quality]
    return [root + i for i in iv]


MOODS = {
    'cozy': dict(bpm=84, prog=[(53, 'maj'), (50, 'min'), (46, 'maj'), (48, 'maj')], style='cozy'),
    'night': dict(bpm=66, prog=[(48, 'maj7'), (45, 'min7'), (41, 'maj7'), (43, 'maj')], style='night'),
    'romantic': dict(bpm=76, prog=[(48, 'maj'), (43, 'maj'), (45, 'min'), (41, 'maj')], style='romantic'),
    'silly': dict(bpm=118, prog=[(48, 'maj'), (41, 'maj'), (43, 'maj'), (48, 'maj')], style='silly'),
    'sneaky': dict(bpm=96, prog=[(45, 'min'), (45, 'min'), (50, 'min'), (40, 'maj')], style='sneaky'),
    'chaos': dict(bpm=158, prog=[(48, 'maj'), (44, 'maj'), (46, 'maj'), (48, 'maj')], style='chaos'),
    'glam': dict(bpm=112, prog=[(43, 'maj7'), (40, 'min7'), (48, 'maj7'), (50, 'maj')], style='glam'),
    'tense': dict(bpm=80, prog=[(38, 'min')], style='tense'),
    'sad': dict(bpm=70, prog=[(45, 'min'), (41, 'maj'), (48, 'maj'), (43, 'maj')], style='sad'),
}
SCALE_MAJ = [0, 2, 4, 5, 7, 9, 11]


def render_music(m):
    mood = MOODS[m['mood']]
    d = m['t1'] - m['t0']
    n = int((d + 1.5) * SR)
    out = np.zeros(n)
    bpm = mood['bpm'] * m.get('tempo', 1.0)
    beat = 60 / bpm
    bar = beat * 4
    style = mood['style']
    prog = mood['prog']
    rng = np.random.default_rng(int(m['t0'] * 100) + len(style))
    nbars = int(np.ceil(d / bar)) + 1
    mel_prev = 72
    for b in range(nbars):
        root, q = prog[b % len(prog)]
        notes = chord_notes(root, q)
        tb = b * bar
        if style == 'cozy':
            for nt in notes[1:] + [notes[0] + 12]:
                add(out, tb, epiano(midi(nt + 12), bar * 0.95, 0.12))
            add(out, tb, bass(midi(root - 12), beat * 1.8, 0.35))
            add(out, tb + beat * 2, bass(midi(root - 5), beat * 1.8, 0.3))
            for i in range(8):
                if rng.random() < 0.45:
                    deg = rng.choice([0, 2, 4, 7, 9]) + 72
                    add(out, tb + i * beat / 2, kalimba(midi(deg), 0.8, 0.12))
        elif style == 'night':
            for i, nt in enumerate(notes + [notes[1] + 12]):
                add(out, tb + i * beat * 0.8, kalimba(midi(nt + 24), 1.6, 0.1))
            add(out, tb, pad(midi(root + 12), bar * 1.05, 0.12))
        elif style == 'romantic':
            arp = notes + [notes[0] + 12, notes[2] + 12, notes[1] + 12, notes[0] + 12, notes[2]]
            for i in range(8):
                add(out, tb + i * beat / 2, musicbox(midi(arp[i % len(arp)] + 24), 1.0, 0.09))
            add(out, tb, pad(midi(root + 12), bar * 1.05, 0.14))
            add(out, tb, bass(midi(root - 12), bar * 0.9, 0.25))
        elif style in ('silly', 'chaos'):
            fast = style == 'chaos'
            add(out, tb, pizz(midi(root - 12), beat * 0.9, 0.9))
            add(out, tb + beat * 2, pizz(midi(root - 5), beat * 0.9, 0.8))
            for k in (1, 3):
                for nt in notes:
                    add(out, tb + k * beat, pluck(midi(nt + 12), beat * 0.6, 0.6, 0.99), 0.22)
            for i in range(8):
                if rng.random() < (0.75 if fast else 0.55):
                    step = rng.choice([-2, -1, 1, 2, 0, 3])
                    deg_idx = int(np.clip((mel_prev - 60) // 2 + step, 0, 13))
                    mel = 60 + 12 * (deg_idx // 7) + SCALE_MAJ[deg_idx % 7] + 12
                    mel_prev = mel - 12
                    add(out, tb + i * beat / 2, kalimba(midi(mel), 0.45, 0.13))
            for i in range(8):
                add(out, tb + i * beat / 2, shaker(0.05 if i % 2 else 0.035))
            if fast:
                for k in range(4):
                    add(out, tb + k * beat, kick(0.45))
                for k in (1, 3):
                    add(out, tb + k * beat, snare(0.22))
        elif style == 'sneaky':
            walk = [notes[0], notes[1], notes[2], notes[1]]
            for k in range(4):
                add(out, tb + k * beat, pizz(midi(walk[k] - 12), beat * 0.5, 1.0))
            for k in (1, 3):
                add(out, tb + k * beat, snap(0.35))
            if b % 2 == 1:
                for i, nt in enumerate((notes[2] + 12, notes[2] + 13, notes[2] + 14)):
                    add(out, tb + beat * 2.5 + i * beat / 4, pizz(midi(nt + 12), beat * 0.3, 0.5))
        elif style == 'glam':
            for k in range(4):
                add(out, tb + k * beat, kick(0.5))
                add(out, tb + k * beat + beat / 2, hat(0.14))
            for k in (1, 3):
                add(out, tb + k * beat, snap(0.3))
            for k in range(8):
                add(out, tb + k * beat / 2, bass(midi(root - 12 + (12 if k % 2 else 0)), beat * 0.45, 0.35))
            for k in (0.5, 1.5, 2.5, 3.5):
                for nt in notes:
                    add(out, tb + k * beat, epiano(midi(nt + 12), beat * 0.4, 0.07))
        elif style == 'sad':
            for i, nt in enumerate(notes + [notes[1] + 12]):
                add(out, tb + i * beat, musicbox(midi(nt + 12), 1.5, 0.08))
            add(out, tb, pad(midi(root), bar, 0.12))
        elif style == 'tense':
            pass
    if style == 'tense':
        t = np.arange(n) / SR
        drone = sum(np.sin(2 * np.pi * midi(38) * k * t) / k for k in range(1, 9))
        drone = lowpass(drone, 600) * 0.18
        trem = sum(np.sin(2 * np.pi * midi(m2) * t) for m2 in (74, 75, 81)) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t)) * 0.025
        out += (drone + trem) * np.clip(t / 0.6, 0, 1)
        hb = sfx_heartbeat({'dur': d + 0.5})
        add(out, 0, hb, 0.8)
    out = out[: int((d + 0.6) * SR)]
    nf = len(out)
    fade_in = int(m.get('fadeIn', 0.04) * SR)
    fade_out = int(m.get('fadeOut', 0.25) * SR)
    stop = int(d * SR)
    env = np.ones(nf)
    if fade_in:
        env[:fade_in] = np.linspace(0, 1, fade_in)
    env[stop:] = 0
    fo0 = max(0, stop - fade_out)
    env[fo0:stop] *= np.linspace(1, 0, stop - fo0)
    out = out * env
    out = reverb(out, mix=0.18 if style not in ('night', 'romantic') else 0.3)
    return out * m.get('gain', 0.5)


# ---------------------------------------------------------------- mixdown
def main(skit):
    cues = json.loads((ROOT / 'build' / f'{skit}.cues.json').read_text())
    dur = cues['duration']
    n = int(SR * (dur + 0.2))
    voice_l, voice_r = np.zeros(n), np.zeros(n)
    fx = np.zeros(n)
    mus = np.zeros(n)
    for s in cues['voices']:
        v = syllable(s)
        pan = -0.2 if s['who'] == 'him' else 0.2
        v = fade_tail(v, 4)
        add(voice_l, s['t'], v, 1 - max(0, pan))
        add(voice_r, s['t'], v, 1 + min(0, pan))
    for c in cues['sfx']:
        fn = SFX.get(c['name'])
        if fn is None:
            print('unknown sfx', c['name'])
            continue
        add(fx, c['t'], fade_tail(fn(c), 10), c.get('gain', 1.0))
    for m in cues['music']:
        add(mus, m['t0'], render_music(m))
    # duck music under dialogue
    vabs = np.abs(voice_l + voice_r)
    win = int(0.08 * SR)
    venv = np.convolve(vabs, np.ones(win) / win, mode='same')
    duck = 1 - 0.55 * np.clip(venv / (venv.max() + 1e-9) * 4, 0, 1)
    mus *= duck
    fx = reverb(fx, mix=0.12, size=0.8)
    left = voice_l * 1.0 + fx * 0.8 + mus * 0.75
    right = voice_r * 1.0 + fx * 0.8 + mus * 0.75
    stereo = np.stack([left, right], axis=1)
    # loudness: normalise RMS of the loud parts, then soft-limit
    rms = np.sqrt(np.mean(stereo ** 2) + 1e-12)
    stereo *= 0.16 / rms
    stereo = np.tanh(stereo * 1.1) / np.tanh(1.1)
    peak = np.max(np.abs(stereo))
    if peak > 0.97:
        stereo *= 0.97 / peak
    fade = int(0.08 * SR)
    stereo[-fade:] *= np.linspace(1, 0, fade)[:, None]
    pcm = (stereo * 32767).astype('<i2')
    out = ROOT / 'build' / f'{skit}.wav'
    import wave
    with wave.open(str(out), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print('wrote', out, f'{dur:.1f}s')


if __name__ == '__main__':
    main(sys.argv[1])
