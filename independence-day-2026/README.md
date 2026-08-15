# India's 80th Independence Day — 60-Second Reel

A 60-second vertical reel for **15 August 2026**, India's 80th Independence Day.
Heritage and diversity storytelling in original vector motion graphics, with a
score and SFX palette synthesised entirely from code.

**Output:** `out/independence-day-80th-reel.mp4` — 1080×1920, 30 fps, exactly
1800 frames / 60.000 s, h264 `yuv420p`, stereo AAC 48 kHz.

> This directory is a **self-contained Remotion project**. It has its own
> `package.json`, `tsconfig.json` and `public/`, and references nothing outside
> itself — it can be lifted into a standalone repository with a plain copy.

---

## Quick start

```bash
npm install
python3 scripts/fetch_fonts.py   # vendor the 15 woff2 faces
npm run audio                    # synthesise + audit all 23 audio assets
npm run studio                   # preview
npm run render                   # 1800-frame render to out/
npm run verify                   # check the delivered file
```

Requires Python with `numpy` and `scipy` for the audio pipeline.

---

## What this reel is about

The subject is **India** — not any company. The through-line is *unity in
diversity*: many regions, languages and traditions forming one country, told as
a felt progression rather than a recited list. The reel deliberately ranges
across the country rather than lingering on any one region, faith or language.

Two hard content rules are enforced mechanically by `scripts/copy_audit.mjs`:

1. **"Shivansh Electronics" appears exactly once**, in the closing beat, as an
   understated signature beneath the wish — no designation, no tagline, no
   contact detail, no call to action, no logo. The wish itself is entirely
   about India; the company name is never the subject of a sentence.
2. **No political party and no contemporary political figure** appears
   anywhere. This is a civic and cultural piece.

The audit also checks that no other country is referenced and that no
promotional or contact language reaches the screen.

### Factual notes

- 15 August 2026 is the **80th Independence Day**; **79 years** have been
  completed since 15 August 1947. Both framings are accurate — they count
  different things — and the reel uses the ordinal on screen.
- The Ashoka Chakra has **24 spokes** and was adopted on the national flag in
  July 1947.
- The Eighth Schedule of the Constitution lists **22 languages**.
- India has **28 states and 8 union territories**.
- The coastline runs roughly **7,500 km** including the island territories.

---

## The fourteen beats — 1800 frames exactly

| # | Beat | Frames | Sec | Ground |
|---|---|---|---|---|
| 1 | Dawn & the Tricolour *(hook)* | 170 | 5.67 | indigo |
| 2 | 1947 — A Nation Awoke | 150 | 5.00 | indigo |
| 3 | The Ashoka Chakra | 118 | 3.93 | indigo |
| 4 | The Himalaya | 108 | 3.60 | parchment |
| 5 | Rivers & Forests | 112 | 3.73 | parchment |
| 6 | Desert & Coast | 112 | 3.73 | parchment |
| 7 | Architecture Across Eras | 130 | 4.33 | parchment |
| 8 | Dance — Classical & Folk | 124 | 4.13 | indigo |
| 9 | Music — Ragas & Rhythms | 112 | 3.73 | indigo |
| 10 | Craft, Textile & Table | 118 | 3.93 | parchment |
| 11 | Festivals of the Year | 128 | 4.27 | indigo |
| 12 | Many Tongues, One Country | 118 | 3.93 | indigo |
| 13 | Unity in Diversity | 120 | 4.00 | parchment |
| 14 | The Wish | 180 | 6.00 | indigo |

Opening 5.67 s · central passage 48.33 s (avg 4.4 s/beat, range 3.6–5.0 s) ·
**closing passage = beats 13 + 14 = 300 frames = exactly 10.00 s**.

Every beat carries its own camera move or asset animation, all on cubic-bezier
easing — nothing in this project uses linear interpolation.

Beat 7 spans **seven regions and seven eras** (Gujarat stepwell, Sanchi-type
stupa, Odisha shikhara, Tamil gopuram, Deccan dome, Bengal colonnade, a modern
skyline) rather than repeating one famous monument. Beat 11 gives **eight
festivals across faiths and regions equal visual weight**. Beat 12 sets the
country's name in **eleven scripts**, each in a face that renders it correctly.

---

## Format & safe zones

Canvas 1080×1920. The safe-zone geometry is ported verbatim from the completed
TASCAM Sonicview and MOTU M-Series reels:

| Zone | Pixels | Rule |
|---|---|---|
| Top | 0–250 | ambient only — no text, no key detail |
| **Primary safe area** | **250–1580** | every headline, artwork and caption |
| Bottom | 1580–1920 | ambient only |
| Side margins | 72 each side | all content inboard |

