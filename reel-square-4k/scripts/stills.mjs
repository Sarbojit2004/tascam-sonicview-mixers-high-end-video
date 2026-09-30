// Render review stills from one bundle.
//   node scripts/stills.mjs <CompositionId> <outDir> <scale> <frame> [frame ...]
//   node scripts/stills.mjs ReelLostSky /tmp/s 0.5 10 200 400
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, outDir, scaleArg, ...frames] = process.argv.slice(2);
const scale = Number(scaleArg || 0.5);
const browserExecutable =
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id, browserExecutable, chromiumOptions: {gl: 'angle'}});
for (const fr of frames.length ? frames.map(Number) : [0]) {
  const t0 = Date.now();
  const output = path.join(outDir, `${id}-${String(fr).padStart(4, '0')}.${scale >= 1.5 ? 'png' : 'jpg'}`);
  await renderStill({
    serveUrl,
    composition,
    frame: fr,
    output,
    scale,
    browserExecutable,
    chromiumOptions: {gl: 'angle'},
    imageFormat: scale >= 1.5 ? 'png' : 'jpeg',
    ...(scale >= 1.5 ? {} : {jpegQuality: 88}),
    timeoutInMilliseconds: 240000,
  });
  console.log(output, `${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
