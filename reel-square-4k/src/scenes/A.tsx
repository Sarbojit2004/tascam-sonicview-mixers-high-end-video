import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene, useV, spread, stepAt} from '../lib/ctx';
import {clamp, easeInCubic, easeOutCubic, easeOutExpo, easeInOutSine, lerp, noise1} from '../lib/anim';
import {envSmooth, pulse} from '../lib/music';
import {FONT, rgba} from '../lib/theme';
import {Chip, Eyebrow, GlassCard, Hero, Logo, MaskRise, Slam} from '../ui/kit';
import {cutAspect} from '../lib/assets';
import {Backdrop} from '../fx/fx';

const S = 1920;

/* ============================================================== HOOK ==== */
/**
 * Three bars of riff / build. A 24dp sits in darkness and is revealed by
 * light — lightning on the Thunderstruck cut, a rising sweep on Lost Sky —
 * while the credits stack: Shivansh Electronics presents / TASCAM / SONICVIEW.
 */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t, v} = useV();
  const {dur, bars, beats, sixteenths} = useScene();
  const b1 = bars[1] ?? dur / 3;
  const b2 = bars[2] ?? (dur * 2) / 3;
  const p = f / dur;
  const mid = envSmooth(m, 'mid', f, 2);
  const high = envSmooth(m, 'high', f, 2);
  // strikes lit the product (the global Lightning layer draws the bolts)
  const strikeBeats = beats.filter((_, i) => i % 2 === 1);
  let strike = 0;
  for (const s of strikeBeats) {
    const d = f - s;
    if (d >= 0 && d < 7) strike = Math.max(strike, [1, 0.9, 0.2, 1, 0.5, 0.25, 0.1][d]);
  }
  const reveal = v === 'thunderstruck' ? clamp(0.1 + p * 0.5 + strike * 0.55 + mid * 0.1) : clamp(0.08 + easeInCubic(p) * 0.75 + high * 0.25);
  const sweepX = lerp(-10, 110, easeInOutSine(clamp(f / (b2 + 10))));
  const push = lerp(1.0, 1.12, easeInOutSine(p));
  const suck = clamp((f - (dur - 5)) / 5);

  // credits
  const shivIn = clamp((f - 2) / 10);
  const shivOut = clamp((f - b1 + 3) / 6);
  const tasIn = clamp((f - b1) / 7);
  const tasMove = easeOutExpo(clamp((f - b2) / 10));
  const letterStarts = sixteenths.filter((x) => x >= b2).slice(0, 9);
  const subIn = clamp((f - (beats.find((x) => x >= b2 + (dur - b2) * 0.45) ?? b2 + 20)) / 8);

  return (
    <AbsoluteFill style={{transform: `scale(${1 + suck * 0.08})`}}>
      <Backdrop dim={0.55} grid={0.35} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 72%'}}>
        <Hero id={105} x={S / 2} y={1720} w={1640} glow={0.4 + reveal} reflect={0.2} />
      </AbsoluteFill>
      {/* darkness with a moving hole of light */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 46% at ${sweepX}% 70%, rgba(4,5,8,0) 0%, rgba(4,5,8,0.55) 45%, rgba(4,5,8,0.97) 75%)`,
          opacity: 1 - reveal * 0.75,
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${t.bg} 0%, rgba(0,0,0,0) 42%)`}} />

      {/* Shivansh Electronics presents */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: S,
          top: 330,
          height: 360,
          opacity: easeOutCubic(shivIn) * (1 - shivOut),
          transform: `translateY(${(1 - easeOutExpo(shivIn)) * 40 - shivOut * 60}px)`,
        }}
      >
        <Logo name="shivansh" w={900} x={S / 2} y={120} center />
        <Eyebrow size={30} track={0.6} style={{position: 'absolute', top: 290, width: S, textAlign: 'center', opacity: clamp((f - (beats[1] ?? 10)) / 8)}}>
          presents
        </Eyebrow>
      </div>

      {/* TASCAM */}
      {f >= b1 - 1 && (
        <div
          style={{
            position: 'absolute',
            left: S / 2 - lerp(820, 440, tasMove) / 2,
            top: lerp(360, 220, tasMove),
            width: lerp(820, 440, tasMove),
            height: 200,
            clipPath: `inset(0 ${(1 - easeOutExpo(tasIn)) * 100}% 0 0)`,
          }}
        >
          <Logo name="tascam" w={lerp(820, 440, tasMove)} x={0} y={0} />
        </div>
      )}

      {/* SONICVIEW */}
      {f >= b2 - 1 && (
        <div style={{position: 'absolute', top: 420, width: S, display: 'flex', justifyContent: 'center'}}>
          <Slam text="SONICVIEW" f={f} starts={letterStarts} size={214} weight={800} track={0.01} glow={rgba(t.aRgb, 0.55)} />
        </div>
      )}
      {f >= b2 && (
        <Eyebrow
          size={30}
          track={0.55}
          color="rgba(255,255,255,0.8)"
          style={{position: 'absolute', top: 690, width: S, textAlign: 'center', opacity: subIn, transform: `translateY(${(1 - easeOutCubic(subIn)) * 20}px)`}}
        >
          Digital Mixing Console Series
        </Eyebrow>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: suck * 0.35, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/* ======================================================== HERO SEQUENCE == */
type HeroStep = {id: number; spec?: string};

/**
 * Product heroes cut on the beat. Big model word behind the product, the
 * product swings in from alternating sides, spec chips roll underneath.
 */
const HeroSequence: React.FC<{
  word: string;
  title: string;
  kicker: string;
  steps: HeroStep[];
  heroHoldBeats: number;
  specs: string[];
  finale?: 'quad' | 'tri';
  quad?: number[];
}> = ({word, title, kicker, steps, heroHoldBeats, specs, finale, quad = []}) => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, beats, bars, eighths} = useScene();
  const quadStart = finale ? bars[bars.length - 2] ?? dur : dur;
  const avail = beats.filter((b) => b >= (beats[heroHoldBeats] ?? 0) && b < quadStart);
  const starts = [0, ...spread(avail, steps.length - 1)];
  const {i, since} = stepAt(starts, f);
  const cur = steps[Math.max(0, i)];
  const inP = clamp(since / 7);
  const side = i % 2 === 0 ? 1 : -1;
  const kick = pulse(m.kicks, f + (m.frames ? 0 : 0), 5, true);
  const low = envSmooth(m, 'low', f, 2);
  const inQuad = f >= quadStart;
  const specStarts = spread(beats, specs.length);
  const sp = stepAt(specStarts, f);
  const wordP = easeOutExpo(clamp(f / 12));

  return (
    <AbsoluteFill>
      <Backdrop />
      {/* giant word behind the product */}
      <div
        style={{
          position: 'absolute',
          width: S,
          top: 300,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: word.length > 3 ? 560 : 640,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.045)',
          WebkitTextStroke: `3px ${rgba(t.aRgb, 0.55 + low * 0.3)}`,
          transform: `scale(${lerp(1.25, 1, wordP) + kick * 0.01}) translateX(${noise1(f / 60, 3) * 14}px)`,
          opacity: wordP * (inQuad ? 0.4 : 1),
        }}
      >
        {word}
      </div>
      {!inQuad && (
        <Hero
          key={i}
          id={cur.id}
          x={S / 2 + (1 - easeOutExpo(inP)) * 260 * side}
          y={1540}
          w={Math.min(i === 0 ? lerp(2100, 1560, easeOutExpo(clamp(f / 10))) : 1500, 1000 * cutAspect(cur.id))}
          rot={(1 - easeOutCubic(inP)) * 16 * side + noise1(f / 50, i) * 1.5}
          opacity={clamp(since / 2 + 0.2)}
          glow={0.5 + low * 0.6}
        />
      )}
      {inQuad &&
        quad.map((id, k) => {
          const qs = eighths.filter((b) => b >= quadStart)[k] ?? quadStart + k * 4;
          const qp = clamp((f - qs) / 6);
          const col = k % 2;
          const row = Math.floor(k / 2);
          const bw = 800;
          const bh = 520;
          return (
            <GlassCard
              key={id}
              id={id}
              mode="cut"
              size="m"
              b={{x: 140 + col * (bw + 40), y: 520 + row * (bh + 40), w: bw, h: bh}}
              r={30}
              kb={clamp((f - qs) / 40)}
              glow={0.3}
              style={{opacity: easeOutCubic(qp), transform: `translateY(${(1 - easeOutExpo(qp)) * 60}px) scale(${lerp(0.94, 1, easeOutExpo(qp))})`}}
            />
          );
        })}
      {/* title block */}
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <MaskRise p={clamp((f - 2) / 9)}>
          <Eyebrow size={26} color={t.b}>
            {kicker}
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 4) / 10)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 92, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.08}}>{title}</div>
        </MaskRise>
      </div>
      {/* spec chip */}
      {sp.i >= 0 && (
        <div style={{position: 'absolute', left: 120, top: inQuad ? 1712 : 1660}}>
          <MaskRise p={clamp(sp.since / 6)} key={sp.i}>
            <Chip size={30}>{specs[sp.i]}</Chip>
          </MaskRise>
        </div>
      )}
      {!inQuad && (
        <div
          style={{
            position: 'absolute',
            right: 170,
            top: 1672,
            fontFamily: FONT.mono,
            fontSize: 24,
            letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          {String(i + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const S16: React.FC = () => (
  <HeroSequence
    word="16XP"
    kicker="TASCAM Sonicview"
    title="16XP"
    heroHoldBeats={4}
    steps={[{id: 62}, {id: 59}, {id: 61}, {id: 52}, {id: 65}, {id: 66}, {id: 67}, {id: 68}, {id: 69}]}
    specs={['16+1 MOTORIZED FADERS', 'DUAL 7" TOUCHSCREENS', '16 XLR MIC/LINE INPUTS', 'IF-MTR32 RECORDING CARD INCLUDED']}
    finale="quad"
    quad={[65, 66, 67, 69]}
  />
);

/* ============================================================ 24XP ===== */
/** Hero slam, then triptych panels that deal in on the 8th notes. */
export const S24: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, beats, eighths} = useScene();
  const low = envSmooth(m, 'low', f, 2);
  const groups = [
    [104, 106, 107],
    [110, 112, 113],
    [114, 115, 116],
  ];
  const heroEnd = beats[3] ?? Math.round(dur * 0.25);
  const rest = beats.filter((b) => b >= heroEnd);
  const gStarts = spread(rest, groups.length);
  const g = stepAt(gStarts, f);
  const specs = ['24+1 MOTORIZED FADERS', 'TRIPLE 7" TOUCHSCREENS', '24 XLR MIC/LINE INPUTS'];
  const wordP = easeOutExpo(clamp(f / 12));
  return (
    <AbsoluteFill>
      <Backdrop />
      <div
        style={{
          position: 'absolute',
          width: S,
          top: 290,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: 600,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.04)',
          WebkitTextStroke: `3px ${rgba(t.bRgb, 0.45 + low * 0.35)}`,
          transform: `scale(${lerp(1.3, 1, wordP)})`,
          opacity: g.i >= 0 ? 0.35 : wordP,
        }}
      >
        24XP
      </div>
      {g.i < 0 && (
        <Hero id={109} x={S / 2} y={1560} w={lerp(2300, 1720, easeOutExpo(clamp(f / 11)))} glow={0.6 + low * 0.6} rot={noise1(f / 60, 9) * 2} />
      )}
      {g.i >= 0 &&
        groups[g.i].map((id, k) => {
          const es = eighths.filter((e) => e >= gStarts[g.i]);
          const s = es[k] ?? gStarts[g.i] + k * 4;
          const p = clamp((f - s) / 7);
          const box = [
            {x: 120, y: 540, w: 1090, h: 1080},
            {x: 1240, y: 540, w: 560, h: 525},
            {x: 1240, y: 1095, w: 560, h: 525},
          ][k];
          return (
            <GlassCard
              key={`${g.i}-${k}`}
              id={id}
              mode="cut"
              size={k === 0 ? 'l' : 'm'}
              b={box}
              r={36}
              pad={0.05}
              kb={clamp((f - s) / 50)}
              glow={0.35 + low * 0.4}
              style={{
                opacity: easeOutCubic(clamp(p * 2)),
                transform: `perspective(2400px) translateY(${(1 - easeOutExpo(p)) * 160}px) rotateX(${(1 - easeOutExpo(p)) * 18}deg)`,
              }}
            >
              <div style={{position: 'absolute', left: 30, bottom: 28, fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)'}}>
                {[104, 106, 107].includes(id) ? '24dp' : '24XP'} · {String(id).padStart(3, '0')}
              </div>
            </GlassCard>
          );
        })}
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <MaskRise p={clamp((f - 2) / 9)}>
          <Eyebrow size={26} color={t.b}>
            TASCAM Sonicview
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 4) / 10)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 92, color: '#fff', lineHeight: 1.08}}>24XP · 24dp</div>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 120, top: 1672}}>
        {specs.map((s, k) =>
          k === Math.max(0, g.i) ? (
            <MaskRise key={k} p={clamp((f - (g.i < 0 ? 6 : gStarts[g.i])) / 6)}>
              <Chip size={30}>{s}</Chip>
            </MaskRise>
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};
