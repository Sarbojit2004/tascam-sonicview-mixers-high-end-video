import React from 'react';
import {C, Part, SAFE, accent, accentOnDark} from './lib/theme';
import {AmbientPhoto, At, Stage} from './components/Stage';
import {Chip, Display, Kicker, Micro, Rule, Spec, Sub} from './components/Type';
import {Grid, Shot} from './components/Media';
import {CONTACT, PARTNER, PARTNER_ROLE} from './lib/copy';
import {loadFonts} from './lib/fonts';

/**
 * Portrait thumbnails, one per part. 1080x1920 to match the reels, same light
 * palette, same ported type system, same safe-zone contract.
 *
 * Same hard exclusions as the reels: no TASCAM logo, no Shivansh Electronics
 * logo, no Dante logo, and no pricing of any kind. The call to action is the
 * technical-consultation framing, never a purchase prompt.
 */

const CtaBlock: React.FC<{part: Part}> = ({part}) => {
  const a = accent(part);
  const aDark = accentOnDark(part);
  return (
    <At x={0} y={1074} w={SAFE.w} h={256}>
      <div
        style={{
          height: '100%',
          backgroundColor: C.ink,
          borderRadius: 14,
          padding: '26px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <Micro color={aDark} size={17} tracking={4.0}>
          TECHNICAL CONSULTATION
        </Micro>
        <div
          style={{
            fontFamily: '"BarlowCondensed", sans-serif',
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 0.94,
            letterSpacing: -0.2,
            color: C.paperHi,
            textTransform: 'uppercase',
          }}
        >
          {PARTNER}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 40, height: 3, backgroundColor: a, flexShrink: 0}} />
          <Micro color={C.paperDeep} size={16} tracking={2.4} style={{whiteSpace: 'nowrap'}}>
            {PARTNER_ROLE}
          </Micro>
        </div>
        <Spec size={21} color={C.paperHi} weight={500} tracking={0.6} style={{marginTop: 2}}>
          {CONTACT.website}
        </Spec>
      </div>
    </At>
  );
};

// ---------------------------------------------------------------------------
export const Thumb1: React.FC = () => {
  loadFonts();
  const a = accent(1);
  return (
    <Stage part={1}>
      <AmbientPhoto id={110} opacity={0.55} blur={40} />

      <At y={2}>
        <Kicker color={C.inkDim} size={18} tracking={4.2}>
          TASCAM SONICVIEW ECOSYSTEM · PART 1 OF 3
        </Kicker>
      </At>

      <At y={44} w={SAFE.w}>
        <Display size={146} lh={0.84} tracking={-1.5}>
          THE HUB
        </Display>
      </At>
      <At y={200}>
        <Rule w={128} color={a} thickness={5} />
      </At>
      <At y={236} w={SAFE.w}>
        <Sub size={31} color={C.inkSoft} italic={false} weight={500}>
          {'Sonicview 16XP · 24XP — and the dp\npower-redundancy axis.'}
        </Sub>
      </At>

      {/* 24XP hero */}
      <Shot
        id={110}
        box={{x: 0, y: 348, w: SAFE.w, h: 408}}
        dur={1}
        kb={{z: [1.04, 1.04]}}
        radius={14}
      />
      {/* 16XP, second format — contained so the full chassis reads, rather
          than a cover crop that clips the product caption */}
      <Shot
        id={59}
        box={{x: 0, y: 772, w: 452, h: 274}}
        dur={1}
        fit="contain"
        pad={12}
        kb={{z: [1, 1]}}
        radius={12}
      />
      {/* verified figures */}
      <At x={484} y={772} w={452} h={274}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 13,
          }}
        >
          <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
            <Display size={64} lh={0.86} color={C.ink}>
              0.51
            </Display>
            <Display size={26} lh={1} color={a}>
              MS
            </Display>
          </div>
          <Micro color={C.inkDim} size={14} tracking={2.2}>
            ANALOG TO ANALOG
          </Micro>
          <div style={{height: 1, backgroundColor: C.lineSoft}} />
          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <Chip bg={C.ink} size={15}>
              54-BIT FPGA
            </Chip>
            <Chip bg={a} size={15}>
              64×64 DANTE
            </Chip>
          </div>
        </div>
      </At>

      <CtaBlock part={1} />
    </Stage>
  );
};

