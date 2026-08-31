#!/usr/bin/env python3
"""
THE TWO STANDALONE AUDIO DELIVERABLES PER VIDEO.

The brief asks for, alongside each rendered MP4:

  1. the full music-bed mix AS DEPLOYED, and
  2. the transition-SFX layer ON ITS OWN TIMELINE at the exact positions used,

both spanning that deliverable's exact runtime as single continuous synced
files. So neither is a loop or a bag of one-shots: each is one file, exactly
5,340 or 8,940 frames long at 30 fps, that will line up against the video on a
timeline with no offset.

Positions and gains are read from the SAME beat lists and SFX map the videos
render from, via a JSON cue sheet emitted by scripts/emit_cues.mts. There is no
second copy of the timing to drift out of sync.
"""
import json
import os
import sys
import wave

import numpy as np

SR = 48000
FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, "public", "audio")
OUT = os.path.join(ROOT, "out", "audio")
CUES = os.path.join(ROOT, "cues.json")

# Same levels the videos deploy (shared/deliverable.tsx).
BED_GAIN = 0.34


def read_wav(path):
    with wave.open(path, "rb") as w:
        n, ch = w.getnframes(), w.getnchannels()
        raw = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float32) / 32768.0
    return raw.reshape(-1, ch) if ch > 1 else np.stack([raw, raw], axis=1)


def write_wav(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    if not os.path.exists(CUES):
        print("cues.json missing — run scripts/emit_cues.mts first", file=sys.stderr)
        return 2
    cues = json.load(open(CUES, encoding="utf8"))
    os.makedirs(OUT, exist_ok=True)

    for key, info in cues.items():
        total = int(round(info["frames"] / FPS * SR))

        # 1 · the bed, as deployed (same gain the video applies)
        bed = read_wav(os.path.join(AUDIO, f"{info['bed']}.wav")) * BED_GAIN
        if len(bed) < total:
            bed = np.pad(bed, ((0, total - len(bed)), (0, 0)))
        bed = bed[:total]
        write_wav(os.path.join(OUT, f"sonicview-{key}-music-bed.wav"), bed)

        # 2 · the SFX layer alone, at the exact frames used
        fx = np.zeros((total, 2), dtype=np.float32)
        for cue in info["sfx"]:
            s = read_wav(os.path.join(AUDIO, "sfx", cue["file"])) * cue["gain"]
            at = int(round(cue["frame"] / FPS * SR))
            end = min(total, at + len(s))
            if at < total:
                fx[at:end] += s[: end - at]
        write_wav(os.path.join(OUT, f"sonicview-{key}-sfx-layer.wav"), fx)

        peak_bed = float(np.max(np.abs(bed)))
        peak_fx = float(np.max(np.abs(fx)))
        print(
            f"  {key:6s} {info['frames']:5d}f = {info['frames'] / FPS:7.3f}s  "
            f"bed peak {peak_bed:.3f}  sfx {len(info['sfx']):2d} cues, peak {peak_fx:.3f}"
        )

    print(f"\n12 files written to out/audio/ — a music bed and an SFX layer per deliverable.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
