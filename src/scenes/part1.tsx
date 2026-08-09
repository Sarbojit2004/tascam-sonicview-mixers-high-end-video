import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SAFE, accent} from '../lib/theme';
import {ramp} from '../lib/anim';
import {AmbientMotes, AmbientPhoto, At, Stage} from '../components/Stage';
import {Chip, Display, KineticLine, Kicker, Micro, Rule, Spec, Sub} from '../components/Type';
import {Clip, Grid, Shot, WhipStrip} from '../components/Media';
import {FpgaFlow, PowerFailover} from '../components/Diagram';
import {B, Y} from '../components/Beat';
import {Cue, TickRun} from '../components/Cue';
import {ContactStrip, Outro, PartMark} from '../components/Brand';
import {CONTINUITY} from '../lib/copy';

/**
 * PART 1 — "THE HUB"
 *
 * TASCAM Sonicview 16XP, 24XP and the dp power-redundancy axis. This is the
 * largest single share of the ecosystem's narrative weight (the brief's hub +
 * dp allocations combined), so it carries 74 of the 131 coverage-relevant
 * assets: 72 stills plus both repository video clips, played at natural speed.
 *
 * The dp variants are deliberately NOT given a separate, equally-weighted
 * treatment. Per the brief they are a power-architecture axis layered onto the
 * console decision, so they arrive as one dense scene late in the reel rather
 * than as a fifth and sixth product.
 *
 * Every specification on screen is drawn from the brief's verified master
 * table. Nothing marked UNVERIFIED there is stated as a specific claim, and no
 * price, competitor or distributor language appears anywhere.
 */

const P = 1 as const;
const A = accent(P);

