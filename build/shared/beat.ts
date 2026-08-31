/**
 * BEAT MODEL shared by all six deliverables.
 *
 * A beat declares its duration in SECONDS and the frame count is derived, so
 * each deliverable's runtime is exact by construction rather than by arithmetic
 * that has to be re-checked after every edit. `assertRuntime` fails loudly if a
 * beat list does not sum to its target.
 *
 * A beat also declares the RECTANGLES ITS LAYOUT OCCUPIES (`occupies`). That is
 * what lets the contact planner compute genuinely free space per scene instead
 * of reading a hand-written table of "free corners" that a later layout change
 * would silently invalidate. See contactplan.ts.
 */
import type { UnitId } from "./spec.ts";

export type BeatKind =
  | "cold"        // cold open
  | "problem"     // the Phase 1 tension beat — the only place the serif leads
  | "statement"   // a claim, typographic
  | "macro"       // macro-to-full-reveal on a real photograph
  | "hero"        // full-product hero plate
  | "montage"     // multi-image mosaic
  | "specs"       // Stage 10 hierarchy: hero figure + subtext + data block
  | "broll"       // one of the 25 verified clips
  | "realvideo"   // one of the 2 real product videos, natural speed
  | "screen"      // a rendered VIEW touchscreen plate
  | "demo"        // one of the five Stage 6 demonstratives
  | "bridge"      // continuation into the next part
  | "outro";      // the end screen — the ONLY place a logo exists

export interface Rect { x: number; y: number; w: number; h: number }

export interface Beat {
  id: string;
  kind: BeatKind;
  /** Seconds. Frames are derived. */
  sec: number;
  unit?: UnitId;
  units?: UnitId[];
  label?: string;
  hero?: string;
  sub?: string;
  body?: string[];
  /** Real assets, by ledger id. */
  images?: number[];
  /** Real product video, by ledger id. Natural speed, never cropped. */
  video?: number;
  /** B-roll clip number, 1..25. */
  clip?: number;
  /** Seconds into the clip to start. Clips are 10.005 s. */
  clipFrom?: number;
  /** Stage 8 keys surfaced as Level 1 figures. */
  specKeys?: string[];
  /** Which of the five demonstratives, for kind === "demo". */
  demo?: "hdia" | "summing" | "redundancy" | "afv" | "recall";
  /** Stage 7 phase, for the record. */
  phase?: 1 | 2 | 3 | 4 | 5;
  /**
   * Rectangles this beat's layout genuinely occupies, in canvas coordinates.
   * Supplied by the scene module from the SAME constants it renders from.
   * The contact planner subtracts these from the frame to find free space.
   */
  occupies?: Rect[];
}

export const frames = (sec: number, fps = 30) => Math.round(sec * fps);

export function starts(beats: Beat[], fps = 30): number[] {
  const out: number[] = [];
  let acc = 0;
  for (const b of beats) {
    out.push(acc);
    acc += frames(b.sec, fps);
  }
  return out;
}

export const totalFrames = (beats: Beat[], fps = 30) =>
  beats.reduce((n, b) => n + frames(b.sec, fps), 0);

/** Absolute start frame keyed by beat id, for the audits. */
export function startMap(beats: Beat[], fps = 30): Record<string, number> {
  const s = starts(beats, fps);
  const out: Record<string, number> = {};
  beats.forEach((b, i) => { out[b.id] = s[i]; });
  return out;
}

/**
 * Hard runtime gate. Called by every deliverable's Root at module load, so a
 * beat-list edit that breaks the target frame count fails immediately rather
 * than after a 40-minute render.
 */
export function assertRuntime(name: string, beats: Beat[], target: number, fps = 30): void {
  const got = totalFrames(beats, fps);
  if (got !== target) {
    throw new Error(
      `${name}: beat list is ${got} frames, target is ${target} ` +
        `(${(got / fps).toFixed(3)} s vs ${(target / fps).toFixed(3)} s). ` +
        `Difference ${got - target} frames.`,
    );
  }
  const ids = beats.map((b) => b.id);
  const dupe = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dupe) throw new Error(`${name}: duplicate beat id "${dupe}".`);
  const outros = beats.filter((b) => b.kind === "outro");
  if (outros.length !== 1) {
    throw new Error(`${name}: needs exactly one outro beat, found ${outros.length}.`);
  }
  if (beats[beats.length - 1].kind !== "outro") {
    throw new Error(`${name}: the outro must be the last beat.`);
  }
}
