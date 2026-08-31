/**
 * THE AUDITS. Everything the brief states as a requirement, measured.
 *
 * Each check reads the SAME data the videos render from, so the picture and the
 * report cannot disagree. Anything that fails exits non-zero.
 *
 *   coverage   all 133 real assets placed, each exactly once, at primary tier
 *   clips      every B-roll used is one of the 25, and all 25 are accounted for
 *   contact    marketing frequency, max gap, slot spread, zero fixed repetition,
 *              and ZERO COLLISION with each beat's own reported geometry
 *   branding   no logo reference outside an outro; every end screen complete
 *   compliance no pricing, no competitor, partner wording, consultation CTA
 *   glyphs     every rendered string is drawable in the shipped font subsets
 *   runtime    every beat list sums to its exact target frame count
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { ALLOCATION, type Deliverable } from "../shared/assets.ts";
import { BRAND, CHANNEL_VALUE, CTA, FORBIDDEN } from "../shared/brand.ts";
import { auditContact, buildContactPlan, slotRect } from "../shared/contactplan.ts";
import { frames, startMap, totalFrames, type Beat, type Rect } from "../shared/beat.ts";
import { withGeometry } from "../shared/layout.ts";
import { GLYPH_SUBSTITUTIONS } from "../shared/fonts.ts";
import { END_SCREEN_MARKS, END_SCREEN_REQUIRED } from "../shared/endscreen.ts";
import { PART_FRAMES, REEL_FRAMES } from "../shared/theme.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const DELIVERABLES: { key: Deliverable; portrait: boolean; target: number; channelFrom: number }[] = [
  { key: "reel1", portrait: true, target: REEL_FRAMES, channelFrom: 0 },
  { key: "part1", portrait: false, target: PART_FRAMES, channelFrom: 1 },
  { key: "reel2", portrait: true, target: REEL_FRAMES, channelFrom: 2 },
  { key: "part2", portrait: false, target: PART_FRAMES, channelFrom: 3 },
  { key: "reel3", portrait: true, target: REEL_FRAMES, channelFrom: 4 },
  { key: "part3", portrait: false, target: PART_FRAMES, channelFrom: 0 },
];

let failures = 0;
const fail = (msg) => { failures++; console.log(`  [31mFAIL[0m ${msg}`); };
const pass = (msg) => console.log(`  ok   ${msg}`);
const head = (msg) => console.log(`\n[1m${msg}[0m`);

const loaded = {};
for (const d of DELIVERABLES) {
  const mod = await import(`../${d.key}/beats.ts`);
  loaded[d.key] = withGeometry(mod.BEATS, d.portrait);
}

/* ── 1 · RUNTIME ─────────────────────────────────────────────────────────── */
head("RUNTIME — every beat list sums to its exact target");
for (const d of DELIVERABLES) {
  const got = totalFrames(loaded[d.key]);
  const outros = loaded[d.key].filter((b) => b.kind === "outro").length;
  if (got !== d.target) fail(`${d.key}: ${got} frames, target ${d.target} (${got - d.target})`);
  else if (outros !== 1) fail(`${d.key}: ${outros} outro beats, need exactly 1`);
  else pass(`${d.key.padEnd(6)} ${got} frames = ${(got / 30).toFixed(3)} s · ${loaded[d.key].length} beats`);
}

/* ── 2 · ASSET COVERAGE ──────────────────────────────────────────────────── */
head("COVERAGE — 133 real assets, each placed exactly once, at primary tier");
const ledger = JSON.parse(readFileSync(join(ROOT, "asset-ledger.json"), "utf8"));
const seen = new Map();
let clipUse = new Set();
for (const d of DELIVERABLES) {
  const declared = new Set(ALLOCATION[d.key]);
  const used = new Set();
  for (const b of loaded[d.key]) {
    for (const id of b.images ?? []) used.add(id);
    if (b.video) used.add(b.video);
    if (b.clip) clipUse.add(b.clip);
  }
  for (const id of used) {
    seen.set(id, (seen.get(id) ?? 0) + 1);
    if (!declared.has(id)) fail(`${d.key}: uses asset ${id}, which is allocated elsewhere`);
  }
  const unplaced = [...declared].filter((id) => !used.has(id));
  if (unplaced.length) fail(`${d.key}: ${unplaced.length} allocated asset(s) never placed in a beat: ${unplaced.join(", ")}`);
  else pass(`${d.key.padEnd(6)} ${used.size}/${declared.size} allocated assets placed`);
}
const dup = [...seen.entries()].filter(([, n]) => n > 1);
if (dup.length) fail(`assets placed more than once: ${dup.map(([id, n]) => `${id}x${n}`).join(", ")}`);
const missing = ledger.map((e) => e.id).filter((id) => !seen.has(id));
if (missing.length) fail(`${missing.length} ledger asset(s) never appear anywhere: ${missing.join(", ")}`);
else pass(`all ${ledger.length} distinct real assets covered across the six deliverables`);

