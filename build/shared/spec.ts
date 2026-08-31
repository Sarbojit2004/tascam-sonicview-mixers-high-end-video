/**
 * STAGE 8 — VERIFIED TECHNICAL SPECIFICATION MASTER TABLES.
 *
 * The single source of every technical figure that reaches the screen in any of
 * the six deliverables. Transcribed directly from this project's own Gemini
 * research brief, "TASCAM Sonicview Technical Research [DATED_ 30th AUGUST,
 * 2026]", Stage 8. Nothing is rounded, approximated, converted or inferred.
 *
 * ANYTHING NOT MARKED `VERIFIED` IN THE BRIEF IS STORED AS `null` AND CANNOT
 * REACH THE SCREEN — `specValue()` throws rather than returning it. That makes
 * "only verified specs" a property of the build rather than a promise about it.
 *
 * GLYPH NOTE. The brief writes its own hero anchor as "20.8 μs" with U+03BC,
 * which is absent from the shipped font subsets. Every µ below is U+00B5 MICRO
 * SIGN, which is present. See shared/fonts.ts.
 */

export type UnitId = "sv16" | "sv24" | "sb16d";

export interface Unit {
  id: UnitId;
  name: string;
  /** Short form for tight lockups. */
  short: string;
  /** What this unit IS, in the brief's own terms. */
  role: string;
  arch: Record<string, string | null>;
  performance: Record<string, string | null>;
  network: Record<string, string | null>;
  physical: Record<string, string | null>;
}

export const UNITS: Record<UnitId, Unit> = {
  sv16: {
    id: "sv16",
    name: "TASCAM Sonicview 16",
    short: "Sonicview 16",
    role: "Digital mixing console — 16+1 fader HMI footprint",
    arch: {
      "Mixing Engine": "54-bit floating-point FPGA",
      "Internal Input Channels": "44 (40 mono, 2 stereo) + 4 FX return",
      "Output Bus Architecture": "22 flex, Main L/R, 4 FX send (32 total)",
      "Analog Mic/Line Inputs": "16 XLR (ch 9-16 combo TRS)",
      "Analog Line Outputs": "16 XLR",
      "Preamp Architecture": "Class 1 HDIA (instrumentation amplifier)",
      "Motorized Faders": "16 channel + 1 master (100 mm)",
      "VIEW Touchscreens": "Two 7-inch colour",
    },
    performance: {
      "Internal DSP Latency": "2 samples (20.8 µs) @ 96 kHz",
      "Analog-to-Analog Latency": "0.51 ms",
      "A/D - D/A Conversion": "32-bit ADC / 24-bit DAC @ 96 kHz",
      "Preamp EIN": "-128 dBu or less",
      "Max Input Level": "+32 dBu (pad on, trim min)",
    },
    network: {
      "Native Network I/O": "64x64 Dante (48 kHz), 32x32 (96 kHz)",
      "USB Audio Interface": "32-in / 32-out (32-bit / 96 kHz)",
      "SDXC Multitrack (IF-MTR32)": "32-track direct-to-SD (included in XP)",
      "Control Protocols": "Ember+, NMOS IS-04/05, SNMP, GPIO",
    },
    physical: {
      "Dimensions (W x H x D)": "472.0 x 228.1 x 554.4 mm",
      "Weight": "13 kg",
      "Power Supply (XP)": "Single AC (100-240 V)",
      "Power Redundancy (dp)": "AC + redundant DC (PS-P2450)",
      "Power Consumption": "65 W",
    },
  },

  sv24: {
    id: "sv24",
    name: "TASCAM Sonicview 24",
    short: "Sonicview 24",
    role: "Digital mixing console — 24+1 fader HMI footprint",
    arch: {
      "Mixing Engine": "54-bit floating-point FPGA",
      "Internal Input Channels": "44 (40 mono, 2 stereo) + 4 FX return",
      "Output Bus Architecture": "22 flex, Main L/R, 4 FX send (32 total)",
      "Analog Mic/Line Inputs": "24 XLR (ch 17-24 combo TRS)",
      "Analog Line Outputs": "16 XLR",
      "Preamp Architecture": "Class 1 HDIA (instrumentation amplifier)",
      "Motorized Faders": "24 channel + 1 master (100 mm)",
      "VIEW Touchscreens": "Three 7-inch colour",
    },
    performance: {
      "Internal DSP Latency": "2 samples (20.8 µs) @ 96 kHz",
      "Analog-to-Analog Latency": "0.51 ms",
      "A/D - D/A Conversion": "32-bit ADC / 24-bit DAC @ 96 kHz",
      "Preamp EIN": "-128 dBu or less",
      "Max Input Level": "+32 dBu (pad on, trim min)",
    },
    network: {
      "Native Network I/O": "64x64 Dante (48 kHz), 32x32 (96 kHz)",
      "USB Audio Interface": "32-in / 32-out (32-bit / 96 kHz)",
      "SDXC Multitrack (IF-MTR32)": "32-track direct-to-SD (included in XP)",
      "Control Protocols": "Ember+, NMOS IS-04/05, SNMP, GPIO",
    },
    physical: {
      "Dimensions (W x H x D)": "690.8 x 228.1 x 554.4 mm",
      "Weight": "18 kg",
      "Power Supply (XP)": "Single AC (100-240 V)",
      "Power Redundancy (dp)": "AC + redundant DC (PS-P2450)",
      "Power Consumption": "85 W",
    },
  },

  sb16d: {
    id: "sb16d",
    name: "TASCAM SB-16D",
    short: "SB-16D",
    /** Never described as a mixer. It is the console's input stage, moved. */
    role: "Networked stagebox — 16-in / 16-out Dante",
    arch: {
      "Form Factor": "3U rackmountable / floor stagebox",
      "Analog I/O": "16 XLR mic/line in, 16 XLR line out",
      "Preamp Architecture": "Class 1 HDIA",
      "GPIO Interface": "8-in / 8-out (expands to 16/16 with console)",
    },
    performance: {
      "A/D - D/A Conversion": "32-bit / 96 kHz",
      "Preamp EIN": "-128 dBu",
      "Max Input Level": "+32 dBu",
    },
    network: {
      "Dante Network Integration": "64x64 (48 kHz) / 32x32 (96 kHz)",
      "Network Connectors": "Primary & Secondary etherCON",
      "Network Protocols Supported": "Dante Domain Manager, AES67, ST 2110",
    },
    physical: {
      "Dimensions (W x H x D)": "482.8 x 132 x 120 mm (rackmount)",
      "Weight": "4.5 kg",
      "Power Topology": "Internal AC + redundant DC input",
    },
  },
};

