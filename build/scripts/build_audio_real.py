#!/usr/bin/env python3
"""
BUILD THE SIX MUSIC BEDS AND SIX SFX TIMELINES FROM THE REAL LIBRARY.

Source material, all of it from the sibling production's repository
(`tascam-recording-series-mixers-high-end-video`):

  MUSIC   `sfx-audio-files/ES_*.mp3` — eight Epidemic Sound tracks, each with
          BASS / DRUMS / INSTRUMENTS / MELODY stems.
  SFX     `_superseded/public/audio/sfx/*.mp3` — 39 real sound effects.

Nothing here is synthesised. An earlier pass built this layer from numpy, which
was wrong: the files were supplied and should have been used.

THE BED IS RE-VOICED FROM STEMS, NOT LOOPED. A 298-second part needs more than
any single track provides, and looping a full mix is audible and dull. Each
pass is rebuilt from the isolated stems with a different balance — an opening
that enters on instruments and melody with the drums held back, a full-weight
body, a decaying close — so the bed develops instead of repeating. This is the
Recording Series' own approach, ported.

LEVELS FOLLOW THEIR DELIVERED STEMS, measured rather than assumed:

    their bed FLACs      peak -3.61 dBFS, -18.4 to -24.5 LUFS
    their sfx FLACs      peak -2.9 to -5.1 dBFS, -21.7 to -24.3 LUFS

So the two layers are first balanced against each other at that production's
own mix ratio (bed 0.34, effects 0.13-0.22), then the pair is scaled by ONE
common factor that puts the bed at -3.6 dBFS peak. Summing the two files at
unity in an editor therefore reproduces the intended balance exactly, and both
land in the range their stems occupy.

Output: WAV masters plus 320 kbps MP3s, each spanning its deliverable's exact
runtime, frame-aligned to the rendered videos.
"""
import json
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lufs import integrated_lufs, true_peak_db  # noqa: E402
from sfx_map import (  # noqa: E402
    ACCENT_FOR_DEMO, ACCENT_FOR_KIND, TRANSITIONS, UNUSED_BY_CHOICE,
)

SR = 48000
FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
ROOT = os.path.dirname(BUILD)
SIBLING = "/home/user/tascam-recording-series-mixers-high-end-video"
MUSIC_SRC = os.path.join(SIBLING, "sfx-audio-files")
SFX_SRC = "/tmp/rs-sfx"
OUT = os.path.join(BUILD, "out", "audio")
FFMPEG = os.path.join(ROOT, "node_modules", "@remotion",
                      "compositor-linux-x64-gnu", "ffmpeg")

# ── LEVELS, derived from their DELIVERED stems rather than from their mix code ──
#
# Measured from the eight FLACs the Recording Series ships:
#
#     bed          -18.4 to -24.5 LUFS,  peak -3.61 dBFS on every one
#     sfx timeline -21.7 to -24.3 LUFS,  peak -2.9 to -5.1 dBFS
#     sfx relative to its own bed:  -4.0, -5.9, +0.1, +2.6 dB  (mean -1.8)
#
# A FIRST ATTEMPT NORMALISED THE BED BY PEAK and scaled the effects by the same
# factor, on the reasoning that this preserves the mix ratio in their code
# (bed 0.34, effects 0.13-0.22). It does — but peak and loudness are not the
# same thing, and these six tracks have very different crest factors. The
# effects layer came out spanning -30.3 to -15.6 LUFS across the six, a 15 dB
# spread, and reel 3's peaked at +0.07 dBFS, which is clipping.
#
# So both layers are normalised by LOUDNESS instead, to the relationship their
# delivered files actually exhibit. The per-cue gains in sfx_map.py still set
# the balance BETWEEN effects; this sets the balance between the two layers.
BED_TARGET_LUFS = -20.0          # mid of their delivered bed range
SFX_OFFSET_LU = -2.0             # their mean sfx-to-bed relationship
CEILING_DB = -1.0                # nothing leaves here hotter than this

STEMS = ["BASS", "DRUMS", "INSTRUMENTS", "MELODY"]

