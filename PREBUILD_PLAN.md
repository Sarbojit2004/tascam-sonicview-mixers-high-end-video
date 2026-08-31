# Pre-Build Plan — TASCAM Sonicview, Six Deliverables

Three 178 s portrait reels (1080×1920) + three 298 s landscape parts (1920×1080), each a
standalone video with its own opening, its own end screen and its own thumbnail.

Nothing in this document is built yet. It exists to be checked before code is written.

---

## 0. What is excluded

### 0.1 The prior Sonicview production — located, and not built from

It is present in this repository and I have identified it precisely so it can be avoided rather
than accidentally reused:

| Prior artefact | Path |
|---|---|
| Reel scenes | `src/scenes/part1.tsx`, `part2.tsx`, `part3.tsx` |
| Long-form scenes | `src/scenes/lf/part1.tsx`, `part2.tsx`, `part3.tsx` |
| Compositions | `src/Root.tsx`, `src/LFPart{1,2,3}.tsx` |
| Design system | `src/lib/theme.ts`, `src/lib/fonts.ts`, `src/lib/ledger.json`, `src/lib/lf-brand-plan.ts` |
| Components | `src/components/**`, incl. `lf/LFBrand.tsx`, `lf/Logo.tsx` |
| Renders | `out/sonicview-reel-part{1,2,3}-*.mp4`, `out/sonicview-longform-part{1,2,3}-*.mp4` |
| Thumbnails | `thumbnails/**` |
| Records | `DELIVERY.md`, `VO_SCRIPT_*.md` (six), `dist-zip/**` |

**No creative or technical choice is being taken from any of it** — not a scene structure, not a
palette, not a branding placement, not a beat length, not an asset allocation. The new build lands
in a new directory tree (`build/`, §4.3) and takes its values from the four named reference
repositories instead.

Two mechanical, non-creative facts are re-derived from scratch rather than read out of the old
build: the asset inventory (§2) and the deduplication (§2.2). I did **not** read
`src/lib/ledger.json`; I re-enumerated the directory and re-ran the hashing independently, and the
result differs from the old ledger — see §2.2, which is the reason re-deriving mattered.

### 0.2 The 25 B-roll clips — all present, all verified

All 25 are in the repository and probe identically:

```
1280×720 · 24 fps · 240 frames · 10.005 s · h264 + aac    (×25, no exceptions)
```

| # | Title | # | Title |
|---|---|---|---|
| 01 | The Node, Not the Desk | 14 | The Second Supply |
| 02 | Instrumentation Grade | 15 | Assigned |
| 03 | Inside the Gain Stage | 16 | Thirty-Two Tracks, No Computer |
| 04 | Two Samples | 17 | The Protocol Layer |
| 05 | Primary and Secondary | 18 | One Engine, Two Footprints |
| 06 | The Card That Joins the Fabric | 19 | In Service |
| 07 | Sixteen Inputs, One Run | 20 | Seating the Run |
| 08 | Stacked at the Stage End | 21 | On Air |
| 09 | Gain, From the Desk | 22 | Cased and Rolling |
| 10 | Tally to Fader | 23 | The Curve |
| 11 | Three Screens, One Engine | 24 | The Sixteen |
| 12 | The Layer Beneath | 25 | Two Slots, Two Answers |
| 13 | Anywhere on the Network | | |

Filenames match `BROLL_PROMPTS_SONICVIEW.md` one-for-one; each clip's scenario, real-image anchor(s)
and Sonicview model are recorded there and carried into the build's own clip manifest.

**No gaps. Nothing to report as missing.** Two consequences worth stating now:

- **720p into 1080p.** The clips are below both canvases. Rather than upscale 1.5× and ship soft
  footage, clips play inside a framed plate on the light page at close to native scale (≈1280–1600
  px wide on landscape; 952 px wide on portrait, which is a *down*-scale and therefore crisper than
  native). This is also what creates the reliable blank space that §6.2 marketing needs.
- **Clip audio is muted.** Every clip carries a generative AAC track from the video model. The
  production's sound is synthesised from code (§7), so importing model-generated audio would both
  break that rule and fight the bed. `volume={0}` on every clip, checked by the audio audit.

---

## 1. What is pulled from the four reference productions, and from which one

