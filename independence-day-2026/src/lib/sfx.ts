import {staticFile} from 'remotion';

/**
 * Every cue is synthesised from scratch by scripts/gen_audio.py (numpy/scipy —
 * Karplus-Strong plucked strings, biquad filters, envelopes, comb/hall reverb,
 * inharmonic bell partials, stereo widening). No external audio service is
 * involved anywhere in this project, and none of the toolkit's ElevenLabs
 * tooling is used.
 *
 * scripts/audit_audio.py cross-references this table against
 * public/audio/sfx and fails if a name here has no file on disk, or if a file
 * on disk is referenced by nothing.
 */
export const CUE = {
  // -- ceremony / symbol ---------------------------------------------------
  conch: 'audio/sfx/conch.mp3',
  'chakra-ring': 'audio/sfx/chakra-ring.mp3',
  'bell-temple': 'audio/sfx/bell-temple.mp3',
  'flag-furl': 'audio/sfx/flag-furl.mp3',
  // -- the freedom-struggle beat ------------------------------------------
  charkha: 'audio/sfx/charkha.mp3',
  'chain-break': 'audio/sfx/chain-break.mp3',
  // -- landscape textures --------------------------------------------------
  'wind-peak': 'audio/sfx/wind-peak.mp3',
  'water-flow': 'audio/sfx/water-flow.mp3',
  // -- weight / architecture ----------------------------------------------
  'stone-set': 'audio/sfx/stone-set.mp3',
  'impact-deep': 'audio/sfx/impact-deep.mp3',
  // -- performing arts -----------------------------------------------------
  ghungroo: 'audio/sfx/ghungroo.mp3',
  'sitar-pluck': 'audio/sfx/sitar-pluck.mp3',
  'tabla-na': 'audio/sfx/tabla-na.mp3',
  'tabla-tin': 'audio/sfx/tabla-tin.mp3',
  'dhol-hit': 'audio/sfx/dhol-hit.mp3',
  // -- movement ------------------------------------------------------------
  'whoosh-silk': 'audio/sfx/whoosh-silk.mp3',
  'whoosh-air': 'audio/sfx/whoosh-air.mp3',
  'riser-tanpura': 'audio/sfx/riser-tanpura.mp3',
  // -- tone / close --------------------------------------------------------
  'bansuri-swell': 'audio/sfx/bansuri-swell.mp3',
  'shimmer-gold': 'audio/sfx/shimmer-gold.mp3',
  'chime-close': 'audio/sfx/chime-close.mp3',
} as const;

export type CueName = keyof typeof CUE;

export const cue = (n: CueName): string => staticFile(CUE[n]);

/** The 60.000 s music bed — Raga Desh, modern-classical hybrid. */
export const bed = (): string => staticFile('audio/sfx/music-bed.mp3');

/**
 * The 60.000 s constant ambient texture layer. Plays underneath the music for
 * the entire runtime — a low tanpura shimmer, slow moving air and a distant
 * bell resonance. Deliberately its own file rather than folded into the music
 * bed, so the constant-presence requirement is independently auditable.
 */
export const ambient = (): string => staticFile('audio/sfx/ambient-bed.mp3');
