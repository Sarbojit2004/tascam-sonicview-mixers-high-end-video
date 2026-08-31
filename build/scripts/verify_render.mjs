/**
 * VERIFY A RENDERED FILE AGAINST ITS FORMAT CONTRACT.
 *
 * Checks the output directly rather than trusting the renderer's exit code:
 * resolution, frame count, duration within one frame, both streams present, and
 * — the check that actually catches problems — that the audio carries signal
 * across the whole runtime rather than being a silent track of the right length.
 *
 * The energy contour is sampled in buckets across the file, so a bed that drops
 * out for thirty seconds in the middle fails even though the file's overall
 * level looks fine.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const BIN = join(ROOT, "node_modules", "@remotion", "compositor-linux-x64-gnu");
const FFPROBE = join(BIN, "ffprobe");
const FFMPEG = join(BIN, "ffmpeg");

const CONTRACT = {
  reel1: { w: 1080, h: 1920, frames: 5340 },
  reel2: { w: 1080, h: 1920, frames: 5340 },
  reel3: { w: 1080, h: 1920, frames: 5340 },
  part1: { w: 1920, h: 1080, frames: 8940 },
  part2: { w: 1920, h: 1080, frames: 8940 },
  part3: { w: 1920, h: 1080, frames: 8940 },
};

const FPS = 30;
const BUCKETS = 22;

const probe = (file, args) =>
  execFileSync(FFPROBE, ["-v", "error", ...args, "-of", "default=nw=1:nk=1", file], {
    encoding: "utf8",
  }).trim().split("\n");

let failures = 0;
const fail = (m) => { failures++; console.log(`  [31mFAIL[0m ${m}`); };
const ok = (m) => console.log(`  ok   ${m}`);

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CONTRACT);

for (const key of targets) {
  const c = CONTRACT[key];
  const file = join(ROOT, "out", `sonicview-${key}.mp4`);
  console.log(`\n[1m${key}[0m  ${file}`);
  if (!existsSync(file)) { fail("file does not exist"); continue; }

  const size = statSync(file).size;
  const [w, h, nb] = probe(file, [
    "-select_streams", "v:0", "-show_entries", "stream=width,height,nb_frames",
  ]);
  const [dur] = probe(file, ["-show_entries", "format=duration"]);
  const acodec = probe(file, ["-select_streams", "a:0", "-show_entries", "stream=codec_name"])[0];

  if (+w !== c.w || +h !== c.h) fail(`resolution ${w}x${h}, contract ${c.w}x${c.h}`);
  else ok(`resolution ${w}x${h}`);

  if (+nb !== c.frames) fail(`${nb} frames, contract ${c.frames}`);
  else ok(`${nb} frames = ${(c.frames / FPS).toFixed(3)} s`);

  // The exact contract is the FRAME COUNT, checked above. Container duration is
  // allowed a small tolerance because AAC-in-MP4 adds encoder priming and
  // padding: the audio track rounds up to a whole number of 1024-sample AAC
  // frames and carries a priming delay, which puts the container ~45-50 ms past
  // the video. That is normal and not something the render controls.
  const expected = c.frames / FPS;
  const AAC_PAD = 0.10;
  if (Math.abs(+dur - expected) > AAC_PAD) {
    fail(`duration ${(+dur).toFixed(3)} s, expected ${expected.toFixed(3)} s`);
  } else {
    ok(`duration ${(+dur).toFixed(3)} s (video exact; +${((+dur - expected) * 1000).toFixed(0)} ms AAC padding)`);
  }

  if (!acodec) fail("no audio stream");
  else ok(`streams: h264 + ${acodec}`);

  // Energy contour — the check that catches a silent or interrupted bed.
  //
  // Extracted as WAV rather than raw PCM: the ffmpeg bundled with Remotion's
  // compositor is a stripped build with no `s16le` muxer, so the obvious
  // approach fails at run time rather than at review time. `wav` is present.
  const tmp = join(ROOT, "out", `.verify-${key}.wav`);
  execFileSync(FFMPEG, [
    "-y", "-v", "error", "-i", file, "-map", "0:a:0",
    "-ac", "1", "-ar", "8000", "-f", "wav", tmp,
  ]);
  const buf = readFileSync(tmp);
  unlinkSync(tmp);
  // Walk the RIFF chunks to the `data` payload rather than assuming a 44-byte
  // header — ffmpeg emits a LIST/INFO chunk, so a fixed offset lands mid-metadata.
  let off = 12;
  while (off + 8 <= buf.length && buf.toString("latin1", off, off + 4) !== "data") {
    off += 8 + buf.readUInt32LE(off + 4);
  }
  const start = off + 8;
  const bytes = Math.min(buf.readUInt32LE(off + 4), buf.length - start);
  const samples = new Int16Array(
    buf.buffer.slice(buf.byteOffset + start, buf.byteOffset + start + (bytes & ~1)),
  );
  const per = Math.floor(samples.length / BUCKETS);
  const rms = [];
  for (let b = 0; b < BUCKETS; b++) {
    let acc = 0;
    for (let i = b * per; i < (b + 1) * per; i++) acc += samples[i] * samples[i];
    rms.push(Math.sqrt(acc / per) / 32768);
  }
  const quiet = rms.filter((v) => v < 0.0015).length;
  const peak = Math.max(...rms, 1e-6);
  const contour = rms.map((v) => " ▁▂▃▄▅▆▇█"[Math.max(1, Math.min(8, Math.round((v / peak) * 8)))]).join("");
  if (quiet > 1) fail(`audio silent in ${quiet}/${BUCKETS} buckets  ${contour}`);
  else ok(`audio carries signal throughout  ${contour}`);

  ok(`${(size / 1e6).toFixed(1)} MB`);
}

console.log("");
if (failures) { console.log(`[31m${failures} failure(s).[0m`); process.exit(1); }
console.log("[32mAll rendered files verified.[0m");