The 1080×1330 inner box is treated as the region that must survive cropping;
content biases slightly upward inside it. `npm run stills -- --guides` renders
every beat with the zones overlaid so this can be checked visually.

### Palette

Two alternating grounds, so the 60 s has a real light/dark rhythm rather than
one flat field. Every text token was contrast-checked numerically against its
own ground (WCAG AA floor 4.5:1; most clear AAA 7:1):

- **Indigo night** `#0B1030` — hook, chakra, dance, music, festivals,
  languages, the wish. Ink: ivory `#F7F2E8` (16.13:1), saffron `#FF9933` (8.63:1).
- **Warm parchment** `#F6EFE2` — land, architecture, craft, the map.
  Ink: `#16110B` (15.42:1), deep green `#0E6606` (7.06:1).

The tricolour is used at flag values for large graphics only; text-safe
variants are defined separately in `src/lib/theme.ts`.

### Typography

- **Display — Playfair Display 700/900.** A high-contrast transitional serif,
  chosen because it reads as dignified and celebratory. The Sonicview/MOTU
  projects' Barlow Condensed is right for broadcast hardware and would read as
  a product spec sheet on a heritage piece, so the structural hierarchy is
  inherited and the faces themselves are re-chosen for the subject.
- **Body — Inter 400/600.** Neutral humanist; lets the serif carry the emotion.
- **Figures — JetBrains Mono 500.** Date stamps and tracked micro-labels.
- **Ten Indic / Perso-Arabic faces** — Noto Serif Devanagari, Bengali, Tamil,
  Telugu, Kannada, Gujarati, Gurmukhi, Malayalam, Oriya, and Noto Naskh Arabic.

All fifteen faces are vendored into `public/fonts` by `scripts/fetch_fonts.py`
and loaded behind `delayRender`, so an 1800-frame render never depends on the
network and no frame is painted with a fallback face.

`coollabsio/fonts` is the documented fallback CDN; the Google Fonts CDN was
reachable, and both serve identical files, so one source suffices.

---

## Visual assets — 100% original vector art

There is no photography and no AI-generated imagery in this reel. Every visual
is authored geometry in `src/components/Art.tsx` and `src/components/Motifs.tsx`
— the Ashoka Chakra, the tricolour (a waving cloth ribbon, not a flat
rectangle), the map of India, the charkha, the breaking chain, layered
landscapes, seven architectural forms, eight dance figures, eight instruments,
craft patterns and eight festival motifs.

This is deliberate: hand-authored vector art avoids stock-licensing exposure,
avoids the errors an image model makes when asked to draw a real monument, and
gives frame-accurate control over every reveal.

### The map of India — full territorial extent

The outline in beat 13 shows **India's official territorial extent**. It
includes the whole of **Jammu & Kashmir — Gilgit-Baltistan and
Pakistan-occupied Kashmir** — together with the **Shaksgam / Trans-Karakoram
Tract** and **Aksai Chin**, up to the northernmost claimed point at roughly
**37.05°N** near the Wakhan trijunction.

An outline drawn to the Line of Control or the Line of Actual Control is **not
the map of India** and must never be used. This is not a stylistic preference:
depicting India's boundaries incorrectly is an offence under Indian law.

The outline is projected from real longitude/latitude (67–98°E, 7–37.5°N)
through 60 points, then smoothed — a sparser list smooths away exactly the
features that make it readable, including the northern lobe of J&K.

`scripts/copy_audit.mjs` reads the projected point list directly out of
`Art.tsx` and fails the build if the northern tip, Aksai Chin, or western J&K
are missing, so the boundary cannot silently regress.

---

## Audio — everything synthesised from code

`scripts/gen_audio.py` generates all 23 assets with numpy/scipy: Karplus-Strong
plucked strings, biquad filters, envelopes, comb and hall reverb, inharmonic
bell partials, stereo widening. **No external audio service is used**, and none
of the toolkit's ElevenLabs tooling is involved.

### The score — `music-bed.mp3`, 60.000 s

A modern-classical hybrid built on **Raga Desh**, the raga traditionally
carried by India's patriotic song repertoire, over a tanpura drone in D. Desh
uses the natural seventh in ascent and the flat seventh in descent, which is
what gives the bed its warm, unforced lift rather than a minor-key seriousness:

```
aroha    S  R  M  P  N  S'       (0  2  5  7  11 12)
avaroha  S' n  D  P  M  G  R  S  (12 10 9  7  5  4  2  0)
```

Layers: tanpura drone (tuned Pa-Sa-Sa-Sa̲), sitar-register plucks, a breathy
bansuri-register lead playing real Desh phrases including the pakad, tabla and
dholak on an eight-beat Keherwa cycle, and an orchestral string pad plus low
brass stack for the patriotic swells. 96 BPM — 24 bars in exactly 60 s. The
same instrument set runs the whole reel; only the energy contour changes, cut
to the beat table.

