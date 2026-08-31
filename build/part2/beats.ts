/**
 * PART 2 — "The Network Fabric" · 298 s · 18 beats.
 *
 * Stage 7 phase 3. Stage 4 ranks 2 (Dante / ST 2110 IP topologies) and 5
 * (broadcast automation logic), plus the dual-power half of rank 4.
 *
 * 28 real assets, each used once. Durations sum to exactly 8,940 frames.
 *
 * The SB-16D is never described as a mixer. It is the console's input stage,
 * moved — which is both what the brief says and the only framing that makes the
 * deployment argument land.
 */
import type { Beat } from "../shared/beat.ts";
import { platformValue, specValue } from "../shared/spec.ts";

export const BEATS: Beat[] = [
  {
    id: "p2-cold", kind: "cold", sec: 14, phase: 3, clip: 7,
    label: "PART 2 · THE NETWORK FABRIC",
    hero: "Inputs stop terminating at the desk",
    sub: "The mix engine stays where the engineer is. The copper does not have to.",
  },
  {
    id: "p2-aoip", kind: "macro", sec: 14, phase: 3, unit: "sb16d", images: [42],
    label: "WHAT AN IP FABRIC REPLACES",
    hero: "Channels become streams",
    sub: "Audio rides the same Ethernet infrastructure the building already runs. Patching becomes routing, and the cable stops caring how many channels it carries.",
  },
  {
    id: "p2-dante", kind: "specs", sec: 18, phase: 3, unit: "sv24", images: [126],
    label: "NATIVE, NOT OPTIONAL",
    hero: specValue("sv24", "Native Network I/O"),
    sub: "DANTE, ON EVERY SONICVIEW",
    body: [
      "Not a card. Not an upgrade path.",
      specValue("sb16d", "Network Connectors"),
    ],
  },
  {
    id: "p2-redundant", kind: "broll", sec: 18, phase: 3, clip: 5, unit: "sv24",
    label: "TWO PHYSICAL PATHS",
    hero: "Primary and secondary",
    sub: `${platformValue("Dante Redundancy")} carries the same audio down two physically separate networks at once.`,
  },
  {
    id: "p2-demo-red", kind: "demo", sec: 24, phase: 3, demo: "redundancy",
    label: "ST 2022-7 PACKET FLOW",
    hero: "A severed path is not an interruption",
  },
  {
    id: "p2-sb16d", kind: "hero", sec: 18, phase: 3, unit: "sb16d", images: [48],
    label: "TASCAM SB-16D",
    hero: "The input stage, moved",
    sub: "Not a mixer. The console's own preamps, relocated to where the microphones are.",
    body: [specValue("sb16d", "Analog I/O"), specValue("sb16d", "Form Factor")],
  },
  {
    id: "p2-sbio", kind: "macro", sec: 14, phase: 3, unit: "sb16d", images: [49],
    label: "SAME PREAMP, DIFFERENT PLACE",
    hero: "Gain taken at the source",
    sub: "The stagebox carries the same Class 1 HDIA design as the consoles, so moving an input changes nothing about it.",
    body: [specValue("sb16d", "Preamp Architecture"), specValue("sb16d", "A/D - D/A Conversion")],
  },
  {
    id: "p2-chassis", kind: "broll", sec: 14, phase: 3, clip: 8, unit: "sb16d",
    label: "BUILT FOR THE LOAD-IN",
    hero: "Rack it, deck it, or stack it",
    sub: `${specValue("sb16d", "Dimensions (W x H x D)")} · ${specValue("sb16d", "Weight")}. The mounting decision stays independent of the audio decision.`,
  },
  {
    id: "p2-scale", kind: "broll", sec: 14, phase: 3, clip: 20, unit: "sb16d",
    label: "SCALING",
    hero: "Add a box, not a desk",
    sub: "A second stagebox extends the same network. The input count grows and the console does not change at all.",
  },
  {
    id: "p2-remote", kind: "montage", sec: 16, phase: 3,
    images: [50, 51, 54, 46], clip: 9,
    label: "FROM THE DESK, OR ANYWHERE",
    hero: "Gain, phantom power and pad, live",
  },
  {
    id: "p2-gpio", kind: "specs", sec: 14, phase: 3, unit: "sb16d", images: [129],
    label: "MACHINE CONTROL",
    hero: specValue("sb16d", "GPIO Interface"),
    sub: "GENERAL-PURPOSE I/O",
    body: [specValue("sv24", "Control Protocols")],
  },
  {
    id: "p2-demo-afv", kind: "demo", sec: 22, phase: 3, demo: "afv",
    label: "AUDIO FOLLOW VIDEO",
    hero: "A tally closes, and the fader moves itself",
  },
  {
    id: "p2-automix", kind: "screen", sec: 14, phase: 3, unit: "sv24", images: [87],
    label: "UNSCRIPTED ROOMS",
    hero: "Gain-sharing, calculated live",
    sub: platformValue("Auto Mixer"),
  },
  {
    id: "p2-protocols", kind: "montage", sec: 18, phase: 3,
    images: [62, 12, 14, 122, 113], clip: 17,
    label: "THE PROTOCOL LAYER",
    hero: "Ember+ · NMOS · SNMP · GPIO",
  },
  {
    id: "p2-st2110", kind: "montage", sec: 18, phase: 3,
    images: [7, 8, 9, 10, 11, 57], clip: 6,
    label: "IF-ST2110",
    hero: "Into the video fabric",
  },
  {
    id: "p2-cards", kind: "montage", sec: 18, phase: 3,
    images: [18, 19, 20, 21, 23, 24, 25],
    label: "THE IF-SERIES",
    hero: "AES/EBU · analog out · Dante · MADI",
  },
  {
    id: "p2-dp", kind: "broll", sec: 12, phase: 3, clip: 14, unit: "sv24",
    label: "DUAL POWER",
    hero: "The second supply",
    sub: `${specValue("sv24", "Power Redundancy (dp)")} via a ${platformValue("DC Inlet")} inlet and the ${platformValue("DC Adapter")}.`,
  },
  { id: "p2-outro", kind: "outro", sec: 18, phase: 5 },
];
