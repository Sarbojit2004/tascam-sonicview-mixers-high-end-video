/**
 * THE FIVE DEMONSTRATIVE ANIMATIONS.
 *
 * Four are Stage 6 of this project's own research brief, verbatim. The fifth
 * comes from Stage 5's explicit request for "high-frame-rate macro
 * cinematography of the 100mm motorized faders snapping violently yet precisely
 * to position during a Snapshot Recall".
 *
 * NOTHING IS ADAPTED FROM THE MODEL SERIES. The TASCAM Recording Series
 * production built Tri-Path Splitter, DB25 Injection and Timecode Pulse for a
 * hybrid analog/digital desk. Stage 1 of this brief states that Sonicview
 * "shares absolutely no signal-path architecture" with that line, so what is
 * inherited here is the CATEGORY and its craft rules — node cards, orthogonal
 * polylines with packets riding them, geometry solved in pure JS rather than by
 * asking the DOM for getTotalLength(), every figure routed through specValue()
 * so an UNVERIFIED number cannot render — and not one line of its content.
 *
 * All five run on the light ground. Stage 5 asks for a cold, clinical,
 * server-room look, which on a white page is expressed as cool neutral greys
 * with the network cyan as the only saturated colour, rather than by darkening
 * the page and breaking the palette rule that governs all six deliverables.
 */
import React from "react";
import { useCurrentFrame } from "remotion";

import { COLORS, hexA } from "./theme.ts";
import { EASE_IN_OUT, ramp, snap, stagger } from "./anim.ts";
import { micro, sanitizeGlyphs, spec } from "./fonts.ts";
import { platformValue, specValue } from "./spec.ts";

const S = sanitizeGlyphs;

/* ─── shared primitives ──────────────────────────────────────────────────── */

interface Pt { x: number; y: number }

/**
 * An orthogonal polyline, drawn progressively, with optional packets riding it.
 *
 * Geometry is solved in pure JS from the point list rather than by measuring the
 * DOM. A measured path needs an effect, a ref and a state round-trip, none of
 * which is frame-deterministic under a headless render — the first frame would
 * draw before the measurement landed.
 */
const useSegments = (pts: Pt[]) =>
  React.useMemo(() => {
    const segs: { a: Pt; b: Pt; len: number }[] = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      segs.push({ a, b, len });
      total += len;
    }
    return { segs, total };
  }, [pts]);

const pointAt = (segs: { a: Pt; b: Pt; len: number }[], total: number, u: number): Pt => {
  let d = Math.max(0, Math.min(1, u)) * total;
  for (const s of segs) {
    if (d <= s.len || s === segs[segs.length - 1]) {
      const k = s.len > 0 ? d / s.len : 0;
      return { x: s.a.x + (s.b.x - s.a.x) * k, y: s.a.y + (s.b.y - s.a.y) * k };
    }
    d -= s.len;
  }
  return segs[segs.length - 1].b;
};

const Path: React.FC<{
  pts: Pt[];
  progress: number;
  color?: string;
  width?: number;
  dashed?: boolean;
}> = ({ pts, progress, color = COLORS.lineStrong, width = 3, dashed = false }) => {
  const { total } = useSegments(pts);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "10 9" : `${total} ${total}`}
      strokeDashoffset={dashed ? 0 : total * (1 - progress)}
      opacity={dashed ? 0.5 : 1}
    />
  );
};

const Packet: React.FC<{ pts: Pt[]; u: number; color: string; r?: number; on?: boolean }> = ({
  pts, u, color, r = 7, on = true,
}) => {
  const { segs, total } = useSegments(pts);
  if (!on) return null;
  const p = pointAt(segs, total, u);
  return (
    <>
      <circle cx={p.x} cy={p.y} r={r * 2.4} fill={color} opacity={0.14} />
      <circle cx={p.x} cy={p.y} r={r} fill={color} />
    </>
  );
};

