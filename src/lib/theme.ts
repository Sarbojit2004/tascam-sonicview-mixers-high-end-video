// Design tokens for the three TASCAM Sonicview reels.
//
// LIGHT BACKGROUND, FULL-FRAME SAFE-ZONE LAYOUT.
//
// The canvas is 1080x1920 and content is composed across the WHOLE frame —
// there is no reserved dead central square. Instead an Instagram-style safe
// zone governs where critical content may live:
//
//     0    .. 250   ambient only (no text, no logos, no key detail)
//     250  .. 1580  PRIMARY SAFE AREA — headline, hero, spec callouts, CTA
//     1580 .. 1920  ambient only
//     72px side margins on both edges
//
// The 1080x1330 inner box (y 250..1580, inset 72px) is the region that must
// survive cropping on any device, so real content biases slightly upward
// inside it.
//
// The palette is deliberately light and clinical, per the creative brief's
// Section 6: a sterile, high-key environment that the dark matte Sonicview
// chassis reads against. All type is dark-on-light; contrast ratios against
// `paper` are noted per token and were verified numerically (WCAG AA floor
// 4.5:1 — every text token clears it, most clear AAA 7:1).

export const FPS = 30;
export const CANVAS = {w: 1080, h: 1920} as const;

/** 88.000 s at 30 fps. Every part is exactly this long. */
export const TOTAL_FRAMES = 2640;

/** Instagram / social safe-zone geometry. */
export const ZONE = {
  topAmbientEnd: 250,
  bottomAmbientStart: 1580,
  margin: 72,
} as const;

/** The primary safe content rect. Nothing critical may leave it. */
export const SAFE = {
  x: ZONE.margin,
  y: ZONE.topAmbientEnd,
  w: CANVAS.w - ZONE.margin * 2, // 936
  h: ZONE.bottomAmbientStart - ZONE.topAmbientEnd, // 1330
} as const;

export const C = {
  // -- light ground ------------------------------------------------------
  paper: '#F1F4F8', // base canvas — cool, sterile, not pure white
  paperHi: '#FAFBFD', // raised plate / card
  paperDeep: '#DFE5EC', // recessed, ambient zones
  paperEdge: '#CBD4DF', // ambient zone falloff
  line: '#C2CCD9', // hairline rules
  lineSoft: '#DCE3EB',

  // -- ink (all verified on `paper`) -------------------------------------
  ink: '#0A1119', // 17.19:1  headlines
  inkSoft: '#2E3D4E', // 10.05:1  body
  inkDim: '#54657A', //  5.32:1  micro callouts

  // -- accents -----------------------------------------------------------
  hub: '#0B4EA6', //  7.17:1  Part 1 — deep broadcast blue
  hubSoft: '#DCE8F8',
  net: '#0A6E62', //  5.57:1  Part 2 — Dante network teal
  netSoft: '#D7EBE7',
  proto: '#9A4407', //  5.94:1  Part 3 — protocol amber
  protoSoft: '#F6E5D6',

  // Accent variants for the rare places type sits on the dark ink plate. The
  // light-ground accents above are only 2.4-3.1:1 against `ink`, which is
  // unreadable; these clear 8.6:1 or better.
  hubOnDark: '#7FB2F5', //  8.66:1 on ink
  netOnDark: '#5FCDBC', //  9.89:1 on ink
  protoOnDark: '#F2A867', //  9.55:1 on ink

  alert: '#A81E14', //  6.65:1  AC failure
  good: '#0B6B37', //  6.00:1  DC live
  screen: '#0E1A2A', // dark plate that console screenshots sit on
} as const;

/**
 * Type system ported structurally from the completed MOTU UltraLite-mk5 / 828
 * reel (github.com/Sarbojit2004/motu-ultralitemk5-828, src/lib/fonts.ts +
 * src/components/Type.tsx): Barlow Condensed 600/700/800 for display, Inter
 * variable for UI/body, JetBrains Mono variable for technical figures. The
 * woff2 files themselves are copied from that project and vendored under
 * public/fonts. Only the colour values are re-derived here — the source used
 * light-on-dark, this is dark-on-light.
 */
