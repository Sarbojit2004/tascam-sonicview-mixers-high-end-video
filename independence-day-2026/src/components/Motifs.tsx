import React from 'react';
import {C} from '../lib/theme';
import {EASE_OUT, ramp, rnd} from '../lib/anim';
import {smoothPath} from './Art';

/**
 * MOTIF LIBRARY — landscape, architecture, performing arts, craft, festivals.
 *
 * Everything is authored geometry. The architecture set deliberately spans
 * seven regions and seven eras rather than repeating one famous monument, and
 * the festival set spans faiths and regions with equal visual weight — the
 * subject of this reel is the range of the country, so the artwork has to
 * carry that range rather than assert it in a caption.
 */

type Art = {
  size?: number;
  color?: string;
  accent?: string;
  /** 0..1 draw-on progress. */
  p?: number;
  opacity?: number;
};

const SW = 3.0;

/**
 * Sizes the svg box to the viewBox aspect rather than forcing it square.
 * A square box around 400x300 artwork letterboxes the content and leaves the
 * element ~30% taller than what it draws, which silently pushed the landscape
 * beats' artwork down over their captions.
 */
const wrap = (
  children: React.ReactNode,
  size: number,
  opacity: number,
  vb = '0 0 200 200',
): React.ReactElement => {
  const [, , vw, vh] = vb.split(/\s+/).map(Number);
  return (
    <svg
      width={size}
      height={size * (vh / vw)}
      viewBox={vb}
      style={{overflow: 'visible', opacity, display: 'block'}}
    >
      {children}
    </svg>
  );
};

/** Stroked path that draws itself over [0, p]. */
const Draw: React.FC<{
  d: string;
  len: number;
  p: number;
  color: string;
  w?: number;
  from?: number;
  to?: number;
  fill?: string;
  cap?: 'round' | 'butt';
}> = ({d, len, p, color, w = SW, from = 0, to = 1, fill = 'none', cap = 'round'}) => {
  const t = ramp(p, [from, to], [0, 1], EASE_OUT);
  return (
    <path
      d={d}
      fill={fill}
      fillOpacity={fill === 'none' ? 0 : ramp(p, [to * 0.85, Math.min(1, to + 0.12)], [0, 1])}
      stroke={color}
      strokeWidth={w}
      strokeLinecap={cap}
      strokeLinejoin="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - t)}
    />
  );
};

