import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useScene, useV, spread, stepAt} from '../lib/ctx';
import {clamp, easeInOutSine, easeOutCubic, easeOutExpo, lerp, noise1} from '../lib/anim';
import {envSmooth, pulse} from '../lib/music';
import {FONT, rgba} from '../lib/theme';
import {IMG_M, KO, LOGO_ASPECT, aspect} from '../lib/assets';
import {Chip, Eyebrow, GlassCard, MaskRise} from '../ui/kit';
import {Backdrop} from '../fx/fx';

const S = 1920;

/* ============================================================== VIEW ===== */
/**
 * The VIEW screens on a curved, panoramic monitor wall that pans past the
 * viewer; every screen boots up on its own 16th note.
 */
export const View: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, sixteenths, beats} = useScene();
  const ids = [1, 2, 3, 70, 71, 78, 79, 80, 82, 83, 87, 89, 95, 121, 86, 84, 74];
  const rows = [ids.slice(0, 6), ids.slice(6, 12), ids.slice(12)];
  const R = 1650;
  const step = 21;
  const pan = lerp(18, -22, easeInOutSine(f / dur));
  const boot = sixteenths.slice(0, ids.length + 4);
  const high = envSmooth(m, 'high', f, 2);
  const koA = (LOGO_ASPECT as Record<string, number>)['ko88'] ?? 3.2;
  const titleP = clamp((f - 1) / 10);
  const cw = 560;
  const ch = 350;
  let n = 0;
  return (
    <AbsoluteFill>
      <Backdrop grid={0.3} />
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 58%'}}>
        <div style={{position: 'absolute', left: S / 2, top: 1130, transformStyle: 'preserve-3d', transform: `translateZ(${R - 520}px) rotateX(4deg)`}}>
          {rows.map((row, r) =>
            row.map((id, k) => {
              const idx = n++;
              const th = (k - (row.length - 1) / 2) * step + pan + (r === 1 ? step / 2 : 0);
              const bs = boot[idx] ?? idx * 2;
              const bp = clamp((f - bs) / 5);
              const on = f >= bs;
              const ia = aspect(id);
              return (
                <div
                  key={id}
                  style={{
                    position: 'absolute',
                    left: -cw / 2,
                    top: -ch / 2 + (r - 1) * (ch + 34),
                    width: cw,
                    height: ch,
                    transform: `rotateY(${th}deg) translateZ(${-R}px)`,
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: '#07080B',
                    boxShadow: `inset 0 0 0 2px rgba(255,255,255,${on ? 0.16 + (1 - bp) * 0.6 : 0.06})`,
                  }}
                >
                  <Img
                    src={IMG_M(id)}
                    style={{
                      position: 'absolute',
                      ...(ia > cw / ch ? {height: ch, width: ch * ia, left: (cw - ch * ia) / 2, top: 0} : {width: cw, height: cw / ia, top: (ch - cw / ia) / 2, left: 0}),
                      opacity: on ? 0.25 + 0.75 * easeOutCubic(bp) : 0.12,
                    }}
                  />
                  {/* scanline boot */}
                  {on && bp < 1 && (
                    <div style={{position: 'absolute', left: 0, right: 0, top: `${bp * 100}%`, height: 10, background: t.b, opacity: 0.9 * (1 - bp)}} />
                  )}
                  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 30%)'}} />
                </div>
              );
            }),
          )}
        </div>
      </AbsoluteFill>
      {/* fade the wall into the floor/ceiling */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${t.bg} 0%, rgba(0,0,0,0) 36%, rgba(0,0,0,0) 80%, ${t.bg} 100%)`}} />
      <div style={{position: 'absolute', top: 210, width: S, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{opacity: easeOutCubic(titleP), transform: `scale(${lerp(1.2, 1, easeOutExpo(titleP))})`}}>
          <Img src={KO(88)} style={{width: 620, height: 620 / koA, filter: `drop-shadow(0 0 ${18 + high * 30}px ${rgba(t.aRgb, 0.7)})`}} />
        </div>
        <MaskRise p={clamp((f - (beats[1] ?? 8)) / 8)} style={{marginTop: 26}}>
          <Eyebrow size={27} track={0.34} color="rgba(255,255,255,0.8)">
            Visual Interactive Ergonomic Workflow
          </Eyebrow>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 120, bottom: 150}}>
        <MaskRise p={clamp((f - (beats[4] ?? 30)) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 70, color: '#fff', lineHeight: 1.1}}>See the whole mix at once.</div>
        </MaskRise>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================ ENGINE ===== */
type Spec = {n: string; l: string; ids: number[]; ko?: boolean; mode?: 'paper' | 'cover'};
const ENGINE: Spec[] = [
  {n: '54-BIT', l: 'Floating-point FPGA mixing engine', ids: [13], mode: 'paper'},
  {n: '96 kHz', l: 'Native processing rate', ids: [48], mode: 'cover'},
  {n: '0.51 ms', l: 'Analog-to-analog latency', ids: [76], mode: 'cover'},
  {n: 'CLASS 1', l: 'HDIA mic preamps', ids: [81], ko: true},
  {n: '−128 dBu', l: 'Equivalent input noise', ids: [8], mode: 'paper'},
  {n: 'LOW NOISE', l: 'Sonicview op amp vs. general-purpose', ids: [10, 9], mode: 'paper'},
  {n: '32-BIT', l: 'A/D conversion', ids: [11], mode: 'paper'},
];

export const Engine: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {beats} = useScene();
  const starts = spread(beats, ENGINE.length);
  const {i, since} = stepAt(starts, f);
  const s = ENGINE[Math.max(0, i)];
  const p = clamp(since / 6);
  const low = envSmooth(m, 'low', f, 2);
  const kick = pulse(m.kicks, f, 4, true);
  const card = {x: 120, y: 760, w: 1680, h: 930};
  return (
    <AbsoluteFill>
      <Backdrop />
      {/* progress rail */}
      <div style={{position: 'absolute', left: 120, top: 250, display: 'flex', gap: 10}}>
        {ENGINE.map((_, k) => (
          <div key={k} style={{width: 64, height: 6, borderRadius: 3, background: k <= i ? t.a : 'rgba(255,255,255,0.14)', boxShadow: k === i ? `0 0 16px ${t.a}` : undefined}} />
        ))}
      </div>
      <Eyebrow size={24} color={t.b} style={{position: 'absolute', left: 120, top: 290}}>
        Inside the engine
      </Eyebrow>
      <div style={{position: 'absolute', left: 110, top: 350, height: 250, overflow: 'hidden'}}>
        <div
          key={i}
          style={{
            transform: `translateY(${(1 - easeOutExpo(p)) * 105}%) scale(${1 + kick * 0.015})`,
            transformOrigin: '0% 100%',
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 200,
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            color: '#fff',
            whiteSpace: 'nowrap',
            textShadow: `0 0 ${30 + low * 40}px ${rgba(t.aRgb, 0.45)}`,
          }}
        >
          {s.n}
        </div>
      </div>
      <div style={{position: 'absolute', left: 124, top: 620}}>
        <MaskRise p={clamp((since - 2) / 6)} key={i}>
          <div style={{fontFamily: FONT.ui, fontWeight: 500, fontSize: 44, color: 'rgba(255,255,255,0.86)'}}>{s.l}</div>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: S, height: S, perspective: 2600}}>
        {s.ids.map((id, k) => {
          const w = s.ids.length === 1 ? card.w : (card.w - 30) / 2;
          const b = {x: card.x + k * (w + 30), y: card.y, w, h: card.h};
          const flip = (1 - easeOutExpo(clamp((since - k * 2) / 8))) * -80;
          if (s.ko) {
            const a = (LOGO_ASPECT as Record<string, number>)['ko81'] ?? 2.6;
            return (
              <div
                key={`${i}-${k}`}
                style={{
                  position: 'absolute',
                  left: b.x,
                  top: b.y,
                  width: b.w,
                  height: b.h,
                  borderRadius: 34,
                  overflow: 'hidden',
                  background: `radial-gradient(60% 60% at 50% 50%, ${rgba(t.aRgb, 0.28 + low * 0.2)}, #0B0D12 70%)`,
                  boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.14)',
                  transform: `rotateX(${flip}deg)`,
                  transformOrigin: '50% 0%',
                }}
              >
                <Img src={KO(81)} style={{position: 'absolute', width: 1150, height: 1150 / a, left: (b.w - 1150) / 2, top: (b.h - 1150 / a) / 2}} />
              </div>
            );
          }
          return (
            <GlassCard
              key={`${i}-${k}`}
              id={id}
              b={b}
              r={34}
              size="l"
              mode={s.mode}
              kb={clamp(since / 40)}
              style={{transform: `rotateX(${flip}deg)`, transformOrigin: '50% 0%'}}
            />
          );
        })}
      </div>
      <div style={{position: 'absolute', right: 150, top: 800, opacity: clamp((since - 4) / 5)}}>
        <Chip size={24}>FIG. {String(i + 1).padStart(2, '0')}</Chip>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================== WALL ===== */
