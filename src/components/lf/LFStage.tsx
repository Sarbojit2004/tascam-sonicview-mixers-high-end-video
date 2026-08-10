import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {C, LF_CANVAS, LF_SAFE, LFPart, lfAccent} from '../../lib/lf-theme';
import {A} from '../../lib/images';
import {rnd} from '../../lib/anim';

/**
 * The light landscape ground.
 *
 * Same palette and same clinical register as the reel series, re-laid for
 * 1920x1080. Content may occupy the whole frame; the only placement rule is
 * the 52px side inset for anything critical, which `At` and `Col` honour.
 */

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="200" height="200" filter="url(#n)" opacity="0.5"/>
     </svg>`,
  );

const Grid: React.FC<{opacity?: number}> = ({opacity = 0.45}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
      maskImage:
        'radial-gradient(ellipse 74% 74% at 50% 48%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0) 92%)',
      WebkitMaskImage:
        'radial-gradient(ellipse 74% 74% at 50% 48%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0) 92%)',
    }}
  />
);

/** Blurred, desaturated fill behind a composed layout. Runs to the true edge. */
export const LFBackdrop: React.FC<{
  id: number;
  opacity?: number;
  blur?: number;
  scale?: number;
  drift?: number;
}> = ({id, opacity = 0.26, blur = 54, scale = 1.24, drift = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={A(id)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `blur(${blur}px) saturate(0.6) brightness(1.16)`,
          transform: `scale(${scale}) translateX(${drift * f * 0.02}px)`,
          opacity,
          display: 'block',
        }}
      />
      <AbsoluteFill style={{backgroundColor: 'rgba(241,244,248,0.46)'}} />
    </AbsoluteFill>
  );
};

/** Slow drifting motes along the top and bottom bands. Ambient only. */
export const LFMotes: React.FC<{part: LFPart; n?: number; opacity?: number}> = ({
  part,
  n = 30,
  opacity = 0.5,
}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const sx = rnd(i * 3 + 1);
        const sy = rnd(i * 7 + 5);
        const sp = 0.12 + rnd(i * 11 + 3) * 0.3;
        const x = (sx * LF_CANVAS.w + f * sp) % LF_CANVAS.w;
        const y = sy * LF_CANVAS.h;
        const s = 2 + rnd(i * 13 + 9) * 3.2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              backgroundColor: i % 3 === 0 ? a : C.inkDim,
              opacity: 0.10 + rnd(i * 17) * 0.18,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Faint measurement rail — engineering-drawing texture along an edge. */
export const LFRail: React.FC<{part: LFPart; y: number; dir?: number; opacity?: number}> = ({
  part,
  y,
  dir = 1,
  opacity = 0.5,
}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: LF_CANVAS.w,
        height: 40,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{position: 'absolute', left: 0, top: 19, width: LF_CANVAS.w, height: 1, backgroundColor: C.line}}
      />
      {new Array(70).fill(0).map((_, i) => {
        const major = i % 5 === 0;
        const x = ((i * 28 + f * 0.26 * dir) % (LF_CANVAS.w + 56)) - 28;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: major ? 10 : 15,
              width: major ? 2 : 1,
              height: major ? 18 : 9,
              backgroundColor: major ? a : C.line,
              opacity: major ? 0.4 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
};

export const LFStage: React.FC<{
  part: LFPart;
  children: React.ReactNode;
  wash?: number;
  rails?: boolean;
}> = ({part, children, wash = 1, rails = true}) => {
  const a = lfAccent(part);
  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            ${C.paperDeep} 0%, ${C.paper} 10%,
            ${C.paperHi} 42%, ${C.paperHi} 60%,
            ${C.paper} 90%, ${C.paperDeep} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: wash,
          background: `radial-gradient(ellipse 68% 78% at 50% 46%,
            rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.40) 48%, rgba(255,255,255,0) 80%)`,
        }}
      />
      <AbsoluteFill
        style={{background: `radial-gradient(ellipse 54% 52% at 50% 42%, ${a}0E 0%, ${a}00 74%)`}}
      />
      <Grid />
      {rails ? (
        <>
          <LFRail part={part} y={8} dir={1} opacity={0.5} />
          <LFRail part={part} y={LF_CANVAS.h - 48} dir={-1} opacity={0.5} />
        </>
      ) : null}
      {children}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '200px 200px',
          opacity: 0.09,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/** Absolute placement in safe-rect pixel coordinates (0..1816 x 0..992). */
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
      left: LF_SAFE.x + x,
      top: LF_SAFE.y + y,
      width: w,
      height: h,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Twelve-column helper across the safe width, for split layouts. */
export const COL = (n: number): number => (LF_SAFE.w - 11 * 24) * (n / 12) + (n - 1) * 24;
export const COL_X = (i: number): number => ((LF_SAFE.w - 11 * 24) / 12 + 24) * i;