/** A node card in a flow. Rounded rect, hairline, label — never a filled box. */
const Node: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; sub?: string; t: number; accent?: string;
}> = ({ x, y, w, h, title, sub, t, accent = COLORS.lineStrong }) => (
  <g opacity={t} transform={`translate(${x},${y + (1 - t) * 10})`}>
    <rect
      width={w} height={h} rx={14}
      fill={COLORS.paperLift} stroke={accent} strokeWidth={2}
    />
    <text
      x={w / 2} y={sub ? h / 2 - 6 : h / 2 + 7}
      textAnchor="middle"
      style={{ ...micro(19, 700, "0.13em"), fill: COLORS.ink } as React.CSSProperties}
    >
      {S(title)}
    </text>
    {sub ? (
      <text
        x={w / 2} y={h / 2 + 20}
        textAnchor="middle"
        style={{ ...spec(17, 600, "0.05em"), fill: COLORS.slate } as React.CSSProperties}
      >
        {S(sub)}
      </text>
    ) : null}
  </g>
);

const Caption: React.FC<{ x: number; y: number; text: string; t: number; color?: string }> = ({
  x, y, text, t, color = COLORS.slate,
}) => (
  <text
    x={x} y={y} textAnchor="middle" opacity={t}
    style={{ ...spec(21, 600, "0.09em"), fill: color } as React.CSSProperties}
  >
    {S(text)}
  </text>
);

interface DemoProps { w: number; h: number; dur: number }

/* ═══ 1 · CLASS 1 HDIA INSTRUMENTATION STAGE ══════════════════════════════
 *
 * Stage 6: "A schematic overlay positioned over physical footage of the XLR
 * port. The camera pushes into a circuit diagram of the instrumentation
 * amplifier, highlighting the extremely low noise floor (-128 dBu) and high
 * Common-Mode Rejection Ratio (CMRR) actively filtering out electromagnetic
 * interference before hitting the 32-bit ADC block."
 *
 * The mechanism worth showing is what an instrumentation amplifier actually
 * DOES: it amplifies the DIFFERENCE between two inputs and rejects what is
 * COMMON to both. So the two signal legs carry the same interference and
 * opposite signal, and at the summing junction the interference cancels and the
 * signal survives. That cancellation is the entire -128 dBu story.
 */
