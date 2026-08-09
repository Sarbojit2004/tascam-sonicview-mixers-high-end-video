// Audits the long-form branding cadence against its own plan table.
//
//   node scripts/branding_audit.mjs [1|2|3]
//
// Reads src/lib/lf-brand-plan.ts — the same table BrandingLayer renders from —
// and checks the rules the format sets:
//
//   · Shivansh Electronics recurring, with no gap longer than the 25-30 s
//     guideline (750-900 frames) between the end of one appearance and the
//     start of the next, counting the outro as the final appearance.
//   · At least one Shivansh appearance inside every major topic segment.
//   · TASCAM present a handful of times, including mid-part.
//   · Dante ONLY on Dante-technology moments — never in a generic branding
//     beat alongside the other two.
//
// Prints the timestamped appearance list the delivery summary needs.
import fs from 'node:fs';
import path from 'node:path';

const FPS = 30;
const TOTAL = 8940;
const GAP_WARN = 750; // 25 s
const GAP_FAIL = 900; // 30 s

const root = process.cwd();
const src = fs.readFileSync(path.join(root, 'src/lib/lf-brand-plan.ts'), 'utf8');
const themeSrc = fs.readFileSync(path.join(root, 'src/lib/lf-theme.ts'), 'utf8');

const parsePlan = (label) => {
  const body = src.split(`const ${label}: BrandAppearance[] = [`)[1]?.split('\n];')[0];
  if (!body) return [];
  return [...body.matchAll(
    /\{at:\s*(\d+),\s*dur:\s*(\d+),\s*brand:\s*'(\w+)',\s*form:\s*'([\w-]+)'(?:,\s*contact:\s*(\d+))?,\s*note:\s*'([^']*)'\}/g,
  )].map((m) => ({
    at: +m[1], dur: +m[2], brand: m[3], form: m[4],
    contact: m[5] === undefined ? null : +m[5], note: m[6],
  }));
};

const parseChapters = (label) => {
  const body = themeSrc.split(`export const ${label}: Chapter[] = [`)[1]?.split('\n];')[0];
  if (!body) return [];
  const rows = [...body.matchAll(/\{id: '(\w+)', dur: (\d+), label: '([^']*)'\}/g)];
  let f = 0;
  return rows.map((m) => {
    const c = {id: m[1], dur: +m[2], label: m[3], from: f, to: f + +m[2]};
    f += +m[2];
    return c;
  });
};

const ts = (f) => {
  const s = f / FPS;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;
};

const wanted = process.argv[2] ? [Number(process.argv[2])] : [1, 2, 3];
let fails = 0;
let warns = 0;

for (const part of wanted) {
  const plan = parsePlan(`P${part}`);
  const chapters = parseChapters(`LF_PART${part}`);
  if (!plan.length) {
    console.log(`\nPART ${part}: no plan rows parsed — check lf-brand-plan.ts formatting`);
    fails++;
    continue;
  }
  const outroStart = chapters.length ? chapters[chapters.length - 1].from : TOTAL - 510;

  console.log(`\n${'='.repeat(78)}`);
  console.log(`LONG-FORM PART ${part} — BRANDING CADENCE`);
  console.log('='.repeat(78));

  const sorted = [...plan].sort((a, b) => a.at - b.at);
  for (const b of sorted) {
    console.log(
      `  ${ts(b.at)} – ${ts(b.at + b.dur)}  ${b.brand.toUpperCase().padEnd(9)} ` +
        `${b.form.padEnd(12)} ${b.note}`,
    );
  }
  console.log(
    `  ${ts(outroStart)} – ${ts(TOTAL)}  OUTRO      full        TASCAM + Shivansh marks + full contact block`,
  );

  // --- Shivansh gap analysis (the outro counts as the closing appearance) ---
  const shiv = sorted.filter((b) => b.brand === 'shivansh').map((b) => ({...b}));
  shiv.push({at: outroStart, dur: TOTAL - outroStart, brand: 'shivansh', form: 'outro', note: 'outro'});
  shiv.sort((a, b) => a.at - b.at);

  let worst = {gap: shiv[0].at, at: 0};
  if (shiv[0].at > worst.gap) worst = {gap: shiv[0].at, at: 0};
  for (let i = 1; i < shiv.length; i++) {
    const gap = shiv[i].at - (shiv[i - 1].at + shiv[i - 1].dur);
    if (gap > worst.gap) worst = {gap, at: shiv[i - 1].at + shiv[i - 1].dur};
  }
  const okGap = worst.gap <= GAP_WARN;
  if (worst.gap > GAP_FAIL) fails++;
  else if (!okGap) warns++;
  console.log('');
  console.log(
    `  Shivansh appearances : ${shiv.length}  (incl. outro)`,
  );
  console.log(
    `  ${worst.gap > GAP_FAIL ? '✗' : okGap ? '✓' : '!'} longest gap without Shivansh: ` +
      `${worst.gap} frames = ${(worst.gap / FPS).toFixed(1)} s  (starts ${ts(worst.at)})` +
      `   [guideline ≤ ${GAP_WARN}f / 25 s, hard ≤ ${GAP_FAIL}f / 30 s]`,
  );

  // --- every chapter that is a real topic segment carries a Shivansh beat ---
  const covered = chapters.map((c) => ({
    ...c,
    hit: shiv.some((b) => b.at < c.to && b.at + b.dur > c.from),
  }));
  const missing = covered.filter((c) => !c.hit);
  if (missing.length) {
    warns++;
    console.log(
      `  ! chapters with no Shivansh appearance inside them: ${missing.map((c) => c.id).join(', ')}`,
    );
    console.log('    (acceptable only where an adjacent appearance overlaps the boundary)');
  } else {
    console.log('  ✓ every chapter contains a Shivansh appearance');
  }

  // --- TASCAM ---
  const tas = sorted.filter((b) => b.brand === 'tascam');
  const midTas = tas.filter((b) => b.at > TOTAL * 0.2 && b.at < TOTAL * 0.8);
  const tasOk = tas.length >= 3 && tas.length <= 10 && midTas.length >= 1;
  if (!tasOk) fails++;
  console.log(
    `  ${tasOk ? '✓' : '✗'} TASCAM appearances: ${tas.length} in body + outro, ` +
      `${midTas.length} mid-part  [want a handful, incl. mid-part]`,
  );

  // --- Dante: only where Dante is the subject ---
  const dante = sorted.filter((b) => b.brand === 'dante');
  const danteBad = dante.filter((b) => !/dante|64x64|128x128|network|primary\/secondary/i.test(b.note));
  if (danteBad.length) {
    fails++;
    console.log(`  ✗ Dante appearances not tied to a Dante-technology moment: ${danteBad.map((b) => ts(b.at)).join(', ')}`);
  } else {
    console.log(
      `  ✓ Dante appearances: ${dante.length}, all tied to Dante-technology moments`,
    );
  }
  const danteInGeneric = dante.filter((b) => b.form === 'beat' && !/dante/i.test(b.note));
  if (danteInGeneric.length) {
    fails++;
    console.log('  ✗ Dante placed in a generic branding beat');
  }

  // --- forms are varied, not one repeated device ---
  const forms = new Set(shiv.map((b) => b.form));
  const variedOk = forms.size >= 3;
  if (!variedOk) warns++;
  console.log(
    `  ${variedOk ? '✓' : '!'} Shivansh appearance forms used: ${[...forms].join(', ')}`,
  );
}

console.log(`\n${'='.repeat(78)}`);
console.log(`${fails} failures | ${warns} warnings`);
process.exit(fails ? 1 : 0);
