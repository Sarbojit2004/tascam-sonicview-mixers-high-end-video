import {barFrame, Music, VersionId} from './music';

/**
 * The edit. One scene order for both songs; each scene gets a whole number of
 * bars per song, so every scene change lands on a downbeat of *that* song.
 *
 *   Thunderstruck  28 bars  riff(0) drums(3) band(7) verse(15)  -> ending stabs
 *   Lost Sky       31 bars  build(0) drop(3) drop-2 splice(19)  -> post-drop melody
 *
 * `ids` is the coverage contract: every one of the 129 distinct repository
 * images (src/lib/ledger.json) is owned by exactly one scene, and
 * scripts/audit.mjs fails the build if any is missing or doubled.
 */
export type SceneId =
  | 'hook'
  | 's16'
  | 's24'
  | 'view'
  | 'engine'
  | 'wall'
  | 'dante'
  | 'cards'
  | 'flow'
  | 'field'
  | 'finale'
  | 'outro';

export type SceneDef = {id: SceneId; bars: Record<VersionId, number>; ids: number[]; logos?: string[]};

export const SCENES: SceneDef[] = [
  {id: 'hook', bars: {thunderstruck: 3, lostsky: 3}, ids: [105], logos: ['shivansh', 'tascam']},
  {id: 's16', bars: {thunderstruck: 4, lostsky: 4}, ids: [52, 59, 61, 62, 65, 66, 67, 68, 69]},
  {id: 's24', bars: {thunderstruck: 3, lostsky: 3}, ids: [109, 104, 106, 107, 110, 112, 113, 114, 115, 116]},
  {
    id: 'view',
    bars: {thunderstruck: 3, lostsky: 3},
    ids: [88, 1, 2, 3, 70, 71, 78, 79, 80, 82, 83, 87, 89, 95, 121, 86, 84, 74],
  },
  {id: 'engine', bars: {thunderstruck: 2, lostsky: 3}, ids: [13, 48, 76, 81, 8, 9, 10, 11]},
  {
    id: 'wall',
    bars: {thunderstruck: 2, lostsky: 3},
    ids: [54, 56, 57, 58, 60, 63, 98, 108, 123, 124, 25, 26, 53, 55, 64, 92, 103, 111, 117, 122],
  },
  {id: 'dante', bars: {thunderstruck: 2, lostsky: 3}, ids: [36, 37, 38, 40, 41, 44, 45, 46, 47, 49, 12, 77, 39], logos: ['dante']},
  {
    id: 'cards',
    bars: {thunderstruck: 3, lostsky: 3},
    ids: [96, 27, 28, 30, 72, 24, 16, 17, 18, 19, 20, 21, 22, 23, 85, 29, 31],
  },
  {id: 'flow', bars: {thunderstruck: 2, lostsky: 2}, ids: [91, 93, 94, 119, 120, 73, 90, 118, 4, 129, 131, 32, 33, 34]},
  {id: 'field', bars: {thunderstruck: 2, lostsky: 2}, ids: [125, 126, 127, 128, 130, 132, 5, 6]},
  {id: 'finale', bars: {thunderstruck: 2, lostsky: 2}, ids: [35, 42, 43, 50, 51, 75, 97, 99, 100, 101, 102], logos: ['tascam']},
  {id: 'outro', bars: {thunderstruck: 0, lostsky: 0}, ids: [], logos: ['tascam', 'shivansh']},
];

export type TimedScene = SceneDef & {b0: number; b1: number; from: number; to: number; dur: number};

export const timeline = (m: Music): TimedScene[] => {
  const v = m.id as VersionId;
  let bar = 0;
  const out: TimedScene[] = [];
  for (const s of SCENES) {
    const b0 = bar;
    if (s.id === 'outro') {
      const from = barFrame(m, b0);
      out.push({...s, b0, b1: b0, from, to: m.frames, dur: m.frames - from});
      break;
    }
    bar += s.bars[v];
    const from = barFrame(m, b0);
    const to = barFrame(m, bar);
    out.push({...s, b0, b1: bar, from, to, dur: to - from});
  }
  return out;
};

/** Bars that hit harder than a plain scene change (flash + shockwave + shake). */
export const IMPACT_BARS: Record<VersionId, number[]> = {
  thunderstruck: [3, 7, 15],
  lostsky: [3, 19],
};

/** Image ids whose source is a diagram / chart on white: always shown as paper cards. */
export const PAPER = new Set([4, 8, 9, 10, 11, 13, 29, 31, 32, 33, 34, 73, 90, 118, 129, 131]);
