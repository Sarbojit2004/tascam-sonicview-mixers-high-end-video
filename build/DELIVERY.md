# Delivery — TASCAM Sonicview, Six Deliverables

Three 178-second portrait reels and three 298-second landscape parts. Each is a **standalone
video** with its own opening, its own end screen and its own thumbnail — not three chapters of a
longer piece.

| # | Deliverable | File | Format | Runtime |
|---|---|---|---|---|
| 1 | Reel 1 · The Computational Core | `out/sonicview-reel1.mp4` | 1080×1920 · 5,340f | 178.000 s |
| 2 | Reel 2 · The Network Fabric | `out/sonicview-reel2.mp4` | 1080×1920 · 5,340f | 178.000 s |
| 3 | Reel 3 · The Control Surface | `out/sonicview-reel3.mp4` | 1080×1920 · 5,340f | 178.000 s |
| 4 | Part 1 · The Computational Core | `out/sonicview-part1.mp4` | 1920×1080 · 8,940f | 298.000 s |
| 5 | Part 2 · The Network Fabric | `out/sonicview-part2.mp4` | 1920×1080 · 8,940f | 298.000 s |
| 6 | Part 3 · The Control Surface | `out/sonicview-part3.mp4` | 1920×1080 · 8,940f | 298.000 s |

Alongside each: a **thumbnail** in `thumbnails/`, a **voiceover script** in `vo/`, a **standalone
music bed** and a **standalone SFX layer** in `out/audio/`, and a **standalone project zip** in
`dist-zip/`.

---

## What is checked rather than claimed

```bash
node --experimental-strip-types scripts/audit_all.mts   # coverage, clips, contact, branding, compliance, glyphs, runtime
node --experimental-strip-types scripts/audit_contrast.mjs
node scripts/verify_render.mjs                          # the rendered files themselves
npx tsc --noEmit
```

Every check reads the same data the videos render from, so the picture and the report cannot
disagree.

### Asset coverage — 133 / 133, each exactly once

The 166 supplied product files deduplicate to **133 distinct assets** (131 images + 2 videos).

| | Reel 1 | Part 1 | Reel 2 | Part 2 | Reel 3 | Part 3 | Total |
|---|---|---|---|---|---|---|---|
| Real assets | 17 | 27 | 17 | 28 | 16 | 28 | **133** |

**All 25 B-roll clips** are used. The first pass placed only 11 — a montage beat could hold stills
and a `broll` beat could hold a clip, and nothing could hold both. A mosaic cell now takes moving
footage, which also reads better than either alone: the eye lands on the motion and reads outward.

### The deduplication, and why it had to be re-derived

Perceptual hashing flagged 17 candidate duplicate groups. Pixel verification confirmed **4**.

The other 13 are distinct images a hash cannot separate — and merging them would have been a
substantive error:

- **Most are XP vs dp variant pairs**: the same photograph with a different model name baked into
  the corner. That caption is the only difference, and it is exactly the distinction Stage 1 makes
  load-bearing, since XP is single AC and dp is dual redundant AC + DC.
- **`IF-AE16.jpg` ~ `IF-AN16 OUT.jpg`** scored 0.4451 RMS: two *different cards*, their faceplates
  reading `AES/EBU` and `ANALOG OUT`. A merge would have deleted a documented product from coverage.

Merge threshold: RMS < 0.05, every candidate inspected by eye and by a full-resolution crop of its
baked-in caption.

### Copy checked against picture

An audit can confirm that an asset is placed and that a figure is verified. It cannot tell you the
caption and the photograph are about the same thing. So every single-image beat — 32 of them — was
laid out next to its own label and headline and inspected.

**Seven were wrong.** All name something the photograph does not show:

| Beat | Caption | Was | Now |
|---|---|---|---|
| `r2-sb16d` | "16 XLR mic/line in, 16 XLR line out" | SB-16D **rear** panel | 43 — front, XLR array |
| `r2-parity` | "Gain at the source" | rear panel | 52 — console + stagebox |
| `p2-sb16d` | "The input stage, moved" | ecosystem shot | 50 — front |
| `p2-automix` | "Gain-sharing, calculated live" | SNMP monitoring diagram | 84 — the AUTOMATIC MIXER screen |
| `r3-faders` | "16 channel + 1 master (100 mm)" | **rear panel, no faders in frame** | 124 |
| `p3-faders` | "24 channel + 1 master" | **rear panel** | 98 — hands on the surface |
| `r3-usb` | "32-in / 32-out USB" | iPad remote-control app | 78 — rear, USB to PC |
| `p3-usb` | "32-in / 32-out" | flight-case rack | 130 — rear panel |

This is the same class of error as the snapshot-recall demonstrative drawing sixteen faders under a
caption reading "24 channel + 1 master": it only surfaces when the words and the picture are
checked *against each other* rather than each being checked as correct on its own.

### Branding — end screen only