// ===========================================================================
// LANDSCAPE
// ===========================================================================
export const MountainRange: React.FC<Art & {f?: number; layers?: number}> = ({
  size = 700,
  color = C.chakraOnPaper,
  accent = C.saffronOnPaper,
  p = 1,
  opacity = 1,
  f = 0,
}) => {
  const W = 400;
  const H = 260;
  const uid = React.useId().replace(/:/g, '');
  // Ridges stop exactly at the viewBox edges. Running them to -20/420 pushed
  // the silhouette past the frame's side margins, and filling to the foot of
  // the box ended the range on a hard horizontal edge, so the fill is faded
  // out at the bottom instead.
  const ridge = (base: number, pk: [number, number][], op: number, par: number, key: string) => {
    const pts: [number, number][] = pk.map(([x, y]) => [x * W, base - y * H]);
    const d = smoothPath([[0, base], ...pts, [W, base]], false, 0.7) + ` L ${W} 300 L 0 300 Z`;
    return (
      <path
        key={key}
        d={d}
        fill={color}
        opacity={op * ramp(p, [par * 0.24, par * 0.24 + 0.34], [0, 1])}
        transform={`translate(${Math.sin(f * 0.010 + par) * 4 * par} 0)`}
      />
    );
  };
  const glow = ramp(p, [0.52, 0.88], [0, 1]);
  return wrap(
    <>
      <defs>
        <linearGradient id={`mtn-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
          <stop offset="72%" stopColor="#FFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
        <mask id={`mtnmask-${uid}`}>
          <rect x={0} y={0} width={W} height={300} fill={`url(#mtn-${uid})`} />
        </mask>
      </defs>
      <g mask={`url(#mtnmask-${uid})`}>
        {ridge(250, [[0.08, 0.44], [0.24, 0.70], [0.40, 0.52], [0.56, 0.82], [0.74, 0.58], [0.92, 0.72]], 0.22, 2.4, 'far')}
        {ridge(256, [[0.04, 0.30], [0.20, 0.52], [0.36, 0.38], [0.54, 0.64], [0.72, 0.42], [0.90, 0.54]], 0.42, 1.6, 'mid')}
        {ridge(262, [[0.12, 0.22], [0.30, 0.38], [0.48, 0.26], [0.66, 0.44], [0.84, 0.30]], 0.78, 0.8, 'near')}
      </g>
      {/* Snow and first light sit on the two highest peaks of the far ridge —
          (224, 37) and (96, 68) in viewBox units — rather than floating in the
          gap between ranges. */}
      <g opacity={glow}>
        <path d="M 224 37 L 243 74 L 233 70 L 224 79 L 215 69 L 205 74 Z" fill="#FFFFFF" opacity={0.94} />
        <path d="M 96 68 L 111 98 L 103 94 L 96 101 L 89 93 L 80 98 Z" fill="#FFFFFF" opacity={0.8} />
      </g>
      <g opacity={0.9 * glow}>
        <path d="M 200 76 L 224 37 L 248 80" fill="none" stroke={accent} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 80 96 L 96 68 L 114 100" fill="none" stroke={accent} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.72} />
      </g>
    </>,
    size,
    opacity,
    '0 0 400 300',
  );
};

export const RiverDelta: React.FC<Art & {f?: number}> = ({
  size = 700,
  color = C.chakraOnPaper,
  accent = C.greenOnPaper,
  p = 1,
  opacity = 1,
  f = 0,
}) => {
  // A trunk-and-tributary system, not a fan. Five strokes radiating from one
  // point read as a tent; a meandering main channel with tributaries joining
  // it at angles reads unmistakably as a river.
  const drift = (i: number) => Math.sin(f * 0.02 + i) * 2.2;

  const MAIN: [number, number][] = [
    [176, 8], [188, 48], [172, 92], [186, 134], [206, 172], [198, 214], [214, 252], [206, 292],
  ];

  // [points, width, delay] — each tributary ends ON the main channel
  const TRIBS: {pts: [number, number][]; w: number; d: number}[] = [
    {pts: [[42, 44], [96, 62], [140, 74], [178, 96]], w: 3.4, d: 0.16},
    {pts: [[348, 36], [292, 66], [232, 92], [184, 118]], w: 3.0, d: 0.22},
    {pts: [[26, 148], [82, 152], [136, 158], [182, 148]], w: 2.6, d: 0.30},
    {pts: [[368, 138], [314, 152], [256, 166], [204, 176]], w: 3.2, d: 0.26},
    {pts: [[46, 250], [104, 236], [156, 228], [200, 224]], w: 2.4, d: 0.36},
    {pts: [[358, 240], [304, 246], [254, 252], [212, 254]], w: 2.8, d: 0.34},
  ];

  return wrap(
    <>
      {/* the main channel */}
      <Draw
        d={smoothPath(MAIN.map(([x, y], i) => [x + drift(i), y] as [number, number]), false, 0.9)}
        len={340}
        p={p}
        color={color}
        w={6.4}
        from={0}
        to={0.52}
      />
      {TRIBS.map((t, i) => (
        <Draw
          key={i}
          d={smoothPath(t.pts.map(([x, y], k) => [x + drift(i + k), y] as [number, number]), false, 0.9)}
          len={220}
          p={p}
          color={color}
          w={t.w}
          from={t.d}
          to={t.d + 0.42}
        />
      ))}
      {/* forest canopy on the banks — pushed to the outer thirds so it never
          sits on the channel, and kept clear of the caption line below */}
      {new Array(18).fill(0).map((_, i) => {
        const a = ramp(p, [0.44 + (i / 18) * 0.38, 0.58 + (i / 18) * 0.38], [0, 1]);
        if (a <= 0.001) return null;
        const left = i % 2 === 0;
        const x = left ? 26 + rnd(i * 5 + 1) * 92 : 288 + rnd(i * 5 + 1) * 92;
        const y = 42 + rnd(i * 9 + 3) * 226;
        const r = 8 + rnd(i * 7) * 7;
        return (
          <g key={`t${i}`} opacity={a * 0.62}>
            <circle cx={x} cy={y} r={r * (0.5 + a * 0.5)} fill={accent} opacity={0.42} />
            <line x1={x} y1={y + r * 0.6} x2={x} y2={y + r * 1.6} stroke={accent} strokeWidth={1.8} strokeLinecap="round" />
          </g>
        );
      })}
    </>,
    size,
    opacity,
    '0 0 400 300',
  );
};

export const DesertCoast: React.FC<Art & {f?: number}> = ({
  size = 700,
  color = C.saffronOnPaper,
  accent = C.chakraOnPaper,
  p = 1,
  opacity = 1,
  f = 0,
}) => {
  // Desert above a hard horizon at y=168, sea below it. Filling each dune down
  // to the foot of the viewBox instead stacked three translucent rectangles on
  // top of each other and put the "sea" lines on the sand.
  const HZ = 168;
  const uid = React.useId().replace(/:/g, '');
  const dune = (base: number, amp: number, ph: number, op: number, key: string) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      pts.push([t * 400, base - Math.sin(t * 3.4 + ph) * amp]);
    }
    return (
      <path
        key={key}
        d={smoothPath([[-20, base], ...pts, [420, base]], false, 0.8) + ` L 420 ${HZ} L -20 ${HZ} Z`}
        fill={color}
        opacity={op * ramp(p, [0.05, 0.42], [0, 1])}
      />
    );
  };
  const seaIn = ramp(p, [0.28, 0.72], [0, 1], EASE_OUT);
  return wrap(
    <>
      <defs>
        <linearGradient id={`sea-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.20" />
          <stop offset="70%" stopColor={accent} stopOpacity="0.10" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* the dunes */}
      {dune(72, 20, 0.4, 0.20, 'd1')}
      {dune(108, 26, 2.1, 0.34, 'd2')}
      {dune(142, 20, 4.0, 0.52, 'd3')}

      {/* the sea */}
      <rect x={-20} y={HZ} width={440} height={300 - HZ} fill={`url(#sea-${uid})`} opacity={seaIn} />
      <line x1={-20} y1={HZ} x2={420} y2={HZ} stroke={accent} strokeWidth={2} opacity={0.4 * seaIn} />
      {new Array(7).fill(0).map((_, i) => {
        const y = HZ + 16 + i * 17;
        const a = ramp(p, [0.34 + i * 0.06, 0.58 + i * 0.06], [0, 1]);
        if (a <= 0.001) return null;
        const pts: [number, number][] = [];
        for (let k = 0; k <= 10; k++) {
          const t = k / 10;
          pts.push([t * 400, y + Math.sin(t * 6.4 + f * 0.035 + i * 1.1) * (3.2 + i * 0.6)]);
        }
        return (
          <path
            key={`w${i}`}
            d={smoothPath(pts, false, 0.9)}
            fill="none"
            stroke={accent}
            strokeWidth={2.2 - i * 0.14}
            strokeLinecap="round"
            opacity={a * (0.62 - i * 0.055)}
          />
        );
      })}

      {/* a lighthouse on the headland, standing on the horizon */}
      <g opacity={ramp(p, [0.58, 0.86], [0, 1])}>
        <path d="M 336 168 L 342 116 L 356 116 L 362 168 Z" fill={accent} opacity={0.88} />
        <rect x={339} y={104} width={20} height={13} rx={2.5} fill={accent} opacity={0.92} />
        <circle cx={349} cy={110} r={3.6} fill="#FFE9C2" opacity={0.75 + 0.25 * Math.sin(f * 0.16)} />
        <path d="M 349 110 L 400 94 L 400 128 Z" fill={color} opacity={0.34 + 0.20 * Math.sin(f * 0.09)} />
      </g>

      {/* two palms on the shore */}
      {[52, 88].map((x, i) => (
        <g key={`p${i}`} opacity={ramp(p, [0.64 + i * 0.06, 0.9], [0, 1])}>
          <path d={`M ${x} 168 C ${x - 4} 150, ${x - 2} 136, ${x + 4} 122`} fill="none" stroke={accent} strokeWidth={2.8} strokeLinecap="round" />
          {[-1, -0.45, 0.45, 1].map((k, j) => (
            <path
              key={j}
              d={`M ${x + 4} 122 Q ${x + 4 + k * 15} ${112 + Math.abs(k) * 2} ${x + 4 + k * 27} ${120 + Math.abs(k) * 10}`}
              fill="none"
              stroke={accent}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          ))}
          <circle cx={x + 4} cy={122} r={2.8} fill={accent} />
        </g>
      ))}
    </>,
    size,
    opacity,
    '0 0 400 300',
  );
};

// ===========================================================================
// ARCHITECTURE — seven regions, seven eras.
// ===========================================================================
export type BuildKind =
  | 'stepwell'
  | 'stupa'
  | 'gopuram'
  | 'shikhara'
  | 'dome'
  | 'arch'
  | 'modern';

export const BUILDINGS: {kind: BuildKind; name: string; where: string}[] = [
  {kind: 'stepwell', name: 'Stepwell', where: 'Gujarat · 11th c.'},
  {kind: 'stupa', name: 'Stupa', where: 'Madhya Pradesh · 3rd c. BCE'},
  {kind: 'shikhara', name: 'Shikhara', where: 'Odisha · 11th c.'},
  {kind: 'gopuram', name: 'Gopuram', where: 'Tamil Nadu · 12th c.'},
  {kind: 'dome', name: 'Dome & Minaret', where: 'Deccan · 16th c.'},
  {kind: 'arch', name: 'Colonnade', where: 'Bengal · 19th c.'},
  {kind: 'modern', name: 'Skyline', where: 'Maharashtra · today'},
];

export const Building: React.FC<Art & {kind: BuildKind}> = ({
  kind,
  size = 380,
  color = C.ink,
  accent = C.saffronOnPaper,
  p = 1,
  opacity = 1,
}) => {
  const rise = ramp(p, [0, 0.68], [0, 1], EASE_OUT);
  const detail = ramp(p, [0.38, 0.92], [0, 1]);
  const body = (children: React.ReactNode) => (
    <g transform={`translate(0 ${(1 - rise) * 26})`} opacity={rise}>
      {children}
      <rect x={16} y={186} width={168} height={4} rx={2} fill={color} opacity={0.5} />
    </g>
  );

  if (kind === 'stepwell') {
    // an inverted stepped descent — the form is subtractive, unlike every
    // other building here, which is exactly why it opens the sequence
    return wrap(
      body(
        <>
          <path d="M 20 60 L 180 60 L 180 74 L 20 74 Z" fill={color} opacity={0.9} />
          {new Array(6).fill(0).map((_, i) => {
            const inset = 20 + i * 13;
            const y = 74 + i * 19;
            return (
              <g key={i} opacity={ramp(p, [0.18 + i * 0.09, 0.4 + i * 0.09], [0, 1])}>
                <path
                  d={`M ${inset} ${y} L ${200 - inset} ${y} L ${200 - inset} ${y + 8} L ${inset} ${y + 8} Z`}
                  fill={color}
                  opacity={0.86 - i * 0.06}
                />
                <path d={`M ${inset} ${y + 8} L ${inset + 13} ${y + 19} M ${200 - inset} ${y + 8} L ${187 - inset} ${y + 19}`} stroke={color} strokeWidth={2} opacity={0.4} />
              </g>
            );
          })}
          <rect x={94} y={172} width={12} height={14} fill={accent} opacity={0.75 * detail} />
          {[52, 148].map((x) => (
            <rect key={x} x={x - 5} y={38} width={10} height={24} rx={3} fill={color} opacity={0.8 * detail} />
          ))}
        </>,
      ),
      size,
      opacity,
    );
  }

  if (kind === 'stupa') {
    return wrap(
      body(
        <>
          <path d="M 34 186 L 34 150 A 66 66 0 0 1 166 150 L 166 186 Z" fill={color} opacity={0.92} />
          <rect x={30} y={182} width={140} height={8} rx={3} fill={color} />
          {/* harmika + chhatri */}
          <rect x={86} y={62} width={28} height={18} fill={color} opacity={detail} />
          <rect x={97} y={40} width={6} height={24} fill={color} opacity={detail} />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={100} cy={44 - i * 11} rx={26 - i * 7} ry={3.6} fill={color} opacity={detail * (0.9 - i * 0.14)} />
          ))}
          {/* railing + torana gateway */}
          <g opacity={detail}>
            <rect x={24} y={162} width={152} height={3.4} fill={accent} opacity={0.8} />
            <rect x={62} y={128} width={5} height={58} fill={accent} opacity={0.55} />
            <rect x={133} y={128} width={5} height={58} fill={accent} opacity={0.55} />
            {[0, 1].map((i) => (
              <rect key={i} x={58} y={130 + i * 12} width={84} height={4} rx={2} fill={accent} opacity={0.62} />
            ))}
          </g>
        </>,
      ),
      size,
      opacity,
    );
  }

  if (kind === 'shikhara') {
    // curvilinear Nagara tower, crowned with an amalaka
    const pts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      pts.push([100 - (52 * (1 - t ** 2.1)) - 8 * (1 - t), 186 - t * 122]);
    }
    const right = [...pts].reverse().map(([x, y]) => [200 - x, y] as [number, number]);
    return wrap(
      body(
        <>
          <path d={smoothPath([...pts, ...right], false, 0.8) + ' Z'} fill={color} opacity={0.93} />
          <ellipse cx={100} cy={60} rx={27} ry={9} fill={color} opacity={detail} />
          <ellipse cx={100} cy={52} rx={17} ry={6} fill={color} opacity={detail} />
          <path d="M 100 48 L 100 30" stroke={color} strokeWidth={4} strokeLinecap="round" opacity={detail} />
          <circle cx={100} cy={27} r={5} fill={accent} opacity={detail} />
          {/* vertical rathas — the projecting bands that define the form */}
          <g opacity={0.35 * detail}>
            {[-30, 0, 30].map((dx) => (
              <path key={dx} d={`M ${100 + dx} 182 C ${100 + dx * 0.8} 140, ${100 + dx * 0.5} 100, ${100 + dx * 0.2} 70`} fill="none" stroke={C.paperHi} strokeWidth={2.4} />
            ))}
          </g>
          <rect x={86} y={148} width={28} height={38} fill={C.paperHi} opacity={0.30 * detail} />
        </>,
      ),
      size,
      opacity,
    );
  }

  if (kind === 'gopuram') {
    return wrap(
      body(
        <>
          {new Array(6).fill(0).map((_, i) => {
            const w = 152 - i * 19;
            const y = 186 - (i + 1) * 25;
            return (
              <g key={i} opacity={ramp(p, [0.06 + i * 0.10, 0.3 + i * 0.10], [0, 1])}>
                <path d={`M ${100 - w / 2} ${y + 25} L ${100 - w / 2 + 7} ${y} L ${100 + w / 2 - 7} ${y} L ${100 + w / 2} ${y + 25} Z`} fill={color} opacity={0.93 - i * 0.03} />
                <rect x={100 - w / 2 - 3} y={y - 5} width={w + 6} height={6} rx={2} fill={accent} opacity={0.55} />
                {/* the tiered figure niches */}
                {new Array(Math.max(2, 5 - i)).fill(0).map((__, k, arr) => (
                  <rect
                    key={k}
                    x={100 - w / 2 + 12 + (k * (w - 24)) / arr.length}
                    y={y + 6}
                    width={(w - 30) / arr.length}
                    height={13}
                    rx={2}
                    fill={C.paperHi}
                    opacity={0.28 * detail}
                  />
                ))}
              </g>
            );
          })}
          {/* the kalasam finials along the crest */}
          <g opacity={detail}>
            {[-24, -8, 8, 24].map((dx) => (
              <path key={dx} d={`M ${100 + dx} 36 l 0 -9`} stroke={color} strokeWidth={3.4} strokeLinecap="round" />
            ))}
          </g>
          <path d="M 84 186 L 84 152 A 16 16 0 0 1 116 152 L 116 186 Z" fill={C.paperHi} opacity={0.32 * detail} />
        </>,
      ),
      size,
      opacity,
    );
  }

  if (kind === 'dome') {
    return wrap(
      body(
        <>
          <rect x={40} y={122} width={120} height={64} fill={color} opacity={0.93} />
          {/* the onion dome */}
          <path d="M 100 44 C 138 68, 156 96, 156 118 C 156 132, 130 138, 100 138 C 70 138, 44 132, 44 118 C 44 96, 62 68, 100 44 Z" fill={color} />
          {/* a plain spire-and-ball finial: architectural, not a religious mark */}
          <g opacity={detail}>
            <path d="M 100 44 L 100 30" stroke={color} strokeWidth={3.6} strokeLinecap="round" />
            <circle cx={100} cy={26} r={4.6} fill={color} />
            <ellipse cx={100} cy={42} rx={9} ry={3.2} fill={color} />
          </g>
          {/* minarets */}
          {[26, 174].map((x) => (
            <g key={x} opacity={detail}>
              <rect x={x - 8} y={92} width={16} height={94} fill={color} opacity={0.88} />
              <path d={`M ${x} 66 C ${x + 11} 78, ${x + 12} 86, ${x + 12} 92 L ${x - 12} 92 C ${x - 12} 86, ${x - 11} 78, ${x} 66 Z`} fill={color} />
              <rect x={x - 13} y={112} width={26} height={4} fill={accent} opacity={0.6} />
            </g>
          ))}
          {/* the cusped arcade */}
          <g opacity={detail}>
            {[62, 100, 138].map((x, i) => (
              <path
                key={x}
                d={`M ${x - 17} 186 L ${x - 17} 158 C ${x - 17} 142, ${x + 17} 142, ${x + 17} 158 L ${x + 17} 186`}
                fill={C.paperHi}
                opacity={i === 1 ? 0.34 : 0.24}
              />
            ))}
          </g>
        </>,
      ),
      size,
      opacity,
    );
  }

  if (kind === 'arch') {
    return wrap(
      body(
        <>
          <rect x={18} y={172} width={164} height={16} fill={color} opacity={0.92} />
          {/* the great central arch */}
          <path d="M 56 172 L 56 108 C 56 76, 144 76, 144 108 L 144 172 L 128 172 L 128 110 C 128 90, 72 90, 72 110 L 72 172 Z" fill={color} />
          <rect x={40} y={62} width={120} height={16} rx={3} fill={color} opacity={0.94} />
          <rect x={52} y={46} width={96} height={16} rx={3} fill={color} opacity={detail} />
          {/* flanking columns */}
          {[32, 168].map((x) => (
            <g key={x} opacity={detail}>
              <rect x={x - 9} y={92} width={18} height={80} fill={color} opacity={0.86} />
              <rect x={x - 13} y={84} width={26} height={9} rx={2} fill={color} />
              <rect x={x - 13} y={168} width={26} height={8} rx={2} fill={color} />
            </g>
          ))}
          <circle cx={100} cy={54} r={7} fill={accent} opacity={detail} />
        </>,
      ),
      size,
      opacity,
    );
  }

  // modern
  return wrap(
    body(
      <>
        {[
          [26, 96, 34],
          [64, 58, 30],
          [98, 34, 40],
          [142, 74, 26],
          [172, 112, 22],
        ].map(([x, y, w], i) => (
          <g key={i} opacity={ramp(p, [0.06 + i * 0.10, 0.32 + i * 0.10], [0, 1])}>
            <rect x={x} y={y} width={w} height={186 - y} fill={color} opacity={0.92 - i * 0.04} />
            {/* window grid */}
            {new Array(Math.floor((186 - y) / 15)).fill(0).map((__, k) => (
              <rect key={k} x={x + 5} y={y + 9 + k * 15} width={w - 10} height={5} fill={C.paperHi} opacity={0.24 * detail} />
            ))}
          </g>
        ))}
        <rect x={112} y={16} width={4} height={20} fill={accent} opacity={detail} />
      </>,
    ),
    size,
    opacity,
  );
};

