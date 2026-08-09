import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {C, CANVAS, SAFE, ZONE, Part, accent} from '../lib/theme';
import {A} from '../lib/images';
import {rnd} from '../lib/anim';

/**
 * FULL-FRAME LIGHT GROUND.
 *
 * Unlike the MOTU reel this project's type system comes from, there is no dead
 * central square: content is composed across the whole 1080x1920 frame and the
 * safe zone is a *placement contract*, not a clip rect. `Stage` paints the
 * light environment the dark Sonicview chassis reads against, and gives the
 * ambient strips (0..250 and 1580..1920) a deliberate, slightly recessed tone
 * so the primary area reads as the lit region of a clean engineering space.
 */

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="180" height="180" filter="url(#n)" opacity="0.5"/>
     </svg>`,
  );

/** Faint schematic grid — engineering-drawing texture, never a focal element. */
const Grid: React.FC<{opacity?: number}> = ({opacity = 0.5}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: '72px 72px',
      maskImage:
        'radial-gradient(ellipse 78% 54% at 50% 47%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0) 88%)',
      WebkitMaskImage:
        'radial-gradient(ellipse 78% 54% at 50% 47%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0) 88%)',
    }}
  />
);

/**
 * Blurred extension of a hero asset into the ambient strips. Masked to be
 * fully present only above y=250 and below y=1580, so it can never compete
 * with the primary content — exactly the "non-critical ambient fill" the
 * top/bottom zones are reserved for.
 */
export const AmbientPhoto: React.FC<{
  id: number;
  opacity?: number;
  blur?: number;
  scale?: number;
  drift?: number;
}> = ({id, opacity = 0.62, blur = 38, scale = 1.34, drift = 1}) => {
  const f = useCurrentFrame();
  // Present enough to genuinely FILL the ambient strips — this is the
  // "non-critical content" the top and bottom zones are reserved for, so a
  // barely-visible wash would leave them dead. The mask keeps it entirely out
  // of the primary safe area, where it would otherwise compete with content.
  const mask =
    `linear-gradient(180deg,
      rgba(0,0,0,1) 0px,
      rgba(0,0,0,1) ${ZONE.topAmbientEnd - 150}px,
      rgba(0,0,0,0) ${ZONE.topAmbientEnd + 76}px,
      rgba(0,0,0,0) ${ZONE.bottomAmbientStart - 76}px,
      rgba(0,0,0,1) ${ZONE.bottomAmbientStart + 150}px,
      rgba(0,0,0,1) ${CANVAS.h}px)`;
  return (
    <AbsoluteFill style={{maskImage: mask, WebkitMaskImage: mask, overflow: 'hidden'}}>
      <Img
        src={A(id)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `blur(${blur}px) saturate(0.72) brightness(1.06) contrast(0.94)`,
          transform: `scale(${scale}) translateY(${drift * f * 0.03}px)`,
          opacity,
          display: 'block',
        }}
      />
      <AbsoluteFill style={{backgroundColor: 'rgba(241,244,248,0.20)'}} />
    </AbsoluteFill>
  );
};

/**
 * Faint measurement rails in the ambient strips — engineering-drawing texture
 * that gives the top and bottom zones structure without ever carrying
 * information the viewer needs to read.
 */
export const AmbientRails: React.FC<{part: Part; opacity?: number}> = ({part, opacity = 0.5}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const rail = (top: number, dir: number) => (
    <div style={{position: 'absolute', left: 0, top, width: CANVAS.w, height: 46}}>
      <div style={{position: 'absolute', left: 0, top: 22, width: CANVAS.w, height: 1, backgroundColor: C.line}} />
      {new Array(45).fill(0).map((_, i) => {
        const major = i % 5 === 0;
        const x = ((i * 24 + f * 0.28 * dir) % (CANVAS.w + 48)) - 24;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: major ? 12 : 17,
              width: major ? 2 : 1,
              height: major ? 20 : 10,
              backgroundColor: major ? a : C.line,
              opacity: major ? 0.42 : 0.6,
            }}
          />
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {rail(ZONE.topAmbientEnd - 96, 1)}
      {rail(ZONE.bottomAmbientStart + 52, -1)}
    </AbsoluteFill>
  );
};

/** Slow-drifting technical particles — ambient motion, no information. */
export const AmbientMotes: React.FC<{part: Part; n?: number; opacity?: number}> = ({
  part,
  n = 26,
  opacity = 0.5,
}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  return (
    <AbsoluteFill style={{opacity}}>
      {new Array(n).fill(0).map((_, i) => {
        const sx = rnd(i * 3 + 1);
        const sy = rnd(i * 7 + 5);
        const sp = 0.10 + rnd(i * 11 + 3) * 0.26;
        const inTop = i % 2 === 0;
        const band = inTop ? ZONE.topAmbientEnd : CANVAS.h - (CANVAS.h - ZONE.bottomAmbientStart);
        const y = inTop
          ? (sy * (ZONE.topAmbientEnd + 40) + f * sp) % (ZONE.topAmbientEnd + 40)
          : band + ((sy * 300 + f * sp) % 340);
        const s = 2 + rnd(i * 13 + 9) * 3.4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx * CANVAS.w,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              backgroundColor: i % 3 === 0 ? a : C.inkDim,
              opacity: 0.16 + rnd(i * 17) * 0.24,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{part: Part; children: React.ReactNode; wash?: number}> = ({
  part,
  children,
  wash = 1,
}) => {
  const a = accent(part);
  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      {/* vertical base wash — ambient strips sit slightly deeper than the
          primary area, so the safe zone reads as the lit region */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            ${C.paperEdge} 0%, ${C.paperDeep} 7%, ${C.paper} 15%,
            ${C.paperHi} 44%, ${C.paperHi} 56%,
            ${C.paper} 84%, ${C.paperDeep} 94%, ${C.paperEdge} 100%)`,
        }}
      />
      {/* key light out of the primary area */}
      <AbsoluteFill
        style={{
          opacity: wash,
          background: `radial-gradient(ellipse 84% 44% at 50% 44%,
            rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.42) 44%, rgba(255,255,255,0) 78%)`,
        }}
      />
      {/* faint accent tint so each part has its own light temperature */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 66% 34% at 50% 40%, ${a}0F 0%, ${a}00 72%)`,
        }}
      />
      <Grid />
      {/* ambient strips get their own structure so they never read as dead
          space — content still never enters them */}
      <AmbientRails part={part} opacity={0.55} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            ${a}12 0%, ${a}00 13%,
            ${a}00 87%, ${a}12 100%)`,
          pointerEvents: 'none',
        }}
      />
      {children}
      {/* grain last so it sits over content, unifying photo and vector */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '180px 180px',
          opacity: 0.10,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/** Positions a box inside the primary safe rect using 0..1 fractions. */
export const Safe: React.FC<{
  l?: number;
  t?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({l = 0, t = 0, w = 1, h, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.x + l * SAFE.w,
      top: SAFE.y + t * SAFE.h,
      width: w * SAFE.w,
      height: h === undefined ? undefined : h * SAFE.h,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Absolute placement in safe-rect pixel coordinates (0..936 x 0..1330). */
export const At: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = 0, y = 0, w, h, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.x + x,
      top: SAFE.y + y,
      width: w,
      height: h,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Verification overlay — never rendered in a delivered composition. */
export const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: CANVAS.w,
        height: ZONE.topAmbientEnd,
        background: 'rgba(255,0,0,0.16)',
        borderBottom: '2px solid rgba(255,0,0,0.9)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: ZONE.bottomAmbientStart,
        width: CANVAS.w,
        height: CANVAS.h - ZONE.bottomAmbientStart,
        background: 'rgba(255,0,0,0.16)',
        borderTop: '2px solid rgba(255,0,0,0.9)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: ZONE.margin,
        height: CANVAS.h,
        background: 'rgba(255,140,0,0.16)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: ZONE.margin,
        height: CANVAS.h,
        background: 'rgba(255,140,0,0.16)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y,
        width: SAFE.w,
        height: SAFE.h,
        border: '2px dashed rgba(0,140,255,0.95)',
      }}
    />
  </AbsoluteFill>
);
