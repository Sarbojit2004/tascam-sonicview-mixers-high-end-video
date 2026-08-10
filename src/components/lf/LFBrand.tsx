import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, F, LF_SAFE, LFPart, lfAccent, lfAccentOnDark} from '../../lib/lf-theme';
import {CONTACT, CTA, PARTNER, PARTNER_ROLE} from '../../lib/copy';
import {LF_BRAND_PLAN, BrandAppearance} from '../../lib/lf-brand-plan';
import {Logo, logoWidth} from './Logo';
import {Body, Display, Kicker, Micro, Rule, Spec} from '../Type';
import {ramp, stag} from '../../lib/anim';

/**
 * Branding for the long-form format.
 *
 * Every mark is placed DIRECTLY on the light background. Nothing in this file
 * draws a card, box or plate behind a logo — the source assets' own white
 * plates were keyed out by scripts/prep_logos.py precisely so this could be
 * true. (The outro's dark identity panel is a typographic block containing no
 * logo; the marks in the outro sit outside it, on the background.)
 *
 * Placement, timing and form all come from src/lib/lf-brand-plan.ts, which is
 * also what scripts/branding_audit.mjs measures. Picture and compliance report
 * therefore read from one table.
 */

/** Contact details rotated through the lower-thirds across a part. */
export const LF_CONTACTS: {label: string; value: string}[] = [
  {label: 'WEB', value: CONTACT.website},
  {label: 'WHATSAPP', value: CONTACT.phones[0]},
  {label: 'GATEWAY HUB', value: CONTACT.linktree},
  {label: 'WHATSAPP', value: CONTACT.phones[1]},
  {label: 'INSTAGRAM', value: CONTACT.instagram},
  {label: 'YOUTUBE', value: CONTACT.youtube},
  {label: 'WHATSAPP', value: CONTACT.phones[2]},
  {label: 'LINKEDIN', value: CONTACT.linkedin},
];

// ---------------------------------------------------------------------------
const LowerThird: React.FC<{part: LFPart; dur: number; contact: number}> = ({
  part,
  dur,
  contact,
}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const c = LF_CONTACTS[contact % LF_CONTACTS.length];
  const p = Math.min(ramp(f, [0, 16], [0, 1]), ramp(f, [dur - 16, dur], [1, 0]));
  const slide = (1 - ramp(f, [0, 20], [0, 1])) * -34;
  const H = 46;
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_SAFE.x,
        top: LF_SAFE.y + LF_SAFE.h - 96,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: p,
        transform: `translateX(${slide}px)`,
      }}
    >
      <Logo brand="shivansh" h={H} x={0} y={0} style={{position: 'relative', left: 0, top: 0}} />
      <div style={{width: 2, height: 40, backgroundColor: a, opacity: 0.85}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <Micro color={C.inkDim} size={15} tracking={2.6}>
          {PARTNER_ROLE.toUpperCase()}
        </Micro>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
          <Micro color={a} size={14} tracking={2.2}>
            {c.label}
          </Micro>
          <div
            style={{
              fontFamily: F.mono,
              fontWeight: 500,
              fontSize: 25,
              letterSpacing: 0.4,
              color: C.ink,
            }}
          >
            {c.value}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
const CornerMark: React.FC<{part: LFPart; dur: number; brand: 'shivansh' | 'tascam' | 'dante'}> = ({
  dur,
  brand,
}) => {
  const f = useCurrentFrame();
  const p = Math.min(ramp(f, [0, 16], [0, 1]), ramp(f, [dur - 16, dur], [1, 0]));
  const h = brand === 'shivansh' ? 40 : 30;
  return (
    <Logo
      brand={brand}
      h={h}
      x={0}
      y={0}
      align="right"
      opacity={p * 0.94}
      style={{transform: `translateY(${(1 - ramp(f, [0, 20], [0, 1])) * -14}px)`}}
    />
  );
};

// ---------------------------------------------------------------------------
const BrandBeatCard: React.FC<{
  part: LFPart;
  dur: number;
  brand: 'shivansh' | 'tascam' | 'dante';
  note: string;
}> = ({part, dur, brand, note}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const p = Math.min(ramp(f, [0, 20], [0, 1]), ramp(f, [dur - 20, dur], [1, 0]));
  const h = brand === 'shivansh' ? 96 : brand === 'tascam' ? 62 : 62;
  const w = logoWidth(brand, h);
  const sub =
    brand === 'shivansh'
      ? PARTNER_ROLE
      : brand === 'tascam'
        ? 'SONICVIEW DIGITAL MIXING CONSOLE ECOSYSTEM'
        : 'AUDIO NETWORKING OVER STANDARD IP';
  return (
    <AbsoluteFill style={{opacity: p}}>
      {/* A branding BEAT is a full-frame interstitial, not an overlay: the
          chapter beneath is washed out to the page colour so the mark sits on
          the background with nothing behind it. This is deliberately not a box
          or plate around the logo — it is the page itself coming forward. */}
      <AbsoluteFill style={{backgroundColor: C.paper, opacity: 0.94}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 70% at 50% 46%, ${a}12 0%, ${a}00 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: LF_SAFE.x + (LF_SAFE.w - w) / 2,
          top: LF_SAFE.y + LF_SAFE.h / 2 - h - 26,
          transform: `translateY(${(1 - ramp(f, [0, 24], [0, 1])) * 16}px)`,
        }}
      >
        <Logo brand={brand} h={h} style={{position: 'relative', left: 0, top: 0}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: LF_SAFE.x,
          top: LF_SAFE.y + LF_SAFE.h / 2 + 16,
          width: LF_SAFE.w,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          opacity: ramp(f, [14, 34], [0, 1]),
        }}
      >
        <Rule w={110} color={a} thickness={4} />
        <Micro color={C.inkSoft} size={19} tracking={4.4}>
          {sub}
        </Micro>
        <div title={note} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
/** Mark sitting beside the technical content it belongs to. Right of centre. */
const InlineMark: React.FC<{
  part: LFPart;
  dur: number;
  brand: 'dante' | 'tascam' | 'shivansh';
  y?: number;
}> = ({part, dur, brand, y = 118}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const p = Math.min(ramp(f, [0, 18], [0, 1]), ramp(f, [dur - 18, dur], [1, 0]));
  const h = 44;
  const w = logoWidth(brand, h);
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_SAFE.x + LF_SAFE.w - w - 8,
        top: LF_SAFE.y + y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
        opacity: p,
        transform: `translateX(${(1 - ramp(f, [0, 22], [0, 1])) * 24}px)`,
      }}
    >
      <Logo brand={brand} h={h} style={{position: 'relative', left: 0, top: 0}} />
      <div style={{width: w * 0.55, height: 3, backgroundColor: a, opacity: 0.9}} />
    </div>
  );
};