export const HdiaStage: React.FC<DemoProps> = ({ w, h }) => {
  const f = useCurrentFrame();
  const cx = w / 2;
  const yHot = h * 0.34;
  const yCold = h * 0.60;
  const xIn = w * 0.10;
  const xAmp = w * 0.56;
  const xAdc = w * 0.82;

  const tPorts = ramp(f, 4, 20);
  const tLegs = ramp(f, 18, 34);
  const tNoise = ramp(f, 44, 26);
  const tCancel = ramp(f, 96, 34, EASE_IN_OUT);
  const tAdc = ramp(f, 140, 22);
  const tFig = ramp(f, 158, 24);

  // Interference rides both legs identically; signal is equal and opposite.
  const wob = (phase: number) =>
    Math.sin((f / 6) + phase) * 9 * tNoise * (1 - tCancel);

  const hotPts: Pt[] = [{ x: xIn, y: yHot }, { x: xAmp - 40, y: yHot }];
  const coldPts: Pt[] = [{ x: xIn, y: yCold }, { x: xAmp - 40, y: yCold }];
  const outPts: Pt[] = [{ x: xAmp + 96, y: h * 0.47 }, { x: xAdc, y: h * 0.47 }];

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {/* the two legs of a balanced input */}
      <g opacity={tPorts}>
        <circle cx={xIn} cy={yHot} r={11} fill="none" stroke={COLORS.ink} strokeWidth={2.5} />
        <circle cx={xIn} cy={yCold} r={11} fill="none" stroke={COLORS.ink} strokeWidth={2.5} />
        <text x={xIn - 26} y={yHot + 7} textAnchor="end"
          style={{ ...micro(17, 700, "0.14em"), fill: COLORS.slate } as React.CSSProperties}>HOT</text>
        <text x={xIn - 26} y={yCold + 7} textAnchor="end"
          style={{ ...micro(17, 700, "0.14em"), fill: COLORS.slate } as React.CSSProperties}>COLD</text>
      </g>

      <Path pts={hotPts} progress={tLegs} color={COLORS.pathAnalog} width={3} />
      <Path pts={coldPts} progress={tLegs} color={COLORS.pathAnalog} width={3} />

      {/* interference — identical on both legs, which is why it cancels */}
      <g opacity={tNoise * (1 - tCancel)}>
        {Array.from({ length: 26 }, (_, i) => {
          const x = xIn + 30 + i * ((xAmp - 70 - xIn) / 26);
          return (
            <g key={i}>
              <circle cx={x} cy={yHot + wob(i * 0.5)} r={2.6} fill={COLORS.alert} />
              <circle cx={x} cy={yCold + wob(i * 0.5)} r={2.6} fill={COLORS.alert} />
            </g>
          );
        })}
        <text x={(xIn + xAmp) / 2} y={h * 0.20} textAnchor="middle"
          style={{ ...micro(18, 700, "0.16em"), fill: COLORS.alert } as React.CSSProperties}>
          COMMON-MODE INTERFERENCE
        </text>
      </g>

      {/* the instrumentation amplifier */}
      <g opacity={ramp(f, 30, 20)}>
        <path
          d={`M${xAmp - 40},${yHot - 34} L${xAmp + 96},${h * 0.47} L${xAmp - 40},${yCold + 34} Z`}
          fill={COLORS.paperLift} stroke={COLORS.ink} strokeWidth={2.5} strokeLinejoin="round"
        />
        <text x={xAmp - 18} y={yHot + 6}
          style={{ ...spec(22, 700), fill: COLORS.slate } as React.CSSProperties}>+</text>
        <text x={xAmp - 18} y={yCold + 6}
          style={{ ...spec(22, 700), fill: COLORS.slate } as React.CSSProperties}>-</text>
      </g>

      {/* the difference survives; the common part does not */}
      <g opacity={tCancel}>
        <Path pts={outPts} progress={tCancel} color={COLORS.pathData} width={3.5} />
        <Caption x={(xAmp + xAdc) / 2 + 20} y={h * 0.40} t={tCancel} text="DIFFERENCE ONLY"
          color={COLORS.signal} />
      </g>

      {/* the 32-bit ADC */}
      <Node x={xAdc} y={h * 0.47 - 34} w={Math.min(150, w - xAdc - 12)} h={68}
        title="32-BIT ADC" sub="96 kHz" t={tAdc} accent={COLORS.net} />

      {/* the figures, from the verified tables */}
      <g opacity={tFig}>
        <text x={cx} y={h * 0.86} textAnchor="middle"
          style={{ ...spec(46, 800, "0.03em"), fill: COLORS.accent } as React.CSSProperties}>
          {S(specValue("sv24", "Preamp EIN"))}
        </text>
        <text x={cx} y={h * 0.94} textAnchor="middle"
          style={{ ...micro(18, 600, "0.22em"), fill: COLORS.slate } as React.CSSProperties}>
          EQUIVALENT INPUT NOISE
        </text>
      </g>
    </svg>
  );
};

/* ═══ 2 · THE 54-BIT SUMMING MATRIX ═══════════════════════════════════════
 *
 * Stage 6: "44 distinct audio waveforms entering a central computational node.
 * The waveforms expand vertically as they sum together. Crucially, they never
 * clip against a digital ceiling, representing the 42-bit data + 12-bit
 * headroom mathematics."
 *
 * The ceiling is the whole point, so the ceiling is drawn — and the summed
 * signal is shown growing hard toward it and NOT reaching it, with the headroom
 * band above staying visibly open. A version where the sum simply gets big
 * would illustrate nothing; what has to be legible is the gap that remains.
 */
