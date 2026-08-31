/**
 * REEL 1 — "The Computational Core" · 178 s · 13 beats.
 *
 * The same subject as Part 1, but NOT Part 1 re-cut. A reel opens on a hook in
 * its first seconds, moves faster, carries one idea per beat rather than a
 * chapter, and uses its own 17 assets. The two share a design system and an
 * argument; they do not share a structure.
 *
 * 17 real assets, each used once. Durations sum to exactly 5,340 frames.
 */
import type { Beat } from "../shared/beat.ts";
import { platformValue, specValue } from "../shared/spec.ts";

export const BEATS: Beat[] = [
  {
    id: "r1-hook", kind: "cold", sec: 8, phase: 1, clip: 1,
    label: "TASCAM SONICVIEW",
    hero: "The mixing happens where you cannot see it",
  },
  {
    id: "r1-problem", kind: "problem", sec: 10, phase: 1,
    label: "THE PROBLEM",
    hero: "Forty channels, one bus, and no room left at the top.",
  },
  {
    id: "r1-edge", kind: "macro", sec: 14, phase: 2, unit: "sv16", images: [109],
    label: "WHERE ANALOG ENDS",
    hero: "Converted at the edge",
    sub: "Past the rear panel there is no analog path left to protect.",
  },
  {
    id: "r1-hdia", kind: "broll", sec: 14, phase: 2, clip: 2, unit: "sv24",
    label: "CLASS 1 HDIA",
    hero: "Instrumentation grade",
    sub: "A true instrumentation-amplifier topology at the first gain stage.",
  },
  {
    id: "r1-demo-hdia", kind: "demo", sec: 18, phase: 2, demo: "hdia",
    label: "INSTRUMENTATION STAGE",
    hero: "What it rejects",
  },
  {
    id: "r1-ein", kind: "specs", sec: 12, phase: 2, unit: "sv24", images: [1],
    label: "MEASURED",
    hero: specValue("sv24", "Preamp EIN"),
    sub: "EQUIVALENT INPUT NOISE",
    body: [`Max input   ${specValue("sv24", "Max Input Level")}`],
  },
  {
    id: "r1-adc", kind: "macro", sec: 10, phase: 2, unit: "sv24", images: [90],
    label: "THE CONVERSION",
    hero: "Thirty-two bits",
    sub: specValue("sv24", "A/D - D/A Conversion"),
  },
  {
    id: "r1-fpga", kind: "hero", sec: 16, phase: 2, unit: "sv24", images: [65],
    label: "THE ENGINE",
    hero: "54-bit floating point",
    sub: "Summing inside an FPGA, not a fixed-point DSP chip.",
    body: [platformValue("FPGA Bit Allocation")],
  },
  {
    id: "r1-demo-sum", kind: "demo", sec: 20, phase: 2, demo: "summing",
    label: "THE SUMMING MATRIX",
    hero: "The ceiling is never reached",
  },
  {
    id: "r1-latency", kind: "broll", sec: 14, phase: 2, clip: 4, unit: "sv24",
    label: "INTERNAL LATENCY",
    hero: "20.8 microseconds",
    sub: `${specValue("sv24", "Internal DSP Latency")}. Analog to analog, ${specValue("sv24", "Analog-to-Analog Latency")}.`,
  },
  {
    id: "r1-matrix", kind: "montage", sec: 12, phase: 2,
    images: [2, 3, 4, 95],
    label: "THE MATRIX",
    hero: "44 in, 32 buses out",
  },
  {
    id: "r1-two", kind: "montage", sec: 12, phase: 2,
    images: [105, 116, 118, 70, 73, 75, 55, 101, 89], clip: 18,
    label: "ONE ENGINE",
    hero: "Two footprints",
  },
  { id: "r1-outro", kind: "outro", sec: 18, phase: 5 },
];
