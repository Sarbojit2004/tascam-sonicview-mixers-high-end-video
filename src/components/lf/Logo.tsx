import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {LF_SAFE} from '../../lib/lf-theme';
import {ramp} from '../../lib/anim';

/**
 * The three brand logos, shown DIRECTLY on the light background.
 *
 * The long-form format requires that a logo never appear "enclosed in a white
 * box, card, or plate". All three source assets ship with a white plate baked
 * in — TASCAM is a black wordmark inside a white pill, Shivansh is artwork
 * inside a white rounded rectangle, and the Dante file is a JPEG on a white
 * square — so scripts/prep_logos.py keys that plate out of the asset itself
 * (multiply un-premultiply) and writes cropped, transparent PNGs to
 * public/logo. This component just places those marks; it never draws a
 * backing shape of any kind.
 *
 * Logos are sized by HEIGHT, since the three marks have very different aspect
 * ratios and matching their cap-height is what makes them read as equals.
 */

export type Brand = 'tascam' | 'shivansh' | 'dante';

/** Intrinsic aspect ratios of the keyed marks (width / height). */
const AR: Record<Brand, number> = {
  tascam: 2155 / 362,
  shivansh: 2334 / 676,
  dante: 1175 / 281,
};

export const logoWidth = (brand: Brand, h: number): number => h * AR[brand];

export const Logo: React.FC<{
  brand: Brand;
  h: number;
  x?: number;
  y?: number;
  opacity?: number;
  align?: 'left' | 'right' | 'center';
  style?: React.CSSProperties;
}> = ({brand, h, x = 0, y = 0, opacity = 1, align = 'left', style}) => {
  const w = logoWidth(brand, h);
  const left =
    align === 'left'
      ? LF_SAFE.x + x
      : align === 'right'
        ? LF_SAFE.x + LF_SAFE.w - w - x
        : LF_SAFE.x + (LF_SAFE.w - w) / 2 + x;
  return (
    <Img
      src={staticFile(`logo/${brand}.png`)}
      style={{
        position: 'absolute',
        left,
        top: LF_SAFE.y + y,
        width: w,
        height: h,
        opacity,
        display: 'block',
        ...style,
      }}
    />
  );
};

/** Logo that fades in, holds, and fades out within a beat. */
export const LogoBeat: React.FC<{
  brand: Brand;
  h: number;
  x?: number;
  y?: number;
  from: number;
  to: number;
  fade?: number;
  align?: 'left' | 'right' | 'center';
  rise?: number;
  maxOpacity?: number;
}> = ({brand, h, x = 0, y = 0, from, to, fade = 14, align = 'left', rise = 10, maxOpacity = 1}) => {
  const f = useCurrentFrame();
  const inP = ramp(f, [from, from + fade], [0, 1]);
  const o = Math.min(inP, ramp(f, [to, to + fade], [1, 0]));
  if (o <= 0.002) return null;
  return (
    <Logo
      brand={brand}
      h={h}
      x={x}
      y={y}
      align={align}
      opacity={o * maxOpacity}
      style={{transform: `translateY(${(1 - inP) * rise}px)`}}
    />
  );
};
