#!/usr/bin/env python3
"""
Prepare the supplied branding artwork for use on a near-white page.

Two files need repair before they can be rendered. Both problems are in the
supplied artwork itself, not in how we use it.

  1. WEBSITE ICON.png ships a TRANSPARENCY CHECKERBOARD BAKED INTO ITS PIXELS.
     It is RGB with no alpha channel; 18.0% of it is (220,222,223) and 16.0% is
     (253,253,253) laid out in a regular grid. Whoever exported it flattened the
     checker preview into the image. Used as supplied it puts a grey checked
     square behind the website line at every one of its ~150 appearances across
     the six deliverables -- an artefact, and exactly the boxed treatment the
     branding rules forbid.

     Fix: derive alpha from luminance. The artwork is pure black linework on the
     checker, so luma >= HI is background (both checker tones sit at 220 and 253,
     comfortably above), luma <= LO is ink, and the ramp between preserves the
     anti-aliased edges. The result is a bare mark that sits on any ground.

  2. SHIVANSH ELECTRONICS BRAND LOGO.png is 97.9% opaque: the artwork sits on an
     opaque white ROUNDED RECTANGLE. On #F6F8FA that reads as a faint plate --
     the boxed logo the rules forbid.

     Fix: multiply un-premultiply. Treat the file as artwork composited over
     white and solve for the original: alpha = 1 - min(r,g,b), colour = the
     un-premultiplied remainder. Globe, wordmark, tagline and trademark glyph
     all survive; only the white rectangle behind them is removed.

     TASCAM BRAND LOGO.png is already 53.7% opaque -- plate-free as supplied --
     and is copied through untouched.

Every output is written to build/public/, verified, and reported.
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = ROOT
OUT_ICON = os.path.join(ROOT, "build", "public", "icon")
OUT_LOGO = os.path.join(ROOT, "build", "public", "logo")

# Luma thresholds for the checkerboard key. The checker tones are 220 and 253;
# HI sits below both so each is fully removed, LO keeps the black linework solid.
HI, LO = 208.0, 60.0

ICONS = {
    "FACEBOOK ICON.png": ("facebook.png", "rgba"),
    "INSTAGRAM ICON.webp": ("instagram.png", "rgba"),
    "WHATSAPP ICON.png": ("whatsapp.png", "rgba"),
    "YOUTUBE ICON.png": ("youtube.png", "rgba"),
    "WEBSITE ICON.png": ("website.png", "key-luma"),
}

LOGOS = {
    "SHIVANSH ELECTRONICS BRAND LOGO.png": ("shivansh.png", "unpremultiply"),
    # TASCAM needs the same treatment. Its file is 53.7% opaque, which looked
    # plate-free next to Shivansh's 97.9% -- but that figure describes the
    # BOUNDING BOX, not the artwork: 58.4% of its opaque pixels are near-white,
    # i.e. the wordmark sits on a white rounded pill inside a transparent
    # margin. Rendering it on #F6F8FA showed the pill plainly. An opacity
    # percentage cannot tell you whether a mark is boxed; only looking can.
    "TASCAM BRAND LOGO.png": ("tascam.png", "unpremultiply"),
}


def opaque_pct(im: Image.Image) -> float:
    a = np.asarray(im.convert("RGBA"))[..., 3].astype(np.float32)
    return 100.0 * float((a > 250).sum()) / a.size


# COLORS.ink from shared/theme.ts. The website mark is line art, not a coloured
# logo, so it should read as part of the typography rather than as a foreign
# pure black sitting next to #0E1116 text. Baked here, where it is exact and
# deterministic, rather than approximated at render time with a CSS filter
# chain.
INK = (0x0E, 0x11, 0x16)


def key_luma(im: Image.Image) -> Image.Image:
    """Alpha from luminance. For black linework flattened onto a light ground."""
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    luma = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    alpha = np.clip((HI - luma) / (HI - LO), 0.0, 1.0)
    out = np.zeros((*luma.shape, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = INK
    out[..., 3] = (alpha * 255.0 + 0.5).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def crop_to_artwork(im: Image.Image, thresh: int = 8) -> Image.Image:
    """
    Trim transparent margin so the file's aspect IS the artwork's aspect.

    This matters more than it sounds. Both logo files are 2372x714, but the
    artwork inside them fills very different fractions: Shivansh is 3.50:1 and
    TASCAM is 6.12:1. Laying either out from the FILE aspect (3.32:1) would
    stretch the TASCAM wordmark vertically by 1.84x. Cropping here means a
    component can size a mark by height and get the width right for free.
    """
    a = np.asarray(im.convert("RGBA"))[..., 3]
    ys, xs = np.nonzero(a > thresh)
    if len(xs) == 0:
        return im
    return im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def unpremultiply(im: Image.Image) -> Image.Image:
    """Recover artwork composited over an opaque white plate."""
    src = np.asarray(im.convert("RGBA")).astype(np.float32) / 255.0
    rgb, a0 = src[..., :3], src[..., 3:4]
    # Where the file is already transparent, keep it transparent.
    rgb = rgb * a0 + 1.0 * (1.0 - a0)
    alpha = 1.0 - rgb.min(axis=2, keepdims=True)
    safe = np.maximum(alpha, 1e-4)
    colour = np.clip((rgb - (1.0 - alpha)) / safe, 0.0, 1.0)
    out = np.concatenate([colour, alpha], axis=2)
    return Image.fromarray((out * 255.0 + 0.5).astype(np.uint8), "RGBA")


def run() -> int:
    os.makedirs(OUT_ICON, exist_ok=True)
    os.makedirs(OUT_LOGO, exist_ok=True)
    missing, rows = [], []

    for group, table, outdir in (("icon", ICONS, OUT_ICON), ("logo", LOGOS, OUT_LOGO)):
        for src_name, (dst_name, mode) in table.items():
            src = os.path.join(SRC, src_name)
            if not os.path.exists(src):
                missing.append(src_name)
                continue
            im = Image.open(src)
            before = opaque_pct(im) if im.mode in ("RGBA", "LA") else 100.0
            if mode == "key-luma":
                out = key_luma(im)
            elif mode == "unpremultiply":
                out = unpremultiply(im)
            else:
                out = im.convert("RGBA")
            out = crop_to_artwork(out)
            dst = os.path.join(outdir, dst_name)
            out.save(dst)
            rows.append((group, src_name, dst_name, im.size, im.mode, before, opaque_pct(out)))

    if missing:
        print("MISSING source artwork:", ", ".join(missing), file=sys.stderr)
        return 2

    print(f"{'':4} {'source':38} {'->':2} {'output':14} {'size':12} {'mode':5} "
          f"{'opaque% in':>10} {'out':>7}")
    for g, s, d, size, mode, b, a in rows:
        print(f"{g:4} {s[:38]:38} -> {d:14} {str(size):12} {mode:5} {b:9.1f}% {a:6.1f}%")

    # Assertions that would have caught both original defects.
    w = Image.open(os.path.join(OUT_ICON, "website.png"))
    if w.mode != "RGBA" or opaque_pct(w) > 60:
        print("\nFAIL: website icon still reads as a filled plate.", file=sys.stderr)
        return 1
    # Both marks must come out plate-free. The real test is not overall opacity
    # but whether the OPAQUE region is mostly white -- that is what a plate is.
    for mark in ("shivansh.png", "tascam.png"):
        arr = np.asarray(Image.open(os.path.join(OUT_LOGO, mark)).convert("RGBA")).astype(np.float32)
        alpha, rgb = arr[..., 3] / 255.0, arr[..., :3]
        solid = alpha > 0.98
        if not solid.any():
            continue
        luma = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
        white_share = float((luma[solid] > 240).mean())
        if white_share > 0.25:
            print(f"\nFAIL: {mark} is {white_share:.0%} white in its opaque region "
                  f"-- a plate is still present.", file=sys.stderr)
            return 1
        print(f"  check {mark:14} opaque region {white_share:.1%} white - plate-free")

    print("\nOK - website icon keyed, both logo plates removed, four icons passed through.")
    return 0


if __name__ == "__main__":
    raise SystemExit(run())
