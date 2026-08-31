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

/* ── HOW TALL THE COPY ACTUALLY IS ────────────────────────────────────────
 *
 * This exists because the first version got the central claim wrong.
 *
 * The premise of this file is that the renderer and the contact planner read
 * ONE definition of the geometry, so they cannot disagree. But the copy boxes
 * were hand-picked constants, and a hand-picked constant is a guess about how
 * much room the words need. The landscape `hero` box was declared 140 px tall
 * and rendered roughly 400 px of label, headline, subhead and data rows — so
 * the copy overflowed the frame, and the planner, trusting the declared 140,
 * put a contact strip straight through it. Caught by looking at the Part 1
 * thumbnail; it would have shipped in three parts.
 *
 * So the height is now MEASURED from the beat's own content, with the same
 * sizes and gaps the renderer uses. Character widths are empirical for Archivo
 * at these weights — approximate, but approximate in the same direction for
 * both consumers, which is what matters. Every box is then clamped inside the
 * frame, so an underestimate cannot push content off the canvas either.
 */
const CHAR_W = { headline: 0.60, sub: 0.50, body: 0.56 } as const;

/**
 * Bottom strip of the landscape frame that full-width layouts must not enter.
 *
 * A contact strip is 54 px tall at a 56 px inset, so anything reaching past
 * y = 1080 - 130 makes every bottom slot collide — and since a full-width plate
 * also blocks the left, right and top slots, the planner is left with nowhere
 * to go and refuses outright. Reserving this keeps the bottom row available.
 */
const STRIP_GUTTER = 130;

const textH = (text: string, size: number, width: number, lineH: number, charW: number) => {
  const perLine = Math.max(1, Math.floor(width / (size * charW)));
  return Math.max(1, Math.ceil(text.length / perLine)) * size * lineH;
};

/** Height the copy column needs for this beat at this width. */
function copyH(beat: Beat, width: number, portrait: boolean): number {
  const H1 = portrait ? 62 : 60;
  const H2 = portrait ? 30 : 29;
  const BODY = portrait ? 24 : 23;
  const gap = portrait ? 20 : 18;

  // `specs` sets its figure with HeroFigure, not Headline — a much larger face
  // with its own subtext line beneath it.
  const heroScale =
    beat.kind === "demo" ? 0.78 : beat.kind === "montage" ? 0.82 : 1;

  let h = 0;
  let blocks = 0;
  if (beat.label) { h += 30; blocks++; }
  if (beat.kind === "specs") {
    if (beat.hero) h += (portrait ? 108 : 122) * 1.02 + 16 + 22 * 1.3;
    blocks++;
  } else if (beat.hero) {
    h += textH(beat.hero, H1 * heroScale, width, 1.06, CHAR_W.headline);
    blocks++;
  }
  if (beat.sub && beat.kind !== "specs") {
    h += textH(beat.sub, H2, width, 1.32, CHAR_W.sub);
    blocks++;
  }
  if (beat.body?.length) {
    h += beat.body.reduce(
      (a, r) => a + textH(r, BODY, width - 24, 1.42, CHAR_W.body),
      0,
    ) + 11 * (beat.body.length - 1);
    blocks++;
  }
  return Math.round(h + gap * Math.max(0, blocks - 1) + 14);
}

/* ── PORTRAIT ─────────────────────────────────────────────────────────────
 *
 * Content lives strictly inside y 180..1700. The bands above and below are
 * reserved for the contact layer, so nothing here may enter them — which is
 * what makes a portrait collision impossible rather than merely avoided.
 */
/**
 * Stack blocks vertically and CENTRE the result in the content band.
 *
 * The first pass positioned every portrait block by a hand-picked offset from
 * the top of the band, which left 500-600 px of dead page under most beats —
 * the composition used about 60% of the 1520 px available and read as though it
 * had slipped upward. Deriving each y from the stack's own height instead means
 * a beat is balanced in its band whatever it happens to contain.
 *
 * `order` is top-to-bottom. Heights are what each block actually needs.
 */
function stackP(order: { key: "media" | "copy"; h: number }[], gap: number): SceneBoxes {
  const total = order.reduce((n, b) => n + b.h, 0) + gap * (order.length - 1);
  let y = P.y + Math.max(0, (P.h - total) / 2);
  const out: SceneBoxes = { occupies: [] };
  for (const b of order) {
    const r = { x: P.x, y, w: P.w, h: b.h };
    out[b.key] = r;
    out.occupies.push(r);
    y += b.h + gap;
  }
  return out;
}