// ===========================================================================
// S01 — Hook: the hub premise                                          190f
// assets: 51, 98, 84
// ===========================================================================
export const P1S01: React.FC = () => {
  return (
    <Stage part={P}>
      <AmbientPhoto id={51} opacity={0.26} blur={48} />
      <AmbientMotes part={P} opacity={0.55} />
      <PartMark part={P} label={CONTINUITY[1].kicker} dur={190} />

      <B from={0} to={104} fade={13}>
        <At y={Y.kicker}>
          <Kicker color={A} size={19} tracking={4.6}>
            TASCAM SONICVIEW ECOSYSTEM
          </Kicker>
        </At>
        <At y={Y.head} w={SAFE.w}>
          <KineticLine
            text={'A CONSOLE IS NOT THE SYSTEM.'}
            size={96}
            per={2.8}
            delay={6}
            highlight={[{word: 5, color: A}]}
          />
        </At>
        <Shot id={51} box={{x: 0, y: 396, w: SAFE.w, h: 468}} dur={116} kb={{z: [1.04, 1.12]}} />
        <At y={904}>
          <Sub size={30} color={C.inkSoft} style={{maxWidth: 862}}>
            {'It is the computational hub a whole facility is built around.'}
          </Sub>
        </At>
        <At y={Y.spec + 26}>
          <Spec size={23} color={C.inkDim}>
            44 INPUT CHANNELS · 22 OUTPUT BUSES · 96 kHz
          </Spec>
        </At>
      </B>

      <B from={100} to={190} fade={13}>
        <At y={Y.kicker}>
          <Kicker color={C.inkDim} size={19} tracking={4.6}>
            MODULAR · PROTOCOL-AGNOSTIC
          </Kicker>
        </At>
        <At y={Y.head} w={SAFE.w}>
          <KineticLine
            text={'IT IS THE HUB.'}
            size={112}
            per={3.4}
            delay={104}
            highlight={[{word: 3, color: A}]}
          />
        </At>
        <Shot id={98} box={{x: 0, y: 320, w: SAFE.w, h: 500}} dur={102} kb={{z: [1.05, 1.13]}} />
        <Shot
          id={84}
          box={{x: 0, y: 848, w: 452, h: 262}}
          dur={102}
          kb={{z: [1.03, 1.12]}}
          plate={false}
          bg={C.screen}
        />
        <At x={484} y={848} w={452} h={262}>
          <div
            style={{
              height: '100%',
              backgroundColor: C.paperHi,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: '26px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Micro color={A} size={15}>
              ARCHITECTURE
            </Micro>
            <Spec size={26} color={C.ink} weight={500} tracking={0.4}>
              {'One processing core.\nEvery I/O layer around it.'}
            </Spec>
          </div>
        </At>
      </B>

      <ContactStrip part={P} y={Y.strip} dur={190} index={0} delay={130} />
      <Cue name="impact-deep" at={2} volume={0.72} />
      <Cue name="swell" at={4} volume={0.5} />
      <Cue name="whoosh-air" at={96} volume={0.46} />
      <Cue name="impact-mid" at={104} volume={0.56} />
      <TickRun from={20} count={10} every={8} volume={0.22} />
    </Stage>
  );
};

// ===========================================================================
// S02 — Sonicview 16XP                                                 225f
// assets: 59, 60, 61, 62, 65, 66, 67, 68
// ===========================================================================
export const P1S02: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={62} opacity={0.24} blur={46} />
    <PartMark part={P} label="THE HUB · COMPACT FORMAT" dur={225} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        TASCAM SONICVIEW 16XP
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'FLAGSHIP ENGINE.\nCOMPACT FOOTPRINT.'}
      </Display>
    </At>
    <At y={318}>
      <Rule w={104} color={A} thickness={4} />
    </At>

    <B from={0} to={124} fade={13}>
      <Shot id={59} box={{x: 0, y: 356, w: SAFE.w, h: 470}} dur={136} kb={{z: [1.04, 1.13]}} />
      <At y={848}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 880}}>
          {'Built for space-constrained broadcast booths, OB vans and\nsmall-to-medium installed rooms — with nothing removed.'}
        </Sub>
      </At>
    </B>

    <B from={118} to={225} fade={13}>
      <Grid
        ids={[60, 62, 66, 67]}
        dur={112}
        cols={2}
        box={{x: 0, y: 356, w: SAFE.w, h: 470}}
        gap={14}
        delay={120}
        stagger={5}
      />
      <At y={848}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={C.ink}>16 MIC/LINE IN</Chip>
          <Chip bg={C.ink}>16+1 MOTORIZED</Chip>
          <Chip bg={A}>2 × 7&quot; VIEW</Chip>
          <Chip bg={C.ink}>2 EXPANSION SLOTS</Chip>
        </div>
      </At>
    </B>

    <WhipStrip ids={[61, 65, 68]} y={958} h={196} itemW={292} speed={1.5} opacity={0.96} />

    <At y={1186}>
      <Spec size={22} color={C.inkDim}>
        472.0 × 228.1 × 554.4 mm · 13.0 kg
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={225} index={1} delay={18} />
    <Cue name="whoosh-rev" at={0} volume={0.4} />
    <Cue name="impact-mid" at={8} volume={0.5} />
    <Cue name="fader-snap" at={14} volume={0.44} />
    <Cue name="whoosh-air" at={116} volume={0.42} />
    <TickRun from={124} count={5} every={11} volume={0.26} hi />
  </Stage>
);