| | Reel 1 | Part 1 | Reel 2 | Part 2 | Reel 3 | Part 3 |
|---|---|---|---|---|---|---|
| Logos in the body | **0** | **0** | **0** | **0** | **0** | **0** |
| End screens | 1 | 1 | 1 | 1 | 1 | 1 |
| Contact strips | 24 | 37 | 24 | 35 | 24 | 37 |
| Mean interval | 6.7 s | 7.6 s | 6.7 s | 8.0 s | 6.7 s | 7.6 s |
| Longest gap | 5.0 s | 8.7 s | 5.0 s | 8.7 s | 5.0 s | 8.7 s |
| Distinct slots used | 6 | 6 | 6 | 6 | 6 | 6 |
| Fixed-position repeats | 0 | 0 | 0 | 0 | 0 | 0 |
| Strip / content collisions | 0 | 0 | 0 | 0 | 0 | 0 |

The zero-logo rule is **enforced, not documented**: the audit fails the build if any scene or beat
module references `logo.tsx`, `logo/` or `BrandMark`. A rule that depends on remembering it is not
a rule.

Every end screen carries, together in one composed frame: both marks bare on the page, the
designation **Authorized Partner of TASCAM**, the website with its icon, all three social handles
each with its own icon, and the three numbers together behind one WhatsApp icon in exactly the
specified format — `+91 98316 62458, +91 91477 00677, +91 89818 07755` — plus a
technical-consultation line.

**Placement is computed, not declared.** Each beat reports the rectangles its own layout occupies,
derived from the same constants the scene renders from, and the planner places strips only in what
is genuinely free. The reference production kept a hand-written table of free corners per beat
kind; that goes silently stale the moment a layout changes, while the audit still passes. This
build designs that failure mode out.

On the reels, strips live in the 180 px and 220 px caption-safe bands, which sit outside the
content box by construction — a collision there is not merely avoided but impossible.

### Editorial rules

All pass across 268 viewer-facing strings, all six scripts and both thumbnail sets:

1. No pricing, MRP or cost framing of any kind. The check is deliberately broader than literal
   figures — written that way it previously caught "expensive", "budget line" and "costs a fraction
   of" in an already-rendered production.
2. No competing console brand named or alluded to. MOTU is on the forbidden list: those productions
   are this build's structural reference, but must never be named on screen in a TASCAM video.
3. Shivansh Electronics described only as **Authorized Partner of TASCAM** — checked positively,
   not merely for the absence of the wrong words. No distributor, dealer or reseller language, no
   territory clause.
4. The CTA is a technical consultation, never a purchase close.

### Verified specifications only

Every figure on screen goes through `specValue()` or `platformValue()`, which **throw** rather than
return anything the research brief marks UNVERIFIED. Four platform facts are stored as `null`
precisely so they cannot render: maximum stagebox count per network, scene memory count, internal
FX engine count, and fader travel time.

### Glyphs

The brief writes its own hero anchor as **`20.8 μs`** using U+03BC — which is **absent from both
shipped font subsets**, while the visually identical U+00B5 is present. Transcribing it verbatim
would have rendered the production's most-repeated figure as a tofu box. Every string is sanitised
on the way to the screen, and the audit fails on any codepoint the fonts do not contain.

### Contrast

Every type-bearing token verified against WCAG on the paper ground: `ink` 17.76:1, `inkSoft`
14.16:1, `slate` 7.45:1, `slateDim` 4.65:1, `accent` 7.32:1, `net` 6.98:1, `signal` 4.65:1,
`alert` 6.24:1, and `onScreen` 16.57:1 on the dark screen plates.

Three tokens inherited from the reference palette measured **below** the 4.5:1 their source
comments claim — `slateDim` 4.34, `accentSoft` 4.24, `signal` 4.42. Each is darkened the minimum
distance that clears it. Provenance yields to legibility, because a token that fails contrast
cannot carry type at all.

---

## Audio

**Every sound is synthesised from code** — `scripts/synth_audio.py`, numpy, seeded so output is
byte-identical run to run. Nothing from ElevenLabs or any external service, and nothing from the
generative tracks the video model attached to the B-roll clips (stripped in `prep_media.py`).

**Reused from the TASCAM Recording Series vocabulary** — six sounds whose mechanical events
Sonicview genuinely shares: `phase-mark`, `spec-latch`, `fader-throw`, `knob-rotary`, `data-tick`,
`sdxc-seat`.

**Newly synthesised for Sonicview** — seven, because a hybrid analog desk has no locking network
connector, no capacitive glass, no motorised recall and no redundant supply to hand over to:
`ethercon-latch` (two-stage: seat, then collar detent), `touch-tap`, `touch-swipe`, `fader-snap`
(critically damped — determinism means it arrives and stops, never overshoots), `packet-handoff`,
`card-seat`, `dc-lock`.

`packet-handoff` is deliberately **not** a glitch. The specification says zero sample loss, so pitch
runs continuously through the changeover and only the timbre shifts. The instinctive sound design
here is a stutter, and a stutter would illustrate the opposite of the claim.

Per deliverable, committed beside the MP4: the **music bed as deployed** and the **SFX layer alone**
at the exact frames used, each a single continuous file spanning the exact runtime. Both are
generated from the same cue sheet the videos render from, so they cannot drift.

---

## The five demonstrative animations