# One distinct track per deliverable, six of the eight.
#
# The four the Recording Series left unused go first (ACTIVE, Fable, Impossible
# Theory, The Light from Within). The two that must be reused are its REEL
# tracks, not its long-form track: a 298 s landscape part is a different context
# from a 178 s reel, whereas reusing the track that carried its 898 s centrepiece
# would make the two productions sound like the same film.
#
# Unused here: Idiosyncrasies, Like the Palm of Your Hand.
TRACKS = {
    "reel1": ("ACTIVE", 178),
    "reel2": ("Impossible Theory", 178),
    "reel3": ("The Light from Within", 178),
    "part1": ("Fable", 298),
    "part2": ("Stay For A Minute", 298),
    "part3": ("Box of Black Pearls", 298),
}


def ff_load(path):
    """Decode anything to float64 stereo at 48 kHz."""
    r = subprocess.run(
        [FFMPEG, "-v", "error", "-i", path, "-f", "wav", "-ac", "2",
         "-ar", str(SR), "-"],
        capture_output=True, check=True,
    )
    b = r.stdout
    i = b.find(b"data")
    n = int.from_bytes(b[i + 4:i + 8], "little")
    n = min(n, len(b) - i - 8)
    a = np.frombuffer(b[i + 8:i + 8 + (n & ~1)], dtype="<i2").astype(np.float64)
    return (a / 32768.0).reshape(-1, 2)


def write_wav(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    subprocess.run(
        [FFMPEG, "-v", "error", "-y", "-f", "s16le", "-ar", str(SR),
         "-ac", "2", "-i", "-", path],
        input=pcm.tobytes(), check=True,
    )
    subprocess.run(
        [FFMPEG, "-v", "error", "-y", "-i", path, "-c:a", "libmp3lame",
         "-b:a", "320k", path[:-4] + ".mp3"],
        check=True,
    )


def find_track(key, stem=None):
    for f in sorted(os.listdir(MUSIC_SRC)):
        if not f.endswith(".mp3") or key.lower() not in f.lower():
            continue
        has = "STEMS" in f
        if stem is None and not has:
            return os.path.join(MUSIC_SRC, f)
        if stem is not None and has and f"STEMS {stem}" in f:
            return os.path.join(MUSIC_SRC, f)
    return None


def fade(n, a_in, a_out):
    e = np.ones(n)
    if a_in > 0:
        k = min(a_in, n // 2)
        e[:k] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k))
    if a_out > 0:
        k = min(a_out, n // 2)
        e[-k:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, k))
    return e[:, None]


def build_bed(key, seconds):
    """Re-voiced from stems, developing across the runtime."""
    total = int(round(seconds * SR))
    stems = {}
    for s in STEMS:
        p = find_track(key, s)
        if p:
            stems[s] = ff_load(p)
    full = ff_load(find_track(key))
    if not stems:
        stems = {"FULL": full}
    L = min(len(v) for v in stems.values())
    for k in stems:
        stems[k] = stems[k][:L]

    # ACTIVE SPAN. Several of these tracks open very quietly and close on their
    # own fade-out. Building from the top leaves a deliverable near-silent
    # exactly where its hook is, and rotating the track only moves the quiet
    # part into the middle. Both ends are trimmed instead, so every loop join
    # lands between two passages that are actually playing.
    mono = full[:L].mean(axis=1)
    win = SR
    lv = np.array([
        20 * np.log10(np.sqrt((mono[i:i + win] ** 2).mean()) + 1e-12)
        for i in range(0, max(1, len(mono) - win), win)
    ])
    active = np.where(lv >= np.median(lv) - 6.0)[0]
    if len(active) >= 4:
        a0 = int(active[0]) * win
        a1 = min(L, (int(active[-1]) + 1) * win)
        for k in stems:
            stems[k] = stems[k][a0:a1]
        L = min(len(v) for v in stems.values())

    bed = np.zeros((total, 2))
    pos, npass = 0, 0
    XF = int(2.5 * SR)
    VOICING = {
        0: {"BASS": 0.85, "DRUMS": 0.35, "INSTRUMENTS": 1.0, "MELODY": 0.90, "FULL": 0.80},
        1: {"BASS": 1.00, "DRUMS": 0.95, "INSTRUMENTS": 1.0, "MELODY": 0.75, "FULL": 1.00},
        2: {"BASS": 0.90, "DRUMS": 0.60, "INSTRUMENTS": 0.9, "MELODY": 1.00, "FULL": 0.85},
    }
    while pos < total:
        take = min(L, total - pos + XF)
        g = VOICING[npass % 3]
        seg = np.zeros((take, 2))
        for k, v in stems.items():
            seg += v[:take] * g.get(k, 0.8)
        seg *= fade(take, XF if pos > 0 else int(0.6 * SR), XF)
        end = min(pos + take, total)
        bed[pos:end] += seg[: end - pos]
        pos += L - XF
        npass += 1

    bed *= fade(total, int(0.5 * SR), int(3.5 * SR))
    return bed, npass, sorted(stems.keys())