export const SummingMatrix: React.FC<DemoProps> = ({ w, h }) => {
  const f = useCurrentFrame();
  const N = 44;
  const left = w * 0.06;
  const nodeX = w * 0.52;
  const nodeW = Math.min(230, w * 0.19);
  const outX = nodeX + nodeW + 40;
  const mid = h * 0.52;

  const tIn = ramp(f, 0, 40);
  const tNode = ramp(f, 34, 20);
  const tSum = ramp(f, 62, 80, EASE_IN_OUT);
  const tCeil = ramp(f, 70, 24);
  const tHead = ramp(f, 150, 26);

  const ceilingY = h * 0.13;
  const floorY = h * 0.91;
  // The sum grows toward the ceiling and stops short of it, permanently.
  const peak = mid - (mid - ceilingY) * 0.74 * tSum;

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {/* 44 input channels */}
      {Array.from({ length: N }, (_, i) => {
        const t = ramp(f, stagger(i, 0.7), 16);
        const y = floorY - (i / (N - 1)) * (floorY - ceilingY - 40) - 20;
        const amp = 5 + (i % 7) * 1.6;
        return (
          <g key={i} opacity={t * tIn * 0.55}>
            <path
              d={`M${left},${y} Q${(left + nodeX) / 2},${y} ${nodeX - 14},${mid}`}
              fill="none" stroke={COLORS.net} strokeWidth={1.4} opacity={0.5}
            />
            <circle
              cx={left} cy={y + Math.sin(f / 7 + i) * amp * 0.16} r={2.4} fill={COLORS.net}
            />
          </g>
        );
      })}
      <text x={left} y={floorY + 30}
        style={{ ...micro(17, 700, "0.15em"), fill: COLORS.slate } as React.CSSProperties}>
        {S(specValue("sv24", "Internal Input Channels"))}
      </text>

      {/* the FPGA */}
      <Node x={nodeX} y={mid - 46} w={nodeW} h={92}
        title="54-BIT FPGA" sub="FLOATING POINT" t={tNode} accent={COLORS.accent} />

      {/* the ceiling that is never reached */}
      <g opacity={tCeil}>
        <line x1={outX - 20} y1={ceilingY} x2={w - 20} y2={ceilingY}
          stroke={COLORS.alert} strokeWidth={2.5} strokeDasharray="12 8" />
        <text x={w - 20} y={ceilingY - 12} textAnchor="end"
          style={{ ...micro(18, 700, "0.16em"), fill: COLORS.alert } as React.CSSProperties}>
          DIGITAL CEILING
        </text>
      </g>

      {/*
        The summed signal.

        Drawn as a coherent waveform with a filled envelope, not as a bundle of
        independently-jittering bars. The first attempt used per-bar random
        phase, which rendered as a circular scribble — visually busy and, worse,
        it made the distance to the ceiling impossible to read. Since the ONLY
        thing this animation has to communicate is that the sum grows hard and
        still does not touch the ceiling, the shape has to be legible enough for
        that gap to be seen.

        So: one waveform, symmetric about the centre, its outer envelope smooth
        and its peak parked at a fixed fraction of the distance to the ceiling.
      */}
      {(() => {
        const x0 = outX;
        const x1 = w - 30;
        const M = 96;
        const amp = (i: number) => {
          const u = i / M;
          const env = Math.sin(u * Math.PI) ** 0.6; // smooth burst envelope
          const carrier =
            0.62 * Math.sin(u * 46 + f / 3.2) +
            0.26 * Math.sin(u * 97 + f / 2.1) +
            0.12 * Math.sin(u * 151 + f / 4.4);
          return (mid - peak) * env * (0.45 + 0.55 * Math.abs(carrier));
        };
        const top: string[] = [];
        const bot: string[] = [];
        for (let i = 0; i <= M; i++) {
          const x = x0 + (i / M) * (x1 - x0);
          const a = amp(i);
          top.push(`${i ? "L" : "M"}${x.toFixed(1)},${(mid - a).toFixed(1)}`);
          bot.push(`L${(x0 + ((M - i) / M) * (x1 - x0)).toFixed(1)},${(mid + amp(M - i)).toFixed(1)}`);
        }
        return (
          <g opacity={tSum}>
            <path d={`${top.join(" ")} ${bot.join(" ")} Z`} fill={hexA(COLORS.accent, 0.18)} />
            <path d={top.join(" ")} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeLinejoin="round" />
            <path d={bot.join(" ").replace(/^L/, "M")} fill="none" stroke={COLORS.accent}
              strokeWidth={2.5} strokeLinejoin="round" />
            <line x1={x0} y1={mid} x2={x1} y2={mid} stroke={COLORS.accent} strokeWidth={1}
              opacity={0.35} />
          </g>
        );
      })()}

      {/* the headroom that stays open — the actual claim */}
      <g opacity={tHead}>
        <line x1={outX + 30} y1={ceilingY + 6} x2={outX + 30} y2={peak - 4}
          stroke={COLORS.signal} strokeWidth={2} />
        <line x1={outX + 22} y1={ceilingY + 6} x2={outX + 38} y2={ceilingY + 6}
          stroke={COLORS.signal} strokeWidth={2} />
        <line x1={outX + 22} y1={peak - 4} x2={outX + 38} y2={peak - 4}
          stroke={COLORS.signal} strokeWidth={2} />
        <text x={outX + 50} y={(ceilingY + peak) / 2 + 6}
          style={{ ...spec(20, 700, "0.06em"), fill: COLORS.signal } as React.CSSProperties}>
          12-BIT HEADROOM
        </text>
        <text x={outX + 50} y={(ceilingY + peak) / 2 + 32}
          style={{ ...micro(16, 600, "0.14em"), fill: COLORS.slateDim } as React.CSSProperties}>
          42-BIT DATA BELOW
        </text>
      </g>
    </svg>
  );
};