// ===========================================================================
// S03 — VIEW touchscreen system                                        250f
// assets: 88, 1, 2, 3, 70, 71, 78, 79, 80, 83, 89  + video 133
// ===========================================================================
export const P1S03: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={3} opacity={0.22} blur={50} />
    <PartMark part={P} label="THE HUB · TACTILE CONTROL" dur={250} />

    <B from={0} to={110} fade={13}>
      <At y={Y.kicker}>
        <Kicker color={A} size={19} tracking={4.6}>
          VISUAL INTERACTIVE ERGONOMIC WORKFLOW
        </Kicker>
      </At>
      <At y={Y.head} w={SAFE.w}>
        <Display size={98} lh={0.88}>
          {'SEE THE WHOLE\nMIX AT ONCE.'}
        </Display>
      </At>
      <Shot
        id={88}
        box={{x: 0, y: 356, w: 440, h: 190}}
        dur={122}
        fit="contain"
        pad={26}
        kb={{z: [1, 1]}}
      />
      <At x={470} y={356} w={466} h={190}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: '22px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Micro color={A} size={14}>
            NO MENU-DIVING
          </Micro>
          <Spec size={23} color={C.ink} weight={500} tracking={0.3}>
            {'Analog-style immediacy,\nrendered digitally.'}
          </Spec>
        </div>
      </At>
      {/* the repository's 16XP clip: a lateral macro track across the fader
          bank and scribble strips, played at natural speed, untrimmed in time */}
      <Clip id={133} box={{x: 0, y: 578, w: SAFE.w, h: 300}} radius={14} />
      <At y={904}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 880}}>
          {'Motorized faders recall a snapshot instantly — position, not just level.'}
        </Sub>
      </At>
    </B>

    <B from={104} to={250} fade={13}>
      <At y={Y.kicker}>
        <Kicker color={C.inkDim} size={19} tracking={4.6}>
          THE VIEW INTERFACE
        </Kicker>
      </At>
      <At y={Y.head} w={SAFE.w}>
        <Display size={88} lh={0.88}>
          {'EVERY LAYER,\nONE GLANCE.'}
        </Display>
      </At>
      <Grid
        ids={[79, 80, 83, 1, 2, 3]}
        dur={146}
        cols={2}
        box={{x: 0, y: 328, w: SAFE.w, h: 560}}
        gap={12}
        fit="cover"
        delay={108}
        stagger={4}
        bg={C.screen}
      />
      <At y={916}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={A}>OVERVIEW</Chip>
          <Chip bg={C.ink}>EQ</Chip>
          <Chip bg={C.ink}>DYNAMICS</Chip>
          <Chip bg={C.ink}>MONITOR / TALKBACK</Chip>
        </div>
      </At>
      <WhipStrip ids={[70, 71, 78, 89]} y={986} h={182} itemW={278} speed={1.9} reverse />
    </B>

    <ContactStrip part={P} y={Y.strip} dur={250} index={2} delay={190} />
    <Cue name="whoosh-air" at={0} volume={0.4} />
    <Cue name="fader-snap" at={60} volume={0.5} />
    <Cue name="fader-snap" at={74} volume={0.38} />
    <Cue name="whoosh-rev" at={96} volume={0.42} />
    <Cue name="impact-soft" at={106} volume={0.46} />
    <TickRun from={112} count={12} every={9} volume={0.24} hi />
    <Cue name="click-ui" at={150} volume={0.4} />
  </Stage>
);

// ===========================================================================
// S04 — FPGA engine & latency                                          245f
// assets: 13, 76, 48, 11
// ===========================================================================
export const P1S04: React.FC = () => (
  <Stage part={P} wash={0.86}>
    <AmbientPhoto id={76} opacity={0.20} blur={52} />
    <PartMark part={P} label="THE HUB · PROCESSING CORE" dur={245} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        54-BIT FLOAT-POINT FPGA MIXING ENGINE
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'LATENCY YOU\nCANNOT HEAR.'}
      </Display>
    </At>

    <B from={0} to={132} fade={13}>
      {/* the brief's FPGA / latency graphic: signal through a processor,
          annotated with the verified figures */}
      <At x={0} y={330} w={SAFE.w} h={330}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <FpgaFlow w={SAFE.w} h={330} part={P} delay={8} />
        </div>
      </At>
      <At y={688}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 880}}>
          {'A field-programmable gate array routes in parallel, in hardware —\nso the mix path never queues behind a general-purpose CPU.'}
        </Sub>
      </At>
      <Grid
        ids={[76, 48]}
        dur={144}
        cols={2}
        box={{x: 0, y: 806, w: SAFE.w, h: 268}}
        gap={14}
        delay={44}
      />
    </B>

    <B from={126} to={245} fade={13}>
      <Shot id={13} box={{x: 0, y: 330, w: SAFE.w, h: 452}} dur={125} fit="contain" pad={20} kb={{z: [1, 1]}} />
      <At y={806} w={452}>
        <Micro color={A} size={15}>
          ANALOG-TO-ANALOG
        </Micro>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8}}>
          <Display size={104} lh={0.86} color={C.ink}>
            0.51
          </Display>
          <Display size={38} lh={1} color={A}>
            MS
          </Display>
        </div>
      </At>
      <Shot id={11} box={{x: 484, y: 800, w: 452, h: 268}} dur={125} fit="contain" pad={12} kb={{z: [1, 1]}} />
    </B>

    <At y={Y.spec + 90}>
      <Spec size={22} color={C.inkDim}>
        96 kHz PROCESSING · 54-BIT FLOAT SUMMING
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={245} index={3} delay={20} />
    <Cue name="data-sweep" at={4} volume={0.5} />
    <Cue name="sub-drop" at={10} volume={0.42} />
    <TickRun from={30} count={14} every={7} volume={0.30} hi />
    <Cue name="whoosh-air" at={122} volume={0.4} />
    <Cue name="impact-soft" at={130} volume={0.44} />
  </Stage>
);

