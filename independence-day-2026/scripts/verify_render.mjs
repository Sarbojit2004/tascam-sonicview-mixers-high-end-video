// Verifies a delivered reel against the format contract.
//
//   node scripts/verify_render.mjs out/independence-day-80th-reel.mp4
//
// Checks: the file exists and is non-trivial, is exactly 1080x1920 at 30 fps,
// runs 1800 frames / 60.000 s (within one frame), carries BOTH a video and an
// audio stream, and that the audio actually holds signal on every frame rather
// than being a track that merely exists — which is the specific thing that
// would betray the constant ambient bed having dropped out somewhere.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2] ?? 'out/independence-day-80th-reel.mp4';

const bin = (name) => {
  const env = process.env[`${name.toUpperCase()}_BIN`];
  if (env && fs.existsSync(env)) return env;
  const pkg = name === 'ffmpeg' ? '@ffmpeg-installer' : '@ffprobe-installer';
  const p = path.join(process.cwd(), 'node_modules', pkg, 'linux-x64', name);
  return fs.existsSync(p) ? p : name;
};
const FFPROBE = bin('ffprobe');
const FFMPEG = bin('ffmpeg');

const EXPECT = {w: 1080, h: 1920, fps: 30, frames: 1800, seconds: 60.0};
const fails = [];
const ok = (cond, msg, detail = '') => {
  console.log(`  ${cond ? 'OK  ' : 'FAIL'}  ${msg}${detail ? `  ${detail}` : ''}`);
  if (!cond) fails.push(msg);
};

console.log(`\nVERIFY  ${target}`);
console.log('='.repeat(68));

if (!fs.existsSync(target)) {
  console.log('  FAIL  file does not exist');
  process.exit(1);
}
const bytes = fs.statSync(target).size;
ok(bytes > 1_000_000, 'file is non-trivial', `${(bytes / 1e6).toFixed(1)} MB`);

const probe = JSON.parse(
  execFileSync(FFPROBE, [
    '-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', target,
  ]).toString(),
);

const v = probe.streams.find((s) => s.codec_type === 'video');
const a = probe.streams.find((s) => s.codec_type === 'audio');

ok(Boolean(v), 'video stream present', v ? v.codec_name : '-');
ok(Boolean(a), 'audio stream present', a ? `${a.codec_name} ${a.sample_rate}Hz ${a.channels}ch` : '-');

if (v) {
  ok(v.width === EXPECT.w && v.height === EXPECT.h, `is ${EXPECT.w}x${EXPECT.h}`, `${v.width}x${v.height}`);
  const [num, den] = v.r_frame_rate.split('/').map(Number);
  const fps = num / den;
  ok(Math.abs(fps - EXPECT.fps) < 0.01, `is ${EXPECT.fps} fps`, fps.toFixed(3));
  const nb = Number(v.nb_frames || 0);
  if (nb) ok(Math.abs(nb - EXPECT.frames) <= 1, `is ${EXPECT.frames} frames`, String(nb));
  ok(v.pix_fmt === 'yuv420p', 'pixel format is yuv420p', v.pix_fmt);
}

const dur = Number(probe.format.duration);
ok(Math.abs(dur - EXPECT.seconds) <= 1 / EXPECT.fps + 0.02,
  `is ${EXPECT.seconds.toFixed(3)} s (within one frame)`, `${dur.toFixed(3)} s`);

// -- the audio actually carries signal, frame by frame ----------------------
const raw = execFileSync(
  FFMPEG,
  ['-v', 'error', '-i', target, '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'],
  {maxBuffer: 1 << 30},
);
const pcm = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4));
const hop = 48000 / EXPECT.fps;
const n = Math.floor(pcm.length / hop);
let peak = 0;
let sum = 0;
const frames = new Float64Array(n);
for (let i = 0; i < n; i++) {
  let s = 0;
  for (let k = 0; k < hop; k++) {
    const x = pcm[i * hop + k];
    s += x * x;
    const ax = Math.abs(x);
    if (ax > peak) peak = ax;
  }
  frames[i] = Math.sqrt(s / hop);
  sum += frames[i];
}
// frame 0 is AAC encoder priming and is legitimately empty
const body = Array.from(frames).slice(1);
const floor = Math.min(...body);
const loud = Math.max(...body);

ok(peak > 0.05, 'audio is audible', `peak ${peak.toFixed(3)}`);
ok(peak < 0.999, 'audio is not clipping', `peak ${peak.toFixed(3)}`);
ok(sum / n > 0.01, 'audio carries signal overall', `mean rms ${(sum / n).toFixed(4)}`);
ok(floor > 0.002, 'the constant ambient bed never drops out',
  `quietest frame rms ${floor.toFixed(4)} (loudest ${loud.toFixed(4)})`);

const bars = '▁▂▃▄▅▆▇█';
const buckets = 60;
const step = Math.ceil(n / buckets);
let contour = '';
for (let i = 0; i < n; i += step) {
  let m = 0;
  let c = 0;
  for (let k = i; k < Math.min(i + step, n); k++) {
    m += frames[k];
    c++;
  }
  contour += bars[Math.min(7, Math.floor((m / c / loud) * 7.999))];
}
console.log(`\n  loudness contour over the 60 s:\n  ${contour}`);

console.log('\n' + '='.repeat(68));
if (fails.length) {
  console.log(`FAILED — ${fails.length} check(s):`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('RENDER VERIFIED');
