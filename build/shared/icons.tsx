/**
 * CHANNEL ICONS — the real artwork supplied in this repository.
 *
 * §2.2 of the build instruction is explicit: every website, social and WhatsApp
 * appearance must pair its text with "its corresponding real icon asset from the
 * repository, not a generic or invented icon". So these are the supplied files,
 * rendered as images.
 *
 * That is a deliberate DEPARTURE from the TASCAM Recording Series production,
 * which redrew the same five marks as inline SVG. Redrawn marks scale perfectly
 * and carry no matte, which is why that build chose them — but they are, by
 * definition, invented icons, which is exactly what this instruction rules out.
 * The supplied files win.
 *
 * Two of the five needed repair before they could be used at all; that work is
 * in scripts/prep_brand.py, and these components consume its output from
 * public/icon/ rather than the raw files:
 *
 *   WEBSITE ICON.png shipped a transparency CHECKERBOARD baked into its pixels
 *   (RGB, no alpha, 18% at (220,222,223) and 16% at (253,253,253) in a grid).
 *   Used raw it puts a grey checked square behind the website line at every one
 *   of its ~150 appearances. It is keyed to alpha.
 *
 *   The prepared website mark is line art rather than a coloured logo, so it
 *   should read as part of the typography rather than as a foreign pure black
 *   beside #0E1116 text. prep_brand.py recolours it to COLORS.ink while keying,
 *   where the value is exact — rather than approximating it here with a CSS
 *   filter chain that would have to be re-tuned for any palette change.
 *
 * These are the platforms' trademarks, used nominatively: they identify
 * Shivansh Electronics' own presence on each service and nothing more.
 */
import React from "react";
import { Img, staticFile } from "remotion";

import { COLORS } from "./theme.ts";

export type IconKey = "website" | "instagram" | "facebook" | "youtube" | "whatsapp";

const FILE: Record<IconKey, string> = {
  website: "icon/website.png",
  instagram: "icon/instagram.png",
  facebook: "icon/facebook.png",
  youtube: "icon/youtube.png",
  whatsapp: "icon/whatsapp.png",
};

/**
 * True intrinsic aspect (w/h) of each prepared file, so a mark is never
 * distorted and never gets a square box it does not fill. YouTube's is a
 * rounded rectangle, not a disc; the rest are effectively square.
 */
const ASPECT: Record<IconKey, number> = {
  website: 1,
  instagram: 1,
  facebook: 1,
  youtube: 1280 / 897,
  whatsapp: 960 / 962,
};

interface Props {
  icon: IconKey;
  /** Rendered height in px. Width follows the true aspect. */
  size?: number;
  style?: React.CSSProperties;
}

export const ChannelIcon: React.FC<Props> = ({ icon, size = 34, style }) => (
  <Img
    src={staticFile(FILE[icon])}
    alt=""
    style={{
      height: size,
      width: size * ASPECT[icon],
      objectFit: "contain",
      display: "block",
      flexShrink: 0,
      // The four colour marks get a faint lift so their light edges separate
      // from the near-white page. The website mark is already ink-coloured line
      // art and needs no shadow — one on line art reads as a printing fault.
      filter: icon === "website" ? "none" : "drop-shadow(0 1px 2px rgba(14,17,22,0.16))",
      ...style,
    }}
  />
);

/** The ink prep_brand.py bakes into the website mark. Asserted by the audit. */
export const LINE_ICON_INK = COLORS.ink;

export const ICON_KEYS: IconKey[] = ["website", "instagram", "facebook", "youtube", "whatsapp"];
