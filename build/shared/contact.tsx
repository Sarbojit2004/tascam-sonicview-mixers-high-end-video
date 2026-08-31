/**
 * THE CONTACT STRIP — the only marketing that appears in the body of a video.
 *
 * A strip is one channel: its real icon from the repository, then its value.
 * Never a logo. The WhatsApp strip always carries all three numbers together on
 * one line behind one mark, in the format §6.1 specifies exactly.
 *
 * MOVEMENT. §6.2 requires the layer to read as "continuously alive and dynamic
 * rather than a static overlay". Strips slide in and out rather than cutting,
 * and — the change from the reference productions — the value's characters
 * arrive on a short per-glyph stagger rather than the block fading as one. That
 * makes the marketing layer move with the same grammar as the headline type,
 * instead of looking like an overlay bolted onto the video.
 *
 * NO PLATE. The strip sits directly on the page like everything else: no card,
 * no pill, no scrim. On the reels it lives in a reserved band where nothing can
 * be behind it. On the parts it is placed only in computed-free space, so
 * nothing needs to be hidden behind a box.
 */
import React from "react";
import { CHANNEL_VALUE, isWide, type ChannelKey } from "./brand.ts";
import { EASE_OUT, ramp } from "./anim.ts";
import { ChannelIcon } from "./icons.tsx";
import { COLORS } from "./theme.ts";
import { sanitizeGlyphs, spec } from "./fonts.ts";
import { BAND, PORTRAIT, SAFE, SPACE } from "./theme.ts";
import { slotRect, type Slot } from "./contactplan.ts";

interface StripProps {
  channel: ChannelKey;
  slot: Slot;
  /** Frames since the strip's own start. */
  frame: number;
  dur: number;
  portrait: boolean;
}

const IN_F = 14;
const OUT_F = 12;

/** Per-glyph arrival. Cheap: one interpolation per character, no layout thrash. */
const Glyphs: React.FC<{ text: string; t: number; style: React.CSSProperties }> = ({
  text, t, style,
}) => (
  <span style={{ ...style, whiteSpace: "pre", display: "inline-block" }}>
    {text.split("").map((c, i) => {
      // The stagger spans the first 65% of the entry so the last glyph still
      // lands well before the strip is fully seated.
      const p = Math.min(1, Math.max(0, (t - (i / Math.max(1, text.length)) * 0.65) / 0.35));
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: p,
            transform: `translateY(${(1 - p) * 6}px)`,
          }}
        >
          {c === " " ? " " : c}
        </span>
      );
    })}
  </span>
);

export const ContactStrip: React.FC<StripProps> = ({ channel, slot, frame, dur, portrait }) => {
  const wide = isWide(channel);
  const value = sanitizeGlyphs(CHANNEL_VALUE[channel]);

  const inT = ramp(frame, 0, IN_F, EASE_OUT);
  const outT = 1 - ramp(frame, dur - OUT_F, OUT_F, EASE_OUT);
  const vis = Math.min(inT, outT);
  if (vis <= 0.001) return null;

  const iconSize = portrait ? (wide ? 34 : 38) : wide ? 30 : 34;
  const fontSize = portrait ? (wide ? 25 : 29) : wide ? 23 : 26;

  // Slide direction follows the slot, so a strip enters from the nearest edge
  // and never crosses the frame.
  const fromRight = slot.endsWith("right") || slot === "tr" || slot === "br" || slot === "cr";
  const dx = (1 - inT) * (fromRight ? 26 : -26);

  const pos: React.CSSProperties = portrait
    ? (() => {
        const top = slot.startsWith("band-top");
        const align = slot.endsWith("left") ? "flex-start"
          : slot.endsWith("right") ? "flex-end" : "center";
        return {
          position: "absolute",
          left: BAND.insetX,
          right: BAND.insetX,
          [top ? "top" : "bottom"]: top ? BAND.topY : PORTRAIT.height - BAND.bottomY,
          display: "flex",
          justifyContent: align,
        };
      })()
    : (() => {
        const r = slotRect(slot, wide);
        return {
          position: "absolute",
          left: r.x,
          top: r.y,
          width: r.w,
          height: r.h,
          display: "flex",
          justifyContent: slot.endsWith("r") ? "flex-end" : slot.endsWith("l") ? "flex-start" : "center",
          alignItems: "center",
        };
      })();

  return (
    <div style={pos}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: portrait ? 16 : 14,
          opacity: vis,
          transform: `translateX(${dx}px)`,
        }}
      >
        <ChannelIcon icon={channel} size={iconSize} style={{ opacity: inT }} />
        <Glyphs
          text={value}
          t={inT}
          style={{
            ...spec(fontSize, 600, wide ? "0.045em" : "0.055em"),
            color: COLORS.inkSoft,
          }}
        />
      </div>
    </div>
  );
};

/** Rect a portrait strip occupies, for the collision audit. */
export const portraitStripRect = (top: boolean) => ({
  x: BAND.insetX,
  y: top ? BAND.topY : BAND.bottomY,
  w: PORTRAIT.width - BAND.insetX * 2,
  h: BAND.height,
});

/** The content box a reel scene may use. Strips are outside it by construction. */
export const REEL_CONTENT = {
  x: SAFE.marginX,
  y: SAFE.contentTop,
  w: SAFE.contentW,
  h: SAFE.contentH,
};

/** The inset box a part scene keeps critical content inside. */
export const PART_CONTENT = {
  x: SPACE.marginX,
  y: SPACE.marginY,
  w: SPACE.contentW,
  h: SPACE.contentH,
};
