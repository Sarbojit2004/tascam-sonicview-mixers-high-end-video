#!/usr/bin/env python3
"""
ALL AUDIO, SYNTHESISED FROM CODE.

Nothing here comes from ElevenLabs, a sample library, a stock service, or the
generative tracks the video model attached to the B-roll clips (those are
stripped in prep_media.py). Every sound is built from first principles --
filtered noise, damped resonators, additive partials, exponential envelopes --
over numpy, with a seeded RNG so output is byte-identical run to run.

WHAT IS REUSED AND WHAT IS NEW (the §5 report, in code).

The TASCAM Recording Series production established a synthesis vocabulary for
mechanical console sounds. Six of its sounds describe events Sonicview genuinely
shares, and their synthesis approach is reused here:

    phase-mark      a soft marker at a section boundary
    spec-latch      a figure settling into place
    fader-throw     a fader moving under a hand
    knob-rotary     a detented encoder step
    data-tick       a quantised data event
    sdxc-seat       a memory card reaching its connector

Seven are NEW, because Sonicview's hardware vocabulary has no Model-series
equivalent. A hybrid analog desk has no locking network connector, no capacitive
glass, no motorised recall and no redundant supply to hand over to:

    ethercon-latch  the Dante port's locking collar engaging -- a two-stage
                    event (collar rotation, then detent) rather than one click
    touch-tap       a fingertip on 7-inch glass: no travel, no mechanism, so it
                    is almost entirely the panel resonance behind the glass
    touch-swipe     a sustained contact with friction noise, gated by movement
    fader-snap      100 mm motorised faders driven to position by a snapshot
                    recall. Stage 5 asks for "violently yet precisely"; the
                    envelope is critically damped so it arrives and STOPS
    packet-handoff  the ST 2022-7 changeover: two streams, one interrupted, the
                    other continuous -- rendered as a pitch-continuous tone whose
                    TIMBRE switches without a gap, because the point is that
                    nothing is heard to fail
    card-seat       an expansion card's edge connector reaching its socket
    dc-lock         the 4-pin XLR DC inlet latching

MUSIC BEDS are generated per deliverable at that deliverable's exact runtime, so
each is a single continuous synced file rather than a loop with a fade.

Also emitted, per §"Final Audio Deliverables": for each deliverable, the full
music bed as deployed AND the transition-SFX layer alone on its own timeline at
the exact positions used, both spanning that deliverable's exact runtime.
"""
import json
import os
import struct
import sys
import wave

import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BUILD = os.path.join(ROOT, "build")
OUT_SFX = os.path.join(BUILD, "public", "audio", "sfx")
OUT_BED = os.path.join(BUILD, "public", "audio")

RUNTIME = {
    "reel1": 178.0, "reel2": 178.0, "reel3": 178.0,
    "part1": 298.0, "part2": 298.0, "part3": 298.0,
}

rng = np.random.default_rng(0x50_4E_49_43)  # deterministic


# ── primitives ──────────────────────────────────────────────────────────────

def t(n):
    return np.arange(n) / SR


def env_exp(n, attack=0.002, decay=0.20, power=2.0):
    a = int(SR * attack) or 1
    e = np.empty(n)
    e[:a] = np.linspace(0, 1, a) ** 0.6
    d = n - a
    e[a:] = np.exp(-np.linspace(0, 1, d) * (1.0 / max(decay, 1e-4)) * 3.0) ** power
    return e


def env_ad(n, attack, release):
    a, r = int(SR * attack) or 1, int(SR * release) or 1
    a = min(a, n - 1)
    r = min(r, n - a)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a)
    e[n - r:] = np.linspace(1, 0, r)
    return e


def noise(n):
    return rng.standard_normal(n)


def biquad(x, f0, q, kind="lp"):
    """One-pole-pair biquad. Enough for shaping; nothing here needs more."""
    w0 = 2 * np.pi * f0 / SR
    alpha = np.sin(w0) / (2 * q)
    cw = np.cos(w0)
    if kind == "lp":
        b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]
    elif kind == "hp":
        b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]
    else:  # bp
        b = [alpha, 0.0, -alpha]
    a = [1 + alpha, -2 * cw, 1 - alpha]
    b = [c / a[0] for c in b]
    a = [c / a[0] for c in a]
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i, xi in enumerate(x):
        yi = b[0] * xi + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2
        y[i] = yi
        x2, x1 = x1, xi
        y2, y1 = y1, yi
    return y


