import React from 'react';
import {Img, OffthreadVideo, useCurrentFrame} from 'remotion';
import {C, SAFE} from '../lib/theme';
import {A} from '../lib/images';
import {beat, kenBurns, ramp} from '../lib/anim';

/**
 * Media presentation for a LIGHT ground.
 *
 * Most TASCAM product renders are already shot on white, so on a light page
 * they need a plate to have any presence: a marginally raised paperHi card
 * with a hairline rule and a soft contact shadow. That reads as a clean spec
 * card rather than a floating cut-out, and keeps the dark matte chassis as the
 * darkest thing in frame — which is the whole point of the brief's light-
 * background direction.
 *
 * Coordinates are pixels inside the primary safe rect (0..936 x 0..1330).
 */

export type Box = {x: number; y: number; w: number; h: number};
export type KB = {z?: [number, number]; x?: [number, number]; y?: [number, number]};

const PLATE_SHADOW =
  '0 26px 64px -30px rgba(10,17,25,0.46), 0 3px 10px -2px rgba(10,17,25,0.09)';

export const Shot: React.FC<{
  id: number;
  box: Box;
  dur: number;
  fit?: 'cover' | 'contain';
  kb?: KB;
  radius?: number;
  opacity?: number;
  plate?: boolean;
  pad?: number;
  bg?: string;
  border?: string | null;
  shadow?: boolean;
  rotate?: number;
  scale?: number;
  grayscale?: number;
  style?: React.CSSProperties;
}> = ({
  id,
  box,
  dur,
  fit = 'cover',
  kb,
  radius = 14,
  opacity = 1,
  plate = true,
  pad = 0,
  bg,
  border,
  shadow = true,
  rotate = 0,
  scale = 1,
  grayscale = 0,
  style,
}) => {
  const f = useCurrentFrame();
  const z = kb?.z ?? (fit === 'cover' ? [1.05, 1.13] : [1, 1]);
  const t = kenBurns(f, dur, z, kb?.x ?? [0, 0], kb?.y ?? [0, 0]);
  const bd = border === undefined ? (plate ? C.line : null) : border;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x + box.x,
        top: SAFE.y + box.y,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        overflow: 'hidden',
        opacity,
        backgroundColor: bg ?? (plate ? C.paperHi : 'transparent'),
        border: bd ? `1px solid ${bd}` : undefined,
        boxShadow: shadow ? PLATE_SHADOW : undefined,
        transform: `rotate(${rotate}deg) scale(${scale})`,
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

/**
 * A trimmed source clip played at natural speed. The two repository videos are
 * 1600x500 ultra-wide banners, so they are presented as a letterbox band on a
 * dark plate — the darkest element in an otherwise high-key frame.
 */
export const Clip: React.FC<{
  id: number;
  box: Box;
  radius?: number;
  opacity?: number;
  fit?: 'cover' | 'contain';
  bg?: string;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({id, box, radius = 14, opacity = 1, fit = 'cover', bg = C.screen, shadow = true, style}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.x + box.x,
      top: SAFE.y + box.y,
      width: box.w,
      height: box.h,
      borderRadius: radius,
      overflow: 'hidden',
      opacity,
      backgroundColor: bg,
      boxShadow: shadow ? PLATE_SHADOW : undefined,
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

/**
 * Beat-driven slot. Holds the outgoing frame underneath while the incoming one
 * fades over it, so a montage step never flashes to the ground colour.
 */
export const CrossShot: React.FC<{
  ids: number[];
  dur: number;
  box: Box;
  fade?: number;
  kbAt?: (i: number) => KB;
  fit?: 'cover' | 'contain';
  radius?: number;
  plate?: boolean;
  pad?: number;
  bg?: string;
  border?: string | null;
  shadow?: boolean;
  onBeat?: (i: number) => void;
}> = ({ids, dur, box, fade = 7, kbAt, ...rest}) => {
  const f = useCurrentFrame();
  const {i, local, per} = beat(f, dur, ids.length);
  const g = i > 0 ? Math.max(0, Math.min(1, local / fade)) : 1;
  return (
    <>
      {i > 0 && g < 1 ? (
        <Shot key={`p${i}`} id={ids[i - 1]} box={box} dur={per} kb={kbAt?.(i - 1)} {...rest} />
      ) : null}
      <Shot key={`c${i}`} id={ids[i]} box={box} dur={per} kb={kbAt?.(i)} opacity={g} {...rest} />
    </>
  );
};

/**
 * Staggered n-up collage. Used for supporting / lower-priority assets so a
 * single beat can carry three to six of them and still read as deliberate.
 */
export const Grid: React.FC<{
  ids: number[];
  dur: number;
  cols: number;
  box: Box;
  gap?: number;
  radius?: number;
  fit?: 'cover' | 'contain';
  plate?: boolean;
  pad?: number;
  bg?: string;
  stagger?: number;
  delay?: number;
  rowH?: number;
}> = ({
  ids,
  dur,
  cols,
  box,
  gap = 14,
  radius = 12,
  fit = 'cover',
  plate = true,
  pad = 0,
  bg,
  stagger = 4,
  delay = 0,
  rowH,
}) => {
  const f = useCurrentFrame();
  const rows = Math.ceil(ids.length / cols);
  const cw = (box.w - gap * (cols - 1)) / cols;
  const ch = rowH ?? (box.h - gap * (rows - 1)) / rows;
  return (
    <>
      {ids.map((id, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const d = delay + i * stagger;
        const p = ramp(f, [d, d + 16], [0, 1]);
        return (
          <Shot
            key={id}
            id={id}
            dur={dur}
            box={{x: box.x + c * (cw + gap), y: box.y + r * (ch + gap), w: cw, h: ch}}
            fit={fit}
            plate={plate}
            pad={pad}
            bg={bg}
            radius={radius}
            opacity={p}
            kb={{z: [1.02, 1.09]}}
            style={{transform: `translateY(${(1 - p) * 22}px)`}}
          />
        );
      })}
    </>
  );
};

/**
 * Rapid whip-strip: a horizontal band of assets that slides continuously.
 * Carries a lot of supporting imagery in very little time without ever holding
 * one static frame — the core of the wide-transition approach this format needs.
 */
export const WhipStrip: React.FC<{
  ids: number[];
  y: number;
  h: number;
  itemW?: number;
  gap?: number;
  speed?: number;
  radius?: number;
  fit?: 'cover' | 'contain';
  plate?: boolean;
  opacity?: number;
  reverse?: boolean;
}> = ({
  ids,
  y,
  h,
  itemW = 300,
  gap = 14,
  speed = 2.6,
  radius = 12,
  fit = 'cover',
  plate = true,
  opacity = 1,
  reverse = false,
}) => {
  const f = useCurrentFrame();
  const step = itemW + gap;
  const total = ids.length * step;
  const shift = ((f * speed) % total) * (reverse ? -1 : 1);
  const loop = [...ids, ...ids, ...ids];
  // Inset to the safe rect: a strip that ran full-bleed would push product
  // detail into the side margins, which the safe-zone contract forbids.
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y + y,
        width: SAFE.w,
        height: h,
        overflow: 'hidden',
        borderRadius: radius,
        opacity,
      }}
    >
      {loop.map((id, i) => {
        const x = i * step - shift - total;
        if (x < -step * 1.2 || x > SAFE.w + step) return null;
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
              backgroundColor: plate ? C.paperHi : 'transparent',
              border: plate ? `1px solid ${C.line}` : undefined,
              boxShadow: PLATE_SHADOW,
            }}
          >
            <Img
              src={A(id)}
              style={{width: '100%', height: '100%', objectFit: fit, display: 'block'}}
            />
          </div>
        );
      })}
    </div>
  );
};
