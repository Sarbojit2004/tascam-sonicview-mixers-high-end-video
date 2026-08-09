// Renders verification stills (and optional short motion ranges) for a
// composition, so every scene can be eyeballed at full 1080x1920 before the
// long render is spent.
//
//   node scripts/stills.mjs Part1Hub 0 95 200 340 ...
//   node scripts/stills.mjs Part1Hub --guides 0 95      (safe-zone overlay)
//
// Output lands in scratch/stills/<composition>/f<frame>.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const compId = args[0] ?? 'Part1Hub';
const frames = args.slice(1).filter((a) => !a.startsWith('--')).map(Number);
const outDir =
  process.env.STILLS_DIR ??
  path.join(
    '/tmp/claude-0/-home-user/0e819879-0732-5152-8fe9-14ac7391b2c6/scratchpad',
    'stills',
    compId,
  );

fs.mkdirSync(outDir, {recursive: true});

const BROWSER =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const root = path.resolve(process.cwd());
console.log(`bundling ${root} ...`);
const serveUrl = await bundle({
  entryPoint: path.join(root, 'src', 'index.ts'),
  webpackOverride: (c) => c,
});
console.log('bundle ok');

const composition = await selectComposition({
  serveUrl,
  id: compId,
  inputProps: {},
  browserExecutable: BROWSER,
});
console.log(
  `composition ${composition.id}: ${composition.width}x${composition.height} @${composition.fps} · ${composition.durationInFrames}f`,
);

for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    imageFormat: 'png',
    browserExecutable: BROWSER,
    chromiumOptions: {gl: 'angle'},
    timeoutInMilliseconds: 120000,
  });
  console.log(`  f${frame} -> ${output}`);
}
console.log('done');