// ===========================================================================
// DANCE — eight traditions, as stylised line figures.
// ===========================================================================
type Pose = {
  head: [number, number];
  hip: [number, number];
  armL: [number, number][];
  armR: [number, number][];
  legL: [number, number][];
  legR: [number, number][];
  skirt: 'flare' | 'cylinder' | 'wide' | 'none';
  crown: 'none' | 'tall' | 'disc' | 'turban';
};

export const DANCES: {name: string; where: string; pose: Pose}[] = [
  {
    name: 'Bharatanatyam',
    where: 'Tamil Nadu',
    // araimandi — the half-seated stance with knees turned out
    pose: {
      head: [100, 42], hip: [100, 112],
      armL: [[86, 66], [56, 74], [30, 66]], armR: [[114, 66], [144, 74], [170, 66]],
      legL: [[100, 112], [66, 148], [64, 190]], legR: [[100, 112], [134, 148], [136, 190]],
      skirt: 'flare', crown: 'disc',
    },
  },
  {
    name: 'Kathak',
    where: 'Uttar Pradesh',
    // upright, mid-spin, one arm lifted
    pose: {
      head: [100, 40], hip: [100, 116],
      armL: [[86, 62], [60, 48], [46, 22]], armR: [[114, 62], [140, 82], [156, 104]],
      legL: [[100, 116], [88, 152], [84, 192]], legR: [[100, 116], [116, 150], [124, 192]],
      skirt: 'wide', crown: 'none',
    },
  },
  {
    name: 'Odissi',
    where: 'Odisha',
    // tribhanga — the three-bend posture
    pose: {
      head: [92, 42], hip: [108, 114],
      armL: [[80, 66], [52, 78], [34, 60]], armR: [[112, 64], [138, 58], [150, 34]],
      legL: [[108, 114], [76, 150], [72, 190]], legR: [[108, 114], [132, 152], [138, 190]],
      skirt: 'flare', crown: 'tall',
    },
  },
  {
    name: 'Kathakali',
    where: 'Kerala',
    // wide stance, the great headdress
    pose: {
      head: [100, 52], hip: [100, 118],
      armL: [[84, 74], [48, 68], [24, 84]], armR: [[116, 74], [152, 68], [176, 84]],
      legL: [[100, 118], [58, 152], [50, 192]], legR: [[100, 118], [142, 152], [150, 192]],
      skirt: 'wide', crown: 'tall',
    },
  },
  {
    name: 'Manipuri',
    where: 'Manipur',
    // contained and gentle, in the cylindrical potloi
    pose: {
      head: [100, 44], hip: [100, 114],
      armL: [[88, 66], [66, 84], [58, 108]], armR: [[112, 66], [134, 84], [142, 108]],
      legL: [[100, 114], [92, 152], [90, 190]], legR: [[100, 114], [110, 152], [112, 190]],
      skirt: 'cylinder', crown: 'disc',
    },
  },
  {
    name: 'Bhangra',
    where: 'Punjab',
    // mid-leap, both arms thrown up
    pose: {
      head: [100, 36], hip: [100, 106],
      armL: [[86, 58], [58, 36], [44, 8]], armR: [[114, 58], [142, 36], [156, 8]],
      legL: [[100, 106], [64, 132], [46, 164]], legR: [[100, 106], [130, 140], [140, 178]],
      skirt: 'none', crown: 'turban',
    },
  },
  {
    name: 'Garba',
    where: 'Gujarat',
    // hands meeting overhead, skirt flaring with the turn
    pose: {
      head: [100, 44], hip: [100, 116],
      armL: [[86, 64], [66, 40], [96, 20]], armR: [[114, 64], [134, 40], [104, 20]],
      legL: [[100, 116], [82, 152], [78, 190]], legR: [[100, 116], [120, 152], [126, 190]],
      skirt: 'wide', crown: 'none',
    },
  },
  {
    name: 'Bihu',
    where: 'Assam',
    // bent forward from the waist, arms swept out
    pose: {
      head: [88, 54], hip: [104, 118],
      armL: [[78, 76], [46, 88], [26, 76]], armR: [[112, 74], [146, 86], [168, 74]],
      legL: [[104, 118], [84, 152], [80, 190]], legR: [[104, 118], [126, 152], [132, 190]],
      skirt: 'cylinder', crown: 'none',
    },
  },
];

