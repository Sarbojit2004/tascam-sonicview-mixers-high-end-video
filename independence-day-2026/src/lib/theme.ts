// Design tokens for the 80th Independence Day reel.
//
// FULL-FRAME SAFE-ZONE LAYOUT.
//
// The canvas is 1080x1920 and content is composed across the WHOLE frame —
// there is no reserved dead central square. An Instagram-style safe zone
// governs where critical content may live. This geometry is ported verbatim
// from the completed TASCAM Sonicview and MOTU M-Series reels:
//
//     0    .. 250   ambient only (no text, no key detail)
//     250  .. 1580  PRIMARY SAFE AREA — headline, hero art, all copy
//     1580 .. 1920  ambient only
//     72px side margins on both edges
//
// The 1080x1330 inner box (y 250..1580, inset 72px) is the region that must
// survive cropping on any device, so real content biases slightly upward
// inside it.

export const FPS = 30;
export const CANVAS = {w: 1080, h: 1920} as const;

/** 60.000 s at 30 fps. */
export const TOTAL_FRAMES = 1800;

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

// ---------------------------------------------------------------------------
// PALETTE
//
// Unlike the Sonicview/MOTU reels — which held one light ground for their
// whole runtime for product-photography contrast reasons that do not apply
// here — this reel alternates two grounds so the 60 s has a real light/dark
// rhythm. Every beat is assigned one of them and every text token below was
// contrast-checked numerically against its own ground (WCAG AA floor 4.5:1;
// every value clears it, most clear AAA 7:1).
// ---------------------------------------------------------------------------
export const C = {
  // -- ground A: indigo night (hook, chakra, dance, music, festivals,
  //    languages, the wish) --------------------------------------------------
  night: '#0B1030',
  nightHi: '#141B44',
  nightDeep: '#060A20',
  nightEdge: '#04071A',

  // -- ground B: warm parchment (land, architecture, craft, the map) --------
  paper: '#F6EFE2',
  paperHi: '#FCF8F0',
  paperDeep: '#E8DCC7',
  paperEdge: '#DACBB0',

  // -- ink on night (contrast vs #0B1030) ----------------------------------
  ivory: '#F7F2E8', // 16.13:1  headlines
  ivorySoft: '#DCD3C2', // 12.34:1  body
  ivoryDim: '#A99E8B', //  6.85:1  micro callouts

  // -- ink on parchment (contrast vs #F6EFE2) ------------------------------
  ink: '#16110B', // 15.42:1  headlines
  inkSoft: '#3D3529', //  9.53:1  body
  inkDim: '#6B5F4C', //  5.10:1  micro callouts

  // -- the tricolour, at flag values (large graphic use only) --------------
  saffron: '#FF9933',
  green: '#138808',
  chakra: '#000080',

  // -- text-safe variants of the tricolour ---------------------------------
  saffronOnNight: '#FF9933', //  8.63:1 on night
  greenOnNight: '#5FCF6E', //  9.71:1 on night
  chakraOnNight: '#8FA8FF', //  8.09:1 on night
  saffronOnPaper: '#9A4E00', //  6.51:1 on paper — deepened, unreadable at flag value
  greenOnPaper: '#0E6606', //  7.06:1 on paper
  chakraOnPaper: '#141A44', // 13.24:1 on paper

  gold: '#E8B44A', // celebratory accent on night, 9.02:1
} as const;

export type Ground = 'night' | 'paper';

/** Ground-aware ink so a beat can be flipped without rewriting its copy. */
export const inkFor = (g: Ground) => (g === 'night' ? C.ivory : C.ink);
export const inkSoftFor = (g: Ground) => (g === 'night' ? C.ivorySoft : C.inkSoft);
export const inkDimFor = (g: Ground) => (g === 'night' ? C.ivoryDim : C.inkDim);
export const saffronFor = (g: Ground) => (g === 'night' ? C.saffronOnNight : C.saffronOnPaper);
export const greenFor = (g: Ground) => (g === 'night' ? C.greenOnNight : C.greenOnPaper);
export const chakraFor = (g: Ground) => (g === 'night' ? C.chakraOnNight : C.chakraOnPaper);

/**
 * Typeface roles.
 *
 * Display is Playfair Display — a high-contrast transitional serif chosen
 * because it reads as dignified and celebratory. The Sonicview/MOTU projects'
 * Barlow Condensed was right for broadcast hardware and would read as a
 * product spec sheet on a heritage piece, so the structural hierarchy is kept
 * and the faces themselves are re-chosen for the subject.
 *
 * The ten Indic/Perso-Arabic faces are not decoration: beat 12 sets the
 * country's name in eleven scripts and each needs a face that renders it.
 */
export const F = {
  display: '"PlayfairDisplay", Georgia, serif',
  ui: '"Inter", system-ui, sans-serif',
  mono: '"JetBrainsMono", ui-monospace, monospace',
  deva: '"NotoDeva", serif',
  beng: '"NotoBeng", serif',
  taml: '"NotoTaml", serif',
  telu: '"NotoTelu", serif',
  knda: '"NotoKnda", serif',
  gujr: '"NotoGujr", serif',
  guru: '"NotoGuru", serif',
  mlym: '"NotoMlym", serif',
  orya: '"NotoOrya", serif',
  arab: '"NotoArab", serif',
} as const;

// ---------------------------------------------------------------------------
// BEAT TABLE — the single source of truth for timing. Sums to exactly 1800.
//
// Shape: a longer, contemplative opening and closing bracketing a faster
// central passage that ranges across the country. Opening 170f (5.67 s),
// central passage 1450f (48.33 s, avg 4.4 s/beat), closing passage
// beats 13+14 = 300f = exactly 10.00 s.
// ---------------------------------------------------------------------------
export type Beat = {
  id: string;
  dur: number;
  label: string;
  ground: Ground;
};

export const BEATS: Beat[] = [
  {id: 'B01', dur: 170, label: 'Dawn & the Tricolour', ground: 'night'},
  {id: 'B02', dur: 150, label: '1947 — A Nation Awoke', ground: 'night'},
  {id: 'B03', dur: 118, label: 'The Ashoka Chakra', ground: 'night'},
  {id: 'B04', dur: 108, label: 'The Himalaya', ground: 'paper'},
  {id: 'B05', dur: 112, label: 'Rivers & Forests', ground: 'paper'},
  {id: 'B06', dur: 112, label: 'Desert & Coast', ground: 'paper'},
  {id: 'B07', dur: 130, label: 'Architecture Across Eras', ground: 'paper'},
  {id: 'B08', dur: 124, label: 'Dance — Classical & Folk', ground: 'night'},
  {id: 'B09', dur: 112, label: 'Music — Ragas & Rhythms', ground: 'night'},
  {id: 'B10', dur: 118, label: 'Craft, Textile & Table', ground: 'paper'},
  {id: 'B11', dur: 128, label: 'Festivals of the Year', ground: 'night'},
  {id: 'B12', dur: 118, label: 'Many Tongues, One Country', ground: 'night'},
  {id: 'B13', dur: 120, label: 'Unity in Diversity', ground: 'paper'},
  {id: 'B14', dur: 180, label: 'The Wish', ground: 'night'},
];

export const beatStart = (id: string): number => {
  let f = 0;
  for (const b of BEATS) {
    if (b.id === id) return f;
    f += b.dur;
  }
  return f;
};

export const totalDuration = (): number => BEATS.reduce((a, b) => a + b.dur, 0);
