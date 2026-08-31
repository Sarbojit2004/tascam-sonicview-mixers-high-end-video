/**
 * REEL 2 — "The Network Fabric" · 178 s · 13 beats.
 *
 * 17 real assets, each used once. Durations sum to exactly 5,340 frames.
 */
import type { Beat } from "../shared/beat.ts";
import { platformValue, specValue } from "../shared/spec.ts";

export const BEATS: Beat[] = [
  {
    id: "r2-hook", kind: "cold", sec: 8, phase: 3, clip: 1,
    label: "TASCAM SONICVIEW",
    hero: "The engine stays. The copper goes.",
  },
  {
    id: "r2-replace", kind: "macro", sec: 10, phase: 3, unit: "sb16d", images: [40],
    label: "WHAT REPLACES THE MULTICORE",
    hero: "One network run",
  },
  {
    id: "r2-dante", kind: "specs", sec: 14, phase: 3, unit: "sv24", images: [91],
    label: "NATIVE, NOT OPTIONAL",
    hero: specValue("sv24", "Native Network I/O"),
    sub: "DANTE, ON EVERY SONICVIEW",
    body: [specValue("sb16d", "Network Connectors")],
  },
  {
    id: "r2-redundant", kind: "broll", sec: 14, phase: 3, clip: 5, unit: "sv24",
    label: "TWO PHYSICAL PATHS",
    hero: "Primary and secondary",
    sub: platformValue("Dante Redundancy"),
  },
  {
    id: "r2-demo-red", kind: "demo", sec: 20, phase: 3, demo: "redundancy",
    label: "ST 2022-7",
    hero: "A cut path is not an interruption",
  },
  {
    id: "r2-sb16d", kind: "hero", sec: 16, phase: 3, unit: "sb16d", images: [43],
    label: "TASCAM SB-16D",
    hero: "The input stage, moved",
    sub: "Not a mixer. The console's own preamps, where the microphones are.",
    body: [specValue("sb16d", "Analog I/O")],
  },
  {
    id: "r2-parity", kind: "macro", sec: 12, phase: 3, unit: "sb16d", images: [52],
    label: "SAME PREAMP",
    hero: "Gain at the source",
    sub: specValue("sb16d", "Preamp Architecture"),
  },
  {
    id: "r2-scale", kind: "montage", sec: 10, phase: 3,
    images: [45, 47, 41], clip: 13,
    label: "SCALING",
    hero: "Add a box, not a desk",
  },
  {
    id: "r2-remote", kind: "screen", sec: 14, phase: 3, unit: "sb16d", images: [44],
    label: "FROM ANYWHERE ON THE NETWORK",
    hero: "Gain, phantom power and pad",
    sub: "Set from the desk, live, per channel. Nobody walks back to stage.",
  },
  {
    id: "r2-demo-afv", kind: "demo", sec: 18, phase: 3, demo: "afv",
    label: "AUDIO FOLLOW VIDEO",
    hero: "A tally closes, the fader moves",
  },
  {
    id: "r2-automation", kind: "montage", sec: 12, phase: 3,
    images: [85, 87, 104, 38], clip: 10,
    label: "THE PROTOCOL LAYER",
    hero: "Ember+ · NMOS · SNMP",
  },
  {
    id: "r2-cards", kind: "montage", sec: 12, phase: 3,
    images: [13, 86, 22, 5, 112],
    label: "EXPANSION",
    hero: "ST 2110, Dante, dual power",
  },
  { id: "r2-outro", kind: "outro", sec: 18, phase: 5 },
];
