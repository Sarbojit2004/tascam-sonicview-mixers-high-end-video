/**
 * THE SINGLE-PASS ASSET ALLOCATION.
 *
 * All 133 verified distinct real assets (build/asset-ledger.json), each assigned
 * to EXACTLY ONE of the six deliverables. `scripts/audit_coverage.mjs` fails the
 * build on any asset that is unplaced, placed twice, or placed only as ambient
 * backdrop rather than at primary tier.
 *
 * Allocation is by SUBJECT first and runtime second. Every id below was
 * identified by LOOKING at the image, not by reading its filename — and the
 * library turns out to hold far more than product beauty shots. It contains
 * block diagrams, measurement graphs, VIEW screen captures, network topology
 * drawings and certification marks, several of which are the single best
 * available illustration for one specific technical beat:
 *
 *   id   6  THE architecture block diagram — analog audio -> AD/DA -> a 64-bit
 *           ARM effect engine beside the FPGA 96 kHz / 54-bit float mixing
 *           engine -> SoC -> Dante, USB audio, word sync, slot cards. Nothing
 *           else in the library explains the core this directly. Anchors Part 1.
 *   ids 1,2,3  Equivalent Input Noise vs frequency plots — the actual
 *           measurement behind the -128 dBu claim, for the HDIA beats.
 *   id  85  MODULE (Audio Follow Video), showing GPIO-IN 1 with a live
 *           RISE / HOLD / FALL curve. The AFV demonstrative's own subject,
 *           photographed. Anchors the AFV beat.
 *   id  84  AUTOMATIC MIXER, per-channel GAIN + WEIGHT with priority groups —
 *           the Gain-Sharing Auto Mixer, photographed.
 *   id  91  The Dante PRIMARY / SECONDARY etherCON pair with the DDM mark:
 *           the redundancy beat's hero.
 *   ids 15,16,17  Studio / stadium / hall -> OB van -> broadcast station
 *           topology drawings — the deployment story, drawn by the manufacturer.
 *   ids 107,108,125,127,128  Workflow drawings (console beside an analog desk,
 *           console into a rack) — the Phase 4/5 "what changes on the day"
 *           material, which no photograph in the set covers.
 *
 * TIER. "primary" means the asset carries a beat: a hero plate, a mosaic cell,
 * or a full-width diagram. Nothing here is allocated as an ambient wash.
 */

export type Deliverable = "reel1" | "reel2" | "reel3" | "part1" | "part2" | "part3";

