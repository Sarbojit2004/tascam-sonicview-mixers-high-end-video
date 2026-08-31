/**
 * WCAG contrast audit for every colour token that can carry type.
 *
 * Run before any scene is written, and again in CI. A token that fails here
 * cannot be used for text, so the check has to come before the type does —
 * otherwise the palette gets validated after the copy is already sitting on it.
 */
import { COLORS } from "../shared/theme.ts";

const srgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
};
const lum = (hex) => {
  const [r, g, b] = srgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** [token, background, minimum, what it is allowed to be used for] */
const CHECKS = [
  ["ink", "paper", 7, "headlines and body"],
  ["inkSoft", "paper", 7, "secondary body"],
  ["slate", "paper", 4.5, "muted subheadline"],
  ["slateDim", "paper", 4.5, "micro-labels only"],
  ["accent", "paper", 4.5, "hero figures, accented type"],
  ["accentSoft", "paper", 4.5, "animated spec counters"],
  ["net", "paper", 4.5, "network path labels"],
  ["signal", "paper", 4.5, "meter/data labels"],
  ["alert", "paper", 4.5, "problem chapter only"],
  ["ink", "paperEdge", 7, "type on the edge tone"],
  ["ink", "paperWell", 7, "type on the well tone"],
  ["slate", "paperWell", 4.5, "muted type on the well tone"],
  ["onScreen", "screen", 7, "VIEW screen-plate type"],
  ["onScreenDim", "screen", 4.5, "VIEW screen-plate micro type"],
];

/** Decorative-only tokens: must NOT be used for type. Reported, never failed. */
const DECORATIVE = ["netBright", "signalBright", "paperLift", "line", "lineStrong", "shadow"];

let fail = 0;
console.log("token           on            ratio    min   use");
for (const [tok, bg, min, use] of CHECKS) {
  const r = ratio(COLORS[tok], COLORS[bg]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(
    `${ok ? "  " : "XX"} ${tok.padEnd(13)} ${bg.padEnd(11)} ${r.toFixed(2).padStart(6)}  ${String(min).padStart(4)}   ${use}`,
  );
}
console.log(`\ndecorative (never type): ${DECORATIVE.join(", ")}`);
if (fail) {
  console.error(`\n${fail} contrast failure(s). Fix the token or stop using it for type.`);
  process.exit(1);
}
console.log("\nAll type-bearing tokens pass.");
