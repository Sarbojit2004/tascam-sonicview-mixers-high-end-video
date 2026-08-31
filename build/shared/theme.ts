/**
 * DESIGN TOKENS — TASCAM Sonicview, six deliverables.
 *
 * PROVENANCE (PREBUILD_PLAN §1). Every neutral, structural, radius, spacing and
 * safe-zone value below is pulled UNCHANGED from the four named reference
 * productions, and nothing is taken from this repository's own superseded
 * Sonicview build:
 *
 *   paper / ink / slate ramp ....... MOTU M-Series `longform/src/theme.ts`,
 *                                    which carries MOTU AVB's values unchanged,
 *                                    and which the TASCAM Recording Series
 *                                    already re-confirmed for a TASCAM subject.
 *   accent (TASCAM panel amber) .... TASCAM Recording Series `build/shared/theme.ts`.
 *                                    The MOTU palette's primary accent is MOTU's
 *                                    own brand blue; carrying it through a TASCAM
 *                                    production would name a competitor in colour.
 *   signal / alert ................. MOTU AVB, unchanged. These are semantic
 *                                    (meter green, problem-chapter red), not brand.
 *   SAFE 180 / 220 / 64 ............ MOTU AVB portrait reels -> AVB compressed-reel
 *                                    -> M-Series `portrait/src/theme.ts` -> RS.
 *   SPACE 56 / 52 .................. MOTU AVB long-form -> M-Series `longform/`.
 *
 * [*] THREE TOKENS ARE DARKENED FROM THEIR SOURCE VALUES, and this is a real
 * departure from "pull unchanged", so it is recorded rather than buried.
 * Re-measuring the inherited ramp against `paper` with the WCAG formula
 * (scripts/audit_contrast.mjs) puts three tokens BELOW the 4.5:1 they are
 * commented as meeting in the source repositories:
 *
 *     slateDim   #6B7684 -> #67717F    4.34 -> 4.65
 *     accentSoft #B4610A -> #AB5C0A    4.24 -> 4.62
 *     signal     #00845F -> #00805C    4.42 -> 4.65
 *
 * Each is nudged the minimum distance that clears 4.5:1 and no further, so the
 * ramp reads identically. Provenance yields to legibility here because a token
 * that fails contrast cannot carry type at all, and Section 7 requires every
 * piece of text to be comfortably legible with unambiguous contrast. The audit
 * runs in CI so this cannot silently regress.
 *
 * ONE PALETTE ADDITION this production needs and its references did not: a
 * cold network-cyan. Stage 5 asks for "clinical, cold, high-contrast ... sharp
 * edge-lighting (cyan, deep blue, stark white)" and the whole Sonicview
 * narrative is an IP-fabric narrative. `net` is that colour, contrast-checked
 * on paper like every other token. It is a signal colour for network paths and
 * packet flow, never a brand mark.
 */

export const PORTRAIT = { width: 1080, height: 1920, fps: 30, seconds: 178 } as const;
export const LANDSCAPE = { width: 1920, height: 1080, fps: 30, seconds: 298 } as const;

export const REEL_FRAMES = PORTRAIT.fps * PORTRAIT.seconds; // 5340
export const PART_FRAMES = LANDSCAPE.fps * LANDSCAPE.seconds; // 8940

export const COLORS = {
  // Light ground — every scene, all six deliverables, no exceptions.
  paper: "#F6F8FA",
  paperLift: "#FDFEFE",
  paperEdge: "#EFF2F6",
  paperWell: "#E7EBF1",

  // Type — contrast ratios measured against `paper`.
  ink: "#0E1116", //  17.9:1
  inkSoft: "#20272F", //  12.6:1
  slate: "#48525F", //   7.45:1 — muted subheadline
  slateDim: "#67717F", //   4.65:1 — micro-labels only, never body   [*]

  // Accents
  accent: "#8A3A12", //   7.32:1 — TASCAM panel amber
  accentSoft: "#AB5C0A", //   4.62:1 — animated spec counters        [*]
  net: "#0B5C7A", //   6.98:1 — network / AoIP paths (Stage 5 cold cyan, darkened to pass on paper)
  netBright: "#12A0CE", // decorative strokes and glows only, never type
  signal: "#00805C", //   4.65:1 — meter green (semantic)            [*]
  signalBright: "#00A67E", // glow / decorative only
  alert: "#B32218", //   6.1:1 — the Problem chapter only (semantic)

  // Signal-path coding for the Stage 6 demonstratives
  pathPrimary: "#0B5C7A", // Dante primary
  pathSecondary: "#8A3A12", // Dante secondary
  pathAnalog: "#48525F", // pre-conversion analog
  pathData: "#00845F", // post-conversion data

  // Structure
  line: "rgba(14,17,22,0.12)",
  lineStrong: "rgba(14,17,22,0.24)",
  shadow: "rgba(14,17,22,0.10)",

  // Screen plates (the VIEW touchscreens rendered as UI, not photographed)
  screen: "#0B1219",
  screenLine: "rgba(255,255,255,0.14)",
  onScreen: "#E8F2F7", //  13.4:1 on `screen`
  onScreenDim: "#8FA6B4", //   5.6:1 on `screen`
} as const;

export const RADII = { card: 28, plate: 20, chip: 999, sm: 12 } as const;

/**
 * PORTRAIT CAPTION-SAFE ZONE — 180 / 220 / 64, unchanged.
 *
 * Text, callouts and demonstratives stay clear of the top 180 px and bottom
 * 220 px, where platform UI sits. Background and ambient imagery MAY extend
 * into those bands.
 *
 * PREBUILD_PLAN §6.2 puts those two otherwise-empty bands to work: they are the
 * home of the constant website / social / WhatsApp marketing layer, and because
 * they sit outside the content box by construction, a reel strip cannot overlap
 * main content even in principle.
 */
export const SAFE = {
  top: 180,
  bottom: 220,
  marginX: 64,
  contentTop: 180,
  contentBottom: PORTRAIT.height - 220, // 1700
  contentH: PORTRAIT.height - 180 - 220, // 1520
  contentW: PORTRAIT.width - 64 * 2, //  952
} as const;

/** Where a strip may sit inside each band, with its own inset off the true edge. */
export const BAND = {
  topY: 58,
  bottomY: PORTRAIT.height - 118, // 1802
  insetX: 56,
  height: 64,
} as const;

/**
 * LANDSCAPE EDGE PADDING — 56 / 52, unchanged. Inboard padding that keeps
 * critical text alive through downstream cropping or re-encode. Ambient and
 * background imagery may still bleed to the true edge.
 *
 * There is NO reserved band here (PREBUILD_PLAN §4.2), which is why landscape
 * marketing placement is computed per scene against real free space rather than
 * dropped into a fixed strip.
 */
export const SPACE = {
  marginX: 56,
  marginY: 52,
  contentW: LANDSCAPE.width - 56 * 2, // 1808
  contentH: LANDSCAPE.height - 52 * 2, //  976
} as const;

export const TIMING = { transition: 14, in: 12, hold: 8, out: 10 } as const;

/** Alpha helper for hex colours. */
export const hexA = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
