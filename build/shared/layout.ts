/**
 * SCENE GEOMETRY — one source of truth for where things sit.
 *
 * THIS IS THE FILE THAT MAKES THE ZERO-COLLISION RULE HOLD.
 *
 * Every beat kind's boxes are computed here, and BOTH the renderer and the
 * contact planner read them. The renderer draws into these rectangles; the
 * planner subtracts them from the frame to find genuinely free space for a
 * marketing strip. Because there is exactly one definition, a layout change
 * moves the strips automatically and the two can never disagree.
 *
 * The alternative — a hand-maintained table of "free corners per beat kind",
 * which is what the reference production used — works right up until a layout
 * changes, at which point the table is silently wrong and the audit still
 * passes. That failure mode is designed out rather than watched for.
 */
import type { Beat, Rect } from "./beat.ts";
import { PORTRAIT, LANDSCAPE, SAFE, SPACE } from "./theme.ts";

export interface SceneBoxes {
  /** Where media goes. */
  media?: Rect;
  /** A secondary media box, for side-by-side layouts. */
  media2?: Rect;
  /** Where the copy column goes. */
  copy?: Rect;
  /** Everything the layout genuinely occupies, for the collision planner. */
  occupies: Rect[];
}

const P = {
  x: SAFE.marginX,
  y: SAFE.contentTop,
  w: SAFE.contentW, // 952
  h: SAFE.contentH, // 1520
} as const;

const L = {
  x: SPACE.marginX,
  y: SPACE.marginY,
  w: SPACE.contentW, // 1808
  h: SPACE.contentH, // 976
} as const;

/** 16:9 height for a given width — the aspect of every B-roll clip. */
const h169 = (w: number) => Math.round((w * 9) / 16);
/** 3.2:1 height — the aspect of both real product videos. */
const h32 = (w: number) => Math.round(w / 3.2);

/* ── PORTRAIT ─────────────────────────────────────────────────────────────
 *
 * Content lives strictly inside y 180..1700. The bands above and below are
 * reserved for the contact layer, so nothing here may enter them — which is
 * what makes a portrait collision impossible rather than merely avoided.
 */
function portraitBoxes(beat: Beat): SceneBoxes {
  switch (beat.kind) {
    case "cold":
    case "broll": {
      const w = P.w;
      const h = h169(w);
      const media = { x: P.x, y: P.y + 300, w, h };
      const copy = { x: P.x, y: media.y + h + 56, w, h: 360 };
      return { media, copy, occupies: [media, copy] };
    }
    case "realvideo": {
      const w = P.w;
      const h = h32(w);
      const media = { x: P.x, y: P.y + 430, w, h };
      const copy = { x: P.x, y: media.y + h + 60, w, h: 320 };
      return { media, copy, occupies: [media, copy] };
    }
    case "hero":
    case "macro": {
      const media = { x: P.x, y: P.y + 190, w: P.w, h: 720 };
      const copy = { x: P.x, y: media.y + media.h + 64, w: P.w, h: 380 };
      return { media, copy, occupies: [media, copy] };
    }
    case "screen": {
      const media = { x: P.x, y: P.y + 260, w: P.w, h: 600 };
      const copy = { x: P.x, y: media.y + media.h + 60, w: P.w, h: 340 };
      return { media, copy, occupies: [media, copy] };
    }
    case "montage": {
      const media = { x: P.x, y: P.y + 240, w: P.w, h: 860 };
      const copy = { x: P.x, y: P.y + 40, w: P.w, h: 170 };
      return { media, copy, occupies: [media, copy] };
    }
    case "specs": {
      const copy = { x: P.x, y: P.y + 180, w: P.w, h: 520 };
      const media = { x: P.x, y: copy.y + copy.h + 60, w: P.w, h: 620 };
      return { media, copy, occupies: [media, copy] };
    }
    case "demo": {
      const media = { x: P.x, y: P.y + 330, w: P.w, h: 780 };
      const copy = { x: P.x, y: P.y + 60, w: P.w, h: 240 };
      return { media, copy, occupies: [media, copy] };
    }
    case "problem":
    case "statement":
    case "bridge": {
      const copy = { x: P.x, y: P.y + 420, w: P.w, h: 680 };
      return { copy, occupies: [copy] };
    }
    case "outro":
    default:
      return { occupies: [{ x: 0, y: 0, w: PORTRAIT.width, h: PORTRAIT.height }] };
  }
}