| Value | Exact figure | Pulled from | Path inspected |
|---|---|---|---|
| **Type system** | `Archivo` (technical grotesque) + `Fraunces` (editorial serif); helpers `headline/subhead/spec/micro/editorial` | **MOTU M-Series** | `portrait/src/fonts.ts`, `longform/src/fonts.ts`; faces in `_shared/fonts/*.woff2` |
| **Palette (ground)** | `paper #F6F8FA` · `paperLift #FDFEFE` · `paperEdge #EFF2F6` · `paperWell #E7EBF1` | **MOTU M-Series** → confirmed already in force in **TASCAM Recording Series** | M-Series `longform/src/theme.ts`; RS `build/shared/theme.ts` |
| **Palette (type)** | `ink #0E1116` 17.9:1 · `inkSoft #20272F` 12.6:1 · `slate #48525F` 7.6:1 · `slateDim #6B7684` 4.6:1 | same | same |
| **Accent** | `accent #8A3A12` 7.4:1 · `accentSoft #B4610A` 4.9:1 (TASCAM panel amber, **not** MOTU blue) | **TASCAM Recording Series** | `build/shared/theme.ts` |
| **Semantic colours** | `signal #00845F` · `alert #B32218` | MOTU AVB → M-Series → RS, unchanged | same |
| **Portrait caption-safe zone** | **top 180 · bottom 220 · marginX 64** → content band y 180→1700 (1520 tall), 952 wide | **MOTU AVB portrait reels** → AVB compressed-reel → **M-Series portrait** → **RS** | M-Series `portrait/src/theme.ts`; RS `build/shared/theme.ts` |
| **Landscape edge inset** | **marginX 56 · marginY 52** → 1808 × 976 content box; ambient may bleed to true edge | **MOTU AVB long-form** → M-Series long-form → RS | M-Series `longform/src/theme.ts` |
| **Camera / motion vocabulary** | `EASE_OUT` bezier(0.16,1,0.3,1) · `EASE_IN_OUT` bezier(0.65,0,0.35,1) · `ramp` · `linear` (constant-velocity gimbal drift) · `beatOpacity` · `macroReveal(startScale 2.6, resolveAt 0.72)` · `gimbal` · `platePush` | **all four**, consolidated in **TASCAM Recording Series** | RS `build/shared/anim.ts` |
| **Complete-product / no-crop rule** | Enforced by construction: `macroReveal`'s scale curve terminates at exactly 1.0 by `resolveAt` and holds; `platePush` scales the *plate*, never the image inside a fixed frame | **MOTU M-Series** `LFMedia` approach, consolidated in RS | RS `build/shared/anim.ts`, `media.tsx` |
| **Demonstrative-animation category** | Node cards + orthogonal polylines with packets riding them, geometry solved in pure JS (no `getTotalLength()`), every figure routed through `specValue()` so UNVERIFIED cannot leak on screen | **TASCAM Recording Series** (`TriPathSplitter`, `DB25Injection`, `TimecodePulse` — concept only, contents replaced per §3) | RS `build/shared/concepts.tsx` |
| **178 s portrait precedent** | Canvas + duration + beat proportioning for a standalone reel | **MOTU M-Series** (`VO_SCRIPT_MOTU_M_SERIES_PORTRAIT_178S.md`, `portrait/`) | M-Series `portrait/**` |
| **298 s landscape precedent** | Canvas + duration | **MOTU M-Series** (`longform/`, 298 s) | M-Series `longform/**` |
| **Contact-set wording** | "Authorized Partner of TASCAM", no territory clause; five channels; the three numbers as one channel | **TASCAM Recording Series** | RS `build/shared/brand.ts` |
| **Branding architecture** | End-screen-only logos + rotating in-body contact strips + slot planner + audit | **TASCAM Recording Series** (post-correction) | RS `build/shared/{logo,contact,contactplan,branding}.tsx/.ts` |
| **Audio pipeline** | `synth_sfx.py`, `build_music.py`, `audit_audio.py` | **TASCAM Recording Series** | RS `build/scripts/` |

**Pushing it further than the predecessors**, per the standing instruction — planned, and listed so
it can be held to:

1. **Five demonstratives, not three**, and each one longer and more resolved (20–24 s vs the RS
   average). Two of them (the summing matrix and the packet-flow) are genuinely 2.5-D rather than
   flat schematic.
2. **A continuous focus model on media plates.** RS pushed plates; this build adds a focus-pull term
   so the plate's frame and its contents resolve at different rates during `macroReveal`, which is
   what makes the macro-to-full move read as a camera rather than a zoom.
3. **The contact layer becomes typographic rather than a badge.** Strips slide with a per-glyph
   stagger on entry instead of fading a block, so the marketing layer moves with the same grammar as
   the headline type.
4. **Per-scene collision geometry is computed, not declared.** RS declared free corners per beat
   kind by hand. This build computes each beat's occupied rectangles from the same layout constants
   the scene renders from, and the planner picks from what is actually free — so a layout change
   cannot silently invalidate the placement table (§6.2).

---

## 2. The real asset library

### 2.1 Enumeration

Enumerated by directory listing of the repository root (not by filename pattern-matching against
the old build). Excluding the 8 branding/icon files and the 25 B-roll clips:

**166 real product files — 164 images + 2 videos.**

The two real videos, which follow the standing natural-speed rule (never sped up, never reduced to a
still frame):

| File | Resolution | Duration | fps |
|---|---|---|---|
| `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp VIDEO.mp4` | 1600×500 | 13.514 s | 23.976 |
| `TASCAM Sonicview 24XP-TASCAM Sonicview 24dp VIDEO.mp4` | 1600×500 | 20.896 s | 23.976 |

Both are 3.2:1 banner crops. At native width on the landscape canvas they occupy a 500 px band,
which leaves genuine blank space above and below — used for §6.2 placement rather than filled.

### 2.2 Deduplication — verified by pixel content, not by filename

Three passes, in order:

1. **MD5.** 27 exact-duplicate groups, collapsing 29 files → **137 distinct**.
2. **Perceptual (aHash + dHash, union-find).** Flagged 17 candidate groups.
3. **Pixel verification of every candidate** — normalised-RMS difference on 256×256 luma, plus
   visual inspection of each group and a full-resolution crop of every baked-in model caption.

**Only 4 of the 17 candidate groups are real duplicates.** The other 13 are distinct images that a
perceptual hash cannot tell apart. Merging them would have been a substantive error:

