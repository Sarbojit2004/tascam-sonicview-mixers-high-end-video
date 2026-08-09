#!/usr/bin/env python3
"""Rebuilds public/img from the repository's source media, using the ledger.

The project zip deliberately ships WITHOUT public/img and public/audio: those
two directories are ~110 MB of derived files, which would push the archive past
GitHub's 100 MB per-file limit. Both are fully regenerable, so the zip carries
the recipes instead of the output.

This script regenerates public/img:
  · copies the chosen representative of every deduplicated image cluster from
    the source media directory to public/img/<slug>
  · re-creates the two video trims at natural speed, with the exact source
    windows the chapters were cut against

Source media defaults to the repository root (where the 169 raw files live);
override with SONICVIEW_MEDIA_DIR.

    python3 scripts/rebuild_media.py

Audio is regenerated separately and deterministically by:
    python3 scripts/gen_audio.py
    python3 scripts/gen_audio_longform.py
"""
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.environ.get("SONICVIEW_MEDIA_DIR", ROOT)
OUT = os.path.join(ROOT, "public", "img")

# Source windows for the two clips. Natural speed, never altered — these are the
# exact trims the long-form chapters and the reels were cut against.
# id -> (source file, start seconds, reel duration, long-form duration).
# Same source window for both series; the reels take the shorter trim (1-3 s
# per appearance) and the long-form videos the longer one (3-6 s).
TRIMS = {
    133: ("TASCAM Sonicview 16XP - TASCAM Sonicview 16dp VIDEO.mp4", 1.0, 2.5, 4.6),
    134: ("TASCAM Sonicview 24XP-TASCAM Sonicview 24dp VIDEO.mp4", 14.5, 2.8, 5.6),
}


def find_ffmpeg() -> str:
    env = os.environ.get("FFMPEG_BIN")
    if env and os.path.exists(env):
        return env
    w = shutil.which("ffmpeg")
    if w:
        return w
    for base in (
        "/tmp/claude-0/-home-user/0e819879-0732-5152-8fe9-14ac7391b2c6/scratchpad",
        ROOT,
    ):
        p = os.path.join(base, "node_modules", "@ffmpeg-installer", "linux-x64", "ffmpeg")
        if os.path.exists(p):
            return p
    raise SystemExit("ffmpeg not found; set FFMPEG_BIN")


def main() -> int:
    ledger = json.load(open(os.path.join(ROOT, "src", "lib", "ledger.json")))
    os.makedirs(OUT, exist_ok=True)
    ff = find_ffmpeg()

    copied = trimmed = skipped = missing = 0
    for e in ledger:
        if not e["slug"]:
            skipped += 1  # one of the three excluded logo files
            continue
        dst = os.path.join(OUT, e["slug"])

        if e["kind"] == "video":
            src_name, start, reel_dur, lf_dur = TRIMS[e["id"]]
            src = os.path.join(MEDIA, src_name)
            if not os.path.exists(src):
                print(f"  ! missing source video: {src_name}")
                missing += 1
                continue
            for dur, out in ((reel_dur, dst), (lf_dur, dst.replace(".mp4", "-lf.mp4"))):
                subprocess.run(
                    [ff, "-v", "error", "-y", "-ss", str(start), "-t", str(dur), "-i", src,
                     "-an", "-c:v", "libx264", "-crf", "17", "-preset", "slow",
                     "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
                    check=True,
                )
                trimmed += 1
            continue

        src = os.path.join(MEDIA, e["source"])
        if not os.path.exists(src):
            print(f"  ! missing source image: {e['source']}")
            missing += 1
            continue
        shutil.copy2(src, dst)
        copied += 1

    print(f"\nimages copied : {copied}")
    print(f"clips trimmed : {trimmed}")
    print(f"logos skipped : {skipped}  (excluded from reel content by design)")
    if missing:
        print(f"\n✗ {missing} source file(s) missing — point SONICVIEW_MEDIA_DIR at the")
        print("  directory holding the 169 raw media files and run again.")
        return 1
    print(f"\nOK — {copied + trimmed} files in public/img")
    return 0


if __name__ == "__main__":
    sys.exit(main())
