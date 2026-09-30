import React, {useMemo} from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useV} from '../lib/ctx';
import {envSmooth, envAt, pulse, bpm} from '../lib/music';
import {clamp, easeOutCubic, easeOutExpo, hash, lerp, noise1, rng} from '../lib/anim';
import {FONT, rgba} from '../lib/theme';
import {FX} from '../lib/assets';
import {Logo} from '../ui/kit';

const S = 1920;

/* ------------------------------------------------------------------ stage -- */
export const Backdrop: React.FC<{dim?: number; grid?: number}> = ({dim = 0, grid = 1}) => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const low = envSmooth(m, 'low', f, 3);
  const x1 = 30 + noise1(f / 90, 1) * 18;
  const y1 = 28 + noise1(f / 110, 2) * 12;
  const x2 = 72 + noise1(f / 100, 3) * 16;
  const y2 = 70 + noise1(f / 120, 4) * 12;
  return (
    <AbsoluteFill style={{background: t.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 42% at ${x1}% ${y1}%, ${rgba(t.aRgb, 0.13 + low * 0.07)}, rgba(0,0,0,0) 72%),
            radial-gradient(50% 40% at ${x2}% ${y2}%, ${rgba(t.bRgb, 0.07 + low * 0.05)}, rgba(0,0,0,0) 72%),
            linear-gradient(180deg, rgba(0,0,0,0) 55%, ${rgba(t.aRgb, 0.05)} 100%)`,
          opacity: 1 - dim,
        }}
      />
      {grid > 0 && (
        <AbsoluteFill
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.032) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.032) 1.5px, transparent 1.5px)',
            backgroundSize: '160px 160px',
            backgroundPosition: `${(f * 0.6) % 160}px 0px`,
            opacity: grid * (1 - dim),
            maskImage: 'radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 85%)',
          }}
        />
      )}
      {t.fx === 'ribbons' ? <Ribbons /> : <Sparks />}
    </AbsoluteFill>
  );
};

/* Lost Sky: light ribbons that breathe with the bass. */
export const Ribbons: React.FC<{o?: number}> = ({o = 1}) => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const low = envSmooth(m, 'low', f, 2);
  const high = envSmooth(m, 'high', f, 3);
  const paths = [0, 1, 2, 3].map((k) => {
    const amp = 70 + 160 * low + k * 22;
    const y0 = 1180 + k * 70;
    const ph = f / (38 + k * 9) + k * 1.7;
    let d = '';
    for (let x = -40; x <= S + 40; x += 40) {
      const y = y0 + Math.sin(x / (320 + k * 60) + ph) * amp * 0.6 + Math.sin(x / 150 - ph * 1.7) * amp * 0.18;
      d += `${x === -40 ? 'M' : 'L'}${x},${y.toFixed(1)} `;
    }
    return d;
  });
  const dots = useMemo(() => {
    const r = rng(11);
    return Array.from({length: 26}, () => ({x: r() * S, y: r() * S, s: 6 + r() * 16, sp: 0.4 + r() * 1.2, ph: r() * 10}));
  }, []);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={S} height={S} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="rb" x1="0" x2="1">
            <stop offset="0" stopColor={t.b} stopOpacity="0" />
            <stop offset="0.35" stopColor={t.b} stopOpacity="0.9" />
            <stop offset="0.7" stopColor={t.a} stopOpacity="0.9" />
            <stop offset="1" stopColor={t.a} stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((d, k) => (
          <g key={k} opacity={0.18 + 0.22 * low}>
            <path d={d} stroke="url(#rb)" strokeWidth={22 - k * 3} fill="none" opacity={0.18} />
            <path d={d} stroke="url(#rb)" strokeWidth={3.5} fill="none" opacity={0.9} />
          </g>
        ))}
      </svg>
      {dots.map((p, i) => {
        const y = (p.y - f * p.sp * 2.2 + S * 4) % (S + 100);
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 14 + p.ph));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + Math.sin(f / 40 + p.ph) * 30,
              top: y,
              width: p.s * 3,
              height: p.s * 3,
              borderRadius: '50%',
              background: `radial-gradient(closest-side, ${rgba(i % 2 ? t.bRgb : t.aRgb, 0.9)}, rgba(0,0,0,0))`,
              opacity: (0.25 + 0.6 * high) * tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* Thunderstruck: rising electric sparks, brighter on the cymbals. */
export const Sparks: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const high = envSmooth(m, 'high', f, 2);
  const dots = useMemo(() => {
    const r = rng(5);
    return Array.from({length: 34}, () => ({x: r() * S, y: r() * S, s: 2 + r() * 5, sp: 1 + r() * 3.5, ph: r() * 10}));
  }, []);
  return (
    <AbsoluteFill>
      {dots.map((p, i) => {
        const y = (p.y - f * p.sp * 3 + S * 8) % (S + 60);
        const fl = hash(i * 13.1 + Math.floor(f / 2)) > 0.25 ? 1 : 0.3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + noise1(f / 20 + i, i) * 24,
              top: y,
              width: p.s,
              height: p.s * 5,
              borderRadius: p.s,
              background: i % 3 ? t.b : t.a,
              opacity: (0.18 + 0.55 * high) * fl,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- lightning -- */
type Bolt = {d: string[]; w: number};
const makeBolt = (seed: number, x0: number, y0: number, x1: number, y1: number): Bolt => {
  const r = rng(seed);
  const pts: [number, number][] = [
    [x0, y0],
    [x1, y1],
  ];
  // midpoint displacement
  let seg = pts;
  let disp = Math.hypot(x1 - x0, y1 - y0) * 0.22;
  for (let it = 0; it < 7; it++) {
    const nxt: [number, number][] = [seg[0]];
    for (let i = 0; i < seg.length - 1; i++) {
      const [ax, ay] = seg[i];
      const [bx, by] = seg[i + 1];
      const mx = (ax + bx) / 2 + (r() - 0.5) * disp;
      const my = (ay + by) / 2 + (r() - 0.5) * disp * 0.35;
      nxt.push([mx, my], [bx, by]);
    }
    seg = nxt;
    disp *= 0.55;
  }
  const toD = (p: [number, number][]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const out = [toD(seg)];
  // two branches
  for (let b = 0; b < 3; b++) {
    const i0 = Math.floor(seg.length * (0.25 + r() * 0.5));
    const [sx, sy] = seg[i0];
    const len = 180 + r() * 320;
    const ang = (r() - 0.5) * 1.6 + Math.PI / 2;
    const bp: [number, number][] = [[sx, sy]];
    let cx = sx;
    let cy = sy;
    for (let k = 0; k < 9; k++) {
      cx += (Math.cos(ang) * len) / 9 + (r() - 0.5) * 50;
      cy += (Math.sin(ang) * len) / 9 + (r() - 0.5) * 20;
      bp.push([cx, cy]);
    }
    out.push(toD(bp));
  }
  return {d: out, w: 1};
};

/**
 * Lightning strikes at the given absolute frames. Each strike flickers for
 * ~6 frames (on, on, off, on, dim) and lights the whole sky for a moment.
 */
export const Lightning: React.FC<{strikes: {f: number; x?: number; seed?: number; big?: boolean}[]}> = ({strikes}) => {
  const f = useCurrentFrame();
  const {t} = useV();
  const live = strikes.filter((s) => f >= s.f && f < s.f + 7);
  if (!live.length) return null;
  const pattern = [1, 0.9, 0.15, 1, 0.55, 0.25, 0.1];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {live.map((s, i) => {
        const k = f - s.f;
        const o = pattern[k] ?? 0;
        const seed = s.seed ?? s.f * 7 + 3;
        const x0 = s.x ?? 300 + hash(seed) * 1320;
        const bolt = makeBolt(seed, x0, -40, x0 + (hash(seed + 1) - 0.5) * 700, 900 + hash(seed + 2) * 800);
        return (
          <React.Fragment key={i}>
            <AbsoluteFill
              style={{
                background: `radial-gradient(80% 60% at ${(x0 / S) * 100}% 10%, ${rgba(t.bRgb, 0.35 * o * (s.big ? 1.4 : 1))}, ${rgba(t.aRgb, 0.12 * o)} 50%, rgba(0,0,0,0) 80%)`,
              }}
            />
            <svg width={S} height={S} style={{position: 'absolute', inset: 0, opacity: o}}>
              {bolt.d.map((d, j) => (
                <g key={j} opacity={j === 0 ? 1 : 0.7}>
                  <path d={d} stroke={t.a} strokeOpacity={0.22} strokeWidth={j === 0 ? 34 : 16} fill="none" strokeLinejoin="round" />
                  <path d={d} stroke={t.b} strokeOpacity={0.6} strokeWidth={j === 0 ? 12 : 6} fill="none" strokeLinejoin="round" />
                  <path d={d} stroke="#fff" strokeWidth={j === 0 ? 4.5 : 2.2} fill="none" strokeLinejoin="round" />
                </g>
              ))}
            </svg>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------- flashes & impacts -- */
export const Flashes: React.FC<{hits: {f: number; o: number; d?: number; color?: string}[]}> = ({hits}) => {
  const f = useCurrentFrame();
  let o = 0;
  let color = '#fff';
  for (const h of hits) {
    const d = f - h.f;
    if (d >= 0 && d < 24) {
      const v = h.o * Math.exp(-d / (h.d ?? 3.2));
      if (v > o) {
        o = v;
        color = h.color ?? '#fff';
      }
    }
  }
  if (o < 0.005) return null;
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen'}} />;
};

export const Shockwaves: React.FC<{at: number[]}> = ({at}) => {
  const f = useCurrentFrame();
  const {t} = useV();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {at
        .filter((a) => f >= a && f < a + 22)
        .map((a, i) => {
          const p = (f - a) / 22;
          const r = lerp(60, 1500, easeOutExpo(p));
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: S / 2 - r,
                  top: S / 2 - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  border: `${lerp(26, 2, p)}px solid ${rgba(t.bRgb, (1 - p) * 0.85)}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: S / 2 - r * 0.7,
                  top: S / 2 - r * 0.7,
                  width: r * 1.4,
                  height: r * 1.4,
                  borderRadius: '50%',
                  border: `${lerp(10, 1, p)}px solid ${rgba(t.aRgb, (1 - p) * 0.7)}`,
                }}
              />
            </React.Fragment>
          );
        })}
    </AbsoluteFill>
  );
};

