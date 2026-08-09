#!/usr/bin/env python3
"""Synthesises every audio asset for the three TASCAM Sonicview reels.

Nothing here calls an external service. The music bed and the whole SFX
palette are generated from scratch with numpy/scipy (biquad filters,
envelopes, comb-filter reverb, stereo widening), then encoded to MP3 with
ffmpeg. Run this BEFORE any scene code references a cue name:

    python3 scripts/gen_audio.py
    python3 scripts/audit_audio.py

Sonic identity follows the creative brief's Section 10 music direction:
ambient electronic / modern industrial / cinematic IDM. Deep sweeping analog
synthesizers stand in for the Class 1 HDIA preamp warmth; highly quantized
ticking percussion stands in for 96 kHz digital clocking and Dante IP
packets. The same instrument set, key and tempo are used for all three parts
so the series reads as one score -- only the energy contour changes.
"""
import math
import os
import shutil
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = os.environ.get(
    "SONICVIEW_WAV_DIR",
    "/tmp/claude-0/-home-user/0e819879-0732-5152-8fe9-14ac7391b2c6/scratchpad/sv_wav",
)
os.makedirs(SCRATCH, exist_ok=True)

SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
VO_DIR = os.path.join(ROOT, "public", "vo")
os.makedirs(SFX_DIR, exist_ok=True)
os.makedirs(VO_DIR, exist_ok=True)

rng = np.random.default_rng(2110)


def find_ffmpeg() -> str:
    env = os.environ.get("FFMPEG_BIN")
    if env and os.path.exists(env):
        return env
    which = shutil.which("ffmpeg")
    if which:
        return which
    for base in (
        "/tmp/claude-0/-home-user/0e819879-0732-5152-8fe9-14ac7391b2c6/scratchpad",
        ROOT,
    ):
        p = os.path.join(base, "node_modules", "@ffmpeg-installer", "linux-x64", "ffmpeg")
        if os.path.exists(p):
            return p
    raise SystemExit("ffmpeg not found; set FFMPEG_BIN")


FFMPEG = find_ffmpeg()


# ---------------------------------------------------------------------------
# DSP helpers
# ---------------------------------------------------------------------------
def t(n):
    return np.arange(n) / SR


def noise(n):
    return rng.standard_normal(n)


def _bq(fc, q, kind):
    fc = float(np.clip(fc, 20.0, SR / 2 * 0.97))
    w = 2 * math.pi * fc / SR
    al = math.sin(w) / (2 * q)
    c = math.cos(w)
    a0 = 1 + al
    if kind == "lp":
        b = [(1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0]
    elif kind == "hp":
        b = [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0]
    else:  # bp
        b = [al / a0, 0.0, -al / a0]
    return b, [1.0, -2 * c / a0, (1 - al) / a0]


def lpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "lp")
    return lfilter(b, a, x)


def hpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "hp")
    return lfilter(b, a, x)


def bpf(x, fc, q=2.0):
    b, a = _bq(fc, q, "bp")
    return lfilter(b, a, x)


def expd(n, tau):
    return np.exp(-t(n) / tau)


def sine(f, n, phase=0.0):
    if np.isscalar(f):
        f = np.full(n, float(f))
    return np.sin(2 * np.pi * np.cumsum(f / SR) + phase)


def saw(f, n, partials=12, det=0.0):
    if np.isscalar(f):
        f = np.full(n, float(f))
    ph = np.cumsum(f / SR)
    o = np.zeros(n)
    for k in range(1, partials + 1):
        o += np.sin(2 * np.pi * k * (ph + det * k * 0.0009)) / k
    return o * 0.5


