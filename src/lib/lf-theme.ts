// Design tokens for the three 298-second LONG-FORM videos.
//
// LIGHT BACKGROUND, FULL-FRAME LANDSCAPE.
//
// The canvas is 1920x1080 and content may use the whole frame — unlike the
// companion reel series there is no social safe-zone contract and no reserved
// top/bottom exclusion band. The one placement rule is a modest side inset so
// nothing critical is at risk from a downstream crop or re-encode; background
// imagery and video may still run to the true edge.
//
// Palette, type system and SFX identity are inherited unchanged from the reel
// series (src/lib/theme.ts) so the two formats read as one body of work. Only
// the geometry and the chapter tables are new.

import {C, F} from './theme';

export {C, F};

export const LF_FPS = 30;
export const LF_CANVAS = {w: 1920, h: 1080} as const;

/** 298.000 s at 30 fps. Every long-form part is exactly this long. */
export const LF_TOTAL_FRAMES = 8940;

/**
 * Side inset for anything critical — text, callouts, logos, CTA. 52px sits in
 * the middle of the 40-60px band the format asks for. The vertical inset is a
 * design choice rather than a requirement; the format explicitly allows the
 * full height.
 */
export const LF_PAD = {x: 52, y: 44} as const;

export const LF_SAFE = {
  x: LF_PAD.x,
  y: LF_PAD.y,
  w: LF_CANVAS.w - LF_PAD.x * 2, // 1816
  h: LF_CANVAS.h - LF_PAD.y * 2, // 992
} as const;

export type LFPart = 1 | 2 | 3;

export const lfAccent = (p: LFPart): string => ({1: C.hub, 2: C.net, 3: C.proto}[p]);
export const lfAccentSoft = (p: LFPart): string =>
  ({1: C.hubSoft, 2: C.netSoft, 3: C.protoSoft}[p]);
export const lfAccentOnDark = (p: LFPart): string =>
  ({1: C.hubOnDark, 2: C.netOnDark, 3: C.protoOnDark}[p]);

// ---------------------------------------------------------------------------
// CHAPTER TABLES — single source of truth for timing. Each part sums to 8940.
// ---------------------------------------------------------------------------
export type Chapter = {id: string; dur: number; label: string};

export const LF_PART1: Chapter[] = [
  {id: 'L1C01', dur: 420, label: 'Cold open — the ecosystem premise'},
  {id: 'L1C02', dur: 390, label: 'Four architectural pillars'},
  {id: 'L1C03', dur: 540, label: 'Sonicview 16XP introduced'},
  {id: 'L1C04', dur: 450, label: '16XP form factor & deployment'},
  {id: 'L1C05', dur: 660, label: 'The VIEW touchscreen system'},
  {id: 'L1C06', dur: 480, label: 'Motorized faders & tactile recall'},
  {id: 'L1C07', dur: 690, label: 'The FPGA mixing engine'},
  {id: 'L1C08', dur: 420, label: 'Latency — the 0.51 ms path'},
  {id: 'L1C09', dur: 540, label: 'Class 1 HDIA preamps'},
  {id: 'L1C10', dur: 480, label: 'Rear I/O & built-in networking'},
  {id: 'L1C11', dur: 390, label: 'Onboard recording & USB'},
  {id: 'L1C12', dur: 600, label: 'Sonicview 24XP — scale'},
  {id: 'L1C13', dur: 480, label: '24XP control surface & workflow'},
  {id: 'L1C14', dur: 780, label: 'The dp power-redundancy axis'},
  {id: 'L1C15', dur: 450, label: 'dp across the lineup'},
  {id: 'L1C16', dur: 390, label: 'Replacing a fixed-architecture desk'},
  {id: 'L1C17', dur: 270, label: 'Continuation → Part 2'},
  {id: 'L1C18', dur: 510, label: 'CTA & Shivansh outro'},
];

export const LF_PART2: Chapter[] = [
  {id: 'L2C01', dur: 420, label: 'Cold open — from hub to stage'},
  {id: 'L2C02', dur: 540, label: 'The deployment problem'},
  {id: 'L2C03', dur: 780, label: 'Dante as transport'},
  {id: 'L2C04', dur: 540, label: '64 × 64, built in'},
  {id: 'L2C05', dur: 480, label: 'Redundant network paths'},
  {id: 'L2C06', dur: 660, label: 'SB-16D introduced'},
  {id: 'L2C07', dur: 600, label: 'SB-16D I/O & preamps'},
  {id: 'L2C08', dur: 540, label: 'Chassis & mounting'},
  {id: 'L2C09', dur: 480, label: 'Deployment & scaling'},
  {id: 'L2C10', dur: 540, label: 'Remote control from the network'},
  {id: 'L2C11', dur: 420, label: 'Proof — festival remote production'},
  {id: 'L2C12', dur: 780, label: 'Case study — radio broadcast'},
  {id: 'L2C13', dur: 930, label: 'Case study — campus & conference'},
  {id: 'L2C14', dur: 450, label: 'What the workflow becomes'},
  {id: 'L2C15', dur: 270, label: 'Continuation → Part 3'},
  {id: 'L2C16', dur: 510, label: 'CTA & Shivansh outro'},
];

export const LF_PART3: Chapter[] = [
  {id: 'L3C01', dur: 420, label: 'Cold open — the console adapts'},
  {id: 'L3C02', dur: 480, label: 'Two expansion slots'},
  {id: 'L3C03', dur: 600, label: 'IF-ST2110 — the card'},
  {id: 'L3C04', dur: 660, label: 'ST 2110 — what it carries'},
  {id: 'L3C05', dur: 540, label: 'ST 2110 — control & sync'},
  {id: 'L3C06', dur: 840, label: 'ST 2110 — facility topologies'},
  {id: 'L3C07', dur: 690, label: 'IF-AE16 — AES/EBU'},
  {id: 'L3C08', dur: 630, label: 'IF-AN16/OUT — analog output'},
  {id: 'L3C09', dur: 690, label: 'IF-MA64/EX — MADI'},
  {id: 'L3C10', dur: 690, label: 'IF-DA64 — expanded Dante'},
  {id: 'L3C11', dur: 690, label: 'Choosing between them'},
  {id: 'L3C12', dur: 600, label: 'Facility control integration'},
  {id: 'L3C13', dur: 600, label: 'The complete architecture'},
  {id: 'L3C14', dur: 300, label: 'Close of series'},
  {id: 'L3C15', dur: 510, label: 'CTA & Shivansh outro'},
];

export const LF_CHAPTERS: Record<LFPart, Chapter[]> = {
  1: LF_PART1,
  2: LF_PART2,
  3: LF_PART3,
};

export const lfChapterStart = (part: LFPart, id: string): number => {
  let f = 0;
  for (const c of LF_CHAPTERS[part]) {
    if (c.id === id) return f;
    f += c.dur;
  }
  return f;
};

export const lfPartDuration = (part: LFPart): number =>
  LF_CHAPTERS[part].reduce((a, c) => a + c.dur, 0);
