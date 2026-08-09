import React from 'react';
import {C, F, LF_SAFE, LFPart, lfAccent, lfAccentOnDark} from './lib/lf-theme';
import {At, LFBackdrop, LFStage} from './components/lf/LFStage';
import {Chip, Display, Kicker, Micro, Rule, Spec, Sub} from './components/Type';
import {Mosaic, Plate} from './components/lf/LFMedia';
import {Logo} from './components/lf/Logo';
import {CONTACT, PARTNER, PARTNER_ROLE} from './lib/copy';
import {loadFonts} from './lib/fonts';

/**
 * Landscape thumbnails, 1920x1080, one per long-form part.
 *
 * Unlike the reel thumbnails these DO carry logos — TASCAM and Shivansh
 * Electronics on all three, and Dante only where that part's topic genuinely
 * involves Dante as a subject (Part 2 substantively; Part 3 for the IF-DA64;
 * Part 1 not at all, since Dante is only mentioned in passing there).
 *
 * Every mark is drawn directly on the light background — no box, card or plate.
 * No pricing anywhere. The CTA is the technical-consultation framing.
 */

const CtaStrip: React.FC<{part: LFPart}> = ({part}) => {
  const a = lfAccent(part);
  const aDark = lfAccentOnDark(part);
  return (
    <At x={0} y={LF_SAFE.h - 150} w={LF_SAFE.w} h={150}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, height: '100%'}}>
        <div
          style={{
            backgroundColor: C.ink,
            borderRadius: 12,
            padding: '18px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          <Micro color={aDark} size={15} tracking={3.6}>
            TECHNICAL CONSULTATION
          </Micro>
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: -0.2,
              lineHeight: 1,
              color: C.paperHi,
              textTransform: 'uppercase',
            }}
          >
            {PARTNER}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <Micro color={C.inkDim} size={16} tracking={2.6}>
            {PARTNER_ROLE.toUpperCase()}
          </Micro>
          <Spec size={26} color={C.ink} weight={500} tracking={0.4}>
            {CONTACT.website}
          </Spec>
        </div>
        <div style={{flex: 1, height: 3, backgroundColor: a, opacity: 0.55}} />
      </div>
    </At>
  );
};

const Head: React.FC<{part: LFPart; n: string; title: string; sub: string; w?: number}> = ({
  part,
  n,
  title,
  sub,
  w = 900,
}) => {
  const a = lfAccent(part);
  return (
    <>
      <At x={0} y={0} w={w}>
        <Kicker color={C.inkDim} size={19} tracking={4.2}>
          TASCAM SONICVIEW ECOSYSTEM · PART {n} OF 3
        </Kicker>
      </At>
      <At x={0} y={44} w={w}>
        <Display size={104} lh={0.88} tracking={-1.2}>
          {title}
        </Display>
      </At>
      <At x={0} y={44 + 104 * 0.94 * title.split('\n').length + 22} w={w}>
        <Rule w={128} color={a} thickness={5} />
      </At>
      <At x={0} y={44 + 104 * 0.94 * title.split('\n').length + 58} w={w}>
        <Sub size={30} color={C.inkSoft} italic={false} weight={500}>
          {sub}
        </Sub>
      </At>
    </>
  );
};

