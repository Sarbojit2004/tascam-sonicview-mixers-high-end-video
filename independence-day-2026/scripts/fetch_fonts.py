#!/usr/bin/env python3
"""Vendors every woff2 face this reel uses into public/fonts.

Fonts are vendored rather than fetched at render time so an 1800-frame render
never depends on the network, and so the project stays reproducible if the
Google Fonts CDN is unreachable later. `coollabsio/fonts` is the documented
fallback CDN for this project; it serves the same faces, so the vendored files
are byte-identical in either case and this script only needs one source.

Each family is fetched through the css2 API with a desktop User-Agent (which is
what makes Google serve woff2 rather than ttf), then the @font-face block for
the wanted unicode subset is picked out by its preceding /* subset */ comment
and its src URL downloaded.

    python3 scripts/fetch_fonts.py
"""
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, "public", "fonts")
os.makedirs(DEST, exist_ok=True)

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
CSS = "https://fonts.googleapis.com/css2?family={}&display=block"

# (output filename, css2 family spec, wanted subset, wanted css weight)
FACES = [
    # -- Latin display: Playfair Display. High-contrast transitional serif;
    #    dignified and celebratory where a condensed grotesque would read as a
    #    product spec sheet.
    ("playfair-700.woff2", "Playfair+Display:wght@700", "latin", "700"),
    ("playfair-900.woff2", "Playfair+Display:wght@900", "latin", "900"),
    # -- Latin UI/body: Inter. Neutral humanist, lets the serif carry emotion.
    ("inter-400.woff2", "Inter:wght@400", "latin", "400"),
    ("inter-600.woff2", "Inter:wght@600", "latin", "600"),
    # -- Technical micro-labels and date stamps.
    ("jbm-500.woff2", "JetBrains+Mono:wght@500", "latin", "500"),
    # -- Indic + Perso-Arabic. Beat 12 sets the country's name in eleven
    #    scripts, so each one needs a face that actually renders it correctly;
    #    a Latin fallback would produce tofu.
    ("noto-deva.woff2", "Noto+Serif+Devanagari:wght@600", "devanagari", "600"),
    ("noto-beng.woff2", "Noto+Serif+Bengali:wght@600", "bengali", "600"),
    ("noto-taml.woff2", "Noto+Serif+Tamil:wght@600", "tamil", "600"),
    ("noto-telu.woff2", "Noto+Serif+Telugu:wght@600", "telugu", "600"),
    ("noto-knda.woff2", "Noto+Serif+Kannada:wght@600", "kannada", "600"),
    ("noto-gujr.woff2", "Noto+Serif+Gujarati:wght@600", "gujarati", "600"),
    ("noto-guru.woff2", "Noto+Serif+Gurmukhi:wght@600", "gurmukhi", "600"),
    ("noto-mlym.woff2", "Noto+Serif+Malayalam:wght@600", "malayalam", "600"),
    ("noto-orya.woff2", "Noto+Serif+Oriya:wght@600", "oriya", "600"),
    ("noto-arab.woff2", "Noto+Naskh+Arabic:wght@600", "arabic", "600"),
]

BLOCK = re.compile(
    r"/\*\s*(?P<subset>[a-z0-9\-\[\] ]+)\s*\*/\s*@font-face\s*\{(?P<body>[^}]*)\}",
    re.I,
)


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def pick(css: str, subset: str, weight: str):
    """Return the woff2 URL for the given subset + weight, or None."""
    for m in BLOCK.finditer(css):
        if m.group("subset").strip().lower() != subset.lower():
            continue
        body = m.group("body")
        w = re.search(r"font-weight:\s*([^;]+);", body)
        if w and weight not in w.group(1):
            continue
        u = re.search(r"url\((https://[^)]+\.woff2)\)", body)
        if u:
            return u.group(1)
    return None


def main() -> int:
    bad = []
    for fname, family, subset, weight in FACES:
        dest = os.path.join(DEST, fname)
        try:
            css = get(CSS.format(family)).decode("utf-8")
            url = pick(css, subset, weight)
            if not url:
                bad.append(f"{fname}: no '{subset}' @ {weight} block in {family}")
                continue
            data = get(url)
            if len(data) < 1000 or data[:4] != b"wOF2":
                bad.append(f"{fname}: payload is not a woff2 ({len(data)} B)")
                continue
            with open(dest, "wb") as fh:
                fh.write(data)
            print(f"  {fname:<22s} {subset:<12s} {len(data):>7d} B")
        except Exception as exc:  # noqa: BLE001 - report and keep going
            bad.append(f"{fname}: {exc}")

    if bad:
        print("\nFAILED:")
        for b in bad:
            print("  " + b)
        return 1
    print(f"\nOK - {len(FACES)} faces vendored to public/fonts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
