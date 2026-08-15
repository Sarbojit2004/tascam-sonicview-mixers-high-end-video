// Mechanically verifies the two hard content rules for this reel.
//
//   node scripts/copy_audit.mjs
//
// 1. "Shivansh Electronics" appears EXACTLY ONCE across all on-screen copy,
//    only in the closing beat, with no designation and no promotional or
//    sales language anywhere near it.
// 2. No political party and no contemporary political figure appears anywhere.
//
// The check runs over src/lib/copy.ts (every word that reaches the screen)
// and, for the mention count, over the whole of src/ so a stray hard-coded
// string in a scene cannot slip past.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const copyFile = path.join(root, 'src', 'lib', 'copy.ts');
const copyRaw = fs.readFileSync(copyFile, 'utf8');

// Comments must be stripped before any string extraction: an apostrophe in
// explanatory prose ("the Constitution's Eighth Schedule") otherwise opens a
// quote span that swallows the surrounding commentary and reports it as
// on-screen copy.
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const copy = stripComments(copyRaw);

const walk = (dir) =>
  fs.readdirSync(dir, {withFileTypes: true}).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(p) ? [p] : [];
  });

const fails = [];
const warns = [];
const ok = (cond, msg, detail = '') => {
  console.log(`  ${cond ? 'OK  ' : 'FAIL'}  ${msg}${detail ? `  ${detail}` : ''}`);
  if (!cond) fails.push(msg);
};

console.log('COPY AUDIT');
console.log('='.repeat(72));

// -- 1. the Shivansh Electronics mention ------------------------------------
console.log('\n  the single mention');
const NAME = /Shivansh\s+Electronics/gi;

let srcHits = 0;
for (const f of walk(path.join(root, 'src'))) {
  const body = fs.readFileSync(f, 'utf8');
  // strip block and line comments so prose about the rule is not counted
  const n = (stripComments(body).match(NAME) || []).length;
  if (n) {
    srcHits += n;
    console.log(`         ${path.relative(root, f)}: ${n}`);
  }
}
ok(srcHits === 1, 'appears exactly once in src/ (excluding comments)', `found ${srcHits}`);

const inClosing = /b14:[\s\S]*?signature:\s*'Shivansh Electronics'/.test(copy);
ok(inClosing, 'the mention is the closing beat signature');

// no designation attached to the name
const DESIGNATIONS = [
  'authorized', 'authorised', 'distributor', 'dealer', 'reseller', 'partner',
  'founder', 'proprietor', 'director', 'ceo', 'pvt', 'ltd', 'llp',
];
const near = copy.match(/.{160}Shivansh Electronics.{160}/is)?.[0] ?? '';
const foundDesig = DESIGNATIONS.filter((d) => new RegExp(`\\b${d}\\b`, 'i').test(near));
ok(foundDesig.length === 0, 'no designation attached to the name', foundDesig.join(', ') || '-');

// no promotional / sales language anywhere in the copy
const PROMO = [
  'best price', 'offer', 'discount', 'sale', 'buy', 'shop', 'order now', 'call',
  'whatsapp', 'dm ', 'contact', 'visit us', 'trusted', 'leading', 'premier',
  'gateway', 'your partner', 'we ', 'our ', 'follow us', 'subscribe',
  'available at', 'in stock', 'enquire', 'consultation', 'www.', 'http', '.in/', '@',
];
const copyText = [...copy.matchAll(/'([^'\\]{2,})'/g)].map((m) => m[1]).join(' \n ');
const foundPromo = PROMO.filter((w) => copyText.toLowerCase().includes(w));
ok(foundPromo.length === 0, 'no promotional or contact language in on-screen copy', foundPromo.join(', ') || '-');

// -- 2. no political content -------------------------------------------------
console.log('\n  political content');
const PARTIES = [
  'bjp', 'congress', 'inc', 'aap', 'cpi', 'cpm', 'trinamool', 'tmc', 'dmk',
  'aiadmk', 'shiv sena', 'ncp', 'rjd', 'jdu', 'bsp', 'sp ', 'ysrcp', 'trs', 'brs',
  'bharatiya janata', 'aam aadmi', 'lok sabha', 'rajya sabha', 'election',
  'prime minister', 'chief minister', 'president of india', 'governor', 'minister',
  'party', 'vote', 'govt', 'government',
];
const foundParty = PARTIES.filter((w) => new RegExp(`\\b${w.trim()}\\b`, 'i').test(copyText));
ok(foundParty.length === 0, 'no political party or office named', foundParty.join(', ') || '-');

