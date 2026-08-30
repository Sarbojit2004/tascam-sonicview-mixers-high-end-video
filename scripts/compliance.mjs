// Scans every file that can put words in front of a viewer for the editorial
// rules the brief states as absolute.
//
//   node scripts/compliance.mjs
//
// Four rules, all hard failures:
//
//   1. No pricing, MRP or cost framing of any kind — on screen, in a VO script,
//      or on a thumbnail. The brief says "of any kind, anywhere", so this check
//      is deliberately broader than literal figures: cost *comparisons* and
//      budget framing are caught too, because "cheaper than the alternative" is
//      a cost claim even without a number in it.
//   2. No competing console brand, named or alluded to.
//   3. Shivansh Electronics is TASCAM's Authorized Partner — never distributor,
//      dealer or reseller.
//   4. The CTA is a technical consultation, never a purchase close.
//
// Prose ABOUT a rule is not a breach of it, so a small allow-list covers the
// compliance sections of the VO scripts and the comments in this repo that
// explain why a phrase was removed. Every entry has to name the file, so the
// list cannot quietly grow into a way of muting real findings.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/** Files whose text reaches a viewer, plus the copy the videos render from. */
const TARGETS = [
  'src/lib/copy.ts',
  'src/scenes/part1.tsx',
  'src/scenes/part2.tsx',
  'src/scenes/part3.tsx',
  'src/scenes/lf/part1.tsx',
  'src/scenes/lf/part2.tsx',
  'src/scenes/lf/part3.tsx',
  'src/Thumbnails.tsx',
  'src/LFThumbnails.tsx',
  'src/components/Brand.tsx',
  'src/components/lf/LFBrand.tsx',
  ...fs.readdirSync(ROOT).filter((f) => f.startsWith('VO_SCRIPT_') && f.endsWith('.md')),
];

const RULES = [
  {
    id: 'pricing',
    label: 'No pricing, MRP or cost framing',
    // Figures and currency, then the softer cost framing the brief also rules out.
    patterns: [
      /\bMRP\b/i,
      /\bINR\b/i,
      /₹/,
      /\bRs\.?\s*\d/i,
      /\brupees?\b/i,
      /\bprice[sd]?\b/i,
      /\bpricing\b/i,
      /\bdiscount(s|ed|ing)?\b/i,
      /\bEMI\b/,
      /\bcheap(er|est)?\b/i,
      /\baffordab\w*/i,
      /\bbudget\b/i,
      /\bcosts?\b/i,
      /\bcosting\b/i,
      /\bexpensive\b/i,
      /\bvalue for money\b/i,
      /\bline item\b/i,
      /\bbest deal\b/i,
      /\bquote\b/i,
    ],
  },
  {
    id: 'competitor',
    label: 'No competing console brand',
    patterns: [
      /\byamaha\b/i,
      /\bdigico\b/i,
      /\ballen\s*&\s*heath\b/i,
      /\ballen and heath\b/i,
      /\bmidas\b/i,
      /\bbehringer\b/i,
      /\bsoundcraft\b/i,
      /\bpresonus\b/i,
      /\bmackie\b/i,
      /\bavid\b/i,
      /\bsolid state logic\b/i,
      /\bSSL\b/,
      /\bQSC\b/,
      /\bwing\b/i,
      /\bX32\b/,
      /\bM32\b/,
      /\bCL5\b/i,
      /\bQL5\b/i,
      /\bDLive\b/i,
      /\bSQ-?[567]\b/i,
    ],
  },
  {
    id: 'partner-role',
    label: 'Partner described only as TASCAM’s Authorized Partner',
    patterns: [/\bdistributor\b/i, /\bdealer\b/i, /\breseller\b/i, /\bstockist\b/i],
  },
  {
    id: 'cta',
    label: 'CTA is a technical consultation, not a purchase close',
    patterns: [
      /\bbuy now\b/i,
      /\border now\b/i,
      /\bshop\b/i,
      /\bin stock\b/i,
      /\bDM (?:or|and) call\b/i,
      /\bbest price\b/i,
      /\benquire for price\b/i,
    ],
  },
];

/**
 * Lines that discuss a rule rather than breach it. Each entry must name the
 * file AND the exact phrase, so nothing is silenced by accident.
 */