// ===========================================================================
// S05 — Class 1 HDIA preamps                                           195f
// assets: 81, 8, 9, 10, 82, 87
// ===========================================================================
export const P1S05: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={87} opacity={0.24} blur={46} />
    <PartMark part={P} label="THE HUB · INPUT STAGE" dur={195} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        CLASS 1 HDIA MICROPHONE PREAMPS
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'THE QUIET\nFRONT END.'}
      </Display>
    </At>

    <B from={0} to={100} fade={12}>
      <Shot id={81} box={{x: 0, y: 336, w: 452, h: 268}} dur={112} fit="contain" pad={26} kb={{z: [1, 1]}} />
      <Shot id={82} box={{x: 484, y: 336, w: 452, h: 268}} dur={112} kb={{z: [1.05, 1.15]}} />
      <At y={634}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 880}}>
          {'High-Definition Instrumentation Architecture: gain taken cleanly at\nthe source, before anything downstream can add to it.'}
        </Sub>
      </At>
      <Shot id={87} box={{x: 0, y: 762, w: SAFE.w, h: 300}} dur={112} kb={{z: [1.05, 1.14]}} />
    </B>

    <B from={94} to={195} fade={12}>
      <Grid
        ids={[8, 9, 10]}
        dur={107}
        cols={3}
        box={{x: 0, y: 336, w: SAFE.w, h: 300}}
        gap={12}
        fit="contain"
        pad={10}
        delay={98}
        stagger={5}
      />
      <At y={666}>
        <Micro color={A} size={15}>
          EQUIVALENT INPUT NOISE
        </Micro>
        <Sub size={27} color={C.inkSoft} style={{maxWidth: 880, marginTop: 10}}>
          {'Measured noise floor across the audio band — the reason the same\npreamp design is used everywhere the signal first enters the system.'}
        </Sub>
      </At>
      <Shot id={87} box={{x: 0, y: 828, w: SAFE.w, h: 234}} dur={107} kb={{z: [1.08, 1.16]}} opacity={0.96} />
    </B>

    <ContactStrip part={P} y={Y.strip} dur={195} index={4} delay={150} />
    <Cue name="swell" at={2} volume={0.42} />
    <Cue name="impact-soft" at={6} volume={0.4} />
    <Cue name="whoosh-rev" at={86} volume={0.38} />
    <TickRun from={98} count={8} every={10} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S06 — Rear I/O & onboard recording                                   205f
// assets: 64, 92, 25, 95, 85, 74, 69
// ===========================================================================
export const P1S06: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={64} opacity={0.22} blur={48} />
    <PartMark part={P} label="THE HUB · CONNECTIVITY" dur={205} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        REAR PANEL & ONBOARD CAPTURE
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={90} lh={0.88}>
        {'EVERYTHING\nTERMINATES HERE.'}
      </Display>
    </At>

    <B from={0} to={112} fade={12}>
      <Shot id={64} box={{x: 0, y: 346, w: SAFE.w, h: 268}} dur={124} fit="contain" pad={14} kb={{z: [1, 1]}} />
      <Shot id={25} box={{x: 0, y: 630, w: 452, h: 232}} dur={124} fit="contain" pad={12} kb={{z: [1, 1]}} />
      <Shot id={92} box={{x: 484, y: 630, w: 452, h: 232}} dur={124} fit="contain" pad={12} kb={{z: [1, 1]}} />
      <At y={890}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={A}>BUILT-IN 64×64 DANTE</Chip>
          <Chip bg={C.ink}>AES67</Chip>
          <Chip bg={C.ink}>SMPTE ST 2110 INTEROP</Chip>
        </div>
      </At>
    </B>

    <B from={106} to={205} fade={12}>
      <Shot id={95} box={{x: 0, y: 346, w: 452, h: 300}} dur={105} kb={{z: [1.04, 1.12]}} />
      <Shot id={85} box={{x: 484, y: 346, w: 452, h: 300}} dur={105} fit="contain" pad={16} kb={{z: [1, 1]}} />
      <At y={672}>
        <Micro color={A} size={15}>
          32-TRACK SDXC RECORDING
        </Micro>
        <Sub size={27} color={C.inkSoft} style={{maxWidth: 880, marginTop: 10}}>
          {'A pre-installed IF-MTR32 card captures the show to card while it\nhappens — and a 32-in / 32-out USB interface feeds the DAW.'}
        </Sub>
      </At>
      <Grid ids={[74, 69]} dur={99} cols={2} box={{x: 0, y: 812, w: SAFE.w, h: 250}} gap={14} delay={110} />
    </B>

    <At y={Y.spec + 84}>
      <Spec size={22} color={C.inkDim}>
        32-IN / 32-OUT USB · 32-BIT / 96 kHz
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={205} index={5} delay={24} />
    <Cue name="whoosh-air" at={0} volume={0.38} />
    <Cue name="click-ui" at={40} volume={0.4} />
    <Cue name="whoosh-rev" at={98} volume={0.38} />
    <Cue name="impact-soft" at={108} volume={0.42} />
    <TickRun from={116} count={9} every={9} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S07 — Sonicview 24XP, scale                                          240f
