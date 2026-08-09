// Audits the compulsory asset-coverage requirement.
//
// Statically scans src/scenes/part*.tsx for every asset id referenced through
// id={n} / ids={[...]} and cross-checks it against src/lib/ledger.json. Reports
// per-part coverage, flags any asset that belongs to a built part but never
// appears, and refuses to pass if a scene uses an id allocated to a different
// part or one of the three excluded logo files.
//
//   node scripts/coverage.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/ledger.json'), 'utf8'));
const byId = new Map(ledger.map((e) => [e.id, e]));

const scenesDir = path.join(root, 'src/scenes');
const files = fs.existsSync(scenesDir)
  ? fs.readdirSync(scenesDir).filter((f) => /^part[123]\.tsx$/.test(f)).sort()
  : [];

const used = new Map(); // id -> [{part, file, tier}]
const partOfFile = (f) => Number(f.match(/part(\d)/)[1]);

for (const f of files) {
  const src = fs.readFileSync(path.join(scenesDir, f), 'utf8');
  const part = partOfFile(f);

  // hero / featured: a single asset id on Shot, Clip, CrossShot, AmbientPhoto —
  // or handed to a shared scene component as frontId / cardId
  for (const m of src.matchAll(/\b(?:id|frontId|cardId)=\{(\d+)\}/g)) {
    const id = Number(m[1]);
    const ctx = src.slice(Math.max(0, m.index - 220), m.index);
    const tag = ctx.match(/<(\w+)[^<>]*$/)?.[1] ?? '?';
    const tier = tag === 'AmbientPhoto' ? 'ambient' : 'primary';
    if (!used.has(id)) used.set(id, []);
    used.get(id).push({part, file: f, tier, tag});
  }
  // montage / grid / strip: ids={[a, b, c]}
  for (const m of src.matchAll(/\bids=\{\[([\d,\s]+)\]\}/g)) {
    const ctx = src.slice(Math.max(0, m.index - 220), m.index);
    const tag = ctx.match(/<(\w+)[^<>]*$/)?.[1] ?? '?';
    const tier = tag === 'WhipStrip' ? 'ambient' : 'primary';
    for (const nStr of m[1].split(',')) {
      const id = Number(nStr.trim());
      if (!Number.isFinite(id)) continue;
      if (!used.has(id)) used.set(id, []);
      used.get(id).push({part, file: f, tier, tag});
    }
  }
}

const builtParts = [...new Set(files.map(partOfFile))].sort();
let fails = 0;
const warn = [];

console.log('='.repeat(66));
console.log('ASSET COVERAGE AUDIT');
console.log('='.repeat(66));
console.log(`ledger        : ${ledger.length} distinct assets`);
console.log(
  `  images      : ${ledger.filter((e) => e.kind === 'image').length}` +
    `   videos: ${ledger.filter((e) => e.kind === 'video').length}` +
    `   logos (excluded): ${ledger.filter((e) => e.kind === 'logo').length}`,
);
const raw = ledger.reduce((a, e) => a + e.nRaw, 0);
console.log(`raw filenames : ${raw}`);
console.log(`scene files   : ${files.join(', ') || '(none yet)'}`);
console.log('');

for (const part of [1, 2, 3]) {
  const owned = ledger.filter((e) => e.part === part);
  const built = builtParts.includes(part);
  const hit = owned.filter((e) => used.has(e.id));
  const miss = owned.filter((e) => !used.has(e.id));
  const primary = hit.filter((e) => used.get(e.id).some((u) => u.tier === 'primary'));
  const ambientOnly = hit.filter((e) => !used.get(e.id).some((u) => u.tier === 'primary'));

  console.log(
    `PART ${part}  ${built ? 'BUILT' : 'not built yet'}  —  allocated ${owned.length}` +
      `  (covered ${hit.length}, primary ${primary.length}, ambient-only ${ambientOnly.length})`,
  );
  if (built && miss.length) {
    fails++;
    console.log(`   ✗ NOT COVERED (${miss.length}): ${miss.map((e) => e.id).join(', ')}`);
  } else if (built) {
    console.log('   ✓ every allocated asset appears at least once');
  }
  if (ambientOnly.length) {
    console.log(`   · ambient-tier only: ${ambientOnly.map((e) => e.id).join(', ')}`);
  }
}

// cross-part / logo misuse
console.log('');
for (const [id, uses] of [...used.entries()].sort((a, b) => a[0] - b[0])) {
  const e = byId.get(id);
  if (!e) {
    fails++;
    console.log(`✗ asset ${id} referenced but not in the ledger`);
    continue;
  }
  if (e.kind === 'logo') {
    fails++;
    console.log(`✗ asset ${id} is an EXCLUDED LOGO (${e.source}) and must not appear in a reel`);
    continue;
  }
  const wrong = uses.filter((u) => u.part !== e.part);
  if (wrong.length) {
    warn.push(
      `asset ${id} is allocated to part ${e.part} but used in part ${[...new Set(wrong.map((u) => u.part))].join('/')}`,
    );
  }
}
for (const w of warn) console.log(`! ${w}`);

const totalCoverable = ledger.filter((e) => e.part > 0).length;
const totalCovered = ledger.filter((e) => e.part > 0 && used.has(e.id)).length;
console.log('');
console.log('-'.repeat(66));
console.log(
  `SERIES TOTAL: ${totalCovered} / ${totalCoverable} coverage-relevant assets placed` +
    ` (${((totalCovered / totalCoverable) * 100).toFixed(1)}%)`,
);
console.log(`failures: ${fails}   warnings: ${warn.length}`);
process.exit(fails ? 1 : 0);