/** Twenty fronts and rears on a lit grid — the dp power story. */
export const Wall: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, sixteenths, beats, bars} = useScene();
  const ids = [54, 56, 57, 58, 60, 63, 98, 108, 123, 124, 25, 26, 53, 55, 64, 92, 103, 111, 117, 122];
  const cols = 5;
  const gw = 1680;
  const gap = 22;
  const w = (gw - gap * (cols - 1)) / cols;
  const h = 236;
  const y0 = 600;
  // diagonal wave order
  const order = ids
    .map((id, k) => ({id, k, d: (k % cols) + Math.floor(k / cols)}))
    .sort((a, b) => a.d - b.d || a.k - b.k)
    .map((o) => o.k);
  const pops = sixteenths.slice(0, ids.length);
  const push = lerp(1, 1.07, easeInOutSine(f / dur));
  const sweep = ((f - (bars[1] ?? dur / 2)) / 20) * 100;
  const sel = stepAt(beats.filter((b) => b >= (bars[1] ?? dur / 2)), f);
  const low = envSmooth(m, 'low', f, 2);
  const kick = pulse(m.kicks, f, 5, true);
  return (
    <AbsoluteFill>
      <Backdrop grid={0.4} />
      <AbsoluteFill style={{transform: `scale(${push + kick * 0.006})`, transformOrigin: '50% 60%'}}>
        {ids.map((id, k) => {
          const col = k % cols;
          const row = Math.floor(k / cols);
          const ps = pops[order.indexOf(k)] ?? k * 2;
          const p = clamp((f - ps) / 6);
          const selected = sel.i >= 0 && (sel.i * 7 + 3) % ids.length === k && sel.since < 10;
          return (
            <GlassCard
              key={id}
              id={id}
              size="m"
              b={{x: 120 + col * (w + gap), y: y0 + row * (h + gap), w, h}}
              r={22}
              pad={0.07}
              glow={selected ? 0.8 : 0.15 + low * 0.2}
              style={{
                opacity: easeOutCubic(clamp(p * 2)),
                transform: `translateZ(0) scale(${lerp(0.7, 1, easeOutExpo(p)) * (selected ? 1.04 : 1)})`,
                boxShadow: selected ? `inset 0 0 0 3px ${t.a}` : 'inset 0 0 0 1.5px rgba(255,255,255,0.13)',
              }}
            />
          );
        })}
        {/* light sweep across the wall */}
        {sweep > -40 && sweep < 160 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: y0 - 40,
              width: S,
              height: 4 * (h + gap) + 60,
              background: `linear-gradient(105deg, rgba(0,0,0,0) ${sweep - 22}%, ${rgba(t.bRgb, 0.18)} ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <MaskRise p={clamp((f - 1) / 8)}>
          <Eyebrow size={26} color={t.b}>
            16dp · 24dp · 16XP · 24XP
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 3) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 78, color: '#fff', lineHeight: 1.1}}>Not a bigger desk.</div>
        </MaskRise>
        <MaskRise p={clamp((f - (beats[2] ?? 12)) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 78, color: t.b, lineHeight: 1.1}}>A second supply.</div>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 120, top: 1690}}>
        <MaskRise p={clamp((f - (bars[1] ?? 20)) / 7)}>
          <Chip size={28}>dp · DUAL-REDUNDANT POWER · AC + DC</Chip>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', right: 120, top: 1700, fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)'}}>
        FRONT · REAR I/O · {ids.length} VIEWS
      </div>
    </AbsoluteFill>
  );
};