const ALLOW = [
  // The VO scripts each close with a "Compliance notes" section that states the
  // rules in order to record that they were followed.
  {file: /^VO_SCRIPT_/, match: /No pricing, MRP, cost or discount language/i},
  {file: /^VO_SCRIPT_/, match: /not a purchase close/i},
  {file: /^VO_SCRIPT_/, match: /never distributor,?$/i},
  {file: /^VO_SCRIPT_/, match: /dealer or reseller/i},
  {file: /^VO_SCRIPT_LONGFORM_PART3/, match: /was written as "the choice is the building, not the budget"/i},
  {file: /^VO_SCRIPT_LONGFORM_PART3/, match: /the choice is the building" specifically to keep cost framing out/i},
  {file: /^VO_SCRIPT_/, match: /keep cost framing out of the picture entirely/i},
  // "costs" used non-monetarily — what a fault costs you is redundancy, or a
  // path, never money. Both are narrated lines, quoted here exactly.
  {file: /^VO_SCRIPT_LONGFORM_PART2/, match: /costs redundancy, not airtime/i},
  {file: /^VO_SCRIPT_LONGFORM_PART2/, match: /Failure that costs a path and not a show/i},
  {file: /^src\/scenes\/lf\/part2\.tsx$/, match: /costs redundancy rather than airtime/i},
];

const allowed = (file, line) =>
  ALLOW.some((a) => a.file.test(path.basename(file)) && a.match.test(line));

/**
 * Only text that can reach a viewer is scanned.
 *
 * For TypeScript that means string literals and JSX text children — a source
 * comment explaining a rule is not a breach of it, and scanning comments buries
 * real findings under commentary. Comments are stripped before extraction so a
 * banned word inside one cannot masquerade as a string.
 */
const viewerTextTS = (src) => {
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length));
  const out = [];
  const lineOf = (idx) => stripped.slice(0, idx).split('\n').length;
  // string literals
  for (const m of stripped.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    const text = m[1] ?? m[2] ?? m[3] ?? '';
    if (text.trim()) out.push({line: lineOf(m.index), text});
  }
  // JSX text children, e.g. <Chip>16 IN / 16 OUT</Chip>
  for (const m of stripped.matchAll(/>([^<>{}]{2,})</g)) {
    const text = m[1].trim();
    if (text && /[A-Za-z]/.test(text)) out.push({line: lineOf(m.index), text});
  }
  return out;
};

/**
 * For a VO script, the "## Compliance notes" section exists to restate the
 * rules and is skipped wholesale; everything above it is the read itself.
 */
const viewerTextMD = (src) => {
  const lines = src.split('\n');
  const stop = lines.findIndex((l) => /^##\s+Compliance/i.test(l));
  const end = stop === -1 ? lines.length : stop;
  return lines.slice(0, end).map((text, i) => ({line: i + 1, text})).filter((r) => r.text.trim());
};

const findings = [];

for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const src = fs.readFileSync(abs, 'utf8');
  const rows = rel.endsWith('.md') ? viewerTextMD(src) : viewerTextTS(src);
  for (const row of rows) {
    if (allowed(rel, row.text)) continue;
    for (const rule of RULES) {
      for (const p of rule.patterns) {
        const m = row.text.match(p);
        if (m) {
          findings.push({rule: rule.id, label: rule.label, file: rel, line: row.line, text: row.text.trim(), hit: m[0]});
        }
      }
    }
  }
}

// The partner role must also be positively present, not merely un-contradicted.
const copy = fs.readFileSync(path.join(ROOT, 'src/lib/copy.ts'), 'utf8');
const roleOk = /PARTNER_ROLE\s*=\s*['"]TASCAM['’]s Authorized Partner['"]/.test(copy);

console.log('\nEDITORIAL COMPLIANCE');
console.log('='.repeat(74));
console.log(`  scanned ${TARGETS.filter((t) => fs.existsSync(path.join(ROOT, t))).length} files\n`);

for (const rule of RULES) {
  const hits = findings.filter((f) => f.rule === rule.id);
  console.log(`  ${hits.length === 0 ? '✓' : '✗'} ${rule.label}${hits.length ? `  — ${hits.length} hit(s)` : ''}`);
  for (const h of hits) {
    console.log(`      ${h.file}:${h.line}  [${h.hit}]`);
    console.log(`        ${h.text.slice(0, 130)}`);
  }
}
console.log(
  `  ${roleOk ? '✓' : '✗'} PARTNER_ROLE is exactly "TASCAM’s Authorized Partner"`,
);

const failed = findings.length > 0 || !roleOk;
console.log('='.repeat(74));
console.log(failed ? `FAILED: ${findings.length} finding(s)` : 'ALL RULES PASS');
process.exit(failed ? 1 : 0);
