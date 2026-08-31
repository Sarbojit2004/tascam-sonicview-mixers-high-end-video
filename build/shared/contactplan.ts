/**
 * WHERE AND WHEN THE CONTACT STRIPS APPEAR — planned from geometry, then audited.
 *
 * ═══ THE TWO RULES THIS EXISTS TO KEEP ════════════════════════════════════
 *
 * Contact details must be marketed FREQUENTLY (§6.2 says under-marketing was the
 * identified problem, so err toward more), and they must NEVER land on the
 * content, and no element may sit at a fixed position. Those pull against each
 * other: the easy way to be frequent is to pin a strip somewhere permanent, and
 * the easy way to avoid collisions is to show almost nothing.
 *
 * Declaring every appearance as data lets scripts/audit_contact.mjs compute the
 * real absolute timeline and fail the build on a gap that is too long, a slot
 * used too often, a consecutive repeat, or a channel that never gets a turn.
 *
 * ═══ THE TWO CANVASES GET GENUINELY DIFFERENT MECHANICS ═══════════════════
 *
 * PORTRAIT (the reels) has 180 px above the content and 220 px below it,
 * reserved as a caption-safe band and otherwise completely empty. Strips live
 * there and nowhere else, so a collision with the content is not merely avoided
 * but IMPOSSIBLE — the bands are outside the content box by construction.
 *
 * LANDSCAPE (the parts) has no such band; its margin is 52 px, too thin to hold
 * legible type. So free space has to be found inside the frame, per scene.
 *
 * ═══ WHAT THIS BUILD CHANGES ══════════════════════════════════════════════
 *
 * The Recording Series production declared landscape free corners as a
 * hand-written table keyed by beat kind — established by rendering each kind and
 * looking at it. That works until a layout changes, at which point the table is
 * silently wrong and the audit still passes.
 *
 * Here the scene modules report the rectangles their layout ACTUALLY occupies
 * (`Beat.occupies`), derived from the same constants they render from, and the
 * planner subtracts those from the frame to find real free space. A layout
 * change cannot invalidate the placement plan, because the plan is computed
 * from the layout rather than declared beside it.
 *
 * NOTHING IS PINNED. Consecutive strips never share a slot, slots are chosen
 * least-used-first so the whole set gets exercised, and every strip slides in
 * and out rather than cutting.
 */
import { CHANNELS, isWide, type ChannelKey } from "./brand.ts";
import { frames, type Beat, type Rect } from "./beat.ts";

export type Slot =
  // portrait: the two reserved bands
  | "band-top-left" | "band-top-center" | "band-top-right"
  | "band-bottom-left" | "band-bottom-center" | "band-bottom-right"
  // landscape: the nine-grid
  | "tl" | "tc" | "tr" | "cl" | "cr" | "bl" | "bc" | "br";

export interface StripAppearance {
  beat: string;
  at: number;
  dur: number;
  channel: ChannelKey;
  slot: Slot;
}

/** The portrait bands. Every slot here is outside the content box. */
const PORTRAIT_SLOTS: Slot[] = [
  "band-top-left", "band-bottom-right", "band-top-center", "band-bottom-left",
  "band-top-right", "band-bottom-center",
];

/**
 * A wide strip (the three WhatsApp numbers) needs the full width of a band, so
 * it only ever takes a centred slot; a left- or right-anchored slot would run
 * it off the frame.
 */
const PORTRAIT_WIDE: Slot[] = ["band-top-center", "band-bottom-center"];

const LANDSCAPE_SLOTS: Slot[] = ["tl", "tc", "tr", "cl", "cr", "bl", "bc", "br"];

/** Landscape canvas, and the box each slot would occupy. */
const LW = 1920, LH = 1080;
const STRIP_H = 54;
const NARROW_W = 430;
const WIDE_W = 880;
const M = 56; // SPACE.marginX

export function slotRect(slot: Slot, wide: boolean): Rect {
  const w = wide ? WIDE_W : NARROW_W;
  const h = STRIP_H;
  const col = slot.endsWith("l") ? M : slot.endsWith("r") ? LW - M - w : (LW - w) / 2;
  const row = slot.startsWith("t") ? M : slot.startsWith("b") ? LH - M - h : (LH - h) / 2;
  return { x: col, y: row, w, h };
}

const overlaps = (a: Rect, b: Rect, pad = 18) =>
  a.x < b.x + b.w + pad && a.x + a.w + pad > b.x &&
  a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;

/** Slots that do not touch anything this beat's layout occupies. */
export function freeSlots(beat: Beat, wide: boolean): Slot[] {
  const occ = beat.occupies ?? [];
  return LANDSCAPE_SLOTS.filter((s) => {
    const r = slotRect(s, wide);
    if (r.x < 0 || r.x + r.w > LW) return false;
    return !occ.some((o) => overlaps(r, o));
  });
}