/**
 * Platform facts that are not per-unit. Every one is VERIFIED in the brief.
 * `null` marks a fact the brief does NOT verify, so it can never render.
 */
export const PLATFORM: Record<string, string | null> = {
  "FPGA Bit Allocation": "42-bit amplitude data + 12-bit headroom",
  "Native Sample Rate": "96 kHz continuous",
  "Dante Redundancy": "SMPTE ST 2022-7",
  "Broadcast IP (IF-ST2110)": "64x64 SMPTE ST 2110-30/31, NMOS IS-04/05",
  "Newsroom Automation": "Ember+",
  "IF-MTR32 Recording": "32-track @ 48 kHz, 16-track @ 96 kHz, direct to SDXC",
  "IF-MTR32 Data Safety": "Write-file closed every 60 seconds",
  "Top-Panel Recording": "2-track stereo to USB flash drive",
  "DSP / OS Segregation": "FPGA passes audio if the GUI halts",
  "Operating System": "Dual-partition",
  "User Keys": "18 assignable, full-colour LED",
  "VIEW Layouts": "Channel Strip View, Module View, Individual View",
  "Per-Channel DSP":
    "Delay, phase, digital trim, HPF, gate/expander/de-esser, 4-band PEQ, compressor/ducker",
  "Per-Bus DSP": "31-band GEQ, RTA, 4-band PEQ, compressor/ducker, delay",
  "Auto Mixer": "Gain-sharing, real-time priority and weight",
  "AFV": "GPIO tally driven, defined rise / hold / fall times",
  "Remote Control App": "TASCAM Sonicview Control (Windows, macOS, iPadOS)",
  "DC Adapter": "PS-P2450 (DC 24 V, 5.0 A)",
  "DC Inlet": "4-pin XLR",

  // Deliberately null: the brief does not verify these, so they cannot render.
  "Maximum SB-16D Count Per Network": null,
  "Scene Memory Count": null,
  "Internal FX Engine Count": null,
  "Fader Travel Time": null,
};

/** The five Stage 10 hero-typography anchors, verbatim. */
export const HERO_ANCHORS = [
  { figure: "54-BIT / 96 kHz", subtext: "FLOATING-POINT FPGA ENGINE" },
  { figure: "-128 dBu EIN", subtext: "CLASS 1 HDIA INSTRUMENTATION TOPOLOGY" },
  { figure: "20.8 µs", subtext: "2-SAMPLE DSP LATENCY" },
  { figure: "ST 2110 / ST 2022-7", subtext: "BROADCAST IP REDUNDANCY" },
  { figure: "64x64 AoIP", subtext: "DETERMINISTIC DANTE INTEGRATION" },
] as const;

const TABLES = ["arch", "performance", "network", "physical"] as const;

/**
 * The only sanctioned way to put a specification on screen.
 * Throws on an unknown key and on a key the brief leaves UNVERIFIED, so an
 * unverified figure cannot render even by accident.
 */
export function specValue(unit: UnitId, key: string): string {
  const u = UNITS[unit];
  if (!u) throw new Error(`specValue: unknown unit "${unit}"`);
  for (const t of TABLES) {
    const table = u[t];
    if (key in table) {
      const v = table[key];
      if (v === null) {
        throw new Error(
          `specValue: "${key}" is UNVERIFIED for ${u.name} and must not be rendered.`,
        );
      }
      return v;
    }
  }
  throw new Error(`specValue: "${key}" is not in the Stage 8 tables for ${u.name}.`);
}

/** Same gate for the platform-wide facts. */
export function platformValue(key: string): string {
  if (!(key in PLATFORM)) throw new Error(`platformValue: "${key}" is not a Stage 8 platform fact.`);
  const v = PLATFORM[key];
  if (v === null) {
    throw new Error(`platformValue: "${key}" is UNVERIFIED in the brief and must not be rendered.`);
  }
  return v;
}

/** True when a key exists AND is verified — for optional callouts. */
export const hasSpec = (unit: UnitId, key: string): boolean => {
  try {
    specValue(unit, key);
    return true;
  } catch {
    return false;
  }
};
