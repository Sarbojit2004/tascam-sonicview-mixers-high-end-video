#!/usr/bin/env python3
"""Generates every audio asset for the three 298-second long-form videos.

Imports the DSP helpers from scripts/gen_audio.py rather than re-implementing
them, so the long-form score is provably the same instrument palette and the
same SFX design language as the companion reel series — same key (Fm-Db-Ab-Eb),
same tempo (90 BPM), same detuned-saw pads standing in for HDIA preamp warmth,
same quantized 16th ticking standing in for 96 kHz clocking and Dante packets.

What is new here, per the long-form brief:
  · three 298.0 s beds with chapter-mapped energy contours
  · a CONSTANT ambient texture layer that runs under the whole runtime
  · a much larger transition SFX palette, because 298 s of cuts per part will
    expose repetition that 88 s hides

Nothing calls an external service. Run before any scene code references a cue:

    python3 scripts/gen_audio_longform.py
    python3 scripts/audit_audio.py --longform
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_audio as G  # noqa: E402  (shared DSP: filters, envelopes, reverb, IO)

ROOT = G.ROOT
LF_DIR = os.path.join(ROOT, "public", "audio", "lf")
VO_DIR = os.path.join(ROOT, "public", "vo")
os.makedirs(LF_DIR, exist_ok=True)
os.makedirs(VO_DIR, exist_ok=True)

SR = G.SR
DUR = 298.0
BPM = G.BPM
BEAT = G.BEAT
BAR = G.BAR
PROG = G.PROG

rng = np.random.default_rng(2298)


# ---------------------------------------------------------------------------
# EXPANDED TRANSITION SFX
# ---------------------------------------------------------------------------
def build_lf_sfx():
    """Cues additional to the reel palette. The reel's 18 are reused as-is."""
    names = []
    t, noise, lpf, hpf, bpf = G.t, G.noise, G.lpf, G.hpf, G.bpf
    expd, sine, saw, tri, comb, sfx = G.expd, G.sine, G.saw, G.tri, G.comb_verb, G.sfx

    # -- three more whooshes so adjacent cuts never reuse the same movement --
    specs = [
        ("whoosh-deep", 0.80, (240, 2600), 0.55, 0.42),
        ("whoosh-tight", 0.42, (900, 6200), 1.6, 0.30),
        ("whoosh-grain", 0.68, (500, 4200), 0.9, 0.36),
    ]
    for nm, dur, (f0, f1), q, width in specs:
        n = int(dur * SR)
        env = np.sin(np.linspace(0, np.pi, n)) ** 1.5
        sweep = np.linspace(f0, f1, n)
        y = np.zeros(n)
        for i in range(0, n, 512):
            seg = slice(i, min(i + 512, n))
            y[seg] = bpf(noise(seg.stop - seg.start), float(sweep[i]), q)
        if nm == "whoosh-grain":
            g = (rng.random(n) < 0.55).astype(float)
            g = lpf(g, 900)
            y = y * (0.55 + 0.45 * g)
        names.append(sfx(nm, y * env, 0.62, width=width))

    # -- mechanical clicks / latches ---------------------------------------
    n = int(0.09 * SR)
    x = bpf(noise(n), 2100, 3.4) * expd(n, 0.008)
    x += sine(880, n) * expd(n, 0.006) * 0.4
    names.append(sfx("click-hard", x, 0.66, width=0.09))

    n = int(0.22 * SR)
    x = bpf(noise(n), 1250, 2.6) * expd(n, 0.012)
    off = int(0.075 * SR)
    x2 = np.zeros(n)
    x2[off:] = bpf(noise(n - off), 780, 3.6) * expd(n - off, 0.010) * 0.8
    x2[off:] += sine(150, n - off) * expd(n - off, 0.026) * 0.55
    names.append(sfx("latch", x + x2, 0.74, width=0.12))

    # -- chapter stinger: a short tonal marker on the tonic ----------------
    n = int(2.4 * SR)
    x = np.zeros(n)
    for k, g, tau in ((174.61, 1.0, 0.9), (261.63, 0.6, 0.7), (349.23, 0.4, 0.5), (523.25, 0.22, 0.36)):
        x += sine(k, n) * expd(n, tau) * g
    x += bpf(noise(n), 3200, 1.2) * expd(n, 0.035) * 0.3
    names.append(sfx("stinger-chapter", comb(x, wet=0.38), 0.60, width=0.34))

    # -- soft tonal bloom, used under logo reveals -------------------------
    n = int(2.0 * SR)
    env = np.sin(np.linspace(0, np.pi * 0.85, n)) ** 1.3
    x = saw(np.full(n, 174.61), n, partials=10, det=0.6) * 0.42
    x += saw(np.full(n, 261.63), n, partials=8, det=-0.5) * 0.26
    cut = np.linspace(300, 2400, n)
    y = np.zeros(n)
    for i in range(0, n, 1024):
        seg = slice(i, min(i + 1024, n))
        y[seg] = lpf(x[seg], float(cut[i]), 0.9)
    names.append(sfx("bloom", comb(y * env, wet=0.34), 0.58, width=0.32))

    # -- reverse swell into a cut ------------------------------------------
    n = int(1.5 * SR)
    env = np.linspace(0, 1, n) ** 2.6
    x = saw(np.linspace(120, 440, n), n, partials=9) * 0.4
    x += bpf(noise(n), 2400, 0.9) * 0.45
    names.append(sfx("reverse-swell", hpf(x * env, 140), 0.62, width=0.38))

    # -- sub thump for chapter drops ---------------------------------------
    n = int(1.1 * SR)
    x = sine(np.linspace(96, 38, n), n) * expd(n, 0.22)
    x += lpf(noise(n), 480) * expd(n, 0.02) * 0.35
    names.append(sfx("sub-thump", x, 0.90, width=0.05))

    # -- noise sweeps, both directions --------------------------------------
    for nm, lo, hi, curve in (("sweep-up", 400, 7000, 2.0), ("sweep-down", 7000, 400, 0.5)):
        n = int(1.3 * SR)
        f = np.exp(np.linspace(math.log(lo), math.log(hi), n))
        y = np.zeros(n)
        for i in range(0, n, 512):
            seg = slice(i, min(i + 512, n))
            y[seg] = bpf(noise(seg.stop - seg.start), float(f[i]), 1.4)
        env = np.linspace(0, 1, n) ** curve
        names.append(sfx(nm, y * env, 0.56, width=0.40))

    # -- triple tick, for spec tables ---------------------------------------
    n = int(0.34 * SR)
    x = np.zeros(n)
    for i, gap in enumerate((0.0, 0.085, 0.17)):
        o = int(gap * SR)
        ln = min(int(0.05 * SR), n - o)
        x[o:o + ln] += bpf(noise(ln), 3600 + i * 700, 5.0) * expd(ln, 0.007) * (1.0 - i * 0.2)
    names.append(sfx("tick-triple", x, 0.56, width=0.14))

    # -- page turn, for panel changes ---------------------------------------
    n = int(0.5 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 2.2
    x = bpf(noise(n), 2600, 0.8) * env
    x += bpf(noise(n), 5200, 1.4) * env * 0.5
    names.append(sfx("page-turn", hpf(x, 900), 0.48, width=0.26))

    # -- soft airy lift, for reveals that must not punch --------------------
    n = int(1.6 * SR)
    env = np.sin(np.linspace(0, np.pi * 0.9, n)) ** 1.1
    x = hpf(noise(n), 4200) * env * 0.5
    x += sine(1046.5, n) * expd(n, 0.5) * 0.18
    names.append(sfx("lift-air", comb(x, wet=0.40), 0.44, width=0.42))

    return names


# ---------------------------------------------------------------------------
# CONSTANT AMBIENT TEXTURE — runs under the entire runtime of every part
# ---------------------------------------------------------------------------
def build_ambient() -> str:
    n = int(DUR * SR)
    ts = G.t(n)

    # deep room tone
    room = G.lpf(G.noise(n), 220) * 0.5
    room *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.021 * ts)

    # high air, slowly breathing
    air = G.hpf(G.noise(n), 6400) * 0.16
    air *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.037 * ts + 1.1)

    # a mid band that drifts, so the floor never sounds like flat hiss
    mid = np.zeros(n)
    step = 4096
    for i in range(0, n, step):
        seg = slice(i, min(i + step, n))
        fc = 900 + 500 * math.sin(2 * math.pi * 0.013 * (i / SR))
        mid[seg] = G.bpf(G.noise(seg.stop - seg.start), fc, 1.1)
    mid *= 0.13

    # sparse, quantized machine ticks — the control-room clock, far back
    ticks = np.zeros(n)
    k = 0
    while k * BEAT < DUR:
        pos = int(k * BEAT * SR)
        if pos >= n:
            break
        if k % 4 == 0:
            ln = min(int(0.035 * SR), n - pos)
            ticks[pos:pos + ln] += G.bpf(G.noise(ln), 5200, 6.0) * G.expd(ln, 0.006)
        k += 1
    ticks = G.hpf(ticks, 2600) * 0.30

    # very occasional distant relay, so the floor has life
    relays = np.zeros(n)
    for j in range(14):
        pos = int((6.0 + j * 20.5 + rng.random() * 5.0) * SR)
        if pos >= n - SR:
            continue
        ln = int(0.4 * SR)
        r = G.bpf(G.noise(ln), 700, 2.4) * G.expd(ln, 0.014) * 0.5
        r += G.sine(88, ln) * G.expd(ln, 0.05) * 0.3
        relays[pos:pos + ln] += r
    relays = G.comb_verb(relays, wet=0.5) * 0.32

    mix = room + air + mid + ticks + relays
    mix = G.hpf(mix, 24)

    a = int(2.0 * SR)
    mix[:a] *= np.linspace(0, 1, a)
    mix[-a:] *= np.linspace(1, 0, a)

    m = np.abs(mix).max()
    if m > 0:
        mix = mix / m * 0.52

    G.wr("ambient-longform", G.stereo(mix, width=0.44, pre=0.019))
    return "ambient-longform"


