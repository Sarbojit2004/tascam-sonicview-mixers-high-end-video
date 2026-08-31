#!/usr/bin/env python3
"""
SONICVIEW EVENTS -> THE RECORDING SERIES' REAL SOUND LIBRARY.

Every file named here is an actual MP3 from
`tascam-recording-series-mixers-high-end-video/_superseded/public/audio/sfx/`.
Nothing is synthesised. The relative gains are that production's own range
(0.13 to 0.22 against a bed at 0.34), so the balance carries across.

TWO LAYERS, because "transition SFX" means both things in practice:

  TRANSITION  one sound on every scene change, from the whoosh/riser family,
              rotating so consecutive cuts never use the same sound. This is
              the layer that makes cuts feel intentional.

  ACCENT      one sound inside a beat where something MECHANICAL or DECISIVE
              happens on screen — a plate seats, a figure latches, a connector
              registers, a bank of faders is driven to position.

THREE FILES ARE DELIBERATELY UNUSED: sub-drop, impact-deep and whoosh-low. All
three are large low-frequency cinematic hits, which this pipeline's standing
principle rules out — they read as advertising and they mask a spoken figure.
The Recording Series shipped them; that does not oblige this production to use
them.
"""

# ── Layer 1 · one per scene change ────────────────────────────────────────
# Rotated in order, so no two consecutive transitions share a sound.
TRANSITIONS = [
    ("whoosh-soft.mp3", 0.15),
    ("transition-blip.mp3", 0.13),
    ("whoosh-air.mp3", 0.16),
    ("whoosh-swoop.mp3", 0.15),
    ("whoosh-bright.mp3", 0.14),
    ("whoosh-metal.mp3", 0.15),
    ("whoosh-rev.mp3", 0.14),
    ("riser-short.mp3", 0.16),
]

# ── Layer 2 · accents, by beat kind ───────────────────────────────────────
# `at` is frames into the beat. Gains sit in the Recording Series' own range.
ACCENT_FOR_KIND = {
    "cold":      {"file": "chapter-swell.mp3", "at": 8,  "gain": 0.18},
    "problem":   {"file": "swell-dark.mp3",    "at": 12, "gain": 0.17},
    "statement": {"file": "click-deep.mp3",    "at": 16, "gain": 0.14},
    "macro":     {"file": "sd-insert.mp3",     "at": 22, "gain": 0.16},
    "hero":      {"file": "brand-chime.mp3",   "at": 14, "gain": 0.20},
    "montage":   {"file": "gallery-tick.mp3",  "at": 12, "gain": 0.13},
    "specs":     {"file": "tick-double.mp3",   "at": 28, "gain": 0.16},
    "screen":    {"file": "click-ui.mp3",      "at": 20, "gain": 0.15},
    "broll":     {"file": "meter-ripple.mp3",  "at": 24, "gain": 0.14},
    "realvideo": {"file": "fader-slide.mp3",   "at": 16, "gain": 0.15},
    "bridge":    {"file": "chapter-out.mp3",   "at": 10, "gain": 0.17},
    "outro":     {"file": "chime-final.mp3",   "at": 10, "gain": 0.18},
}

# ── Layer 2 · accents for the five demonstratives ─────────────────────────
# Chosen per concept rather than per kind: each has a different physical event
# at its centre, landing at a different frame inside the animation.
ACCENT_FOR_DEMO = {
    # the difference amplifier cancelling — a ripple, not a hit
    "hdia":       {"file": "meter-ripple.mp3", "at": 100, "gain": 0.17},
    # the sum growing toward a ceiling it never reaches
    "summing":    {"file": "riser.mp3",        "at": 62,  "gain": 0.16},
    # the ST 2022-7 changeover. A relay click, because the point is that the
    # handover is a mechanical certainty and nothing is heard to fail.
    "redundancy": {"file": "relay-click.mp3",  "at": 150, "gain": 0.20},
    # a GPIO contact closing
    "afv":        {"file": "db25-lock.mp3",    "at": 46,  "gain": 0.19},
    # 100 mm motorised faders driven to position by a snapshot recall
    "recall":     {"file": "fader-slide.mp3",  "at": 60,  "gain": 0.22},
}

UNUSED_BY_CHOICE = ["sub-drop.mp3", "impact-deep.mp3", "whoosh-low.mp3"]