| Candidate | RMS | Verdict |
|---|---|---|
| `TASCAM IF-AE16.jpg` ~ `TASCAM IF-AN16 OUT.jpg` | 0.4451 | **DIFFERENT PRODUCTS.** Faceplates read `AES/EBU` and `ANALOG OUT`. Merging would have deleted a documented IF-Series card from coverage. |
| `...16dp (11)` ~ `(16)` ~ `(19)` ~ `(1)` | 0.37–0.63 | **DIFFERENT.** Captions read `Sonicview 16dp`, `Sonicview 16XP`, `Sonicview 16XP`, and one uncaptioned. |
| `...24dp (11)` ~ `(19)`; `(14)` ~ `(23)`; `(17)` ~ `(9)`; `(12)` ~ `(20)` | 0.29–0.43 | **DIFFERENT.** Each pair is `Sonicview 24dp` vs `Sonicview 24XP`. |
| `...16dp (15)` ~ `(24)` | 0.4009 | **DIFFERENT.** `16dp` vs `16XP`. |
| `SB-16D (10)` ~ `(4)`; `(5)` ~ `(6)` | 0.35, 0.38 | **DIFFERENT.** Front panel vs rear panel. |
| `SB-16D (8)` ≡ `...16dp (39)` | **0.0000** | merge — the platform-wide HDIA PCB macro, re-encoded |
| `...16dp (29)` ≡ `...IF-ST2110 (15)` | **0.0000** | merge — SNMP / control-system diagram |
| `...16dp (4)` ≡ `Radio ... (4)` | **0.0105** | merge — same in-situ frame |
| `...IF-ST2110 (14)` ≡ `...24dp (44)` | **0.0236** | merge — AFV tally diagram |

> **This is the finding that most affects the build.** The XP and dp variants are, in many cases,
> the *same photograph with a different model name baked into the corner*. That caption is the only
> thing distinguishing them — and it is exactly the distinction Stage 1 makes load-bearing, because
> XP is single AC and dp is dual redundant AC + DC. A filename- or hash-based dedup collapses them
> and the production loses the ability to show the dp honestly. They are kept separate, and the dp
> images are the ones that carry the redundancy chapter.
>
> Merge threshold used: RMS < 0.05. One pair sits at 0.1018 (`...16dp (22)` vs
> `...IF-ST2110 (9)`, captioned `Sonicview 16XP` vs `Sonicview 16`) — kept separate, because the
> differing caption is real differing content.

**Result: 133 distinct real assets (131 images + 2 videos), representing all 166 files.**

| Count | Class |
|---:|---|
| 45 | Sonicview 16 (XP/dp) |
| 23 | Sonicview 24 (XP/dp) |
| 15 | SB-16D |
| 11 | IF-ST2110 card |
| 9 | Sonicview + IF-ST2110 (system) |
| 8 | IF-Series card (AE16 / AN16 OUT / DA64 / MA64 EX) |
| 8 | In-situ · HCMC University / conference |
| 6 | FPGA / engine graphic |
| 5 | In-situ · radio broadcast |
| 2 | Series overview |
| 1 | In-situ · Newport Jazz / remote truck |
| **133** | **total** |

### 2.3 Compulsory coverage — the single-pass distribution across six deliverables

Every one of the 133 appears **exactly once** across the six, at primary tier (hero plate, mosaic
cell or clip — never merely as a blurred backdrop; the auditor reports ambient-only placement as a
failure). Allocation follows subject matter first and runtime second:

| Deliverable | Runtime | Assets | Pool |
|---|---:|---:|---|
| Reel 1 · The Computational Core | 178 s | 17 | FPGA graphics, HDIA macros, console heroes |
| Part 1 · The Computational Core | 298 s | 27 | ” + series overview |
| Reel 2 · The Network Fabric | 178 s | 17 | SB-16D, IF-ST2110, IF-Series, Dante rear panels |
| Part 2 · The Network Fabric | 298 s | 28 | ” |
| Reel 3 · The Control Surface | 178 s | 16 | VIEW screens, faders, user keys, in-situ |
| Part 3 · The Control Surface | 298 s | 28 | ” + both real videos |
| | | **133** | |

Proven by `npm run coverage`, which fails the build on any asset that is unplaced, double-placed, or
placed ambient-only.

### 2.4 Icon and logo assets — present, and one needs preparation

| File | Size | Mode | State |
|---|---|---|---|
| `FACEBOOK ICON.png` | 500² | RGBA | clean, usable as-is |
| `INSTAGRAM ICON.webp` | 1000² | RGBA | clean, usable as-is |
| `WHATSAPP ICON.png` | 960×962 | RGBA | clean, usable as-is |
| `YOUTUBE ICON.png` | 1280×897 | RGBA | clean, usable as-is |
| `WEBSITE ICON.png` | 800² | **RGB** | ⚠ **needs keying — see below** |
| `SHIVANSH ELECTRONICS BRAND LOGO.png` | 2372×714 | RGBA, 97.9 % opaque | ⚠ carries its own white plate |
| `TASCAM BRAND LOGO.png` | 2372×714 | RGBA, 53.7 % opaque | already plate-free |

**The website icon has a transparency checkerboard baked into its pixels.** It is RGB with no alpha
channel, and 18.0 % of it is `(220,222,223)` and 16.0 % is `(253,253,253)` in a regular grid — the
checker is literally rendered into the image. Used as supplied it would put a grey checked square
behind the website line at every one of its many appearances, which is both an artefact and exactly
the boxed treatment the branding rules forbid. `scripts/prep_icons.py` keys it: luma ≥ 215 → fully
transparent, ≤ 60 → fully opaque, linear between, which removes both checker tones and keeps the
black linework with clean anti-aliasing. Verified by eye against both light and dark grounds before
use.

