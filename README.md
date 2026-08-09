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