/** Global camera: kick breathing + impact shake. Wraps scene content. */
export const Camera: React.FC<{impacts: number[]; children: React.ReactNode; still?: boolean}> = ({impacts, children, still}) => {
  const f = useCurrentFrame();
  const {m} = useV();
  const kick = still ? 0 : pulse(m.kicks, f, 5, true);
  let shake = 0;
  for (const a of impacts) {
    const d = f - a;
    if (d >= 0 && d < 20) shake = Math.max(shake, Math.exp(-d / 5));
  }
  const sx = noise1(f * 0.9, 21) * 22 * shake;
  const sy = noise1(f * 0.9, 37) * 22 * shake;
  const rot = noise1(f * 0.7, 53) * 0.6 * shake;
  const s = 1 + kick * 0.011 + shake * 0.03;
  return (
    <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px) rotate(${rot}deg) scale(${s})`}}>{children}</AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- overlay -- */
export const Grain: React.FC<{o?: number}> = ({o = 0.07}) => {
  const f = useCurrentFrame();
  const x = Math.floor(hash(f * 3.1) * 512);
  const y = Math.floor(hash(f * 7.7) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${FX.grain})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${x}px ${y}px`,
        opacity: o,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC<{o?: number}> = ({o = 1}) => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(75% 75% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
      opacity: o,
      pointerEvents: 'none',
    }}
  />
);