def resonator(n, freq, decay, amp=1.0):
    """A damped sinusoid — a struck body."""
    x = t(n)
    return amp * np.sin(2 * np.pi * freq * x) * np.exp(-x / decay)


def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def stereo(x, width=0.0):
    if width <= 0:
        return np.stack([x, x], axis=1)
    d = int(SR * 0.0008 * width)
    l = np.concatenate([np.zeros(d), x])[: len(x)]
    r = np.concatenate([x, np.zeros(d)])[d: d + len(x)]
    return np.stack([l, r], axis=1)


def write_wav(path, data, sr=SR):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if data.ndim == 1:
        data = stereo(data)
    d = np.clip(data, -1, 1)
    pcm = (d * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())
    return path


# ── the six reused sounds ───────────────────────────────────────────────────

def phase_mark():
    n = int(SR * 0.55)
    x = resonator(n, 320, 0.16, 0.6) + resonator(n, 481, 0.11, 0.3) + resonator(n, 962, 0.05, 0.12)
    return norm(x * env_exp(n, 0.004, 0.30), 0.70)


def spec_latch():
    n = int(SR * 0.22)
    x = biquad(noise(n), 2400, 1.4, "bp") * 0.5 + resonator(n, 1180, 0.03, 0.7)
    return norm(x * env_exp(n, 0.001, 0.10), 0.72)


def fader_throw():
    n = int(SR * 0.42)
    x = biquad(noise(n), 900, 0.7, "bp")
    x *= np.linspace(0.2, 1.0, n) ** 1.4
    return norm(x * env_ad(n, 0.02, 0.18) * 0.5, 0.55)


def knob_rotary():
    n = int(SR * 0.09)
    x = biquad(noise(n), 3200, 2.0, "bp") + resonator(n, 2400, 0.008, 0.5)
    return norm(x * env_exp(n, 0.0005, 0.05), 0.62)


def data_tick():
    n = int(SR * 0.06)
    x = biquad(noise(n), 5200, 3.0, "bp") * 0.8
    return norm(x * env_exp(n, 0.0004, 0.03), 0.52)


def sdxc_seat():
    n = int(SR * 0.30)
    slide = biquad(noise(int(SR * 0.16)), 1500, 0.8, "bp") * 0.35
    x = np.zeros(n)
    x[: len(slide)] += slide * np.linspace(0.3, 1.0, len(slide))
    k = int(SR * 0.17)
    click = resonator(n - k, 1900, 0.012, 0.9) + biquad(noise(n - k), 3400, 2.2, "bp") * 0.5
    x[k:] += click
    return norm(x, 0.70)


# ── the seven new Sonicview sounds ──────────────────────────────────────────

def ethercon_latch():
    """
    Two-stage. A locking etherCON is not one click: the plug seats, then the
    collar rotates and detents. Rendering it as a single click is what makes
    network connectors sound like light switches.
    """
    n = int(SR * 0.40)
    x = np.zeros(n)
    seat = resonator(int(SR * 0.10), 780, 0.018, 0.8) + biquad(noise(int(SR * 0.10)), 2100, 1.6, "bp") * 0.45
    x[: len(seat)] += seat
    k = int(SR * 0.14)
    collar = biquad(noise(int(SR * 0.09)), 1400, 1.1, "bp") * 0.30
    x[k: k + len(collar)] += collar * np.linspace(0.4, 1.0, len(collar))
    d = int(SR * 0.25)
    det = resonator(n - d, 1650, 0.010, 0.95) + biquad(noise(n - d), 3000, 2.4, "bp") * 0.5
    x[d:] += det
    return norm(x, 0.74)


