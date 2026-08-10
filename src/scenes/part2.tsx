import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SAFE, accent} from '../lib/theme';
import {ramp} from '../lib/anim';
import {AmbientMotes, AmbientPhoto, At, Stage} from '../components/Stage';
import {Chip, Display, KineticLine, Kicker, Micro, Rule, Spec, Sub} from '../components/Type';
import {Grid, Shot} from '../components/Media';
import {DanteWeb} from '../components/Diagram';
import {B, Y} from '../components/Beat';
import {Cue, TickRun} from '../components/Cue';
import {ContactStrip, Outro, PartMark} from '../components/Brand';
import {CONTINUITY} from '../lib/copy';

/**
 * PART 2 — "THE NETWORK"
 *
 * Dante as the connective technology, the SB-16D stagebox, and the two
 * real-world installations the brief supplies. Carries 30 of the 131
 * coverage-relevant assets.
 *
 * The case studies are treated exactly as the brief's Section 14 requires:
 * proof points woven into the product narrative to validate the workflow, not
 * standalone product sections of their own. The SB-16D is never presented as a
 * mixer — it is a physical extension of the console's I/O.
 */

const P = 2 as const;
const A = accent(P);

// ===========================================================================
// S01 — Hook: hub to stage                                             185f
// assets: 75, 50
// ===========================================================================
export const P2S01: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={50} opacity={0.55} blur={42} />
    <AmbientMotes part={P} opacity={0.55} />
    <PartMark part={P} label={CONTINUITY[2].kicker} dur={185} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        THE HUB REACHES THE STAGE
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <KineticLine
        text={'THE MIX ENGINE STAYS. THE COPPER GOES.'}
        size={88}
        per={2.6}
        delay={6}
        highlight={[{word: 5, color: A}]}
      />
    </At>

    <B from={0} to={100} fade={12}>
      <Shot id={75} box={{x: 0, y: 400, w: SAFE.w, h: 470}} dur={112} kb={{z: [1.04, 1.12]}} />
    </B>
    <B from={94} to={185} fade={12}>
      <Shot id={50} box={{x: 0, y: 400, w: SAFE.w, h: 470}} dur={91} kb={{z: [1.05, 1.13]}} />
    </B>

    <At y={904}>
      <Sub size={30} color={C.inkSoft} style={{maxWidth: 872}}>
        {'Inputs no longer have to terminate where the console sits.'}
      </Sub>
    </At>
    <At y={Y.spec + 30}>
      <Spec size={23} color={C.inkDim}>
        DANTE OVER STANDARD IP NETWORKS
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={185} index={0} delay={126} />
    <Cue name="impact-deep" at={2} volume={0.7} />
    <Cue name="swell" at={5} volume={0.48} />
    <Cue name="net-ping" at={92} volume={0.5} />
    <TickRun from={22} count={10} every={8} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S02 — Dante as the connective layer                                  265f
// assets: 77, 12
// ===========================================================================
export const P2S02: React.FC = () => (
  <Stage part={P} wash={0.9}>
    <AmbientPhoto id={77} opacity={0.5} blur={46} />
    <PartMark part={P} label="THE NETWORK · TRANSPORT" dur={265} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        BUILT-IN 64 × 64 DANTE
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'AUDIO BECOMES\nNETWORK TRAFFIC.'}
      </Display>
    </At>

    <B from={0} to={140} fade={13}>
      {/* the brief's Dante network-path graphic: console -> pulsing data line
          -> SB-16D, expanding into the 64x64 capacity grid */}
      <At x={0} y={332} w={SAFE.w} h={430}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <DanteWeb w={SAFE.w} h={430} part={P} delay={10} />
        </div>
      </At>
      <At y={790}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 880}}>
          {'Sixty-four channels in each direction, routed entirely in the digital\ndomain over the network infrastructure a venue already has.'}
        </Sub>
      </At>
    </B>

    <B from={134} to={265} fade={13}>
      <Shot id={77} box={{x: 0, y: 332, w: SAFE.w, h: 430}} dur={131} kb={{z: [1.05, 1.14]}} />
      <At y={790}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={A}>PRIMARY + SECONDARY</Chip>
          <Chip bg={C.ink}>AES67</Chip>
          <Chip bg={C.ink}>SMPTE ST 2110 INTEROP</Chip>
        </div>
      </At>
      <Shot id={12} box={{x: 0, y: 868, w: 300, h: 250}} dur={131} fit="contain" pad={18} kb={{z: [1, 1]}} />
      <At x={332} y={868} w={604} h={250}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Micro color={A} size={15}>
            REDUNDANT NETWORK PATHS
          </Micro>
          <Spec size={24} color={C.ink} weight={500} tracking={0.3}>
            {'A secondary port carries the\nsame audio on a separate path.'}
          </Spec>
        </div>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={265} index={1} delay={20} />
    <Cue name="data-sweep" at={6} volume={0.46} />
    <TickRun from={26} count={18} every={6} volume={0.28} hi />
    <Cue name="net-ping" at={54} volume={0.42} />
    <Cue name="net-ping" at={92} volume={0.36} />
    <Cue name="whoosh-air" at={128} volume={0.42} />
    <Cue name="impact-soft" at={138} volume={0.44} />
  </Stage>
);

