// Renders a still from the middle of every beat, plus an optional
// safe-zone-guide pass, so each composition can be checked at actual
// resolution before the full render.
//
//   node scripts/stills.mjs            # one still per beat
//   node scripts/stills.mjs --guides   # same, with the safe-zone overlay
//   node scripts/stills.mjs 7 13       # only beats 7 and 13 (1-indexed)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {browserExecutable} from './_chrome.mjs';

const BEATS = [
  ['B01', 170, 'dawn-tricolour'],
  ['B02', 150, '1947-nation-awoke'],
  ['B03', 118, 'ashoka-chakra'],
  ['B04', 108, 'himalaya'],
  ['B05', 112, 'rivers-forests'],
  ['B06', 112, 'desert-coast'],
  ['B07', 130, 'architecture'],
  ['B08', 124, 'dance'],
  ['B09', 112, 'music'],
  ['B10', 118, 'craft'],
  ['B11', 128, 'festivals'],
  ['B12', 118, 'languages'],
  ['B13', 120, 'unity'],
  ['B14', 180, 'the-wish'],
];

const args = process.argv.slice(2);
const guides = args.includes('--guides');
const only = args.filter((a) => /^\d+$/.test(a)).map(Number);

const outDir = path.join(process.cwd(), 'out', 'stills');
fs.mkdirSync(outDir, {recursive: true});

console.log('bundling…');
const serveUrl = await bundle({
  entryPoint: path.join(process.cwd(), 'src', 'index.ts'),
  onProgress: () => undefined,
});
console.log('bundled OK');

// Beat starts, so a still from the reel timeline lands mid-beat.
let acc = 0;
const starts = BEATS.map(([, dur]) => {
  const s = acc;
  acc += dur;
  return s;
});

for (let i = 0; i < BEATS.length; i++) {
  const [id, dur, slug] = BEATS[i];
  if (only.length && !only.includes(i + 1)) continue;

  // ~62% through the beat: past every entry animation, before the fade-out.
  const local = Math.floor(dur * 0.62);
  const compId = guides ? 'SafeCheck' : 'Reel';
  const frame = guides ? local : starts[i] + local;
  const inputProps = guides ? {beat: i} : {};

  const composition = await selectComposition({serveUrl, id: compId, inputProps, browserExecutable});
  const output = path.join(
    outDir,
    `${String(i + 1).padStart(2, '0')}-${id}-${slug}${guides ? '-guides' : ''}.png`,
  );
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    inputProps,
    imageFormat: 'png',
    browserExecutable,
    chromiumOptions: {gl: 'angle'},
  });
  const kb = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`  ${id}  frame ${String(frame).padStart(4)}  ${kb} KB  ${path.basename(output)}`);
}

console.log('\nstills in out/stills');
