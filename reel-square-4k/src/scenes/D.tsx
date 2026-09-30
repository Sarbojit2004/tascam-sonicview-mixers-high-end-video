import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useScene, useV, spread, stepAt} from '../lib/ctx';
import {clamp, easeInCubic, easeInOutSine, easeOutBack, easeOutCubic, easeOutExpo, lerp, noise1} from '../lib/anim';
import {envSmooth, pulse} from '../lib/music';
import {COPY, FONT, rgba} from '../lib/theme';
import {BLUR, ICON, IMG, aspect} from '../lib/assets';
import {Chip, Eyebrow, GlassCard, Logo, MaskRise, Pill, logoH} from '../ui/kit';
import {Backdrop} from '../fx/fx';

const S = 1920;

/* ============================================================= FIELD ===== */
const FIELD: {id: number; tag: string; zoom?: number}[] = [
  {id: 125, tag: 'LIVE · NEWPORT JAZZ FESTIVAL 2023'},
  {id: 6, tag: 'EDUCATION · HCMC UNIVERSITY OF TECHNOLOGY'},
  {id: 5, tag: 'EDUCATION · CONFERENCE ROOM'},
  {id: 132, tag: 'CORPORATE · CONFERENCE ROOMS'},
  {id: 126, tag: 'BROADCAST · RADIO'},
  {id: 127, tag: 'BROADCAST · ON AIR'},
  {id: 128, tag: 'BROADCAST · SONICVIEW 16 IN THE STUDIO'},
  {id: 130, tag: 'BROADCAST · NEXT-GENERATION RADIO', zoom: 2.05},
];