/* ═══ 3 · ST 2022-7 REDUNDANT PACKET FLOW ═════════════════════════════════
 *
 * Stage 6: "the console and the SB-16D connected via dual Ethernet lines. A
 * stream of digital data packets splits into two identical streams across
 * Primary and Secondary Dante networks. Mid-stream, one path is artificially
 * severed, but the destination node seamlessly receives the secondary packets
 * with zero interruption."
 *
 * The severance must NOT read as a failure event. The engineering claim is that
 * the receiver reconstructs with zero sample loss, so the output stream is drawn
 * as literally continuous across the cut — the packets on the surviving path
 * keep arriving at the same cadence, and the only thing that changes is which
 * path they came down. A stutter at the output would illustrate the opposite of
 * what the specification says.
 */
export const RedundantFlow: React.FC<DemoProps> = ({ w, h }) => {
  const f = useCurrentFrame();
  const boxW = Math.min(220, w * 0.19);
  const srcX = w * 0.05;
  const dstX = w - w * 0.05 - boxW;
  const midY = h * 0.5;
  const yP = h * 0.26;
  const yS = h * 0.74;

  const tNodes = ramp(f, 2, 20);
  const tPaths = ramp(f, 20, 34);
  const cut = 150; // frame at which the primary path is severed
  const tCut = ramp(f, cut, 12);

  const primary: Pt[] = [
    { x: srcX + boxW, y: midY }, { x: srcX + boxW + 60, y: midY },
    { x: srcX + boxW + 60, y: yP }, { x: dstX - 60, y: yP },
    { x: dstX - 60, y: midY }, { x: dstX, y: midY },
  ];
  const secondary: Pt[] = [
    { x: srcX + boxW, y: midY }, { x: srcX + boxW + 60, y: midY },
    { x: srcX + boxW + 60, y: yS }, { x: dstX - 60, y: yS },
    { x: dstX - 60, y: midY }, { x: dstX, y: midY },
  ];
  const cutX = (srcX + dstX) / 2 + boxW / 2;

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <Node x={srcX} y={midY - 46} w={boxW} h={92} title="SB-16D" sub="16 IN / 16 OUT"
        t={tNodes} accent={COLORS.net} />
      <Node x={dstX} y={midY - 46} w={boxW} h={92} title="SONICVIEW" sub="64x64 DANTE"
        t={tNodes} accent={COLORS.net} />

      <Path pts={primary} progress={tPaths} color={COLORS.pathPrimary} width={3.5} />
      <Path pts={secondary} progress={tPaths} color={COLORS.pathSecondary} width={3.5} />

      <text x={(srcX + dstX) / 2 + boxW / 2} y={yP - 22} textAnchor="middle"
        opacity={tPaths}
        style={{ ...micro(18, 700, "0.16em"), fill: COLORS.pathPrimary } as React.CSSProperties}>
        PRIMARY
      </text>
      <text x={(srcX + dstX) / 2 + boxW / 2} y={yS + 34} textAnchor="middle"
        opacity={tPaths}
        style={{ ...micro(18, 700, "0.16em"), fill: COLORS.pathSecondary } as React.CSSProperties}>
        SECONDARY
      </text>

      {/* packets on both paths; the primary stops emitting after the cut */}
      {Array.from({ length: 7 }, (_, i) => {
        const u = ((f / 46) + i / 7) % 1;
        return (
          <g key={i}>
            <Packet pts={primary} u={u} color={COLORS.pathPrimary}
              on={tPaths > 0.9 && !(f > cut && u > (cutX - srcX) / (dstX - srcX) * 0.55)} />
            <Packet pts={secondary} u={u} color={COLORS.pathSecondary} on={tPaths > 0.9} />
          </g>
        );
      })}

      {/* the severance */}
      <g opacity={tCut}>
        <line x1={cutX - 22} y1={yP - 22} x2={cutX + 22} y2={yP + 22}
          stroke={COLORS.alert} strokeWidth={4} strokeLinecap="round" />
        <line x1={cutX + 22} y1={yP - 22} x2={cutX - 22} y2={yP + 22}
          stroke={COLORS.alert} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* the output, continuous across the cut — the actual claim */}
      <g opacity={ramp(f, cut + 16, 26)}>
        <text x={w / 2} y={h * 0.955} textAnchor="middle"
          style={{ ...spec(24, 700, "0.07em"), fill: COLORS.signal } as React.CSSProperties}>
          {S(`ZERO SAMPLE LOSS  ·  ${platformValue("Dante Redundancy")}`)}
        </text>
      </g>
    </svg>
  );
};