// A named-person check: any capitalised two-word proper noun in the copy that
// is not on the allowlist of places, rivers, art forms and festivals gets
// flagged for a human to look at rather than failing outright.
const ALLOW = new Set([
  'Eighth Schedule', 'Union Territories', 'Independence Day', 'Ashoka Chakra',
  'Shivansh Electronics', 'Jai Hind', 'Madhya Pradesh', 'Tamil Nadu',
  'Uttar Pradesh', 'Free India', 'Long Road', 'Many Voices', 'Many Tongues',
  'The Land', 'One Country', 'Nation Awoke', 'Twenty Four', 'Made By',
  'Durga Puja', 'Makar Sankranti',
]);
const proper = [...copyText.matchAll(/\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,})\b/g)]
  .map((m) => m[1])
  .filter((s) => !ALLOW.has(s));
if (proper.length) {
  warns.push(`unrecognised proper nouns (review): ${[...new Set(proper)].join(', ')}`);
}
ok(true, 'proper-noun scan complete', `${new Set(proper).size} to review`);

// -- 3. the map shows India's full territorial extent ------------------------
//
// The outline MUST include the whole of Jammu & Kashmir (Gilgit-Baltistan and
// Pakistan-occupied Kashmir) together with the Shaksgam / Trans-Karakoram
// Tract and Aksai Chin. An outline drawn to the Line of Control or the Line of
// Actual Control is not the map of India. These checks read the projected
// point list straight out of Art.tsx so the boundary cannot silently regress.
//
// viewBox is 400x470 spanning 67..98 E and 37.5..7 N, so:
//   y <=  14  ~ north of 36.6 N   (Gilgit-Baltistan, the northern tip)
//   x >= 160 && y <= 40  ~ east of 79.4 E above 34.9 N   (Aksai Chin)
//   x <=  95 && y <=  80 ~ west of 74.4 E above 32.3 N   (PoK, western J&K)
console.log('\n  map of India — territorial extent');
const art = fs.readFileSync(path.join(root, 'src', 'components', 'Art.tsx'), 'utf8');
const block = art.match(/const INDIA:\s*\[number,\s*number\]\[\]\s*=\s*\[([\s\S]*?)\];/);
ok(Boolean(block), 'the India outline point list is present');
if (block) {
  const pts = [...block[1].matchAll(/\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/g)]
    .map((m) => [Number(m[1]), Number(m[2])]);
  ok(pts.length >= 40, 'outline has enough points to stay faithful', `${pts.length} points`);

  const north = pts.filter(([, y]) => y <= 14);
  ok(north.length > 0, 'includes Gilgit-Baltistan / the northern tip (~37.05 N)',
    `${north.length} point(s), min y ${Math.min(...pts.map((q) => q[1]))}`);

  const aksai = pts.filter(([x, y]) => x >= 160 && y <= 40);
  ok(aksai.length > 0, 'includes Aksai Chin', `${aksai.length} point(s)`);

  const pok = pts.filter(([x, y]) => x <= 95 && y <= 80);
  ok(pok.length > 0, 'includes Pakistan-occupied Kashmir / western J&K', `${pok.length} point(s)`);
}

// -- 4. no other-nation comparison ------------------------------------------
console.log('\n  scope');
const OTHER = ['america', 'american', 'britain', 'british', 'china', 'chinese', 'pakistan', 'usa', 'uk ', 'europe', 'russia', 'france'];
const foundOther = OTHER.filter((w) => copyText.toLowerCase().includes(w));
ok(foundOther.length === 0, 'no comparison to another country', foundOther.join(', ') || '-');

console.log('\n' + '='.repeat(72));
for (const w of warns) console.log(`  NOTE  ${w}`);
if (fails.length) {
  console.log(`\nFAILED — ${fails.length} check(s)`);
  process.exit(1);
}
console.log('\nALL COPY CHECKS PASSED');
