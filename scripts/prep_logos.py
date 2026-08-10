#!/usr/bin/env python3
"""Prepares the three brand logos for direct-on-background compositing.

The long-form videos must show the TASCAM, Shivansh Electronics and Dante
logos "directly on screen as a plain image — not enclosed in a white box,
card, or plate". All three source assets, however, ship WITH a white plate
baked in: TASCAM is a black wordmark inside a white rounded pill, Shivansh is
black artwork inside a white rounded rectangle, and the Dante JPEG is a black
wordmark on a plain white square.

So the plate has to come out of the asset itself. These are dark-ink-on-white
artworks, which is exactly the case the "multiply" un-premultiply handles
correctly:

    alpha = 1 - min(R,G,B)/255
    color = (RGB - (1-alpha)*255) / alpha        (un-premultiplied)

Compositing that over any background reproduces what multiplying the original
over the background would have given — white areas vanish completely, greys
stay proportionally translucent, and anti-aliased glyph edges stay smooth
instead of gaining a halo. The logo artwork itself is never altered.

Output is cropped to the artwork's bounding box so callers can size by the
mark rather than by the plate's padding.

    python3 scripts/prep_logos.py
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "logo")
os.makedirs(OUT, exist_ok=True)

SOURCES = {
    "tascam": "TASCAM BRAND LOGO.png",
    "shivansh": "SHIVANSH ELECTRONICS BRAND LOGO.png",
    "dante": "DANTE LOGO.jpg",
}

# Below this min-channel value a pixel is treated as fully opaque ink; above
# WHITE it is treated as pure plate. Between the two, alpha ramps.
INK = 40.0
WHITE = 252.0


def key_white(path: str) -> Image.Image:
    im = Image.open(path)
    # Flatten any existing alpha onto white first, so the source's own
    # transparent margin and its white plate are treated identically.
    if im.mode in ("RGBA", "LA", "P"):
        rgba = im.convert("RGBA")
        base = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        base.alpha_composite(rgba)
        im = base.convert("RGB")
    else:
        im = im.convert("RGB")

    rgb = np.asarray(im, dtype=np.float64)
    mn = rgb.min(axis=2)

    alpha = np.clip((WHITE - mn) / (WHITE - INK), 0.0, 1.0)

    # Un-premultiply against white so the composite reproduces a multiply.
    a3 = alpha[:, :, None]
    safe = np.maximum(a3, 1e-6)
    color = (rgb - (1.0 - a3) * 255.0) / safe
    color = np.clip(color, 0.0, 255.0)
    color[alpha < 1e-6] = 0.0

    out = np.dstack([color, alpha * 255.0]).astype(np.uint8)
    return Image.fromarray(out, mode="RGBA")


def crop_to_content(im: Image.Image, pad: int = 6) -> Image.Image:
    a = np.asarray(im)[:, :, 3]
    ys, xs = np.where(a > 8)
    if len(ys) == 0:
        return im
    y0, y1 = max(0, ys.min() - pad), min(im.height, ys.max() + 1 + pad)
    x0, x1 = max(0, xs.min() - pad), min(im.width, xs.max() + 1 + pad)
    return im.crop((x0, y0, x1, y1))


def main() -> int:
    for name, src in SOURCES.items():
        p = os.path.join(ROOT, src)
        if not os.path.exists(p):
            print(f"  ! missing source: {src}")
            return 1
        keyed = crop_to_content(key_white(p))
        dst = os.path.join(OUT, f"{name}.png")
        keyed.save(dst)
        a = np.asarray(keyed)[:, :, 3]
        print(
            f"  {name:<9s} {os.path.basename(src):<38s} -> {keyed.width}x{keyed.height}"
            f"  ink coverage {float((a > 128).mean()) * 100:5.1f}%"
            f"  {os.path.getsize(dst) / 1024:6.1f} KB"
        )
    print("\nOK — keyed logos in public/logo/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
