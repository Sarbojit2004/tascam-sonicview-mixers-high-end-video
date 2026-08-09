# TASCAM Sonicview — Three 88-Second Vertical Reels

Source assets and the Remotion production for a three-part reel series on the **TASCAM Sonicview
digital mixing console ecosystem**, produced for **Shivansh Electronics — TASCAM's Authorized
Partner**.

| Part | Title | Covers | Output |
|---|---|---|---|
| 1 | **The Hub** | Sonicview 16XP, 24XP, and the 16dp / 24dp power-redundancy axis | `out/sonicview-reel-part1-hub.mp4` |
| 2 | **The Network** | Dante networking, the SB-16D stagebox, real-world proof points | `out/sonicview-reel-part2-network.mp4` |
| 3 | **The Protocol Layer** | The IF-Series expansion cards | `out/sonicview-reel-part3-protocol.mp4` |

Each part is exactly **88.000 s — 2,640 frames at 30 fps, 1080×1920**, and is an independently
renderable composition. Thumbnails are 1080×1920 to match.

---

## Asset inventory & the coverage contract

The repository root holds the raw media. `scripts/coverage.mjs` audits the compulsory-coverage
requirement against `src/lib/ledger.json`, which is the auditable record of how the raw files were
consolidated.

```
169  raw media filenames        (163 .jpg + 4 .png + 2 .mp4)
 -27 exact-duplicate groups     (identical MD5 — TASCAM cross-links the same photo
                                 under several product groupings)
 -6  perceptual near-duplicate groups (same photograph, re-encoded)
────
134  DISTINCT assets            (132 image clusters + 2 video clips)
 -3  logo files                 (TASCAM / Shivansh Electronics / Dante — excluded from
                                 all reel content by design; logos are added by hand later)
────
131  coverage-relevant assets   split 74 / 30 / 27 across Parts 1 / 2 / 3
```

Every one of those 131 assets must appear at least once across the three reels combined. The
ledger records, per asset, which raw filenames were merged into it and which part owns it, so the
count is reproducible rather than asserted.

```bash
node scripts/coverage.mjs      # fails if a built part leaves an allocated asset unplaced,
                               # or if a scene ever references one of the three logo files
```

**Video clips.** Both repository clips are 1600×500 ultra-wide banners at 23.976 fps. They are
trimmed to a single well-chosen segment each and played at **natural, unaltered speed** — never
sped up, never reduced to a still:

| Clip | Source window | Length | Where |
|---|---|---|---|
| `v133.mp4` | 16XP video, 1.0 – 3.5 s | 2.50 s (60 frames) | Part 1, VIEW interface scene |
| `v134.mp4` | 24XP video, 14.5 – 17.3 s | 2.84 s (68 frames) | Part 1, 24XP scale scene |

---

## Layout: light background, full-frame safe zone

There is **no reserved dead central square**. Content is composed across the whole 1080×1920 frame
against a light, clinical ground — the brief's Section 6 direction, so the dark matte Sonicview
chassis is always the darkest thing in shot. Placement follows a social safe-zone contract:

| Zone | Pixels | Rule |
|---|---|---|
| Top ambient | 0 – 250 | No text, no logos, no key detail. Blurred asset extension, measurement rails, drifting motes. |
| **Primary safe area** | **250 – 1580** | Headline, hero media, spec callouts, CTA, contact strip. |
| Bottom ambient | 1580 – 1920 | Same rule as the top strip. |
| Side margins | 72 px each edge | Everything critical stays inboard. |

Every text colour was verified numerically against the light ground (WCAG AA floor 4.5:1); most
clear AAA. Accent colours drop to only ~2.4:1 on the dark ink plate, so `accentOnDark()` supplies
8.6:1+ variants for the few places type sits on it.

---

## Typography

