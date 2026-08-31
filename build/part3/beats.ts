/**
 * PART 3 — "The Control Surface" · 298 s · 19 beats.
 *
 * Stage 7 phase 4 (the HMI) and phase 5 (technical validation). Stage 4 rank 6,
 * the recording and USB paths, and the three named deployments the brief cites.
 *
 * 28 real assets, each used once. Durations sum to exactly 8,940 frames.
 */
import type { Beat } from "../shared/beat.ts";
import { platformValue, specValue } from "../shared/spec.ts";

export const BEATS: Beat[] = [
  {
    id: "p3-cold", kind: "cold", sec: 14, phase: 4, clip: 24,
    label: "PART 3 · THE CONTROL SURFACE",
    hero: "Back to the operator",
    sub: "Everything the engine does still has to be reachable by one person, under time pressure.",
  },
  {
    id: "p3-view", kind: "screen", sec: 20, phase: 4, unit: "sv24", images: [28],
    label: "TASCAM VIEW",
    hero: "Three ways to look at one console",
    sub: "Visual Interactive Ergonomic Workflow — the operator chooses the layout that matches the task rather than the one the desk insists on.",
    body: [platformValue("VIEW Layouts")],
  },
  {
    id: "p3-strip", kind: "macro", sec: 14, phase: 4, unit: "sv24", images: [123],
    label: "CHANNEL STRIP VIEW",
    hero: "Eight channels, side by side",
    sub: "The analog reading of the desk: adjacent channels, compared at a glance.",
  },
  {
    id: "p3-module", kind: "macro", sec: 14, phase: 4, unit: "sv16", images: [68],
    label: "MODULE VIEW",
    hero: "One channel, three processing blocks",
    sub: "Everything happening to a single input, on one screen, with nothing else competing for attention.",
  },
  {
    id: "p3-individual", kind: "macro", sec: 14, phase: 4, unit: "sv24", images: [132],
    label: "INDIVIDUAL VIEW",
    hero: "A layout you build yourself",
    sub: "A monitoring array arranged around the way one room actually works.",
  },
  {
    id: "p3-demo-recall", kind: "demo", sec: 22, phase: 4, demo: "recall", unit: "sv24",
    label: "SNAPSHOT RECALL",
    hero: "Every fader arrives on the same frame",
  },
  {
    id: "p3-faders", kind: "specs", sec: 16, phase: 4, unit: "sv24", images: [98],
    label: "THE TACTILE LAYER",
    hero: specValue("sv24", "Motorized Faders"),
    sub: "MAPPED TO PROGRAMMABLE LAYERS",
    body: ["Sends on Fader", "DCA spill"],
  },
  {
    id: "p3-userkeys", kind: "broll", sec: 16, phase: 4, unit: "sv24", clip: 15,
    label: "ASSIGNED",
    hero: platformValue("User Keys"),
    sub: "INSTANT RECALL, UNDER THE HAND",
    body: ["Tap tempo", "Mute groups", "Snapshot state changes"],
  },
  {
    id: "p3-workflow", kind: "montage", sec: 16, phase: 4,
    images: [107, 108, 125, 127, 128, 31], clip: 22,
    label: "WHAT CHANGES ON THE DAY",
    hero: "The same room, rebuilt around one desk",
  },
  {
    id: "p3-mtr32", kind: "broll", sec: 18, phase: 4, unit: "sv24", clip: 16,
    label: "IF-MTR32",
    hero: "32 tracks",
    sub: "DIRECT TO SDXC, NO COMPUTER",
    body: [
      platformValue("IF-MTR32 Recording"),
      platformValue("IF-MTR32 Data Safety"),
    ],
  },
  {
    id: "p3-usb", kind: "specs", sec: 14, phase: 4, unit: "sv24", images: [130],
    label: "TO THE DAW",
    hero: specValue("sv24", "USB Audio Interface"),
    sub: "ASYNCHRONOUS USB AUDIO INTERFACE",
    body: [platformValue("Top-Panel Recording")],
  },
  {
    id: "p3-slots", kind: "broll", sec: 14, phase: 4, clip: 25, unit: "sv24",
    label: "TWO SLOTS",
    hero: "Two answers at once",
    sub: "A recorder in one bay and a broadcast transport in the other, with nothing about the surface in front changed to allow it.",
  },
  {
    id: "p3-radio", kind: "montage", sec: 16, phase: 5,
    images: [35, 37, 39], clip: 21,
    label: "IN SERVICE · BROADCAST",
    hero: "A schedule that does not stop for an installation",
  },
  {
    id: "p3-campus", kind: "montage", sec: 16, phase: 5,
    images: [29, 33, 32], clip: 19,
    label: "IN SERVICE · CAMPUS AND CONFERENCE",
    hero: "Complex behind, simple in front",
  },
  {
    id: "p3-remote", kind: "montage", sec: 14, phase: 5,
    images: [15, 16, 17],
    label: "IN SERVICE · REMOTE PRODUCTION",
    hero: "Hall, stadium, OB van, broadcast station",
  },
  {
    id: "p3-video", kind: "realvideo", sec: 16, phase: 5, video: 133, unit: "sv24",
    label: "THE TWENTY-FOUR",
    hero: "Complete, and uncropped",
  },
  {
    id: "p3-system", kind: "montage", sec: 16, phase: 5,
    images: [58, 59, 60, 61, 63, 64],
    label: "THE ECOSYSTEM",
    hero: "Console, stagebox, expansion, network",
  },
  {
    id: "p3-validate", kind: "statement", sec: 10, phase: 5,
    label: "TECHNICAL VALIDATION",
    hero: "Architect the system before you specify it",
    sub: "System design, protocol matching and infrastructure planning for the Sonicview platform.",
  },
  { id: "p3-outro", kind: "outro", sec: 18, phase: 5 },
];
