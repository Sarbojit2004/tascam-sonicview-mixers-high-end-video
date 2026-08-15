#!/usr/bin/env python3
"""Synthesises every audio asset for the 80th Independence Day reel.

Nothing here calls an external service. The music bed, the constant ambient
texture layer and the whole SFX palette are generated from scratch with
numpy/scipy — Karplus-Strong plucked strings, biquad filters, envelopes,
comb-filter reverb, inharmonic bell partials, stereo widening — then encoded
to MP3 with ffmpeg. Run this BEFORE any scene code references a cue name:

    python3 scripts/gen_audio.py
    python3 scripts/audit_audio.py

MUSIC DIRECTION — modern-classical hybrid.
Built on Raga Desh, the raga traditionally carried by India's patriotic song
repertoire, over a tanpura drone in D. Desh is a Khamaj-thaat raga using the
natural seventh in ascent and the flat seventh in descent, which is what gives
the bed its warm, unforced lift rather than a minor-key seriousness:

    aroha    S  R  M  P  N  S'      (0  2  5  7  11 12)
    avaroha  S' n  D  P  M  G  R  S (12 10 9  7  5  4  2  0)

Synth layers, all originally generated: tanpura drone (Karplus-Strong, tuned
Pa-Sa-Sa-Sa_), sitar-register plucks, a breathy bansuri-register lead playing
real Desh phrases, tabla/dholak membrane percussion on an eight-beat Keherwa
cycle, and an orchestral string pad plus low brass stack carrying the
patriotic swells. The same instrument set runs the whole 60 s; only the energy
contour changes, so the reel reads as one score.

AMBIENT LAYER.
public/audio/sfx/ambient-bed.mp3 is a separate, continuous 60.000 s texture
that plays underneath the music for the entire runtime — a low tanpura
shimmer, slow moving air and a distant bell resonance. It is deliberately its
own file rather than being folded into the music bed so the "constant subtle
ambient presence" requirement is explicit and independently auditable.
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
    "IND80_WAV_DIR",
    "/tmp/claude-0/-home-user/91116a77-8d20-5e00-9928-f6519973d8de/scratchpad/ind80_wav",
)
os.makedirs(SCRATCH, exist_ok=True)

SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
os.makedirs(SFX_DIR, exist_ok=True)

rng = np.random.default_rng(1947)

DUR = 60.0                 # the reel is exactly 60.000 s / 1800 frames
BPM = 96.0
BEAT = 60.0 / BPM          # 0.625 s
BAR = BEAT * 4             # 2.5 s -> exactly 24 bars in 60 s
SA = 146.83                # tonic Sa = D3


def find_bin(name: str) -> str:
    env = os.environ.get(name.upper() + "_BIN")
    if env and os.path.exists(env):
        return env
    which = shutil.which(name)
    if which:
        return which
    pkg = "@ffmpeg-installer" if name == "ffmpeg" else "@ffprobe-installer"
    for base in (
        ROOT,
        "/tmp/claude-0/-home-user/91116a77-8d20-5e00-9928-f6519973d8de/scratchpad",
    ):
        p = os.path.join(base, "node_modules", pkg, "linux-x64", name)
        if os.path.exists(p):
            return p
    raise SystemExit(f"{name} not found; set {name.upper()}_BIN")


FFMPEG = find_bin("ffmpeg")


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
    else:
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
        y += lfilter([g], [1.0, -g * 0.62], buf)
    y = lpf(y, 5200)
    return x * (1 - wet) + y * (wet / max(1, len(taps)) * 2.2)


def hall(x, wet=0.42):
    """Longer, darker tail — for temple bells and the closing chord."""
    return comb_verb(
        x,
        taps=((0.0431, 0.52), (0.0673, 0.46), (0.0891, 0.40), (0.1187, 0.33), (0.1523, 0.27)),
        wet=wet,
    )


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


def karplus(f, n, decay=0.9975, damp=0.5, bright=0.0, seed=0):
    """Block-wise Karplus-Strong plucked string.

    The recurrence is advanced one period at a time with numpy rather than
    sample by sample, which is what makes a 60 s tanpura drone (dozens of
    overlapping 4 s plucks) tractable in Python.

    `bright` mixes a little of the raw excitation back in so a sitar-register
    pluck keeps its attack transient instead of turning to pure tone.
    """
    N = max(2, int(round(SR / max(20.0, f))))
    loc = np.random.default_rng(1000 + seed)
    cur = loc.standard_normal(N)
    cur = cur - cur.mean()
    if bright > 0:
        cur = cur * (1 - bright) + np.sign(cur) * bright
    out = np.zeros(n)
    pos = 0
    while pos < n:
        m = min(N, n - pos)
        out[pos : pos + m] = cur[:m]
        prev = np.concatenate([[cur[-1]], cur[:-1]])
        cur = decay * (damp * cur + (1 - damp) * prev)
        pos += N
    return out


def add(dst, src, at):
    """Mix `src` into `dst` at sample offset `at`, clipped to bounds."""
    if at >= len(dst):
        return
    a = max(0, at)
    m = min(len(src) - (a - at), len(dst) - a)
    if m <= 0:
        return
    dst[a : a + m] += src[(a - at) : (a - at) + m]


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
# INSTRUMENT VOICES — shared by the cues and the music bed
# ---------------------------------------------------------------------------
def deg(semi: float, octave: int = 0) -> float:
    """Raga degree (semitones from Sa) -> Hz."""
    return SA * (2 ** ((semi + 12 * octave) / 12.0))


def v_sitar(f, dur, seed=0, gain=1.0, bend=0.0):
    """Plucked string in the sitar register, with optional meend (pitch bend)."""
    n = int(dur * SR)
    if bend:
        # a short glide into pitch, which is what makes a plucked Indian
        # string read as expressive rather than fretted
        gl = int(min(0.09, dur * 0.35) * SR)
        base = karplus(f, n, decay=0.9979, damp=0.48, bright=0.18, seed=seed)
        pre = karplus(f * (2 ** (bend / 12.0)), gl, decay=0.997, damp=0.5, bright=0.2, seed=seed + 7)
        base[:gl] = base[:gl] * np.linspace(0, 1, gl) + pre * np.linspace(1, 0, gl)
    else:
        base = karplus(f, n, decay=0.9979, damp=0.48, bright=0.18, seed=seed)
    body = hpf(base, 110) * expd(n, dur * 0.55)
    # sympathetic-string shimmer an octave up, very quiet
    symp = karplus(f * 2, n, decay=0.9965, damp=0.62, seed=seed + 31) * expd(n, dur * 0.30) * 0.16
    return fade((body + symp) * gain, 0.001, 0.03)


def v_tanpura(f, dur, seed=0, gain=1.0):
    """Long, slow-decaying drone pluck with a hint of jivari buzz."""
    n = int(dur * SR)
    x = karplus(f, n, decay=0.99935, damp=0.42, bright=0.06, seed=seed)
    x = hpf(x, 70)
    # jivari: the bridge buzz, a gentle waveshaping that adds upper partials
    x = x + 0.10 * np.tanh(x * 5.0) * expd(n, dur * 0.5)
    env = np.minimum(np.linspace(0, 1, n) * 60.0, 1.0) * expd(n, dur * 0.62)
    return fade(x * env * gain, 0.003, 0.10)


def v_bansuri(f, dur, gain=1.0, vib=4.6):
    """Breathy bamboo-flute register: sine core, blown noise, gentle vibrato."""
    n = int(dur * SR)
    tt = t(n)
    # vibrato arrives after the note settles, as a real player would
    depth = np.minimum(tt / max(0.18, dur * 0.35), 1.0) * 0.007
    fm = f * (1 + depth * np.sin(2 * np.pi * vib * tt))
    core = sine(fm, n) * 0.62 + sine(fm * 2, n) * 0.16 + sine(fm * 3, n) * 0.05
    breath = bpf(noise(n), f * 2.2, 1.1) * 0.16
    breath *= np.exp(-tt / 0.10) * 0.7 + 0.30
    atk = min(int(0.045 * SR), n)
    env = np.ones(n)
    env[:atk] = np.linspace(0, 1, atk) ** 1.4
    rel = min(int(0.13 * SR), n)
    env[-rel:] *= np.linspace(1, 0, rel) ** 0.8
    return (core + breath) * env * gain


def v_tabla(kind, gain=1.0):
    """Membrane hits. `dha`/`ge` are the bass bayan, `na`/`tin`/`ti` the dayan."""
    if kind in ("ge", "dha"):
        n = int(0.50 * SR)
        # bayan: the heel-of-hand pitch bend is the signature
        f = np.concatenate([np.linspace(112, 62, int(0.13 * SR)), np.full(n - int(0.13 * SR), 62)])
        x = sine(f, n) * expd(n, 0.16)
        x += sine(f * 1.6, n) * expd(n, 0.055) * 0.30
        x += lpf(noise(n), 620) * expd(n, 0.018) * 0.45
        if kind == "dha":
            # "dha" is both hands at once: bayan bass plus the ringing dayan
            add(x, v_tabla("na", 0.85), 0)
    elif kind == "na":
        n = int(0.30 * SR)
        # dayan rim: strongly pitched, ringing
        x = sine(560, n) * expd(n, 0.085) * 0.8
        x += sine(1120, n) * expd(n, 0.040) * 0.32
        x += sine(1680, n) * expd(n, 0.022) * 0.16
        x += bpf(noise(n), 2400, 3.0) * expd(n, 0.007) * 0.55
    elif kind == "tin":
        n = int(0.26 * SR)
        x = sine(760, n) * expd(n, 0.060) * 0.75
        x += sine(1520, n) * expd(n, 0.028) * 0.28
        x += bpf(noise(n), 3100, 3.4) * expd(n, 0.006) * 0.5
    else:  # "ti" / "ka" — damped, non-ringing
        n = int(0.11 * SR)
        x = bpf(noise(n), 1900, 2.2) * expd(n, 0.011) * 0.9
        x += sine(430, n) * expd(n, 0.014) * 0.35
    return x * gain


def v_dhol(gain=1.0):
    """Deep folk drum — the festival/dance beats sit on this."""
    n = int(0.62 * SR)
    f = np.concatenate([np.linspace(150, 74, int(0.09 * SR)), np.full(n - int(0.09 * SR), 74)])
    x = sine(f, n) * expd(n, 0.13)
    x += sine(f * 2, n) * expd(n, 0.045) * 0.28
    x += lpf(noise(n), 900) * expd(n, 0.020) * 0.55
    return x * gain


def v_bell(f0, dur, gain=1.0, partials=((1.0, 1.0), (2.03, 0.52), (2.98, 0.34), (4.21, 0.20), (5.62, 0.12))):
    """Struck metal — inharmonic partials, long decay. Temple bell / chime."""
    n = int(dur * SR)
    x = np.zeros(n)
    for mult, g in partials:
        x += sine(f0 * mult, n) * expd(n, dur * (0.42 / max(0.6, mult ** 0.7))) * g
    strike = bpf(noise(n), f0 * 4.5, 2.0) * expd(n, 0.006) * 0.35
    return (x + strike) * gain


# ---------------------------------------------------------------------------
# SFX PALETTE — one distinct character per beat transition
# ---------------------------------------------------------------------------
def build_sfx():
    names = []

    # -- conch (shankh): the opening call ------------------------------------
    n = int(2.4 * SR)
    tt = t(n)
    env = np.minimum(tt / 0.28, 1.0) * np.minimum(1.0, np.exp(-(tt - 1.5) / 0.55))
    env = np.clip(env, 0, 1)
    f = 233.0 * (1 + 0.010 * np.sin(2 * np.pi * 3.1 * tt) * np.minimum(tt / 0.6, 1.0))
    x = saw(f, n, partials=9) * 0.55 + sine(f * 2, n) * 0.18
    x += bpf(noise(n), 900, 0.8) * 0.22          # the breath in the tone
    x = bpf(x, 620, 0.9) + x * 0.45              # a broad formant
    names.append(sfx("conch", hall(x * env, 0.34), 0.84, width=0.30))

    # -- charkha: the spinning wheel of the freedom-struggle beat ------------
    n = int(1.9 * SR)
    tt = t(n)
    spin = 2.6 + 1.1 * np.minimum(tt / 0.9, 1.0)   # wheel picks up speed
    ph = np.cumsum(spin / SR)
    x = lpf(noise(n), 420) * 0.35                  # wooden rumble
    x *= 0.55 + 0.45 * np.sin(2 * np.pi * ph)
    creak = bpf(noise(n), 1250, 6.0) * (0.5 + 0.5 * np.sin(2 * np.pi * ph)) ** 6 * 0.55
    thread = bpf(noise(n), 3400, 4.0) * 0.10
    env = np.minimum(tt / 0.20, 1.0) * np.clip(np.exp(-(tt - 1.2) / 0.42), 0, 1)
    names.append(sfx("charkha", (x + creak + thread) * env, 0.66, width=0.20))

    # -- chain break: metallic parting ---------------------------------------
    n = int(1.25 * SR)
    x = np.zeros(n)
    stress = bpf(noise(int(0.22 * SR)), 700, 5.0) * np.linspace(0.1, 1.0, int(0.22 * SR)) * 0.5
    add(x, stress, 0)
    snap = bpf(noise(int(0.10 * SR)), 3200, 1.6) * expd(int(0.10 * SR), 0.010) * 1.4
    add(x, snap, int(0.21 * SR))
    for i, (fr, g, tau) in enumerate(((1830, 0.5, 0.30), (2740, 0.34, 0.22), (4110, 0.2, 0.16))):
        ln = int(0.85 * SR)
        add(x, sine(fr, ln) * expd(ln, tau) * g, int((0.215 + i * 0.006) * SR))
    names.append(sfx("chain-break", hall(x, 0.30), 0.86, width=0.24))

    # -- chakra ring: the 24-spoke wheel drawing itself ----------------------
    n = int(2.3 * SR)
    tt = t(n)
    x = v_bell(392.0, 2.3, 1.0)                     # struck metal core
    # 24 quantized ticks, one per spoke, accelerating as the wheel completes
    for k in range(24):
        pos = (k / 24.0) ** 0.72 * 1.55
        ln = int(0.05 * SR)
        tick = bpf(noise(ln), 5200 + k * 60, 6.0) * expd(ln, 0.006) * (0.20 + 0.012 * k)
        add(x, tick, int(pos * SR))
    x *= np.minimum(tt / 0.02, 1.0)
    names.append(sfx("chakra-ring", hall(x, 0.38), 0.72, width=0.30))

    # -- flag furl: cloth catching wind --------------------------------------
    n = int(1.5 * SR)
    tt = t(n)
    x = bpf(noise(n), 1500, 0.65)
    flap = np.zeros(n)
    for k, pos in enumerate((0.02, 0.19, 0.33, 0.51, 0.72, 0.98, 1.22)):
        ln = int(0.16 * SR)
        g = 1.0 - k * 0.10
        add(flap, bpf(noise(ln), 900 + k * 180, 1.4) * (np.sin(np.linspace(0, np.pi, ln)) ** 1.6) * g, int(pos * SR))
    env = np.minimum(tt / 0.08, 1.0) * np.clip(np.exp(-(tt - 0.9) / 0.40), 0, 1)
    names.append(sfx("flag-furl", (x * 0.35 + flap) * env, 0.64, width=0.42))

    # -- silk whoosh: the soft general transition ----------------------------
    n = int(0.72 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    sweep = np.linspace(420, 4200, n)
    y = np.zeros(n)
    for i in range(0, n, 512):
        seg = slice(i, min(i + 512, n))
        y[seg] = bpf(noise(seg.stop - seg.start), float(sweep[i]), 1.0)
    y += bpf(noise(n), 2400, 0.6) * 0.4
    names.append(sfx("whoosh-silk", y * env, 0.60, width=0.40))

    # -- air whoosh: brighter, faster cut ------------------------------------
    n = int(0.52 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 2.0
    sweep = np.linspace(900, 7200, n)
    y = np.zeros(n)
    for i in range(0, n, 512):
        seg = slice(i, min(i + 512, n))
        y[seg] = bpf(noise(seg.stop - seg.start), float(sweep[i]), 1.3)
    names.append(sfx("whoosh-air", hpf(y * env, 300), 0.58, width=0.44))

    # -- wind at altitude: the Himalaya beat ---------------------------------
    n = int(2.0 * SR)
    tt = t(n)
    base = bpf(noise(n), 700, 0.5) * 0.5
    gust = np.zeros(n)
    for i in range(0, n, 1024):
        seg = slice(i, min(i + 1024, n))
        fc = 500 + 1400 * (0.5 + 0.5 * math.sin(2 * math.pi * 0.42 * (i / SR)))
        gust[seg] = bpf(noise(seg.stop - seg.start), fc, 0.9)
    env = np.minimum(tt / 0.25, 1.0) * np.clip(np.exp(-(tt - 1.1) / 0.55), 0, 1)
    names.append(sfx("wind-peak", (base + gust * 0.7) * env, 0.56, width=0.46))

    # -- flowing water: the rivers beat --------------------------------------
    n = int(1.9 * SR)
    tt = t(n)
    x = hpf(noise(n), 1500) * 0.4
    for i in range(0, n, 2048):
        seg = slice(i, min(i + 2048, n))
        fc = 2200 + 1500 * math.sin(2 * math.pi * 0.7 * (i / SR))
        x[seg] = bpf(x[seg], fc, 0.8) * 1.6
    trickle = np.zeros(n)
    for k in range(26):
        pos = rng.random() * 1.6
        ln = int(0.05 * SR)
        add(trickle, sine(1500 + rng.random() * 2200, ln) * expd(ln, 0.008) * 0.16, int(pos * SR))
    env = np.minimum(tt / 0.20, 1.0) * np.clip(np.exp(-(tt - 1.0) / 0.50), 0, 1)
    names.append(sfx("water-flow", (x + trickle) * env, 0.52, width=0.44))

    # -- stone set: the architecture reveal, percussive and weighted ---------
    n = int(1.7 * SR)
    x = sine(np.concatenate([np.linspace(150, 52, int(0.10 * SR)), np.full(n - int(0.10 * SR), 52)]), n)
    x *= expd(n, 0.26)
    grit = lpf(noise(n), 1400) * expd(n, 0.030) * 0.60
    dust = hpf(noise(n), 3000) * expd(n, 0.16) * 0.10
    names.append(sfx("stone-set", hall(x + grit + dust, 0.26), 0.92, width=0.18))

    # -- ghungroo: the dancer's ankle bells ----------------------------------
    n = int(1.3 * SR)
    x = np.zeros(n)
    for k in range(150):
        pos = (rng.random() ** 0.62) * 0.95
        ln = int(0.10 * SR)
        fr = 3600 + rng.random() * 3600
        one = sine(fr, ln) * expd(ln, 0.020) + sine(fr * 1.47, ln) * expd(ln, 0.013) * 0.5
        add(x, one * (0.05 + rng.random() * 0.09), int(pos * SR))
    names.append(sfx("ghungroo", hall(hpf(x, 2200), 0.34), 0.62, width=0.42))

    # -- sitar pluck (single, expressive) ------------------------------------
    x = v_sitar(deg(0, 1), 1.9, seed=3, bend=-2.0)
    names.append(sfx("sitar-pluck", hall(x, 0.30), 0.74, width=0.26))

    # -- tabla hits ----------------------------------------------------------
    names.append(sfx("tabla-na", comb_verb(v_tabla("na"), wet=0.20), 0.76, width=0.14))
    names.append(sfx("tabla-tin", comb_verb(v_tabla("tin"), wet=0.20), 0.72, width=0.16))
    names.append(sfx("dhol-hit", comb_verb(v_dhol(), wet=0.22), 0.90, width=0.16))

    # -- temple bell ---------------------------------------------------------
    names.append(sfx("bell-temple", hall(v_bell(294.0, 3.4), 0.46), 0.70, width=0.34))

    # -- bansuri swell: the soft lift into a contemplative beat --------------
    n = int(2.0 * SR)
    x = v_bansuri(deg(7), 2.0, 1.0)                      # Pa
    add(x, v_bansuri(deg(11), 1.15, 0.75), int(0.85 * SR))  # ...to Ni
    env = np.minimum(t(n) / 0.35, 1.0)
    names.append(sfx("bansuri-swell", hall(x * env, 0.36), 0.70, width=0.32))

    # -- tanpura riser: the pre-cut lift -------------------------------------
    n = int(1.9 * SR)
    env = np.linspace(0, 1, n) ** 2.1
    f = np.exp(np.linspace(math.log(200), math.log(2100), n))
    x = saw(f, n, partials=8) * 0.42
    x += bpf(noise(n), 2800, 0.8) * 0.32
    drone = v_tanpura(deg(0), 1.9, seed=5, gain=0.5)[:n]
    trem = 0.70 + 0.30 * np.sin(2 * np.pi * np.cumsum(np.linspace(4, 22, n)) / SR)
    names.append(sfx("riser-tanpura", hpf((x * trem + drone) * env, 150), 0.72, width=0.40))

    # -- deep impact ---------------------------------------------------------
    n = int(1.6 * SR)
    f = np.concatenate([np.linspace(118, 41, int(0.17 * SR)), np.full(n - int(0.17 * SR), 41)])
    x = sine(f, n) * expd(n, 0.36)
    x += sine(f * 2, n) * expd(n, 0.13) * 0.32
    x += lpf(noise(n), 850) * expd(n, 0.050) * 0.45
    names.append(sfx("impact-deep", comb_verb(x, wet=0.22), 0.94, width=0.16))

    # -- gold shimmer: the wish ---------------------------------------------
    n = int(2.6 * SR)
    x = np.zeros(n)
    for mult, g in ((1.0, 1.0), (1.5, 0.62), (2.0, 0.46), (3.0, 0.28), (4.0, 0.16)):
        x += sine(deg(7, 1) * mult, n) * expd(n, 0.72) * g
    x *= 0.55 + 0.45 * np.sin(2 * np.pi * 5.8 * t(n))
    names.append(sfx("shimmer-gold", hall(x, 0.46), 0.50, width=0.46))

    # -- closing chime: a consonant Desh triad, long tail --------------------
    n = int(3.6 * SR)
    x = np.zeros(n)
    for i, (d, g) in enumerate(((0, 1.0), (7, 0.66), (12, 0.46), (16, 0.26))):
        one = v_bell(deg(d, 1), 3.6, g)
        add(x, one, int(i * 0.055 * SR))
    names.append(sfx("chime-close", hall(x, 0.50), 0.66, width=0.38))

    return names


# ---------------------------------------------------------------------------
# CONSTANT AMBIENT BED — 60.000 s, plays under everything, never silent
# ---------------------------------------------------------------------------
def build_ambient() -> str:
    n = int(DUR * SR)
    tt = t(n)

    # 1. tanpura shimmer — overlapping long drone plucks on Sa and Pa, heavily
    #    filtered so it reads as resonance rather than as a played instrument
    drone = np.zeros(n)
    cycle = [deg(7, -1), deg(0), deg(0), deg(0, -1)]   # Pa Sa Sa Sa_
    k = 0
    while k * 1.55 < DUR + 4:
        f = cycle[k % 4]
        one = v_tanpura(f, 4.6, seed=k, gain=0.62)
        add(drone, one, int(k * 1.55 * SR))
        k += 1
    drone = lpf(drone, 1500, 0.8)
    drone *= 0.72 + 0.28 * np.sin(2 * np.pi * 0.037 * tt)

    # 2. moving air — the room the whole reel sits in
    air = hpf(noise(n), 4200) * 0.030
    air_lf = np.zeros(n)
    for i in range(0, n, 4096):
        seg = slice(i, min(i + 4096, n))
        fc = 320 + 260 * math.sin(2 * math.pi * 0.031 * (i / SR))
        air_lf[seg] = lpf(noise(seg.stop - seg.start), fc) * 0.055
    air = air * (0.6 + 0.4 * np.sin(2 * np.pi * 0.048 * tt)) + air_lf

    # 3. distant bell resonance — sparse, far back in the field
    bells = np.zeros(n)
    for pos, d in ((3.2, 0), (17.6, 7), (31.4, -5), (44.8, 0), (56.1, 7)):
        bells_one = v_bell(deg(d, 0) * 2, 5.0, 0.30)
        add(bells, bells_one, int(pos * SR))
    bells = lpf(bells, 2600)

    mix = drone * 0.42 + air * 1.0 + bells * 0.22
    mix = hall(mix, 0.30)
    mix = hpf(mix, 34)

    # The bed must be genuinely CONSTANT — only the shortest possible top and
    # tail, so no frame of the 60 s runs dry.
    a = int(0.5 * SR)
    mix[:a] *= np.linspace(0, 1, a)
    r = int(0.7 * SR)
    mix[-r:] *= np.linspace(1, 0, r) ** 0.7

    m = np.abs(mix).max()
    if m > 0:
        mix = mix / m * 0.72
    wr("ambient-bed", stereo(mix, width=0.40, pre=0.017))
    return "ambient-bed"


# ---------------------------------------------------------------------------
# MUSIC BED — 60.000 s, Raga Desh, modern-classical hybrid
# ---------------------------------------------------------------------------
# (start_s, end_s, energy, brightness, percussion, lead)
CONTOUR = [
    (0.00, 5.67, 0.50, 1.24, False, True),   # B1  dawn & tricolour — drone + flute
    (5.67, 10.67, 0.60, 0.86, True, False),  # B2  1947 — low, resolute
    (10.67, 14.60, 0.70, 1.02, True, True),  # B3  the Chakra
    (14.60, 18.20, 0.58, 0.96, True, True),  # B4  Himalaya — open, airy
    (18.20, 21.93, 0.60, 0.98, True, True),  # B5  rivers
    (21.93, 25.67, 0.62, 1.00, True, True),  # B6  desert & coast
    (25.67, 30.00, 0.76, 0.94, True, True),  # B7  architecture — weight
    (30.00, 34.13, 0.90, 1.12, True, True),  # B8  dance — rhythmic peak
    (34.13, 37.87, 0.86, 1.08, True, True),  # B9  music
    (37.87, 41.80, 0.70, 1.00, True, True),  # B10 craft
    (41.80, 46.07, 0.96, 1.22, True, True),  # B11 festivals — full
    (46.07, 50.00, 0.78, 1.06, True, True),  # B12 languages
    (50.00, 54.00, 0.88, 1.12, True, True),  # B13 unity
    (54.00, 60.00, 0.94, 1.26, False, True), # B14 the wish — strings carry it
]

# Bansuri lead, as real Desh phrases. (bar, beat, degree, octave, beats-long)
# The pakad (R M P N S' / S' n D P) and the resolving descent D M G R S are
# what make the line legible as Desh rather than as a generic major melody.
LEAD = [
    # -- B1 dawn: a slow, open aroha
    (0, 0.0, 0, 0, 2.0), (0, 2.5, 2, 0, 1.5),
    (1, 0.5, 5, 0, 2.0), (1, 3.0, 7, 0, 1.0),
    # -- B3 the Chakra: the pakad, stated plainly
    (4, 1.0, 2, 0, 0.75), (4, 1.75, 5, 0, 0.75), (4, 2.5, 7, 0, 1.5),
    (5, 0.5, 11, 0, 1.0), (5, 1.5, 12, 0, 2.0),
    # -- B4/B5 land: the descent, unhurried
    (6, 0.5, 12, 0, 1.25), (6, 2.0, 10, 0, 1.0), (6, 3.0, 9, 0, 1.0),
    (7, 0.5, 7, 0, 1.5), (7, 2.5, 5, 0, 1.5),
    (8, 1.0, 7, 0, 1.0), (8, 2.5, 9, 0, 1.5),
    (9, 0.5, 7, 0, 1.0), (9, 2.0, 5, 0, 1.0), (9, 3.0, 4, 0, 1.0),
    # -- B6 coast: lifting again
    (10, 0.5, 2, 0, 1.0), (10, 2.0, 5, 0, 1.5),
    (11, 0.5, 7, 0, 1.5), (11, 2.5, 11, 0, 1.5),
    # -- B7 architecture: high, weighted
    (12, 0.5, 12, 0, 2.0), (12, 3.0, 14, 0, 1.0),
    (13, 0.5, 12, 0, 1.5), (13, 2.5, 9, 0, 1.5),
    # -- B8/B9 dance & music: the lead steps back for the percussion, then
    #    answers in the upper octave
    (15, 2.0, 7, 0, 1.0), (15, 3.0, 11, 0, 1.0),
    (16, 0.5, 12, 0, 1.5), (16, 2.5, 14, 0, 1.5),
    (17, 0.5, 12, 0, 1.0), (17, 2.0, 10, 0, 1.0), (17, 3.0, 9, 0, 1.0),
    # -- B10/B11 craft & festivals
    (18, 0.5, 7, 0, 1.5), (18, 2.5, 5, 0, 1.5),
    (19, 0.5, 4, 0, 1.0), (19, 2.0, 2, 0, 2.0),
    (20, 0.5, 5, 0, 1.0), (20, 2.0, 7, 0, 1.0), (20, 3.0, 11, 0, 1.0),
    (21, 0.5, 12, 0, 2.0), (21, 3.0, 11, 0, 1.0),
    # -- B12/B13 languages & unity: the aroha climbing to the octave
    (22, 0.5, 9, 0, 1.0), (22, 2.0, 7, 0, 1.0), (22, 3.0, 5, 0, 1.0),
    (23, 0.5, 7, 0, 1.5), (23, 2.5, 12, 0, 2.5),
]

# String pad: D - G - C - D, a Mixolydian loop that mirrors Desh's dual
# nishad (the C major is the komal-ni colour, the natural Ni lives in the lead).
PAD = [[0, 4, 7], [5, 9, 12], [10, 14, 17], [0, 4, 7]]

# Keherwa theka, eight beats: Dha Ge Na Ti | Na Ka Dhi Na
THEKA = ["dha", "ge", "na", "ti", "na", "ti", "tin", "na"]


def contour_at(ts, idx):
    for s, e, en, br, pc, ld in CONTOUR:
        if s <= ts < e:
            return (en, br, pc, ld)[idx]
    last = CONTOUR[-1]
    return (last[2], last[3], last[4], last[5])[idx]


def build_bed() -> str:
    n = int(DUR * SR)
    tt = t(n)

    energy = np.interp(tt, tt[::512], [contour_at(x, 0) for x in tt[::512]])
    bright = np.interp(tt, tt[::512], [contour_at(x, 1) for x in tt[::512]])
    energy = lpf(energy, 0.55)
    bright = lpf(bright, 0.55)

    # ---- tanpura drone: the constant the whole piece hangs off -------------
    drone = np.zeros(n)
    cycle = [deg(7, -1), deg(0), deg(0), deg(0, -1)]
    k = 0
    while k * 1.25 < DUR + 4:
        add(drone, v_tanpura(cycle[k % 4], 4.0, seed=100 + k, gain=0.66), int(k * 1.25 * SR))
        k += 1
    drone = lpf(drone, 2200, 0.8)

    # ---- sub / root --------------------------------------------------------
    sub = np.zeros(n)
    nbars = int(math.ceil(DUR / BAR))
    for b in range(nbars):
        s0 = int(b * BAR * SR)
        m = min(int(BAR * SR), n - s0)
        if m <= 0:
            break
        root = deg(PAD[b % 4][0], -1)
        env = np.minimum(np.arange(m) / (0.30 * SR), 1.0)
        sub[s0 : s0 + m] += sine(root, m) * 0.55 * env
        sub[s0 : s0 + m] += sine(root * 0.5, m) * 0.20 * env

    # ---- string pad + low brass stack (the patriotic swell) ---------------
    pad = np.zeros(n)
    brass = np.zeros(n)
    for b in range(nbars):
        s0 = int(b * BAR * SR)
        m = min(int(BAR * SR), n - s0)
        if m <= 0:
            break
        chord = PAD[b % 4]
        env = np.minimum(np.arange(m) / (0.42 * SR), 1.0)
        env *= np.minimum((m - np.arange(m)) / (0.28 * SR), 1.0)
        for j, d in enumerate(chord):
            f0 = deg(d, 0)
            pad[s0 : s0 + m] += saw(np.full(m, f0), m, partials=11, det=(j - 1) * 0.8) * (0.40 - j * 0.06) * env
            pad[s0 : s0 + m] += saw(np.full(m, f0 * 1.006), m, partials=9, det=(1 - j) * 0.6) * (0.24 - j * 0.04) * env
        brass[s0 : s0 + m] += saw(np.full(m, deg(chord[0], -1)), m, partials=6) * 0.30 * env
        brass[s0 : s0 + m] += saw(np.full(m, deg(chord[1], -1)), m, partials=5) * 0.18 * env

    # time-varying low-pass on the pad — the swell/pull-back motif
    padf = np.zeros(n)
    for i in range(0, n, 2048):
        seg = slice(i, min(i + 2048, n))
        fc = 300.0 + 2600.0 * float(bright[i]) * (0.42 + 0.58 * float(energy[i]))
        padf[seg] = lpf(pad[seg], fc, 0.85)
    pad = padf
    brass = lpf(brass, 620, 0.9)

    # ---- bansuri lead ------------------------------------------------------
    lead = np.zeros(n)
    for bar, bt, d, octv, ln in LEAD:
        pos = (bar * BAR + bt * BEAT)
        if pos >= DUR or not contour_at(pos, 3):
            continue
        one = v_bansuri(deg(d, octv), ln * BEAT * 0.94, gain=0.55)
        add(lead, one, int(pos * SR))
    lead = hall(lead, 0.32)

    # ---- sitar plucks: sparse arpeggiated answers --------------------------
    sitar = np.zeros(n)
    for b in range(nbars):
        if not contour_at(b * BAR, 2):
            continue
        chord = PAD[b % 4]
        for j, off in enumerate((1.5, 2.5, 3.5)):
            pos = b * BAR + off * BEAT
            if pos >= DUR:
                break
            f0 = deg(chord[(b + j) % 3], 1)
            add(sitar, v_sitar(f0, 0.9, seed=200 + b * 3 + j, gain=0.30), int(pos * SR))
    sitar = hall(sitar, 0.28)

    # ---- tabla / dholak on a Keherwa cycle ---------------------------------
    perc = np.zeros(n)
    step = BEAT / 2                      # eight half-beat steps per two bars
    k = 0
    while k * step < DUR:
        pos = k * step
        if contour_at(pos, 2):
            stroke = THEKA[k % 8]
            g = 1.0 if k % 8 == 0 else (0.80 if k % 4 == 0 else 0.58)
            add(perc, v_tabla(stroke, g * 0.55), int(pos * SR))
            # dhol reinforces the sam and the mid-cycle accent at high energy
            if k % 8 in (0, 4) and contour_at(pos, 0) > 0.80:
                add(perc, v_dhol(0.42), int(pos * SR))
        k += 1
    perc = comb_verb(perc, wet=0.18)

    # ---- ghungroo shimmer under the dance/festival passages ---------------
    anklets = np.zeros(n)
    k = 0
    while k * BEAT < DUR:
        pos = k * BEAT
        if contour_at(pos, 0) > 0.84:
            ln = int(0.22 * SR)
            cluster = np.zeros(ln)
            for _ in range(22):
                p2 = int(rng.random() * 0.12 * SR)
                l2 = min(int(0.05 * SR), ln - p2)
                if l2 <= 0:
                    continue
                fr = 4200 + rng.random() * 3000
                cluster[p2 : p2 + l2] += sine(fr, l2) * expd(l2, 0.012) * 0.06
            add(anklets, cluster, int(pos * SR))
        k += 1
    anklets = hpf(anklets, 2600) * 0.5

    # ---- Energy shapes the mix: the drone and lead are the through-line, so
    #      they stay present at low energy while pad/brass/percussion duck.
    e = np.clip(energy, 0.0, 1.0) ** 1.4
    mix = (
        drone * 0.30 * (0.55 + 0.45 * e)
        + sub * 0.30 * (0.28 + 0.72 * e)
        + pad * 0.30 * (0.14 + 0.86 * e)
        + brass * 0.26 * (0.04 + 0.96 * e)
        + lead * 0.46 * (0.60 + 0.40 * e)
        + sitar * 0.34 * (0.30 + 0.70 * e)
        + perc * 0.40 * (0.10 + 0.90 * e)
        + anklets * 0.30 * e
    )
    mix = comb_verb(mix, wet=0.20)
    mix = hpf(mix, 30)

    # gentle bus compression — tame peaks, keep the section dynamics
    envf = lpf(np.abs(mix), 4.0)
    mix = mix / (1.0 + 0.9 * np.maximum(0.0, envf - 0.42))

    a = int(0.9 * SR)
    mix[:a] *= np.linspace(0, 1, a) ** 1.3
    r = int(2.6 * SR)
    mix[-r:] *= np.linspace(1, 0, r) ** 0.75

    m = np.abs(mix).max()
    if m > 0:
        mix = mix / m * 0.84
    wr("music-bed", stereo(mix, width=0.32, pre=0.015))
    return "music-bed"


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
    print("\n== SFX CUES ==")
    for nm in build_sfx():
        p = encode(nm, SFX_DIR, "192k")
        print(f"  {nm:<16s} -> {os.path.getsize(p):>7d} B")

    print("\n== CONSTANT AMBIENT BED (60.000 s) ==")
    nm = build_ambient()
    p = encode(nm, SFX_DIR, "224k")
    print(f"  {nm:<16s} -> {os.path.getsize(p):>8d} B")

    print("\n== MUSIC BED (60.000 s, Raga Desh) ==")
    nm = build_bed()
    p = encode(nm, SFX_DIR, "224k")
    print(f"  {nm:<16s} -> {os.path.getsize(p):>8d} B")

    print("\nOK")


if __name__ == "__main__":
    sys.exit(main())
