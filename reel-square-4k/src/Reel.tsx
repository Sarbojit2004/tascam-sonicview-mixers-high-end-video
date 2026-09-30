import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {SceneProvider, VersionProvider, useV} from './lib/ctx';
import {IMPACT_BARS, SceneId, TimedScene, timeline} from './lib/plan';
import {VersionId} from './lib/music';
import {clamp, easeOutExpo, lerp} from './lib/anim';
import {Camera, Flashes, Hud, Lightning, Shockwaves, Streaks, Vignette} from './fx/fx';
import {Hook, S16, S24} from './scenes/A';
import {Engine, View, Wall} from './scenes/B';
import {Cards, Dante, Flow} from './scenes/C';
import {Field, Finale, Outro} from './scenes/D';

const SCENE: Record<SceneId, React.FC> = {
  hook: Hook,
  s16: S16,
  s24: S24,
  view: View,
  engine: Engine,
  wall: Wall,
  dante: Dante,
  cards: Cards,
  flow: Flow,
  field: Field,
  finale: Finale,
  outro: Outro,
};

/** Every cut settles from a slight over-zoom — the camera "lands" on the downbeat. */
const Land: React.FC<{children: React.ReactNode; hard?: boolean}> = ({children, hard}) => {
  const f = useCurrentFrame();
  const p = easeOutExpo(clamp(f / (hard ? 12 : 9)));
  return <AbsoluteFill style={{transform: `scale(${lerp(hard ? 1.14 : 1.07, 1, p)})`}}>{children}</AbsoluteFill>;
};

const HudLayer: React.FC<{tl: TimedScene[]}> = ({tl}) => {
  const f = useCurrentFrame();
  const {m} = useV();
  const start = tl[1].from;
  const end = tl[tl.length - 1].from;
  // hidden under full-bleed titles (finale logo bar) and the outro
  const fin = tl.find((s) => s.id === 'finale');
  const finBoom = fin ? m.downbeats[fin.b0 + 1]?.f ?? fin.to : end;
  const o = clamp((f - start) / 8) * clamp((finBoom - f) / 6);
  let bar = 0;
  for (let k = 0; k < m.downbeats.length; k++) if (m.downbeats[k].f <= f) bar = k;
  return <Hud o={o} bar={bar} />;
};

const Inner: React.FC = () => {
  const {m, v, t} = useV();
  const tl = timeline(m);
  const impacts = IMPACT_BARS[v].map((b) => m.downbeats[b].f);
  const cuts = tl.slice(1).map((s) => s.from);
  const hits = [
    ...cuts.map((f) => ({f, o: 0.42, d: 2.6})),
    ...impacts.map((f) => ({f, o: 1, d: 5})),
    // the outro's reveals ride the music too
    ...m.downbeats.filter((d) => d.f > tl[tl.length - 1].from).map((d) => ({f: d.f, o: v === 'thunderstruck' ? 0.3 : 0.12, d: 4})),
  ];
  // Lightning: the riff's off-beats in the hook, every impact, and the hardest
  // snares of the band section (spaced at least two bars apart).
  const strikes: {f: number; big?: boolean}[] = [];
  if (t.fx === 'lightning') {
    const hookEnd = tl[1].from;
    m.beats.filter((b) => b.f < hookEnd && (b.pos === 2 || b.pos === 4)).forEach((b) => strikes.push({f: b.f}));
    impacts.forEach((f) => strikes.push({f, big: true}));
    const outroAt = tl[tl.length - 1].from;
    const cands = m.snares.filter((s) => s.f > impacts[1] && s.f < outroAt - 30).sort((a, b) => (b.v ?? 0) - (a.v ?? 0));
    const picked: number[] = [];
    for (const c of cands) {
      if (picked.every((p) => Math.abs(p - c.f) > 100)) picked.push(c.f);
      if (picked.length >= 9) break;
    }
    picked.forEach((f) => strikes.push({f}));
    m.downbeats.filter((d) => d.f >= outroAt).forEach((d) => strikes.push({f: d.f, big: true}));
  }
  const whips = cuts.filter((_, k) => k % 3 === 1);
  return (
    <AbsoluteFill style={{background: t.bg}}>
      <Camera impacts={impacts}>
        {tl.map((s) => {
          const C = SCENE[s.id];
          return (
            <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
              <SceneProvider scene={s}>
                <Land hard={impacts.includes(s.from)}>
                  <C />
                </Land>
              </SceneProvider>
            </Sequence>
          );
        })}
      </Camera>
      {strikes.length > 0 && <Lightning strikes={strikes} />}
      <Streaks at={whips} />
      <Shockwaves at={impacts} />
      <Flashes hits={hits} />
      <HudLayer tl={tl} />
      <Vignette />
      <Audio src={staticFile(`audio/${v}.wav`)} />
    </AbsoluteFill>
  );
};

export const Reel: React.FC<{v: VersionId}> = ({v}) => (
  <VersionProvider v={v}>
    <Inner />
  </VersionProvider>
);
