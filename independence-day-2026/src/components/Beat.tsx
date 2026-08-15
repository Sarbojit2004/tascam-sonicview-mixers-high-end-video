import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../lib/anim';

/**
 * One timed sub-beat inside a beat. Steps a beat through several distinct
 * compositions.
 *
 * `to` marks where the sub-beat STARTS fading out, not where it has finished,
 * so it is fully opaque across [from + fade, to] and its fade-out overlaps the
 * next one's fade-in. Treating `to` as the end instead leaves a few frames at
 * every boundary where the outgoing content has reached zero and the incoming
 * one is still under half — a visible dip to the ground colour where the
 * artwork should be. (This is the crossfade bug the Sonicview project hit and
 * fixed; the fix is carried over here rather than rediscovered.)
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

/** Sub-beat that also slides, for whip-style cuts. */
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
  const outP = ramp(f, [to, to + fade], [1, 0]);
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

/**
 * Standard vertical rhythm inside the 936 x 1330 primary safe rect.
 * All values are safe-rect-local (0 = y 250 on the canvas).
 */
export const Y = {
  kicker: 26,
  head: 78,
  headLow: 132,
  art: 372,
  artTall: 320,
  caption: 1052,
  foot: 1216,
} as const;