export const Dancer: React.FC<Art & {pose: Pose}> = ({
  pose,
  size = 320,
  color = C.ivory,
  accent = C.saffronOnNight,
  p = 1,
  opacity = 1,
}) => {
  const a = ramp(p, [0, 0.55], [0, 1], EASE_OUT);
  const b = ramp(p, [0.2, 0.85], [0, 1], EASE_OUT);
  const limb = (pts: [number, number][], key: string, w = 8) => (
    <path
      key={key}
      d={smoothPath(pts, false, 0.6)}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={200}
      strokeDashoffset={200 * (1 - b)}
    />
  );
  const skirt = () => {
    if (pose.skirt === 'none') return null;
    const [hx, hy] = pose.hip;
    const spread = pose.skirt === 'wide' ? 56 : pose.skirt === 'flare' ? 44 : 26;
    const drop = pose.skirt === 'cylinder' ? 74 : 62;
    return (
      <path
        d={`M ${hx - 20} ${hy - 4} L ${hx + 20} ${hy - 4} L ${hx + spread} ${hy + drop} Q ${hx} ${hy + drop + 16} ${hx - spread} ${hy + drop} Z`}
        fill={accent}
        // a low fill alpha over the indigo ground turned the costume muddy
        // brown; keep it saturated and let the stroke define the edge
        opacity={0.62 * b}
        stroke={accent}
        strokeWidth={3}
        strokeOpacity={0.95 * b}
        strokeLinejoin="round"
      />
    );
  };
  const crown = () => {
    const [hx, hy] = pose.head;
    if (pose.crown === 'tall')
      return <path d={`M ${hx - 30} ${hy - 12} Q ${hx} ${hy - 62} ${hx + 30} ${hy - 12} Z`} fill={accent} opacity={0.72 * b} />;
    if (pose.crown === 'disc')
      return <ellipse cx={hx} cy={hy - 18} rx={22} ry={7} fill={accent} opacity={0.72 * b} />;
    if (pose.crown === 'turban')
      return <path d={`M ${hx - 20} ${hy - 8} Q ${hx} ${hy - 34} ${hx + 20} ${hy - 8} Q ${hx} ${hy - 2} ${hx - 20} ${hy - 8} Z`} fill={accent} opacity={0.78 * b} />;
    return null;
  };
  return wrap(
    <g>
      {crown()}
      <circle cx={pose.head[0]} cy={pose.head[1]} r={15} fill={color} opacity={a} />
      {limb([[pose.head[0], pose.head[1] + 15], pose.hip], 'spine', 8)}
      {skirt()}
      {limb([[pose.head[0], pose.head[1] + 22], ...pose.armL], 'armL')}
      {limb([[pose.head[0], pose.head[1] + 22], ...pose.armR], 'armR')}
      {limb(pose.legL, 'legL')}
      {limb(pose.legR, 'legR')}
      {/* ankle bells */}
      <g opacity={0.85 * b}>
        <circle cx={pose.legL[2][0]} cy={pose.legL[2][1] - 6} r={4.6} fill={accent} />
        <circle cx={pose.legR[2][0]} cy={pose.legR[2][1] - 6} r={4.6} fill={accent} />
      </g>
    </g>,
    size,
    opacity,
  );
};