/** Corner marks, brand bug, bar counter and a live stereo meter fed by the music. */
export const Hud: React.FC<{o: number; bar: number}> = ({o, bar}) => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  if (o <= 0.01) return null;
  const L = envAt(m, 'rms', f);
  const R = envAt(m, 'rms', f + 1) * 0.96 + envAt(m, 'high', f) * 0.06;
  const seg = 18;
  const meter = (v: number) =>
    Array.from({length: seg}, (_, i) => {
      const on = i / seg < clamp(v * 0.95);
      const c = i > seg - 3 ? '#FF4D5E' : i > seg - 6 ? '#FFC24D' : t.a;
      return <div key={i} style={{width: 12, height: 9, background: on ? c : 'rgba(255,255,255,0.08)', borderRadius: 1.5}} />;
    }).reverse();
  const corner = (x: number, y: number, rx: number, ry: number) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 44,
        height: 44,
        borderLeft: rx ? undefined : '2px solid rgba(255,255,255,0.35)',
        borderRight: rx ? '2px solid rgba(255,255,255,0.35)' : undefined,
        borderTop: ry ? undefined : '2px solid rgba(255,255,255,0.35)',
        borderBottom: ry ? '2px solid rgba(255,255,255,0.35)' : undefined,
      }}
    />
  );
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      {corner(52, 52, 0, 0)}
      {corner(S - 96, 52, 1, 0)}
      {corner(52, S - 96, 0, 1)}
      {corner(S - 96, S - 96, 1, 1)}
      <Logo name="shivansh" w={300} x={84} y={78} style={{opacity: 0.92}} />
      <Logo name="tascam" w={220} x={S - 84 - 220} y={96} style={{opacity: 0.92}} />
      <div
        style={{
          position: 'absolute',
          left: 88,
          bottom: 84,
          fontFamily: FONT.mono,
          fontSize: 22,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.62)',
        }}
      >
        BAR {String(bar + 1).padStart(2, '0')} · {bpm(m)} BPM · SONICVIEW
      </div>
      <div style={{position: 'absolute', right: 92, bottom: 86, display: 'flex', gap: 6, alignItems: 'flex-end'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>{meter(L)}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>{meter(R)}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Whip transition streaks — fake motion blur for the frames around a cut. */
export const Streaks: React.FC<{at: number[]; dir?: 1 | -1}> = ({at}) => {
  const f = useCurrentFrame();
  const {t} = useV();
  const live = at.filter((a) => f >= a - 3 && f < a + 5);
  if (!live.length) return null;
  const a = live[0];
  const p = (f - (a - 3)) / 8;
  const o = Math.sin(p * Math.PI);
  const r = rng(a);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      {Array.from({length: 14}, (_, i) => {
        const y = r() * S;
        const h = 2 + r() * 10;
        const w = 500 + r() * 1400;
        const x = lerp(-w, S, (p + r() * 0.4) % 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(i % 2 ? t.bRgb : '255,255,255', 0.7)}, rgba(0,0,0,0))`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const ease = {easeOutCubic, easeOutExpo};
export {Img};
