import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene, useV, spread, stepAt} from '../lib/ctx';
import {clamp, easeInOutSine, easeOutBack, easeOutCubic, easeOutExpo, lerp, rng} from '../lib/anim';
import {envSmooth, pulse} from '../lib/music';
import {FONT, rgba} from '../lib/theme';
import {aspect} from '../lib/assets';
import {Chip, Eyebrow, GlassCard, Logo, MaskRise, Shadow} from '../ui/kit';
import {Backdrop} from '../fx/fx';

const S = 1920;

/* ============================================================= DANTE ===== */
/** Dante at the hub, the stagebox views as nodes, packets riding the cables on the beat. */
export const Dante: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, eighths, beats, bars} = useScene();
  const ids = [36, 37, 38, 40, 41, 44, 45, 46, 47, 49, 12, 77, 39];
  const cx = S / 2;
  const cy = 1090;
  const rx = 700;
  const ry = 505;
  const pops = eighths.slice(1, 1 + ids.length);
  const spin = lerp(0, 12, easeInOutSine(f / dur));
  const low = envSmooth(m, 'low', f, 2);
  const kick = pulse(m.kicks, f, 6, true);
  const logoP = easeOutExpo(clamp(f / 10));
  const nodes = ids.map((id, k) => {
    const a = ((k / ids.length) * 360 - 90 + spin) * (Math.PI / 180);
    return {id, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, s: pops[k] ?? k * 3};
  });
  const bw = 272;
  const bh = 192;
  return (
    <AbsoluteFill>
      <Backdrop grid={0.6} />
      <svg width={S} height={S} style={{position: 'absolute', inset: 0}}>
        {nodes.map((n, k) => {
          const p = clamp((f - n.s) / 8);
          if (p <= 0) return null;
          const x2 = lerp(cx, n.x, easeOutCubic(p));
          const y2 = lerp(cy, n.y, easeOutCubic(p));
          return (
            <g key={k}>
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={rgba(t.aRgb, 0.22 + low * 0.25)} strokeWidth={10} />
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={t.b} strokeOpacity={0.75} strokeWidth={2.5} strokeDasharray="14 18" strokeDashoffset={-f * 6} />
            </g>
          );
        })}
        {/* packets: one wave per beat */}
        {beats.map((b, j) => {
          const d = f - b;
          if (d < 0 || d > 16) return null;
          const q = d / 16;
          return nodes.map((n, k) =>
            f >= n.s + 6 && (k + j) % 2 === 0 ? (
              <circle key={`${j}-${k}`} cx={lerp(cx, n.x, q)} cy={lerp(cy, n.y, q)} r={9} fill="#fff" opacity={1 - q * 0.6} />
            ) : null,
          );
        })}
      </svg>
      {/* hub */}
      <div
        style={{
          position: 'absolute',
          left: cx - 330,
          top: cy - 330,
          width: 660,
          height: 660,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${rgba(t.aRgb, 0.35 + kick * 0.3)}, ${rgba(t.aRgb, 0.08)} 60%, rgba(0,0,0,0))`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cx - 205,
          top: cy - 205,
          width: 410,
          height: 410,
          borderRadius: '50%',
          border: `2px solid ${rgba(t.bRgb, 0.5)}`,
          background: 'rgba(6,8,12,0.85)',
          transform: `scale(${lerp(0.4, 1, logoP) + kick * 0.03})`,
        }}
      />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${lerp(0.4, 1, logoP)})`, transformOrigin: `${cx}px ${cy}px`, opacity: logoP, width: S, height: S}}>
        <Logo name="dante" w={330} x={cx} y={cy} center />
      </div>
      {nodes.map((n, k) => {
        const p = clamp((f - n.s) / 7);
        if (p <= 0) return null;
        return (
          <GlassCard
            key={n.id}
            id={n.id}
            size="m"
            mode={n.id === 39 || n.id === 77 ? 'cover' : 'auto'}
            b={{x: n.x - bw / 2, y: n.y - bh / 2, w: bw, h: bh}}
            r={20}
            pad={0.06}
            glow={0.3}
            style={{opacity: easeOutCubic(clamp(p * 2)), transform: `scale(${lerp(0.3, 1, easeOutBack(p, 1.3))})`}}
          />
        );
      })}
      <div style={{position: 'absolute', left: 120, top: 240}}>
        <MaskRise p={clamp((f - 1) / 8)}>
          <Eyebrow size={26} color={t.b}>
            Audio-over-IP · built in
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 3) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: '#fff', lineHeight: 1.1}}>Dante 64 × 64</div>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 120, top: 1740}}>
        {f < (bars[1] ?? dur / 2) ? (
          <MaskRise p={clamp((f - (beats[2] ?? 10)) / 7)}>
            <Chip size={28}>SB-16D STAGEBOX · 16 IN / 16 OUT</Chip>
          </MaskRise>
        ) : (
          <MaskRise p={clamp((f - (bars[1] ?? 0)) / 7)}>
            <Chip size={28}>PRIMARY + SECONDARY · ST 2022-7 REDUNDANCY</Chip>
          </MaskRise>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================= CARDS ===== */
const PROTOCOLS = [
  'IF-ST2110 · SMPTE ST 2110 · 64×64',
  'IF-AE16 · AES/EBU',
  'IF-AN16/OUT · ANALOG OUT',
  'IF-MA64/EX · MADI',
  'IF-DA64 · DANTE',
  'IF-MTR32 · 32-TRACK SD RECORDING',
];

/** The IF-Series on three counter-running rails. */
export const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, beats} = useScene();
  const rows = [
    [96, 27, 28, 30, 72, 24],
    [16, 17, 18, 19, 20, 21],
    [22, 23, 85, 29, 31],
  ];
  const cw = 600;
  const ch = 400;
  const gap = 40;
  const low = envSmooth(m, 'low', f, 2);
  const chipStarts = spread(beats, PROTOCOLS.length);
  const c = stepAt(chipStarts, f);
  const p = f / dur;
  return (
    <AbsoluteFill>
      <Backdrop grid={0.3} />
      <AbsoluteFill style={{transform: 'rotate(-8deg) scale(1.12)', transformOrigin: '50% 58%'}}>
        {rows.map((row, r) => {
          const len = row.length * (cw + gap);
          const dir = r % 2 === 0 ? -1 : 1;
          const travel = len - S * 0.55;
          const x0 = dir < 0 ? S * 0.25 : S * 0.75 - len;
          const x = x0 + dir * travel * easeInOutSine(p) * 0.92 + dir * p * 60;
          return row.map((id, k) => {
            const cx = x + k * (cw + gap);
            const centred = Math.abs(cx + cw / 2 - S / 2) < cw * 0.55;
            return (
              <GlassCard
                key={id}
                id={id}
                size="m"
                b={{x: cx, y: 470 + r * (ch + 46), w: cw, h: ch}}
                r={26}
                pad={0.08}
                glow={centred ? 0.6 + low * 0.4 : 0.15}
                style={{boxShadow: centred ? `inset 0 0 0 3px ${rgba(t.aRgb, 0.9)}` : 'inset 0 0 0 1.5px rgba(255,255,255,0.13)'}}
              />
            );
          });
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${t.bg} 0%, rgba(0,0,0,0.0) 26%, rgba(0,0,0,0) 82%, ${t.bg} 100%)`}} />
      <div style={{position: 'absolute', left: 120, top: 240}}>
        <MaskRise p={clamp((f - 1) / 8)}>
          <Eyebrow size={26} color={t.b}>
            The IF-Series
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 3) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: '#fff', lineHeight: 1.1}}>Two slots. Every protocol.</div>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 120, top: 1740}}>
        {c.i >= 0 && (
          <MaskRise key={c.i} p={clamp(c.since / 6)}>
            <Chip size={30}>{PROTOCOLS[c.i]}</Chip>
          </MaskRise>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================== FLOW ===== */
/** Signal-flow sheets dropping onto a light table, one per 8th note. */
export const Flow: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, eighths} = useScene();
  const ids = [4, 131, 91, 93, 94, 32, 33, 34, 119, 120, 73, 90, 118, 129];
  const layout = useMemo(() => {
    const r = rng(42);
    const cells: {x: number; y: number}[] = [];
    const cols = 4;
    const rowsN = 4;
    for (let row = 0; row < rowsN; row++)
      for (let col = 0; col < cols; col++) cells.push({x: 250 + col * 473 + (row % 2) * 60, y: 640 + row * 330});
    const order = [5, 2, 9, 0, 14, 7, 12, 3, 10, 1, 13, 6, 8, 11, 4, 15];
    return ids.map((id, k) => {
      const c = cells[order[k]];
      return {id, x: c.x + (r() - 0.5) * 90, y: c.y + (r() - 0.5) * 70, rot: (r() - 0.5) * 12, w: 520 + r() * 90};
    });
  }, []);
  const drops = eighths.slice(0, ids.length);
  const cam = easeInOutSine(f / dur);
  const kick = pulse(m.kicks, f, 5, true);
  return (
    <AbsoluteFill>
      <Backdrop grid={1} />
      <AbsoluteFill style={{transform: `rotate(${lerp(-3, 2, cam)}deg) scale(${lerp(1.0, 1.08, cam) + kick * 0.006})`, transformOrigin: '50% 62%'}}>
        {layout.map((c, k) => {
          const s = drops[k] ?? k * 3;
          const p = clamp((f - s) / 6);
          if (f < s) return null;
          const a = aspect(c.id);
          const w = c.w;
          const h = Math.min(420, w / a);
          const ww = h * a < w ? h * a : w;
          const land = easeOutBack(p, 1.2);
          return (
            <React.Fragment key={c.id}>
              <Shadow x={c.x} y={c.y + 26} w={ww * 1.05} h={h * 1.1} o={0.55 * land} />
              <GlassCard
                id={c.id}
                mode="paper"
                size="m"
                b={{x: c.x - ww / 2, y: c.y - h / 2, w: ww, h}}
                r={16}
                style={{
                  transform: `translateY(${(1 - land) * -90}px) rotate(${c.rot + (1 - land) * 8}deg) scale(${lerp(1.35, 1, land)})`,
                  opacity: clamp(p * 3),
                }}
              />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${t.bg} 0%, ${t.bg} 12%, rgba(0,0,0,0) 30%)`}} />
      <div style={{position: 'absolute', left: 120, top: 240}}>
        <MaskRise p={clamp((f - 1) / 8)}>
          <Eyebrow size={26} color={t.b}>
            System design
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 3) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: '#fff', lineHeight: 1.1}}>From stage to broadcast.</div>
        </MaskRise>
      </div>
    </AbsoluteFill>
  );
};
