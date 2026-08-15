# Voiceover Script — India's 80th Independence Day Reel

**Not part of the original build.** The reel shipped deliberately silent-VO —
14 beats in 60 seconds was judged tight enough that narration would fight the
on-screen text and the score. This script is a later addition for anyone who
wants to record a voiceover; the reel plays exactly as before until a real
recording replaces the placeholder at `public/vo/voiceover.mp3` (see *Wiring*
below).

**Tone:** Warm & Trustworthy blended with Cinematic & Aspirational — short,
declarative phrases rather than full sentences, so each line lands and gets
out of the way before the next beat cuts in. Never a list of facts recited
flatly.

**Total: 125 words across 60.000 s (1800 frames @ 30fps) = ~125 wpm** —
comfortably under the 150 wpm standard pace, leaving real breathing room
between beats rather than racing the cuts. Timestamps below are exact frame
boundaries from `src/lib/theme.ts` — read each line so it starts a beat or two
into its beat (after the headline has begun animating in) and finishes with a
beat of silence before the next line begins.

**"Shivansh Electronics" is never spoken.** It appears once, silently, as a
signature under the closing wish (Section 6 of the original brief). Speaking
it in the VO would make it a second mention; the script stays entirely about
India, as does the closing beat's spoken line.

**No political content, no other-country comparison** — same rules as the
on-screen copy, and this script was checked against the same manual read the
copy audit applies.

---

## Full script (read straight through)

> Eighty years since the dawn we waited centuries for.
> A wheel spun by hand broke chains held for generations.
> Twenty-four spokes — a wheel that never stops turning.
> Here, where the mountains touch the sky first.
> Rivers that have carried life for four thousand years.
> From burning sand to endless open shore.
> Stepwells, stupas, temples, domes — twenty-three centuries of building.
> Every region dances to its own rhythm.
> And plays it — on strings, skins, and breath.
> Woven, printed, fired, and served — by hand, every single day.
> Lamps. Colour. Harvest. The new moon. Something is always being celebrated.
> Twenty-two languages on paper. Hundreds more in the streets.
> Many peoples. Many voices. One chosen country.
> To every Indian — a very happy eightieth Independence Day. Jai Hind.

---

## Beat-by-beat timing

| Beat | Frames | Time | Dur | Line | Words |
|---|---|---|---|---|---|
| B01 · Dawn & the Tricolour | 0–170 | 0:00.000–0:05.667 | 5.667s | Eighty years since the dawn we waited centuries for. | 9 |
| B02 · 1947 — A Nation Awoke | 170–320 | 0:05.667–0:10.667 | 5.000s | A wheel spun by hand broke chains held for generations. | 10 |
| B03 · The Ashoka Chakra | 320–438 | 0:10.667–0:14.600 | 3.933s | Twenty-four spokes — a wheel that never stops turning. | 9 |
| B04 · The Himalaya | 438–546 | 0:14.600–0:18.200 | 3.600s | Here, where the mountains touch the sky first. | 8 |
| B05 · Rivers & Forests | 546–658 | 0:18.200–0:21.933 | 3.733s | Rivers that have carried life for four thousand years. | 9 |
| B06 · Desert & Coast | 658–770 | 0:21.933–0:25.667 | 3.733s | From burning sand to endless open shore. | 7 |
| B07 · Architecture Across Eras | 770–900 | 0:25.667–0:30.000 | 4.333s | Stepwells, stupas, temples, domes — twenty-three centuries of building. | 9 |
| B08 · Dance — Classical & Folk | 900–1024 | 0:30.000–0:34.133 | 4.133s | Every region dances to its own rhythm. | 7 |
| B09 · Music — Ragas & Rhythms | 1024–1136 | 0:34.133–0:37.867 | 3.733s | And plays it — on strings, skins, and breath. | 8 |
| B10 · Craft, Textile & Table | 1136–1254 | 0:37.867–0:41.800 | 3.933s | Woven, printed, fired, and served — by hand, every single day. | 10 |
| B11 · Festivals of the Year | 1254–1382 | 0:41.800–0:46.067 | 4.267s | Lamps. Colour. Harvest. The new moon. Something is always being celebrated. | 11 |
| B12 · Many Tongues, One Country | 1382–1500 | 0:46.067–0:50.000 | 3.933s | Twenty-two languages on paper. Hundreds more in the streets. | 10 |
| B13 · Unity in Diversity | 1500–1620 | 0:50.000–0:54.000 | 4.000s | Many peoples. Many voices. One chosen country. | 7 |
| B14 · The Wish | 1620–1800 | 0:54.000–1:00.000 | 6.000s | To every Indian — a very happy eightieth Independence Day. Jai Hind. | 11 |

**Total: 125 words · 60.000 s · matches `src/lib/theme.ts` exactly.**

---

## Wiring the recording in

A silent 60.000 s placeholder already sits at `public/vo/voiceover.mp3`, mixed
into the reel at `volume={1}` behind the ambient bed (0.30) and the score
(0.62) — this is the same convention the toolkit's other reel projects use.
Recording it is a drop-in replacement, no code changes needed:

```bash
# record or generate your VO as a 60.000 s mp3, 48kHz stereo, then:
cp your-recording.mp3 public/vo/voiceover.mp3
python3 scripts/audit_audio.py   # confirms it decodes, is ~60s, carries signal
npm run render                    # re-render with the VO mixed in
npm run verify                    # re-check the delivered file
```

If the recorded VO runs a little short or long of 60.000 s, that's fine — the
placeholder length is a target, not a hard constraint, since the beat table
(not the VO) drives the reel's timing. Nudge word choice per line rather than
speeding up the read if a line is consistently running past its beat's
duration.
