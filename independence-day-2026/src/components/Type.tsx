import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, Ground, inkDimFor, inkFor, inkSoftFor} from '../lib/theme';
import {pop, ramp, stag} from '../lib/anim';

/**
 * Type system. The structural hierarchy is the one proven on the Sonicview and
 * MOTU reels — display / kicker / sub / spec / micro, with the same weight and
 * tracking relationships — but the faces are re-chosen for the subject:
 * Playfair Display carries the headlines where a condensed industrial grotesque
 * would read as a product spec sheet.
 *
 *   Display -> the headline claim            (Playfair 700/900)
 *   Kicker  -> small all-caps eyebrow        (Inter 600, wide tracking)
 *   Sub     -> the line that explains it     (Inter 400, optional italic)
 *   Spec    -> figures, dates, counts        (JetBrains Mono 500)
 *   Micro   -> attached labels on artwork    (JetBrains Mono 500, small)
 */

/** Soft halo used only where type sits over busy artwork. */
export const liftFor = (g: Ground): string =>
  g === 'night'
    ? '0 2px 26px rgba(6,10,32,0.92), 0 1px 2px rgba(6,10,32,0.85)'
    : '0 1px 0 rgba(255,255,255,0.9), 0 2px 20px rgba(255,255,255,0.75)';

export const Display: React.FC<{
  children: React.ReactNode;
  ground: Ground;
  size?: number;
  weight?: 700 | 900;
  color?: string;
  lh?: number;
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  caps?: boolean;
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  ground,
  size = 96,
  weight = 900,
  color,
  lh = 1.0,
  tracking = -0.5,
  align = 'left',
  caps = false,
  lift = false,
  style,
}) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      letterSpacing: tracking,
      color: color ?? inkFor(ground),
      textAlign: align,
      textTransform: caps ? 'uppercase' : 'none',
      whiteSpace: 'pre-line',
      textShadow: lift ? liftFor(ground) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker: React.FC<{
  children: React.ReactNode;
  ground: Ground;
  color?: string;
  size?: number;
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({children, ground, color, size = 22, tracking = 4.2, align = 'left', lift = false, style}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: tracking,
      textTransform: 'uppercase',
      color: color ?? inkDimFor(ground),
      textAlign: align,
      textShadow: lift ? liftFor(ground) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Sub: React.FC<{
  children: React.ReactNode;
  ground: Ground;
  size?: number;
  color?: string;
  weight?: 400 | 600;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  italic?: boolean;
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  ground,
  size = 32,
  color,
  weight = 400,
  lh = 1.42,
  align = 'left',
  italic = false,
  lift = false,
  style,
}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      color: color ?? inkSoftFor(ground),
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      letterSpacing: 0.1,
      whiteSpace: 'pre-line',
      textShadow: lift ? liftFor(ground) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Spec: React.FC<{
  children: React.ReactNode;
  ground: Ground;
  size?: number;
  color?: string;
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({children, ground, size = 26, color, tracking = 1.4, align = 'left', lift = false, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: tracking,
      color: color ?? inkSoftFor(ground),
      textAlign: align,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'pre-line',
      textShadow: lift ? liftFor(ground) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Micro: React.FC<{
  children: React.ReactNode;
  ground: Ground;
  size?: number;
  color?: string;
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({children, ground, size = 17, color, tracking = 3.0, align = 'left', lift = false, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: tracking,
      textTransform: 'uppercase',
      color: color ?? inkDimFor(ground),
      textAlign: align,
      textShadow: lift ? liftFor(ground) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Word-by-word kinetic headline. */
export const KineticLine: React.FC<{
  text: string;
  ground: Ground;
  size?: number;
  color?: string;
  weight?: 700 | 900;
  delay?: number;
  per?: number;
  gap?: number;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  caps?: boolean;
  highlight?: {word: number; color: string}[];
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  ground,
  size = 88,
  color,
  weight = 900,
  delay = 0,
  per = 3.4,
  gap = 18,
  lh = 1.02,
  align = 'left',
  caps = false,
  highlight = [],
  lift = false,
  style,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const hl = new Map(highlight.map((h) => [h.word, h.color]));
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${gap * 0.22}px ${gap}px`,
        justifyContent:
          align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = pop(f, stag(i, per, delay), 15);
        return (
          <span
            key={i}
            style={{
              fontFamily: F.display,
              fontWeight: weight,
              fontSize: size,
              lineHeight: lh,
              letterSpacing: -0.5,
              textTransform: caps ? 'uppercase' : 'none',
              color: hl.get(i) ?? color ?? inkFor(ground),
              display: 'inline-block',
              transform: `translateY(${(1 - s) * 28}px)`,
              opacity: Math.min(1, s * 1.7),
              textShadow: lift ? liftFor(ground) : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Figure that counts up then holds. */
export const CountUp: React.FC<{
  to: number;
  dur: number;
  ground: Ground;
  decimals?: number;
  size?: number;
  color?: string;
  suffix?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({to, dur, ground, decimals = 0, size = 120, color, suffix = '', delay = 0, style}) => {
  const f = useCurrentFrame();
  const v = ramp(f, [delay, delay + dur], [0, to]);
  return (
    <div
      style={{
        fontFamily: F.display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.9,
        color: color ?? inkFor(ground),
        letterSpacing: -1,
        fontVariantNumeric: 'tabular-nums',
        display: 'flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      {v.toFixed(decimals)}
      {suffix ? (
        <span style={{fontSize: size * 0.32, marginLeft: 10, letterSpacing: 0}}>{suffix}</span>
      ) : null}
    </div>
  );
};

/** Thin accent rule. */
export const Rule: React.FC<{
  w?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({w = 96, color = C.saffron, thickness = 4, style}) => (
  <div
    style={{width: w, height: thickness, backgroundColor: color, borderRadius: thickness, ...style}}
  />
);

/** A three-band tricolour rule — the reel's recurring divider. */
export const TricolourRule: React.FC<{w?: number; h?: number; style?: React.CSSProperties}> = ({
  w = 180,
  h = 5,
  style,
}) => (
  <div style={{display: 'flex', width: w, height: h, borderRadius: h, overflow: 'hidden', ...style}}>
    <div style={{flex: 1, backgroundColor: C.saffron}} />
    <div style={{flex: 1, backgroundColor: '#FFFFFF'}} />
    <div style={{flex: 1, backgroundColor: C.green}} />
  </div>
);