// ===========================================================================
// S03 — One cable to the stage                                         250f
// assets: 43, 42
// ===========================================================================
export const P2S03: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={43} opacity={0.5} blur={44} />
    <PartMark part={P} label="THE NETWORK · DEPLOYMENT" dur={250} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        REPLACING THE ANALOG MULTICORE
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={94} lh={0.88}>
        {'ONE CAT5e RUN.\nNOT A COPPER LOOM.'}
      </Display>
    </At>

    <B from={0} to={132} fade={13}>
      <Shot id={43} box={{x: 0, y: 356, w: SAFE.w, h: 476}} dur={144} kb={{z: [1.04, 1.12]}} />
      <At y={862}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Heavy, inflexible once installed, and a single point of\nfailure across its whole length — the snake is\nthe deployment problem.'}
        </Sub>
      </At>
    </B>

    <B from={126} to={250} fade={13}>
      <Shot id={42} box={{x: 0, y: 356, w: SAFE.w, h: 476}} dur={124} kb={{z: [1.05, 1.13]}} />
      <At y={862}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Gain is taken at the source and travels back as data — over hundreds\nof feet of lightweight cable, with the gain structure intact.'}
        </Sub>
      </At>
    </B>

    <At y={Y.spec + 60}>
      <Spec size={22} color={C.inkDim}>
        LOSSLESS · LONG-DISTANCE · STANDARD IP INFRASTRUCTURE
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={250} index={2} delay={196} />
    <Cue name="whoosh-rev" at={0} volume={0.4} />
    <Cue name="impact-mid" at={8} volume={0.48} />
    <Cue name="whoosh-air" at={120} volume={0.44} />
    <Cue name="net-ping" at={134} volume={0.44} />
    <TickRun from={140} count={10} every={9} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S04 — SB-16D introduced                                              285f
// assets: 35, 38, 41, 44
// ===========================================================================
export const P2S04: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={35} opacity={0.55} blur={42} />
    <PartMark part={P} label="THE NETWORK · STAGE I/O" dur={285} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        TASCAM SB-16D DANTE STAGEBOX
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <KineticLine
        text={'NOT A MIXER. THE CONSOLE\u2019S I/O, MOVED.'}
        size={84}
        per={2.6}
        delay={8}
        highlight={[{word: 2, color: A}]}
      />
    </At>

    <B from={0} to={150} fade={13}>
      <Shot id={35} box={{x: 0, y: 384, w: SAFE.w, h: 460}} dur={162} kb={{z: [1.04, 1.12]}} />
      <At y={874}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Sixteen mic/line inputs and sixteen line outputs, placed where the\ntalent is — and connected back over Ethernet.'}
        </Sub>
      </At>
    </B>

    <B from={144} to={285} fade={13}>
      <Shot id={38} box={{x: 0, y: 384, w: SAFE.w, h: 246}} dur={141} kb={{z: [1.04, 1.11]}} />
      <Grid ids={[41, 44]} dur={141} cols={1} box={{x: 0, y: 648, w: SAFE.w, h: 300}} gap={12} delay={148} stagger={6} />
      <At y={974}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={C.ink}>16 MIC / LINE IN</Chip>
          <Chip bg={C.ink}>16 LINE OUT</Chip>
          <Chip bg={A}>CLASS 1 HDIA</Chip>
        </div>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={285} index={3} delay={22} />
    <Cue name="impact-deep" at={4} volume={0.6} />
    <Cue name="swell" at={8} volume={0.42} />
    <Cue name="whoosh-air" at={138} volume={0.42} />
    <Cue name="impact-soft" at={148} volume={0.44} />
    <TickRun from={156} count={12} every={8} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S05 — Chassis, mounting & deployment                                 340f
