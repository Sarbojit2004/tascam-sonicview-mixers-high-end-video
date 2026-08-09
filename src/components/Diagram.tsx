import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, Part, accent} from '../lib/theme';
import {ramp, rnd} from '../lib/anim';

/**
 * The four vector graphics the creative brief's Section 11 asks for, drawn as
 * native SVG so they render crisply at 1080x1920 and animate per-frame:
 *
 *   FpgaFlow       — signal through a processor, "54-bit float" + a timer
 *                    stopping at 0.51 ms, with a micro-latency ripple.
 *   DanteWeb       — console -> pulsing data line -> SB-16D, expanding into a
 *                    grid that stands for the 64x64 channel capacity.
 *   PowerFailover  — AC path failing red while the DC path illuminates green,
 *                    power to the console silhouette never interrupted.
 *   Connector      — DB25 / BNC / optical / RJ45 outlines for the IF-Series.
 *
 * All are line art in ink on the light ground, matching the clinical
 * engineering-drawing register of the rest of the frame.
 */

const mono = (size: number, weight = 500) => ({
  fontFamily: F.mono,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: 1.6,
});

// ---------------------------------------------------------------------------
export const FpgaFlow: React.FC<{
  w: number;
  h: number;
  part?: Part;
  delay?: number;
}> = ({w, h, part = 1, delay = 0}) => {
  const f = useCurrentFrame() - delay;
  const a = accent(part);
  const cy = h * 0.46;
  const inX = w * 0.09;
  const boxX = w * 0.34;
  const boxW = w * 0.32;
  const outX = w * 0.91;

  const draw = ramp(f, [0, 26], [0, 1]);
  const boxIn = ramp(f, [16, 38], [0, 1]);
  const pulses = 4;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      {/* signal path */}
      <line
        x1={inX}
        y1={cy}
        x2={inX + (outX - inX) * draw}
        y2={cy}
        stroke={C.line}
        strokeWidth={3}
      />
      {/* travelling data pulses — the parallel-routing motif */}
      {new Array(pulses).fill(0).map((_, i) => {
        const t = ((f * 0.016 + i / pulses) % 1);
        const x = inX + (outX - inX) * t;
        const fade = Math.sin(Math.PI * t);
        return (
          <g key={i} opacity={draw * fade}>
            <circle cx={x} cy={cy} r={7} fill={a} />
            <rect x={x - 34} y={cy - 1.6} width={34} height={3.2} fill={a} opacity={0.34} />
          </g>
        );
      })}

      {/* input node */}
      <g opacity={draw}>
        <circle cx={inX} cy={cy} r={13} fill="none" stroke={C.ink} strokeWidth={3} />
        <circle cx={inX} cy={cy} r={4.5} fill={C.ink} />
        <text x={inX - 6} y={cy + 48} style={{...mono(15), fill: C.inkDim}}>
          ANALOG IN
        </text>
      </g>

      {/* processor */}
      <g opacity={boxIn} transform={`translate(0 ${(1 - boxIn) * 14})`}>
        <rect
          x={boxX}
          y={cy - h * 0.20}
          width={boxW}
          height={h * 0.40}
          rx={10}
          fill={C.paperHi}
          stroke={C.ink}
          strokeWidth={3.5}
        />
        {/* pin rows */}
        {new Array(9).fill(0).map((_, i) => {
          const px = boxX + boxW * (0.10 + (i * 0.80) / 8);
          return (
            <g key={i}>
              <line x1={px} y1={cy - h * 0.20} x2={px} y2={cy - h * 0.20 - 11} stroke={C.inkDim} strokeWidth={2.4} />
              <line x1={px} y1={cy + h * 0.20} x2={px} y2={cy + h * 0.20 + 11} stroke={C.inkDim} strokeWidth={2.4} />
            </g>
          );
        })}
        {/* internal parallel lanes lighting up */}
        {new Array(5).fill(0).map((_, i) => {
          const ly = cy - h * 0.115 + i * (h * 0.058);
          const on = ((f * 0.05 + i * 0.21) % 1) < 0.55;
          return (
            <line
              key={i}
              x1={boxX + boxW * 0.12}
              y1={ly}
              x2={boxX + boxW * 0.88}
              y2={ly}
              stroke={on ? a : C.lineSoft}
              strokeWidth={2.6}
              opacity={on ? 0.9 : 0.55}
            />
          );
        })}
        <text
          x={boxX + boxW / 2}
          y={cy + h * 0.20 - 14}
          textAnchor="middle"
          style={{...mono(16, 700), fill: C.ink}}
        >
          FPGA
        </text>
      </g>

      {/* output node + micro-latency ripple */}
      <g opacity={draw}>
        {new Array(3).fill(0).map((_, i) => {
          const t = ((f * 0.021 + i / 3) % 1);
          return (
            <circle
              key={i}
              cx={outX}
              cy={cy}
              r={13 + t * 40}
              fill="none"
              stroke={a}
              strokeWidth={2.4}
              opacity={(1 - t) * 0.55}
            />
          );
        })}
        <circle cx={outX} cy={cy} r={13} fill="none" stroke={C.ink} strokeWidth={3} />
        <circle cx={outX} cy={cy} r={4.5} fill={C.ink} />
        <text x={outX - 58} y={cy + 48} style={{...mono(15), fill: C.inkDim}}>
          ANALOG OUT
        </text>
      </g>

      {/* annotations */}
      <text x={boxX} y={cy - h * 0.20 - 32} style={{...mono(19, 700), fill: C.ink}}>
        54-BIT FLOAT
      </text>
      <text
        x={outX}
        y={cy - h * 0.20 - 32}
        textAnchor="end"
        style={{...mono(19, 700), fill: a}}
      >
        {ramp(f, [30, 74], [0, 0.51]).toFixed(2)} MS
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
export const DanteWeb: React.FC<{
  w: number;
  h: number;
  part?: Part;
  delay?: number;
  gridN?: number;
}> = ({w, h, part = 2, delay = 0, gridN = 8}) => {
  const f = useCurrentFrame() - delay;
  const a = accent(part);
  const cy = h * 0.34;
  const lx = w * 0.13;
  const rx = w * 0.87;

  const link = ramp(f, [4, 32], [0, 1]);
  const gridIn = ramp(f, [34, 74], [0, 1]);

  const node = (x: number, label: string, wide: boolean) => (
    <g>
      <rect
        x={x - (wide ? 66 : 52)}
        y={cy - 30}
        width={wide ? 132 : 104}
        height={60}
        rx={8}
        fill={C.paperHi}
        stroke={C.ink}
        strokeWidth={3.2}
      />
      {new Array(wide ? 7 : 5).fill(0).map((_, i) => (
        <rect
          key={i}
          x={x - (wide ? 52 : 40) + i * (wide ? 17 : 16)}
          y={cy - 15}
          width={9}
          height={30}
          rx={2}
          fill={C.lineSoft}
        />
      ))}
      <text x={x} y={cy + 54} textAnchor="middle" style={{...mono(15, 600), fill: C.inkSoft}}>
        {label}
      </text>
    </g>
  );

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      {/* the single Cat5e run that replaces the copper multicore */}
      <line x1={lx} y1={cy} x2={lx + (rx - lx) * link} y2={cy} stroke={C.line} strokeWidth={3} />
      {new Array(5).fill(0).map((_, i) => {
        const t = (f * 0.020 + i / 5) % 1;
        const x = lx + (rx - lx) * t;
        return (
          <rect
            key={i}
            x={x - 16}
            y={cy - 3}
            width={32}
            height={6}
            rx={3}
            fill={a}
            opacity={link * Math.sin(Math.PI * t) * 0.95}
          />
        );
      })}

      {node(lx, 'SONICVIEW', true)}
      {node(rx, 'SB-16D', false)}

      <text x={w / 2} y={cy - 44} textAnchor="middle" style={{...mono(16, 600), fill: a}}>
        DANTE / IP
      </text>

      {/* 64x64 capacity grid */}
      <g opacity={gridIn}>
        {new Array(gridN * gridN).fill(0).map((_, i) => {
          const cx = i % gridN;
          const ry = Math.floor(i / gridN);
          const cellW = (w * 0.62) / gridN;
          const x0 = w * 0.19 + cx * cellW;
          const y0 = h * 0.62 + ry * cellW * 0.62;
          const on = rnd(i * 5 + 2) < 0.30 + 0.45 * ((f * 0.010 + rnd(i)) % 1);
          const appear = ramp(f, [34 + i * 0.5, 50 + i * 0.5], [0, 1]);
          return (
            <rect
              key={i}
              x={x0}
              y={y0}
              width={cellW * 0.56}
              height={cellW * 0.36}
              rx={2}
              fill={on ? a : C.lineSoft}
              opacity={appear * (on ? 0.85 : 0.6)}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
export const PowerFailover: React.FC<{
  w: number;
  h: number;
  failAt?: number;
  delay?: number;
}> = ({w, h, failAt = 46, delay = 0}) => {
  const f = useCurrentFrame() - delay;
  const cx = w * 0.72;
  const acY = h * 0.24;
  const dcY = h * 0.72;
  const srcX = w * 0.12;

  const draw = ramp(f, [0, 22], [0, 1]);
  const failed = ramp(f, [failAt, failAt + 10], [0, 1]);
  const dcLive = ramp(f, [failAt + 4, failAt + 18], [0, 1]);
  const acColor = failed > 0.5 ? C.alert : C.inkSoft;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      {/* AC branch */}
      <g opacity={draw}>
        <rect x={srcX - 40} y={acY - 30} width={80} height={60} rx={8} fill={C.paperHi} stroke={acColor} strokeWidth={3.2} />
        <text x={srcX} y={acY + 8} textAnchor="middle" style={{...mono(20, 700), fill: acColor}}>
          AC
        </text>
        <path
          d={`M ${srcX + 40} ${acY} H ${cx - 90} V ${h * 0.46}`}
          fill="none"
          stroke={acColor}
          strokeWidth={3.4}
          strokeDasharray={failed > 0.5 ? '11 11' : undefined}
          opacity={1 - failed * 0.45}
        />
        {/* break marker */}
        <g opacity={failed}>
          <line
            x1={(srcX + 40 + cx - 90) / 2 - 17}
            y1={acY - 17}
            x2={(srcX + 40 + cx - 90) / 2 + 17}
            y2={acY + 17}
            stroke={C.alert}
            strokeWidth={5}
          />
          <line
            x1={(srcX + 40 + cx - 90) / 2 + 17}
            y1={acY - 17}
            x2={(srcX + 40 + cx - 90) / 2 - 17}
            y2={acY + 17}
            stroke={C.alert}
            strokeWidth={5}
          />
        </g>
        <text x={srcX + 56} y={acY - 22} style={{...mono(14), fill: acColor}}>
          {failed > 0.5 ? 'PRIMARY LOST' : 'PRIMARY'}
        </text>
      </g>

      {/* DC branch */}
      <g opacity={draw}>
        <rect
          x={srcX - 40}
          y={dcY - 30}
          width={80}
          height={60}
          rx={8}
          fill={C.paperHi}
          stroke={dcLive > 0.5 ? C.good : C.inkDim}
          strokeWidth={3.2}
        />
        <text
          x={srcX}
          y={dcY + 8}
          textAnchor="middle"
          style={{...mono(20, 700), fill: dcLive > 0.5 ? C.good : C.inkDim}}
        >
          DC
        </text>
        <path
          d={`M ${srcX + 40} ${dcY} H ${cx - 90} V ${h * 0.54}`}
          fill="none"
          stroke={dcLive > 0.5 ? C.good : C.line}
          strokeWidth={3.4}
        />
        {new Array(4).fill(0).map((_, i) => {
          const t = (f * 0.024 + i / 4) % 1;
          return (
            <circle
              key={i}
              cx={srcX + 40 + (cx - 130 - srcX) * t}
              cy={dcY}
              r={6}
              fill={C.good}
              opacity={dcLive * Math.sin(Math.PI * t)}
            />
          );
        })}
        <text x={srcX + 56} y={dcY - 22} style={{...mono(14), fill: dcLive > 0.5 ? C.good : C.inkDim}}>
          {dcLive > 0.5 ? 'CARRYING LOAD' : 'STANDBY'}
        </text>
      </g>

      {/* console silhouette — never loses power */}
      <g opacity={draw}>
        <rect x={cx - 90} y={h * 0.40} width={w * 0.30} height={h * 0.20} rx={9} fill={C.paperHi} stroke={C.ink} strokeWidth={3.4} />
        {new Array(8).fill(0).map((_, i) => (
          <rect
            key={i}
            x={cx - 74 + i * ((w * 0.30 - 32) / 8)}
            y={h * 0.44}
            width={9}
            height={h * 0.12}
            rx={2}
            fill={C.lineSoft}
          />
        ))}
        <circle cx={cx + w * 0.30 - 106} cy={h * 0.435} r={7} fill={C.good} opacity={0.55 + 0.45 * Math.sin(f * 0.22)} />
      </g>
      <text
        x={cx + w * 0.15 - 90}
        y={h * 0.40 - 18}
        textAnchor="middle"
        style={{...mono(15, 600), fill: C.ink}}
      >
        UNINTERRUPTED
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
export type ConnectorKind = 'db25' | 'bnc' | 'optical' | 'rj45';

export const Connector: React.FC<{
  kind: ConnectorKind;
  w: number;
  h: number;
  color?: string;
  strokeWidth?: number;
}> = ({kind, w, h, color = C.ink, strokeWidth = 3}) => {
  const s = {fill: 'none', stroke: color, strokeWidth, strokeLinejoin: 'round' as const};
  const cx = w / 2;
  const cy = h / 2;

  if (kind === 'db25') {
    // trapezoidal D-sub shell with two staggered pin rows
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path d={`M ${w * 0.06} ${cy - h * 0.24} L ${w * 0.14} ${cy - h * 0.34} L ${w * 0.86} ${cy - h * 0.34} L ${w * 0.94} ${cy - h * 0.24} L ${w * 0.94} ${cy + h * 0.24} L ${w * 0.86} ${cy + h * 0.34} L ${w * 0.14} ${cy + h * 0.34} L ${w * 0.06} ${cy + h * 0.24} Z`} {...s} />
        {new Array(13).fill(0).map((_, i) => (
          <circle key={`a${i}`} cx={w * 0.16 + i * (w * 0.68 / 12)} cy={cy - h * 0.09} r={Math.max(1.6, w * 0.016)} fill={color} />
        ))}
        {new Array(12).fill(0).map((_, i) => (
          <circle key={`b${i}`} cx={w * 0.19 + i * (w * 0.68 / 12)} cy={cy + h * 0.09} r={Math.max(1.6, w * 0.016)} fill={color} />
        ))}
      </svg>
    );
  }

  if (kind === 'bnc') {
    // coaxial barrel with bayonet lugs
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <circle cx={cx} cy={cy} r={h * 0.36} {...s} />
        <circle cx={cx} cy={cy} r={h * 0.20} {...s} />
        <circle cx={cx} cy={cy} r={h * 0.055} fill={color} />
        <rect x={cx - h * 0.46} y={cy - h * 0.075} width={h * 0.11} height={h * 0.15} rx={2} fill={color} />
        <rect x={cx + h * 0.35} y={cy - h * 0.075} width={h * 0.11} height={h * 0.15} rx={2} fill={color} />
      </svg>
    );
  }

  if (kind === 'optical') {
    // LC duplex fibre pair
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {[-1, 1].map((d) => (
          <g key={d}>
            <rect
              x={cx + d * w * 0.05 - (d < 0 ? w * 0.30 : 0)}
              y={cy - h * 0.30}
              width={w * 0.30}
              height={h * 0.60}
              rx={6}
              {...s}
            />
            <circle cx={cx + d * (w * 0.05 + w * 0.15)} cy={cy} r={h * 0.13} {...s} />
            <circle cx={cx + d * (w * 0.05 + w * 0.15)} cy={cy} r={h * 0.05} fill={color} />
          </g>
        ))}
      </svg>
    );
  }

  // rj45 — 8P8C with latch
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={`M ${w * 0.18} ${cy - h * 0.30} H ${w * 0.82} V ${cy + h * 0.18} H ${w * 0.62} V ${cy + h * 0.34} H ${w * 0.38} V ${cy + h * 0.18} H ${w * 0.18} Z`} {...s} />
      {new Array(8).fill(0).map((_, i) => (
        <line
          key={i}
          x1={w * 0.24 + i * (w * 0.52 / 7)}
          y1={cy - h * 0.22}
          x2={w * 0.24 + i * (w * 0.52 / 7)}
          y2={cy + h * 0.02}
          stroke={color}
          strokeWidth={Math.max(2, strokeWidth * 0.7)}
        />
      ))}
    </svg>
  );
};