// ---------------------------------------------------------------------------
export const LongformThumb1: React.FC = () => {
  loadFonts();
  const a = lfAccent(1);
  return (
    <LFStage part={1} rails={false}>
      <LFBackdrop id={110} opacity={0.20} blur={56} />

      {/* marks, directly on the background */}
      <Logo brand="tascam" h={46} x={0} y={0} align="right" />
      <Logo brand="shivansh" h={58} x={0} y={72} align="right" />

      <Head
        part={1}
        n="1"
        title={'THE HUB'}
        sub={'Sonicview 16XP · 24XP — and the dp power-redundancy axis.'}
        w={860}
      />

      <Plate id={110} box={{x: 0, y: 300, w: 1080, h: 470}} dur={1} pad={20} kb={{z: [1, 1]}} />
      <Mosaic
        ids={[59, 123]}
        dur={1}
        cols={1}
        box={{x: 1116, y: 300, w: LF_SAFE.w - 1116, h: 470}}
        gap={16}
        delay={-100}
        stagger={0}
        pad={12}
      />

      <At x={1116} y={0} w={LF_SAFE.w - 1116}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 150}}>
          <Chip bg={C.ink} size={17}>
            54-BIT FPGA
          </Chip>
          <Chip bg={a} size={17}>
            0.51 MS
          </Chip>
          <Chip bg={C.ink} size={17}>
            64×64 DANTE
          </Chip>
        </div>
      </At>

      <CtaStrip part={1} />
    </LFStage>
  );
};

// ---------------------------------------------------------------------------
export const LongformThumb2: React.FC = () => {
  loadFonts();
  const a = lfAccent(2);
  return (
    <LFStage part={2} rails={false}>
      <LFBackdrop id={35} opacity={0.20} blur={56} />

      <Logo brand="tascam" h={46} x={0} y={0} align="right" />
      <Logo brand="shivansh" h={58} x={0} y={72} align="right" />
      {/* Dante belongs on THIS thumbnail — Part 2's whole subject is Dante */}
      <Logo brand="dante" h={40} x={0} y={162} align="right" />

      <Head
        part={2}
        n="2"
        title={'THE NETWORK'}
        sub={'TASCAM SB-16D Dante stagebox — the stage, one cable away.'}
        w={900}
      />

      <Plate id={35} box={{x: 0, y: 300, w: 1080, h: 470}} dur={1} pad={20} kb={{z: [1, 1]}} />
      <Mosaic
        ids={[41, 49]}
        dur={1}
        cols={1}
        box={{x: 1116, y: 300, w: LF_SAFE.w - 1116, h: 470}}
        gap={16}
        delay={-100}
        stagger={0}
        pad={12}
      />

      <At x={1116} y={0} w={LF_SAFE.w - 1116}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 226}}>
          <Chip bg={C.ink} size={17}>
            16 IN / 16 OUT
          </Chip>
          <Chip bg={a} size={17}>
            CLASS 1 HDIA
          </Chip>
        </div>
      </At>

      <CtaStrip part={2} />
    </LFStage>
  );
};

// ---------------------------------------------------------------------------
export const LongformThumb3: React.FC = () => {
  loadFonts();
  const a = lfAccent(3);
  return (
    <LFStage part={3} rails={false}>
      <LFBackdrop id={30} opacity={0.18} blur={56} />

      <Logo brand="tascam" h={46} x={0} y={0} align="right" />
      <Logo brand="shivansh" h={58} x={0} y={72} align="right" />
      {/* Dante earns its place here only because the IF-DA64 adds Dante capacity */}
      <Logo brand="dante" h={40} x={0} y={162} align="right" />

      <Head
        part={3}
        n="3"
        title={'THE PROTOCOL\nLAYER'}
        sub={'IF-Series expansion cards — the console adapts to the facility.'}
        w={980}
      />

      <Mosaic
        ids={[24, 16, 18, 22, 20]}
        dur={1}
        cols={5}
        box={{x: 0, y: 452, w: LF_SAFE.w, h: 340}}
        gap={16}
        delay={-100}
        stagger={0}
        pad={12}
      />

      <At x={1040} y={92} w={LF_SAFE.w - 1040}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 170}}>
          <Chip bg={a} size={17}>
            SMPTE ST 2110
          </Chip>
          <Chip bg={C.ink} size={17}>
            AES/EBU
          </Chip>
          <Chip bg={C.ink} size={17}>
            MADI
          </Chip>
          <Chip bg={C.ink} size={17}>
            ANALOG
          </Chip>
          <Chip bg={C.ink} size={17}>
            +64 DANTE
          </Chip>
        </div>
      </At>

      <CtaStrip part={3} />
    </LFStage>
  );
};
