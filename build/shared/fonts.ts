/**
 * TYPE SYSTEM — pulled from the MOTU M-Series repository (PREBUILD_PLAN §1).
 *
 * Families, weights, the size-helper hierarchy and the ARCHIVO/FRAUNCES balance
 * are unchanged from `portrait/src/fonts.ts` and `longform/src/fonts.ts` there,
 * which is the same system the TASCAM Recording Series production ported. The
 * four woff2 faces are copied byte-for-byte from that repository's
 * `_shared/fonts/`.
 *
 * THE BALANCE, unchanged: ARCHIVO (technical grotesque) carries the weight —
 * uppercase tracked headlines, spec callouts with tabular numerals, micro
 * callouts. FRAUNCES (editorial serif) is held back for the genuinely editorial
 * moments. For Sonicview that is a narrower set than the MOTU builds used:
 * Stage 9 asks for "rigorous clinical precision, sounding like a senior systems
 * architect addressing professional engineering peers", so the serif appears
 * only in the Problem beat and the single Transformation beat of each
 * deliverable, and nowhere near a specification figure.
 *
 * ─── GLYPH SAFETY ────────────────────────────────────────────────────────────
 *
 * The shipped latin subsets carry 230 (Archivo) and 222 (Fraunces) codepoints.
 * Verified absent from BOTH: U+03BC GREEK SMALL LETTER MU, U+03A9 OHM,
 * U+2265 GTE, U+2264 LTE, U+2192 RIGHT ARROW.
 *
 * U+03BC is the dangerous one. The research brief writes its own hero anchor as
 * "20.8 μs" using U+03BC, four times — and U+03BC is NOT in these fonts, while
 * the visually identical U+00B5 MICRO SIGN IS. Transcribing the brief verbatim
 * would render the single most-repeated figure in the production as tofu.
 *
 * `mu` below is the correct character, and `sanitizeGlyphs()` rewrites U+03BC
 * to U+00B5 on the way to the screen. scripts/check_glyphs.mjs walks every
 * rendered string in all six deliverables and fails the build on any codepoint
 * the shipped files do not contain, so this cannot regress into a render.
 */
import type React from "react";
import { staticFile } from "remotion";

export const DISPLAY = "Fraunces";
export const LABEL = "Archivo";

/** U+00B5 MICRO SIGN — the one that exists in these fonts. Never U+03BC. */
export const MU = "µ";

/** Codepoints absent from the shipped subsets, with their safe replacements. */
export const GLYPH_SUBSTITUTIONS: Record<string, string> = {
  "μ": "µ", // GREEK SMALL LETTER MU -> MICRO SIGN
  "Ω": "ohm",
  "≥": ">=",
  "≤": "<=",
  "→": "->", // prefer a drawn arrow; this is the text fallback
};

/** Applied by every text component before render. Idempotent. */
export const sanitizeGlyphs = (s: string): string => {
  let out = s;
  for (const [bad, good] of Object.entries(GLYPH_SUBSTITUTIONS)) out = out.split(bad).join(good);
  return out;
};

export const FONT_FACE_CSS = `
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-normal.woff2")}') format('woff2');
  font-weight: 100 900; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-italic.woff2")}') format('woff2');
  font-weight: 100 900; font-style: italic; font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-normal.woff2")}') format('woff2');
  font-weight: 100 900; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-italic.woff2")}') format('woff2');
  font-weight: 100 900; font-style: italic; font-display: block;
}
`;

export async function loadFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const probes = [
    "400 32px Archivo", "500 32px Archivo", "600 32px Archivo",
    "700 32px Archivo", "800 32px Archivo", "900 32px Archivo",
    "400 32px Fraunces", "600 32px Fraunces", "700 32px Fraunces",
    "italic 500 32px Fraunces",
  ];
  await Promise.all(probes.map((p) => (document as Document).fonts.load(p)));
  await (document as Document).fonts.ready;
}

/** Headline: bold, dominant, uppercase tracking to project authority. */
export const headline = (size: number, weight = 800): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: "-0.015em",
  textTransform: "uppercase",
});

/** Subheadline: medium weight, muted slate, contextual not competing. */
export const subhead = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.28,
  letterSpacing: "0.002em",
});

/**
 * Specification callout: distinctly tracked, tabular numerals so animated
 * counters do not reflow as digits change.
 */
export const spec = (size: number, weight = 700, tracking = "0.10em"): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: tracking,
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum" 1',
});

/** Micro callout: small, highly legible, medium weight. */
export const micro = (size: number, weight = 600, tracking = "0.16em"): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: tracking,
  textTransform: "uppercase",
});

/** Editorial serif — Problem and Transformation beats only. */
export const editorial = (size: number, weight = 600): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.06,
  letterSpacing: "-0.02em",
});

/**
 * Stage 10's "thin, technical monospaced font defining the metric immediately
 * below the hero text". No monospace face ships with this build, so the
 * monospaced READING is produced from Archivo with tabular numerals and wide
 * tracking, which is what the hierarchy actually needs — even column rhythm
 * under a hero figure — without adding a fifth font file.
 */
export const subtext = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum" 1',
});
