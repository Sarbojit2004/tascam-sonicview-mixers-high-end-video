# Delivery — TASCAM Sonicview Ecosystem, Six Videos

Two complete series, three parts each, sharing one design system, one audio identity and one
asset ledger.

| # | Series | Part | File | Format | Runtime |
|---|---|---|---|---|---|
| 1 | Reel | The Hub | `out/sonicview-reel-part1-hub.mp4` | 1080×1920 · 2,640f | 88.043 s |
| 2 | Reel | The Network | `out/sonicview-reel-part2-network.mp4` | 1080×1920 · 2,640f | 88.043 s |
| 3 | Reel | The Protocol Layer | `out/sonicview-reel-part3-protocol.mp4` | 1080×1920 · 2,640f | 88.043 s |
| 4 | Long-form | The Hub | `out/sonicview-longform-part1-hub.mp4` | 1920×1080 · 8,940f | 298.048 s |
| 5 | Long-form | The Network | `out/sonicview-longform-part2-network.mp4` | 1920×1080 · 8,940f | 298.048 s |
| 6 | Long-form | The Protocol Layer | `out/sonicview-longform-part3-protocol.mp4` | 1920×1080 · 8,940f | 298.048 s |

All six: 30 fps, h264 + aac, verified by `scripts/verify_render.mjs` against the format contract
(resolution, frame count, duration within one frame, both streams present, audio carrying signal
with no silent stretch across a 22-bucket energy contour).

Alongside each video: a portrait or landscape **thumbnail** in `thumbnails/`, and a **voiceover
script** at the repository root (`VO_SCRIPT_*.md`) written to the chapter timings with per-segment
word counts and pause markers. The audio slots ship as silent placeholders of the exact runtime,
so a recorded read drops in without re-timing anything.

---

## What is checked rather than claimed

Four scripts measure the things the brief states as requirements. Each reads the same data the
videos render from, so the picture and the report cannot disagree.

```bash
npm run coverage            # reel series asset coverage
npm run coverage:longform   # long-form series asset coverage
npm run branding            # logo cadence, all three long-form parts
npm run compliance          # editorial rules across all six videos
npm run audio               # regenerate and audit every SFX, bed and placeholder
```

### Asset coverage — 131 / 131 in each series, independently

The 169 supplied files deduplicate to **134 distinct assets**: 27 exact-duplicate groups (identical
MD5) and 6 perceptual near-duplicate groups, each verified by eye before merging. Three are logos
(excluded from coverage and handled separately), leaving **131 coverage-relevant assets**.

| Series | Part 1 | Part 2 | Part 3 | Total |
|---|---|---|---|---|
| Reel | 74 | 30 | 27 | **131 / 131** |
| Long-form | 74 | 30 | 27 | **131 / 131** |

Every asset appears at **primary tier** — as a hero plate, in a mosaic or as a clip — not merely
as a blurred backdrop. The auditor distinguishes the two and reports ambient-only placements as a
failure, so "covered" cannot be satisfied by hiding an image behind a wash.

The full record is `src/lib/ledger.json`: 134 entries, each carrying its source filename, the
filenames merged into it, and the part it is allocated to.

### Branding cadence — long-form only

`src/lib/lf-brand-plan.ts` declares every logo appearance once. `BrandingLayer` renders from it and
`scripts/branding_audit.mjs` measures it.

| | Part 1 | Part 2 | Part 3 |
|---|---|---|---|
| Shivansh appearances (incl. outro) | 18 | 17 | 18 |
| Longest gap without Shivansh | 14.7 s | 13.3 s | 12.7 s |
| Shivansh in every chapter | ✓ | ✓ | ✓ |
| TASCAM appearances (body + outro) | 5 | 4 | 4 |
| TASCAM mid-part | 3 | 2 | 2 |
| Dante appearances | 2 | 5 | 2 |

Against a guideline of no gap longer than 25 s and a hard limit of 30 s. Dante is deliberately not
on a cadence — it appears only where Dante networking is the subject on screen, which is why Part 2
carries five and the other two carry two each.