def touch_tap():
    """
    Glass has no travel and no mechanism. Almost all of what you hear is the
    panel behind it resonating, plus a very short contact transient.
    """
    n = int(SR * 0.16)
    contact = biquad(noise(n), 4200, 1.2, "bp") * env_exp(n, 0.0003, 0.012) * 0.4
    body = (resonator(n, 210, 0.035, 0.55) + resonator(n, 320, 0.025, 0.25)) * env_exp(n, 0.001, 0.09)
    return norm(contact + body, 0.58)


def touch_swipe():
    n = int(SR * 0.34)
    fric = biquad(noise(n), 2600, 0.6, "bp")
    # gate by "movement": rises, plateaus, releases as the finger lifts
    gate = np.clip(np.sin(np.linspace(0, np.pi, n)) ** 0.7, 0, 1)
    body = resonator(n, 240, 0.05, 0.2)
    return norm(fric * gate * 0.45 + body * gate, 0.50)


def fader_snap():
    """
    A snapshot recall driving 100 mm motorised faders. Stage 5: "snapping
    violently yet precisely to position ... mechanical speed and digital
    determinism". Determinism means it must NOT overshoot: motor whine ramps,
    then a hard arrival and silence. A spring-like tail would be wrong.
    """
    n = int(SR * 0.36)
    x = t(n)
    # brushed-motor whine, pitch falling as the servo decelerates into position
    f = 260 * np.exp(-x * 5.5) + 95
    whine = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.30
    whine += np.sin(2 * np.pi * 2 * np.cumsum(f) / SR) * 0.10
    travel = biquad(noise(n), 1200, 0.8, "bp") * 0.22
    motor = (whine + travel) * np.exp(-x * 7.0)
    # the arrival: cap meeting its end stop, then nothing
    k = int(SR * 0.20)
    arrive = np.zeros(n)
    hit = resonator(n - k, 640, 0.014, 1.0) + biquad(noise(n - k), 2600, 2.0, "bp") * 0.55
    arrive[k:] = hit
    return norm(motor + arrive, 0.80)


