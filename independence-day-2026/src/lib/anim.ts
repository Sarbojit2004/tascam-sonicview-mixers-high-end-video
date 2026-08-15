import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

/**
 * Every camera move and asset animation in this reel runs on one of these
 * cubic-bezier curves. Nothing uses linear interpolation — linear movement
 * reads as cheap and robotic, which is the one thing a heritage piece cannot
 * afford.
 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_SOFT = Easing.bezier(0.33, 1, 0.68, 1);
export const EASE_SLOW = Easing.bezier(0.22, 0.61, 0.36, 1);

/** Clamped interpolate with a premium default ease. */
export const ramp = (
  f: number,
  range: [number, number],
  out: [number, number],
  easing = EASE_OUT,
): number =>
  interpolate(f, range, out, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Fade-in / hold / fade-out envelope. */
export const envelope = (f: number, dur: number, inF = 10, outF = 10): number =>
  Math.min(ramp(f, [0, inF], [0, 1]), ramp(f, [dur - outF, dur], [1, 0], EASE_IN_OUT));

/** Beat entry ramp — beats render longer than their slot and cross-dissolve. */
export const beatIn = (f: number, n = 10): number => ramp(f, [0, n], [0, 1], EASE_IN_OUT);

export const pop = (f: number, delay = 0, damping = 14): number =>
  spring({frame: f - delay, fps: FPS, config: {damping, mass: 0.55, stiffness: 120}});

export const popSoft = (f: number, delay = 0): number =>
  spring({frame: f - delay, fps: FPS, config: {damping: 200, mass: 0.9, stiffness: 90}});

/**
 * Slow cinematic push-in / drift for a whole art layer. Every beat gets one so
 * nothing ever sits perfectly still.
 */
export const push = (
  f: number,
  dur: number,
  z: [number, number] = [1.0, 1.08],
  x: [number, number] = [0, 0],
  y: [number, number] = [0, 0],
  easing = EASE_SLOW,
): string => {
  const s = ramp(f, [0, dur], z, easing);
  const tx = ramp(f, [0, dur], x, easing);
  const ty = ramp(f, [0, dur], y, easing);
  return `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
};

/** Index -> delay, for staggered reveals. */
export const stag = (i: number, per = 4, base = 0): number => base + i * per;

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rnd = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Sub-beat stepper: index + local progress for a slot that steps through
 * `count` items over `dur` frames. Drives the montage passages (architecture,
 * dance, instruments, festivals).
 */
export const step = (
  f: number,
  dur: number,
  count: number,
): {i: number; local: number; per: number; t: number} => {
  const per = dur / Math.max(1, count);
  const i = Math.min(count - 1, Math.max(0, Math.floor(f / per)));
  return {i, local: f - i * per, per, t: (f - i * per) / per};
};

/**
 * Stroke-reveal helper for line art: returns the dashoffset for a path of
 * length `len` drawing itself over [from, to].
 */
export const draw = (f: number, from: number, to: number, len: number, easing = EASE_OUT): number =>
  len * (1 - ramp(f, [from, to], [0, 1], easing));