export const F = {
  display: '"BarlowCondensed", "Arial Narrow", sans-serif',
  ui: '"Inter", system-ui, sans-serif',
  mono: '"JetBrainsMono", ui-monospace, monospace',
} as const;

export type Part = 1 | 2 | 3;

export const accent = (p: Part): string => ({1: C.hub, 2: C.net, 3: C.proto}[p]);
export const accentSoft = (p: Part): string =>
  ({1: C.hubSoft, 2: C.netSoft, 3: C.protoSoft}[p]);

/** Use whenever accent-coloured type sits on the dark `C.ink` plate. */
export const accentOnDark = (p: Part): string =>
  ({1: C.hubOnDark, 2: C.netOnDark, 3: C.protoOnDark}[p]);

// ---------------------------------------------------------------------------
// SCENE TABLES — the single source of truth for timing. Each part sums to 2640.
// ---------------------------------------------------------------------------
export type Scene = {id: string; dur: number; label: string};

export const PART1: Scene[] = [
  {id: 'P1S01', dur: 190, label: 'Hook — the hub premise'},
  {id: 'P1S02', dur: 225, label: 'Sonicview 16XP'},
  {id: 'P1S03', dur: 250, label: 'VIEW touchscreen system'},
  {id: 'P1S04', dur: 245, label: 'FPGA engine & latency'},
  {id: 'P1S05', dur: 195, label: 'Class 1 HDIA preamps'},
  {id: 'P1S06', dur: 205, label: 'Rear I/O & onboard recording'},
  {id: 'P1S07', dur: 240, label: 'Sonicview 24XP — scale'},
  {id: 'P1S08', dur: 195, label: '24XP control surface'},
  {id: 'P1S09', dur: 275, label: 'dp power-redundancy axis'},
  {id: 'P1S10', dur: 165, label: 'Replacing the fixed desk'},
  {id: 'P1S11', dur: 115, label: 'Continuation → Part 2'},
  {id: 'P1S12', dur: 340, label: 'CTA & Shivansh outro'},
];

export const PART2: Scene[] = [
  {id: 'P2S01', dur: 185, label: 'Hook — hub to stage'},
  {id: 'P2S02', dur: 265, label: 'Dante as the connective layer'},
  {id: 'P2S03', dur: 250, label: 'One cable to the stage'},
  {id: 'P2S04', dur: 285, label: 'SB-16D introduced'},
  {id: 'P2S05', dur: 340, label: 'Chassis, mounting & deployment'},
  {id: 'P2S06', dur: 240, label: 'Control at the stage end'},
  {id: 'P2S07', dur: 300, label: 'Proof — radio broadcast'},
  {id: 'P2S08', dur: 320, label: 'Proof — campus & conference'},
  {id: 'P2S09', dur: 115, label: 'Continuation → Part 3'},
  {id: 'P2S10', dur: 340, label: 'CTA & Shivansh outro'},
];

export const PART3: Scene[] = [
  {id: 'P3S01', dur: 195, label: 'Hook — the console adapts'},
  {id: 'P3S02', dur: 175, label: 'Two expansion slots'},
  {id: 'P3S03', dur: 340, label: 'IF-ST2110 — IP broadcast'},
  {id: 'P3S04', dur: 295, label: 'ST 2110 control & topologies'},
  {id: 'P3S05', dur: 230, label: 'IF-AE16 — AES/EBU'},
  {id: 'P3S06', dur: 220, label: 'IF-AN16/OUT — analog out'},
  {id: 'P3S07', dur: 240, label: 'IF-MA64/EX — MADI'},
  {id: 'P3S08', dur: 235, label: 'IF-DA64 — 128×128 Dante'},
  {id: 'P3S09', dur: 240, label: 'Facility control integration'},
  {id: 'P3S10', dur: 130, label: 'Close of series'},
  {id: 'P3S11', dur: 340, label: 'CTA & Shivansh outro'},
];

export const SCENES: Record<Part, Scene[]> = {1: PART1, 2: PART2, 3: PART3};

export const sceneStart = (part: Part, id: string): number => {
  let f = 0;
  for (const s of SCENES[part]) {
    if (s.id === id) return f;
    f += s.dur;
  }
  return f;
};

export const partDuration = (part: Part): number =>
  SCENES[part].reduce((a, s) => a + s.dur, 0);