# ---------------------------------------------------------------------------
# MUSIC BEDS — 298 s, chapter-mapped energy
# ---------------------------------------------------------------------------
# (start_s, end_s, energy, brightness, ticks, pulse)
CONTOURS = {
    1: [  # THE HUB
        (0, 16, 0.94, 1.30, True, True),      # cold open
        (16, 29, 0.66, 1.06, True, True),     # four pillars
        (29, 62, 0.78, 1.00, True, True),     # 16XP
        (62, 82, 0.88, 1.10, True, True),     # VIEW + faders
        (82, 98, 0.72, 0.92, True, True),
        (98, 135, 0.54, 0.78, True, False),   # FPGA + latency — pull right back
        (135, 169, 0.70, 0.90, True, True),   # HDIA + rear I/O
        (169, 182, 0.62, 0.86, True, True),
        (182, 218, 0.90, 1.14, True, True),   # 24XP scale
        (218, 259, 0.96, 1.20, True, True),   # dp redundancy — peak
        (259, 272, 0.74, 1.00, True, True),
        (272, 281, 0.62, 1.04, True, True),   # continuation
        (281, 298, 0.78, 1.10, True, True),   # outro
    ],
    2: [  # THE NETWORK
        (0, 16, 0.88, 1.22, True, True),
        (16, 34, 0.62, 1.00, True, True),
        (34, 74, 0.80, 1.10, True, True),     # Dante concept
        (74, 100, 0.70, 0.94, True, True),    # the snake problem
        (100, 150, 0.92, 1.06, True, True),   # SB-16D — peak
        (150, 182, 0.78, 0.96, True, True),
        (182, 200, 0.60, 0.84, True, True),   # control detail
        (200, 262, 0.68, 0.88, True, True),   # case studies — warmer, calmer
        (262, 272, 0.60, 1.02, True, True),
        (272, 298, 0.80, 1.12, True, True),
    ],
    3: [  # THE PROTOCOL LAYER
        (0, 16, 0.90, 1.24, True, True),
        (16, 32, 0.56, 0.92, True, False),    # dense technical premise
        (32, 78, 0.62, 0.88, True, True),     # ST2110
        (78, 108, 0.58, 0.86, True, True),
        (108, 148, 0.64, 0.90, True, True),   # AE16 / AN16
        (148, 196, 0.66, 0.92, True, True),   # MA64 / DA64
        (196, 232, 0.60, 0.86, True, True),
        (232, 262, 0.82, 1.06, True, True),
        (262, 274, 0.94, 1.26, True, True),   # close of series — full lift
        (274, 298, 0.84, 1.16, True, True),
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
    ts = G.t(n)

    coarse = ts[::512]
    energy = np.interp(ts, coarse, [contour_at(part, x, 0) for x in coarse])
    bright = np.interp(ts, coarse, [contour_at(part, x, 1) for x in coarse])
    energy = G.lpf(energy, 0.5)
    bright = G.lpf(bright, 0.5)

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

        seg_env = np.ones(m)
        atk = min(int(0.35 * SR), m)
        seg_env[:atk] = np.linspace(0, 1, atk)

        v = np.zeros(m)
        for j, f0 in enumerate(chord):
            v += G.saw(np.full(m, f0 * 2), m, partials=11, det=(j - 1) * 0.8) * (0.42 - j * 0.06)
            v += G.saw(np.full(m, f0 * 2 * 1.005), m, partials=9, det=(1 - j) * 0.6) * (0.26 - j * 0.04)
        pad[s0:s1] += v * seg_env

        sub[s0:s1] += G.sine(np.full(m, chord[0]), m) * 0.55 * seg_env
        sub[s0:s1] += G.sine(np.full(m, chord[0] * 0.5), m) * 0.22 * seg_env

        for k in (2, 5, 7, 11, 13):
            off = int(k * (BEAT / 4) * SR)
            if off >= m:
                continue
            ln = min(int(0.30 * SR), m - off)
            note = chord[(b + k) % 3] * 4
            arp[s0 + off:s0 + off + ln] += G.tri(np.full(ln, note), ln) * G.expd(ln, 0.055) * 0.30

    padf = np.zeros(n)
    step = 2048
    for i in range(0, n, step):
        seg = slice(i, min(i + step, n))
        fc = 320.0 + 2300.0 * float(bright[i]) * (0.45 + 0.55 * float(energy[i]))
        padf[seg] = G.lpf(pad[seg], fc, 0.85)
    pad = padf

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
            tickbus[pos:pos + ln] += G.bpf(G.noise(ln), fc, 5.5) * G.expd(ln, 0.008) * accent
        k += 1
    tickbus = G.hpf(tickbus, 1400)

    pulse = np.zeros(n)
    k = 0
    while k * BEAT < DUR:
        pos = int(k * BEAT * SR)
        if pos >= n:
            break
        if contour_at(part, k * BEAT, 3) and k % 2 == 0:
            ln = min(int(0.42 * SR), n - pos)
            body = G.sine(np.linspace(115, 46, ln), ln) * G.expd(ln, 0.085)
            body += G.lpf(G.noise(ln), 700) * G.expd(ln, 0.012) * 0.30
            pulse[pos:pos + ln] += body * (1.0 if k % 8 == 0 else 0.78)
        k += 1

    e = np.clip(energy, 0.0, 1.0) ** 1.5
    mix = (
        pad * 0.34 * (0.12 + 0.88 * e)
        + sub * 0.34 * (0.26 + 0.74 * e)
        + tickbus * 0.30 * (0.68 + 0.32 * e)
        + pulse * 0.34 * (0.10 + 0.90 * e)
        + arp * 0.26 * (0.08 + 0.92 * e)
    )
    mix = G.comb_verb(mix, wet=0.20)
    mix = G.hpf(mix, 28)

    envf = G.lpf(np.abs(mix), 4.0)
    mix = mix / (1.0 + 0.9 * np.maximum(0.0, envf - 0.42))

    a = int(1.6 * SR)
    mix[:a] *= np.linspace(0, 1, a)
    r = int(3.0 * SR)
    mix[-r:] *= np.linspace(1, 0, r) ** 0.8

    m = np.abs(mix).max()
    if m > 0:
        mix = mix / m * 0.82

    name = f"music-bed-longform-part{part}"
    G.wr(name, G.stereo(mix, width=0.30, pre=0.014))
    return name


def main():
    print(f"ffmpeg: {G.FFMPEG}\ntarget duration: {DUR} s\n")

    print("== ADDITIONAL TRANSITION SFX ==")
    for nm in build_lf_sfx():
        p = G.encode(nm, LF_DIR, "192k")
        print(f"  {nm:<18s} -> {os.path.getsize(p):>8d} B")

    print("\n== CONSTANT AMBIENT LAYER ==")
    nm = build_ambient()
    p = G.encode(nm, LF_DIR, "192k")
    print(f"  {nm:<18s} -> {os.path.getsize(p):>8d} B")

    print("\n== MUSIC BEDS ==")
    for part in (1, 2, 3):
        nm = build_bed(part)
        p = G.encode(nm, LF_DIR, "224k")
        print(f"  {nm:<28s} -> {os.path.getsize(p):>9d} B")

    print("\n== VO PLACEHOLDERS (silent) ==")
    for part in (1, 2, 3):
        nm = f"voiceover-longform-part{part}"
        G.build_silence(nm, DUR)
        p = G.encode(nm, VO_DIR, "128k")
        print(f"  {nm:<28s} -> {os.path.getsize(p):>8d} B")

    print("\nOK")


if __name__ == "__main__":
    sys.exit(main())