**The Shivansh logo sits on an opaque white rounded rectangle.** On a `#F6F8FA` ground that reads as
a faint plate. `scripts/prep_logos.py` (ported from the Recording Series) strips the plate by
multiply un-premultiply, leaving globe, wordmark, tagline and trademark glyph untouched. Both marks
then sit bare on the page with a faint drop-shadow for separation — a shadow, not a box.

---

## 3. The Gemini brief is the only source of fact

Read in full from `TASCAM Sonicview Technical Research [DATED_ 30th AUGUST, 2026].docx`, all ten
stages including both Stage 8 master tables. Every figure below is `VERIFIED` in that document, and
no figure that is not in it will appear on screen.

**Nothing is imported from the Model-series narrative.** No Tri-Path Architecture, no tier
structure, no Tri-Path Splitter / DB25 Injection / Timecode Pulse. Stage 1 states outright that
Sonicview "shares absolutely no signal-path architecture" with the Model series, so the five
demonstratives are built from Sonicview's own Stage 6, not adapted.

### The figures the build may use

| | Sonicview 16 (XP/dp) | Sonicview 24 (XP/dp) |
|---|---|---|
| Engine | 54-bit floating-point FPGA (42-bit data + 12-bit headroom) | same |
| Internal DSP latency | 2 samples · 20.8 μs @ 96 kHz | same |
| Analog-to-analog latency | 0.51 ms | same |
| Conversion | 32-bit ADC / 24-bit DAC @ 96 kHz | same |
| Internal channels | 44 (40 mono + 2 stereo) + 4 FX return | same |
| Buses | 22 flex + Main L/R + 4 FX send = 32 | same |
| Analog in | 16 XLR (ch 9–16 combo TRS) | 24 XLR (ch 17–24 combo TRS) |
| Analog out | 16 XLR | 16 XLR |
| Preamp | Class 1 HDIA · EIN −128 dBu or less · max +32 dBu (pad on, trim min) | same |
| Faders | 16 + 1 (100 mm motorised) | 24 + 1 |
| Touchscreens | two 7-inch | three 7-inch |
| Dante | 64×64 @ 48 kHz · 32×32 @ 96 kHz · Primary + Secondary etherCON · ST 2022-7 | same |
| USB audio | 32-in / 32-out, 32-bit / 96 kHz | same |
| IF-MTR32 | 32-track direct-to-SDXC @ 48 kHz (16-track @ 96 kHz), file closed every 60 s | same |
| IF-ST2110 | 64×64 ST 2110-30/31, NMOS IS-04/05 | same |
| Protocols | Ember+, NMOS IS-04/05, SNMP, GPIO | same |
| User keys | 18 assignable, full-colour LED | same |
| Dimensions | 472.0 × 228.1 × 554.4 mm · 13 kg · 65 W | 690.8 × 228.1 × 554.4 mm · 18 kg · 85 W |
| Power | XP: single AC 100–240 V · dp: + 4-pin XLR DC in, PS-P2450 (DC 24 V, 5.0 A) | same |

**SB-16D:** 3U rack / floor stagebox · 16 XLR mic-line in, 16 XLR line out · Class 1 HDIA
(−128 dBu EIN, +32 dBu max) · 32-bit / 96 kHz · Dante 64×64 @ 48 kHz, 32×32 @ 96 kHz · Primary +
Secondary etherCON · DDM / AES67 / ST 2110 · GPIO 8-in/8-out, expanding to 16/16 with the console ·
internal AC + redundant DC · 482.8 × 132 × 120 mm · 4.5 kg.

**Also verified and used:** the FPGA DSP engine is segregated from the graphical OS, so audio keeps
passing if the UI halts; dual-partition operating system; VIEW's three layouts (Channel Strip /
Module / Individual); per-channel Delay, Phase, Digital Trim, HPF, Gate-Expander-De-esser, 4-band
PEQ, Compressor-Ducker; per-bus 31-band GEQ, RTA, 4-band PEQ, Compressor-Ducker, Delay; AFV via GPIO
tally with rise / hold / fall times; Gain-Sharing Auto Mixer; Sends on Fader and DCA spill.

### ⚠ One conflict between the brief and the instructions, resolved in the instructions' favour

Stage 10 of the brief says:

> "Logo: [Shivansh Electronics Logo] – **Persistent on-screen watermark**, recommended in the lower
> right quadrant."

§6.1 of the build instruction is the opposite, and is explicit that it is an absolute prohibition
rather than a frequency reduction. **§6.1 governs.** The brief's underlying intent — constant brand
presence — is met instead by the in-body contact layer of §6.2, which is deliberately *more*
frequent than any prior production in this pipeline. No logo appears anywhere but an end screen.

Everything else in Stage 10 is honoured exactly: the hero-typography anchors (`54-BIT / 96 kHz`,
`−128 dBu EIN`, `20.8 μs`, `ST 2110 / ST 2022-7`, `64×64 AoIP`), the four-level information
hierarchy (macro hardware shot → hero figure → monospaced subtext → 3–4 sub-spec data block), the
"Authorized Partner of TASCAM" phrasing, and the full digital-footprint and contact set.

---

## 4. Format, structure and where the work lives

### 4.1 The three reels
1080×1920 · 30 fps · **5,340 frames = 178.000 s** · light ground throughout · caption-safe zone
180 / 220 / 64 (§1). The top 180 px and bottom 220 px bands are the home of the constant marketing
layer (§6.2).

