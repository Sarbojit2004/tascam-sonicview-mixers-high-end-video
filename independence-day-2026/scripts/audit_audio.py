#!/usr/bin/env python3
"""Validates every generated audio asset actually decodes and carries signal.

Per file: ffprobe reports a real duration / stereo / 48 kHz, the decoded PCM is
non-silent, peak is below clipping, and the RMS envelope varies (i.e. it is not
a DC blob or one held tone). The two 60 s beds are additionally checked against
the 60.000 s target and printed as a coarse RMS contour so the energy shape can
be eyeballed without listening.

Also cross-checks that every cue name referenced from src/lib/sfx.ts has a
matching file on disk, and flags any file that nothing references.

    python3 scripts/audit_audio.py
"""
import os
import re
import shutil
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
VO_DIR = os.path.join(ROOT, "public", "vo")
SFX_TS = os.path.join(ROOT, "src", "lib", "sfx.ts")
TOL = 0.10
BEDS = {"music-bed": 60.0, "ambient-bed": 60.0}


def bin_for(name):
    env = os.environ.get(name.upper() + "_BIN")
    if env and os.path.exists(env):
        return env
    w = shutil.which(name)
    if w:
        return w
    pkg = "@ffmpeg-installer" if name == "ffmpeg" else "@ffprobe-installer"
    for base in (
        ROOT,
        "/tmp/claude-0/-home-user/91116a77-8d20-5e00-9928-f6519973d8de/scratchpad",
    ):
        p = os.path.join(base, "node_modules", pkg, "linux-x64", name)
        if os.path.exists(p):
            return p
    raise SystemExit(f"{name} not found")


FFMPEG = bin_for("ffmpeg")
FFPROBE = bin_for("ffprobe")

fails = []


def check(cond, msg, detail=""):
    print(f"    {'OK ' if cond else 'FAIL'}  {msg}{('  ' + detail) if detail else ''}")
    if not cond:
        fails.append(msg)


def probe(path):
    out = subprocess.run(
        [FFPROBE, "-v", "error", "-select_streams", "a:0", "-show_entries",
         "stream=sample_rate,channels,duration,codec_name", "-of", "default=nw=1", path],
        capture_output=True, text=True, check=True,
    ).stdout
    d = {}
    for line in out.strip().splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            d[k] = v
    return d


def pcm(path):
    raw = subprocess.run(
        [FFMPEG, "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", "48000", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype="<f4").reshape(-1, 2)


def contour(x, buckets=20):
    mono = x.mean(axis=1)
    seg = np.array_split(mono, buckets)
    rms = np.array([float(np.sqrt(np.mean(s.astype(np.float64) ** 2))) for s in seg])
    peak = rms.max() if rms.max() > 0 else 1.0
    bars = "▁▂▃▄▅▆▇█"
    return "".join(bars[min(7, int(r / peak * 7.999))] for r in rms)


def main():
    if not os.path.isdir(SFX_DIR):
        print("no public/audio/sfx directory")
        return 1

    files = sorted(f for f in os.listdir(SFX_DIR) if f.endswith(".mp3"))
    print(f"AUDIT  {len(files)} files in public/audio/sfx")
    print("=" * 72)

    for f in files:
        path = os.path.join(SFX_DIR, f)
        stem = f[:-4]
        print(f"\n  {stem}")
        try:
            meta = probe(path)
            x = pcm(path)
        except Exception as exc:  # noqa: BLE001
            check(False, "decodes", str(exc))
            continue

        dur = len(x) / 48000.0
        check(meta.get("channels") == "2", "stereo", f"ch={meta.get('channels')}")
        check(meta.get("sample_rate") == "48000", "48 kHz", f"sr={meta.get('sample_rate')}")
        check(dur > 0.02, "has duration", f"{dur:.3f}s")

        peak = float(np.abs(x).max())
        rms = float(np.sqrt(np.mean(x.astype(np.float64) ** 2)))
        check(peak > 0.02, "non-silent", f"peak={peak:.3f}")
        check(peak < 0.999, "not clipping", f"peak={peak:.3f}")
        check(rms > 0.0015, "carries signal", f"rms={rms:.4f}")

        mono = x.mean(axis=1).astype(np.float64)
        seg = np.array_split(mono, 12)
        seg_rms = np.array([np.sqrt(np.mean(s**2)) for s in seg])
        varies = seg_rms.max() > 0 and (seg_rms.std() / seg_rms.max()) > 0.02
        check(varies, "envelope varies (not a DC blob / held tone)")

        if stem in BEDS:
            want = BEDS[stem]
            check(abs(dur - want) <= TOL, f"is {want:.3f}s", f"actual {dur:.3f}s")
            # a constant bed must never fall to silence anywhere in its run
            floor = float(seg_rms.min() / seg_rms.max()) if seg_rms.max() > 0 else 0.0
            if stem == "ambient-bed":
                check(floor > 0.10, "ambient is genuinely CONSTANT (no dead segment)",
                      f"quietest/loudest = {floor:.3f}")
            print(f"    contour  {contour(x)}")

    # -- the VO slot: checked separately, since it is DELIBERATELY silent ---
    print("\n" + "=" * 72)
    print("  voiceover slot (public/vo)")
    vo_path = os.path.join(VO_DIR, "voiceover.mp3")
    if not os.path.exists(vo_path):
        check(False, "public/vo/voiceover.mp3 exists")
    else:
        try:
            meta = probe(vo_path)
            x = pcm(vo_path)
            dur = len(x) / 48000.0
            check(meta.get("channels") == "2", "stereo", f"ch={meta.get('channels')}")
            check(meta.get("sample_rate") == "48000", "48 kHz", f"sr={meta.get('sample_rate')}")
            check(abs(dur - 60.0) <= TOL, "is 60.000s", f"actual {dur:.3f}s")
            peak = float(np.abs(x).max())
            # the shipped placeholder must be silent; once a real recording is
            # dropped in, re-run this script and expect this line to flip to a
            # real peak — that's the intended signal a recording landed.
            print(f"    NOTE  placeholder peak={peak:.4f} "
                  f"({'silent, as shipped' if peak < 0.001 else 'a recording appears to be in place'})")
        except Exception as exc:  # noqa: BLE001
            check(False, "decodes", str(exc))

    # -- cross-reference against the cue table ------------------------------
    print("\n" + "=" * 72)
    print("  cue table cross-reference (src/lib/sfx.ts)")
    if not os.path.exists(SFX_TS):
        check(False, "src/lib/sfx.ts exists")
    else:
        src = open(SFX_TS, encoding="utf-8").read()
        refs = set(re.findall(r"'audio/sfx/([a-z0-9\-]+)\.mp3'", src))
        refs |= set(re.findall(r"staticFile\('audio/sfx/([a-z0-9\-]+)\.mp3'\)", src))
        on_disk = {f[:-4] for f in files}
        missing = sorted(refs - on_disk)
        unused = sorted(on_disk - refs)
        check(not missing, "every referenced cue has a file", ", ".join(missing) or "-")
        check(not unused, "every file is referenced", ", ".join(unused) or "-")
        print(f"    {len(refs)} referenced, {len(on_disk)} on disk")

    print("\n" + "=" * 72)
    if fails:
        print(f"FAILED — {len(fails)} check(s):")
        for f in fails:
            print("  - " + f)
        return 1
    print("ALL AUDIO CHECKS PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