// ---------------------------------------------------------------------------
export const Thumb2: React.FC = () => {
  loadFonts();
  const a = accent(2);
  return (
    <Stage part={2}>
      <AmbientPhoto id={35} opacity={0.55} blur={40} />

      <At y={2}>
        <Kicker color={C.inkDim} size={18} tracking={4.2}>
          TASCAM SONICVIEW ECOSYSTEM · PART 2 OF 3
        </Kicker>
      </At>

      <At y={44} w={SAFE.w}>
        <Display size={132} lh={0.84} tracking={-1.5}>
          THE NETWORK
        </Display>
      </At>
      <At y={200}>
        <Rule w={128} color={a} thickness={5} />
      </At>
      <At y={236} w={SAFE.w}>
        <Sub size={31} color={C.inkSoft} italic={false} weight={500}>
          {'TASCAM SB-16D Dante stagebox —\nthe stage, one cable away.'}
        </Sub>
      </At>

      <Shot id={35} box={{x: 0, y: 348, w: SAFE.w, h: 408}} dur={1} kb={{z: [1.04, 1.04]}} radius={14} />
      <Shot id={41} box={{x: 0, y: 772, w: 452, h: 274}} dur={1} kb={{z: [1.04, 1.04]}} radius={12} />
      <At x={484} y={772} w={452} h={274}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 13,
          }}
        >
          <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
            <Display size={64} lh={0.86} color={C.ink}>
              64×64
            </Display>
          </div>
          <Micro color={C.inkDim} size={14} tracking={2.2}>
            DANTE, BUILT IN
          </Micro>
          <div style={{height: 1, backgroundColor: C.lineSoft}} />
          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <Chip bg={C.ink} size={15}>
              16 IN / 16 OUT
            </Chip>
            <Chip bg={a} size={15}>
              CLASS 1 HDIA
            </Chip>
          </div>
        </div>
      </At>

      <CtaBlock part={2} />
    </Stage>
  );
};

// ---------------------------------------------------------------------------
export const Thumb3: React.FC = () => {
  loadFonts();
  const a = accent(3);
  return (
    <Stage part={3}>
      <AmbientPhoto id={30} opacity={0.5} blur={40} />

      <At y={2}>
        <Kicker color={C.inkDim} size={18} tracking={4.2}>
          TASCAM SONICVIEW ECOSYSTEM · PART 3 OF 3
        </Kicker>
      </At>

      <At y={44} w={SAFE.w}>
        <Display size={104} lh={0.84} tracking={-1.2}>
          {'THE PROTOCOL\nLAYER'}
        </Display>
      </At>
      <At y={228}>
        <Rule w={128} color={a} thickness={5} />
      </At>
      <At y={264} w={SAFE.w}>
        <Sub size={29} color={C.inkSoft} italic={false} weight={500}>
          {'IF-Series expansion cards — the console\nadapts to the facility.'}
        </Sub>
      </At>

      {/* the five cards the asset set covers, each visually distinct */}
      <Grid
        ids={[24, 16, 18]}
        dur={1}
        cols={3}
        box={{x: 0, y: 372, w: SAFE.w, h: 232}}
        gap={12}
        fit="contain"
        pad={10}
        delay={-100}
        stagger={0}
      />
      <Grid
        ids={[22, 20]}
        dur={1}
        cols={2}
        box={{x: 0, y: 618, w: SAFE.w, h: 232}}
        gap={12}
        fit="contain"
        pad={10}
        delay={-100}
        stagger={0}
      />

      <At x={0} y={868} w={SAFE.w} h={178}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Micro color={C.inkDim} size={14} tracking={2.2}>
            NATIVE PROTOCOL SUPPORT
          </Micro>
          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <Chip bg={a} size={15}>
              SMPTE ST 2110
            </Chip>
            <Chip bg={C.ink} size={15}>
              AES/EBU
            </Chip>
            <Chip bg={C.ink} size={15}>
              MADI
            </Chip>
            <Chip bg={C.ink} size={15}>
              ANALOG
            </Chip>
            <Chip bg={C.ink} size={15}>
              +64 DANTE
            </Chip>
          </div>
        </div>
      </At>

      <CtaBlock part={3} />
    </Stage>
  );
};
