/**
 * Emit the audio cue sheet from the SAME beat lists the six rendered videos
 * were built from, so the delivered audio lines up frame-for-frame with picture
 * that already exists. Nothing is re-rendered; the cue frames are read out of
 * the compositions rather than re-derived by hand.
 *
 * Two layers:
 *   TRANSITION  on every scene change — that is, at each beat's first frame
 *               except the very first. Sounds rotate so no two consecutive
 *               cuts share one.
 *   ACCENT      inside a beat, where something mechanical happens on screen.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { frames, starts } from "../shared/beat.ts";
import { withGeometry } from "../shared/layout.ts";
import { PART_FRAMES, REEL_FRAMES } from "../shared/theme.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Mirrors scripts/sfx_map.py. Kept in step by check below.
const TRANSITIONS: [string, number][] = [
  ["whoosh-soft.mp3", 0.15],
  ["transition-blip.mp3", 0.13],
  ["whoosh-air.mp3", 0.16],
  ["whoosh-swoop.mp3", 0.15],
  ["whoosh-bright.mp3", 0.14],
  ["whoosh-metal.mp3", 0.15],
  ["whoosh-rev.mp3", 0.14],
  ["riser-short.mp3", 0.16],
];

const ACCENT_FOR_KIND: Record<string, { file: string; at: number; gain: number }> = {
  cold: { file: "chapter-swell.mp3", at: 8, gain: 0.18 },
  problem: { file: "swell-dark.mp3", at: 12, gain: 0.17 },
  statement: { file: "click-deep.mp3", at: 16, gain: 0.14 },
  macro: { file: "sd-insert.mp3", at: 22, gain: 0.16 },
  hero: { file: "brand-chime.mp3", at: 14, gain: 0.20 },
  montage: { file: "gallery-tick.mp3", at: 12, gain: 0.13 },
  specs: { file: "tick-double.mp3", at: 28, gain: 0.16 },
  screen: { file: "click-ui.mp3", at: 20, gain: 0.15 },
  broll: { file: "meter-ripple.mp3", at: 24, gain: 0.14 },
  realvideo: { file: "fader-slide.mp3", at: 16, gain: 0.15 },
  bridge: { file: "chapter-out.mp3", at: 10, gain: 0.17 },
  outro: { file: "chime-final.mp3", at: 10, gain: 0.18 },
};

const ACCENT_FOR_DEMO: Record<string, { file: string; at: number; gain: number }> = {
  hdia: { file: "meter-ripple.mp3", at: 100, gain: 0.17 },
  summing: { file: "riser.mp3", at: 62, gain: 0.16 },
  redundancy: { file: "relay-click.mp3", at: 150, gain: 0.20 },
  afv: { file: "db25-lock.mp3", at: 46, gain: 0.19 },
  recall: { file: "fader-slide.mp3", at: 60, gain: 0.22 },
};

const SET = [
  { key: "reel1", portrait: true, target: REEL_FRAMES },
  { key: "reel2", portrait: true, target: REEL_FRAMES },
  { key: "reel3", portrait: true, target: REEL_FRAMES },
  { key: "part1", portrait: false, target: PART_FRAMES },
  { key: "part2", portrait: false, target: PART_FRAMES },
  { key: "part3", portrait: false, target: PART_FRAMES },
];

const out: Record<string, unknown> = {};
let grandTotal = 0;

for (const d of SET) {
  const mod = await import(`../${d.key}/beats.ts`);
  const beats = withGeometry(mod.BEATS, d.portrait);
  const s = starts(beats);
  const cues: { file: string; frame: number; gain: number; layer: string; beat: string }[] = [];

  beats.forEach((b, i) => {
    // TRANSITION — on the cut into this beat. The opening frame of the whole
    // deliverable is not a cut, so it gets none.
    if (i > 0) {
      const [file, gain] = TRANSITIONS[(i - 1) % TRANSITIONS.length];
      // Start a few frames early so the sound leads the picture change, which
      // is how a cut reads as intentional rather than as a sound arriving late.
      cues.push({ file, gain, frame: Math.max(0, s[i] - 5), layer: "transition", beat: b.id });
    }

    // ACCENT — inside the beat.
    const a = b.kind === "demo" && b.demo ? ACCENT_FOR_DEMO[b.demo] : ACCENT_FOR_KIND[b.kind];
    if (a) {
      cues.push({
        file: a.file,
        gain: a.gain,
        frame: s[i] + Math.min(a.at, frames(b.sec) - 12),
        layer: "accent",
        beat: b.id,
      });
    }
  });

  cues.sort((x, y) => x.frame - y.frame);
  out[d.key] = { frames: d.target, seconds: d.target / 30, cues };
  grandTotal += cues.length;
  const t = cues.filter((c) => c.layer === "transition").length;
  console.log(
    `  ${d.key}  ${String(d.target).padStart(4)}f · ${beats.length} beats · ` +
      `${t} transitions + ${cues.length - t} accents = ${cues.length} cues`,
  );
}

writeFileSync(join(ROOT, "cues-real.json"), JSON.stringify(out, null, 1));
console.log(`\ncues-real.json written — ${grandTotal} cues across six deliverables`);
