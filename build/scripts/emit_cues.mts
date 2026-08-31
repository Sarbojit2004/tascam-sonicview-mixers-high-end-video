/**
 * Emit the audio cue sheet from the SAME beat lists and SFX map the videos
 * render from, so the standalone audio deliverables cannot drift out of sync
 * with the videos they accompany.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { frames, starts } from "../shared/beat.ts";
import { withGeometry } from "../shared/layout.ts";
import { SFX_FOR, SFX_FOR_DEMO } from "../shared/sfx.ts";
import { PART_FRAMES, REEL_FRAMES } from "../shared/theme.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SET = [
  { key: "reel1", portrait: true, target: REEL_FRAMES },
  { key: "reel2", portrait: true, target: REEL_FRAMES },
  { key: "reel3", portrait: true, target: REEL_FRAMES },
  { key: "part1", portrait: false, target: PART_FRAMES },
  { key: "part2", portrait: false, target: PART_FRAMES },
  { key: "part3", portrait: false, target: PART_FRAMES },
];

const out: Record<string, unknown> = {};

for (const d of SET) {
  const mod = await import(`../${d.key}/beats.ts`);
  const beats = withGeometry(mod.BEATS, d.portrait);
  const s = starts(beats);
  const cues: { file: string; frame: number; gain: number; beat: string }[] = [];

  beats.forEach((b, i) => {
    const fx = b.kind === "demo" && b.demo ? SFX_FOR_DEMO[b.demo] : SFX_FOR[b.kind];
    if (!fx) return;
    cues.push({
      file: fx.file,
      frame: s[i] + Math.min(fx.at, frames(b.sec) - 20),
      gain: fx.gain,
      beat: b.id,
    });
  });

  out[d.key] = { frames: d.target, bed: `bed-${d.key}`, sfx: cues };
  console.log(`  ${d.key}  ${d.target} frames · ${cues.length} sfx cues`);
}

writeFileSync(join(ROOT, "cues.json"), JSON.stringify(out, null, 1));
console.log("\ncues.json written");
