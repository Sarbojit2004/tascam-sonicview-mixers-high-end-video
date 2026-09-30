import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {Music, VersionId, MUSIC, beatsIn, eighthsIn, sixteenthsIn} from './music';
import {Theme, THEMES} from './theme';
import {TimedScene} from './plan';

type V = {v: VersionId; m: Music; t: Theme};
const VCtx = createContext<V>({v: 'thunderstruck', m: MUSIC.thunderstruck, t: THEMES.thunderstruck});

export const VersionProvider: React.FC<{v: VersionId; children: React.ReactNode}> = ({v, children}) => (
  <VCtx.Provider value={{v, m: MUSIC[v], t: THEMES[v]}}>{children}</VCtx.Provider>
);
export const useV = () => useContext(VCtx);

/** Scene-local timing: frames are relative to the scene start. */
export type SceneTiming = {
  scene: TimedScene;
  dur: number;
  beats: number[];
  eighths: number[];
  sixteenths: number[];
  bars: number[];
};
const SCtx = createContext<SceneTiming | null>(null);

export const SceneProvider: React.FC<{scene: TimedScene; children: React.ReactNode}> = ({scene, children}) => {
  const {m} = useV();
  const rel = (a: number[]) => a.map((f) => f - scene.from);
  const bars: number[] = [];
  for (let b = scene.b0; b <= scene.b1 && b < m.downbeats.length; b++) bars.push(m.downbeats[b].f - scene.from);
  const value: SceneTiming = {
    scene,
    dur: scene.dur,
    beats: rel(beatsIn(m, scene.from, scene.to)),
    eighths: rel(eighthsIn(m, scene.from, scene.to)),
    sixteenths: rel(sixteenthsIn(m, scene.from, scene.to)),
    bars,
  };
  return <SCtx.Provider value={value}>{children}</SCtx.Provider>;
};

export const useScene = () => {
  const s = useContext(SCtx);
  if (!s) throw new Error('useScene outside SceneProvider');
  return s;
};

/**
 * Evenly distribute n steps over a grid (beats/eighths), always starting at
 * grid[0]. Returns scene-local start frames.
 */
export const spread = (grid: number[], n: number, startIdx = 0, endIdx = grid.length) => {
  const g = grid.slice(startIdx, endIdx);
  if (g.length === 0) return Array.from({length: n}, (_, i) => i * 8);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(g[Math.min(g.length - 1, Math.floor((i * g.length) / n))]);
  return out;
};

/** Index of the active step and frames since it began. */
export const stepAt = (starts: number[], f: number) => {
  let i = -1;
  for (let k = 0; k < starts.length; k++) if (starts[k] <= f) i = k;
  return {i, since: i >= 0 ? f - starts[i] : -1};
};

export const useLocalFrame = () => useCurrentFrame();
