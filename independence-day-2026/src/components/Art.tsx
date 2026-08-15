import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {EASE_IN_OUT, EASE_OUT, EASE_SLOW, ramp, rnd} from '../lib/anim';

/**
 * NATIONAL SYMBOLS — the Chakra, the tricolour, the map, and the two motifs
 * that carry the freedom-struggle beat.
 *
 * Every path here is authored from scratch as geometry. Nothing is traced from
 * a photograph or an existing illustration, which is what keeps a heritage
 * reel clear of both stock licensing and the uncanny errors an image model
 * makes when asked to draw a real monument.
 */

// ---------------------------------------------------------------------------
// Catmull-Rom -> cubic Bezier, so outlines defined as point lists come out
// organic rather than faceted.
// ---------------------------------------------------------------------------
export const smoothPath = (pts: [number, number][], closed = true, tension = 1): string => {
  const n = pts.length;
  if (n < 2) return '';
  const at = (i: number): [number, number] =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return closed ? d + ' Z' : d;
};

// ---------------------------------------------------------------------------
// THE ASHOKA CHAKRA — 24 spokes, as adopted on the national flag in 1947.
// ---------------------------------------------------------------------------
export const AshokaChakra: React.FC<{
  size: number;
  /** 0..1 — how much of the wheel has drawn itself. */
  progress?: number;
  color?: string;
  /** Continuous rotation in degrees. */
  spin?: number;
  strokeScale?: number;
  opacity?: number;
}> = ({size, progress = 1, color = C.chakraOnNight, spin = 0, strokeScale = 1, opacity = 1}) => {
  const R = 100;
  const rimC = 2 * Math.PI * R;
  const spokes = 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-110 -110 220 220"
      style={{overflow: 'visible', opacity, transform: `rotate(${spin}deg)`}}
    >
      {/* outer rim, drawing itself */}
      <circle
        cx={0}
        cy={0}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={5.5 * strokeScale}
        strokeLinecap="round"
        strokeDasharray={rimC}
        strokeDashoffset={rimC * (1 - Math.min(1, progress / 0.45))}
        transform="rotate(-90)"
      />
      {/* inner hub */}
      <circle
        cx={0}
        cy={0}
        r={13}
        fill={color}
        opacity={ramp(progress, [0.42, 0.58], [0, 1])}
      />
      <circle
        cx={0}
        cy={0}
        r={24}
        fill="none"
        stroke={color}
        strokeWidth={3 * strokeScale}
        opacity={ramp(progress, [0.44, 0.62], [0, 1])}
      />
      {/* the 24 spokes, appearing in sequence */}
      {new Array(spokes).fill(0).map((_, i) => {
        const a = (i / spokes) * 360;
        const start = 0.40 + (i / spokes) * 0.52;
        const p = ramp(progress, [start, start + 0.09], [0, 1], EASE_OUT);
        if (p <= 0.001) return null;
        return (
          <g key={i} transform={`rotate(${a})`} opacity={p}>
            <line
              x1={0}
              y1={-24}
              x2={0}
              y2={-100 + (1 - p) * 40}
              stroke={color}
              strokeWidth={3.4 * strokeScale}
              strokeLinecap="round"
            />
            {/* the small bulb where each spoke meets the rim */}
            <circle cx={0} cy={-92} r={4.6} fill={color} opacity={p} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// THE TRICOLOUR — a cloth ribbon with a travelling wave, not a flat rectangle.
// ---------------------------------------------------------------------------
export const TricolourRibbon: React.FC<{
  w: number;
  h: number;
  /** Animation phase in frames. */
  f: number;
  amp?: number;
  /** 0..1 sweep-in from the left. */
  reveal?: number;
  chakra?: boolean;
  opacity?: number;
}> = ({w, h, f, amp = 26, reveal = 1, chakra = true, opacity = 1}) => {
  const cols = 48;
  const bandH = h / 3;
  const wave = (x: number, band: number) =>
    Math.sin((x / w) * Math.PI * 2.1 - f * 0.075 + band * 0.5) * amp * (0.35 + (x / w) * 0.9);

  const band = (i: number, fill: string) => {
    const pts: string[] = [];
    for (let c = 0; c <= cols; c++) {
      const x = (c / cols) * w;
      pts.push(`${x.toFixed(1)},${(i * bandH + wave(x, i)).toFixed(1)}`);
    }
    for (let c = cols; c >= 0; c--) {
      const x = (c / cols) * w;
      pts.push(`${x.toFixed(1)},${((i + 1) * bandH + wave(x, i + 1)).toFixed(1)}`);
    }
    return <polygon key={i} points={pts.join(' ')} fill={fill} />;
  };

  const clipW = w * reveal;

  // The cloth outline: band 0's top edge across, then band 3's bottom edge
  // back. Used to confine the shading gradient to the ribbon itself — painting
  // it over the full svg rect left a visible dark box around the flag.
  const clothPts: string[] = [];
  for (let c = 0; c <= cols; c++) {
    const x = (c / cols) * w;
    clothPts.push(`${x.toFixed(1)},${wave(x, 0).toFixed(1)}`);
  }
  for (let c = cols; c >= 0; c--) {
    const x = (c / cols) * w;
    clothPts.push(`${x.toFixed(1)},${(3 * bandH + wave(x, 3)).toFixed(1)}`);
  }

  // Ids must be unique per instance: two ribbons alive at once during a
  // cross-dissolve would otherwise share one clip path.
  const uid = React.useId().replace(/:/g, '');
  const idReveal = `tri-reveal-${uid}`;
  const idShade = `tri-shade-${uid}`;
  const idCloth = `tri-cloth-${uid}`;

  return (
    <svg width={w} height={h + amp * 3} viewBox={`0 ${-amp} ${w} ${h + amp * 2}`} style={{overflow: 'visible', opacity}}>
      <defs>
        <clipPath id={idReveal}>
          <rect x={0} y={-amp * 2} width={clipW} height={h + amp * 4} />
        </clipPath>
        <clipPath id={idCloth}>
          <polygon points={clothPts.join(' ')} />
        </clipPath>
        <linearGradient id={idShade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="28%" stopColor="#000" stopOpacity="0" />
          <stop offset="62%" stopColor="#000" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${idReveal})`}>
        {band(0, C.saffron)}
        {band(1, '#FFFFFF')}
        {band(2, C.green)}
        {chakra ? (
          <g
            transform={`translate(${w * 0.5}, ${bandH * 1.5 + wave(w * 0.5, 1.5)}) scale(${(bandH * 0.78) / 200})`}
            opacity={0.95}
          >
            <circle cx={0} cy={0} r={100} fill="none" stroke={C.chakra} strokeWidth={7} />
            <circle cx={0} cy={0} r={15} fill={C.chakra} />
            {new Array(24).fill(0).map((_, i) => (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={0}
                y2={-98}
                stroke={C.chakra}
                strokeWidth={5}
                strokeLinecap="round"
                transform={`rotate(${(i / 24) * 360})`}
              />
            ))}
          </g>
        ) : null}
        {/* cloth shading so the ribbon reads as fabric, not as three stripes —
            clipped to the cloth so it never paints a box on the background */}
        <g clipPath={`url(#${idCloth})`}>
          <rect x={0} y={-amp * 2} width={w} height={h + amp * 4} fill={`url(#${idShade})`} />
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// THE MAP — a stylised outline, drawn as one continuous stroke.
// Simplified deliberately: this is a symbol of the whole country in a 4-second
// beat, not a survey document.
// ---------------------------------------------------------------------------
// Projected from real longitude/latitude onto the 400x470 viewBox
// (x: 67°E..98°E, y: 37°N..7°N), then smoothed. Forty-seven points, because a
// sparser list smooths away exactly the features that make the outline
// readable as India — the Kutch and Saurashtra coast in the west, the
// Bangladesh re-entrant in the east, and the taper to Kanyakumari.
const INDIA: [number, number][] = [
  [129, 24], [154, 38], [161, 60], [155, 86],
  [170, 110], [206, 141], [239, 150], [271, 160],
  [277, 143], [297, 158], [316, 160], [329, 149],
  [355, 138], [385, 136], [378, 157], [361, 172],
  [355, 197], [341, 219], [334, 237], [325, 208],
  [312, 218], [295, 185], [276, 199], [272, 241],
  [257, 251], [232, 274], [213, 298], [187, 329],
  [172, 352], [170, 392], [165, 418], [135, 453],
  [123, 431], [110, 400], [101, 368], [88, 337],
  [76, 290], [74, 251], [50, 252], [25, 230],
  [19, 208], [45, 199], [39, 164], [71, 141],
  [89, 102], [94, 70], [90, 39],
];

export const INDIA_PATH = smoothPath(INDIA, true, 0.55);

/** Anchor points, spread deliberately across every region of the country. */
export const REGION_POINTS: {x: number; y: number; label: string}[] = [
  {x: 128, y: 62, label: 'North'},
  {x: 90, y: 150, label: 'North-West'},
  {x: 150, y: 196, label: 'West'},
  {x: 214, y: 168, label: 'Gangetic plain'},
  {x: 340, y: 168, label: 'North-East'},
  {x: 262, y: 216, label: 'East'},
  {x: 176, y: 258, label: 'Central'},
  {x: 108, y: 306, label: 'Konkan'},
  {x: 210, y: 300, label: 'Deccan'},
  {x: 156, y: 372, label: 'South-West'},
  {x: 168, y: 414, label: 'South-East'},
];

export const IndiaMap: React.FC<{
  size: number;
  /** 0..1 — how much of the outline has drawn itself. */
  progress?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  /** 0..1 — how lit the regional anchor points are. */
  points?: number;
  pointColor?: string;
  opacity?: number;
}> = ({
  size,
  progress = 1,
  color = C.chakraOnPaper,
  fill = 'none',
  strokeWidth = 3.2,
  points = 0,
  pointColor = C.saffron,
  opacity = 1,
}) => {
  // The smoothed outline measures ~1600 units; the dash reveal only needs a
  // value at or above the true length, and a close one keeps the draw linear
  // across the whole progress range instead of finishing early.
  const LEN = 1640;
  return (
    <svg
      width={size}
      height={size * (470 / 400)}
      viewBox="0 0 400 470"
      style={{overflow: 'visible', opacity}}
    >
      <path
        d={INDIA_PATH}
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={LEN}
        strokeDashoffset={LEN * (1 - progress)}
        opacity={fill === 'none' ? 1 : ramp(progress, [0.8, 1], [0, 1])}
      />
      {REGION_POINTS.map((p, i) => {
        const start = (i / REGION_POINTS.length) * 0.72;
        const a = ramp(points, [start, start + 0.26], [0, 1], EASE_OUT);
        if (a <= 0.001) return null;
        return (
          <g key={p.label} opacity={a}>
            <circle cx={p.x} cy={p.y} r={13 * (1 - a) + 5} fill="none" stroke={pointColor} strokeWidth={2} opacity={1 - a * 0.55} />
            <circle cx={p.x} cy={p.y} r={5.2} fill={pointColor} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// THE CHARKHA — the spinning wheel of the freedom struggle.
// ---------------------------------------------------------------------------
export const Charkha: React.FC<{
  size: number;
  f: number;
  color?: string;
  accent?: string;
  reveal?: number;
  opacity?: number;
}> = ({size, f, color = C.ivorySoft, accent = C.saffron, reveal = 1, opacity = 1}) => {
  const spin = f * 2.6;
  const rimC = 2 * Math.PI * 92;
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220" style={{overflow: 'visible', opacity}}>
      {/* wheel rim */}
      <circle
        cx={0}
        cy={0}
        r={92}
        fill="none"
        stroke={color}
        strokeWidth={4.5}
        strokeDasharray={rimC}
        strokeDashoffset={rimC * (1 - Math.min(1, reveal / 0.5))}
        transform="rotate(-90)"
      />
      <circle cx={0} cy={0} r={80} fill="none" stroke={color} strokeWidth={1.6} opacity={0.5 * ramp(reveal, [0.3, 0.6], [0, 1])} />
      {/* thin radial spokes, spinning */}
      <g transform={`rotate(${spin})`}>
        {new Array(16).fill(0).map((_, i) => {
          const p = ramp(reveal, [0.35 + (i / 16) * 0.4, 0.45 + (i / 16) * 0.4], [0, 1]);
          if (p <= 0.001) return null;
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={0}
              y2={-90}
              stroke={color}
              strokeWidth={1.7}
              strokeLinecap="round"
              opacity={0.72 * p}
              transform={`rotate(${(i / 16) * 360})`}
            />
          );
        })}
        <circle cx={0} cy={0} r={11} fill={color} opacity={ramp(reveal, [0.3, 0.5], [0, 1])} />
      </g>
      {/* the thread coming off the wheel */}
      <path
        d="M 92 6 C 130 22, 150 54, 148 96"
        fill="none"
        stroke={accent}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={120}
        strokeDashoffset={120 * (1 - ramp(reveal, [0.62, 1], [0, 1]))}
      />
      <circle cx={0} cy={0} r={4} fill={accent} opacity={ramp(reveal, [0.5, 0.7], [0, 1])} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// THE CHAIN — two links under strain, then parted.
// ---------------------------------------------------------------------------
export const BreakingChain: React.FC<{
  w: number;
  /** 0..1 — 0 intact, 1 fully parted. */
  progress: number;
  color?: string;
  opacity?: number;
}> = ({w, progress, color = C.ivoryDim, opacity = 1}) => {
  const part = ramp(progress, [0.55, 1], [0, 1], EASE_OUT);
  const strain = ramp(progress, [0, 0.55], [0, 1], EASE_IN_OUT);
  const gap = part * 64;
  const link = (cx: number, tilt: number, key: string) => (
    <g key={key} transform={`translate(${cx} 0) rotate(${tilt})`}>
      <ellipse cx={0} cy={0} rx={38} ry={22} fill="none" stroke={color} strokeWidth={7} />
      <ellipse cx={0} cy={0} rx={26} ry={11} fill="none" stroke={color} strokeWidth={2} opacity={0.35} />
    </g>
  );
  return (
    <svg width={w} height={w * 0.30} viewBox="-300 -46 600 92" style={{overflow: 'visible', opacity}}>
      {/* left side, drifting away */}
      <g transform={`translate(${-gap} ${part * 14}) rotate(${-part * 13})`}>
        {link(-214, 0, 'l3')}
        {link(-146, 0, 'l2')}
        {link(-76, -strain * 4, 'l1')}
        {/* the torn end */}
        <path
          d={`M -42 0 C -30 ${-16 - part * 6}, -14 ${-9 - part * 4}, ${-6 - part * 10} ${-part * 5}
              C -14 ${9 + part * 4}, -30 ${16 + part * 6}, -42 0 Z`}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinejoin="round"
        />
      </g>
      {/* right side */}
      <g transform={`translate(${gap} ${-part * 14}) rotate(${part * 13})`}>
        {link(214, 0, 'r3')}
        {link(146, 0, 'r2')}
        {link(76, strain * 4, 'r1')}
        <path
          d={`M 42 0 C 30 ${-16 - part * 6}, 14 ${-9 - part * 4}, ${6 + part * 10} ${part * 5}
              C 14 ${9 + part * 4}, 30 ${16 + part * 6}, 42 0 Z`}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinejoin="round"
        />
      </g>
      {/* The light that comes through the break. This is the emotional beat of
          the whole scene, so it is deliberately the brightest thing in frame
          rather than a faint accent. */}
      {part > 0.01 ? (
        <g opacity={Math.min(1, 0.35 + part * 0.9)}>
          <circle cx={0} cy={0} r={24 + part * 96} fill={C.saffron} opacity={0.13} />
          <circle cx={0} cy={0} r={14 + part * 52} fill={C.saffron} opacity={0.22} />
          {new Array(20).fill(0).map((_, i) => {
            // Reach is deliberately bounded: rays long enough to overrun the
            // headline above turn the beat illegible.
            const a = (i / 20) * 360;
            const r = 22 + part * (78 + (i % 3) * 34);
            return (
              <line
                key={i}
                x1={Math.cos((a * Math.PI) / 180) * 14}
                y1={Math.sin((a * Math.PI) / 180) * 14}
                x2={Math.cos((a * Math.PI) / 180) * r}
                y2={Math.sin((a * Math.PI) / 180) * r}
                stroke={C.saffron}
                strokeWidth={i % 3 === 0 ? 5 : 2.6}
                strokeLinecap="round"
                opacity={0.9}
              />
            );
          })}
          <circle cx={0} cy={0} r={10 + part * 18} fill="#FFE9C2" opacity={0.96} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// SUNRISE — the opening beat's light source.
// ---------------------------------------------------------------------------
export const SunRise: React.FC<{
  w: number;
  h: number;
  /** 0..1 — how far the sun has climbed. */
  progress: number;
  opacity?: number;
}> = ({w, h, progress, opacity = 1}) => {
  const f = useCurrentFrame();
  const cy = h * (0.92 - progress * 0.30);
  const r = w * 0.13;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible', opacity}}>
      <defs>
        <radialGradient id="sun-glow">
          <stop offset="0%" stopColor={C.saffron} stopOpacity="0.72" />
          <stop offset="34%" stopColor={C.saffron} stopOpacity="0.30" />
          <stop offset="100%" stopColor={C.saffron} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-core">
          <stop offset="0%" stopColor="#FFE9C2" stopOpacity="1" />
          <stop offset="58%" stopColor={C.saffron} stopOpacity="0.96" />
          <stop offset="100%" stopColor={C.saffron} stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle cx={w / 2} cy={cy} r={r * 5.4} fill="url(#sun-glow)" />
      {/* slow radial rays */}
      <g transform={`translate(${w / 2} ${cy}) rotate(${f * 0.10})`} opacity={0.30 * progress}>
        {new Array(28).fill(0).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={-r * 1.25}
            x2={0}
            y2={-r * (2.4 + rnd(i) * 2.6)}
            stroke={C.saffron}
            strokeWidth={i % 3 === 0 ? 3.4 : 1.5}
            strokeLinecap="round"
            transform={`rotate(${(i / 28) * 360})`}
          />
        ))}
      </g>
      <circle cx={w / 2} cy={cy} r={r} fill="url(#sun-core)" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// HORIZON — layered land silhouettes with parallax, used under the sunrise.
// ---------------------------------------------------------------------------
export const Horizon: React.FC<{
  w: number;
  h: number;
  f: number;
  /** 0..1 push strength. */
  drift?: number;
  opacity?: number;
}> = ({w, h, f, drift = 1, opacity = 1}) => {
  const layer = (
    yBase: number,
    peaks: [number, number][],
    fill: string,
    par: number,
    key: string,
  ) => {
    const pts: [number, number][] = peaks.map(([x, y]) => [x * w, yBase * h - y * h]);
    const d =
      smoothPath(
        [[-0.08 * w, yBase * h], ...pts, [1.08 * w, yBase * h]],
        false,
        0.85,
      ) + ` L ${1.08 * w} ${h * 1.1} L ${-0.08 * w} ${h * 1.1} Z`;
    return (
      <path
        key={key}
        d={d}
        fill={fill}
        transform={`translate(${Math.sin(f * 0.012) * 10 * par * drift} 0)`}
      />
    );
  };
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{opacity, overflow: 'hidden'}}>
      {layer(0.86, [[0.10, 0.19], [0.26, 0.30], [0.42, 0.22], [0.58, 0.34], [0.74, 0.24], [0.90, 0.31]], 'rgba(11,16,48,0.42)', 1.0, 'far')}
      {layer(0.92, [[0.06, 0.13], [0.22, 0.21], [0.38, 0.15], [0.55, 0.24], [0.72, 0.16], [0.88, 0.22]], 'rgba(6,10,32,0.68)', 0.6, 'mid')}
      {layer(0.99, [[0.14, 0.09], [0.34, 0.14], [0.52, 0.08], [0.70, 0.15], [0.88, 0.10]], 'rgba(4,7,26,0.92)', 0.3, 'near')}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// A slow-rotating rangoli / kolam rosette. Used as a ground ornament.
// ---------------------------------------------------------------------------
export const Rosette: React.FC<{
  size: number;
  f: number;
  petals?: number;
  color?: string;
  color2?: string;
  progress?: number;
  opacity?: number;
}> = ({size, f, petals = 12, color = C.saffron, color2 = C.green, progress = 1, opacity = 1}) => (
  <svg width={size} height={size} viewBox="-110 -110 220 220" style={{overflow: 'visible', opacity}}>
    <g transform={`rotate(${f * 0.16})`}>
      {new Array(petals).fill(0).map((_, i) => {
        const p = ramp(progress, [(i / petals) * 0.55, (i / petals) * 0.55 + 0.3], [0, 1], EASE_SLOW);
        if (p <= 0.001) return null;
        return (
          <g key={i} transform={`rotate(${(i / petals) * 360})`} opacity={p}>
            <path
              d="M 0 -26 C 20 -50, 20 -80, 0 -100 C -20 -80, -20 -50, 0 -26 Z"
              fill="none"
              stroke={i % 2 === 0 ? color : color2}
              strokeWidth={2.6}
              strokeLinejoin="round"
              transform={`scale(${0.6 + p * 0.4})`}
            />
            <circle cx={0} cy={-84} r={3.2} fill={i % 2 === 0 ? color : color2} />
          </g>
        );
      })}
    </g>
    <g transform={`rotate(${-f * 0.22})`} opacity={ramp(progress, [0.3, 0.7], [0, 1])}>
      {new Array(petals / 2).fill(0).map((_, i) => (
        <path
          key={i}
          d="M 0 -12 C 12 -26, 12 -42, 0 -54 C -12 -42, -12 -26, 0 -12 Z"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          transform={`rotate(${(i / (petals / 2)) * 360})`}
          opacity={0.75}
        />
      ))}
    </g>
    <circle cx={0} cy={0} r={7} fill={color} opacity={ramp(progress, [0.55, 0.8], [0, 1])} />
  </svg>
);