// ===========================================================================
// INSTRUMENTS
// ===========================================================================
export type InstKind = 'sitar' | 'tabla' | 'mridangam' | 'sarod' | 'bansuri' | 'veena' | 'dhol' | 'nadaswaram';

export const INSTRUMENTS: {kind: InstKind; name: string}[] = [
  {kind: 'sitar', name: 'Sitar'},
  {kind: 'tabla', name: 'Tabla'},
  {kind: 'veena', name: 'Veena'},
  {kind: 'mridangam', name: 'Mridangam'},
  {kind: 'bansuri', name: 'Bansuri'},
  {kind: 'sarod', name: 'Sarod'},
  {kind: 'dhol', name: 'Dhol'},
  {kind: 'nadaswaram', name: 'Nadaswaram'},
];

export const Instrument: React.FC<Art & {kind: InstKind}> = ({
  kind,
  size = 300,
  color = C.ivory,
  accent = C.gold,
  p = 1,
  opacity = 1,
}) => {
  const d1 = ramp(p, [0, 0.6], [0, 1], EASE_OUT);
  const d2 = ramp(p, [0.28, 0.95], [0, 1], EASE_OUT);
  const dash = (len: number, t: number) => ({strokeDasharray: len, strokeDashoffset: len * (1 - t)});
  const S = {fill: 'none', stroke: color, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

  if (kind === 'sitar' || kind === 'veena') {
    const twoGourd = kind === 'veena';
    return wrap(
      <>
        <ellipse cx={62} cy={146} rx={44} ry={38} {...S} style={dash(280, d1)} />
        <path d="M 96 128 L 178 46" {...S} strokeWidth={9} style={dash(130, d1)} />
        <path d="M 96 136 L 178 54" {...S} strokeWidth={2} opacity={0.5} style={dash(130, d2)} />
        {twoGourd ? <ellipse cx={182} cy={44} rx={20} ry={17} {...S} style={dash(130, d2)} /> : null}
        {/* frets */}
        {new Array(7).fill(0).map((_, i) => {
          const t = 0.12 + i * 0.115;
          const x = 96 + (178 - 96) * t;
          const y = 132 - (132 - 50) * t;
          return <line key={i} x1={x - 5} y1={y - 6} x2={x + 5} y2={y + 6} stroke={accent} strokeWidth={2.4} strokeLinecap="round" opacity={d2} />;
        })}
        {/* tuning pegs */}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={186 + i * 4} cy={38 - i * 9} r={4} fill={accent} opacity={d2} />
        ))}
        <circle cx={62} cy={146} r={11} {...S} strokeWidth={2.4} style={dash(80, d2)} />
      </>,
      size,
      opacity,
    );
  }

  if (kind === 'tabla') {
    return wrap(
      <>
        {/* dayan — the small, pitched drum */}
        <path d="M 52 176 L 58 106 A 26 12 0 0 1 110 106 L 116 176 Z" {...S} style={dash(300, d1)} />
        <ellipse cx={84} cy={106} rx={26} ry={12} {...S} strokeWidth={2.8} style={dash(140, d1)} />
        <circle cx={84} cy={106} r={9} fill={accent} opacity={0.75 * d2} />
        {/* bayan — the bass drum */}
        <path d="M 124 176 L 128 122 A 34 15 0 0 1 196 122 L 200 176 Z" {...S} style={dash(320, d2)} />
        <ellipse cx={162} cy={122} rx={34} ry={15} {...S} strokeWidth={2.8} style={dash(170, d2)} />
        <circle cx={162} cy={122} r={11} fill={accent} opacity={0.7 * d2} />
        {/* the lacing */}
        {new Array(6).fill(0).map((_, i) => (
          <line key={i} x1={56 + i * 11} y1={118} x2={54 + i * 11} y2={172} stroke={color} strokeWidth={1.6} opacity={0.42 * d2} />
        ))}
      </>,
      size,
      opacity,
    );
  }

  if (kind === 'mridangam' || kind === 'dhol') {
    const wide = kind === 'dhol';
    return wrap(
      <>
        <path
          d={`M 30 ${wide ? 96 : 100} C 62 ${wide ? 60 : 68}, 138 ${wide ? 60 : 68}, 170 ${wide ? 96 : 100}
              C 138 ${wide ? 156 : 148}, 62 ${wide ? 156 : 148}, 30 ${wide ? 96 : 100} Z`}
          {...S}
          style={dash(430, d1)}
        />
        <ellipse cx={30} cy={wide ? 96 : 100} rx={9} ry={wide ? 30 : 26} {...S} strokeWidth={2.8} style={dash(150, d2)} />
        <ellipse cx={170} cy={wide ? 96 : 100} rx={9} ry={wide ? 32 : 28} {...S} strokeWidth={2.8} style={dash(150, d2)} />
        {new Array(7).fill(0).map((_, i) => (
          <line key={i} x1={38 + i * 20} y1={wide ? 66 : 72} x2={38 + i * 20} y2={wide ? 126 : 128} stroke={accent} strokeWidth={1.8} opacity={0.5 * d2} />
        ))}
        {wide ? <path d="M 44 70 C 70 20, 130 20, 156 70" {...S} strokeWidth={2.4} opacity={0.6} style={dash(180, d2)} /> : null}
      </>,
      size,
      opacity,
    );
  }

  if (kind === 'bansuri' || kind === 'nadaswaram') {
    const conical = kind === 'nadaswaram';
    return wrap(
      <>
        {conical ? (
          <>
            <path d="M 34 88 L 150 116 L 150 146 L 34 106 Z" {...S} style={dash(340, d1)} />
            <path d="M 150 108 L 186 100 L 186 162 L 150 154 Z" {...S} style={dash(200, d2)} />
            <circle cx={30} cy={97} r={7} fill={accent} opacity={d2} />
          </>
        ) : (
          <>
            <path d="M 24 132 L 178 96 L 178 122 L 24 158 Z" {...S} style={dash(370, d1)} />
            <ellipse cx={178} cy={109} rx={4} ry={13} {...S} strokeWidth={2.4} style={dash(80, d2)} />
          </>
        )}
        {new Array(6).fill(0).map((_, i) => {
          const t = 0.24 + i * 0.115;
          const x = conical ? 34 + 116 * t : 24 + 154 * t;
          const y = conical ? 97 + 28 * t : 145 - 36 * t;
          return <circle key={i} cx={x} cy={y} r={4.2} fill={accent} opacity={0.85 * d2} />;
        })}
      </>,
      size,
      opacity,
    );
  }

  // sarod — fretless, with a skin-covered body and a bright metal fingerboard
  return wrap(
    <>
      <path d="M 40 148 C 40 108, 76 92, 100 96 L 100 178 C 74 182, 40 178, 40 148 Z" {...S} style={dash(300, d1)} />
      <path d="M 100 96 L 100 178 L 176 152 L 176 74 Z" {...S} style={dash(330, d1)} />
      <path d="M 176 74 L 196 62 L 196 96 L 176 108 Z" {...S} style={dash(140, d2)} />
      <path d="M 108 104 L 172 82" stroke={accent} strokeWidth={2.4} strokeLinecap="round" opacity={d2} />
      <path d="M 108 118 L 172 96" stroke={accent} strokeWidth={1.8} strokeLinecap="round" opacity={0.7 * d2} />
      <circle cx={70} cy={140} r={12} {...S} strokeWidth={2.4} style={dash(80, d2)} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={190 + (i % 2) * 4} cy={68 + i * 10} r={3.4} fill={accent} opacity={d2} />
      ))}
    </>,
    size,
    opacity,
  );
};

