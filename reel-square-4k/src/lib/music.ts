import thunder from '../music/thunderstruck.json';
import lost from '../music/lostsky.json';

export type Ev = {t: number; f: number; v?: number; pos?: number};
export type Music = {
  id: string;
  title: string;
  fps: number;
  frames: number;
  duration: number;
  beats: Ev[];
  downbeats: Ev[];
  kicks: Ev[];
  snares: Ev[];
  sections: {bar: number; name: string}[];
  env: {low: number[]; mid: number[]; high: number[]; rms: number[]};
};

export type VersionId = 'thunderstruck' | 'lostsky';

export const MUSIC: Record<VersionId, Music> = {
  thunderstruck: thunder as unknown as Music,
  lostsky: lost as unknown as Music,
};

export const envAt = (m: Music, k: keyof Music['env'], f: number) => {
  const a = m.env[k];
  const i = Math.max(0, Math.min(a.length - 1, Math.round(f)));
  return a[i] ?? 0;
};

/** Envelope averaged over +-w frames — steadier for glows. */
export const envSmooth = (m: Music, k: keyof Music['env'], f: number, w = 2) => {
  let s = 0;
  for (let i = -w; i <= w; i++) s += envAt(m, k, f + i);
  return s / (2 * w + 1);
};

/** Exponential decay pulse from the most recent events at or before frame f. */
export const pulse = (events: Ev[], f: number, decay = 6, scaleByV = false) => {
  let v = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e.f > f) continue;
    const d = f - e.f;
    if (d > decay * 6) break;
    const w = scaleByV ? Math.min(1, (e.v ?? 1) / 1.2) : 1;
    v = Math.max(v, w * Math.exp(-d / decay));
  }
  return v;
};

/** Frame of bar k (from the reel start). Falls back to extrapolation. */
export const barFrame = (m: Music, k: number) => {
  if (k < m.downbeats.length) return m.downbeats[k].f;
  const last = m.downbeats[m.downbeats.length - 1];
  const per = (m.downbeats[m.downbeats.length - 1].t - m.downbeats[0].t) / (m.downbeats.length - 1);
  return Math.round((last.t + per * (k - m.downbeats.length + 1)) * m.fps);
};

/** Beat frames (absolute) in [f0, f1). */
export const beatsIn = (m: Music, f0: number, f1: number) => m.beats.filter((b) => b.f >= f0 && b.f < f1).map((b) => b.f);

/** 8th-note grid (absolute frames) in [f0, f1): beats plus midpoints. */
export const eighthsIn = (m: Music, f0: number, f1: number) => {
  const out: number[] = [];
  const bs = m.beats;
  for (let i = 0; i < bs.length; i++) {
    const b = bs[i];
    const nxt = i + 1 < bs.length ? bs[i + 1].t : b.t + (bs[i].t - (bs[i - 1]?.t ?? b.t - 0.45));
    const mid = Math.floor(((b.t + nxt) / 2) * m.fps);
    if (b.f >= f0 && b.f < f1) out.push(b.f);
    if (mid >= f0 && mid < f1) out.push(mid);
  }
  return out.sort((a, b) => a - b);
};

/** 16th-note grid (absolute frames) in [f0, f1). */
export const sixteenthsIn = (m: Music, f0: number, f1: number) => {
  const out: number[] = [];
  const bs = m.beats;
  for (let i = 0; i < bs.length - 1; i++) {
    const a = bs[i].t;
    const b = bs[i + 1].t;
    for (let q = 0; q < 4; q++) {
      const f = Math.floor((a + ((b - a) * q) / 4) * m.fps);
      if (f >= f0 && f < f1) out.push(f);
    }
  }
  return out;
};

export const bpm = (m: Music) => {
  const d = m.downbeats;
  const n = Math.min(d.length - 1, 24);
  return Math.round((240 * n) / (d[n].t - d[0].t));
};