// ---------------------------------------------------------------------------
/**
 * Renders every declared appearance at its absolute frame. Mounted once at the
 * composition level so the cadence is guaranteed by the table rather than by
 * remembering to add a logo inside each scene.
 */
export const BrandingLayer: React.FC<{part: LFPart}> = ({part}) => {
  const plan = LF_BRAND_PLAN[part];
  return (
    <>
      {plan.map((b: BrandAppearance, i) => (
        <Sequence
          key={`${b.at}-${b.brand}-${i}`}
          from={b.at}
          durationInFrames={b.dur}
          layout="none"
          name={`brand:${b.brand}:${b.form} @${b.at}`}
        >
          {b.form === 'lower-third' ? (
            <LowerThird part={part} dur={b.dur} contact={b.contact ?? 0} />
          ) : b.form === 'corner' ? (
            <CornerMark part={part} dur={b.dur} brand={b.brand} />
          ) : b.form === 'beat' ? (
            <BrandBeatCard part={part} dur={b.dur} brand={b.brand} note={b.note} />
          ) : (
            <InlineMark part={part} dur={b.dur} brand={b.brand} y={b.y} />
          )}
        </Sequence>
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------
/** Chapter title card element, used at the top-left of every chapter. */
export const ChapterMark: React.FC<{part: LFPart; label: string; dur: number; n?: string}> = ({
  part,
  label,
  dur,
  n,
}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const p = Math.min(ramp(f, [4, 24], [0, 1]), ramp(f, [dur - 18, dur], [1, 0]));
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_SAFE.x,
        top: LF_SAFE.y,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: p * 0.95,
      }}
    >
      <div style={{width: 34, height: 3, backgroundColor: a}} />
      {n ? (
        <Micro color={a} size={16} tracking={2.6}>
          {n}
        </Micro>
      ) : null}
      <Micro color={C.inkDim} size={16} tracking={3.2}>
        {label}
      </Micro>
    </div>
  );
};

// ---------------------------------------------------------------------------
const Row: React.FC<{label: string; value: string; delay: number; a: string}> = ({
  label,
  value,
  delay,
  a,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 14], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <div style={{width: 150, flexShrink: 0}}>
        <Micro color={C.inkDim} size={14} tracking={2.2}>
          {label}
        </Micro>
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 500,
          fontSize: 23,
          letterSpacing: 0.4,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
      <div style={{flex: 1, height: 1, backgroundColor: C.lineSoft, transform: 'translateY(-5px)'}} />
      <div style={{width: 6, height: 6, borderRadius: 6, backgroundColor: a, opacity: 0.7}} />
    </div>
  );
};

/**
 * The full outro. Every part gets this, including Part 3 — the close-of-series
 * line is an additional chapter before it, never a replacement for it.
 *
 * The TASCAM and Shivansh marks sit directly on the background here; the dark
 * block below them is a typographic identity panel that contains no logo.
 */
export const LFOutro: React.FC<{part: LFPart; dur: number}> = ({part, dur}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const aDark = lfAccentOnDark(part);
  const head = ramp(f, [6, 30], [0, 1]);
  const COLW = 860;

  return (
    <>
      {/* marks, directly on the ground */}
      <Logo brand="tascam" h={44} x={0} y={0} opacity={ramp(f, [4, 26], [0, 1])} />
      <Logo
        brand="shivansh"
        h={62}
        x={0}
        y={-6}
        align="right"
        opacity={ramp(f, [12, 34], [0, 1])}
      />

      {/* CTA — left column */}
      <div
        style={{
          position: 'absolute',
          left: LF_SAFE.x,
          top: LF_SAFE.y + 140,
          width: COLW,
          opacity: head,
          transform: `translateY(${(1 - head) * 16}px)`,
        }}
      >
        <Kicker color={a} size={20} tracking={4.6}>
          {CTA.eyebrow}
        </Kicker>
        <Rule w={116} color={a} thickness={5} style={{marginTop: 16, marginBottom: 22}} />
        <Display size={86} lh={0.90} color={C.ink}>
          {CTA.headline}
        </Display>
        <Body size={27} color={C.inkSoft} lh={1.42} style={{marginTop: 24, maxWidth: 800}}>
          {CTA.body}
        </Body>

        <div
          style={{
            marginTop: 34,
            backgroundColor: C.ink,
            borderRadius: 12,
            padding: '22px 28px',
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 8,
            opacity: ramp(f, [30, 52], [0, 1]),
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: -0.2,
              lineHeight: 1,
              color: C.paperHi,
              textTransform: 'uppercase',
            }}
          >
            {PARTNER}
          </div>
          <Micro color={aDark} size={16} tracking={3.4}>
            {PARTNER_ROLE}
          </Micro>
        </div>
      </div>

      {/* contact table — right column */}
      <div
        style={{
          position: 'absolute',
          left: LF_SAFE.x + COLW + 76,
          top: LF_SAFE.y + 152,
          width: LF_SAFE.w - COLW - 76,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <Row label="WEBSITE" a={a} delay={stag(0, 3.5, 34)} value={CONTACT.website} />
        <Row label="GATEWAY HUB" a={a} delay={stag(1, 3.5, 34)} value={CONTACT.linktree} />
        <Row label="WHATSAPP" a={a} delay={stag(2, 3.5, 34)} value={CONTACT.phones[0]} />
        <Row label="WHATSAPP" a={a} delay={stag(3, 3.5, 34)} value={CONTACT.phones[1]} />
        <Row label="WHATSAPP" a={a} delay={stag(4, 3.5, 34)} value={CONTACT.phones[2]} />
        <Row label="WA CHANNEL" a={a} delay={stag(5, 3.5, 34)} value={CONTACT.whatsappChannel} />
        <Row label="INSTAGRAM" a={a} delay={stag(6, 3.5, 34)} value={CONTACT.instagram} />
        <Row label="YOUTUBE" a={a} delay={stag(7, 3.5, 34)} value={CONTACT.youtube} />
        <Row label="LINKEDIN" a={a} delay={stag(8, 3.5, 34)} value={CONTACT.linkedin} />
        <Row label="FACEBOOK" a={a} delay={stag(9, 3.5, 34)} value={CONTACT.facebook} />
        <Row label="THREADS" a={a} delay={stag(10, 3.5, 34)} value={CONTACT.threads} />
        <Row label="X" a={a} delay={stag(11, 3.5, 34)} value={CONTACT.x} />
        <Row label="DIRECTIONS" a={a} delay={stag(12, 3.5, 34)} value={CONTACT.directions} />

        <div style={{marginTop: 14, opacity: ramp(f, [dur - 300, dur - 276], [0, 1])}}>
          <div style={{height: 1, backgroundColor: C.line, marginBottom: 14}} />
          <Micro color={C.inkDim} size={14} tracking={2.0}>
            SHOWROOM
          </Micro>
          <Spec
            size={20}
            color={C.inkSoft}
            weight={400}
            tracking={0.2}
            style={{marginTop: 8, lineHeight: 1.44}}
          >
            {CONTACT.address}
          </Spec>
        </div>
      </div>
    </>
  );
};
