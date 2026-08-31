/**
 * PART 1 — "The Computational Core" · 298 s · 18 beats.
 *
 * Stage 7 phases 1 and 2: the broadcast challenge, then the computational
 * solution. Stage 4 ranks 1 (the 54-bit FPGA engine) and 3 (Class 1 HDIA), plus
 * the OS/DSP-segregation half of rank 4.
 *
 * Every figure on screen comes through specValue()/platformValue(), which throw
 * rather than return anything the research brief leaves UNVERIFIED.
 *
 * 27 real assets, each used once. Durations sum to exactly 8,940 frames;
 * assertRuntime fails at module load if an edit breaks that.
 */
import type { Beat } from "../shared/beat.ts";
import { platformValue, specValue } from "../shared/spec.ts";

export const BEATS: Beat[] = [
  {
    id: "p1-cold", kind: "cold", sec: 14, phase: 1, clip: 1,
    label: "TASCAM SONICVIEW",
    hero: "A node, not a desk",
    sub: "The console is a processing node on a network. Almost everything else follows from that one fact.",
  },
  {
    id: "p1-problem", kind: "problem", sec: 16, phase: 1,
    label: "THE BROADCAST CHALLENGE",
    hero: "Forty channels of transient peaks, summed onto one bus, live.",
    sub: "High channel counts. Heavy summing buses. Packet loss across an IP fabric. And a control surface that must never take the audio down with it.",
  },
  {
    id: "p1-edge", kind: "macro", sec: 16, phase: 2, unit: "sv16", images: [67],
    label: "WHERE ANALOG ENDS",
    hero: "Digitised at the chassis edge",
    sub: "Every analog input is converted at the physical boundary of the console. Past that point there is no analog signal path left to protect.",
    body: [
      specValue("sv16", "A/D - D/A Conversion"),
      platformValue("Native Sample Rate"),
    ],
  },
  {
    id: "p1-hdia", kind: "broll", sec: 20, phase: 2, clip: 2, unit: "sv24",
    label: "CLASS 1 HDIA",
    hero: "Instrumentation grade",
    sub: "A true instrumentation-amplifier topology at the first gain stage: high input impedance, high common-mode rejection, and discrete components sized to pass low-frequency transients without sagging.",
  },
  {
    id: "p1-demo-hdia", kind: "demo", sec: 22, phase: 2, demo: "hdia",
    label: "INSTRUMENTATION STAGE",
    hero: "What a difference amplifier rejects",
  },
  {
    id: "p1-ein", kind: "specs", sec: 14, phase: 2, unit: "sv24", images: [53],
    label: "MEASURED",
    hero: specValue("sv24", "Preamp EIN"),
    sub: "EQUIVALENT INPUT NOISE",
    body: [
      `Max input   ${specValue("sv24", "Max Input Level")}`,
      specValue("sv24", "Preamp Architecture"),
    ],
  },
  {
    id: "p1-adc", kind: "broll", sec: 14, phase: 2, unit: "sv16", clip: 3,
    label: "THE CONVERSION",
    hero: "Into thirty-two bits",
    sub: "The preamps feed the converters directly, at the rear panel, on the same board.",
  },
  {
    id: "p1-fpga", kind: "hero", sec: 20, phase: 2, unit: "sv24", images: [6],
    label: "THE ENGINE",
    hero: "54-bit floating point",
    sub: "All summing and processing happens inside a field-programmable gate array rather than a fixed-point DSP chip.",
    body: [
      specValue("sv24", "Mixing Engine"),
      platformValue("FPGA Bit Allocation"),
    ],
  },
  {
    id: "p1-demo-sum", kind: "demo", sec: 24, phase: 2, demo: "summing",
    label: "THE SUMMING MATRIX",
    hero: "Forty-four channels, and the ceiling still not reached",
  },
  {
    id: "p1-headroom", kind: "specs", sec: 14, phase: 2, unit: "sv24", images: [96],
    label: "THE ARITHMETIC",
    hero: "42 + 12",
    sub: "AMPLITUDE BITS PLUS HEADROOM BITS",
    body: [platformValue("FPGA Bit Allocation")],
  },
  {
    id: "p1-latency", kind: "broll", sec: 18, phase: 2, clip: 4, unit: "sv24",
    label: "INTERNAL LATENCY",
    hero: "Two samples",
    sub: `${specValue("sv24", "Internal DSP Latency")} through the mixing engine — massively parallel processing rather than a scheduled instruction stream.`,
  },
  {
    id: "p1-roundtrip", kind: "specs", sec: 14, phase: 2, unit: "sv24", images: [93],
    label: "ANALOG TO ANALOG",
    hero: specValue("sv24", "Analog-to-Analog Latency"),
    sub: "THE COMPLETE A/D - DSP - D/A PATH",
    body: [specValue("sv24", "Internal DSP Latency")],
  },
  {
    id: "p1-channels", kind: "statement", sec: 16, phase: 2, unit: "sv24",
    label: "THE MATRIX",
    hero: "Forty-four in, thirty-two buses out",
    sub: "The internal routing matrix is identical across the line. Chassis size changes the surface, not the engine behind it.",
    body: [
      specValue("sv24", "Internal Input Channels"),
      specValue("sv24", "Output Bus Architecture"),
    ],
  },
  {
    id: "p1-dsp", kind: "screen", sec: 14, phase: 2, unit: "sv24", images: [94],
    label: "PER CHANNEL, PER BUS",
    hero: "Processing that does not run out",
    body: [platformValue("Per-Channel DSP"), platformValue("Per-Bus DSP")],
  },
  {
    id: "p1-segregation", kind: "broll", sec: 16, phase: 2, clip: 11, unit: "sv24",
    label: "DISASTER RECOVERY",
    hero: "The audio outlives the interface",
    sub: `${platformValue("DSP / OS Segregation")}. ${platformValue("Operating System")}.`,
  },
  {
    id: "p1-sixteen", kind: "montage", sec: 16, phase: 2,
    images: [66, 69, 71, 72, 74, 76, 77, 79, 80, 81, 106], clip: 12,
    label: "THE SIXTEEN",
    hero: "16 + 1 faders, two screens",
  },
  {
    id: "p1-bridge", kind: "montage", sec: 12, phase: 2,
    images: [82, 83, 111, 114, 115, 117, 119, 120, 121, 56],
    label: "THE TWENTY-FOUR",
    hero: "Same engine, 24 + 1 faders, three screens",
  },
  { id: "p1-outro", kind: "outro", sec: 18, phase: 5 },
];