// ===========================================================================
// CRAFT — block-print buta, weave, and a potter's form.
// ===========================================================================
export const BlockPrint: React.FC<Art & {rows?: number; cols?: number}> = ({
  size = 500,
  color = C.saffronOnPaper,
  accent = C.greenOnPaper,
  p = 1,
  opacity = 1,
  rows = 4,
  cols = 5,
}) => (
  <svg width={size} height={size * (200 / 268)} viewBox="-9 0 268 200" style={{overflow: 'visible', opacity, display: 'block'}}>
    {new Array(rows * cols).fill(0).map((_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const a = ramp(p, [(i / (rows * cols)) * 0.62, (i / (rows * cols)) * 0.62 + 0.3], [0, 1], EASE_OUT);
      if (a <= 0.001) return null;
      const x = 25 + c * 50 + (r % 2) * 12;
      const y = 26 + r * 48;
      const col = (r + c) % 2 === 0 ? color : accent;
      return (
        <g key={i} opacity={a} transform={`translate(${x} ${y}) scale(${0.7 + a * 0.3})`}>
          {/* the buta / paisley figure */}
          <path
            d="M 0 18 C -16 8, -16 -12, -2 -18 C 10 -23, 20 -14, 18 -2 C 16 10, 6 14, 0 18 Z"
            fill="none"
            stroke={col}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <path d="M 0 18 C 2 8, 6 0, 12 -6" fill="none" stroke={col} strokeWidth={1.6} strokeLinecap="round" opacity={0.75} />
          <circle cx={4} cy={-6} r={2.6} fill={col} />
        </g>
      );
    })}
  </svg>
);

