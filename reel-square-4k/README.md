# TASCAM Sonicview — 60-second Square 4K Reel (two music cuts)

A beat-locked product reel for the **TASCAM Sonicview** series, produced for **Shivansh Electronics —
TASCAM's Authorized Partner**. One design, cut twice: once to each song, so every scene change,
flash, product swap and outro reveal lands on *that* song's own beat grid.

| Cut | Music | Length | Frames | Output |
|---|---|---|---|---|
| **Thunderstruck** | AC/DC — *Thunderstruck* | 60.90 s | 1,827 @ 30 fps | `out/sonicview-square-4k-thunderstruck.mp4` |
| **Where We Started** | Lost Sky — *Where We Started (feat. Jex)* [NCS] | 60.03 s | 1,801 @ 30 fps | `out/sonicview-square-4k-lostsky.mp4` |

Both are **3840 × 3840** (square 4K). Each also ships as a `-1080.mp4` upload copy and with a
**9:16 portrait 4K thumbnail** (2160 × 3840, plus a 1080 × 1920 copy) in `thumbnails/`
(`CoverThunderstruck` / `CoverLostSky` compositions).

---

## Delivered files (verified by `scripts/verify.py`)

| File | Size | Frames | Length |
|---|---|---|---|
| `out/sonicview-square-4k-thunderstruck.mp4` — 3840×3840 | 90.3 MB | 1,827 | 60.900 s |
| `out/sonicview-square-4k-thunderstruck-1080.mp4` | 50.4 MB | 1,827 | 60.900 s |
| `out/sonicview-square-4k-lostsky.mp4` — 3840×3840 | 88.9 MB | 1,801 | 60.030 s |
| `out/sonicview-square-4k-lostsky-1080.mp4` | 48.1 MB | 1,801 | 60.030 s |
| `thumbnails/sonicview-*-thumbnail-9x16-4k.jpg` | 2160×3840 | — | — |

H.264 High, BT.709, AAC 320 kb/s. The 4K files are H.264 level 6 (3840×3840 exceeds
level 5.2), which some phones cannot preview; use the `-1080` copy for uploading from a phone.

## The music edits

Both songs are cut on their own downbeats (madmom RNN + DBN downbeat tracker, then snapped to the
nearest transient). Splices use a 40 ms equal-power crossfade that *ends* on the downbeat, so the
incoming attack is untouched. `scripts/music.py` writes the edit and a beat map
(`src/music/<id>.json`: beats, downbeats, kick/snare onsets, per-frame low/mid/high/RMS envelopes)
that drives the picture.

**Thunderstruck — 133.3 BPM, 1.80 s bars (live drummer: the tracked beats are used as played)**

| Reel | Song | What happens |
|---|---|---|
| 0.00 – 5.39 s | 24.06 s → | the riff and the "Thunder!" chants — lightning on beats 2 and 4 |
| 5.39 s | 29.45 s | **drums enter** — first impact, 16XP lands |
| 12.61 s | 36.67 s | **full band** — second impact, 24XP lands |
| 27.02 s | 51.08 s | verse — third impact, the dp wall |
| 50.44 s | 74.50 → 280.20 s | splice into the record's own ending |
| 50.44 – 60.90 s | 280.20 – 290.64 s | **outro**: the closing stabs (52.6 / 54.7 / 57.1 / 59.7 s) reveal the partner mark, the numbers, the web and socials |

**Where We Started — 150 BPM, 1.60 s bars (on a grid)**

| Reel | Song | What happens |
|---|---|---|
| 0.00 – 4.80 s | 59.26 s → | last three bars of the build — the riser lights the console |
| 4.80 s | 64.06 s | **the drop** — impact, 16XP lands |
| 30.40 s | 89.66 → 160.06 s | splice from the end of drop 1 into bar 5 of drop 2 (the bars match at 0.994 chroma+MFCC similarity) — impact |
| 49.60 – 60.03 s | 179.26 – 189.66 s | **outro** on the post-drop melody, 3.2 s fade |

---

## Scene map — every repository image, every scene on a downbeat