// assets: 110, 109, 113, 108  + video 134
// ===========================================================================
export const P1S07: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={110} opacity={0.26} blur={46} />
    <PartMark part={P} label="THE HUB · LARGE FORMAT" dur={240} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        TASCAM SONICVIEW 24XP
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <KineticLine
        text={'SAME ENGINE. MORE SURFACE.'}
        size={92}
        per={3.0}
        delay={8}
        highlight={[{word: 3, color: A}]}
      />
    </At>

    <B from={0} to={126} fade={13}>
      <Shot id={110} box={{x: 0, y: 356, w: SAFE.w, h: 470}} dur={138} kb={{z: [1.04, 1.12]}} />
      <At y={854}>
        <Sub size={29} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Three screens and twenty-four faders exist to cut cognitive load —\noutputs on one screen while inputs stay under your hands.'}
        </Sub>
      </At>
      <At y={Y.spec + 12}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={C.ink}>24 MIC/LINE IN</Chip>
          <Chip bg={C.ink}>24+1 MOTORIZED</Chip>
          <Chip bg={A}>3 × 7&quot; VIEW</Chip>
        </div>
      </At>
    </B>

    <B from={120} to={240} fade={13}>
      {/* the repository's 24XP clip: a tracking move across the illuminated
          surface, natural speed */}
      <Clip id={134} box={{x: 0, y: 340, w: SAFE.w, h: 330}} radius={14} />
      <Grid ids={[109, 113, 108]} dur={120} cols={3} box={{x: 0, y: 700, w: SAFE.w, h: 236}} gap={12} delay={124} stagger={5} />
      <At y={964}>
        <Spec size={24} color={C.inkSoft}>
          690.8 × 228.1 × 554.4 mm · 18.0 kg
        </Spec>
        <Spec size={22} color={C.inkDim} style={{marginTop: 10}}>
          IDENTICAL 44-CHANNEL ARCHITECTURE · 0.51 ms
        </Spec>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={240} index={6} delay={192} />
    <Cue name="riser" at={0} volume={0.34} />
    <Cue name="impact-deep" at={26} volume={0.6} />
    <Cue name="fader-snap" at={34} volume={0.4} />
    <Cue name="whoosh-air" at={112} volume={0.44} />
    <TickRun from={128} count={10} every={10} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S08 — 24XP control surface                                           195f
