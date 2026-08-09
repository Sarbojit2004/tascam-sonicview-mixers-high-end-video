import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, SAFE, Part, accent, accentOnDark} from '../lib/theme';
import {CONTACT, CTA, PARTNER, PARTNER_ROLE, SOCIALS} from '../lib/copy';
import {Body, Display, Kicker, Micro, Rule, Spec} from './Type';
import {ramp, stag} from '../lib/anim';

/**
 * Shivansh Electronics branding, text only.
 *
 * No logo file is ever placed in a reel — not TASCAM's, not Shivansh
 * Electronics', not Dante's. Logos are added by hand afterwards, so the three
 * logo assets in the repository are excluded from the ledger's usable set
 * entirely (see src/lib/images.ts).
 *
 * Shivansh Electronics is always TASCAM's Authorized Partner. The CTA invites
 * a technical consultation; it never mentions price, availability or urgency.
 */

/** Slim contact strip woven through the body of each reel. */
export const ContactStrip: React.FC<{
  part: Part;
  y: number;
  dur: number;
  index?: number;
  delay?: number;
}> = ({part, y, dur, index = 0, delay = 0}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const s = SOCIALS[index % SOCIALS.length];
  const p = Math.min(ramp(f, [delay, delay + 18], [0, 1]), ramp(f, [dur - 16, dur], [1, 0]));
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y + y,
        width: SAFE.w,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: p,
      }}
    >
      <div style={{width: 5, height: 20, backgroundColor: a, borderRadius: 3, flexShrink: 0}} />
      <Micro color={C.inkSoft} size={13} tracking={1.5} style={{whiteSpace: 'nowrap'}}>
        {PARTNER} · {PARTNER_ROLE}
      </Micro>
      <div style={{flex: 1, height: 1, backgroundColor: C.line}} />
      <Micro color={a} size={13} tracking={1.3} style={{whiteSpace: 'nowrap'}}>
        {s.value}
      </Micro>
    </div>
  );
};

/** Corner part-marker — orients the viewer inside the three-part series. */
export const PartMark: React.FC<{part: Part; label: string; dur: number}> = ({
  part,
  label,
  dur,
}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const p = Math.min(ramp(f, [4, 22], [0, 1]), ramp(f, [dur - 14, dur], [1, 0]));
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y + 2,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: p * 0.92,
      }}
    >
      <div style={{width: 26, height: 3, backgroundColor: a}} />
      <Micro color={C.inkDim} size={15} tracking={3.0}>
        {label}
      </Micro>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  delay: number;
  a: string;
  size?: number;
}> = ({label, value, delay, a, size = 21}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 14], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <div style={{width: 128, flexShrink: 0}}>
        <Micro color={C.inkDim} size={14} tracking={2.2}>
          {label}
        </Micro>
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 500,
          fontSize: size,
          letterSpacing: 0.4,
          color: C.ink,
        }}
      >
        {value}
      </div>
      <div style={{flex: 1, height: 1, backgroundColor: C.lineSoft, transform: 'translateY(-4px)'}} />
      <div style={{width: 6, height: 6, borderRadius: 6, backgroundColor: a, opacity: 0.7}} />
    </div>
  );
};

/**
 * The full outro. Every part gets this in full — including Part 3, whose
 * close-of-series line is an ADDITIONAL beat before it, never a replacement.
 */
export const Outro: React.FC<{part: Part; dur: number}> = ({part, dur}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const aDark = accentOnDark(part);
  const head = ramp(f, [6, 30], [0, 1]);

  return (
    <>
      {/* CTA block */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 34,
          width: SAFE.w,
          opacity: head,
          transform: `translateY(${(1 - head) * 16}px)`,
        }}
      >
        <Kicker color={a} size={19} tracking={4.4}>
          {CTA.eyebrow}
        </Kicker>
        <Rule w={104} color={a} thickness={4} style={{marginTop: 14, marginBottom: 20}} />
        <Display size={82} lh={0.90} color={C.ink}>
          {CTA.headline}
        </Display>
        <Body size={25} color={C.inkSoft} lh={1.40} style={{marginTop: 20, maxWidth: 850}}>
          {CTA.body}
        </Body>
      </div>

      {/* partner identity */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 396,
          width: SAFE.w,
          opacity: ramp(f, [26, 48], [0, 1]),
        }}
      >
        <div
          style={{
            backgroundColor: C.ink,
            borderRadius: 10,
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 44,
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

      {/* contact rows */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 548,
          width: SAFE.w,
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
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
      </div>

      {/* address */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 1156,
          width: SAFE.w,
          opacity: ramp(f, [dur - 230, dur - 206], [0, 1]),
        }}
      >
        <div style={{height: 1, backgroundColor: C.line, marginBottom: 14}} />
        <Micro color={C.inkDim} size={14} tracking={2.0}>
          SHOWROOM
        </Micro>
        <Spec size={19} color={C.inkSoft} weight={400} tracking={0.2} style={{marginTop: 8, lineHeight: 1.42}}>
          {CONTACT.address}
        </Spec>
      </div>
    </>
  );
};