### 4.2 The three parts
1920×1080 · 30 fps · **8,940 frames = 298.000 s** · same palette · edge inset 56 / 52, no reserved
band. Marketing is placed per-scene against computed free space (§6.2). **Each part opens completely
and closes completely** — its own cold open, its own end screen. None of the three assumes the
viewer has seen another.

### 4.3 Project layout, and one deviation I need signed off

The instruction says each deliverable is "its own working Remotion project, own branch." Two notes:

**Projects — proposed, and I think correct.** Six independent npm projects means six `node_modules`
trees (~1.5 GB) in a session with 16 GB of writable space. Instead I propose the structure the
Recording Series itself uses and which satisfies the same requirement: one dependency root, a shared
module directory, and **six genuinely separate Remotion projects** — each with its own entry point,
its own `remotion.config.ts`, its own composition and its own render script:

```
build/
  shared/        theme · fonts · anim · media · concepts · contact · logo · icons · beat · spec
  reel1/  reel2/  reel3/     each: index.ts · Root.tsx · scenes.tsx · remotion.config.ts
  part1/  part2/  part3/     each: index.ts · Root.tsx · scenes.tsx · remotion.config.ts
  scripts/       prep_icons · prep_logos · prep_clips · synth_sfx · build_music
                 audit_{coverage,contact,audio,compliance} · pack_project
```

Each deliverable still gets its own downloadable project zip (checkpoint 12), built by
`pack_project.py` with its shared dependencies inlined, so a zip is standalone even though the
working tree shares them.

> **⚠ Branches — I need your call, and I have defaulted to the safe option.** My operating
> configuration designates exactly one branch for this repository
> (`claude/sonicview-three-reels-1ktrea`) and forbids pushing to any other without explicit
> permission. Your instruction says each deliverable gets its own branch. I have **defaulted to
> keeping all six on the designated branch**, because that is the reversible choice — splitting into
> six branches afterwards is trivial, un-pushing is not. Say the word and I will create
> `claude/sonicview-reel{1,2,3}` and `claude/sonicview-part{1,2,3}` instead.

---

## 5. Chapter-by-chapter, all six

Grouping follows Stage 7's five phases and Stage 4's six ranks, proportioned to narrative weight and
to genuine asset support. Stated as groupings, not as architectural claims about the product:

- **Part / Reel 1 — The Computational Core.** Stage 7 Phase 1 (the problem) + Phase 2 (HDIA → 32-bit
  ADC → 54-bit FPGA). Stage 4 ranks **1** and **3**, plus the OS/DSP-segregation half of rank 4.
- **Part / Reel 2 — The Network Fabric.** Phase 3. Ranks **2** and **5**, plus the dual-power half of
  rank 4.
- **Part / Reel 3 — The Control Surface.** Phase 4 (HMI) + Phase 5 (validation). Rank **6**, plus the
  three named deployments.

Each pair shares a subject and an asset pool but not a structure: the reel is not the part re-cut.
Reels open on a hook in the first ~8 s and run 13 beats; parts run 18–19 beats and can afford the
demonstratives at full length.

### Part 1 — The Computational Core · 298 s · 18 beats

| # | s | Beat | Assets / clips |
|---:|---:|---|---|
| 1 | 14 | Cold open — a node, not a desk | BR-01 |
| 2 | 16 | The problem: channel counts and the summing bus | console heroes |
| 3 | 16 | What "native digital" means — digitised at the chassis edge | rear-panel macros |
| 4 | 20 | Class 1 HDIA — true instrumentation topology | BR-02 |
| 5 | **22** | **DEMONSTRATIVE — HDIA Instrumentation Stage** (Stage 6 §4) | schematic over XLR macro |
| 6 | 14 | −128 dBu EIN · +32 dBu max | BR-03 |
| 7 | 14 | Into the 32-bit ADC | HDIA PCB macro |
| 8 | 20 | The FPGA — 54-bit floating point | FPGA graphics |
| 9 | **24** | **DEMONSTRATIVE — 54-Bit Summing Matrix** (Stage 6 §1) | 44 waveforms → node |
| 10 | 14 | 42 bits of data, 12 bits of headroom | FPGA graphics |
| 11 | 18 | 2 samples · 20.8 μs | BR-04 |
| 12 | 14 | 0.51 ms analog to analog | — |
| 13 | 16 | 44 channels · 22 flex buses · 32 total | series overview |
| 14 | 14 | The DSP every channel and every bus gets | VIEW screens |
| 15 | 16 | OS and DSP segregated — audio survives a UI halt | BR-11 |
| 16 | 16 | One engine, two footprints | BR-18 |
| 17 | 12 | What Part 2 covers | — |
| 18 | **18** | **END SCREEN** | logos + full contact block |

### Part 2 — The Network Fabric · 298 s · 18 beats

