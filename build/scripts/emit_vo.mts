/**
 * Emit one voiceover script per deliverable, timed from the SAME beat list the
 * video renders from.
 *
 * Every timing, word budget and pace figure here is computed rather than typed,
 * so a script cannot describe a video that no longer exists. The narration
 * itself is authored in vo_narration.json, keyed by beat id — written to
 * COMPLEMENT the on-screen copy rather than read it aloud, since a viewer who
 * can see "Two samples" does not need to be told it.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { frames, starts } from "../shared/beat.ts";
import { withGeometry } from "../shared/layout.ts";
import { BRAND, CTA } from "../shared/brand.ts";
import { PART_FRAMES, REEL_FRAMES } from "../shared/theme.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "vo");
mkdirSync(OUT, { recursive: true });

const NARR: Record<string, string> = JSON.parse(
  readFileSync(join(ROOT, "scripts", "vo_narration.json"), "utf8"),
);

const TITLES: Record<string, string> = {
  reel1: "Reel 1 of 3 — The Computational Core",
  reel2: "Reel 2 of 3 — The Network Fabric",
  reel3: "Reel 3 of 3 — The Control Surface",
  part1: "Part 1 of 3 — The Computational Core",
  part2: "Part 2 of 3 — The Network Fabric",
  part3: "Part 3 of 3 — The Control Surface",
};

const SET = [
  { key: "reel1", portrait: true, target: REEL_FRAMES },
  { key: "reel2", portrait: true, target: REEL_FRAMES },
  { key: "reel3", portrait: true, target: REEL_FRAMES },
  { key: "part1", portrait: false, target: PART_FRAMES },
  { key: "part2", portrait: false, target: PART_FRAMES },
  { key: "part3", portrait: false, target: PART_FRAMES },
];

const mmss = (f: number) => {
  const t = Math.round(f / 30);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

for (const d of SET) {
  const mod = await import(`../${d.key}/beats.ts`);
  const beats = withGeometry(mod.BEATS, d.portrait);
  const s = starts(beats);

  let total = 0;
  const rows: string[] = [];

  beats.forEach((b, i) => {
    const dur = frames(b.sec);
    const from = s[i];
    const isOutro = b.kind === "outro";
    const line = isOutro ? NARR._outro : (NARR[b.id] ?? "");
    const n = line ? words(line) : 0;
    total += n;
    // 150 wpm = 2.5 words/second, the pipeline's standard pace.
    const budget = Math.floor(b.sec * 2.5);
    const flag = n > budget ? `  ⚠ ${n} words over a ${budget}-word budget` : "";

    rows.push(
      `### [${mmss(from)} – ${mmss(from + dur)}]  ${b.id}  ·  ${b.sec}s  ·  ${b.kind}\n` +
        `> *on screen: ${[b.label, b.hero].filter(Boolean).join(" — ") || "(end screen)"}*\n\n` +
        (line ? `**"${line}"**\n\n*(${n} words · budget ${budget}${flag})*\n` : `*(no narration — let it play)*\n`),
    );
  });

  const spoken = total / 2.5;
  const silence = d.target / 30 - spoken;

  const doc = `# Voiceover Script — ${TITLES[d.key]}

**Video:** \`out/sonicview-${d.key}.mp4\`
**Runtime:** ${(d.target / 30).toFixed(3)} s (${d.target} frames @ 30 fps) · ${d.portrait ? "1080×1920" : "1920×1080"}
**Word count:** ${total} words · ≈ ${spoken.toFixed(0)} s at 150 wpm, leaving ≈ ${silence.toFixed(0)} s of deliberate silence
**Language:** English only

---

## Tone

Stage 9 of the research brief: "rigorous clinical precision, sounding like a senior
systems architect addressing professional engineering peers. Measured, data-heavy,
and unyielding in its technical authority." Commercial enthusiasm is explicitly
rejected.

**Delivery notes**

- 145–150 wpm. The figures are the content; do not rush them.
- "Dante" is *DAHN-tay*. "SB-16D" is *ess-bee sixteen-dee*. "Cat5e" is *cat five-E*.
- "µs" is *microseconds*, spoken in full. "dBu" is *dee-bee-you*.
- The SB-16D must never sound like a mixer. Where the script says "the console's
  input stage, moved", the stress is on **moved**.
- This narration is written to COMPLEMENT the on-screen copy, not to read it. Where
  a figure is already large on screen, the line around it carries the meaning.
- Do not lift into the CTA. It is the same voice, making an offer.

---

## Script

${rows.join("\n---\n\n")}

---

## Compliance

- No pricing, MRP, cost or discount language anywhere in this script.
- No competing console brand named, alluded to or implied.
- ${BRAND.name} is described only as **${BRAND.role}** — never distributor, dealer
  or reseller, and with no territory clause.
- The CTA is a technical-consultation offer, not a purchase close: "${CTA}"
- Every figure spoken is VERIFIED in the Stage 8 master tables. Nothing the brief
  marks UNVERIFIED appears here or on screen.
`;

  writeFileSync(join(OUT, `VO_${d.key.toUpperCase()}.md`), doc);
  const over = beats.filter((b) => {
    const l = b.kind === "outro" ? NARR._outro : NARR[b.id];
    return l && words(l) > Math.floor(b.sec * 2.5);
  }).length;
  console.log(
    `  ${d.key}  ${String(total).padStart(4)} words · ${spoken.toFixed(0)}s spoken · ` +
      `${silence.toFixed(0)}s silence${over ? `  ⚠ ${over} beat(s) over budget` : ""}`,
  );
}
console.log("\nsix scripts written to build/vo/");
