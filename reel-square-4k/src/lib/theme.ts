import {VersionId} from './music';

export const FONT = {
  display: "'Unbounded', 'Poppins', sans-serif",
  ui: "'Poppins', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export type Theme = {
  /** primary accent (glows, rules, chips) */
  a: string;
  /** secondary accent (gradients) */
  b: string;
  /** rgb triplets for rgba() */
  aRgb: string;
  bRgb: string;
  ink: string;
  bg: string;
  fx: 'lightning' | 'ribbons';
  tag: string;
};

export const THEMES: Record<VersionId, Theme> = {
  thunderstruck: {
    a: '#4DB6FF',
    b: '#D9F1FF',
    aRgb: '77,182,255',
    bRgb: '217,241,255',
    ink: '#F4F7FB',
    bg: '#05070A',
    fx: 'lightning',
    tag: 'THUNDERSTRUCK CUT',
  },
  lostsky: {
    a: '#8C7BFF',
    b: '#3FE3FF',
    aRgb: '140,123,255',
    bRgb: '63,227,255',
    ink: '#F4F4FB',
    bg: '#06060B',
    fx: 'ribbons',
    tag: 'WHERE WE STARTED CUT',
  },
};

export const rgba = (rgb: string, a: number) => `rgba(${rgb},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

/** Verified copy only (TASCAM Sonicview Technical Research, 30 Aug 2026 — items marked VERIFIED). */
export const COPY = {
  partner: 'Shivansh Electronics',
  role: "TASCAM's Authorized Partner",
  phones: ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755'],
  website: 'shivanshelectronics.in',
};