/* ── LANDSCAPE ────────────────────────────────────────────────────────────
 *
 * No reserved band, so these rectangles are what the planner has to work
 * with. Each layout is deliberately shaped to LEAVE something: a media plate
 * that fills the frame edge to edge would be honest geometry but would force
 * every strip into a collision, so plates are sized to leave a real gutter.
 */
function landscapeBoxes(beat: Beat): SceneBoxes {
  switch (beat.kind) {
    case "cold": {
      const w = 1180;
      const h = h169(w);
      const media = { x: (LANDSCAPE.width - w) / 2, y: 150, w, h };
      const copy = { x: L.x + 200, y: media.y + h + 34, w: L.w - 400, h: 120 };
      return { media, copy, occupies: [media, copy] };
    }
    case "broll": {
      const w = 1060;
      const h = h169(w);
      const media = { x: L.x, y: 158, w, h };
      const copy = { x: media.x + w + 56, y: 250, w: L.w - w - 56, h: 420 };
      return { media, copy, occupies: [media, copy] };
    }
    case "realvideo": {
      const w = 1600;
      const h = h32(w);
      const media = { x: (LANDSCAPE.width - w) / 2, y: 250, w, h };
      const copy = { x: L.x + 260, y: media.y + h + 46, w: L.w - 520, h: 130 };
      return { media, copy, occupies: [media, copy] };
    }
    case "hero": {
      const media = { x: 300, y: 120, w: 1320, h: 660 };
      const copy = { x: L.x + 240, y: media.y + media.h + 30, w: L.w - 480, h: 140 };
      return { media, copy, occupies: [media, copy] };
    }
    case "macro": {
      const media = { x: L.x, y: 150, w: 1000, h: 700 };
      const copy = { x: media.x + media.w + 60, y: 250, w: L.w - 1000 - 60, h: 460 };
      return { media, copy, occupies: [media, copy] };
    }
    case "screen": {
      const media = { x: 520, y: 130, w: 1120, h: 660 };
      const copy = { x: L.x, y: 300, w: 430, h: 400 };
      return { media, copy, occupies: [media, copy] };
    }
    case "montage": {
      const media = { x: L.x, y: 230, w: L.w, h: 620 };
      const copy = { x: L.x, y: 90, w: 1100, h: 110 };
      return { media, copy, occupies: [media, copy] };
    }
    case "specs": {
      const copy = { x: L.x, y: 210, w: 860, h: 620 };
      const media = { x: 1000, y: 190, w: 864, h: 660 };
      return { media, copy, occupies: [media, copy] };
    }
    case "demo": {
      const media = { x: 180, y: 180, w: 1560, h: 760 };
      const copy = { x: L.x, y: 66, w: 1200, h: 96 };
      return { media, copy, occupies: [media, copy] };
    }
    case "problem":
    case "statement":
    case "bridge": {
      const copy = { x: 300, y: 380, w: 1320, h: 320 };
      return { copy, occupies: [copy] };
    }
    case "outro":
    default:
      return { occupies: [{ x: 0, y: 0, w: LANDSCAPE.width, h: LANDSCAPE.height }] };
  }
}

export const boxesFor = (beat: Beat, portrait: boolean): SceneBoxes =>
  portrait ? portraitBoxes(beat) : landscapeBoxes(beat);

/** Stamp every beat with the geometry its own layout will occupy. */
export const withGeometry = (beats: Beat[], portrait: boolean): Beat[] =>
  beats.map((b) => ({ ...b, occupies: boxesFor(b, portrait).occupies }));