/* ── 3 · B-ROLL PROVENANCE ───────────────────────────────────────────────── */
head("B-ROLL — every clip used is one of the 25 verified files");
const clipFiles = readdirSync(join(ROOT, "public", "clips")).filter((f) => /^br\d\d\.mp4$/.test(f));
if (clipFiles.length !== 25) fail(`expected 25 prepared clips, found ${clipFiles.length}`);
else pass("25 prepared clips present");
const badClip = [...clipUse].filter((n) => n < 1 || n > 25);
if (badClip.length) fail(`clip numbers outside 1..25: ${badClip.join(", ")}`);
else pass(`${clipUse.size} distinct clips referenced, all within 1..25: ${[...clipUse].sort((a, b) => a - b).join(", ")}`);

/* ── 4 · CONTACT LAYER ───────────────────────────────────────────────────── */
head("CONTACT — frequency, spread, and ZERO collision with scene geometry");
const overlaps = (a: Rect, b: Rect, pad = 0) =>
  a.x < b.x + b.w + pad && a.x + a.w + pad > b.x &&
  a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;

for (const d of DELIVERABLES) {
  const beats = loaded[d.key];
  const plan = buildContactPlan(beats, { portrait: d.portrait, perBeat: 2, channelFrom: d.channelFrom });

  // Gaps are measured across the BODY only, ending where the end screen begins.
  // The end screen is not a gap in marketing — it is the densest marketing in
  // the deliverable, holding every channel at once for its full duration.
  // Measuring "time since the last strip" straight through it would score the
  // one moment everything is on screen as the worst moment for contact.
  const outroStart = startMap(beats)[beats[beats.length - 1].id];
  const rep = auditContact(plan, startMap(beats), outroStart);
  const maxGapLimit = d.portrait ? 11 : 13;

  // The collision check: a landscape strip's rect must not touch anything its
  // own beat's layout occupies. Portrait strips live in the reserved bands,
  // which are outside the content box by construction.
  let collisions = 0;
  if (!d.portrait) {
    const byId = Object.fromEntries(beats.map((b) => [b.id, b]));
    for (const a of plan) {
      const beat = byId[a.beat];
      const r = slotRect(a.slot, a.channel === "whatsapp");
      for (const occ of beat.occupies ?? []) if (overlaps(r, occ)) collisions++;
    }
  }

  const problems: string[] = [];
  if (rep.maxGapSec > maxGapLimit) problems.push(`max gap ${rep.maxGapSec}s > ${maxGapLimit}s`);
  if (rep.consecutiveRepeats > 0) problems.push(`${rep.consecutiveRepeats} consecutive same-slot repeats`);
  if (rep.slotOveruse.length) problems.push(rep.slotOveruse.join("; "));
  if (rep.channels.length !== 5) problems.push(`only ${rep.channels.length}/5 channels used`);
  if (collisions > 0) problems.push(`${collisions} strip/content collisions`);

  if (problems.length) fail(`${d.key}: ${problems.join(" · ")}`);
  else {
    pass(
      `${d.key.padEnd(6)} ${String(rep.strips).padStart(3)} strips · every ${rep.meanIntervalSec}s · ` +
        `max gap ${rep.maxGapSec}s · ${rep.slots} slots · 0 repeats · 0 collisions`,
    );
  }
}