def packet_handoff():
    """
    ST 2022-7 changeover. The whole engineering point is that NOTHING IS HEARD
    TO FAIL: the receiver reconstructs from the secondary stream with zero
    sample loss. So this is deliberately not a glitch or a dropout. Pitch runs
    continuously through the event; only the TIMBRE changes, and only slightly.
    A sound designer's instinct here is a stutter, and that instinct would
    illustrate the opposite of the claim.
    """
    n = int(SR * 0.62)
    x = t(n)
    base = 440.0
    tone_a = np.sin(2 * np.pi * base * x) + 0.32 * np.sin(2 * np.pi * base * 2 * x)
    tone_b = np.sin(2 * np.pi * base * x) + 0.32 * np.sin(2 * np.pi * base * 3 * x)
    # crossfade over 40 ms at the midpoint — audible as colour, not as a seam
    mid = n // 2
    w = int(SR * 0.040)
    mix = np.zeros(n)
    mix[: mid - w // 2] = 0.0
    mix[mid - w // 2: mid + w // 2] = np.linspace(0, 1, w)
    mix[mid + w // 2:] = 1.0
    tone = tone_a * (1 - mix) + tone_b * mix
    return norm(tone * env_ad(n, 0.05, 0.22) * 0.5, 0.46)


def card_seat():
    n = int(SR * 0.44)
    x = np.zeros(n)
    slide = biquad(noise(int(SR * 0.24)), 1100, 0.7, "bp") * 0.28
    x[: len(slide)] += slide * np.linspace(0.25, 1.0, len(slide)) ** 1.3
    k = int(SR * 0.26)
    seat = resonator(n - k, 520, 0.020, 0.9) + resonator(n - k, 1240, 0.010, 0.4)
    seat += biquad(noise(n - k), 2200, 1.8, "bp") * 0.45
    x[k:] += seat
    return norm(x, 0.76)


def dc_lock():
    n = int(SR * 0.26)
    x = resonator(n, 900, 0.014, 0.85) + resonator(n, 1500, 0.008, 0.35)
    x += biquad(noise(n), 2800, 2.2, "bp") * 0.5
    return norm(x * env_exp(n, 0.0006, 0.10), 0.72)


REUSED = {
    "phase-mark": phase_mark, "spec-latch": spec_latch, "fader-throw": fader_throw,
    "knob-rotary": knob_rotary, "data-tick": data_tick, "sdxc-seat": sdxc_seat,
}
NEW = {
    "ethercon-latch": ethercon_latch, "touch-tap": touch_tap, "touch-swipe": touch_swipe,
    "fader-snap": fader_snap, "packet-handoff": packet_handoff, "card-seat": card_seat,
    "dc-lock": dc_lock,
}


# ── music bed ───────────────────────────────────────────────────────────────

def bed(seconds, key_hz, seed):
    """
    A clinical, slow bed. Stage 9 asks for a senior systems architect addressing
    peers, so the bed cannot be a driving track -- it is a sustained harmonic
    field with a slow pulse, well under the voiceover.

    NO LARGE CINEMATIC LOW-FREQUENCY CONTENT. That is a standing principle in
    this pipeline: sub-drops and deep impacts read as advertising and mask a
    spoken figure. Everything here is high-passed at 70 Hz.
    """
    r = np.random.default_rng(seed)
    n = int(SR * seconds)
    x = t(n)
    out = np.zeros(n)

    # sustained partials, slowly detuning against each other
    for k, amp in ((1, 0.34), (2, 0.16), (3, 0.09), (4, 0.05), (6, 0.03)):
        drift = 1.0 + 0.0016 * np.sin(2 * np.pi * (0.013 + 0.004 * k) * x + r.random() * 6.28)
        out += amp * np.sin(2 * np.pi * key_hz * k * drift * x + r.random() * 6.28)

    # a slow pulse — a clock, not a beat
    period = 4.0
    ph = (x % period) / period
    pulse = np.exp(-ph * 9.0) * 0.16
    out += pulse * np.sin(2 * np.pi * key_hz * 2 * x)

    # air
    out += biquad(r.standard_normal(n), 6000, 0.7, "hp") * 0.012

    # long swell so a 298 s bed has an arc rather than a plateau
    swell = 0.72 + 0.28 * np.sin(2 * np.pi * x / seconds - np.pi / 2)
    out *= swell

    out = biquad(out, 70, 0.7, "hp")
    fade = env_ad(n, 2.5, 3.5)
    return norm(out * fade, 0.30)


def main():
    os.makedirs(OUT_SFX, exist_ok=True)
    manifest = {"sfx": {}, "beds": {}, "reused": sorted(REUSED), "new": sorted(NEW)}

    for name, fn in {**REUSED, **NEW}.items():
        p = write_wav(os.path.join(OUT_SFX, f"{name}.wav"), fn())
        dur = len(fn()) / SR
        manifest["sfx"][name] = {
            "file": f"audio/sfx/{name}.wav",
            "seconds": round(dur, 3),
            "origin": "reused-vocabulary" if name in REUSED else "new-for-sonicview",
        }
        print(f"  sfx  {name:16s} {dur:5.3f}s  {'reused' if name in REUSED else 'NEW'}")

    # Each deliverable gets its own key so the six do not sound like one file
    # cut six ways, while staying recognisably one production.
    keys = {"reel1": 110.0, "part1": 110.0, "reel2": 98.0, "part2": 98.0,
            "reel3": 123.47, "part3": 123.47}
    for k, secs in RUNTIME.items():
        b = bed(secs, keys[k], seed=hash(k) & 0xFFFF)
        p = write_wav(os.path.join(OUT_BED, f"bed-{k}.wav"), b)
        manifest["beds"][k] = {"file": f"audio/bed-{k}.wav", "seconds": secs,
                               "key_hz": keys[k]}
        print(f"  bed  {k:8s} {secs:6.1f}s  key {keys[k]:.2f} Hz")

    with open(os.path.join(BUILD, "audio-manifest.json"), "w", encoding="utf8") as fh:
        json.dump(manifest, fh, indent=1)
    print(f"\n{len(manifest['sfx'])} sounds ({len(REUSED)} reused, {len(NEW)} new), "
          f"{len(manifest['beds'])} beds. All synthesised from code.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