def build_sfx(cues, total_frames):
    """Two layers on one timeline, at the frames the videos actually cut."""
    total = int(round(total_frames / FPS * SR))
    fx = np.zeros((total, 2))
    cache = {}
    used = {}
    for c in cues:
        f = c["file"]
        if f not in cache:
            cache[f] = ff_load(os.path.join(SFX_SRC, f))
        s = cache[f] * c["gain"]
        at = int(round(c["frame"] / FPS * SR))
        if at >= total:
            continue
        end = min(total, at + len(s))
        fx[at:end] += s[: end - at]
        used[f] = used.get(f, 0) + 1
    return fx, used


def main():
    if not os.path.isdir(SFX_SRC) or not os.listdir(SFX_SRC):
        print(f"SFX library not found at {SFX_SRC}", file=sys.stderr)
        return 2
    with open(os.path.join(BUILD, "cues-real.json"), encoding="utf8") as fh:
        plan = json.load(fh)

    os.makedirs(OUT, exist_ok=True)
    report = {}
    print(f"{'':7} {'track':26} {'bed LUFS':>9} {'sfx LUFS':>9} "
          f"{'bed pk':>7} {'sfx pk':>7} {'cues':>5}")

    for key, (track, seconds) in TRACKS.items():
        info = plan[key]
        bed, npass, stems = build_bed(track, seconds)
        fx, used = build_sfx(info["cues"], info["frames"])

        n = min(len(bed), len(fx))
        bed, fx = bed[:n], fx[:n]

        # Normalise each layer by LOUDNESS to the relationship their delivered
        # stems exhibit, then hold a common ceiling. Summing the two files at
        # unity in an editor reproduces the intended balance.
        bl0 = integrated_lufs(bed)
        bed *= 10 ** ((BED_TARGET_LUFS - bl0) / 20.0)
        fl0 = integrated_lufs(fx)
        if np.isfinite(fl0):
            fx *= 10 ** ((BED_TARGET_LUFS + SFX_OFFSET_LU - fl0) / 20.0)

        # One shared trim if either layer, or their sum, would exceed the
        # ceiling — applied to both so the balance survives it.
        ceiling = 10 ** (CEILING_DB / 20.0)
        worst = max(np.abs(bed).max(), np.abs(fx).max(), np.abs(bed + fx).max())
        if worst > ceiling:
            trim = ceiling / worst
            bed *= trim
            fx *= trim

        write_wav(os.path.join(OUT, f"sonicview-{key}-music-bed.wav"), bed)
        write_wav(os.path.join(OUT, f"sonicview-{key}-sfx-transitions.wav"), fx)

        bl, fl = integrated_lufs(bed), integrated_lufs(fx)
        report[key] = {
            "track": track, "seconds": seconds, "frames": info["frames"],
            "passes": npass, "stems": stems, "cues": len(info["cues"]),
            "distinct_sfx": len(used),
            "bed_lufs": round(bl, 2), "sfx_lufs": round(fl, 2),
            "bed_peak_db": round(true_peak_db(bed), 2),
            "sfx_peak_db": round(true_peak_db(fx), 2),
            "sfx_files": sorted(used),
        }
        print(f"{key:7} {track[:26]:26} {bl:9.2f} {fl:9.2f} "
              f"{true_peak_db(bed):7.2f} {true_peak_db(fx):7.2f} {len(info['cues']):5d}")

    with open(os.path.join(BUILD, "audio-report.json"), "w", encoding="utf8") as fh:
        json.dump(report, fh, indent=1)

    allsfx = sorted({f for r in report.values() for f in r["sfx_files"]})
    print(f"\n{len(allsfx)} distinct real sound files used, "
          f"{len(UNUSED_BY_CHOICE)} deliberately excluded "
          f"({', '.join(u[:-4] for u in UNUSED_BY_CHOICE)}).")
    print(f"6 distinct music tracks, no repeats.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