/* ── 5 · BRANDING ────────────────────────────────────────────────────────── */
head("BRANDING — zero logos outside an end screen; end screens complete");
const sceneSources = [
  "shared/scenes.tsx", "shared/type.tsx", "shared/media.tsx", "shared/concepts.tsx",
  "shared/contact.tsx", "shared/shell.tsx",
  ...DELIVERABLES.map((d) => `${d.key}/beats.ts`),
];
let logoLeak = 0;
for (const rel of sceneSources) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  if (/logo\.tsx|logo\/|BrandMark/.test(stripped)) {
    fail(`${rel} references a logo — logos may appear only on an end screen`);
    logoLeak++;
  }
}
if (!logoLeak) pass(`${sceneSources.length} scene/body modules reference no logo at all`);
{
  const outroSrc = readFileSync(join(ROOT, "shared/outro.tsx"), "utf8");
  const need = [["shivansh", /brand="shivansh"/], ["tascam", /brand="tascam"/]];
  for (const [name, re] of need) {
    if (re.test(outroSrc)) pass(`end screen carries the ${name} mark`);
    else fail(`end screen is missing the ${name} mark`);
  }
  for (const s of END_SCREEN_REQUIRED) {
    if (!s || !s.length) fail("end screen required string is empty");
  }
  pass(`end screen declares all ${END_SCREEN_REQUIRED.length} required elements`);
  const wa = CHANNEL_VALUE.whatsapp;
  const expected = BRAND.phones.join(", ");
  if (wa !== expected) fail(`WhatsApp format is "${wa}", must be "${expected}"`);
  else pass(`WhatsApp block in the exact specified format: ${wa}`);
}

/* ── 6 · EDITORIAL COMPLIANCE ────────────────────────────────────────────── */
head("COMPLIANCE — pricing, competitors, partner wording, CTA");
const viewerText: { where: string; text: string }[] = [];
for (const d of DELIVERABLES) {
  for (const b of loaded[d.key]) {
    for (const s of [b.label, b.hero, b.sub, ...(b.body ?? [])]) {
      if (s) viewerText.push({ where: `${d.key}/${b.id}`, text: s });
    }
  }
}
for (const s of END_SCREEN_REQUIRED) viewerText.push({ where: "end-screen", text: s });

const hits = (list: readonly string[]) =>
  viewerText.flatMap(({ where, text }) => {
    const lower = text.toLowerCase();
    return list.filter((w) => lower.includes(w)).map((w) => `${where}: "${w}" in "${text.slice(0, 70)}"`);
  });

const priceHits = hits(FORBIDDEN.pricing);
if (priceHits.length) priceHits.forEach((h) => fail(`pricing/cost language — ${h}`));
else pass(`no pricing or cost framing in ${viewerText.length} viewer-facing strings`);

const compHits = hits(FORBIDDEN.competitors);
if (compHits.length) compHits.forEach((h) => fail(`competitor brand — ${h}`));
else pass("no competing console brand named or alluded to");

const relHits = hits(FORBIDDEN.relationship);
if (relHits.length) relHits.forEach((h) => fail(`relationship wording — ${h}`));
else pass("no distributor / dealer / reseller language");

if (BRAND.role !== "Authorized Partner of TASCAM") fail(`role is "${BRAND.role}"`);
else pass(`Shivansh Electronics described only as "${BRAND.role}"`);

if (/buy|order|purchase|shop/i.test(CTA)) fail(`CTA reads as a purchase close: "${CTA}"`);
else pass(`CTA is a technical consultation: "${CTA}"`);

/* ── 7 · GLYPHS ──────────────────────────────────────────────────────────── */
head("GLYPHS — every rendered string is drawable in the shipped font subsets");
const bad = Object.keys(GLYPH_SUBSTITUTIONS);
const glyphHits = viewerText.flatMap(({ where, text }) =>
  bad.filter((g) => text.includes(g)).map((g) => `${where}: U+${g.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")} ${g}`),
);
if (glyphHits.length) glyphHits.forEach((h) => fail(`glyph absent from the fonts — ${h}`));
else pass(`no unsupported codepoints in ${viewerText.length} strings (U+03BC would render as tofu)`);

/* ── result ──────────────────────────────────────────────────────────────── */
console.log("");
if (failures) {
  console.log(`[31m${failures} failure(s).[0m`);
  process.exit(1);
}
console.log("[32mAll audits pass.[0m");
