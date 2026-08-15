import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, CANVAS, Ground, SAFE, ZONE} from '../lib/theme';
import {rnd} from '../lib/anim';

/**
 * FULL-FRAME GROUND.
 *
 * There is no dead central square: content is composed across the whole
 * 1080x1920 frame and the safe zone is a *placement contract*, not a clip
 * rect. `Stage` paints the beat's ground and gives the ambient strips
 * (0..250 and 1580..1920) a deliberate, slightly deeper tone so the primary
 * area reads as the lit region of the frame — the same treatment the
 * Sonicview reels used, re-derived for two alternating grounds.
 */

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="180" height="180" filter="url(#n)" opacity="0.5"/>
     </svg>`,
  );

/**
 * Faint jaali lattice — the perforated stone screen found across Indian
 * architecture from Gujarat stepwells to Mughal pavilions. Used as a texture
 * only, never as a focal element.
 */
const Jaali: React.FC<{ground: Ground; opacity?: number}> = ({ground, opacity = 1}) => {
  const line = ground === 'night' ? 'rgba(143,168,255,0.16)' : 'rgba(22,17,11,0.10)';
  const cell = 64;
  const pattern =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${cell}" height="${cell}" viewBox="0 0 64 64">
         <g fill="none" stroke="${line}" stroke-width="1.4">
           <path d="M32 2 L62 32 L32 62 L2 32 Z"/>
           <circle cx="32" cy="32" r="13"/>
           <path d="M0 0 L8 8 M64 0 L56 8 M0 64 L8 56 M64 64 L56 56"/>
         </g>
       </svg>`,
    );
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `url("${pattern}")`,
        backgroundSize: `${cell}px ${cell}px`,
        maskImage:
          'radial-gradient(ellipse 80% 56% at 50% 46%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0) 90%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 56% at 50% 46%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0) 90%)',
      }}
    />
  );
};

/**
 * Ambient rails in the top/bottom strips — a slow tricolour thread that gives
 * those zones structure without ever carrying information the viewer must
 * read. This is the "genuinely non-critical content" the strips are for.
 */
const AmbientRails: React.FC<{ground: Ground; opacity?: number}> = ({ground, opacity = 1}) => {
  const f = useCurrentFrame();
  const faint = ground === 'night' ? 'rgba(220,211,194,0.22)' : 'rgba(61,53,41,0.18)';
  const rail = (top: number, dir: number, key: string) => (
    <div key={key} style={{position: 'absolute', left: 0, top, width: CANVAS.w, height: 44}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 21,
          width: CANVAS.w,
          height: 1,
          backgroundColor: faint,
        }}
      />
      {new Array(46).fill(0).map((_, i) => {
        const major = i % 6 === 0;
        const x = ((i * 24 + f * 0.24 * dir) % (CANVAS.w + 48)) - 24;
        const col = i % 3 === 0 ? C.saffron : i % 3 === 1 ? faint : C.green;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: major ? 11 : 16,
              width: major ? 2 : 1,
              height: major ? 20 : 10,
              backgroundColor: major ? col : faint,
              opacity: major ? 0.55 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {rail(ZONE.topAmbientEnd - 92, 1, 'top')}
      {rail(ZONE.bottomAmbientStart + 50, -1, 'bot')}
    </AbsoluteFill>
  );
};

/** Slow-drifting motes confined to the ambient strips. */
const AmbientMotes: React.FC<{ground: Ground; n?: number; opacity?: number}> = ({
  ground,
  n = 30,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const base = ground === 'night' ? C.gold : C.inkDim;
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const sx = rnd(i * 3 + 1);
        const sy = rnd(i * 7 + 5);
        const sp = 0.08 + rnd(i * 11 + 3) * 0.22;
        const inTop = i % 2 === 0;
        const y = inTop
          ? (sy * (ZONE.topAmbientEnd + 40) + f * sp) % (ZONE.topAmbientEnd + 40)
          : ZONE.bottomAmbientStart + ((sy * 300 + f * sp) % 340);
        const s = 2 + rnd(i * 13 + 9) * 3.2;
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
              backgroundColor: i % 4 === 0 ? C.saffron : base,
              opacity: 0.14 + rnd(i * 17) * 0.26,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{
  ground: Ground;
  children: React.ReactNode;
  /** Warm key-light strength over the primary area. */
  wash?: number;
  jaali?: number;
  rails?: number;
  motes?: number;
}> = ({ground, children, wash = 1, jaali = 1, rails = 1, motes = 1}) => {
  const night = ground === 'night';
  return (
    <AbsoluteFill style={{backgroundColor: night ? C.night : C.paper}}>
      {/* vertical base wash — ambient strips sit deeper than the primary area,
          so the safe zone reads as the lit region of the frame */}
      <AbsoluteFill
        style={{
          background: night
            ? `linear-gradient(180deg,
                ${C.nightEdge} 0%, ${C.nightDeep} 8%, ${C.night} 16%,
                ${C.nightHi} 44%, ${C.nightHi} 56%,
                ${C.night} 84%, ${C.nightDeep} 94%, ${C.nightEdge} 100%)`
            : `linear-gradient(180deg,
                ${C.paperEdge} 0%, ${C.paperDeep} 8%, ${C.paper} 16%,
                ${C.paperHi} 44%, ${C.paperHi} 56%,
                ${C.paper} 84%, ${C.paperDeep} 94%, ${C.paperEdge} 100%)`,
        }}
      />
      {/* key light out of the primary area */}
      <AbsoluteFill
        style={{
          opacity: wash,
          background: night
            ? `radial-gradient(ellipse 86% 46% at 50% 43%,
                rgba(255,153,51,0.13) 0%, rgba(143,168,255,0.07) 46%, rgba(0,0,0,0) 80%)`
            : `radial-gradient(ellipse 86% 46% at 50% 43%,
                rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.40) 46%, rgba(255,255,255,0) 80%)`,
        }}
      />
      <Jaali ground={ground} opacity={jaali} />
      <AmbientRails ground={ground} opacity={rails} />
      <AmbientMotes ground={ground} opacity={motes} />
      {/* tricolour breath into the ambient strips — saffron above, green below */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(255,153,51,0.13) 0%, rgba(255,153,51,0) 12%,
            rgba(19,136,8,0) 88%, rgba(19,136,8,0.13) 100%)`,
          pointerEvents: 'none',
        }}
      />
      {children}
      {/* grain last, over content, so vector art and type read as one surface */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '180px 180px',
          opacity: night ? 0.13 : 0.09,
          mixBlendMode: night ? 'overlay' : 'multiply',
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
    style={{position: 'absolute', left: SAFE.x + x, top: SAFE.y + y, width: w, height: h, ...style}}
  >
    {children}
  </div>
);

/** Verification overlay — only ever rendered by the SafeCheck composition. */
export const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: CANVAS.w,
        height: ZONE.topAmbientEnd,
        background: 'rgba(255,0,0,0.18)',
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
        background: 'rgba(255,0,0,0.18)',
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
        background: 'rgba(255,140,0,0.18)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: ZONE.margin,
        height: CANVAS.h,
        background: 'rgba(255,140,0,0.18)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y,
        width: SAFE.w,
        height: SAFE.h,
        border: '2px dashed rgba(0,190,255,0.95)',
      }}
    />
  </AbsoluteFill>
);
