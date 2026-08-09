import React from 'react';
import {Img, OffthreadVideo, useCurrentFrame} from 'remotion';
import {C, LF_SAFE} from '../../lib/lf-theme';
import {A} from '../../lib/images';
import {beat, kenBurns, ramp} from '../../lib/anim';

/**
 * Media presentation for the landscape long-form frame.
 *
 * With 1920x1080 available the format asks for scaling-and-padding over
 * cropping on anything hero-sized, so `Plate` defaults to `contain` on a
 * raised paperHi card: the whole product stays in frame and the card supplies
 * the deliberate background treatment rather than a crop into the subject.
 * `Fill` remains available for atmospheric shots where a crop is the point.
 *
 * Coordinates are pixels inside the safe rect (0..1816 x 0..992).
 */

export type Box = {x: number; y: number; w: number; h: number};
export type KB = {z?: [number, number]; x?: [number, number]; y?: [number, number]};

const SHADOW = '0 30px 70px -34px rgba(10,17,25,0.44), 0 3px 10px -2px rgba(10,17,25,0.08)';

export const Plate: React.FC<{
  id: number;
  box: Box;
  dur: number;
  fit?: 'cover' | 'contain';
  kb?: KB;
  radius?: number;
  opacity?: number;
  pad?: number;
  bg?: string;
  card?: boolean;
  shadow?: boolean;
  grayscale?: number;
  style?: React.CSSProperties;
}> = ({
  id,
  box,
  dur,
  fit = 'contain',
  kb,
  radius = 16,
  opacity = 1,
  pad = 22,
  bg,
  card = true,
  shadow = true,
  grayscale = 0,
  style,
}) => {
  const f = useCurrentFrame();
  const z = kb?.z ?? (fit === 'cover' ? [1.04, 1.12] : [1, 1]);
  const t = kenBurns(f, dur, z, kb?.x ?? [0, 0], kb?.y ?? [0, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_SAFE.x + box.x,
        top: LF_SAFE.y + box.y,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        overflow: 'hidden',
        opacity,
        backgroundColor: bg ?? (card ? C.paperHi : 'transparent'),
        border: card ? `1px solid ${C.line}` : undefined,
        boxShadow: shadow ? SHADOW : undefined,
        ...style,
      }}
    >
      <Img
        src={A(id)}
        style={{
          width: `calc(100% - ${pad * 2}px)`,
          height: `calc(100% - ${pad * 2}px)`,
          marginLeft: pad,
          marginTop: pad,
          objectFit: fit,
          transform: t,
          transformOrigin: 'center center',
          filter: grayscale ? `grayscale(${grayscale})` : undefined,
          display: 'block',
        }}
      />
    </div>
  );
};

/** Edge-to-edge atmospheric image, no card. Crops deliberately. */
export const Fill: React.FC<{
  id: number;
  box: Box;
  dur: number;
  kb?: KB;
  radius?: number;
  opacity?: number;
  shade?: 'none' | 'left' | 'bottom';
  style?: React.CSSProperties;
}> = ({id, box, dur, kb, radius = 16, opacity = 1, shade = 'none', style}) => {
  const f = useCurrentFrame();
  const t = kenBurns(f, dur, kb?.z ?? [1.05, 1.14], kb?.x ?? [0, 0], kb?.y ?? [0, 0]);
  const grad =
    shade === 'left'
      ? 'linear-gradient(90deg, rgba(241,244,248,0.94) 0%, rgba(241,244,248,0.55) 34%, rgba(241,244,248,0) 62%)'
      : shade === 'bottom'
        ? 'linear-gradient(0deg, rgba(241,244,248,0.92) 0%, rgba(241,244,248,0) 46%)'
        : undefined;
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_SAFE.x + box.x,
        top: LF_SAFE.y + box.y,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        overflow: 'hidden',
        opacity,
        backgroundColor: C.screen,
        boxShadow: SHADOW,
        ...style,
      }}
    >
      <Img
        src={A(id)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: t,
          transformOrigin: 'center center',
          display: 'block',
        }}
      />
      {grad ? <div style={{position: 'absolute', inset: 0, background: grad}} /> : null}
    </div>
  );
};

/**
 * A trimmed source clip at natural speed. The repository clips are 1600x500
 * ultra-wide, so they present as a letterboxed band on the dark plate — the
 * darkest element in an otherwise high-key frame.
 */
