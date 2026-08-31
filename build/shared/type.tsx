/**
 * TYPOGRAPHIC COMPONENTS — Stage 10's information hierarchy, as components.
 *
 * The brief specifies a strict four-level hierarchy for any technical figure:
 *
 *   1. Macro hardware shot   deep focus on the hardware the data describes
 *   2. Hero typography       large, bold, wide-tracked numerical figure
 *   3. Subtext definition    thin technical monospaced line defining the metric
 *   4. Data block            3-4 bulleted sub-specs, to reward pausing
 *
 * Levels 2-4 live here. Level 1 is media.tsx. Keeping them apart is what lets a
 * scene put the figure over a photograph, over a clip, or over nothing, without
 * three separate implementations of the same hierarchy.
 *
 * Every string that reaches the screen passes through sanitizeGlyphs(), so the
 * U+03BC the research brief uses in "20.8 μs" becomes the U+00B5 the fonts
 * actually contain. Without that the production's most-repeated figure renders
 * as a tofu box.
 */
import React from "react";
import { useCurrentFrame } from "remotion";

import { COLORS } from "./theme.ts";
import { EASE_OUT, ramp, stagger } from "./anim.ts";
import { editorial, headline, micro, sanitizeGlyphs, spec, subhead, subtext } from "./fonts.ts";

const S = sanitizeGlyphs;

interface Timed { at?: number }

/** A word-by-word arrival, so a headline lands like speech rather than a card. */
export const Headline: React.FC<
  Timed & { text: string; size: number; color?: string; weight?: number; align?: "left" | "center" }
> = ({ text, size, color = COLORS.ink, weight = 800, at = 0, align = "left" }) => {
  const f = useCurrentFrame();
  const words = S(text).split(" ");
  return (
    <div style={{ ...headline(size, weight), color, textAlign: align, display: "block" }}>
      {words.map((w, i) => {
        const t = ramp(f, at + stagger(i, 3), 16, EASE_OUT);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: t,
              transform: `translateY(${(1 - t) * 14}px)`,
              marginRight: "0.28em",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** The editorial serif. Problem and Transformation beats only. */
export const Editorial: React.FC<
  Timed & { text: string; size: number; color?: string; align?: "left" | "center" }
> = ({ text, size, color = COLORS.ink, at = 0, align = "left" }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 22, EASE_OUT);
  return (
    <div
      style={{
        ...editorial(size, 600),
        color,
        textAlign: align,
        opacity: t,
        transform: `translateY(${(1 - t) * 12}px)`,
      }}
    >
      {S(text)}
    </div>
  );
};

export const Sub: React.FC<
  Timed & { text: string; size: number; color?: string; align?: "left" | "center"; maxW?: number }
> = ({ text, size, color = COLORS.slate, at = 0, align = "left", maxW }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 18, EASE_OUT);
  return (
    <div
      style={{
        ...subhead(size, 500),
        color,
        textAlign: align,
        maxWidth: maxW,
        opacity: t,
        transform: `translateY(${(1 - t) * 10}px)`,
      }}
    >
      {S(text)}
    </div>
  );
};

export const Micro: React.FC<
  Timed & { text: string; size?: number; color?: string; tracking?: string }
> = ({ text, size = 22, color = COLORS.slateDim, at = 0, tracking = "0.20em" }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 14, EASE_OUT);
  return (
    <div style={{ ...micro(size, 700, tracking), color, opacity: t }}>{S(text)}</div>
  );
};

/**
 * LEVEL 2 + 3 — a hero figure with its defining subtext.
 *
 * The figure uses tabular numerals so an animated counter cannot reflow as
 * digits change, and the subtext is tracked wide enough to sit as a rule under
 * the figure rather than as a second line of prose.
 */
export const HeroFigure: React.FC<
  Timed & {
    figure: string;
    subtext: string;
    size?: number;
    subSize?: number;
    color?: string;
    align?: "left" | "center";
  }
> = ({ figure, subtext: sub, size = 132, subSize = 22, color = COLORS.ink, at = 0, align = "left" }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 20, EASE_OUT);
  const t2 = ramp(f, at + 8, 18, EASE_OUT);
  return (
    <div style={{ textAlign: align }}>
      <div
        style={{
          ...spec(size, 800, "0.02em"),
          color,
          opacity: t,
          transform: `translateY(${(1 - t) * 16}px)`,
          lineHeight: 1.0,
        }}
      >
        {S(figure)}
      </div>
      <div
        style={{
          ...subtext(subSize, 600),
          color: COLORS.slate,
          marginTop: 16,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 8}px)`,
        }}
      >
        {S(sub)}
      </div>
    </div>
  );
};

/**
 * LEVEL 4 — the data block. Stage 10 calls for "a small, transparent digital
 * bounding box containing 3-4 bulleted sub-specs to reward pausing the video".
 *
 * Transparent is the operative word: a hairline rule and generous leading, not
 * a filled card. A filled card on a near-white page becomes a plate, which is
 * the treatment this production removes everywhere else.
 */
export const DataBlock: React.FC<
  Timed & { rows: string[]; width?: number; size?: number }
> = ({ rows, width, size = 23, at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        width,
        borderLeft: `2px solid ${COLORS.lineStrong}`,
        paddingLeft: 20,
        display: "flex",
        flexDirection: "column",
        gap: 11,
      }}
    >
      {rows.map((r, i) => {
        const t = ramp(f, at + stagger(i, 4), 16, EASE_OUT);
        return (
          <div
            key={i}
            style={{
              ...spec(size, 600, "0.06em"),
              color: COLORS.slate,
              opacity: t,
              transform: `translateX(${(1 - t) * -8}px)`,
              whiteSpace: "pre-wrap",
            }}
          >
            {S(r)}
          </div>
        );
      })}
    </div>
  );
};

/** A short rule used to separate a headline from what follows it. */
export const Rule: React.FC<Timed & { width: number; color?: string }> = ({
  width, color = COLORS.lineStrong, at = 0,
}) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 20, EASE_OUT);
  return <div style={{ width: width * t, height: 2, background: color }} />;
};

/**
 * An animated counter that lands on a verified figure.
 *
 * Takes the FINAL STRING and animates only the digits inside it, so units,
 * separators and signs are never invented by the animation — "-128 dBu" counts
 * to -128 and keeps " dBu" throughout, rather than the component trying to
 * assemble a specification out of parts.
 */
export const CountTo: React.FC<
  Timed & { value: string; size: number; color?: string; dur?: number }
> = ({ value, size, color = COLORS.accent, at = 0, dur = 34 }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, dur, EASE_OUT);
  const shown = S(value).replace(/\d+(\.\d+)?/g, (m) => {
    const target = parseFloat(m);
    const dp = m.includes(".") ? m.split(".")[1].length : 0;
    return (target * t).toFixed(dp);
  });
  return <div style={{ ...spec(size, 800, "0.02em"), color, lineHeight: 1 }}>{shown}</div>;
};