// assets: 36, 37, 40, 45, 46, 47, 49
// ===========================================================================
export const P2S05: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={47} opacity={0.5} blur={44} />
    <PartMark part={P} label="THE NETWORK · CHASSIS" dur={340} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        RACK, FLOOR OR STACKED
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'BUILT FOR THE\nBACK OF A TRUCK.'}
      </Display>
    </At>

    <B from={0} to={130} fade={13}>
      <Grid ids={[45, 46]} dur={142} cols={1} box={{x: 0, y: 352, w: SAFE.w, h: 496}} gap={14} delay={4} stagger={6} />
      <At y={878}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'A short-depth steel chassis with protected corners — it survives\nthe load-in, not just the install.'}
        </Sub>
      </At>
    </B>

    <B from={124} to={240} fade={13}>
      <Grid ids={[36, 37, 40, 49]} dur={116} cols={2} box={{x: 0, y: 352, w: SAFE.w, h: 496}} gap={13} delay={128} stagger={5} />
      <At y={878}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={C.ink}>RACK-MOUNT</Chip>
          <Chip bg={C.ink}>FLOOR BOX</Chip>
          <Chip bg={A}>REDUNDANT DC INPUT</Chip>
        </div>
      </At>
    </B>

    <B from={234} to={340} fade={13}>
      <Shot id={47} box={{x: 0, y: 352, w: SAFE.w, h: 496}} dur={106} kb={{z: [1.04, 1.12]}} />
      <At y={878}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Multiple units extend the same network — the input count grows\nwithout the console changing at all.'}
        </Sub>
      </At>
    </B>

    <At y={Y.spec + 46}>
      <Spec size={22} color={C.inkDim}>
        PS-P2450 ADAPTER COMPATIBLE · FAIL-SAFE AT THE STAGE END
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={340} index={4} delay={286} />
    <Cue name="whoosh-rev" at={0} volume={0.38} />
    <Cue name="impact-soft" at={8} volume={0.42} />
    <Cue name="whoosh-air" at={118} volume={0.42} />
    <TickRun from={132} count={14} every={7} volume={0.26} hi />
    <Cue name="whoosh-air" at={228} volume={0.4} />
    <Cue name="impact-mid" at={238} volume={0.44} />
    <Cue name="relay" at={252} volume={0.4} />
  </Stage>
);

// ===========================================================================
// S06 — Control at the stage end                                       240f
// assets: 39, 86
// ===========================================================================
export const P2S06: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={39} opacity={0.48} blur={46} />
    <PartMark part={P} label="THE NETWORK · CONTROL" dur={240} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        GAIN AND ROUTING, REMOTELY
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'NOBODY WALKS\nBACK TO STAGE.'}
      </Display>
    </At>

    <B from={0} to={128} fade={13}>
      <Shot id={39} box={{x: 0, y: 352, w: SAFE.w, h: 490}} dur={140} fit="contain" pad={10} kb={{z: [1, 1]}} bg={C.screen} />
      <At y={872}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Preamp gain, phantom power and pad are set from the network —\nthe stagebox itself has nothing that needs touching mid-show.'}
        </Sub>
      </At>
    </B>

    <B from={122} to={240} fade={13}>
      <Shot id={86} box={{x: 0, y: 352, w: SAFE.w, h: 490}} dur={118} fit="contain" pad={14} kb={{z: [1, 1]}} />
      <At y={872}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'The same control surface travels — tablet in hand, anywhere the\nnetwork reaches, while the console holds the mix.'}
        </Sub>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={240} index={5} delay={20} />
    <Cue name="click-ui" at={16} volume={0.4} />
    <Cue name="click-ui" at={38} volume={0.32} />
    <Cue name="whoosh-air" at={116} volume={0.42} />
    <Cue name="net-ping" at={128} volume={0.42} />
    <TickRun from={134} count={10} every={9} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S07 — Proof: radio broadcast                                         300f
// assets: 126, 127, 128, 129, 130
// ===========================================================================
export const P2S07: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={127} opacity={0.5} blur={44} />
    <PartMark part={P} label="THE NETWORK · IN SERVICE" dur={300} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        NEXT-GENERATION RADIO PROGRAMMING
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={90} lh={0.88}>
        {'ON AIR, ON A\nDANTE BACKBONE.'}
      </Display>
    </At>

    <B from={0} to={150} fade={13}>
      <Grid ids={[126, 127]} dur={162} cols={1} box={{x: 0, y: 352, w: SAFE.w, h: 500}} gap={14} delay={4} stagger={6} />
      <At y={882}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'A working broadcast facility running its studio output through the\nSonicview — routing handled digitally, operators unchanged.'}
        </Sub>
      </At>
    </B>

    <B from={144} to={300} fade={13}>
      <Grid ids={[128, 130]} dur={156} cols={1} box={{x: 0, y: 352, w: SAFE.w, h: 340}} gap={12} delay={148} stagger={6} />
      <Shot id={129} box={{x: 0, y: 708, w: SAFE.w, h: 300}} dur={156} fit="contain" pad={12} kb={{z: [1, 1]}} />
      <At y={1032}>
        <Spec size={22} color={C.inkSoft}>
          DANTE PRIMARY + SECONDARY · MIC, GUEST AND BGM PATHS
        </Spec>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={300} index={6} delay={246} />
    <Cue name="whoosh-rev" at={0} volume={0.36} />
    <Cue name="impact-soft" at={8} volume={0.4} />
    <Cue name="whoosh-air" at={138} volume={0.4} />
    <Cue name="net-ping" at={150} volume={0.4} />
    <TickRun from={156} count={12} every={8} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S08 — Proof: campus & conference                                     320f
