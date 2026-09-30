import React from 'react';
import {Img} from 'remotion';
import {CUT, CUT_M, IMG, IMG_M, LOGO, LOGO_ASPECT, aspect, cutAspect, hasCut, info} from '../lib/assets';
import {FONT, rgba} from '../lib/theme';
import {useV} from '../lib/ctx';
import {clamp, easeOutCubic, easeOutExpo, lerp} from '../lib/anim';

type Box = {x: number; y: number; w: number; h: number};
const abs = (b: Box): React.CSSProperties => ({position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h});

/** Soft contact shadow — a radial gradient, never a blurred box-shadow (too slow at 4K). */
export const Shadow: React.FC<{w: number; h: number; x: number; y: number; o?: number}> = ({w, h, x, y, o = 0.6}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      background: `radial-gradient(closest-side, rgba(0,0,0,${o}), rgba(0,0,0,${o * 0.45}) 45%, rgba(0,0,0,0) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/**
 * Dark glass card — the house frame for every tile. A product shot on white
 * is shown as its cut-out inside the card, lit from behind, so white sweeps
 * never flash up on the dark stage; photos and screens fill the card.
 */
export const GlassCard: React.FC<{
  id: number;
  b: Box;
  r?: number;
  mode?: 'auto' | 'cover' | 'cut' | 'paper';
  size?: 'l' | 'm';
  kb?: number; // 0..1 ken-burns progress
  pad?: number;
  glow?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({id, b, r = 28, mode = 'auto', size = 'm', kb = 0, pad = 0.09, glow = 0, style, children}) => {
  const {t} = useV();
  // white-sweep shots that could not be keyed sit on a light 'paper' card instead
  const m = mode === 'auto' ? (hasCut(id) ? 'cut' : info(id).white > 0.3 ? 'paper' : 'cover') : mode;
  const src = m === 'cut' ? (size === 'l' ? CUT(id) : CUT_M(id)) : size === 'l' ? IMG(id) : IMG_M(id);
  const inner = (() => {
    if (m === 'cut') {
      const ca = cutAspect(id);
      const aw = b.w * (1 - pad * 2);
      const ah = b.h * (1 - pad * 2);
      let w = aw;
      let h = w / ca;
      if (h > ah) {
        h = ah;
        w = h * ca;
      }
      const s = 1 + kb * 0.06;
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(60% 55% at 50% 45%, ${rgba(t.aRgb, 0.16 + glow * 0.25)}, rgba(255,255,255,0.03) 55%, rgba(0,0,0,0) 80%)`,
            }}
          />
          <Img
            src={src}
            style={{
              position: 'absolute',
              left: (b.w - w) / 2,
              top: (b.h - h) / 2,
              width: w,
              height: h,
              transform: `scale(${s})`,
            }}
          />
        </>
      );
    }
    const ia = aspect(id);
    const ca = b.w / b.h;
    const cover = m === 'cover';
    let w: number;
    let h: number;
    if (cover ? ia > ca : ia < ca) {
      h = b.h;
      w = h * ia;
    } else {
      w = b.w;
      h = w / ia;
    }
    if (m === 'paper') {
      w *= 0.94;
      h *= 0.94;
    }
    const s = 1.02 + kb * 0.08;
    return (
      <Img
        src={src}
        style={{
          position: 'absolute',
          left: (b.w - w) / 2,
          top: (b.h - h) / 2,
          width: w,
          height: h,
          transform: `scale(${s})`,
        }}
      />
    );
  })();
  return (
    <div
      style={{
        ...abs(b),
        borderRadius: r,
        overflow: 'hidden',
        background:
          m === 'paper'
            ? '#F3F4F6'
            : 'linear-gradient(160deg, #1A1D24 0%, #0E1015 55%, #090A0E 100%)',
        boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,${m === 'paper' ? 0.0 : 0.13})`,
        ...style,
      }}
    >
      {inner}
      {/* top sheen — the glass */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            m === 'paper'
              ? 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0) 62%), linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.10))'
              : 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 28%)',
          borderRadius: r,
        }}
      />
      {m !== 'paper' && (
        <div style={{position: 'absolute', inset: 0, borderRadius: r, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)'}} />
      )}
      {children}
    </div>
  );
};

/**
 * A floating product cut-out with a mirrored floor reflection and a lit floor.
 * (x, y) is the product's bottom-centre on the floor line.
 */
export const Hero: React.FC<{
  id: number;
  x: number;
  y: number;
  w: number;
  size?: 'l' | 'm';
  rot?: number; // rotateY deg
  lift?: number;
  opacity?: number;
  reflect?: number;
  glow?: number;
}> = ({id, x, y, w, size = 'l', rot = 0, lift = 0, opacity = 1, reflect = 0.22, glow = 0.5}) => {
  const {t} = useV();
  const a = cutAspect(id);
  const h = w / a;
  const src = size === 'l' ? CUT(id) : CUT_M(id);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h - lift, width: w, height: h * 2, opacity}}>
      {/* floor light */}
      <div
        style={{
          position: 'absolute',
          left: -w * 0.25,
          top: h * 0.55,
          width: w * 1.5,
          height: h * 0.9,
          background: `radial-gradient(closest-side, ${rgba(t.aRgb, 0.22 * glow + 0.06)}, ${rgba(t.aRgb, 0.05)} 60%, rgba(0,0,0,0) 100%)`,
        }}
      />
      <Shadow x={w / 2} y={h * 0.97 + lift} w={w * 0.95} h={h * 0.16} o={0.75} />
      <div style={{position: 'absolute', inset: 0, transform: `perspective(2600px) rotateY(${rot}deg)`, transformOrigin: '50% 50%'}}>
        <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: h}} />
        {reflect > 0 && (
          <>
            <Img
              src={src}
              style={{
                position: 'absolute',
                left: 0,
                top: h + lift * 2 - 2,
                width: w,
                height: h,
                transform: 'scaleY(-1)',
                opacity: reflect,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -4,
                top: h + lift * 2 - 4,
                width: w + 8,
                height: h + 8,
                background: `linear-gradient(180deg, rgba(5,6,9,0.35) 0%, rgba(5,6,9,0.92) 38%, rgba(5,6,9,1) 60%)`,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const Logo: React.FC<{
  name: 'tascam' | 'shivansh' | 'dante' | 'tascamBlack' | 'shivanshBlack';
  w: number;
  x?: number;
  y?: number;
  center?: boolean;
  style?: React.CSSProperties;
}> = ({name, w, x = 0, y = 0, center = false, style}) => {
  const key = {tascam: 'tascam-white', shivansh: 'shivansh-white', dante: 'dante-white', tascamBlack: 'tascam-black', shivanshBlack: 'shivansh-black'}[name];
  const a = (LOGO_ASPECT as Record<string, number>)[key] ?? 4;
  const h = w / a;
  return (
    <Img
      src={LOGO[name]}
      style={{position: 'absolute', left: center ? x - w / 2 : x, top: center ? y - h / 2 : y, width: w, height: h, ...style}}
    />
  );
};
export const logoH = (name: string, w: number) => {
  const key = {tascam: 'tascam-white', shivansh: 'shivansh-white', dante: 'dante-white'}[name] ?? name;
  return w / ((LOGO_ASPECT as Record<string, number>)[key] ?? 4);
};

/** Small letter-spaced label. */
export const Eyebrow: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties; track?: number}> = ({
  children,
  size = 26,
  color = 'rgba(255,255,255,0.72)',
  style,
  track = 0.42,
}) => (
  <div
    style={{
      fontFamily: FONT.ui,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: `${track}em`,
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Text that rises out of a mask. p: 0..1 in, q: 0..1 out (rises away). */
export const MaskRise: React.FC<{p: number; q?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number}> = ({
  p,
  q = 0,
  children,
  style,
  dist = 1.05,
}) => {
  const y = (1 - easeOutExpo(p)) * 100 * dist - easeOutCubic(q) * 100 * dist;
  return (
    <div style={{overflow: 'hidden', ...style}}>
      <div style={{transform: `translateY(${y}%)`}}>{children}</div>
    </div>
  );
};

/** Per-letter slam: each char drops in on its own start frame. */
export const Slam: React.FC<{
  text: string;
  f: number;
  starts: number[];
  size: number;
  weight?: number;
  color?: string;
  track?: number;
  font?: string;
  glow?: string;
  stroke?: string;
}> = ({text, f, starts, size, weight = 800, color = '#fff', track = -0.02, font = FONT.display, glow, stroke}) => (
  <div style={{display: 'flex', fontFamily: font, fontWeight: weight, fontSize: size, letterSpacing: `${track}em`, lineHeight: 1, color}}>
    {text.split('').map((ch, i) => {
      const s = starts[Math.min(i, starts.length - 1)] ?? 0;
      const p = clamp((f - s) / 7);
      const vis = f >= s;
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: vis ? clamp(p * 3) : 0,
            transform: `translateY(${(1 - easeOutExpo(p)) * -0.5 * size}px) scale(${lerp(1.35, 1, easeOutExpo(p))})`,
            textShadow: glow ? `0 0 ${size * 0.18}px ${glow}` : undefined,
            WebkitTextStroke: stroke,
            whiteSpace: 'pre',
          }}
        >
          {ch}
        </span>
      );
    })}
  </div>
);

/** Glass pill — the Audient-style badge. */
export const Pill: React.FC<{
  children: React.ReactNode;
  icon?: string;
  size?: number;
  style?: React.CSSProperties;
  strong?: boolean;
}> = ({children, icon, size = 30, style, strong}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.5,
      padding: `${size * 0.52}px ${size * 1.05}px`,
      borderRadius: 999,
      border: `${strong ? 2.5 : 2}px solid rgba(255,255,255,${strong ? 0.8 : 0.55})`,
      background: `linear-gradient(180deg, rgba(255,255,255,${strong ? 0.16 : 0.1}), rgba(255,255,255,0.03))`,
      color: '#fff',
      fontFamily: FONT.ui,
      fontWeight: 500,
      fontSize: size,
      whiteSpace: 'nowrap',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
      ...style,
    }}
  >
    {icon && <Img src={icon} style={{height: size * 1.25, width: 'auto'}} />}
    {children}
  </div>
);

/** Technical chip: mono, hairline border, accent tick. */
export const Chip: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 26, style}) => {
  const {t} = useV();
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.6,
        padding: `${size * 0.5}px ${size * 0.8}px`,
        border: '1.5px solid rgba(255,255,255,0.28)',
        borderRadius: 10,
        background: 'rgba(8,10,14,0.72)',
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '0.08em',
        color: '#fff',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{width: size * 0.42, height: size * 0.42, background: t.a, borderRadius: 2, boxShadow: `0 0 ${size * 0.5}px ${t.a}`}} />
      {children}
    </div>
  );
};