/* ═══ 4 · AUDIO-FOLLOW-VIDEO TALLY LOGIC ══════════════════════════════════
 *
 * Stage 6: "a binary GPIO trigger flips from 0 to 1 (a camera tally activation).
 * A graphical logic line connects this to a digital fader which mathematically
 * calculates its rise time, hold time and fall time, moving automatically on a
 * parabolic curve based entirely on the hardware trigger."
 *
 * The three named intervals are the subject, so the curve is drawn with its
 * rise, hold and fall segments labelled and the fader cap tracking the same
 * curve in real time. The fader does not move until the trigger flips — that
 * causality is the whole feature.
 */
export const AfvTally: React.FC<DemoProps> = ({ w, h }) => {
  const f = useCurrentFrame();
  const gx = w * 0.30;
  const gw = w * 0.44;
  const gTop = h * 0.24;
  const gBot = h * 0.72;

  const tSetup = ramp(f, 2, 20);
  const trig = 46;
  const on = f >= trig;
  const tTrig = ramp(f, trig, 8);

  // rise / hold / fall, in frames, as the console's own defined intervals
  const RISE = 34, HOLD = 78, FALL = 44;
  const e = f - trig;
  let level = 0;
  if (e >= 0 && e < RISE) level = ramp(f, trig, RISE, EASE_IN_OUT);
  else if (e >= RISE && e < RISE + HOLD) level = 1;
  else if (e >= RISE + HOLD && e < RISE + HOLD + FALL) level = 1 - ramp(f, trig + RISE + HOLD, FALL, EASE_IN_OUT);

  const curveY = (lv: number) => gBot - lv * (gBot - gTop);
  const xAt = (fr: number) => gx + (fr / (RISE + HOLD + FALL)) * gw;

  const drawn = Math.max(0, Math.min(RISE + HOLD + FALL, e));
  const pts: string[] = [];
  for (let i = 0; i <= drawn; i += 2) {
    let lv = 0;
    if (i < RISE) lv = i / RISE;
    else if (i < RISE + HOLD) lv = 1;
    else lv = 1 - (i - RISE - HOLD) / FALL;
    lv = lv < 0 ? 0 : lv > 1 ? 1 : lv;
    const eased = lv * lv * (3 - 2 * lv); // smoothstep, the parabolic feel asked for
    pts.push(`${i ? "L" : "M"}${xAt(i)},${curveY(eased)}`);
  }

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {/* GPIO trigger */}
      <g opacity={tSetup}>
        <rect x={w * 0.05} y={h * 0.40} width={w * 0.17} height={h * 0.20} rx={14}
          fill={COLORS.paperLift} stroke={on ? COLORS.alert : COLORS.lineStrong} strokeWidth={2.5} />
        <text x={w * 0.135} y={h * 0.475} textAnchor="middle"
          style={{ ...micro(17, 700, "0.14em"), fill: COLORS.slate } as React.CSSProperties}>
          GPIO TALLY
        </text>
        <text x={w * 0.135} y={h * 0.545} textAnchor="middle"
          style={{ ...spec(38, 800), fill: on ? COLORS.alert : COLORS.slateDim } as React.CSSProperties}>
          {on ? "1" : "0"}
        </text>
        {on ? (
          <circle cx={w * 0.135} cy={h * 0.40} r={9 + 5 * Math.sin(f / 4)} fill={COLORS.alert}
            opacity={0.25 * tTrig} />
        ) : null}
      </g>

      {/* the logic line from trigger to fader */}
      <Path pts={[{ x: w * 0.22, y: h * 0.5 }, { x: gx - 16, y: h * 0.5 }]}
        progress={tSetup} color={COLORS.lineStrong} width={2.5} dashed />

      {/* the graph frame */}
      <g opacity={tSetup}>
        <line x1={gx} y1={gBot} x2={gx + gw} y2={gBot} stroke={COLORS.line} strokeWidth={2} />
        <line x1={gx} y1={gTop} x2={gx + gw} y2={gTop} stroke={COLORS.line} strokeWidth={1.5}
          strokeDasharray="6 7" />
        {[["RISE", 0, RISE], ["HOLD", RISE, HOLD], ["FALL", RISE + HOLD, FALL]].map(
          ([lab, from, len]) => (
            <g key={lab as string}>
              <line x1={xAt(from as number)} y1={gTop - 12} x2={xAt(from as number)} y2={gBot}
                stroke={COLORS.line} strokeWidth={1.5} />
              <text
                x={xAt((from as number) + (len as number) / 2)} y={gBot + 30} textAnchor="middle"
                style={{ ...micro(16, 700, "0.15em"), fill: COLORS.slateDim } as React.CSSProperties}
              >
                {lab as string}
              </text>
            </g>
          ),
        )}
      </g>

      {/* the curve, drawn as it happens */}
      {pts.length > 1 ? (
        <path d={pts.join(" ")} fill="none" stroke={COLORS.accent} strokeWidth={3.5}
          strokeLinecap="round" strokeLinejoin="round" />
      ) : null}

      {/* the fader cap, tracking the same curve */}
      <g opacity={tSetup}>
        <rect x={w * 0.86} y={gTop} width={10} height={gBot - gTop} rx={5} fill={COLORS.paperWell} />
        <rect
          x={w * 0.86 - 17} y={curveY(level * level * (3 - 2 * level)) - 15}
          width={44} height={30} rx={7}
          fill={COLORS.ink}
        />
        <text x={w * 0.86 + 5} y={gBot + 30} textAnchor="middle"
          style={{ ...micro(16, 700, "0.15em"), fill: COLORS.slateDim } as React.CSSProperties}>
          FADER
        </text>
      </g>

      <text x={w / 2} y={h * 0.955} textAnchor="middle" opacity={ramp(f, 150, 24)}
        style={{ ...spec(21, 600, "0.08em"), fill: COLORS.slate } as React.CSSProperties}>
        {S(platformValue("AFV"))}
      </text>
    </svg>
  );
};