// assets: 4, 5, 6, 131, 132, 125
// ===========================================================================
export const P2S08: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={132} opacity={0.5} blur={46} />
    <PartMark part={P} label="THE NETWORK · IN SERVICE" dur={320} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        CAMPUS, CONFERENCE AND FESTIVAL
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={90} lh={0.88}>
        {'OPERATED BY\nNON-SPECIALISTS.'}
      </Display>
    </At>

    <B from={0} to={158} fade={13}>
      <Grid ids={[132, 5]} dur={170} cols={1} box={{x: 0, y: 352, w: SAFE.w, h: 494}} gap={14} delay={4} stagger={6} />
      <At y={876}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'A university conference room where the routing matrix is complex\nbut the interface in front of the operator is not.'}
        </Sub>
      </At>
    </B>

    <B from={152} to={320} fade={13}>
      <Grid ids={[4, 131]} dur={168} cols={1} box={{x: 0, y: 352, w: SAFE.w, h: 400}} gap={12} fit="contain" pad={10} delay={156} stagger={6} />
      <Grid ids={[6, 125]} dur={168} cols={2} box={{x: 0, y: 768, w: SAFE.w, h: 248}} gap={13} delay={164} stagger={5} />
      <At y={1040}>
        <Spec size={22} color={C.inkSoft}>
          22 MIX BUSES · DISTINCT FEEDS PER ZONE
        </Spec>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={320} index={7} delay={266} />
    <Cue name="whoosh-air" at={0} volume={0.38} />
    <Cue name="impact-soft" at={10} volume={0.4} />
    <Cue name="whoosh-rev" at={146} volume={0.38} />
    <Cue name="impact-mid" at={156} volume={0.42} />
    <TickRun from={164} count={14} every={8} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S09 — Continuation into Part 3                                       115f
// ===========================================================================
export const P2S09: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage part={P}>
      <AmbientPhoto id={35} opacity={0.5} blur={46} />
      <AmbientMotes part={P} opacity={0.5} />
      <PartMark part={P} label={CONTINUITY[2].kicker} dur={115} />

      <Grid ids={[43, 77]} dur={115} cols={1} box={{x: 0, y: 128, w: SAFE.w, h: 690}} gap={16} delay={2} stagger={6} />

      <At y={856} w={SAFE.w}>
        <Rule w={104} color={A} thickness={4} />
        <Display size={86} lh={0.90} style={{marginTop: 24, opacity: ramp(f, [10, 32], [0, 1])}}>
          {CONTINUITY[2].line}
        </Display>
        <Sub
          size={33}
          italic={false}
          color={A}
          style={{marginTop: 18, opacity: ramp(f, [34, 58], [0, 1])}}
        >
          {CONTINUITY[2].next}
        </Sub>
        <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 46, height: 2, backgroundColor: C.line}} />
          <Micro color={C.inkDim} size={15}>
            PART 3 · THE PROTOCOL LAYER
          </Micro>
        </div>
      </At>

      <ContactStrip part={P} y={Y.strip} dur={115} index={0} delay={40} />
      <Cue name="impact-mid" at={4} volume={0.5} />
      <Cue name="shimmer" at={30} volume={0.4} />
      <Cue name="riser" at={64} volume={0.3} />
    </Stage>
  );
};

// ===========================================================================
// S10 — CTA & Shivansh Electronics outro                               340f
// ===========================================================================
export const P2S10: React.FC = () => (
  <Stage part={P} wash={1}>
    <AmbientPhoto id={75} opacity={0.4} blur={54} />
    <AmbientMotes part={P} opacity={0.45} />
    <Outro part={P} dur={340} />
    <Cue name="impact-deep" at={2} volume={0.56} />
    <Cue name="swell" at={6} volume={0.44} />
    <Cue name="shimmer" at={40} volume={0.34} />
    <TickRun from={46} count={12} every={5} volume={0.18} />
    <Cue name="chime-final" at={286} volume={0.5} />
  </Stage>
);