export const ALLOCATION: Record<Deliverable, readonly number[]> = {
  // ══ GROUP A · THE COMPUTATIONAL CORE ═════════════════════════════════════
  // Stage 7 phases 1-2. Stage 4 ranks 1 and 3, plus OS/DSP segregation.

  /** 17 assets. */
  reel1: [
    105, //  one engine, two footprints — the comparison drawing
    1, 2, 3, //  EIN vs frequency plots
    4, //  frequency response plot
    95, //  HDIA CLASS 1 MIC PREAMP mark
    90, //  FPGA / PCB macro with heatsink
    65, //  Sonicview 16 hero
    116, 118, //  Sonicview 24 heroes (24dp, 24XP)
    70, 73, 75, //  Sonicview 16 low three-quarter heroes
    55, //  series overview
    101, //  fader bank and master section, close
    89, //  16 + 24 + SB-16D — the ecosystem in one frame
    109, //  rear detail: footswitch, USB to PC, Ethernet, GPIO
  ],

  /** 27 assets. */
  part1: [
    56, //  series overview, second frame
    66, 69, 71, 72, 74, 76, 77, //  Sonicview 16 hero set
    79, 80, 81, 82, 83, //  Sonicview 16 hero set, continued
    111, 114, 115, 117, //  Sonicview 24 hero set
    119, 120, 121, //  Sonicview 24 hero set, continued
    53, //  HDIA preamp PCB macro (platform-wide board)
    93, //  MODULE (OVERVIEW) — the per-channel DSP chain, on screen
    94, //  MODULE (COMP) with its transfer curve
    96, //  multi-channel strip view — the channel count, on screen
    67, 106, //  Sonicview 16 rear panel, two angles
    6, //  THE architecture block diagram — anchors the FPGA chapter
  ],

  // ══ GROUP B · THE NETWORK FABRIC ═════════════════════════════════════════
  // Stage 7 phase 3. Stage 4 ranks 2 and 5, plus dual-power redundancy.

  /** 17 assets. */
  reel2: [
    91, //  Dante PRIMARY / SECONDARY etherCON + DDM mark
    5, //  Dante Domain Manager mark
    40, //  SB-16D with two consoles, on white
    41, 43, 47, //  SB-16D front, three-quarter, rack ears
    45, //  SB-16D stacked pair
    13, //  IF-ST2110 faceplate: CONTROL / PORT 1 / PORT 2
    86, //  IF-ST2110 card, angled with its PCB
    22, //  IF-DA64 Dante interface card
    85, //  MODULE (Audio Follow Video) — GPIO-IN 1, rise / hold / fall
    84, //  AUTOMATIC MIXER — gain + weight, priority groups
    104, //  control system -> console -> audio router / camera / switcher
    112, //  Sonicview 24dp — the dual-power variant
    44, //  SB-16D remote control UI
    52, //  SB-16D beside the console
    38, //  radio studio signal-flow drawing
  ],

  /** 28 assets. */
  part2: [
    42, 46, 48, 49, 50, 51, 54, //  SB-16D: rear, corner detail, further angles
    87, //  SNMP / control-management diagram
    62, //  control system -> console -> router / camera / switcher, second form
    7, 8, 9, 10, 11, //  IF-ST2110 card and faceplates
    12, //  ST 2110 patch / routing matrix
    14, //  ST 2110 home / destination / sync / config screens
    18, 19, //  IF-AE16 faceplate (AES/EBU) and angled
    20, 21, //  IF-AN16 OUT faceplate (ANALOG OUT) and angled
    23, //  IF-DA64 angled
    24, 25, //  IF-MA64/EX MADI coaxial + optical, faceplate and angled
    57, //  IF-ST2110 faceplate, straight on
    113, 122, //  Sonicview 24dp and 24XP
    126, //  Sonicview 24 rear panel
    129, //  Sonicview 24 rear detail: footswitch, USB, Ethernet, GPIO
  ],

  // ══ GROUP C · THE CONTROL SURFACE ════════════════════════════════════════
  // Stage 7 phases 4-5. Stage 4 rank 6, recording, and the named deployments.

  /** 16 assets. */
  reel3: [
    102, //  VIEW wordmark
    103, //  two screens, a hand on the glass
    26, 27, //  dual-screen VIEW: meter arrays; EQ curve and dynamics
    92, //  USER KEY EXTENSION / USER KEY LIBRARY
    97, //  talkback / monitor / solo / oscillator setup
    99, //  IF-MTR32 multitrack recording card
    100, //  iPad remote control
    34, //  radio operator at the console
    36, //  remote-truck operator at the console
    30, //  conference room, console in a corner rack
    124, 131, //  Sonicview 24XP and 24dp heroes
    78, //  Sonicview 16 rear, full width
    88, //  console and laptop, in service
    110, //  REAL VIDEO — Sonicview 16, natural speed
  ],

  /** 28 assets. */
  part3: [
    28, //  dual-screen VIEW: EQ alongside the full meter array
    68, //  Sonicview 16dp hero
    107, 108, //  workflow drawings: beside an analog desk; into a rack
    125, 127, 128, //  Sonicview 24 workflow drawings
    15, 16, 17, //  studio / stadium / hall -> OB van -> broadcast topologies
    29, //  conference system topology
    31, //  console in a flight-case rack
    32, //  full AV system topology
    33, //  conference room, table and microphones
    35, //  facility exterior
    37, //  broadcast control room, two consoles
    39, //  control room, operator at work
    98, //  hands on the surface, low light
    123, //  Sonicview 24XP hero
    130, 132, //  Sonicview 24 rear and hero
    58, 59, 60, 61, 63, 64, //  Sonicview + IF-ST2110 system composites
    133, //  REAL VIDEO — Sonicview 24, natural speed
  ],
} as const;

/** Every id, flattened, for the auditor. */
export const ALL_ALLOCATED: number[] = Object.values(ALLOCATION).flat();

export const DELIVERABLES: Deliverable[] = ["reel1", "part1", "reel2", "part2", "reel3", "part3"];

export const IS_PORTRAIT: Record<Deliverable, boolean> = {
  reel1: true, reel2: true, reel3: true,
  part1: false, part2: false, part3: false,
};

/** Static path for a prepared image at the width this canvas wants. */
export const img = (id: number, portrait: boolean) =>
  `img/a${String(id).padStart(3, "0")}-${portrait ? "r" : "p"}.jpg`;

/** Static path for a prepared B-roll clip, 1..25. Audio already stripped. */
export const clip = (n: number) => `clips/br${String(n).padStart(2, "0")}.mp4`;

/** Static path for a prepared real product video, by ledger id. Natural speed. */
export const realVideo = (id: number) => `clips/v${String(id).padStart(3, "0")}.mp4`;
