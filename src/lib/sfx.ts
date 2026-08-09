import {staticFile} from 'remotion';

/**
 * Every cue is synthesised from scratch by scripts/gen_audio.py (numpy/scipy —
 * biquad filters, envelopes, comb reverb, stereo widening). No external audio
 * service is involved anywhere in this project.
 *
 * scripts/audit_audio.py cross-references this table against public/audio/sfx
 * and fails if a name here has no file on disk.
 */
export const CUE = {
  // quantized clock ticks — the 96 kHz / Dante-packet motif
  tick: 'audio/sfx/tick.mp3',
  'tick-hi': 'audio/sfx/tick-hi.mp3',
  // mechanics
  'fader-snap': 'audio/sfx/fader-snap.mp3',
  'click-ui': 'audio/sfx/click-ui.mp3',
  'card-slide': 'audio/sfx/card-slide.mp3',
  relay: 'audio/sfx/relay.mp3',
  // weight
  'impact-deep': 'audio/sfx/impact-deep.mp3',
  'impact-mid': 'audio/sfx/impact-mid.mp3',
  'impact-soft': 'audio/sfx/impact-soft.mp3',
  'sub-drop': 'audio/sfx/sub-drop.mp3',
  // movement
  'whoosh-air': 'audio/sfx/whoosh-air.mp3',
  'whoosh-rev': 'audio/sfx/whoosh-rev.mp3',
  'data-sweep': 'audio/sfx/data-sweep.mp3',
  riser: 'audio/sfx/riser.mp3',
  // tone
  swell: 'audio/sfx/swell.mp3',
  'net-ping': 'audio/sfx/net-ping.mp3',
  shimmer: 'audio/sfx/shimmer.mp3',
  'chime-final': 'audio/sfx/chime-final.mp3',
} as const;

export type CueName = keyof typeof CUE;

export const cue = (n: CueName): string => staticFile(CUE[n]);

export const bed = (part: 1 | 2 | 3): string =>
  staticFile(`audio/sfx/music-bed-part${part}.mp3`);

export const vo = (part: 1 | 2 | 3): string =>
  staticFile(`vo/voiceover-reel-part${part}.mp3`);