export interface ContactPlanOptions {
  portrait?: boolean;
  /**
   * Strips per beat. §6.2 asks for noticeably higher frequency than prior
   * productions, which planned 1 per beat and 2 on long beats. This build
   * plans 2, and 3 on a beat long enough to hold three without any of them
   * feeling rushed.
   */
  perBeat?: number;
  /** Where this deliverable enters the channel rotation, so the six differ. */
  channelFrom?: number;
}

export function buildContactPlan(
  beats: Beat[],
  { portrait = false, perBeat = 2, channelFrom = 0 }: ContactPlanOptions = {},
): StripAppearance[] {
  const plan: StripAppearance[] = [];
  const used = new Map<Slot, number>();
  let last: Slot | null = null;
  let ch = channelFrom;

  const pick = (beat: Beat, channel: ChannelKey): Slot => {
    const wide = isWide(channel);
    const all = portrait
      ? (wide ? PORTRAIT_WIDE : PORTRAIT_SLOTS)
      : (() => {
          const free = freeSlots(beat, wide);
          // If a layout genuinely leaves nothing free for a wide strip, fall
          // back to the narrow-strip free set rather than forcing a collision;
          // the renderer then splits the WhatsApp line over two rows.
          return free.length ? free : freeSlots(beat, false);
        })();
    if (!all.length) {
      throw new Error(
        `contactplan: beat "${beat.id}" leaves no free slot for a ${channel} strip. ` +
          `Its layout occupies ${(beat.occupies ?? []).length} rect(s) covering the whole frame.`,
      );
    }
    const pool = all.filter((s) => s !== last);
    const opts = pool.length ? pool : all;
    let best = opts[0];
    for (const s of opts) if ((used.get(s) ?? 0) < (used.get(best) ?? 0)) best = s;
    used.set(best, (used.get(best) ?? 0) + 1);
    last = best;
    return best;
  };

  for (const b of beats) {
    // The end screen composes its own contact block; a strip on top of it would
    // be the same information twice.
    if (b.kind === "outro") continue;
    // A cold open gets to land before anything is sold. One beat of clean air
    // at the top of a deliverable is worth more than one extra impression.
    if (b.kind === "cold") continue;

    const dur = frames(b.sec);
    const n = b.sec >= 20 ? Math.max(perBeat, 3) : perBeat;

    for (let i = 0; i < n; i++) {
      const channel = CHANNELS[ch++ % CHANNELS.length];
      const window = Math.floor((dur - 24) / n);
      const at = 12 + i * window;
      const hold = Math.max(46, window - 14);
      plan.push({ beat: b.id, at, dur: hold, channel, slot: pick(b, channel) });
    }
  }

  return plan;
}

export interface ContactReport {
  strips: number;
  channels: ChannelKey[];
  maxGapSec: number;
  meanIntervalSec: number;
  slots: number;
  consecutiveRepeats: number;
  slotOveruse: string[];
  perChannel: Record<string, number>;
}

/** Audits a finished plan. `starts` maps beat id -> absolute start frame. */
export function auditContact(
  plan: StripAppearance[],
  starts: Record<string, number>,
  total: number,
  fps = 30,
): ContactReport {
  const abs = plan
    .map((a) => ({ ...a, absAt: (starts[a.beat] ?? 0) + a.at }))
    .sort((x, y) => x.absAt - y.absAt);

  let maxGap = 0;
  let cursor = 0;
  for (const a of abs) {
    maxGap = Math.max(maxGap, a.absAt - cursor);
    cursor = Math.max(cursor, a.absAt + a.dur);
  }
  maxGap = Math.max(maxGap, total - cursor);

  const slotCount: Record<string, number> = {};
  let consecutiveRepeats = 0;
  abs.forEach((a, i) => {
    slotCount[a.slot] = (slotCount[a.slot] ?? 0) + 1;
    if (i > 0 && abs[i - 1].slot === a.slot) consecutiveRepeats++;
  });

  const cap = Math.max(3, Math.ceil(abs.length / 3));
  const slotOveruse = Object.entries(slotCount)
    .filter(([, c]) => c > cap)
    .map(([s, c]) => `slot "${s}" used ${c}x (cap ${cap})`);

  const perChannel: Record<string, number> = {};
  for (const a of abs) perChannel[a.channel] = (perChannel[a.channel] ?? 0) + 1;

  return {
    strips: abs.length,
    channels: [...new Set(abs.map((a) => a.channel))],
    maxGapSec: +(maxGap / fps).toFixed(1),
    meanIntervalSec: abs.length > 1 ? +(total / fps / abs.length).toFixed(1) : 0,
    slots: Object.keys(slotCount).length,
    consecutiveRepeats,
    slotOveruse,
    perChannel,
  };
}