### The constant ambient bed — `ambient-bed.mp3`, 60.000 s

A separate, continuous texture that plays underneath the music for the entire
runtime: low tanpura shimmer, slow moving air, and a distant bell resonance.
It is deliberately its own file rather than folded into the score, so the
constant-presence requirement is independently auditable — `verify_render.mjs`
checks the delivered file's quietest frame, not just that an audio track exists.

### Transition cues — 21, character-matched per beat

`conch` · `charkha` · `chain-break` · `chakra-ring` · `flag-furl` ·
`whoosh-silk` · `whoosh-air` · `wind-peak` · `water-flow` · `stone-set` ·
`ghungroo` · `sitar-pluck` · `tabla-na` · `tabla-tin` · `dhol-hit` ·
`bell-temple` · `bansuri-swell` · `riser-tanpura` · `impact-deep` ·
`shimmer-gold` · `chime-close`

Each beat transition gets a cue matched to what the beat actually is — a
percussive `stone-set` for the architecture reveal, `ghungroo` ankle-bells into
the dance beat, `shimmer-gold` and `chime-close` for the wish — rather than one
generic whoosh reused throughout.

---

## Validation

Every gate below was run and passed before delivery.

| Gate | Command | Result |
|---|---|---|
| Audio pipeline | `python3 scripts/audit_audio.py` | 23/23 files decode, stereo, 48 kHz, non-silent, non-clipping, envelope varies; both beds exactly 60.000 s; ambient floor 0.476 of peak; cue table cross-referenced against disk in both directions |
| Per-beat stills | `node scripts/stills.mjs` | 14 stills reviewed at full resolution |
| Safe zones | `node scripts/stills.mjs --guides` | 14 overlay stills — no critical content in the top/bottom strips or side margins |
| Content rules | `node scripts/copy_audit.mjs` | single mention verified, no designation, no promotional language, no political content, no other-country reference |
| Types | `npx tsc --noEmit` | clean |
| Bundler | `node scripts/bundlecheck.mjs` | bundle builds; `Reel` resolves at 1080×1920 / 30 fps / 1800 frames |
| Range test | `npm run range` (frames 740–1040) | 3 beat transitions; ambient bed present on every frame (floor RMS 0.039), transition cues detected at expected frames |
| Full render | `npm run render` | 1800 frames |
| Delivered file | `npm run verify` | 1080×1920, 30 fps, 1800 frames, `yuv420p`, video + audio streams, ambient bed never drops out |

The reel is rendered from **PNG** intermediate frames. JPEG frames make x264
tag the output `yuvj420p` (full-range), which can shift levels on some players.

---

## Layout

```
independence-day-2026/
├── public/
│   ├── audio/sfx/          23 synthesised mp3s (21 cues + 2 beds)
│   └── fonts/              15 vendored woff2 faces
├── scripts/
│   ├── fetch_fonts.py      vendor the type system
│   ├── gen_audio.py        synthesise the score, ambient bed and cues
│   ├── audit_audio.py      validate every audio asset
│   ├── copy_audit.mjs      enforce the two hard content rules
│   ├── stills.mjs          per-beat stills, optional safe-zone guides
│   ├── bundlecheck.mjs     bundle + composition geometry
│   └── verify_render.mjs   verify the delivered mp4
├── src/
│   ├── components/         Stage, Beat, Type, Cue, Reel, Art, Motifs
│   ├── lib/                theme (beat table, palette), copy, sfx, anim, fonts
│   ├── scenes.tsx          the fourteen beats
│   └── Root.tsx            Reel + SafeCheck compositions
└── out/
    └── independence-day-80th-reel.mp4
```

`src/lib/theme.ts` holds the beat table — the single source of truth for
timing. `Reel.tsx` throws at render time if the beat nodes and the table
disagree, and `Root.tsx` throws if the table does not sum to 1800.

---

## Notes

- **No voiceover.** The reel is text, music and SFX. At 14 beats in 60 seconds
  a narration track would fight the imagery, and on-screen headlines are held
  long enough to read without pausing.
- Rendering here uses the preinstalled Chromium under `/opt/pw-browsers`
  (see `scripts/_chrome.mjs` and `remotion.config.ts`); this environment blocks
  egress to `remotion.media`, so Remotion's own headless-shell download fails.
  On an unrestricted machine those overrides are harmless and can be dropped.
- `motion-canvas` was consulted only as a conceptual reference for the
  generator-driven Chakra and map animations. It is not imported; everything is
  native Remotion/SVG.
- `rohitg00/awesome-claude-design` and `VoltAgent/awesome-claude-design` were
  **not attached to the session** and were therefore not consulted.
