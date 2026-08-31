/**
 * THE PAGE. Light ground, fonts loaded, contact layer composited on top.
 *
 * Every deliverable renders through this so the ground colour, the font
 * activation and the marketing layer are identical across all six and cannot
 * drift apart per project.
 */
import React from "react";
import {
  AbsoluteFill, Sequence, continueRender, delayRender, useCurrentFrame,
} from "remotion";

import { COLORS } from "./theme.ts";
import { FONT_FACE_CSS, loadFonts } from "./fonts.ts";
import { ContactStrip } from "./contact.tsx";
import type { StripAppearance } from "./contactplan.ts";
import { frames, starts, type Beat } from "./beat.ts";

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    loadFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <style>{FONT_FACE_CSS}</style>
      {children}
    </AbsoluteFill>
  );
};

/**
 * The marketing layer, composited above the scenes.
 *
 * Each appearance is its own Sequence so a strip's `useCurrentFrame` is
 * relative to its own start — which is what lets the per-glyph stagger and the
 * slide be written in local time rather than absolute frames.
 */
export const ContactLayer: React.FC<{
  plan: StripAppearance[];
  beats: Beat[];
  portrait: boolean;
}> = ({ plan, beats, portrait }) => {
  const s = starts(beats);
  const index: Record<string, number> = {};
  beats.forEach((b, i) => { index[b.id] = s[i]; });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {plan.map((a, i) => {
        const from = (index[a.beat] ?? 0) + a.at;
        return (
          <Sequence key={`${a.beat}-${i}`} from={from} durationInFrames={a.dur} layout="none">
            <StripFrame appearance={a} portrait={portrait} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const StripFrame: React.FC<{ appearance: StripAppearance; portrait: boolean }> = ({
  appearance, portrait,
}) => {
  const frame = useCurrentFrame();
  return (
    <ContactStrip
      channel={appearance.channel}
      slot={appearance.slot}
      frame={frame}
      dur={appearance.dur}
      portrait={portrait}
    />
  );
};

/** Renders a beat list as consecutive Sequences. */
export const Timeline: React.FC<{
  beats: Beat[];
  render: (beat: Beat, index: number) => React.ReactNode;
}> = ({ beats, render }) => {
  const s = starts(beats);
  return (
    <>
      {beats.map((b, i) => (
        <Sequence key={b.id} from={s[i]} durationInFrames={frames(b.sec)} layout="none">
          {render(b, i)}
        </Sequence>
      ))}
    </>
  );
};
