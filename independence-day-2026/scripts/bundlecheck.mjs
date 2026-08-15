// Verifies the Remotion bundle builds and both compositions resolve with the
// expected geometry and duration.
//
//   node scripts/bundlecheck.mjs
import {bundle} from '@remotion/bundler';
import {getCompositions} from '@remotion/renderer';
import path from 'node:path';
import {browserExecutable} from './_chrome.mjs';

const fails = [];
const ok = (cond, msg, detail = '') => {
  console.log(`  ${cond ? 'OK  ' : 'FAIL'}  ${msg}${detail ? `  ${detail}` : ''}`);
  if (!cond) fails.push(msg);
};

console.log('BUNDLE CHECK');
console.log('='.repeat(64));

const serveUrl = await bundle({
  entryPoint: path.join(process.cwd(), 'src', 'index.ts'),
  onProgress: () => undefined,
});
ok(Boolean(serveUrl), 'bundle built');

const comps = await getCompositions(serveUrl, {browserExecutable});
console.log(`  found: ${comps.map((c) => c.id).join(', ')}`);

const reel = comps.find((c) => c.id === 'Reel');
ok(Boolean(reel), 'Reel composition resolves');
if (reel) {
  ok(reel.width === 1080 && reel.height === 1920, 'canvas is 1080x1920', `${reel.width}x${reel.height}`);
  ok(reel.fps === 30, 'fps is 30', String(reel.fps));
  ok(reel.durationInFrames === 1800, 'duration is 1800 frames / 60.000 s', String(reel.durationInFrames));
}
ok(Boolean(comps.find((c) => c.id === 'SafeCheck')), 'SafeCheck composition resolves');

console.log('='.repeat(64));
if (fails.length) {
  console.log(`FAILED — ${fails.length} check(s)`);
  process.exit(1);
}
console.log('BUNDLE CHECK PASSED');