| # | s | Beat | Assets / clips |
|---:|---:|---|---|
| 1 | 14 | Cold open — inputs stop terminating at the desk | BR-01 reprise angle |
| 2 | 14 | What an AoIP fabric replaces | SB-16D |
| 3 | 18 | Dante 64×64, native to every Sonicview | BR-07 |
| 4 | 18 | Primary and Secondary etherCON · ST 2022-7 | BR-05 |
| 5 | **24** | **DEMONSTRATIVE — ST 2022-7 Redundant Packet Flow** (Stage 6 §2) | dual-path, one severed |
| 6 | 18 | The SB-16D — the input stage, moved | SB-16D front |
| 7 | 14 | 16 in / 16 out, same Class 1 HDIA | SB-16D rear |
| 8 | 14 | 3U chassis · rack, deck, or stacked | BR-08 |
| 9 | 14 | Scaling — add a box, not a desk | BR-20 |
| 10 | 16 | Gain, +48 V and pad from the desk, or anywhere | BR-09, BR-13 |
| 11 | 14 | GPIO 8-in/8-out → 16/16 with the console | GPIO D-sub macro |
| 12 | **22** | **DEMONSTRATIVE — AFV Tally Logic** (Stage 6 §3) | BR-10 |
| 13 | 14 | Gain-Sharing Auto Mixer | VIEW screens |
| 14 | 18 | Ember+ · NMOS IS-04/05 · SNMP | BR-17, SNMP diagram |
| 15 | 18 | IF-ST2110 — 64×64 ST 2110-30/31 | BR-06, IF-ST2110 |
| 16 | 18 | dp — PS-P2450 and the 4-pin XLR DC input | BR-14 |
| 17 | 12 | What Part 3 covers | — |
| 18 | **18** | **END SCREEN** | logos + full contact block |

### Part 3 — The Control Surface · 298 s · 19 beats

| # | s | Beat | Assets / clips |
|---:|---:|---|---|
| 1 | 14 | Cold open — back to the operator | BR-24 |
| 2 | 20 | TASCAM VIEW — three cognitive layouts | BR-11 |
| 3 | 14 | Channel Strip View | VIEW screens |
| 4 | 14 | Module View | VIEW screens |
| 5 | 14 | Individual View | VIEW screens |
| 6 | **22** | **DEMONSTRATIVE — Snapshot Recall / fader snap** (Stage 5) | BR-15 |
| 7 | 16 | 100 mm motorised faders and custom layers | BR-12 |
| 8 | 16 | Sends on Fader · DCA spill | fader macros |
| 9 | 16 | 18 User Keys, full-colour LED | top-panel macro |
| 10 | 18 | Screen legibility — PEQ curve and dynamics | BR-23 |
| 11 | 16 | 31-band GEQ + RTA on all 22 buses | VIEW screens |
| 12 | 18 | IF-MTR32 — 32 tracks to SDXC, file closed every 60 s | BR-16 |
| 13 | 14 | USB 32-in / 32-out | rear-panel macro |
| 14 | 14 | Two slots, two answers | BR-25 |
| 15 | 16 | In service — radio broadcast | BR-21, radio set |
| 16 | 16 | In service — campus and conference | BR-19, BR-22, HCMC set |
| 17 | 14 | Remote production — Newport Jazz | Newport image |
| 18 | 8 | Shivansh Electronics as the integration partner | — |
| 19 | **18** | **END SCREEN** | logos + full contact block |

### Reel 1 — The Computational Core · 178 s · 13 beats

| # | s | Beat |
|---:|---:|---|
| 1 | 8 | **Hook** — "the mixing happens where you cannot see it" · BR-01 |
| 2 | 10 | The summing problem |
| 3 | 14 | Digitised at the edge |
| 4 | 14 | Class 1 HDIA · BR-02 |
| 5 | **18** | **DEMO — HDIA Instrumentation Stage** |
| 6 | 12 | −128 dBu · +32 dBu · BR-03 |
| 7 | 10 | 32-bit ADC |
| 8 | 16 | 54-bit floating-point FPGA |
| 9 | **20** | **DEMO — 54-Bit Summing Matrix** |
| 10 | 14 | 20.8 μs · BR-04 |
| 11 | 12 | 44 channels · 32 buses |
| 12 | 12 | One engine, two footprints · BR-18 |
| 13 | **18** | **END SCREEN** |

### Reel 2 — The Network Fabric · 178 s · 13 beats

| # | s | Beat |
|---:|---:|---|
| 1 | 8 | **Hook** — "the copper goes; the engine stays" · BR-01 |
| 2 | 10 | What replaces the multicore |
| 3 | 14 | Dante 64×64 · BR-07 |
| 4 | 14 | Primary and Secondary · BR-05 |
| 5 | **20** | **DEMO — ST 2022-7 Redundant Packet Flow** |
| 6 | 16 | SB-16D — the input stage, moved |
| 7 | 12 | 16 in / 16 out, same HDIA |
| 8 | 10 | Add a box, not a desk · BR-20 |
| 9 | 14 | Gain from anywhere · BR-09 |
| 10 | **18** | **DEMO — AFV Tally Logic** · BR-10 |
| 11 | 12 | Ember+ · NMOS · BR-17 |
| 12 | 12 | dp — the second supply · BR-14 |
| 13 | **18** | **END SCREEN** |

### Reel 3 — The Control Surface · 178 s · 13 beats

| # | s | Beat |
|---:|---:|---|
| 1 | 8 | **Hook** — "three screens, one engine" · BR-24 |
| 2 | 16 | VIEW — three layouts · BR-11 |
| 3 | **20** | **DEMO — Snapshot Recall / fader snap** · BR-15 |
| 4 | 14 | 100 mm motorised faders and layers · BR-12 |
| 5 | 12 | DCA spill |
| 6 | 12 | 18 User Keys |
| 7 | 16 | PEQ and dynamics on screen · BR-23 |
| 8 | 12 | GEQ + RTA on 22 buses |
| 9 | 14 | IF-MTR32 — 32 tracks, no computer · BR-16 |
| 10 | 10 | USB 32×32 |
| 11 | 12 | On air · BR-21 |
| 12 | 14 | In service · BR-19 / BR-22 |
| 13 | **18** | **END SCREEN** |

