/**
 * MOTION PRIMITIVES.
 *
 * Camera vocabulary pulled from across the four reference productions
 * (PREBUILD_PLAN §1) and consolidated in the TASCAM Recording Series'
 * `build/shared/anim.ts`: gimbal micro-movement, dolly, macro-to-full-reveal,
 * port-density sweep. Moves are eased rather than linear — a settled ease-out
 * for entrances, a slow constant drift for gimbal work.
 *
 * WHAT THIS BUILD ADDS, per the standing instruction that each production
 * should improve on its predecessors' motion quality while keeping the same
 * ideology:
 *
 *   focusPull()   A macro reveal that resolves its subject and its frame at
 *                 different rates. The predecessors scaled a plate uniformly,
 *                 which reads as a zoom. Adding a short, offset blur+contrast
 *                 settle on the CONTENTS while the PLATE is still travelling is
 *                 what makes the same move read as a camera finding focus.
 *
 *   dolly()       A true lateral track with parallax between a foreground
 *                 subject and its ground, rather than a single translate.
 *
 *   snap()        Critically-damped mechanical motion for the motorized-fader
 *                 recall, which Stage 5 asks to read as "snapping violently yet
 *                 precisely to position". A spring that overshoots would be
 *                 wrong; real motorized faders arrive and stop.
 *
 *   stagger()     Per-item entry offsets, used by the contact strips so the
 *                 marketing layer moves with the same grammar as the headlines
 *                 instead of fading in as a block.
 */
import { interpolate, Easing } from "remotion";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 -> 1 over [from, from+len], eased, clamped. */
export const ramp = (f: number, from: number, len: number, easing = EASE_OUT) =>
  interpolate(f, [from, from + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing,
  });

/** Constant-velocity 0 -> 1, for gimbal drift that must not accelerate. */
export const linear = (f: number, from: number, len: number) =>
  interpolate(f, [from, from + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

/** Fade in then out across a beat, so nothing pops at a cut. */
export const beatOpacity = (f: number, dur: number, inF = 12, outF = 12) =>
  interpolate(f, [0, inF, Math.max(inF + 1, dur - outF), dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

export const fade = (f: number, from: number, to: number) =>
  interpolate(f, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * MACRO-TO-FULL-REVEAL. Opens at extreme detail, pulls back smoothly, and
 * RESOLVES TO THE COMPLETE UNIT with time left to hold on it.
 *
 * THE NO-CROP RULE IS ENFORCED BY CONSTRUCTION, not by review: the scale curve
 * terminates at exactly 1.0 by `resolveAt` and is clamped there for the rest of
 * the beat. However tight the opening, the complete product is on screen,
 * uncropped, for the remainder — which is what the standing complete-product
 * rule requires and what a hand-tuned keyframe cannot guarantee.
 */
export function macroReveal(f: number, dur: number, startScale = 2.6, resolveAt = 0.72) {
  const end = Math.round(dur * resolveAt);
  const s = interpolate(f, [0, end], [startScale, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT,
  });
  return Math.max(1, s);
}

/**
 * The focus term that rides a macroReveal. Returns a CSS filter string.
 *
 * Focus resolves EARLIER than the scale (at 0.55 of the move rather than 1.0)
 * and with a different easing, so the subject snaps sharp while the frame is
 * still settling. That offset is the whole effect: matched curves read as a
 * zoom, offset curves read as a lens.
 */
export function focusPull(f: number, dur: number, resolveAt = 0.72, maxBlur = 7) {
  const end = Math.max(1, Math.round(dur * resolveAt * 0.55));
  const p = interpolate(f, [0, end], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT,
  });
  const blur = (1 - p) * maxBlur;
  const contrast = 1 - (1 - p) * 0.06;
  return blur < 0.05 ? "none" : `blur(${blur.toFixed(2)}px) contrast(${contrast.toFixed(3)})`;
}

/** Gimbal micro-movement: a slow, tiny, constant drift. Never organic. */
export function gimbal(f: number, dur: number, amount = 10) {
  const p = linear(f, 0, dur);
  return { x: (p - 0.5) * amount, y: (p - 0.5) * amount * 0.45 };
}

/**
 * LATERAL DOLLY with parallax. `depth` 0 is the ground plane, 1 the subject.
 * Returns px offsets; the caller applies them to separate layers so the two
 * planes genuinely separate rather than sliding as one image.
 */
export function dolly(f: number, dur: number, distance = 90, depth = 1) {
  const p = interpolate(f, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT,
  });
  return (p - 0.5) * distance * (0.35 + 0.65 * depth);
}

/**
 * PLATE PUSH-IN, clamped so the plate can never cross the edge inset.
 *
 * Motion scales the PLATE (frame and image together), never the image inside a
 * fixed frame. Scaling the inner image is exactly what eats edges and breaks
 * the no-crop rule; growing the whole plate cannot. Where a box lacks room to
 * grow outward, the push is re-expressed as a settle-IN, which reads as the
 * same deliberate move but grows inward.
 */
export function platePush(
  f: number, dur: number, room: number, boxW: number, want = 0.035,
): number {
  const canGrow = boxW > 0 ? Math.max(0, room / boxW) : 0;
  const grow = Math.min(want, canGrow);
  return grow > 0.004
    ? interpolate(f, [0, dur], [1, 1 + grow], { extrapolateRight: "clamp", easing: EASE_IN_OUT })
    : interpolate(f, [0, dur], [1 - want, 1], { extrapolateRight: "clamp", easing: EASE_IN_OUT });
}

/**
 * CRITICALLY-DAMPED SNAP — motorized-fader recall.
 *
 * Stage 5: faders "snapping violently yet precisely to position during a
 * Snapshot Recall, emphasizing mechanical speed and digital determinism".
 * Deterministic means it does NOT overshoot, so this is a critically-damped
 * step response rather than a spring: fast departure, hard arrival, no bounce.
 */
export function snap(f: number, from: number, len: number) {
  const t = interpolate(f, [from, from + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const k = 9; // rate; higher arrives sooner and flatter
  return 1 - (1 + k * t) * Math.exp(-k * t);
}

/** Per-item entry offset, so groups arrive as a sequence rather than a block. */
export const stagger = (i: number, per = 3) => i * per;

/**
 * A short settle used where something registers mechanically — a card seating,
 * a value latching. Tiny, and over quickly; a long one reads as a wobble.
 */
export function seat(f: number, at: number, len = 8, amount = 3) {
  const t = interpolate(f, [at, at + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT,
  });
  return (1 - t) * amount * Math.cos(t * Math.PI * 2.2);
}