// assets: 114, 115, 116, 112, 121, 26, 111, 117
// ===========================================================================
export const P1S08: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={112} opacity={0.24} blur={46} />
    <PartMark part={P} label="THE HUB · SURFACE & REAR" dur={195} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        IMMEDIATE TACTILE ACCESS
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={90} lh={0.88}>
        {'REACH, NOT\nNAVIGATE.'}
      </Display>
    </At>

    <B from={0} to={102} fade={12}>
      <Grid ids={[114, 115, 116, 112]} dur={114} cols={2} box={{x: 0, y: 344, w: SAFE.w, h: 512}} gap={13} delay={4} stagger={5} />
      <At y={884}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 880}}>
          {'Three banks of eight, plus a motorized stereo main — every fader\nsnaps to its stored position the instant a scene is recalled.'}
        </Sub>
      </At>
    </B>

    <B from={96} to={195} fade={12}>
      <Shot id={121} box={{x: 0, y: 344, w: 452, h: 300}} dur={99} kb={{z: [1.04, 1.13]}} />
      <Shot id={26} box={{x: 484, y: 344, w: 452, h: 300}} dur={99} fit="contain" pad={12} kb={{z: [1, 1]}} />
      <Shot id={111} box={{x: 0, y: 664, w: SAFE.w, h: 210}} dur={99} fit="contain" pad={10} kb={{z: [1, 1]}} />
      <Shot id={117} box={{x: 0, y: 892, w: SAFE.w, h: 196}} dur={99} fit="contain" pad={10} kb={{z: [1, 1]}} />
    </B>

    <ContactStrip part={P} y={Y.strip} dur={195} index={7} delay={16} />
    <Cue name="fader-snap" at={10} volume={0.5} />
    <Cue name="fader-snap" at={22} volume={0.4} />
    <Cue name="fader-snap" at={31} volume={0.32} />
    <Cue name="whoosh-rev" at={88} volume={0.38} />
    <Cue name="impact-soft" at={98} volume={0.42} />
    <TickRun from={104} count={8} every={10} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S09 — dp power-redundancy axis                                       275f
// assets: 52, 53, 54, 55, 56, 57, 58, 103, 104, 105, 106, 107, 122, 123
// ===========================================================================
export const P1S09: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={123} opacity={0.24} blur={48} />
    <PartMark part={P} label="THE HUB · POWER ARCHITECTURE" dur={275} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        SONICVIEW 16dp · SONICVIEW 24dp
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={90} lh={0.88}>
        {'NOT A BIGGER DESK.\nA SECOND SUPPLY.'}
      </Display>
    </At>

    <B from={0} to={118} fade={13}>
      {/* the brief's power-failover graphic: AC drops out, DC takes the load,
          the console never restarts */}
      <At x={0} y={336} w={SAFE.w} h={310}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <PowerFailover w={SAFE.w} h={310} failAt={54} delay={10} />
        </div>
      </At>
      <At y={676}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'A dp console is an XP console with a redundant DC input. If the\nprimary supply drops, the secondary carries the load — no reboot.'}
        </Sub>
      </At>
      <Grid ids={[52, 123]} dur={130} cols={2} box={{x: 0, y: 800, w: SAFE.w, h: 262}} gap={14} delay={40} />
    </B>

    <B from={112} to={200} fade={13}>
      <Grid ids={[53, 54, 55, 56]} dur={88} cols={2} box={{x: 0, y: 336, w: SAFE.w, h: 512}} gap={13} delay={116} stagger={4} />
      <At y={876}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={A}>AC + REDUNDANT DC</Chip>
          <Chip bg={C.ink}>PS-P2450 ADAPTER INCLUDED</Chip>
        </div>
      </At>
      <At y={946}>
        <Spec size={23} color={C.inkSoft}>
          IDENTICAL ENGINE · IDENTICAL SURFACE · IDENTICAL I/O
        </Spec>
      </At>
    </B>

    <B from={194} to={275} fade={13}>
      <At y={336}>
        <Micro color={A} size={15}>
          THE FULL dp AXIS
        </Micro>
        <Sub size={27} color={C.inkSoft} style={{maxWidth: 884, marginTop: 10}}>
          {'Both formats, both power architectures — chosen independently of\neach other, because scale and risk are separate decisions.'}
        </Sub>
      </At>
      <Grid
        ids={[57, 58, 103, 104, 105, 106, 107, 122]}
        dur={81}
        cols={4}
        box={{x: 0, y: 452, w: SAFE.w, h: 460}}
        gap={11}
        delay={198}
        stagger={3}
        radius={10}
      />
      <At y={944}>
        <Spec size={22} color={C.inkDim}>
          16dp · 24dp · ZERO-DOWNTIME ENVIRONMENTS
        </Spec>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={275} index={0} delay={230} />
    <Cue name="sub-drop" at={4} volume={0.4} />
    <Cue name="relay" at={64} volume={0.72} />
    <Cue name="impact-deep" at={66} volume={0.5} />
    <Cue name="whoosh-air" at={106} volume={0.42} />
    <Cue name="whoosh-rev" at={188} volume={0.4} />
    <Cue name="impact-mid" at={196} volume={0.46} />
    <TickRun from={202} count={14} every={5} volume={0.26} hi />
  </Stage>
);