/** Full-bleed installation photos, revealed by falling slices on each beat. */
export const Field: React.FC = () => {
  const f = useCurrentFrame();
  const {t} = useV();
  const {beats} = useScene();
  const starts = spread(beats, FIELD.length);
  const {i, since} = stepAt(starts, f);
  const SL = 6;
  const layer = (k: number, reveal: number) => {
    const it = FIELD[k];
    const a = aspect(it.id);
    const z = it.zoom ?? 1;
    const w = a >= 1 ? S * a * z : S * z;
    const h = a >= 1 ? S * z : (S / a) * z;
    const kb = clamp((f - starts[k]) / 70);
    const s = lerp(1.12, 1.0, easeOutCubic(kb));
    const dx = noise1(k * 3.3, 7) * 40 * kb;
    return (
      <AbsoluteFill key={k}>
        {Array.from({length: SL}, (_, q) => {
          const qp = clamp((reveal - q * 0.9) / 5);
          return (
            <div
              key={q}
              style={{
                position: 'absolute',
                left: (S / SL) * q,
                top: 0,
                width: S / SL + 1,
                height: S,
                overflow: 'hidden',
                transform: `translateY(${(1 - easeOutExpo(qp)) * -100}%)`,
              }}
            >
              <Img
                src={IMG(it.id)}
                style={{
                  position: 'absolute',
                  width: w,
                  height: h,
                  left: (S - w) / 2 - (S / SL) * q + dx,
                  top: (S - h) / 2,
                  transform: `scale(${s})`,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill style={{background: t.bg}}>
      {i > 0 && layer(i - 1, 99)}
      {i >= 0 && layer(i, since)}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.75) 100%)'}} />
      <div style={{position: 'absolute', left: 120, top: 240}}>
        <MaskRise p={clamp((f - 1) / 8)}>
          <Eyebrow size={26} color={t.b}>
            In service
          </Eyebrow>
        </MaskRise>
        <MaskRise p={clamp((f - 3) / 9)}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: '#fff', lineHeight: 1.1}}>Where Sonicview works.</div>
        </MaskRise>
      </div>
      <div style={{position: 'absolute', left: 120, top: 1690}}>
        {i >= 0 && (
          <MaskRise key={i} p={clamp(since / 6)}>
            <Chip size={28}>{FIELD[i].tag}</Chip>
          </MaskRise>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================ FINALE ===== */
/** The whole family as a mosaic, then it blows outward and TASCAM lands. */
export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {dur, eighths, bars} = useScene();
  const ids = [35, 42, 43, 50, 51, 75, 97, 99, 100, 101, 102];
  const rows = [ids.slice(0, 4), ids.slice(4, 7), ids.slice(7)];
  const gap = 24;
  const rowH = [230, 320, 230];
  const y0 = 520;
  const pops = eighths.slice(0, ids.length);
  const boom = bars[1] ?? Math.round(dur / 2);
  const bp = clamp((f - boom) / 10);
  const low = envSmooth(m, 'low', f, 2);
  const kick = pulse(m.kicks, f, 5, true);
  let n = 0;
  const tiles: React.ReactNode[] = [];
  let y = y0;
  rows.forEach((row, r) => {
    const w = (1680 - gap * (row.length - 1)) / row.length;
    row.forEach((id, k) => {
      const idx = n++;
      const x = 120 + k * (w + gap);
      const ps = pops[idx] ?? idx * 3;
      const p = clamp((f - ps) / 6);
      const cxo = x + w / 2 - S / 2;
      const cyo = y + rowH[r] / 2 - 1000;
      const out = easeInCubic(bp);
      tiles.push(
        <GlassCard
          key={id}
          id={id}
          mode="cover"
          size="m"
          b={{x, y, w, h: rowH[r]}}
          r={22}
          kb={clamp((f - ps) / 50)}
          style={{
            opacity: easeOutCubic(clamp(p * 2)) * (1 - out),
            transform: `translate(${cxo * out * 1.4}px, ${cyo * out * 1.4}px) scale(${lerp(0.8, 1, easeOutExpo(p)) * (1 + out * 0.6)})`,
          }}
        />,
      );
    });
    y += rowH[r] + gap;
  });
  const lp = clamp((f - boom) / 9);
  const tw = 1060;
  return (
    <AbsoluteFill>
      <Backdrop />
      {tiles}
      {f < boom && (
        <div style={{position: 'absolute', left: 120, top: 250}}>
          <MaskRise p={clamp((f - 1) / 8)}>
            <Eyebrow size={26} color={t.b}>
              One platform
            </Eyebrow>
          </MaskRise>
          <MaskRise p={clamp((f - 3) / 9)}>
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: '#fff', lineHeight: 1.1}}>The Sonicview family.</div>
          </MaskRise>
        </div>
      )}
      {f >= boom && (
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: S / 2 - 700,
              top: 1000 - 700,
              width: 1400,
              height: 1400,
              background: `radial-gradient(closest-side, ${rgba(t.aRgb, 0.3 + low * 0.25)}, rgba(0,0,0,0) 70%)`,
              opacity: lp,
            }}
          />
          <div style={{position: 'absolute', left: 0, top: 0, width: S, height: S, transform: `scale(${lerp(1.5, 1, easeOutExpo(lp)) + kick * 0.01})`, transformOrigin: '50% 45%', opacity: clamp(lp * 3)}}>
            <Logo name="tascam" w={tw} x={S / 2} y={860} center />
          </div>
          <div style={{position: 'absolute', top: 860 + logoH('tascam', tw) / 2 + 70, width: S, textAlign: 'center'}}>
            <MaskRise p={clamp((f - boom - 4) / 8)}>
              <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 92, letterSpacing: '0.32em', color: '#fff', paddingLeft: '0.32em'}}>SONICVIEW</div>
            </MaskRise>
            <MaskRise p={clamp((f - boom - 8) / 8)} style={{marginTop: 24}}>
              <Eyebrow size={34} track={0.3} color={t.b} style={{textTransform: 'none'}}>
                16XP · 16dp · 24XP · 24dp
              </Eyebrow>
            </MaskRise>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ============================================================= OUTRO ===== */
/**
 * Ten seconds, in the Audient Horizon presentation language: a dark cinematic
 * backdrop, one large rounded media card with the headline top-left and a
 * glass pill top-right, then the partner mark and contact pills below.
 * Reveals land on the music: Thunderstruck's closing stabs, or Lost Sky's bars.
 */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {m, t} = useV();
  const {scene, dur} = useScene();
  const hits = m.downbeats.filter((d) => d.f >= scene.from).map((d) => d.f - scene.from);
  const h = (k: number) => hits[k] ?? Math.round((dur * k) / 6);
  const low = envSmooth(m, 'low', f, 3);
  const push = lerp(1.0, 1.07, easeInOutSine(f / dur));
  const cardP = clamp(f / 18);
  const card = {x: 150, y: 330, w: 1620, h: 820};
  const reveal = (s: number, d = 9) => clamp((f - s) / d);
  const sweep = (s: number) => {
    const q = (f - s) / 24;
    return q > 0 && q < 1 ? q : -1;
  };
  const sw1 = sweep(4);
  const sw2 = sweep(h(1));
  const sw4 = sweep(h(4));
  const shivW = 700;
  return (
    <AbsoluteFill style={{background: t.bg}}>
      {/* cinematic backdrop */}
      <AbsoluteFill style={{transform: `scale(${1.15 * push})`}}>
        <Img src={BLUR(128)} style={{position: 'absolute', width: S, height: S, objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,5,8,0.78) 0%, rgba(4,5,8,0.6) 40%, rgba(4,5,8,0.86) 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(60% 40% at 50% 38%, ${rgba(t.aRgb, 0.1 + low * 0.08)}, rgba(0,0,0,0) 70%)`}} />

      {/* TASCAM + series */}
      <div style={{position: 'absolute', top: 128, width: S, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: easeOutCubic(reveal(2, 10))}}>
        <div style={{position: 'relative', width: 400, height: logoH('tascam', 400)}}>
          <Logo name="tascam" w={400} />
        </div>
        <Eyebrow size={24} track={0.5} style={{marginTop: 22}}>
          Sonicview Series
        </Eyebrow>
      </div>

      {/* hero media card */}
      <div
        style={{
          position: 'absolute',
          left: card.x,
          top: card.y,
          width: card.w,
          height: card.h,
          borderRadius: 48,
          overflow: 'hidden',
          opacity: easeOutCubic(clamp(cardP * 1.6)),
          transform: `translateY(${(1 - easeOutExpo(cardP)) * 90}px) scale(${lerp(0.94, 1, easeOutExpo(cardP))})`,
          boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.18)',
          background: '#0A0B0F',
        }}
      >
        <Img
          src={IMG(128)}
          style={{
            position: 'absolute',
            width: card.w * 1.08,
            height: (card.w * 1.08) / aspect(128),
            left: -card.w * 0.04 + lerp(0, -40, f / dur),
            top: (card.h - (card.w * 1.08) / aspect(128)) / 2 + 60,
            transform: `scale(${lerp(1.04, 1.12, f / dur)})`,
          }}
        />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 42%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.55) 100%)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)'}} />
        {sw1 >= 0 && (
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${sw1 * 140 - 30}%, rgba(255,255,255,0.14) ${sw1 * 140 - 10}%, rgba(255,255,255,0) ${sw1 * 140 + 10}%)`}} />
        )}
        <div style={{position: 'absolute', left: 72, top: 66}}>
          <MaskRise p={reveal(8)}>
            <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 66, color: '#fff', lineHeight: 1.18}}>Sonicview 16XP · 24XP</div>
          </MaskRise>
          <MaskRise p={reveal(13)}>
            <div style={{fontFamily: FONT.ui, fontWeight: 400, fontSize: 36, color: 'rgba(255,255,255,0.86)', marginTop: 10}}>54-bit FPGA · 96 kHz · Dante built in</div>
          </MaskRise>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 64,
            top: 66,
            opacity: easeOutCubic(reveal(18, 8)),
            transform: `scale(${lerp(0.85, 1, easeOutBack(reveal(18, 10), 1.4))})`,
            transformOrigin: '100% 50%',
          }}
        >
          <Pill size={30}>Technical consultation</Pill>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', opacity: easeOutCubic(reveal(24, 10))}}>
          <Pill size={28}>
            <span style={{fontFamily: FONT.display, fontWeight: 600, letterSpacing: '0.06em', fontSize: 34}}>IF-SERIES</span>
            <span style={{opacity: 0.9}}>ST 2110 · MADI · AES/EBU · Dante · SB-16D</span>
          </Pill>
        </div>
      </div>

      {/* partner */}
      <div style={{position: 'absolute', top: 1196, width: S, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            position: 'relative',
            width: shivW,
            height: logoH('shivansh', shivW),
            clipPath: `inset(0 ${(1 - easeOutExpo(reveal(h(1), 12))) * 100}% 0 0)`,
          }}
        >
          <Logo name="shivansh" w={shivW} />
          {sw2 >= 0 && (
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, rgba(0,0,0,0) ${sw2 * 140 - 30}%, ${rgba(t.bRgb, 0.35)} ${sw2 * 140 - 10}%, rgba(0,0,0,0) ${sw2 * 140 + 10}%)`, mixBlendMode: 'screen'}} />
          )}
        </div>
        <MaskRise p={reveal(h(1) + 6)} style={{marginTop: 18}}>
          <div style={{fontFamily: FONT.ui, fontWeight: 500, fontSize: 36, color: '#fff', letterSpacing: '0.02em'}}>{COPY.role}</div>
        </MaskRise>
      </div>

      {/* contact pills */}
      <div style={{position: 'absolute', top: 1540, width: S, display: 'flex', justifyContent: 'center', gap: 22}}>
        {COPY.phones.map((p, k) => {
          const q = reveal(h(2) + k * 4, 8);
          return (
            <div key={p} style={{opacity: easeOutCubic(q), transform: `translateY(${(1 - easeOutExpo(q)) * 40}px)`}}>
              <Pill size={31} icon={ICON.whatsapp} strong={sw4 >= 0 && Math.abs(sw4 - (k + 0.5) / 5) < 0.12}>
                {p}
              </Pill>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1664, width: S, display: 'flex', justifyContent: 'center', gap: 22}}>
        {[
          <Pill key="w" size={31} icon={ICON.website}>
            {COPY.website}
          </Pill>,
          <Pill key="s" size={31}>
            <span style={{display: 'flex', gap: 16}}>
              <Img src={ICON.instagram} style={{height: 40}} />
              <Img src={ICON.youtube} style={{height: 40}} />
              <Img src={ICON.facebook} style={{height: 40}} />
            </span>
            Follow Shivansh Electronics
          </Pill>,
        ].map((el, k) => {
          const q = reveal(h(3) + k * 4, 8);
          return (
            <div key={k} style={{opacity: easeOutCubic(q), transform: `translateY(${(1 - easeOutExpo(q)) * 40}px)`}}>
              {el}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1812,
          width: S,
          textAlign: 'center',
          fontFamily: FONT.mono,
          fontSize: 22,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.5)',
          opacity: reveal(h(3) + 10, 10),
        }}
      >
        SYSTEM DESIGN · PROTOCOL MATCHING · INFRASTRUCTURE PLANNING
      </div>
      {sw4 >= 0 && (
        <AbsoluteFill style={{background: `linear-gradient(100deg, rgba(0,0,0,0) ${sw4 * 140 - 30}%, ${rgba(t.bRgb, 0.12)} ${sw4 * 140 - 10}%, rgba(0,0,0,0) ${sw4 * 140 + 10}%)`, mixBlendMode: 'screen'}} />
      )}
    </AbsoluteFill>
  );
};

export {Logo};
