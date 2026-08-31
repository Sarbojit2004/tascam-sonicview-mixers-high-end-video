/**
 * REEL 3 — "The Control Surface" · 178 s · 13 beats.
 *
 * 16 real assets, each used once — including the Sonicview 16 product video,
 * which plays at natural speed and is never reduced to a still frame.
 * Durations sum to exactly 5,340 frames.
 */
import type { Beat } from "../shared/beat.ts";
import { platformValue, specValue } from "../shared/spec.ts";

export const BEATS: Beat[] = [
  {
    id: "r3-hook", kind: "cold", sec: 8, phase: 4, clip: 24,
    label: "TASCAM SONICVIEW",
    hero: "Three screens, one engine",
  },
  {
    id: "r3-view", kind: "screen", sec: 16, phase: 4, unit: "sv24", images: [102],
    label: "TASCAM VIEW",
    hero: "Three ways to look at one console",
    sub: platformValue("VIEW Layouts"),
  },
  {
    id: "r3-demo-recall", kind: "demo", sec: 20, phase: 4, demo: "recall", unit: "sv16",
    label: "SNAPSHOT RECALL",
    hero: "Every fader arrives together",
  },
  {
    id: "r3-faders", kind: "specs", sec: 14, phase: 4, unit: "sv16", images: [124],
    label: "THE TACTILE LAYER",
    hero: specValue("sv16", "Motorized Faders"),
    sub: "MAPPED TO PROGRAMMABLE LAYERS",
    body: ["Sends on Fader", "DCA spill"],
  },
  {
    id: "r3-spill", kind: "montage", sec: 12, phase: 4, images: [26, 103, 27],
    label: "DCA SPILL",
    hero: "A group, opened out",
  },
  {
    id: "r3-keys", kind: "screen", sec: 12, phase: 4, unit: "sv24", images: [92],
    label: "ASSIGNED",
    hero: platformValue("User Keys"),
  },
  {
    id: "r3-curve", kind: "broll", sec: 16, phase: 4, unit: "sv24", clip: 23,
    label: "SCREEN AS SUBJECT",
    hero: "The arithmetic, made visible",
    sub: "Parametric EQ and dynamics, redrawn as the operator edits them.",
  },
  {
    id: "r3-geq", kind: "montage", sec: 12, phase: 4, images: [97, 131, 100],
    label: "EVERY BUS",
    hero: "31-band GEQ and RTA",
    sub: platformValue("Per-Bus DSP"),
  },
  {
    id: "r3-mtr32", kind: "specs", sec: 14, phase: 4, unit: "sv24", images: [99],
    label: "IF-MTR32",
    hero: "32 tracks",
    sub: "DIRECT TO SDXC, NO COMPUTER",
    body: [platformValue("IF-MTR32 Recording")],
  },
  {
    id: "r3-usb", kind: "macro", sec: 10, phase: 4, unit: "sv24", images: [78],
    label: "AND TO THE DAW",
    hero: specValue("sv24", "USB Audio Interface"),
  },
  {
    id: "r3-air", kind: "montage", sec: 12, phase: 5,
    images: [34, 36, 88, 30],
    label: "IN SERVICE",
    hero: "Broadcast, remote, live",
  },
  {
    id: "r3-video", kind: "realvideo", sec: 14, phase: 5, video: 110, unit: "sv16",
    label: "THE SIXTEEN",
    hero: "Complete, and uncropped",
  },
  { id: "r3-outro", kind: "outro", sec: 18, phase: 5 },
];