// ===========================================================================
// S10 — Replacing the fixed desk                                       165f
// assets: 91, 93, 94, 119, 120
// ===========================================================================
export const P1S10: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={94} opacity={0.20} blur={50} />
    <PartMark part={P} label="THE HUB · MIGRATION" dur={165} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        REPLACING A FIXED-ARCHITECTURE DESK
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={88} lh={0.88}>
        {'SAME ROOM.\nNEW ROUTING.'}
      </Display>
    </At>

    <B from={0} to={92} fade={12}>
      <Grid ids={[91, 94]} dur={104} cols={1} box={{x: 0, y: 340, w: SAFE.w, h: 640}} gap={14} fit="contain" pad={12} delay={4} stagger={6} />
    </B>

    <B from={86} to={165} fade={12}>
      <Grid ids={[93, 119, 120]} dur={79} cols={1} box={{x: 0, y: 340, w: SAFE.w, h: 640}} gap={12} fit="contain" pad={10} delay={90} stagger={5} />
    </B>

    <At y={1010}>
      <Sub size={27} color={C.inkSoft} style={{maxWidth: 884}}>
        {'The analog channel strip a room was wired around becomes a\nrecallable scene — without re-pulling the room.'}
      </Sub>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={165} index={1} delay={18} />
    <Cue name="whoosh-air" at={0} volume={0.38} />
    <Cue name="click-ui" at={30} volume={0.36} />
    <Cue name="whoosh-rev" at={80} volume={0.36} />
    <Cue name="impact-soft" at={88} volume={0.4} />
  </Stage>
);

// ===========================================================================
// S11 — Continuation into Part 2                                       115f
// assets: 63, 124
// ===========================================================================
export const P1S11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage part={P}>
      <AmbientPhoto id={63} opacity={0.24} blur={48} />
      <AmbientMotes part={P} opacity={0.5} />
      <PartMark part={P} label={CONTINUITY[1].kicker} dur={115} />

      <Grid ids={[63, 124]} dur={115} cols={1} box={{x: 0, y: 128, w: SAFE.w, h: 690}} gap={16} fit="contain" pad={8} delay={2} stagger={6} />

      <At y={856} w={SAFE.w}>
        <Rule w={104} color={A} thickness={4} />
        <Display size={86} lh={0.90} style={{marginTop: 24, opacity: ramp(f, [10, 32], [0, 1])}}>
          {CONTINUITY[1].line}
        </Display>
        <Sub
          size={33}
          italic={false}
          color={A}
          style={{marginTop: 18, opacity: ramp(f, [34, 58], [0, 1])}}
        >
          {CONTINUITY[1].next}
        </Sub>
        <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 46, height: 2, backgroundColor: C.line}} />
          <Micro color={C.inkDim} size={15}>
            PART 2 · THE NETWORK
          </Micro>
        </div>
      </At>

      <ContactStrip part={P} y={Y.strip} dur={115} index={2} delay={40} />
      <Cue name="impact-mid" at={4} volume={0.5} />
      <Cue name="shimmer" at={30} volume={0.4} />
      <Cue name="riser" at={64} volume={0.3} />
    </Stage>
  );
};

// ===========================================================================
// S12 — CTA & Shivansh Electronics outro                               340f
// ===========================================================================
export const P1S12: React.FC = () => (
  <Stage part={P} wash={1}>
    <AmbientPhoto id={98} opacity={0.16} blur={56} />
    <AmbientMotes part={P} opacity={0.45} />
    <Outro part={P} dur={340} />
    <Cue name="impact-deep" at={2} volume={0.56} />
    <Cue name="swell" at={6} volume={0.44} />
    <Cue name="shimmer" at={40} volume={0.34} />
    <TickRun from={46} count={12} every={5} volume={0.18} />
    <Cue name="chime-final" at={286} volume={0.5} />
  </Stage>
);
