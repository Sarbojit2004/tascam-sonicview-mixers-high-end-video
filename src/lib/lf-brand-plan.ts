import {LFPart} from './lf-theme';
import {Brand} from '../components/lf/Logo';

/**
 * The branding cadence, as DATA.
 *
 * The long-form format sets hard rules about how often each mark appears, and
 * asserting compliance in prose is worth nothing. So every appearance is
 * declared here once: `BrandingLayer` renders straight from this table, and
 * scripts/branding_audit.mjs measures it from the same table. The picture and
 * the compliance report cannot disagree.
 *
 * Rules being satisfied:
 *   · Shivansh Electronics — recurring, no gap longer than ~25-30 s (750-900
 *     frames), at least one appearance inside every major topic segment, and
 *     varied in form rather than the same lower-third every time.
 *   · TASCAM — a handful per part, deliberately including mid-part, never just
 *     the open and close.
 *   · Dante — NOT on a cadence. Only where Dante networking is the actual
 *     subject on screen, so it reads as the technology being discussed rather
 *     than a third brand partner.
 *
 * Every appearance renders the mark directly on the background; no component
 * here draws a card, box or plate behind a logo.
 */

export type BrandForm =
  | 'lower-third' // logo + one rotating contact detail, bottom left
  | 'corner' // small mark, top right, during a hero shot
  | 'beat' // dedicated centred branding moment between segments
  | 'inline' // mark sitting beside the technical content it belongs to
  | 'outro'; // handled by the outro chapter itself

export type BrandAppearance = {
  at: number; // absolute frame within the part
  dur: number;
  brand: Brand;
  form: BrandForm;
  contact?: number; // index into the contact rotation, for lower-thirds
  note: string;
};

const P1: BrandAppearance[] = [
  {at: 60, dur: 240, brand: 'tascam', form: 'beat', note: 'cold open'},
  {at: 150, dur: 220, brand: 'shivansh', form: 'beat', note: 'cold open partner card'},
  {at: 520, dur: 200, brand: 'dante', form: 'inline', note: 'pillars — Dante named as the connective thread'},
  // lower-third rather than a corner mark, so it sits bottom-left and cannot
  // collide with the Dante inline mark occupying the right side of this chapter
  {at: 600, dur: 190, brand: 'shivansh', form: 'lower-third', contact: 7, note: 'four pillars segment'},
  {at: 860, dur: 200, brand: 'tascam', form: 'corner', note: '16XP introduced'},
  {at: 900, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 0, note: '16XP segment'},
  {at: 1450, dur: 200, brand: 'shivansh', form: 'corner', note: '16XP form factor'},
  {at: 2000, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 1, note: 'VIEW segment'},
  {at: 2560, dur: 200, brand: 'shivansh', form: 'corner', note: 'faders segment'},
  {at: 3000, dur: 200, brand: 'tascam', form: 'corner', note: 'FPGA engine'},
  {at: 3080, dur: 260, brand: 'shivansh', form: 'beat', note: 'FPGA segment branding beat'},
  {at: 3700, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 2, note: 'latency segment'},
  {at: 4200, dur: 200, brand: 'shivansh', form: 'corner', note: 'HDIA segment'},
  {at: 4700, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 3, note: 'rear I/O segment'},
  {at: 4820, dur: 240, brand: 'dante', form: 'inline', note: 'built-in 64x64 Dante interface'},
  {at: 5150, dur: 200, brand: 'shivansh', form: 'corner', note: 'recording segment'},
  {at: 5520, dur: 200, brand: 'tascam', form: 'corner', note: '24XP introduced'},
  {at: 5600, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 4, note: '24XP segment'},
  {at: 6150, dur: 200, brand: 'shivansh', form: 'corner', note: '24XP surface segment'},
  {at: 6600, dur: 200, brand: 'tascam', form: 'corner', note: 'dp axis'},
  {at: 6700, dur: 260, brand: 'shivansh', form: 'beat', note: 'dp segment branding beat'},
  {at: 7400, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 5, note: 'dp lineup segment'},
  {at: 7850, dur: 200, brand: 'shivansh', form: 'corner', note: 'migration segment'},
  {at: 8200, dur: 220, brand: 'shivansh', form: 'lower-third', contact: 6, note: 'continuation'},
];

