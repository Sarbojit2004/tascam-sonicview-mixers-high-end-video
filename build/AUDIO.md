# Audio Deliverables — TASCAM Sonicview

Twelve files: a **continuous music bed** and a **transition + accent SFX timeline** for each of the
six videos. Every one spans its deliverable's exact runtime and is frame-aligned to the rendered
picture, so both drop onto a timeline at 00:00:00:00 with no offset.

Built entirely from the material in **tascam-recording-series-mixers-high-end-video**:

- **Music** — the eight Epidemic Sound tracks in `sfx-audio-files/`, with their BASS / DRUMS /
  INSTRUMENTS / MELODY stems.
- **Sound effects** — the 39 real MP3s in `_superseded/public/audio/sfx/`.

Nothing is synthesised. An earlier pass built this layer from code, which was wrong — the files
were supplied and should have been used.

---

## The twelve files

| Deliverable | Runtime | Music track | Bed LUFS | SFX LUFS | Bed peak | SFX peak | Cues |
|---|---|---|---|---|---|---|---|
| Reel 1 · The Computational Core | 178.000 s · 5340f | ACTIVE | -20.0 | -22.0 | -6.36 dB | -7.15 dB | 25 |
| Reel 2 · The Network Fabric | 178.000 s · 5340f | Impossible Theory | -20.0 | -22.02 | -2.04 dB | -7.0 dB | 25 |
| Reel 3 · The Control Surface | 178.000 s · 5340f | The Light from Within | -20.0 | -22.02 | -2.97 dB | -6.32 dB | 25 |
| Part 1 · The Computational Core | 298.000 s · 8940f | Fable | -20.0 | -22.0 | -2.92 dB | -7.56 dB | 35 |
| Part 2 · The Network Fabric | 298.000 s · 8940f | Stay For A Minute | -20.0 | -22.0 | -4.04 dB | -7.21 dB | 35 |
| Part 3 · The Control Surface | 298.000 s · 8940f | Box of Black Pearls | -20.0 | -22.0 | -4.28 dB | -5.89 dB | 37 |

Filenames: `sonicview-<key>-music-bed.wav` and `sonicview-<key>-sfx-transitions.wav`, each with a
320 kbps MP3 beside it.

**Summing the two files at unity reproduces the intended mix.** They are balanced against each
other before export, so no further gain-matching is needed — bring both in at 0 dB.

---

## Levels, and where they come from

Measured from the eight FLAC stems the Recording Series production actually ships:

```
their beds           -18.4 to -24.5 LUFS,  peak -3.61 dBFS (all four identical)
their SFX timelines  -21.7 to -24.3 LUFS,  peak -2.9 to -5.1 dBFS
SFX relative to bed  -4.0, -5.9, +0.1, +2.6 dB   (mean -1.8 LU)
```

These sit at **-20.0 LUFS for every bed and -22.0 for every SFX layer** — inside their range, and
holding their bed-to-SFX relationship, but consistent across all six rather than varying by 6 dB
the way theirs do. Nothing peaks above -2.0 dBFS.

> The first attempt normalised the bed by **peak** and scaled the effects by the same factor, on
> the reasoning that this preserves the mix ratio in their code (bed 0.34, effects 0.13-0.22). It
> does preserve that ratio — but peak and loudness are different things, and these six tracks have
> very different crest factors. The effects layer came out spanning -30.3 to -15.6 LUFS across the
> six, and Reel 3's peaked at **+0.07 dBFS**, which is clipping. Both layers are normalised by
> loudness instead.

The per-cue gains still sit in their production's own 0.13-0.22 range, so the balance *between*
individual effects is theirs; the normalisation only sets the balance between the two layers.

---

## What is on the SFX timeline

Two layers, because "transition SFX" means both things in practice:

**Transitions** — one sound on every scene change, five frames ahead of the cut so it leads the
picture rather than arriving after it. Eight sounds rotate, so no two consecutive cuts share one:
`whoosh-soft`, `transition-blip`, `whoosh-air`, `whoosh-swoop`, `whoosh-bright`, `whoosh-metal`,
`whoosh-rev`, `riser-short`.

**Accents** — one sound inside a beat where something mechanical or decisive happens on screen.
Notably: `relay-click` on the ST 2022-7 changeover, `db25-lock` on the GPIO tally closing,
`fader-slide` on the snapshot recall driving the motorised bank, `sd-insert` on a plate seating.

**Three files are deliberately unused:** `sub-drop`, `impact-deep` and `whoosh-low`. All three are
large low-frequency cinematic hits, which this pipeline's standing principle rules out — they read
as advertising and they mask a spoken figure. The Recording Series shipped them; that does not
oblige this production to use them.

22 of the 39 sound files are used across the six.

---

## Music

Six distinct tracks, no repeats:

| | Track |
|---|---|
| Reel 1 · The Computational Core | ACTIVE |
| Reel 2 · The Network Fabric | Impossible Theory |
| Reel 3 · The Control Surface | The Light from Within |
| Part 1 · The Computational Core | Fable |
| Part 2 · The Network Fabric | Stay For A Minute |
| Part 3 · The Control Surface | Box of Black Pearls |

The four the Recording Series left unused go first (ACTIVE, Fable, Impossible Theory, The Light
from Within). The two that had to be reused are its **reel** tracks, not its long-form track: a
298-second landscape part is a different context from a 178-second reel, whereas reusing the track
that carried its 898-second centrepiece would make the two productions sound like the same film.
Unused here: Idiosyncrasies, Like the Palm of Your Hand.

**The bed is re-voiced from stems, not looped.** A 298-second part needs more than any single
track provides, and looping a full mix is audible. Each pass is rebuilt from the isolated stems at
a different balance — an opening on instruments and melody with the drums held back, a full-weight
body, a decaying close — so the bed develops across the runtime. Both ends of each source track are
trimmed to the span where it is actually playing, so no loop join lands in a quiet intro or a
fade-out.

---

## Sync

Cue frames are read from the same beat lists the six videos were rendered from, so they cannot
drift from the picture. Verified after export: **all 182 cues carry audio at their exact frame**,
and every file is exactly 5,340 or 8,940 frames long.

```bash
node --experimental-strip-types scripts/emit_cues_real.mts   # cue sheet from the beat lists
python3 scripts/build_audio_real.py                          # build, normalise, export
```

Loudness is measured by `scripts/lufs.py`, a BS.1770-4 implementation written because the ffmpeg
bundled with Remotion's compositor is stripped — it lists `loudnorm` as `(null)` and has no
`ebur128`. It was validated against the Recording Series' own shipped FLACs before use.