All six sum exactly to their target frame counts (5,340 / 8,940).

---

## 6. Branding — the load-bearing section

### 6.1 End screens — the only place a logo exists

**Six deliverables, six end screens**, identical in content and composition, 18 s each, on the same
light ground as the body. Each contains, together in one composed closing frame:

```
        [ SHIVANSH ELECTRONICS ]        [ TASCAM ]        ← both marks, bare on the page,
                                                            no box, card or plate
                AUTHORIZED PARTNER OF TASCAM

        [www]        www.shivanshelectronics.in
        [ig]         instagram.com/@shivanshelectronics.in
        [fb]         facebook.com/@shivanshelectronics.in
        [yt]         youtube.com/@shivanshelectronics-in

        [wa]  +91 98316 62458, +91 91477 00677, +91 89818 07755

              Talk to the team about your facility.
```

- Both logos, plate-stripped (§2.4), landscape side-by-side / portrait stacked, separated by a
  hairline rule.
- The designation in exactly that wording. No distributor language, no territory clause.
- Every contact row icon-paired with the **actual repository icon asset**, not a redrawn one.
- The three numbers always together, one line, one WhatsApp icon, in exactly the specified format.
- The closing line is a technical-consultation offer. Never a purchase close, never a price.
- Timing: marks seat at ~2 s, designation ~3.5 s, the four rows stagger 4.5→9 s, the WhatsApp block
  at ~9.5 s, then hold. A single soft synthesised mark as the logos seat; nothing else.

### 6.2 In-body — no logos, constant presence, icon-paired, never colliding, never fixed

Only five things may appear in the body: the website line, the three social handles, and the
WhatsApp block — each with its own real icon. **No logo, in any form, anywhere outside the end
screen.**

**Frequency — deliberately higher than any prior production here.** The Recording Series planned one
strip per beat and two on beats ≥ 14 s. This build plans **two per beat, three on beats ≥ 20 s**,
which targets:

| | strips | body runtime | mean interval | max gap (hard fail above) |
|---|---:|---:|---:|---|
| each reel | 24–28 | 160 s | ≈ 6 s | 9 s |
| each part | 34–38 | 280 s | ≈ 8 s | 11 s |

All five channels circulate; none is starved. The end screen is excluded from the rotation, since a
strip on top of it would be the same information twice.

**Portrait placement — the padding bands, where collision is impossible by construction.** The
caption-safe zone reserves 180 px above the content and 220 px below it. Those bands are otherwise
empty, and they are where every reel strip lives. Six slots — `band-top-{left,center,right}` and
`band-bottom-{left,center,right}` — with the wide WhatsApp block restricted to the two centre slots
so it cannot run off frame. Because the bands sit outside the content box by definition, a reel
strip cannot overlap content even in principle.

**Landscape placement — computed free space, per scene.** The parts have only a 52 px margin, too
thin for legible type, so there is no band to retreat to. Each beat therefore reports the rectangles
its own layout occupies — derived from the same layout constants the scene renders from, not from a
hand-written table — and the planner places strips only in what is genuinely left. This is the
improvement over the Recording Series noted in §1: a layout change cannot silently invalidate the
placement plan, because the plan is computed from the layout rather than declared beside it.

**Nothing is pinned.** Consecutive strips never share a slot; slots are chosen least-used-first so
the whole set is exercised; no slot may take more than ⌈n/3⌉ of the appearances; every strip slides
in and out rather than cutting. `npm run contact` computes the real absolute timeline and fails the
build on a gap over the limit, a slot over its cap, a consecutive repeat, or a starved channel.

### 6.2.1 Opening-portion placement sketch, as required

**Reel 1** — content occupies y 180–1700 throughout; both bands free.

| beat | s | on screen | strip | slot | y |
|---|---:|---|---|---|---|
| 1 Hook | 0–8 | BR-01 plate, centred | — (hook runs clean) | — | — |
| 2 Problem | 8–18 | headline + console hero | website | `band-bottom-left` | 1748 |
| 2 | | | instagram | `band-top-right` | 66 |
| 3 Edge | 18–32 | rear-panel macro | **whatsapp** | `band-bottom-center` | 1742 |
| 3 | | | facebook | `band-top-left` | 66 |
| 4 HDIA | 32–46 | BR-02 plate + spec block | youtube | `band-bottom-right` | 1748 |
| 4 | | | website | `band-top-center` | 66 |
| 5 DEMO | 46–64 | full-width schematic | instagram | `band-bottom-left` | 1748 |
| 5 | | | facebook | `band-top-right` | 66 |
| 5 | | | **whatsapp** | `band-bottom-center` | 1742 |

Six distinct slots inside the first 64 s, no slot twice in a row, no strip inside y 180–1700.

**Part 1** — free space computed per beat from the layout:

| beat | s | layout occupies | free | strip | slot |
|---|---:|---|---|---|---|
| 1 Cold open | 0–14 | BR-01 plate centred 1408×792 | full margin ring | — (cold open runs clean) | — |
| 2 Problem | 14–30 | headline block left 880 wide; hero right 900×620 | lower-left band below headline | website | `bl` |
| 2 | | | upper-right above hero | youtube | `tr` |
| 3 Edge | 30–46 | macro plate right 1000×700; copy column left | left column foot | **whatsapp** | `bl` |
| 3 | | | top strip above copy | instagram | `tl` |
| 4 HDIA | 46–66 | BR-02 plate left 1100×620; spec stack right | right column foot | facebook | `br` |
| 4 | | | top-centre gutter | website | `tc` |
| 5 DEMO | 66–88 | schematic centred 1500×820 | 52 px ring + lower-right | youtube | `br` |
| 5 | | | upper-left corner | instagram | `tl` |
| 5 | | | lower-centre gutter | **whatsapp** | `bc` |