Four are Stage 6 of this project's own research brief. The fifth answers Stage 5's request for
motorised faders "snapping violently yet precisely to position during a Snapshot Recall".

| | Concept | Where |
|---|---|---|
| 1 | Class 1 HDIA instrumentation stage | Reel 1, Part 1 |
| 2 | The 54-bit summing matrix | Reel 1, Part 1 |
| 3 | ST 2022-7 redundant packet flow | Reel 2, Part 2 |
| 4 | Audio-Follow-Video tally logic | Reel 2, Part 2 |
| 5 | Snapshot recall — the motorised bank | Reel 3, Part 3 |

**Nothing is adapted from the Model series.** Its Tri-Path Splitter, DB25 Injection and Timecode
Pulse describe a hybrid analog/digital architecture that Stage 1 says Sonicview "shares absolutely
no signal-path architecture" with. What is inherited is the *category* and its craft rules — node
cards, orthogonal polylines with packets riding them, geometry solved in pure JS rather than by
measuring the DOM, every figure routed through the verified-spec gate.

Two were rebuilt after looking at rendered stills:

- The **summing matrix** first drew per-bar random phase, which rendered as a circular scribble and
  made the gap to the digital ceiling unreadable. That gap *is* the claim, so it is now one coherent
  waveform with a filled envelope.
- **Snapshot recall** drew sixteen faders under a caption reading "24 channel + 1 master". The
  fader count now follows the console being named, and the master fader is drawn, so a viewer who
  counts finds the caption true.

---

## Provenance — what came from where

| Value | Figure | Source |
|---|---|---|
| Type system | Archivo + Fraunces, with the `headline/subhead/spec/micro/editorial` hierarchy | **MOTU M-Series** `portrait/src/fonts.ts` |
| Palette | `paper #F6F8FA` and the full ink/slate ramp | **MOTU M-Series** → already re-confirmed in **TASCAM Recording Series** |
| Accent | `#8A3A12` TASCAM panel amber, not MOTU blue | **TASCAM Recording Series** |
| Portrait caption-safe zone | **180 / 220 / 64** | **MOTU AVB** reels → AVB compressed-reel → **M-Series portrait** |
| Landscape edge inset | **56 / 52** | **MOTU AVB** long-form → M-Series long-form |
| Motion vocabulary | `EASE_OUT` bezier(0.16,1,0.3,1), `macroReveal`, `gimbal`, `platePush` | **all four**, consolidated in **Recording Series** `anim.ts` |
| Contact wording and branding architecture | "Authorized Partner of TASCAM", five channels, three numbers as one | **TASCAM Recording Series** `brand.ts` |
| 178 s portrait / 298 s landscape precedents | canvas, duration, beat proportioning | **MOTU M-Series** `portrait/` and `longform/` |

**Pushed further than the predecessors**, as the standing instruction asks:

1. **Five demonstratives, not three**, each longer and more resolved.
2. **A focus term on media plates** — `focusPull` resolves the subject earlier than the frame, which
   is what makes a macro reveal read as a camera finding focus rather than as a zoom.
3. **The contact layer is typographic** — values arrive on a per-glyph stagger, so the marketing
   moves with the same grammar as the headline type instead of fading in as a block.
4. **Per-scene collision geometry is computed rather than declared**, so a layout change cannot
   silently invalidate the placement table.

---

## Two conflicts, resolved in the open

**Stage 10 of the research brief asks for a persistent logo watermark** in the lower right quadrant.
§6.1 of the build instruction prohibits any logo outside an end screen, absolutely. **The
instruction governs.** The brief's underlying intent — constant brand presence — is met instead by
the in-body contact layer, at roughly double the frequency of any prior production in this pipeline.

**Two supplied files needed repair before they could be used at all.** `WEBSITE ICON.png` shipped a
transparency checkerboard *baked into its pixels* (RGB, no alpha, 18% at `(220,222,223)` and 16% at
`(253,253,253)` in a grid); used as supplied it puts a grey checked square behind the website line
at every one of its ~180 appearances. And both logos sat on opaque white plates — the TASCAM file
being the instructive case, since at 53.7% opaque it *looked* plate-free, but that figure describes
the bounding box while 58.4% of its opaque pixels are white. An opacity percentage cannot tell you
whether a mark is boxed; only rendering it on the page can.

---

## Reproducibility

`dist-zip/sonicview-{reel,part}{1,2,3}-project.zip` — 45 files, ~316 KB each, deterministic
(sorted entries, fixed timestamps). `public/img`, `public/clips` and `public/audio` are ~160 MB of
*derived* files, so the zips ship the recipes:

```bash
unzip sonicview-part2-project.zip -d sonicview && cd sonicview
npm install
export SONICVIEW_MEDIA_DIR=/path/to/the/source/files
python3 scripts/prep_brand.py && python3 scripts/prep_media.py && python3 scripts/synth_audio.py
node --experimental-strip-types scripts/audit_all.mts
npx remotion render part2/index.ts Part2 out/sonicview-part2.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p
```

`pack_project.py` refuses to pack if any build-critical file is missing, rather than producing an
archive that looks fine until someone unzips it.