Ported structurally from the completed **MOTU UltraLite-mk5 / 828** reel
(`github.com/Sarbojit2004/motu-ultralitemk5-828`) — Barlow Condensed 600/700/800 for display,
Inter variable for UI and body, JetBrains Mono variable for technical figures. The woff2 files are
copied from that project and vendored under `public/fonts` so a render never depends on a network
fetch. Only the colour values are re-derived: the source was light-on-dark, this is dark-on-light.

The four hierarchy levels map onto the brief's Section 8 table — `Display` (headline claims),
`Sub` (medium, italic — the operational "why"), `Spec` (light monospace — verified numbers only),
`Micro` (small, expanded tracking — protocol data).

---

## Audio

Everything is synthesised from scratch with numpy/scipy — biquad filters, envelopes, comb-filter
reverb, stereo widening. **No external audio service is involved.**

```bash
python3 scripts/gen_audio.py     # 18 SFX + 3 music beds + 3 silent VO placeholders
python3 scripts/audit_audio.py   # every file decodes, is stereo/48 kHz, non-silent, correct length
```

The score follows the brief's Section 10 direction: ambient electronic / modern industrial /
cinematic IDM. Deep sweeping detuned-saw pads stand in for Class 1 HDIA preamp warmth; highly
quantized 16th-note ticking stands in for 96 kHz clocking and Dante IP packets. All three parts
share key, tempo and instrument set so the series reads as one score — only the energy contour
differs. Part 1 dips at the FPGA explanation and peaks at the dp failover; Part 3 stays at minimal
ticking precision through the dense IF-Series data and lifts only at the close of the series.

Voiceover is recorded separately. `public/vo/voiceover-reel-partN.mp3` is a silent 88 s placeholder
occupying the exact slot; the scripts are `VO_SCRIPT_REEL_PART{1,2,3}_*.md`. There are **no
burned-in captions** — on-screen typography is its own copy, never a transcript of the read.

---

## Build

```bash
npm install
python3 scripts/gen_audio.py && python3 scripts/audit_audio.py
npx tsc --noEmit
node scripts/coverage.mjs

npm run studio                      # preview
npm run render:p1                   # 88 s, ~15 min
node scripts/stills.mjs Part1Hub 60 250 470   # verification stills at full resolution
```

This environment blocks egress to `remotion.media`, so Remotion cannot download its own Chrome
Headless Shell. `remotion.config.ts` points it at the pre-installed Playwright Chromium headless
shell instead; override with `REMOTION_BROWSER` if the path differs.

---

## Editorial rules enforced throughout

- **No pricing, MRP or cost figure of any kind**, anywhere, in any part or thumbnail.
- **No competing console manufacturer** named, referenced or implied.
- **No "distributor", "dealer" or "reseller"** — Shivansh Electronics is *TASCAM's Authorized
  Partner*, consistently.
- **The CTA is a technical-consultation invitation**, never a purchase close.
- **No logo files in reel or thumbnail content** — the TASCAM, Shivansh Electronics and Dante logo
  assets are excluded at the ledger level so they cannot be referenced by accident. Logos baked
  into a sourced product photograph are left exactly as they are.
- Specifications are taken from the brief's verified master table. Anything the brief marks
  UNVERIFIED is omitted rather than stated.
- Parts 1 and 2 end with a continuation line into the next part; Part 3 ends with a close-of-series
  line. **Every part still carries the full Shivansh Electronics outro** — the continuity beat is
  additional to it, never a replacement.

---

# Long-Form Series — Three 298-Second Landscape Videos

The extended treatment of the same three-part story, part-for-part with the reels.

| Part | Title | Covers | Output |
|---|---|---|---|
| 1 | **The Hub** | Sonicview 16XP, 24XP, the dp power-redundancy axis | `out/sonicview-longform-part1-hub.mp4` |
| 2 | **The Network** | Dante, the SB-16D stagebox, two installation case studies | `out/sonicview-longform-part2-network.mp4` |
| 3 | **The Protocol Layer** | The IF-Series expansion cards, card by card | `out/sonicview-longform-part3-protocol.mp4` |

Each is exactly **298.000 s — 8,940 frames at 30 fps, 1920×1080**.

## What differs from the reels

