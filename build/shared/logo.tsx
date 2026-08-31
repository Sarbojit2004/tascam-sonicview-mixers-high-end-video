/**
 * A LOGO PLACED DIRECTLY ON SCREEN — no box, card or plate.
 *
 * ═══ WHERE THESE MAY APPEAR ═══════════════════════════════════════════════
 *
 * ON END SCREENS, AND NOWHERE ELSE. Not as a corner watermark, not as a
 * repositioning element, not boxed and not unboxed — nowhere in the main body
 * of any of the six deliverables. §6.1 calls this an absolute prohibition
 * rather than a frequency reduction, and it is the single most load-bearing
 * rule in this build.
 *
 * The body carries contact strips instead (contact.tsx), deliberately more
 * frequently than any prior production in this pipeline. That substitution is
 * the point: the marks used to be sprinkled through the running video, where
 * they collided with the pictures and copy beside them and crowded out the
 * contact details a viewer can actually act on.
 *
 * This is enforced, not merely documented. `scripts/audit_branding.mjs` fails
 * the build if any scene module other than an outro imports this file or
 * references `logo/`. A rule that depends on remembering it is not a rule.
 *
 * ═══ THE PLATE, AND WHY IT COMES OFF ══════════════════════════════════════
 *
 * Both supplied files carry an opaque white plate behind the artwork, and both
 * are stripped by scripts/prep_brand.py before they get here. The Shivansh file
 * is the obvious case at 97.9% opaque. The TASCAM file is the instructive one:
 * at 53.7% opaque it LOOKED plate-free, but that figure describes the bounding
 * box, and 58.4% of its opaque pixels are near-white — the wordmark sits on a
 * white pill inside a transparent margin. On #F6F8FA that pill is plainly
 * visible. An opacity percentage cannot tell you whether a mark is boxed.
 *
 * The ARTWORK is untouched in both cases — globe, wordmarks, tagline and the
 * trademark glyph all survive. What is removed is only the rectangle behind
 * them.
 *
 * LEGIBILITY WITHOUT A BOX. Both marks are near-black on a near-white ground,
 * so contrast is not the risk; separation is. Each gets a faint drop-shadow.
 * A shadow is not a box: no edge, no fill, just the artwork lifted off the page.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";

import { EASE_OUT, ramp } from "./anim.ts";

export type BrandKey = "shivansh" | "tascam";

const SRC: Record<BrandKey, string> = {
  shivansh: "logo/shivansh.png",
  tascam: "logo/tascam.png",
};

/**
 * True aspect (w/h) of the plate-stripped, margin-cropped artwork — MEASURED
 * from the prepared files, not taken from the source dimensions.
 *
 * This is not a formality. Both source files are 2372x714 (3.32:1), but the
 * artwork inside them fills very different fractions of that canvas. Laying the
 * TASCAM mark out from its file aspect would stretch the wordmark vertically by
 * 1.84x. prep_brand.py crops each file to its own artwork so these numbers and
 * the pixels agree.
 */
const ASPECT: Record<BrandKey, number> = {
  shivansh: 2322 / 664, // 3.497
  tascam: 2143 / 350, // 6.123
};

/**
 * Optical balance on the end screen — set by rendering the card and looking at
 * it, not by arithmetic.
 *
 * The two marks have very different construction. Shivansh is a stacked lockup:
 * a globe, two lines of wordmark and a small tagline, so most of its height is
 * spent on detail that reads small. TASCAM is a single line of heavy caps, where
 * every pixel of height is letterform. Sizing both to the same height made the
 * TASCAM wordmark dominate the card and read as the primary brand, which is the
 * wrong emphasis for a Shivansh Electronics end screen.
 *
 * 0.42 brings TASCAM's cap-height into line with the Shivansh wordmark's, which
 * is the pairing that actually reads as balanced.
 */
export const OPTICAL_HEIGHT: Record<BrandKey, number> = {
  shivansh: 1.0,
  tascam: 0.42,
};

interface Props {
  brand: BrandKey;
  /** Rendered height in px. Width follows the true aspect. */
  height: number;
  /** Frame, within the outro, at which this mark seats. */
  at?: number;
  style?: React.CSSProperties;
}

/**
 * A mark seating onto the end screen. Rises a few px and settles; it does not
 * scale, because a scaling logo reads as an advertisement and this is a
 * closing card on a technical briefing.
 */
export const BrandMark: React.FC<Props> = ({ brand, height, at = 0, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, at, 18, EASE_OUT);
  return (
    <Img
      src={staticFile(SRC[brand])}
      alt=""
      style={{
        height,
        width: height * ASPECT[brand],
        objectFit: "contain",
        display: "block",
        opacity: t,
        transform: `translateY(${(1 - t) * 10}px)`,
        // A shadow, not a box: no edge, no fill.
        filter: "drop-shadow(0 2px 6px rgba(14,17,22,0.14))",
        ...style,
      }}
    />
  );
};
