import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../lib/anim';

/**
 * One timed beat inside a scene. Beats step a scene through several distinct
 * compositions — the mechanism behind the wide-transition editing this format
 * needs to carry 74 assets through 88 seconds.
 *
 * `to` marks where the beat STARTS fading out, not where it has finished, so
 * the beat is fully opaque across the whole [from + fade, to] window and its
 * fade-out overlaps the next beat's fade-in. Treating `to` as the end instead
 * left a few frames at every boundary where the outgoing beat had reached zero
 * and the incoming one was still under half — a visible white gap where the
 * hero image should be. The last beat in a scene passes `to = dur`, so it
 * holds to the end and then dissolves through the scene overlap into the next
 * scene, which is exactly the wanted behaviour.
 */
export const B: React.FC<{
  from: number;
  to: number;
  fade?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({from, to, fade = 12, children, style}) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, [from, from + fade], [0, 1]), ramp(f, [to, to + fade], [1, 0]));
  if (o <= 0.002) return null;
  return <AbsoluteFill style={{opacity: o, ...style}}>{children}</AbsoluteFill>;
};

/** Beat that also slides, for whip-style cuts. */
export const BSlide: React.FC<{
  from: number;
  to: number;
  fade?: number;
  dx?: number;
  dy?: number;
  children: React.ReactNode;
}> = ({from, to, fade = 10, dx = 0, dy = 0, children}) => {
  const f = useCurrentFrame();
  const inP = ramp(f, [from, from + fade], [0, 1]);
  const outP = ramp(f, [to - fade, to], [1, 0]);
  const o = Math.min(inP, outP);
  if (o <= 0.002) return null;
  const x = (1 - inP) * dx - (1 - outP) * dx * 0.5;
  const y = (1 - inP) * dy - (1 - outP) * dy * 0.5;
  return (
    <AbsoluteFill style={{opacity: o, transform: `translate3d(${x}px, ${y}px, 0)`}}>
      {children}
    </AbsoluteFill>
  );
};

/** Standard vertical rhythm inside the 936 x 1330 primary safe rect. */
export const Y = {
  mark: 4,
  kicker: 64,
  head: 100,
  media: 344,
  mediaTall: 300,
  spec: 1006,
  strip: 1274,
} as const;