- **Landscape, full-frame.** No social safe-zone contract and no top/bottom exclusion band. The one placement rule is a 52 px side inset for anything critical; background imagery and video may run to the true edge.
- **Logos are used, not excluded.** The reels deliberately carry no logo at all. The long-form videos carry all three — TASCAM, Shivansh Electronics and Dante — and every one is shown **directly on the background with no box, card or plate**. All three source assets ship with a white plate baked in, so `scripts/prep_logos.py` keys it out of the asset itself (see below).
- **Longer clip trims.** The reels take 2.5 s / 2.8 s of the two source clips; the long-form videos take 4.6 s / 5.6 s of the same windows (`v133-lf.mp4`, `v134-lf.mp4`). Both natural speed.
- **A constant ambient layer** runs under the music bed for the whole runtime.
- **Independent coverage.** Each series covers all 131 coverage-relevant assets on its own; they do not share a pool.

## Branding cadence — enforced from data, not asserted

`src/lib/lf-brand-plan.ts` declares every logo appearance once. `BrandingLayer` renders from it and `scripts/branding_audit.mjs` measures it, so picture and compliance report cannot disagree.

```bash
npm run branding            # timestamped appearance list + rule checks, all three parts
```

Rules enforced: no gap longer than 25 s without Shivansh Electronics; a Shivansh appearance inside every chapter; TASCAM a handful of times including mid-part; Dante only where Dante networking is the actual subject.

A branding **beat** is a full-frame interstitial — the chapter beneath washes to the page colour so the mark sits on the background with nothing behind it. That is deliberately not a box around the logo; it is the page coming forward.

## Build

```bash
npm install
npm run bootstrap           # rebuild public/img from source media, regenerate all audio, audit it
npx tsc --noEmit
npm run coverage:longform   # asset coverage for the long-form series
npm run branding            # branding cadence

npm run render:lf1          # 298 s, ~40 min
npm run thumb:lf1
node scripts/verify_render.mjs out/sonicview-longform-part1-hub.mp4
```

`npm run bootstrap` is the reproducibility step. `public/img` and `public/audio` are ~110 MB of *derived* files, so the project zip in `dist-zip/` ships the recipes rather than the output:

- `scripts/rebuild_media.py` re-copies every deduplicated image from the source media and re-cuts both clip trims. Point `SONICVIEW_MEDIA_DIR` at the directory holding the 169 raw files (defaults to the repository root).
- `scripts/gen_audio.py` and `scripts/gen_audio_longform.py` re-synthesise every SFX, bed and placeholder. Both use seeded RNG, so the output is byte-identical run to run.

### Rendering the zip standalone

```bash
unzip sonicview-longform-part1-project.zip -d sonicview
cd sonicview
export SONICVIEW_MEDIA_DIR=/path/to/the/169/source/files
npm install && npm run bootstrap && npm run render:lf1
```

## Chapter structure — Part 1

| # | Chapter | Frames |
|---|---|---|
| 01 | Cold open — the ecosystem premise | 420 |
| 02 | Four architectural pillars | 390 |
| 03 | Sonicview 16XP introduced | 540 |
| 04 | 16XP form factor & deployment | 450 |
| 05 | The VIEW touchscreen system *(clip)* | 660 |
| 06 | Motorized faders & tactile recall | 480 |
| 07 | The FPGA mixing engine | 690 |
| 08 | Latency — the 0.51 ms path | 420 |
| 09 | Class 1 HDIA preamps | 540 |
| 10 | Rear I/O & built-in networking | 480 |
| 11 | Onboard recording & USB | 390 |
| 12 | Sonicview 24XP — scale *(clip)* | 600 |
| 13 | 24XP control surface & workflow | 480 |
| 14 | The dp power-redundancy axis | 780 |
| 15 | dp across the lineup | 450 |
| 16 | Replacing a fixed-architecture desk | 390 |
| 17 | Continuation → Part 2 | 270 |
| 18 | CTA & Shivansh Electronics outro | 510 |