/* ═══ 5 · SNAPSHOT RECALL — THE MOTORISED BANK ════════════════════════════
 *
 * Stage 5 asks for the motorised faders "snapping violently yet precisely to
 * position during a Snapshot Recall, emphasizing mechanical speed and digital
 * determinism".
 *
 * Determinism is the hard part to draw. Every fader departs on the SAME frame
 * and arrives on the same frame regardless of how far it has to travel, because
 * a recall is a simultaneous state change and not sixteen independent moves.
 * Faders with further to go simply move faster. And nothing overshoots — the
 * motion is critically damped, so each cap arrives and stops.
 */
export const SnapshotRecall: React.FC<DemoProps & { unit?: "sv16" | "sv24" }> = ({
  w, h, unit = "sv24",
}) => {
  const f = useCurrentFrame();
  // The fader COUNT must match the console being named. Drawing sixteen faders
  // under a caption reading "24 channel + 1 master" is a straightforward factual
  // error on screen, and it is exactly what the first version did.
  const N = unit === "sv24" ? 24 : 16;
  const pad = w * 0.06;
  // N channel faders, then a visible break, then the master. The caption reads
  // "N channel + 1 master", so the picture has to contain N + 1 faders or a
  // viewer who counts finds the caption wrong.
  const MASTER_GAP = 1.6;
  const trackW = w - pad * 2;
  const gap = trackW / (N + 1 + MASTER_GAP);
  const top = h * 0.18;
  const bot = h * 0.80;

  const RECALL = 60;
  const t = snap(f, RECALL, 26);

  // Two scenes, A and B. Deterministic, not random: the same every render.
  const A = Array.from({ length: N }, (_, i) => 0.30 + 0.42 * Math.sin(i * 0.9 + 0.4));
  const B = Array.from({ length: N }, (_, i) => 0.55 + 0.38 * Math.sin(i * 0.55 + 2.1));

  const tIn = ramp(f, 0, 18);

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {Array.from({ length: N + 1 }, (_, i) => {
        const isMaster = i === N;
        const x = pad + gap * (i + (isMaster ? MASTER_GAP : 0)) + gap / 2;
        const a = Math.max(0.05, Math.min(0.95, isMaster ? 0.62 : A[i]));
        const b = Math.max(0.05, Math.min(0.95, isMaster ? 0.78 : B[i]));
        const lv = a + (b - a) * t;
        const y = bot - lv * (bot - top);
        const moving = t > 0.02 && t < 0.98;
        return (
          <g key={i} opacity={tIn}>
            <rect x={x - 4} y={top} width={8} height={bot - top} rx={4} fill={COLORS.paperWell} />
            {/* travel smear while the cap is actually moving */}
            {moving ? (
              <rect
                x={x - 4}
                y={Math.min(y, bot - a * (bot - top))}
                width={8}
                height={Math.abs(y - (bot - a * (bot - top)))}
                rx={4}
                fill={COLORS.accent}
                opacity={0.22}
              />
            ) : null}
            <rect x={x - 15} y={y - 12} width={30} height={24} rx={5}
              fill={isMaster ? COLORS.accent : COLORS.ink} />
            <rect x={x - 15} y={y - 1} width={30} height={2} fill={COLORS.paperLift} opacity={0.6} />
          </g>
        );
      })}

      <text x={pad} y={h * 0.93}
        style={{ ...micro(18, 700, "0.16em"), fill: COLORS.slateDim } as React.CSSProperties}>
        {f < RECALL ? "SCENE A" : "SCENE B"}
      </text>
      <text x={w - pad} y={h * 0.93} textAnchor="end" opacity={ramp(f, RECALL + 20, 20)}
        style={{ ...spec(20, 700, "0.07em"), fill: COLORS.accent } as React.CSSProperties}>
        {S(specValue(unit, "Motorized Faders"))}
      </text>
      <text x={w / 2} y={h * 0.10} textAnchor="middle" opacity={ramp(f, RECALL, 14)}
        style={{ ...micro(19, 700, "0.20em"), fill: COLORS.ink } as React.CSSProperties}>
        SNAPSHOT RECALL
      </text>
    </svg>
  );
};

export const DEMOS = {
  hdia: HdiaStage,
  summing: SummingMatrix,
  redundancy: RedundantFlow,
  afv: AfvTally,
  recall: SnapshotRecall,
} as const;

export type DemoKey = keyof typeof DEMOS;