def tri(f, n):
    if np.isscalar(f):
        f = np.full(n, float(f))
    ph = np.cumsum(f / SR)
    o = np.zeros(n)
    for k in range(1, 9, 2):
        o += ((-1) ** ((k - 1) // 2)) * np.sin(2 * np.pi * k * ph) / (k * k)
    return o * 0.8


def comb_verb(x, taps=((0.0297, 0.42), (0.0371, 0.36), (0.0411, 0.31), (0.0537, 0.26)), wet=0.34):
    y = np.zeros_like(x)
    for d, g in taps:
        di = int(d * SR)
        if di >= len(x):
            continue
        buf = np.zeros_like(x)
        buf[di:] = x[:-di]
        fb = lfilter([g], [1.0, -g * 0.62], buf)
        y += fb
    y = lpf(y, 5200)
    return x * (1 - wet) + y * (wet / max(1, len(taps)) * 2.2)


def stereo(x, width=0.22, pre=0.010):
    d = int(pre * SR)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x.copy()
    return np.stack(
        [x * (1 - width * 0.5) + r * width * 0.5, r * (1 - width * 0.5) + x * width * 0.5], 1
    )


def fade(x, inS=0.004, outS=0.02):
    n = len(x)
    a = min(int(inS * SR), n)
    b = min(int(outS * SR), n)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def wr(name, x):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = np.clip(x, -1, 1)
    d = (x * 32767).astype("<i2")
    p = os.path.join(SCRATCH, name + ".wav")
    with wave.open(p, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(d.tobytes())
    return p


def sfx(name, x, norm=0.86, width=0.22):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1:
        x = fade(x.copy())
        m = np.abs(x).max()
        if m > 0:
            x = x / m * norm
        x = stereo(x, width)
    else:
        m = np.abs(x).max()
        if m > 0:
            x = x / m * norm
    wr(name, x)
    return name


# ---------------------------------------------------------------------------
# SFX PALETTE
# ---------------------------------------------------------------------------
def build_sfx():
    names = []

    # -- quantized clock ticks: the 96 kHz / Dante packet motif ---------------
    for nm, fc, dur, q in (("tick", 3200, 0.055, 5.0), ("tick-hi", 6400, 0.040, 6.5)):
        n = int(dur * SR)
        x = bpf(noise(n), fc, q) * expd(n, dur * 0.22)
        x += sine(fc * 1.5, n) * expd(n, dur * 0.10) * 0.35
        names.append(sfx(nm, x, 0.62, width=0.10))

    # -- motorized fader snap: mechanical, damped ---------------------------
    n = int(0.13 * SR)
    x = bpf(noise(n), 1750, 3.0) * expd(n, 0.016)
    x += bpf(noise(n), 520, 4.0) * expd(n, 0.045) * 0.7
    x += sine(190, n) * expd(n, 0.030) * 0.45
    names.append(sfx("fader-snap", x, 0.80, width=0.14))

    # -- UI click ------------------------------------------------------------
    n = int(0.048 * SR)
    x = bpf(noise(n), 2600, 4.0) * expd(n, 0.010) + sine(1500, n) * expd(n, 0.007) * 0.5
    names.append(sfx("click-ui", x, 0.55, width=0.08))

    # -- deep impact (hero reveal) ------------------------------------------
    n = int(1.5 * SR)
    f = np.concatenate([np.linspace(120, 44, int(0.16 * SR)), np.full(n - int(0.16 * SR), 44)])
    x = sine(f, n) * expd(n, 0.34)
    x += sine(f * 2, n) * expd(n, 0.12) * 0.35
    x += lpf(noise(n), 900) * expd(n, 0.055) * 0.5
    names.append(sfx("impact-deep", comb_verb(x, wet=0.22), 0.92, width=0.16))

    # -- mid impact (section change) ----------------------------------------
    n = int(1.0 * SR)
    x = sine(np.linspace(210, 88, n), n) * expd(n, 0.20)
    x += bpf(noise(n), 1200, 1.4) * expd(n, 0.045) * 0.6
    names.append(sfx("impact-mid", comb_verb(x, wet=0.24), 0.84))

    # -- soft impact (beat accent) ------------------------------------------
    n = int(0.55 * SR)
    x = sine(np.linspace(240, 120, n), n) * expd(n, 0.11)
    x += bpf(noise(n), 2000, 2.0) * expd(n, 0.020) * 0.45
    names.append(sfx("impact-soft", x, 0.70))

    # -- air whoosh (whip transition) ---------------------------------------
    n = int(0.62 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.7
    sweep = np.linspace(380, 5200, n)
    x = bpf(noise(n), 1800, 0.7) * env
    x = x * 0.6 + bpf(noise(n), 1.0, 0.9) * 0
    y = np.zeros(n)
    for i in range(0, n, 512):
        seg = slice(i, min(i + 512, n))
        y[seg] = bpf(noise(seg.stop - seg.start), float(sweep[i]), 1.1)
    x = (x + y * 0.9) * env
    names.append(sfx("whoosh-air", x, 0.66, width=0.34))

    # -- reverse whoosh (pre-cut lift) --------------------------------------
    n = int(0.7 * SR)
    env = np.linspace(0, 1, n) ** 2.4
    sweep = np.linspace(600, 4800, n)
    y = np.zeros(n)
    for i in range(0, n, 512):
        seg = slice(i, min(i + 512, n))
        y[seg] = bpf(noise(seg.stop - seg.start), float(sweep[i]), 1.3)
    names.append(sfx("whoosh-rev", y * env, 0.62, width=0.36))

    # -- data sweep (FPGA signal-flow lines) --------------------------------
    n = int(0.9 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.2
    f = np.linspace(300, 3400, n)
    x = saw(f, n, partials=7) * env * 0.5
    x += bpf(noise(n), 5000, 1.0) * env * 0.35
    x = hpf(x, 240)
    names.append(sfx("data-sweep", comb_verb(x, wet=0.28), 0.62, width=0.40))

    # -- power relay (dp failover) ------------------------------------------
    n = int(0.30 * SR)
    x = bpf(noise(n), 900, 2.2) * expd(n, 0.010)
    x += sine(96, n) * expd(n, 0.055) * 0.8
    x2 = np.zeros(n)
    off = int(0.055 * SR)
    x2[off:] = (bpf(noise(n - off), 1400, 3.0) * expd(n - off, 0.008)) * 0.7
    names.append(sfx("relay", x + x2, 0.82, width=0.12))

    # -- network ping (Dante packet) ----------------------------------------
    n = int(0.42 * SR)
    x = sine(1860, n) * expd(n, 0.055)
    x += sine(2790, n) * expd(n, 0.030) * 0.4
    names.append(sfx("net-ping", comb_verb(x, wet=0.34), 0.52, width=0.28))

    # -- expansion card slide-in --------------------------------------------
    n = int(0.75 * SR)
    env = np.concatenate([np.linspace(0.15, 1.0, int(n * 0.72)), np.linspace(1.0, 0, n - int(n * 0.72))])
    x = bpf(noise(n), 1150, 0.9) * env * 0.55
    seat = np.zeros(n)
    s0 = int(n * 0.80)
    seat[s0:] = bpf(noise(n - s0), 700, 3.2) * expd(n - s0, 0.014) * 1.6
    seat[s0:] += sine(130, n - s0) * expd(n - s0, 0.030) * 0.9
    names.append(sfx("card-slide", x + seat, 0.78, width=0.16))

    # -- analog swell (preamp warmth / product reveal) ----------------------
    n = int(2.2 * SR)
    env = np.sin(np.linspace(0, np.pi * 0.92, n)) ** 1.5
    cut = np.linspace(260, 3200, n)
    x = saw(np.full(n, 87.31), n, partials=14, det=0.5) * 0.5
    x += saw(np.full(n, 130.81), n, partials=12, det=-0.4) * 0.34
    y = np.zeros(n)
    for i in range(0, n, 1024):
        seg = slice(i, min(i + 1024, n))
        y[seg] = lpf(x[seg], float(cut[i]), 0.9)
    names.append(sfx("swell", comb_verb(y * env, wet=0.30), 0.72, width=0.30))

    # -- riser ---------------------------------------------------------------
    n = int(1.8 * SR)
    env = np.linspace(0, 1, n) ** 2.0
    f = np.exp(np.linspace(math.log(180), math.log(2400), n))
    x = saw(f, n, partials=9) * 0.45 + bpf(noise(n), 3000, 0.8) * 0.4
    trem = 0.72 + 0.28 * np.sin(2 * np.pi * np.cumsum(np.linspace(5, 26, n)) / SR)
    names.append(sfx("riser", hpf(x * env * trem, 160), 0.70, width=0.38))

    # -- sub drop ------------------------------------------------------------
    n = int(1.7 * SR)
    x = sine(np.exp(np.linspace(math.log(140), math.log(31), n)), n) * expd(n, 0.42)
    names.append(sfx("sub-drop", x, 0.90, width=0.06))

    # -- shimmer (CTA lift) --------------------------------------------------
    n = int(2.0 * SR)
    x = np.zeros(n)
    for k, g in ((1567.98, 1.0), (2093.0, 0.7), (3135.96, 0.5), (4186.01, 0.32)):
        x += sine(k, n) * expd(n, 0.55) * g
    x *= 0.5 + 0.5 * np.sin(2 * np.pi * 6.5 * t(n))
    names.append(sfx("shimmer", comb_verb(x, wet=0.42), 0.46, width=0.44))

    # -- final chime (outro) -------------------------------------------------
    n = int(2.6 * SR)
    x = np.zeros(n)
    for k, g, tau in ((523.25, 1.0, 0.85), (784.0, 0.62, 0.70), (1046.5, 0.42, 0.55), (1568.0, 0.22, 0.40)):
        x += sine(k, n) * expd(n, tau) * g
    names.append(sfx("chime-final", comb_verb(x, wet=0.40), 0.60, width=0.36))

    return names


# ---------------------------------------------------------------------------
# MUSIC BED
# ---------------------------------------------------------------------------
DUR = 88.0
BPM = 90.0
BEAT = 60.0 / BPM          # 0.6667 s
BAR = BEAT * 4             # 2.6667 s -> 33 bars in exactly 88 s

# Fm - Db - Ab - Eb.  Minor, unresolved, broadcast-serious.
PROG = [
    [87.31, 103.83, 130.81],   # Fm
    [69.30, 87.31, 103.83],    # Db
    [103.83, 130.81, 155.56],  # Ab
    [77.78, 98.00, 116.54],    # Eb
]

# (start_s, end_s, energy, brightness, ticks, pulse)
CONTOURS = {
    1: [  # THE HUB - statement open, build through 16XP/24XP, dp lift, settle
        (0.0, 6.0, 0.92, 1.30, True, True),
        (6.0, 22.0, 0.66, 1.00, True, True),
        (22.0, 40.0, 0.78, 0.94, True, True),
        (40.0, 52.0, 0.58, 0.80, True, False),   # FPGA / latency - pull back
        (52.0, 68.0, 0.86, 1.08, True, True),    # 24XP scale
        (68.0, 78.0, 0.94, 1.18, True, True),    # dp redundancy peak
        (78.0, 88.0, 0.70, 1.06, True, True),    # continuation + outro
    ],
    2: [  # THE NETWORK - mid open, Dante build, SB-16D peak, case-study warmth
        (0.0, 6.0, 0.84, 1.18, True, True),
        (6.0, 20.0, 0.62, 1.02, True, True),
        (20.0, 38.0, 0.80, 1.10, True, True),    # Dante topology
        (38.0, 56.0, 0.90, 1.00, True, True),    # SB-16D deployment peak
        (56.0, 72.0, 0.68, 0.86, True, True),    # case studies - warmer, calmer
        (72.0, 88.0, 0.74, 1.08, True, True),
    ],
    3: [  # THE PROTOCOL LAYER - minimal ticking precision, lift only at close
        (0.0, 6.0, 0.86, 1.22, True, True),
        (6.0, 18.0, 0.52, 0.90, True, False),    # dense technical data
        (18.0, 40.0, 0.60, 0.86, True, True),
        (40.0, 60.0, 0.64, 0.92, True, True),
        (60.0, 74.0, 0.80, 1.06, True, True),
        (74.0, 88.0, 0.92, 1.24, True, True),    # close of series - full lift
    ],
}


def contour_at(part, ts, idx):
    for s, e, en, br, tk, pl in CONTOURS[part]:
        if s <= ts < e:
            return (en, br, tk, pl)[idx]
    last = CONTOURS[part][-1]
    return (last[2], last[3], last[4], last[5])[idx]


def build_bed(part: int) -> str:
    n = int(DUR * SR)
    ts = t(n)

    energy = np.array([contour_at(part, x, 0) for x in ts[:: 512]])
    bright = np.array([contour_at(part, x, 1) for x in ts[:: 512]])
    energy = np.interp(ts, ts[:: 512], energy)
    bright = np.interp(ts, ts[:: 512], bright)
    # smooth the contour so section changes glide instead of stepping
    energy = lpf(energy, 0.6)
    bright = lpf(bright, 0.6)

    pad = np.zeros(n)
    sub = np.zeros(n)
    arp = np.zeros(n)

    nbars = int(math.ceil(DUR / BAR))
    for b in range(nbars):
        s0 = int(b * BAR * SR)
        s1 = min(int((b + 1) * BAR * SR), n)
        if s0 >= n:
            break
        m = s1 - s0
        chord = PROG[b % 4]
        seg_env = np.minimum(
            np.linspace(0, 1, max(1, int(0.35 * SR)))[: m].tolist()
            + [1.0] * max(0, m - int(0.35 * SR)),
            1.0,
        )
        seg_env = np.asarray(seg_env[:m], dtype=float)
        if len(seg_env) < m:
            seg_env = np.pad(seg_env, (0, m - len(seg_env)), constant_values=1.0)

        # sweeping detuned-saw pad
        v = np.zeros(m)
        for j, f0 in enumerate(chord):
            v += saw(np.full(m, f0 * 2), m, partials=11, det=(j - 1) * 0.8) * (0.42 - j * 0.06)
            v += saw(np.full(m, f0 * 2 * 1.005), m, partials=9, det=(1 - j) * 0.6) * (0.26 - j * 0.04)
        pad[s0:s1] += v * seg_env

        # sub / root
        sub[s0:s1] += sine(np.full(m, chord[0]), m) * 0.55 * seg_env
        sub[s0:s1] += sine(np.full(m, chord[0] * 0.5), m) * 0.22 * seg_env

        # sparse quantized pluck on the off-beats
        for k in (2, 5, 7, 11, 13):
            off = int(k * (BEAT / 4) * SR)
            if off >= m:
                continue
            ln = min(int(0.30 * SR), m - off)
            note = chord[(b + k) % 3] * 4
            arp[s0 + off : s0 + off + ln] += (
                tri(np.full(ln, note), ln) * expd(ln, 0.055) * 0.30
            )

    # time-varying low-pass on the pad -> the "deep sweeping analog" motif
    padf = np.zeros(n)
    step = 2048
    for i in range(0, n, step):
        seg = slice(i, min(i + step, n))
        fc = 320.0 + 2300.0 * float(bright[i]) * (0.45 + 0.55 * float(energy[i]))
        padf[seg] = lpf(pad[seg], fc, 0.85)
    pad = padf

    # ---- highly quantized 16th-note ticking (digital clocking / IP packets)
    tickbus = np.zeros(n)
    step16 = BEAT / 4
    k = 0
    while k * step16 < DUR:
        pos = int(k * step16 * SR)
        if pos >= n:
            break
        if contour_at(part, k * step16, 2):
            sixteenth = k % 4
            accent = 1.0 if sixteenth == 0 else (0.52 if sixteenth == 2 else 0.30)
            ln = min(int(0.045 * SR), n - pos)
            fc = 3000.0 + 2600.0 * float(bright[pos])
            tk = bpf(noise(ln), fc, 5.5) * expd(ln, 0.008) * accent
            tickbus[pos : pos + ln] += tk
        k += 1
    tickbus = hpf(tickbus, 1400)

    # ---- pulse: soft kick on 1 and 3
    pulse = np.zeros(n)
    k = 0
    while k * BEAT < DUR:
        pos = int(k * BEAT * SR)
        if pos >= n:
            break
        if contour_at(part, k * BEAT, 3) and k % 2 == 0:
            ln = min(int(0.42 * SR), n - pos)
            body = sine(np.linspace(115, 46, ln), ln) * expd(ln, 0.085)
            body += lpf(noise(ln), 700) * expd(ln, 0.012) * 0.30
            pulse[pos : pos + ln] += body * (1.0 if k % 8 == 0 else 0.78)
        k += 1

    # ---- control-room air
    air = hpf(noise(n), 5200) * 0.020
    air *= 0.55 + 0.45 * np.sin(2 * np.pi * 0.055 * ts)

    # Energy shapes the mix aggressively: the brief asks the score to SWELL on
    # the consoles and pull back to "minimal ticking precision" on the dense
    # IF-Series data, so the harmonic layers duck hard at low energy while the
    # clock ticks stay present throughout — the ticking is the through-line.
    e = np.clip(energy, 0.0, 1.0) ** 1.5
    mix = (
        pad * 0.34 * (0.12 + 0.88 * e)
        + sub * 0.34 * (0.26 + 0.74 * e)
        + tickbus * 0.30 * (0.68 + 0.32 * e)
        + pulse * 0.34 * (0.10 + 0.90 * e)
        + arp * 0.26 * (0.08 + 0.92 * e)
        + air * (0.5 + 0.5 * bright)
    )
    mix = comb_verb(mix, wet=0.20)
    mix = hpf(mix, 28)

    # Bus compression: high threshold / low ratio, so it only tames transient
    # peaks instead of levelling the section-to-section dynamics back out.
    envf = lpf(np.abs(mix), 4.0)
    gain = 1.0 / (1.0 + 0.9 * np.maximum(0.0, envf - 0.42))
    mix = mix * gain

    # top & tail
    a = int(1.2 * SR)
    mix[:a] *= np.linspace(0, 1, a)
    r = int(2.4 * SR)
    mix[-r:] *= np.linspace(1, 0, r) ** 0.8

    m = np.abs(mix).max()
    if m > 0:
        mix = mix / m * 0.84

    st = stereo(mix, width=0.30, pre=0.014)
    name = f"music-bed-part{part}"
    wr(name, st)
    return name


def build_silence(name: str, dur: float) -> str:
    n = int(dur * SR)
    wr(name, np.zeros((n, 2)))
    return name


# ---------------------------------------------------------------------------
def encode(name: str, dest_dir: str, bitrate: str) -> str:
    src = os.path.join(SCRATCH, name + ".wav")
    dst = os.path.join(dest_dir, name + ".mp3")
    subprocess.run(
        [FFMPEG, "-v", "error", "-y", "-i", src, "-codec:a", "libmp3lame",
         "-b:a", bitrate, "-ar", "48000", "-ac", "2", dst],
        check=True,
    )
    return dst


def main():
    print(f"ffmpeg: {FFMPEG}")
    print("\n== SFX ==")
    names = build_sfx()
    for nm in names:
        p = encode(nm, SFX_DIR, "192k")
        print(f"  {nm:<14s} -> {os.path.getsize(p):>7d} B")

    print("\n== MUSIC BEDS ==")
    for part in (1, 2, 3):
        nm = build_bed(part)
        p = encode(nm, SFX_DIR, "224k")
        print(f"  {nm:<20s} -> {os.path.getsize(p):>8d} B")

    print("\n== VO PLACEHOLDERS (silent) ==")
    for part in (1, 2, 3):
        nm = f"voiceover-reel-part{part}"
        build_silence(nm, DUR)
        p = encode(nm, VO_DIR, "128k")
        print(f"  {nm:<26s} -> {os.path.getsize(p):>7d} B")

    print("\nOK")


if __name__ == "__main__":
    sys.exit(main())
