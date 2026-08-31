/**
 * THE SOUND SET, mapped to beat kinds.
 *
 * Every file is synthesised by scripts/synth_audio.py from first principles.
 * None is a library sample, and none is the generative audio the video model
 * attached to the B-roll clips — that is stripped in prep_media.py.
 *
 * The mapping is deliberately sparse. A sound fires where something MECHANICAL
 * or DECISIVE happens on screen: a plate seats, a figure latches, a connector
 * registers, faders are driven to position. Scoring every beat would turn the
 * layer into texture, which is the one thing a sound design layer should not be.
 *
 * Gains sit between 0.11 and 0.22 against a bed at 0.34, leaving headroom for
 * the voiceover the scripts are written to.
 */
import type { BeatKind } from "./beat.ts";

export interface Sfx { file: string; at: number; gain: number }

export const SFX_FOR: Partial<Record<BeatKind, Sfx>> = {
  cold: { file: "phase-mark.wav", at: 6, gain: 0.18 },
  problem: { file: "phase-mark.wav", at: 10, gain: 0.14 },
  statement: { file: "spec-latch.wav", at: 16, gain: 0.13 },
  macro: { file: "card-seat.wav", at: 20, gain: 0.15 },
  hero: { file: "phase-mark.wav", at: 12, gain: 0.20 },
  specs: { file: "spec-latch.wav", at: 26, gain: 0.16 },
  screen: { file: "touch-tap.wav", at: 18, gain: 0.15 },
  montage: { file: "data-tick.wav", at: 10, gain: 0.12 },
  broll: { file: "knob-rotary.wav", at: 22, gain: 0.11 },
  realvideo: { file: "fader-throw.wav", at: 14, gain: 0.13 },
  bridge: { file: "phase-mark.wav", at: 8, gain: 0.16 },
  // the end screen gets one soft mark as the logos seat
  outro: { file: "phase-mark.wav", at: 8, gain: 0.15 },
};

/**
 * Demonstratives get their own sound, chosen per concept rather than per kind,
 * because each one has a different physical event at its centre.
 */
export const SFX_FOR_DEMO: Record<string, Sfx> = {
  hdia: { file: "spec-latch.wav", at: 100, gain: 0.16 },
  summing: { file: "spec-latch.wav", at: 66, gain: 0.15 },
  redundancy: { file: "packet-handoff.wav", at: 150, gain: 0.20 },
  afv: { file: "dc-lock.wav", at: 46, gain: 0.17 },
  recall: { file: "fader-snap.wav", at: 60, gain: 0.22 },
};