export const LFClip: React.FC<{
  id: number;
  box: Box;
  radius?: number;
  opacity?: number;
  fit?: 'cover' | 'contain';
  bg?: string;
  style?: React.CSSProperties;
}> = ({id, box, radius = 16, opacity = 1, fit = 'cover', bg = C.screen, style}) => (
  <div
    style={{
      position: 'absolute',
      left: LF_SAFE.x + box.x,
      top: LF_SAFE.y + box.y,
      width: box.w,
      height: box.h,
      borderRadius: radius,
      overflow: 'hidden',
      opacity,
      backgroundColor: bg,
      boxShadow: SHADOW,
      ...style,
    }}
  >
    <OffthreadVideo
      src={A(id)}
      muted
      style={{width: '100%', height: '100%', objectFit: fit, display: 'block'}}
    />
  </div>
);

/** Beat-driven slot; holds the outgoing frame while the incoming fades over. */
export const CrossPlate: React.FC<{
  ids: number[];
  dur: number;
  box: Box;
  fade?: number;
  kbAt?: (i: number) => KB;
  fit?: 'cover' | 'contain';
  radius?: number;
  pad?: number;
  card?: boolean;
  bg?: string;
}> = ({ids, dur, box, fade = 9, kbAt, ...rest}) => {
  const f = useCurrentFrame();
  const {i, local, per} = beat(f, dur, ids.length);
  const g = i > 0 ? Math.max(0, Math.min(1, local / fade)) : 1;
  return (
    <>
      {i > 0 && g < 1 ? (
        <Plate key={`p${i}`} id={ids[i - 1]} box={box} dur={per} kb={kbAt?.(i - 1)} {...rest} />
      ) : null}
      <Plate key={`c${i}`} id={ids[i]} box={box} dur={per} kb={kbAt?.(i)} opacity={g} {...rest} />
    </>
  );
};

/** Staggered n-up montage, for overview passages. */
export const Mosaic: React.FC<{
  ids: number[];
  dur: number;
  cols: number;
  box: Box;
  gap?: number;
  radius?: number;
  fit?: 'cover' | 'contain';
  pad?: number;
  card?: boolean;
  bg?: string;
  stagger?: number;
  delay?: number;
}> = ({
  ids,
  dur,
  cols,
  box,
  gap = 18,
  radius = 14,
  fit = 'contain',
  pad = 14,
  card = true,
  bg,
  stagger = 5,
  delay = 0,
}) => {
  const f = useCurrentFrame();
  const rows = Math.ceil(ids.length / cols);
  const cw = (box.w - gap * (cols - 1)) / cols;
  const ch = (box.h - gap * (rows - 1)) / rows;
  return (
    <>
      {ids.map((id, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const d = delay + i * stagger;
        const p = ramp(f, [d, d + 18], [0, 1]);
        return (
          <Plate
            key={id}
            id={id}
            dur={dur}
            box={{x: box.x + c * (cw + gap), y: box.y + r * (ch + gap), w: cw, h: ch}}
            fit={fit}
            pad={pad}
            card={card}
            bg={bg}
            radius={radius}
            opacity={p}
            kb={{z: [1.01, 1.06]}}
            style={{transform: `translateY(${(1 - p) * 24}px)`}}
          />
        );
      })}
    </>
  );
};

/** Continuously sliding strip of supporting imagery. Inset to the safe rect. */
export const Ribbon: React.FC<{
  ids: number[];
  y: number;
  h: number;
  itemW?: number;
  gap?: number;
  speed?: number;
  radius?: number;
  fit?: 'cover' | 'contain';
  card?: boolean;
  opacity?: number;
  reverse?: boolean;
}> = ({
  ids,
  y,
  h,
  itemW = 360,
  gap = 18,
  speed = 1.8,
  radius = 14,
  fit = 'contain',
  card = true,
  opacity = 1,
  reverse = false,
}) => {
  const f = useCurrentFrame();
  const step = itemW + gap;
  const total = ids.length * step;
  const shift = ((f * speed) % total) * (reverse ? -1 : 1);
  const loop = [...ids, ...ids, ...ids];
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_SAFE.x,
        top: LF_SAFE.y + y,
        width: LF_SAFE.w,
        height: h,
        overflow: 'hidden',
        borderRadius: radius,
        opacity,
      }}
    >
      {loop.map((id, i) => {
        const x = i * step - shift - total;
        if (x < -step * 1.2 || x > LF_SAFE.w + step) return null;
        return (
          <div
            key={`${id}-${i}`}
            style={{
              position: 'absolute',
              left: x,
              top: 0,
              width: itemW,
              height: h,
              borderRadius: radius,
              overflow: 'hidden',
              backgroundColor: card ? C.paperHi : 'transparent',
              border: card ? `1px solid ${C.line}` : undefined,
              boxShadow: SHADOW,
            }}
          >
            <Img
              src={A(id)}
              style={{
                width: 'calc(100% - 24px)',
                height: 'calc(100% - 24px)',
                margin: 12,
                objectFit: fit,
                display: 'block',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