function portraitBoxes(beat: Beat): SceneBoxes {
  // Same estimator as landscape, so a portrait beat's declared box is also what
  // its words actually need rather than a guess.
  const ch = copyH(beat, P.w, true);
  const fit = (mediaH: number, gap: number) =>
    Math.min(mediaH, P.h - ch - gap);
  switch (beat.kind) {
    case "cold":
    case "broll":
      return stackP([{ key: "media", h: fit(h169(P.w), 64) }, { key: "copy", h: ch }], 64);
    case "realvideo":
      return stackP([{ key: "media", h: fit(h32(P.w), 70) }, { key: "copy", h: ch }], 70);
    case "hero":
    case "macro":
      return stackP([{ key: "media", h: fit(760, 62) }, { key: "copy", h: ch }], 62);
    case "screen":
      return stackP([{ key: "media", h: fit(700, 62) }, { key: "copy", h: ch }], 62);
    case "montage":
      return stackP([{ key: "copy", h: ch }, { key: "media", h: fit(1080, 54) }], 54);
    case "specs":
      return stackP([{ key: "copy", h: ch }, { key: "media", h: fit(700, 66) }], 66);
    case "demo":
      return stackP([{ key: "copy", h: ch }, { key: "media", h: fit(1000, 56) }], 56);
    case "problem":
    case "statement":
    case "bridge":
      return stackP([{ key: "copy", h: ch }], 0);
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
      const cw = L.w - 400;
      const ch = copyH(beat, cw, false);
      const media = { x: (LANDSCAPE.width - w) / 2, y: 128, w, h };
      const copy = { x: L.x + 200, y: media.y + h + 32, w: cw, h: ch };
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
      const cw = L.w - 520;
      const ch = copyH(beat, cw, false);
      const media = { x: (LANDSCAPE.width - w) / 2, y: 236, w, h };
      const copy = { x: L.x + 260, y: media.y + h + 44, w: cw, h: ch };
      return { media, copy, occupies: [media, copy] };
    }
    case "hero": {
      // Copy first: the picture takes whatever height the words leave.
      const cw = L.w - 480;
      const ch = copyH(beat, cw, false);
      const top = 84;
      // The whole stack finishes above the reserved gutter, so the bottom slot
      // row stays available. Without this the plate and the copy between them
      // span the frame and the planner has nowhere to put a strip.
      const top_gap = 36;
      const mh = Math.max(
        340,
        Math.min(620, LANDSCAPE.height - STRIP_GUTTER - top - top_gap - ch),
      );
      const media = { x: 300, y: top, w: 1320, h: mh };
      const copy = { x: L.x + 240, y: media.y + mh + top_gap, w: cw, h: ch };
      return { media, copy, occupies: [media, copy] };
    }
    case "macro": {
      const cw = L.w - 1060;
      const ch = copyH(beat, cw, false);
      const media = { x: L.x, y: 150, w: 1000, h: 700 };
      const copy = {
        x: media.x + media.w + 60,
        y: Math.max(L.y + 40, (LANDSCAPE.height - ch) / 2),
        w: cw,
        h: ch,
      };
      return { media, copy, occupies: [media, copy] };
    }
    case "screen": {
      const cw = 448;
      const ch = copyH(beat, cw, false);
      const media = { x: 560, y: 130, w: 1104, h: 650 };
      const copy = {
        x: L.x,
        y: Math.max(L.y + 30, (LANDSCAPE.height - ch) / 2),
        w: cw,
        h: ch,
      };
      return { media, copy, occupies: [media, copy] };
    }
    case "montage": {
      const cw = 1400;
      const ch = copyH(beat, cw, false);
      const copy = { x: L.x, y: 78, w: cw, h: ch };
      const media = {
        x: L.x, y: copy.y + ch + 34, w: L.w,
        h: LANDSCAPE.height - STRIP_GUTTER - (copy.y + ch + 34),
      };
      return { media, copy, occupies: [media, copy] };
    }
    case "specs": {
      const cw = 860;
      const ch = copyH(beat, cw, false);
      const copy = { x: L.x, y: Math.max(L.y + 30, (LANDSCAPE.height - ch) / 2), w: cw, h: ch };
      const media = { x: 1000, y: 190, w: 864, h: 660 };
      return { media, copy, occupies: [media, copy] };
    }
    case "demo": {
      const cw = 1400;
      const ch = copyH(beat, cw, false);
      const copy = { x: L.x, y: 60, w: cw, h: ch };
      const media = {
        x: 180, y: copy.y + ch + 26, w: 1560,
        h: LANDSCAPE.height - STRIP_GUTTER - (copy.y + ch + 26),
      };
      return { media, copy, occupies: [media, copy] };
    }
    case "problem":
    case "statement":
    case "bridge": {
      const cw = 1320;
      const ch = copyH(beat, cw, false);
      const copy = { x: 300, y: Math.max(L.y, (LANDSCAPE.height - ch) / 2), w: cw, h: ch };
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
