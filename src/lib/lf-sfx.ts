import {staticFile} from 'remotion';
import {CUE as REEL_CUE} from './sfx';

/**
 * Long-form cue table.
 *
 * The reel's 18 cues are reused verbatim — same files, same design language —
 * and 14 more are added under public/audio/lf, because 298 seconds of cuts per
 * part exposes repetition that 88 seconds hides. Everything is synthesised by
 * scripts/gen_audio_longform.py, which imports its DSP straight from
 * scripts/gen_audio.py so the two palettes cannot drift apart.
 *
 * scripts/audit_audio.py cross-references both tables against disk.
 */
const LF_ONLY = {
  'whoosh-deep': 'audio/lf/whoosh-deep.mp3',
  'whoosh-tight': 'audio/lf/whoosh-tight.mp3',
  'whoosh-grain': 'audio/lf/whoosh-grain.mp3',
  'click-hard': 'audio/lf/click-hard.mp3',
  latch: 'audio/lf/latch.mp3',
  'stinger-chapter': 'audio/lf/stinger-chapter.mp3',
  bloom: 'audio/lf/bloom.mp3',
  'reverse-swell': 'audio/lf/reverse-swell.mp3',
  'sub-thump': 'audio/lf/sub-thump.mp3',
  'sweep-up': 'audio/lf/sweep-up.mp3',
  'sweep-down': 'audio/lf/sweep-down.mp3',
  'tick-triple': 'audio/lf/tick-triple.mp3',
  'page-turn': 'audio/lf/page-turn.mp3',
  'lift-air': 'audio/lf/lift-air.mp3',
} as const;

export const LF_CUE = {...REEL_CUE, ...LF_ONLY} as const;

export type LFCueName = keyof typeof LF_CUE;

export const lfCue = (n: LFCueName): string => staticFile(LF_CUE[n]);

/** Every cue name, for round-robin transition selection. */
export const LF_CUE_NAMES = Object.keys(LF_CUE) as LFCueName[];

export const lfBed = (part: 1 | 2 | 3): string =>
  staticFile(`audio/lf/music-bed-longform-part${part}.mp3`);

/** The constant ambient texture that runs under the whole runtime. */
export const lfAmbient = (): string => staticFile('audio/lf/ambient-longform.mp3');

export const lfVo = (part: 1 | 2 | 3): string =>
  staticFile(`vo/voiceover-longform-part${part}.mp3`);
