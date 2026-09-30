// Coverage + compliance audit. Exits non-zero on any failure.
//
//  1. Every one of the 129 distinct repository images (../src/lib/ledger.json,
//     kind === 'image') is owned by exactly one scene in src/lib/plan.ts.
//  2. Each scene's component source actually references every id it owns.
//  3. All three brand marks are used (TASCAM, Shivansh Electronics, Dante).
//  4. Every referenced image exists in public/ (full + mid, and the cut-out
//     wherever a scene shows the product keyed).
//  5. Viewer-facing copy never uses pricing or the wrong partner role.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const ledger = JSON.parse(fs.readFileSync(path.join(root, '..', 'src/lib/ledger.json'), 'utf8'));
const want = ledger.filter((e) => e.kind === 'image').map((e) => e.id);
const plan = fs.readFileSync('src/lib/plan.ts', 'utf8');
const fail = [];

const scenes = [...plan.matchAll(/\{\s*id: '(\w+)',\s*bars: \{[^}]*\},\s*ids: \[([^\]]*)\](?:,\s*logos: \[([^\]]*)\])?/g)].map((m) => ({
  id: m[1],
  ids: m[2].split(',').map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x) && x > 0),
  logos: (m[3] ?? '').replace(/'/g, '').split(',').map((x) => x.trim()).filter(Boolean),
}));
const owner = new Map();
for (const s of scenes)
  for (const id of s.ids) {
    if (owner.has(id)) fail.push(`#${id} owned by both ${owner.get(id)} and ${s.id}`);
    owner.set(id, s.id);
  }
const missing = want.filter((id) => !owner.has(id));
const extra = [...owner.keys()].filter((id) => !want.includes(id));
if (missing.length) fail.push(`not placed: ${missing.join(', ')}`);
if (extra.length) fail.push(`not in ledger: ${extra.join(', ')}`);

const FILE = {hook: 'A', s16: 'A', s24: 'A', view: 'B', engine: 'B', wall: 'B', dante: 'C', cards: 'C', flow: 'C', field: 'D', finale: 'D', outro: 'D'};
for (const s of scenes) {
  const src = fs.readFileSync(`src/scenes/${FILE[s.id]}.tsx`, 'utf8');
  for (const id of s.ids) if (!new RegExp(`\\b${id}\\b`).test(src)) fail.push(`${s.id}: source never references #${id}`);
}
const logos = new Set(scenes.flatMap((s) => s.logos));
for (const l of ['tascam', 'shivansh', 'dante']) if (!logos.has(l)) fail.push(`logo never used: ${l}`);

const pad = (id) => `a${String(id).padStart(3, '0')}`;
const manifest = JSON.parse(fs.readFileSync('src/assets.json', 'utf8'));
for (const id of want) {
  for (const d of ['img', 'img-m', 'blur']) if (!fs.existsSync(`public/${d}/${pad(id)}.jpg`)) fail.push(`missing public/${d}/${pad(id)}.jpg`);
  if (manifest[id]?.cut && !fs.existsSync(`public/cut/${pad(id)}.webp`)) fail.push(`missing cut ${id}`);
}
for (const f of ['tascam-white', 'shivansh-white', 'dante-white']) if (!fs.existsSync(`public/logo/${f}.png`)) fail.push(`missing logo ${f}`);

const copy = ['A', 'B', 'C', 'D'].map((x) => fs.readFileSync(`src/scenes/${x}.tsx`, 'utf8')).join('\n') + fs.readFileSync('src/lib/theme.ts', 'utf8') + fs.readFileSync('src/Thumbnail.tsx', 'utf8');
const strip = copy.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
for (const bad of [/distributor/i, /dealer/i, /reseller/i, /₹/, /\bMRP\b/, /\bprice\b/i, /\bbuy now\b/i])
  if (bad.test(strip)) fail.push(`copy rule: ${bad}`);
if (!/TASCAM's Authorized Partner/.test(strip)) fail.push('partner role string missing');

const perScene = scenes.map((s) => `${s.id}:${s.ids.length}`).join('  ');
console.log(`scenes  ${perScene}`);
console.log(`placed  ${owner.size} / ${want.length} images · logos ${[...logos].join(', ')}`);
if (fail.length) {
  console.error('\nFAIL\n  ' + fail.join('\n  '));
  process.exit(1);
}
console.log('PASS');