export const WeaveGrid: React.FC<Art & {n?: number}> = ({
  size = 400,
  color = C.saffronOnPaper,
  accent = C.greenOnPaper,
  p = 1,
  opacity = 1,
  n = 11,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', opacity}}>
    {new Array(n).fill(0).map((_, i) => {
      const t = ramp(p, [(i / n) * 0.5, (i / n) * 0.5 + 0.34], [0, 1], EASE_OUT);
      const y = 12 + i * ((200 - 24) / (n - 1));
      return (
        <line
          key={`h${i}`}
          x1={10}
          y1={y}
          x2={10 + 180 * t}
          y2={y}
          stroke={i % 3 === 0 ? accent : color}
          strokeWidth={i % 3 === 0 ? 4 : 2.2}
          strokeLinecap="round"
          opacity={0.8}
        />
      );
    })}
    {new Array(n).fill(0).map((_, i) => {
      const t = ramp(p, [0.22 + (i / n) * 0.5, 0.22 + (i / n) * 0.5 + 0.34], [0, 1], EASE_OUT);
      const x = 12 + i * ((200 - 24) / (n - 1));
      return (
        <line
          key={`v${i}`}
          x1={x}
          y1={10}
          x2={x}
          y2={10 + 180 * t}
          stroke={i % 3 === 0 ? color : accent}
          strokeWidth={i % 3 === 0 ? 3.4 : 1.8}
          strokeLinecap="round"
          opacity={0.55}
        />
      );
    })}
  </svg>
);

// ===========================================================================
// FESTIVALS — eight, spanning faiths and regions, at equal visual weight.
// ===========================================================================
export type FestKind = 'diya' | 'holi' | 'kite' | 'crescent' | 'star' | 'harvest' | 'pongal' | 'dhaak';

export const FESTIVALS: {kind: FestKind; name: string}[] = [
  {kind: 'diya', name: 'Diwali'},
  {kind: 'holi', name: 'Holi'},
  {kind: 'crescent', name: 'Eid'},
  {kind: 'kite', name: 'Makar Sankranti'},
  {kind: 'star', name: 'Christmas'},
  {kind: 'harvest', name: 'Baisakhi'},
  {kind: 'pongal', name: 'Pongal'},
  {kind: 'dhaak', name: 'Durga Puja'},
];

export const Festival: React.FC<Art & {kind: FestKind; f?: number}> = ({
  kind,
  size = 240,
  color = C.gold,
  accent = C.saffronOnNight,
  p = 1,
  opacity = 1,
  f = 0,
}) => {
  const a = ramp(p, [0, 0.5], [0, 1], EASE_OUT);
  const b = ramp(p, [0.25, 0.9], [0, 1], EASE_OUT);
  const S = {fill: 'none', stroke: color, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

  if (kind === 'diya') {
    const flick = 1 + Math.sin(f * 0.34) * 0.09;
    return wrap(
      <g opacity={a}>
        <path d="M 46 128 C 46 152, 154 152, 154 128 C 154 122, 46 122, 46 128 Z" fill={color} opacity={0.9} />
        <path d="M 46 128 C 46 118, 154 118, 154 128" {...S} strokeWidth={2.6} />
        <ellipse cx={100} cy={150} rx={44} ry={7} fill={color} opacity={0.22} />
        <g transform={`translate(100 118) scale(${flick}) translate(-100 -118)`} opacity={b}>
          <path d="M 100 62 C 118 88, 116 106, 100 118 C 84 106, 82 88, 100 62 Z" fill={accent} opacity={0.95} />
          <path d="M 100 84 C 108 98, 107 108, 100 116 C 93 108, 92 98, 100 84 Z" fill="#FFF3D6" opacity={0.92} />
        </g>
        <circle cx={100} cy={100} r={60 * b} fill={accent} opacity={0.10 * b} />
      </g>,
      size,
      opacity,
    );
  }

  if (kind === 'holi') {
    return wrap(
      <g opacity={a}>
        {new Array(48).fill(0).map((_, i) => {
          const ang = (i / 48) * Math.PI * 2 + rnd(i) * 0.6;
          const dist = (26 + rnd(i * 3) * 74) * b;
          const r = 3 + rnd(i * 7) * 8;
          const cols = [C.saffron, '#E8467C', C.green, C.gold, '#7A5AF8', '#22B8CF'];
          return (
            <circle
              key={i}
              cx={100 + Math.cos(ang) * dist}
              cy={100 + Math.sin(ang) * dist}
              r={r * (0.4 + b * 0.6)}
              fill={cols[i % cols.length]}
              opacity={0.30 + rnd(i * 11) * 0.5}
            />
          );
        })}
        <circle cx={100} cy={100} r={15} fill={C.gold} opacity={0.85} />
      </g>,
      size,
      opacity,
    );
  }

  if (kind === 'kite') {
    const sway = Math.sin(f * 0.10) * 9;
    return wrap(
      <g opacity={a} transform={`rotate(${sway} 100 60)`}>
        <path d="M 100 26 L 148 84 L 100 148 L 52 84 Z" fill={accent} opacity={0.55} />
        <path d="M 100 26 L 148 84 L 100 148 L 52 84 Z" {...S} />
        <path d="M 100 26 L 100 148 M 52 84 L 148 84" stroke={color} strokeWidth={2.2} opacity={0.75} />
        <path
          d={`M 100 148 C ${94 + sway} 166, ${108 - sway} 178, ${98 + sway} 196`}
          {...S}
          strokeWidth={2.4}
          opacity={b}
        />
        {/* the paper bows along the tail */}
        {[160, 174, 188].map((y) => (
          <circle key={y} cx={100 + Math.sin(y * 0.2 + f * 0.1) * 6} cy={y} r={3.4} fill={C.green} opacity={0.7 * b} />
        ))}
      </g>,
      size,
      opacity,
    );
  }

  if (kind === 'crescent') {
    return wrap(
      <g opacity={a}>
        <path d="M 122 40 A 58 58 0 1 0 122 156 A 46 46 0 1 1 122 40 Z" fill={color} opacity={0.92} />
        <path d="M 150 62 l 4 12 12 4 -12 4 -4 12 -4 -12 -12 -4 12 -4 Z" fill={accent} opacity={b} />
        {/* a hanging lantern */}
        <g opacity={b} transform={`rotate(${Math.sin(f * 0.08) * 5} 158 108)`}>
          <line x1={158} y1={92} x2={158} y2={104} stroke={color} strokeWidth={2.2} />
          <path d="M 146 106 L 170 106 L 176 128 L 158 142 L 140 128 Z" {...S} strokeWidth={2.6} />
          <circle cx={158} cy={122} r={5} fill={accent} opacity={0.9} />
        </g>
      </g>,
      size,
      opacity,
    );
  }

  if (kind === 'star') {
    const pts: string[] = [];
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? 70 : 26;
      const ang = (i / 16) * Math.PI * 2 - Math.PI / 2;
      pts.push(`${100 + Math.cos(ang) * r},${94 + Math.sin(ang) * r}`);
    }
    return wrap(
      <g opacity={a}>
        <polygon points={pts.join(' ')} fill={color} opacity={0.34 * b} />
        <polygon points={pts.join(' ')} {...S} strokeWidth={2.8} />
        <circle cx={100} cy={94} r={10} fill={accent} opacity={0.9 * b} />
        <path d="M 100 164 L 100 186" stroke={color} strokeWidth={2.4} strokeLinecap="round" opacity={0.6 * b} />
      </g>,
      size,
      opacity,
    );
  }

  if (kind === 'harvest') {
    return wrap(
      <g opacity={a}>
        {[-1, 0, 1].map((k, i) => (
          <g key={i} transform={`rotate(${k * 15} 100 172)`}>
            <path d={`M 100 172 C ${100 - k * 6} 130, ${100 - k * 4} 100, 100 66`} {...S} strokeWidth={2.8} />
            {new Array(6).fill(0).map((__, j) => {
              const y = 76 + j * 15;
              const t = ramp(p, [0.2 + j * 0.08, 0.5 + j * 0.08], [0, 1]);
              return (
                <g key={j} opacity={t}>
                  <ellipse cx={100 - 9} cy={y} rx={7} ry={4.2} fill={color} opacity={0.85} transform={`rotate(-32 ${100 - 9} ${y})`} />
                  <ellipse cx={100 + 9} cy={y} rx={7} ry={4.2} fill={color} opacity={0.85} transform={`rotate(32 ${100 + 9} ${y})`} />
                </g>
              );
            })}
          </g>
        ))}
        <path d="M 74 172 C 100 182, 100 182, 126 172" {...S} strokeWidth={4} stroke={accent} />
      </g>,
      size,
      opacity,
    );
  }

  if (kind === 'pongal') {
    return wrap(
      <g opacity={a}>
        <path d="M 62 108 C 62 92, 138 92, 138 108 L 148 168 C 148 182, 52 182, 52 168 Z" {...S} />
        <ellipse cx={100} cy={106} rx={38} ry={11} {...S} strokeWidth={2.8} />
        {/* the pot boiling over — the moment the festival is named for */}
        <g opacity={b}>
          <path d="M 66 104 C 60 88, 74 82, 78 96" fill={color} opacity={0.75} />
          <path d="M 134 104 C 140 88, 126 82, 122 96" fill={color} opacity={0.75} />
          <path d="M 100 96 C 88 76, 112 70, 106 52" {...S} strokeWidth={2.6} stroke={accent} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={86 + i * 15} cy={72 - i * 9 - Math.sin(f * 0.14 + i) * 5} r={4 - i * 0.6} fill={accent} opacity={0.75} />
          ))}
        </g>
        <path d="M 72 138 L 128 138" stroke={accent} strokeWidth={3.4} strokeLinecap="round" opacity={0.7 * b} />
      </g>,
      size,
      opacity,
    );
  }

  // dhaak — the barrel drum of the Durga Puja processions
  const beat = Math.sin(f * 0.42) * 3;
  return wrap(
    <g opacity={a} transform={`translate(0 ${beat})`}>
      <path d="M 56 66 L 62 158 C 62 172, 138 172, 138 158 L 144 66 C 144 54, 56 54, 56 66 Z" {...S} />
      <ellipse cx={100} cy={66} rx={44} ry={13} {...S} strokeWidth={2.8} />
      {new Array(7).fill(0).map((_, i) => (
        <line key={i} x1={60 + i * 13} y1={72} x2={62 + i * 13} y2={162} stroke={accent} strokeWidth={1.8} opacity={0.5 * b} />
      ))}
      {/* the sticks, mid-strike */}
      <g opacity={b}>
        <line x1={40} y1={30} x2={86} y2={58} stroke={color} strokeWidth={4} strokeLinecap="round" />
        <line x1={162} y1={26} x2={116} y2={56} stroke={color} strokeWidth={4} strokeLinecap="round" />
      </g>
      {/* the sound coming off the head */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={100}
          cy={66}
          rx={44 + i * 16 + Math.abs(beat) * 4}
          ry={13 + i * 5}
          fill="none"
          stroke={accent}
          strokeWidth={1.6}
          opacity={(0.34 - i * 0.09) * b}
        />
      ))}
    </g>,
    size,
    opacity,
  );
};
