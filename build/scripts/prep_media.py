#!/usr/bin/env python3
"""
Cut the 133 verified real assets and the 25 B-roll clips into render-ready form.

IMAGES. Each ledger entry is emitted at two widths -- one sized for the 1920x1080
parts and one for the 1080x1920 reels -- so neither canvas pays for the other's
resolution. Nothing is cropped: aspect ratio is preserved and the long edge is
bounded, because the complete-product rule means the whole object has to survive
into the frame.

CLIPS. The 25 clips are 1280x720 / 24 fps / 10.005 s with a generative AAC track.
Two things happen here:
  - The audio is STRIPPED. All sound in this production is synthesised from code;
    a video model's generated audio would both break that rule and fight the bed.
  - The video is left at its own resolution and re-timed to 30 fps by frame
    duplication rather than being upscaled. Upscaling 720p by 1.5x to fill a
    1080p frame produces visible softness; the scenes instead present clips in a
    plate at close to native scale, which is sharper AND is what generates the
    reliable blank space the contact layer needs.

REAL VIDEOS. The two product videos are 1600x500 / 23.976 fps. They are re-timed
to 30 fps at NATURAL SPEED -- never sped up, never reduced to a still -- and
otherwise left alone.

Source media is the repository root, overridable with SONICVIEW_MEDIA_DIR.
"""
import json
import os
import shutil
import subprocess
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MEDIA = os.environ.get("SONICVIEW_MEDIA_DIR", ROOT)
BUILD = os.path.join(ROOT, "build")
LEDGER = os.path.join(BUILD, "asset-ledger.json")
OUT_IMG = os.path.join(BUILD, "public", "img")
OUT_CLIP = os.path.join(BUILD, "public", "clips")

# Long-edge bounds. Landscape assets are shown up to ~1600 px wide inside the
# 1808 px content box; portrait shows them up to 952 px. 2x those for retina-ish
# crispness under a macroReveal, which magnifies up to 2.6x at its opening.
W_PART, W_REEL = 2200, 1400
JPEG_Q = 92

FFMPEG = None
for cand in (
    os.path.join(ROOT, "node_modules", "@remotion", "compositor-linux-x64-gnu", "ffmpeg"),
    shutil.which("ffmpeg") or "",
):
    if cand and os.path.exists(cand):
        FFMPEG = cand
        break


def load_ledger():
    with open(LEDGER, encoding="utf8") as fh:
        return json.load(fh)


def do_images(entries):
    os.makedirs(OUT_IMG, exist_ok=True)
    made, missing = 0, []
    for e in entries:
        if e["kind"] != "image":
            continue
        src = os.path.join(MEDIA, e["primary"])
        if not os.path.exists(src):
            missing.append(e["primary"])
            continue
        im = Image.open(src)
        im = im.convert("RGB") if im.mode not in ("RGB", "L") else im
        for tag, bound in (("p", W_PART), ("r", W_REEL)):
            dst = os.path.join(OUT_IMG, f"a{e['id']:03d}-{tag}.jpg")
            out = im.copy()
            if max(out.size) > bound:
                out.thumbnail((bound, bound), Image.LANCZOS)
            out.save(dst, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
            made += 1
    return made, missing


def ff(args):
    r = subprocess.run([FFMPEG, "-y", "-loglevel", "error", *args],
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip()[:400])


def do_clips():
    os.makedirs(OUT_CLIP, exist_ok=True)
    made, missing = 0, []
    for n in range(1, 26):
        hits = [f for f in os.listdir(MEDIA) if f.startswith(f"SV-BR-{n:02d} ") and f.endswith(".mp4")]
        if not hits:
            missing.append(f"SV-BR-{n:02d}")
            continue
        dst = os.path.join(OUT_CLIP, f"br{n:02d}.mp4")
        # -an strips the model's generative audio. -r 30 re-times without
        # resampling pixels; the clip keeps its own 1280x720 raster.
        ff(["-i", os.path.join(MEDIA, hits[0]), "-an",
            "-r", "30", "-c:v", "libx264", "-crf", "16",
            "-preset", "slow", "-pix_fmt", "yuv420p", dst])
        made += 1
    return made, missing


def do_real_videos(entries):
    made, missing = 0, []
    for e in entries:
        if e["kind"] != "video":
            continue
        src = os.path.join(MEDIA, e["primary"])
        if not os.path.exists(src):
            missing.append(e["primary"])
            continue
        dst = os.path.join(OUT_CLIP, f"v{e['id']:03d}.mp4")
        # Natural speed. -r re-times the container only; no setpts filter, so
        # the material plays at exactly the rate it was shot.
        ff(["-i", src, "-an", "-r", "30", "-c:v", "libx264", "-crf", "16",
            "-preset", "slow", "-pix_fmt", "yuv420p", dst])
        made += 1
    return made, missing


def main():
    if FFMPEG is None:
        print("No ffmpeg binary found.", file=sys.stderr)
        return 2
    entries = load_ledger()
    print(f"ledger: {len(entries)} distinct assets "
          f"({sum(1 for e in entries if e['kind'] == 'image')} images, "
          f"{sum(1 for e in entries if e['kind'] == 'video')} videos)")

    n_img, miss_img = do_images(entries)
    print(f"images  : {n_img} files written ({n_img // 2} assets x 2 widths)")
    n_clip, miss_clip = do_clips()
    print(f"b-roll  : {n_clip} clips transcoded, audio stripped, 24 -> 30 fps")
    n_vid, miss_vid = do_real_videos(entries)
    print(f"real vid: {n_vid} product videos re-timed at natural speed")

    missing = miss_img + miss_clip + miss_vid
    if missing:
        print("\nMISSING SOURCE MEDIA:", file=sys.stderr)
        for m in missing:
            print("  -", m, file=sys.stderr)
        print("\nPoint SONICVIEW_MEDIA_DIR at the directory holding the source files.",
              file=sys.stderr)
        return 1
    print("\nOK - all source media present and prepared.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