Every one of these is verified at a rendered still before the beat is signed off (checkpoint 4), and
the collision geometry is re-checked automatically for all beats by `npm run contact`.

### 6.3 Confirmation this section governs

Stated now, and to be re-stated in each deliverable's final summary:

- **No logo appears anywhere outside that deliverable's own end screen.** Enforced by a compliance
  rule that fails the build on any `Logo` import or `logo/*.png` reference from a non-`outro` scene
  module, not merely by inspection.
- **Every end screen carries** both logos, the "Authorized Partner of TASCAM" designation, the
  website with its icon, all three social handles with their icons, and the WhatsApp block in the
  exact specified format.
- **Every in-body placement** is checked for zero collision with main content and zero fixed-position
  repetition, by `npm run contact` plus rendered stills.
- **Thumbnails carry no logo either** — a thumbnail is not an end screen.

---

## 7. Audio

**Every sound synthesised from code**, as established. Nothing from ElevenLabs or any external audio
service, and nothing from the B-roll clips' generative tracks (all muted).

- **Reused from the TASCAM Recording Series** (`build/scripts/synth_sfx.py`), where the mechanical
  vocabulary genuinely matches: `phase-mark`, `spec-latch`, `fader-throw`, `knob-rotary`,
  `data-tick`, `sdxc-seat`.
- **Freshly synthesised for Sonicview's own hardware vocabulary**, which the Model series has no
  equivalent for: `ethercon-latch` (the Dante port's locking collar), `touch-tap` and `touch-swipe`
  (7-inch VIEW screens), `fader-snap` (a snapshot recall driving the motorised bank — Stage 5 asks
  for this explicitly), `packet-handoff` (the ST 2022-7 changeover), `card-seat` (an expansion card
  reaching its connector), `dc-lock` (the 4-pin XLR DC inlet), `tally-click` (GPIO).
- **Music bed** built by `build_music.py` at each exact runtime. Sound fires only where something
  mechanical happens on screen; scoring every beat would turn the layer into texture.
- **Per deliverable, two standalone files** as required: the full music-bed mix as deployed, and the
  transition-SFX layer alone on its own timeline at the exact positions used — both spanning that
  deliverable's exact runtime as single continuous synced files, committed beside its MP4.

Reported per deliverable: which sounds were reused and which were synthesised fresh.

---

## 8. How each of the 17 checkpoints is satisfied

| # | Check | Mechanism |
|---|---|---|
| 1 | Prior production ignored; 25 B-rolls present | §0.1 / §0.2 — both done, above |
| 2 | Palette, font, motion, safe zones pulled and stated | §1 provenance table |
| 3 | Brief is the only fact source; no Model-series imports | §3, incl. the Stage 10 conflict |
| 4 | Still frame after every scene | rendered still per beat; overlap, clipping, light ground, zero logos, icon pairing, no pricing, no other brands, figures vs brief |
| 5 | Fix and re-render before proceeding | — |
| 6 | Real-asset completeness | `npm run coverage` — 133/133, primary tier, uncropped |
| 7 | B-roll provenance | clip manifest cross-checked against `BROLL_PROMPTS_SONICVIEW.md` |
| 8 | End-screen completeness | `npm run compliance` asserts all seven required elements per end screen |
| 9 | In-body branding | `npm run contact` — frequency, max gap, slot cap, consecutive repeats, per-channel balance; plus the zero-logo rule |
| 10 | TypeScript + bundler | `tsc --noEmit` (strict, `noUnusedLocals`) and a Remotion bundle per project |
| 11 | Range test over ≥ 2 transitions, audio confirmed | per deliverable |
| 12 | Project zip committed before full render | `pack_project.py`, deterministic, refuses to pack if a build-critical file is missing |
| 13 | Full render at exact frame count | 5,340 / 8,940 |
| 14 | Output verified directly | `verify_render.mjs` — exit code, duration, resolution, fps, both streams, audio energy contour |
| 15 | MP4 committed on its own verification | immediately, per deliverable |
| 16 | Thumbnail committed alongside | 1080×1920 / 1920×1080, light ground, that deliverable's models, **zero pricing, zero logos**, icon-paired marketing if space allows |
| 17 | Per-deliverable summary | coverage, B-rolls used, provenance, end-screen content, zero in-body logos, §6.2 frequency/collision/dynamic-position confirmations, zero pricing, zero other-brand comparisons, figures vs brief, final runtime |

Editorial rules enforced by `npm run compliance` across all six videos' on-screen copy, all six
thumbnails and all six VO scripts: no pricing or cost framing of any kind (checked far more broadly
than literal figures — the word-level check is what caught "expensive", "budget line" and "costs a
fraction of" in the prior production); no competing console brand named or alluded to; Shivansh
Electronics described only as Authorized Partner of TASCAM, checked positively rather than merely
for absence of the wrong words; CTA is a technical consultation.

---

## 9. Open items

1. **Branch strategy** (§4.3) — defaulted to the single designated branch. One word changes it.
2. **Voiceover** — as before, the audio slot ships as a silent placeholder of the exact runtime with
   a per-deliverable script written to the beat timings, so a recorded read drops in without
   re-timing. Say if you want that changed.
