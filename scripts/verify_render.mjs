// Verifies a delivered reel against the format contract.
//
//   node scripts/verify_render.mjs out/sonicview-reel-part1-hub.mp4
//
// Checks: file exists and is non-trivial, exactly 1080x1920, 30 fps, 2640
// frames / 88.000 s (within one frame), a video AND an audio stream are both
// present, and the audio actually carries signal rather than being a silent
// track that merely exists.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('usage: node scripts/verify_render.mjs <file.mp4>');
  process.exit(2);
}

const bin = (name) => {
  const env = process.env[`${name.toUpperCase()}_BIN`];
  if (env && fs.existsSync(env)) return env;
  for (const base of [
    '/tmp/claude-0/-home-user/0e819879-0732-5152-8fe9-14ac7391b2c6/scratchpad',
    process.cwd(),
  ]) {
    const pkg = name === 'ffmpeg' ? '@ffmpeg-installer' : '@ffprobe-installer';
    const p = path.join(base, 'node_modules', pkg, 'linux-x64', name);
    if (fs.existsSync(p)) return p;
  }
  return name;
};

const FFPROBE = bin('ffprobe');
const FFMPEG = bin('ffmpeg');

// The two series have different contracts; pick by filename so one command
// verifies either.
const LONGFORM = /longform/.test(target);
const EXPECT = LONGFORM
  ? {w: 1920, h: 1080, fps: 30, frames: 8940, seconds: 298.0}
  : {w: 1080, h: 1920, fps: 30, frames: 2640, seconds: 88.0};
const fails = [];
const ok = (cond, msg, detail) => {
  console.log(`  ${cond ? '✓' : '✗'} ${msg}${detail ? `  ${detail}` : ''}`);
  if (!cond) fails.push(msg);
};

console.log(`\nVERIFY  ${target}`);
console.log('='.repeat(64));

if (!fs.existsSync(target)) {
  console.log('  ✗ file does not exist');
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

ok(Boolean(v), 'video stream present', v ? `${v.codec_name}` : '');
ok(Boolean(a), 'audio stream present', a ? `${a.codec_name} ${a.channels}ch @${a.sample_rate}` : '');
if (!v) {
  console.log('\nFAILED');
  process.exit(1);
}

ok(v.width === EXPECT.w && v.height === EXPECT.h, `resolution ${EXPECT.w}x${EXPECT.h}`, `${v.width}x${v.height}`);

const [num, den] = v.r_frame_rate.split('/').map(Number);
const fps = num / den;
ok(Math.abs(fps - EXPECT.fps) < 0.01, 'frame rate 30 fps', fps.toFixed(3));

const dur = Number(probe.format.duration);
const frames = Number(v.nb_frames) || Math.round(dur * fps);
ok(
  Math.abs(frames - EXPECT.frames) <= 1,
  `frame count ${EXPECT.frames} (±1)`,
  `${frames}`,
);
ok(
  Math.abs(dur - EXPECT.seconds) < 0.08,
  `duration ${EXPECT.seconds.toFixed(3)} s`,
  `${dur.toFixed(3)} s`,
);

if (a) {
  const raw = execFileSync(
    FFMPEG,
    ['-v', 'error', '-i', target, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
    {maxBuffer: 1 << 28},
  );
  const pcm = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.length / 4));
  let peak = 0;
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) {
    const x = Math.abs(pcm[i]);
    if (x > peak) peak = x;
    sum += pcm[i] * pcm[i];
  }
  const rms = Math.sqrt(sum / pcm.length);
  ok(peak > 0.01, 'audio carries signal', `peak ${peak.toFixed(3)} rms ${rms.toFixed(4)}`);
  ok(peak <= 1.0001, 'audio not clipping', `peak ${peak.toFixed(3)}`);

  // coarse energy contour so a bed that dies halfway is visible
  const B = 22;
  const n = Math.floor(pcm.length / B);
  const buckets = [];
  for (let b = 0; b < B; b++) {
    let s = 0;
    for (let i = b * n; i < (b + 1) * n; i++) s += pcm[i] * pcm[i];
    buckets.push(Math.sqrt(s / n));
  }
  const hi = Math.max(...buckets);
  const blocks = ' ▁▂▃▄▅▆▇█';
  console.log(
    `      ${buckets.map((x) => blocks[Math.min(8, Math.floor((x / hi) * 8.4))]).join('')}`,
  );
  ok(
    buckets.every((x) => x > hi * 0.02),
    'no silent stretch in the audio bed',
  );
}

console.log('='.repeat(64));
console.log(fails.length ? `FAILED: ${fails.join(', ')}` : 'ALL CHECKS PASSED');
process.exit(fails.length ? 1 : 0);