const P2: BrandAppearance[] = [
  {at: 60, dur: 240, brand: 'tascam', form: 'beat', note: 'cold open'},
  {at: 150, dur: 220, brand: 'shivansh', form: 'beat', note: 'cold open partner card'},
  {at: 700, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 0, note: 'deployment problem'},
  {at: 1000, dur: 260, brand: 'dante', form: 'beat', note: 'Dante introduced as the transport — its own subject'},
  {at: 1250, dur: 200, brand: 'shivansh', form: 'corner', note: 'Dante transport segment'},
  {at: 1760, dur: 240, brand: 'dante', form: 'inline', note: '64x64 built-in capacity'},
  {at: 1800, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 1, note: '64x64 segment'},
  {at: 2300, dur: 220, brand: 'dante', form: 'inline', note: 'redundant primary/secondary paths'},
  {at: 2350, dur: 200, brand: 'shivansh', form: 'corner', note: 'redundancy segment'},
  {at: 2760, dur: 200, brand: 'tascam', form: 'corner', note: 'SB-16D introduced'},
  {at: 2850, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 2, note: 'SB-16D segment'},
  {at: 3450, dur: 260, brand: 'shivansh', form: 'beat', note: 'SB-16D I/O branding beat'},
  {at: 3560, dur: 220, brand: 'dante', form: 'inline', note: 'SB-16D connects over Dante'},
  {at: 4100, dur: 200, brand: 'shivansh', form: 'corner', note: 'chassis segment'},
  {at: 4600, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 3, note: 'deployment segment'},
  {at: 5100, dur: 200, brand: 'shivansh', form: 'corner', note: 'remote control segment'},
  {at: 5600, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 4, note: 'stage power segment'},
  {at: 6050, dur: 200, brand: 'tascam', form: 'corner', note: 'radio case study'},
  {at: 6150, dur: 200, brand: 'shivansh', form: 'corner', note: 'radio case study'},
  {at: 6500, dur: 220, brand: 'dante', form: 'inline', note: 'radio facility Dante primary/secondary'},
  {at: 6700, dur: 260, brand: 'shivansh', form: 'beat', note: 'case-study branding beat'},
  {at: 7300, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 5, note: 'campus case study'},
  {at: 7800, dur: 200, brand: 'shivansh', form: 'corner', note: 'campus case study'},
  {at: 8000, dur: 200, brand: 'tascam', form: 'corner', note: 'workflow summary'},
  {at: 8200, dur: 220, brand: 'shivansh', form: 'lower-third', contact: 6, note: 'continuation'},
];

const P3: BrandAppearance[] = [
  {at: 60, dur: 240, brand: 'tascam', form: 'beat', note: 'cold open'},
  {at: 150, dur: 220, brand: 'shivansh', form: 'beat', note: 'cold open partner card'},
  {at: 620, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 0, note: 'expansion slots'},
  {at: 960, dur: 200, brand: 'tascam', form: 'corner', note: 'IF-ST2110 card'},
  {at: 1100, dur: 200, brand: 'shivansh', form: 'corner', note: 'IF-ST2110 segment'},
  {at: 1600, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 1, note: 'ST 2110 payload'},
  {at: 2100, dur: 200, brand: 'shivansh', form: 'corner', note: 'ST 2110 control'},
  {at: 2600, dur: 260, brand: 'shivansh', form: 'beat', note: 'topologies branding beat'},
  {at: 3200, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 2, note: 'topologies segment'},
  {at: 3600, dur: 200, brand: 'tascam', form: 'corner', note: 'IF-AE16'},
  {at: 3700, dur: 200, brand: 'shivansh', form: 'corner', note: 'IF-AE16 segment'},
  {at: 4250, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 3, note: 'IF-AN16/OUT segment'},
  {at: 4800, dur: 200, brand: 'shivansh', form: 'corner', note: 'IF-MA64/EX segment'},
  {at: 5350, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 4, note: 'IF-MA64/EX segment'},
  {at: 5620, dur: 260, brand: 'dante', form: 'beat', note: 'IF-DA64 — the card that adds Dante capacity'},
  {at: 5900, dur: 200, brand: 'shivansh', form: 'corner', note: 'IF-DA64 segment'},
  {at: 6300, dur: 220, brand: 'dante', form: 'inline', note: 'IF-DA64 128x128 matrix'},
  {at: 6400, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 5, note: 'choosing between cards'},
  {at: 6900, dur: 200, brand: 'tascam', form: 'corner', note: 'choosing between cards'},
  {at: 6980, dur: 200, brand: 'shivansh', form: 'corner', note: 'choosing between cards'},
  {at: 7500, dur: 200, brand: 'shivansh', form: 'lower-third', contact: 6, note: 'facility control'},
  {at: 7950, dur: 260, brand: 'shivansh', form: 'beat', note: 'complete architecture beat'},
  {at: 8450, dur: 190, brand: 'shivansh', form: 'lower-third', contact: 7, note: 'close of series'},
];

export const LF_BRAND_PLAN: Record<LFPart, BrandAppearance[]> = {1: P1, 2: P2, 3: P3};

/** Frame at which each part's outro chapter begins; the outro carries all three marks' final placement. */
export const LF_OUTRO_START: Record<LFPart, number> = {1: 8430, 2: 8430, 3: 8430};