| # | Scene | Bars (TS / LS) | Images | Treatment |
|---|---|---|---|---|
| 1 | Hook | 3 / 3 | 1 | 24dp revealed by lightning / a rising light sweep; *Shivansh Electronics presents · TASCAM · SONICVIEW* |
| 2 | 16XP | 4 / 4 | 9 | cut-outs swing in on each beat over a giant outlined "16XP"; spec chips; quad view |
| 3 | 24XP · 24dp | 3 / 3 | 10 | hero slam, then triptych glass panels dealt on the 8th notes |
| 4 | VIEW | 3 / 3 | 18 | the screens on a curved panoramic monitor wall; each boots on its own 16th note |
| 5 | Engine | 2 / 3 | 8 | flap-display spec slams: 54-bit · 96 kHz · 0.51 ms · Class 1 HDIA · −128 dBu · 32-bit |
| 6 | dp wall | 2 / 3 | 20 | fronts and rear I/O on a lit 5×4 grid, diagonal 16th-note build |
| 7 | Dante · SB-16D | 2 / 3 | 13 + Dante mark | hub-and-spoke network, packets ride the cables on the beat |
| 8 | IF-Series | 3 / 3 | 17 | three counter-running card rails; the protocol chip changes on the beat |
| 9 | System design | 2 / 2 | 14 | signal-flow sheets dropping onto a light table, one per 8th |
| 10 | In service | 2 / 2 | 8 | full-bleed installations revealed by falling slices |
| 11 | Finale | 2 / 2 | 11 | the family mosaic blows outward, TASCAM lands |
| 12 | Outro | 10.4 s | — | Audient-Horizon presentation language (below) |

**Coverage: 129 / 129** distinct repository images (the 169 raw files de-duplicate to 129 images +
3 logos + 2 clips — see `../src/lib/ledger.json`), each owned by exactly one scene, plus the
TASCAM, Shivansh Electronics and Dante marks. `node scripts/audit.mjs` fails the build if any image
is unplaced, doubled, missing on disk, or if the copy breaks the editorial rules.

## The outro — Audient Horizon presentation language

Ten seconds on a dark, blurred studio backdrop: one large rounded media card (headline
top-left, glass pill top-right, a second pill bottom-centre — the layout of the Horizon feature
cards), then the partner block below it: the transparent Shivansh Electronics mark, *TASCAM's
Authorized Partner*, three WhatsApp numbers and the website as glass pills, social icons. Each
group is revealed on a hit in the music.

## Look

- Dark stage; every product shot on white is keyed off its sweep (`public/cut/`) and lit from
  behind, so no white rectangle ever flashes up. Diagrams stay on light "paper" cards.
- Every image was rebuilt 4× with **Real-ESRGAN general-x4v3** before use (the sources are
  800–2372 px; the canvas is 3840 px).
- Type: **Unbounded** (display), **Poppins** (UI — the Audient cards' geometric sans), **JetBrains
  Mono** (data). All vendored in `public/fonts`.
- Per-cut accent: electric blue + lightning (Thunderstruck), violet/cyan + light ribbons (Lost Sky).
- A HUD with the live bar count, tempo and a stereo meter driven by the actual music.
- Logos are the **transparent** TASCAM and Shivansh Electronics marks, knocked out to white for the
  dark stage (`scripts/prep_images.py`).

## Build

```bash
npm install
python3 scripts/build_onnx.py        # realesr-general-x4v3.pth -> ONNX (SR_PTH / SR_MODEL env vars)
python3 scripts/prep_images.py       # ~60 min on 4 CPU cores: 4x rebuild, cut-outs, logos, icons
python3 scripts/make_variants.py     # mid-size tiles, knock-outs, grain
MUSIC_DIR=/path/to/mp3s python3 scripts/music.py   # both edits + beat maps
node scripts/audit.mjs               # coverage + editorial rules
npx tsc --noEmit
npm run studio                       # preview (1920 design space)
npm run render:thunder               # 3840 x 3840 master, then the 4K + 1080 deliverables
npm run render:lostsky
```

Needs `ffmpeg`, Python 3 with numpy/scipy/pillow/onnxruntime, and (only to re-detect downbeats)
madmom — the detected downbeats are cached in `scripts/cache/`.

## Editorial rules

No pricing of any kind; no competing brand; Shivansh Electronics is only ever *TASCAM's Authorized
Partner*; the call to action is a technical consultation. Every figure on screen is marked VERIFIED
in *TASCAM Sonicview Technical Research (30 Aug 2026)*.

## Music rights

*Where We Started* is an NCS release — free to use with credit: **"Music: Lost Sky – Where We
Started (feat. Jex) [NCS Release]. Music provided by NoCopyrightSounds."**
*Thunderstruck* is a commercial AC/DC recording; platforms may mute or claim an upload that embeds
it. If that happens, post the Lost Sky cut, or post the Thunderstruck picture and add the track
from Instagram's own music library.