No component in the branding layer draws a card, box or plate behind a logo. The source artwork's
white plates were keyed out by `scripts/prep_logos.py` (multiply un-premultiply) precisely so the
marks could sit directly on the page. A branding **beat** is a full-frame interstitial — the
chapter beneath washes to the page colour so the mark stands on the background with nothing behind
it, rather than a box being drawn around it.

**The reels carry no logo at all**, as specified.

### Editorial rules

`npm run compliance` — all four pass across the six videos' on-screen copy, both thumbnail sets and
all six VO scripts:

1. No pricing, MRP or cost framing of any kind.
2. No competing console brand, named or alluded to.
3. Shivansh Electronics described only as **TASCAM's Authorized Partner** — never distributor,
   dealer or reseller. Checked positively, not merely for absence of the wrong words.
4. The CTA is a technical consultation, never a purchase close.

The pricing check is broader than literal figures on purpose. Writing it that way found four
breaches that a figure-only reading missed — "expensive", "budget line", "costs a fraction of",
"line item" — two of them on screen in already-rendered Part 2 videos, which were re-rendered.

### Audio

45 files, 0 failures. Every sound effect, music bed and ambient layer is **synthesised from code**
in `scripts/gen_audio.py` and `scripts/gen_audio_longform.py` — biquad filters, ADSR envelopes,
comb-filter reverb and stereo widening over numpy, with seeded RNG so output is byte-identical run
to run. Nothing came from ElevenLabs or any external audio service.

---

## Format differences between the two series

| | Reels | Long-form |
|---|---|---|
| Canvas | 1080×1920 portrait | 1920×1080 landscape |
| Layout contract | Instagram safe zone — ambient 0–250 and 1580–1920, primary 250–1580, 64–90 px side margins | Full frame, 52 px side inset for critical content only |
| Logos | **None anywhere** | TASCAM, Shivansh Electronics, Dante — direct on the background |
| Clip trims | 2.5 s / 2.8 s | 4.6 s / 5.6 s of the same windows |
| Ambient layer | — | Constant 298 s texture under the music bed |
| Scenes / chapters | 12 / 10 / 11 | 18 / 16 / 15 |

Palette, type system and SFX identity are shared, so the two formats read as one body of work.
Every text colour is verified against WCAG: `ink` 17.19:1, `inkSoft` 10.05:1, `inkDim` 5.32:1 on
the paper background; the three part accents 7.17:1, 5.57:1 and 5.94:1; and a separate
`accentOnDark` set at 8.66:1 for accents on the dark screen plates.

---

## Reproducibility

`dist-zip/sonicview-longform-part{1,2,3}-project.zip` — 63 source files, ~714 KB each. `public/img`
and `public/audio` are ~110 MB of *derived* files, past GitHub's per-file limit, so the zips ship
the recipes rather than the output:

```bash
unzip sonicview-longform-part2-project.zip -d sonicview
cd sonicview
export SONICVIEW_MEDIA_DIR=/path/to/the/169/source/files
npm install && npm run bootstrap && npm run render:lf2
```

`npm run bootstrap` re-cuts every deduplicated image and both clip trims from the source media,
then re-synthesises all audio and audits it. `scripts/pack_project.py` builds the zips
deterministically — sorted entries, fixed timestamps — and refuses to pack if any file the archive
cannot build without is missing.

---

## Two things worth knowing

**IF-MA64/BN is not in Part 3.** The brief documents six IF-Series cards; the asset set contains
photographs of five. Rather than invent a scene, the card is omitted and its coaxial-BNC story is
told on IF-MA64/EX, which physically carries both optical and coaxial MADI connectors. This is the
one documented product that the videos do not cover, and it is a deliberate omission rather than
an oversight.

**Long-form Part 2, chapter 2** discusses the analog multicore under photography of the SB-16D,
because the asset set has no multicore image. The column is labelled for what it actually shows —
the replacement — rather than letting the picture imply something untrue.
