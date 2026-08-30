import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, LF_SAFE, lfAccent} from '../../lib/lf-theme';
import {ramp} from '../../lib/anim';
import {At, LFBackdrop, LFMotes, LFStage} from '../../components/lf/LFStage';
import {BigFigure, ChipRow, LY, Panel, Para, SpecList, TitleBlock} from '../../components/lf/LFLayouts';
import {Fill, Mosaic, Plate} from '../../components/lf/LFMedia';
import {ChapterMark, LFOutro} from '../../components/lf/LFBrand';
import {DanteWeb} from '../../components/Diagram';
import {Display, Micro, Rule, Spec, Sub} from '../../components/Type';
import {B} from '../../components/Beat';
import {LFCue, LFTickRun} from '../../components/lf/LFCue';

/**
 * LONG-FORM PART 2 — "THE NETWORK"  ·  298.000 s / 8,940 frames / 1920x1080
 *
 * Dante as the connective technology, the SB-16D stagebox, and the installation
 * proof points. Carries 30 of the 131 coverage-relevant assets.
 *
 * The format explicitly asks for the case studies to get real narrative space
 * here rather than the reel's brief validation mentions, so three chapters —
 * 2,130 frames, over a third of the runtime — are given to what each
 * installation actually solved. The SB-16D is never presented as a mixer.
 *
 * Branding comes from src/lib/lf-brand-plan.ts via BrandingLayer; Dante is the
 * central subject of this part, which is why its mark appears five times here
 * against twice in Parts 1 and 3.
 */

const P = 2 as const;
const A = lfAccent(P);
const W = LF_SAFE.w;

// ===========================================================================
// C01 — Cold open: from hub to stage                                   420f
// assets: 75, 50
// ===========================================================================
export const L2C01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LFStage part={P}>
      <LFBackdrop id={75} opacity={0.22} blur={58} />
      <LFMotes part={P} opacity={0.5} />
      <ChapterMark part={P} label="PART 2 OF 3 · THE NETWORK" dur={420} n="01" />

      <B from={0} to={300} fade={20}>
        <At x={0} y={106} w={W}>
          <div style={{textAlign: 'center'}}>
            <Micro color={A} size={20} tracking={5.0}>
              TASCAM SONICVIEW ECOSYSTEM · THE NETWORK
            </Micro>
          </div>
        </At>
        <At x={0} y={146} w={W}>
          <Display size={112} lh={0.90} align="center" style={{opacity: ramp(f, [24, 54], [0, 1])}}>
            {'THE MIX ENGINE STAYS.\nTHE COPPER GOES.'}
          </Display>
        </At>
        <At x={0} y={676} w={W}>
          <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [60, 88], [0, 1])}}>
            <Rule w={140} color={A} thickness={5} />
          </div>
        </At>
        <At x={0} y={724} w={W}>
          <Sub
            size={34}
            color={C.inkSoft}
            align="center"
            italic={false}
            style={{opacity: ramp(f, [72, 100], [0, 1])}}
          >
            {'Inputs no longer have to terminate where the console sits.'}
          </Sub>
        </At>
      </B>

      <B from={300} to={420} fade={16}>
        <Fill id={50} box={{x: 0, y: 168, w: W, h: 560}} dur={130} kb={{z: [1.04, 1.12]}} shade="bottom" />
        <At x={0} y={772} w={W}>
          <Display size={82} lh={0.92} align="center" style={{opacity: ramp(f, [316, 344], [0, 1])}}>
            {'ONE NETWORK. THE WHOLE VENUE.'}
          </Display>
        </At>
        <At x={0} y={886} w={W}>
          <Spec size={26} color={C.inkDim} style={{textAlign: 'center', opacity: ramp(f, [330, 358], [0, 1])}}>
            DANTE OVER STANDARD IP INFRASTRUCTURE
          </Spec>
        </At>
      </B>

      <LFCue name="impact-deep" at={4} volume={0.72} />
      <LFCue name="bloom" at={10} volume={0.5} />
      <LFCue name="reverse-swell" at={280} volume={0.42} />
      <LFCue name="sub-thump" at={304} volume={0.6} />
      <LFTickRun from={40} count={14} every={10} volume={0.20} />
    </LFStage>
  );
};

// ===========================================================================
// C02 — The deployment problem                                        540f
// assets: 43, 42
// ===========================================================================
export const L2C02: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={43} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · THE PROBLEM" dur={540} n="02" />

    <TitleBlock
      part={P}
      kicker="THE ANALOG MULTICORE"
      head={'THE HEAVIEST THING\nIN THE BUILDING.'}
      headSize={78}
      w={780}
      sub={'Before anything else, this is what a networked stagebox is competing with — and the case against it is not really about audio quality.'}
      subSize={26}
    />

    <B from={0} to={270} fade={18}>
      <Plate id={43} box={{x: LY.colRx, y: 60, w: LY.colRw, h: 620}} dur={290} pad={24} />
    </B>
    <B from={262} to={540} fade={18}>
      <Plate id={42} box={{x: LY.colRx, y: 60, w: LY.colRw, h: 620}} dur={290} pad={24} />
    </B>

    {/* The asset set has no photograph of an analog multicore, so the right
        column is labelled for what it actually shows — the replacement — and
        the case against the multicore is carried by the left column. */}
    <At x={LY.colRx} y={702} w={LY.colRw}>
      <Micro color={C.inkDim} size={16} tracking={2.6} style={{textAlign: 'center'}}>
        WHAT REPLACES IT · A STAGEBOX AND ONE NETWORK RUN
      </Micro>
    </At>

    <SpecList
      part={P}
      y={560}
      w={780}
      delay={40}
      size={24}
      items={[
        {k: 'WEIGHT', v: 'Tens of kilograms per run'},
        {k: 'FLEXIBILITY', v: 'Fixed once installed'},
        {k: 'FAILURE MODE', v: 'Single point, along its length'},
        {k: 'NOISE', v: 'Ground loops over distance'},
      ]}
    />

    <Para y={760} w={780} size={25} delay={90}>
      {'Every one of those is a logistics problem rather than an audio one — which is exactly why replacing the cable, not the console, is what changes a venue’s working day.'}
    </Para>

    <LFCue name="whoosh-deep" at={0} volume={0.44} />
    <LFCue name="stinger-chapter" at={10} volume={0.4} />
    <LFCue name="sweep-down" at={256} volume={0.36} />
    <LFTickRun from={280} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C03 — Dante as transport                                            780f
// assets: 38, 12
//
// Asset 77 (the PRIMARY/SECONDARY etherCON closeup) would suit the transport
// story too, but it carries a baked-in DDM badge and its real subject is
// redundancy — so it is spent on C05 and this chapter shows the badge itself.
// ===========================================================================
export const L2C03: React.FC = () => (
  <LFStage part={P} wash={0.92}>
    <LFBackdrop id={77} opacity={0.16} blur={62} />
    <ChapterMark part={P} label="THE NETWORK · TRANSPORT" dur={780} n="03" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        AUDIO AS NETWORK TRAFFIC
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1400}>
      <Display size={86} lh={0.92}>
        {'THE CABLE STOPS BEING AN AUDIO CABLE.'}
      </Display>
    </At>

    <B from={0} to={330} fade={18}>
      <At x={0} y={318} w={W} h={420}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <DanteWeb w={W} h={420} part={P} delay={20} />
        </div>
      </At>
      <Para y={772} w={1500} size={26} delay={50}>
        {'Dante puts audio on the same Ethernet infrastructure a building already runs. Channels become streams, patching becomes routing, and the physical run stops caring how many channels it carries.'}
      </Para>
    </B>

    <B from={322} to={780} fade={18}>
      <Plate id={38} box={{x: 0, y: 318, w: 520, h: 420}} dur={470} pad={16} />
      <Panel
        part={P}
        label="WHY IT SURVIVES A VENUE"
        body={'Standard switches.\nStandard cable.\nStandard practice — the network\nteam already knows how to run it.'}
        x={556}
        y={318}
        w={700}
        h={420}
        delay={340}
        size={27}
      />
      {/* The Dante Domain Manager certification is the artefact the facility's
          network team actually looks for, so it is shown at a size that can be
          read rather than parked in a corner. */}
      <Plate
        id={12}
        box={{x: 1404, y: 318, w: 300, h: 300}}
        dur={470}
        fit="cover"
        pad={0}
        radius={20}
        card={false}
        bg="#FFFFFF"
        kb={{z: [1, 1.03]}}
      />
      <At x={1292} y={648} w={524}>
        <Micro color={C.inkDim} size={16} tracking={2.4} style={{textAlign: 'center'}}>
          DANTE DOMAIN MANAGER READY
        </Micro>
      </At>
      <Para y={772} w={1500} size={26} delay={360}>
        {'And because it is a network, distance stops being the constraint it was. Hundreds of feet of lightweight Cat5e replaces a copper run many times its weight — and one person can re-pull it.'}
      </Para>
    </B>

    <LFCue name="data-sweep" at={8} volume={0.48} />
    <LFCue name="net-ping" at={60} volume={0.44} />
    <LFTickRun from={40} count={26} every={8} volume={0.26} hi />
    <LFCue name="whoosh-grain" at={316} volume={0.42} />
    <LFCue name="net-ping" at={340} volume={0.4} />
  </LFStage>
);

// ===========================================================================
// C04 — 64 x 64, built in                                             540f
// assets: 35, 44
// ===========================================================================
export const L2C04: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={35} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · BUILT-IN CAPACITY" dur={540} n="04" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        NOT AN OPTION, NOT A CARD
      </Micro>
    </At>

    <BigFigure part={P} value="64 × 64" caption="DANTE CHANNELS, BUILT INTO EVERY SONICVIEW" x={0} y={140} size={132} delay={16} />

    <Para y={410} w={860} size={26} delay={50}>
      {'Sixty-four channels in and sixty-four out are part of the console, not an accessory to it. A Sonicview is a network device from the moment it is powered on — which means the stagebox conversation can begin on day one rather than at the next upgrade.'}
    </Para>

    <B from={0} to={270} fade={18}>
      <Plate id={35} box={{x: 940, y: 140, w: W - 940, h: 560}} dur={290} pad={20} />
    </B>
    <B from={262} to={540} fade={18}>
      <Plate id={44} box={{x: 940, y: 140, w: W - 940, h: 560}} dur={290} pad={20} />
    </B>

    <ChipRow
      part={P}
      y={740}
      w={860}
      delay={70}
      items={[{label: 'AES67'}, {label: 'SMPTE ST 2110 INTEROP', accent: true}, {label: 'DANTE DOMAIN MANAGER READY'}]}
    />

    <LFCue name="whoosh-tight" at={0} volume={0.42} />
    <LFCue name="impact-mid" at={14} volume={0.48} />
    <LFTickRun from={40} count={16} every={8} volume={0.24} hi />
    <LFCue name="page-turn" at={256} volume={0.4} />
  </LFStage>
);

// ===========================================================================
// C05 — Redundant network paths                                       480f
// assets: 77
// ===========================================================================
export const L2C05: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={38} opacity={0.16} blur={60} />
    <ChapterMark part={P} label="THE NETWORK · REDUNDANCY" dur={480} n="05" />

    <TitleBlock
      part={P}
      kicker="PRIMARY AND SECONDARY"
      head={'TWO PATHS,\nONE STREAM.'}
      headSize={82}
      w={800}
      sub={'A redundant Dante network carries the same audio down two physically separate paths at once. A switch failure, or a severed run, is not an interruption — it is a path that stopped being used.'}
      subSize={26}
    />

    {/* The etherCON pair, at a size where PRIMARY and SECONDARY can be read —
        the whole chapter in one photograph. */}
    <Plate id={77} box={{x: 940, y: 176, w: W - 940, h: 440}} dur={480} pad={20} />

    <SpecList
      part={P}
      y={620}
      w={860}
      delay={60}
      size={25}
      items={[
        {k: 'PRIMARY PORT', v: 'Main network path'},
        {k: 'SECONDARY PORT', v: 'Independent parallel path'},
        {k: 'FAILOVER', v: 'No audible interruption'},
      ]}
    />

    <Panel
      part={P}
      label="WHAT THIS BUYS AN ENGINEER"
      body={'The network becomes something you can\nservice during a show instead of around it.'}
      x={940}
      y={650}
      w={W - 940}
      h={200}
      delay={80}
      size={26}
    />

    <LFCue name="reverse-swell" at={0} volume={0.4} />
    <LFCue name="net-ping" at={40} volume={0.44} />
    <LFCue name="net-ping" at={90} volume={0.34} />
    <LFTickRun from={60} count={16} every={9} volume={0.24} hi />
  </LFStage>
);

// ===========================================================================
// C06 — SB-16D introduced                                             660f
// assets: 41, 45, 46
// ===========================================================================
export const L2C06: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={41} opacity={0.20} blur={56} />
    <ChapterMark part={P} label="THE NETWORK · TASCAM SB-16D" dur={660} n="06" />

    <B from={0} to={300} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          TASCAM SB-16D DANTE STAGEBOX
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={90} lh={0.92}>
          {'NOT A MIXER. THE CONSOLE’S INPUT STAGE, MOVED.'}
        </Display>
      </At>
      {/* The stagebox photography is square on white; a full-width plate would
          leave it stranded in the middle of an empty card, so every plate in
          this chapter is sized close to the picture's own proportion. */}
      <Plate id={41} box={{x: 0, y: 316, w: 520, h: 444}} dur={320} pad={16} />
      <Panel
        part={P}
        label="WHY IT EXISTS"
        body={'The input stage does not have to\nlive where the mix engine lives.\n\nSeparating the two is the whole\nreason this box exists.'}
        x={556}
        y={316}
        w={640}
        h={444}
        delay={40}
        size={27}
      />
      <SpecList
        part={P}
        x={1232}
        y={392}
        w={584}
        delay={60}
        size={23}
        items={[
          {k: 'INPUTS', v: '16 mic / line'},
          {k: 'OUTPUTS', v: '16 line'},
          {k: 'TO THE DESK', v: 'One Cat5e run'},
        ]}
      />
      <Para y={790} w={1500} size={26} delay={70}>
        {'It has no faders and no mix engine, and that is the point: it is the part of the console that has to be near the talent, detached and placed there.'}
      </Para>
    </B>

    <B from={292} to={660} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          GAIN AT THE SOURCE
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={86} lh={0.92}>
          {'PUT THE PREAMP WHERE THE MICROPHONE IS.'}
        </Display>
      </At>
      <Mosaic
        ids={[45, 46]}
        dur={380}
        cols={2}
        box={{x: 340, y: 316, w: 1136, h: 444}}
        gap={24}
        delay={300}
        pad={16}
      />
      <Para y={790} w={1500} size={26} delay={330}>
        {'Gain is taken within a few metres of the source, then everything downstream is data. The long run no longer carries a fragile analog signal — it carries packets that either arrive intact or do not arrive at all.'}
      </Para>
    </B>

    <LFCue name="impact-deep" at={6} volume={0.6} />
    <LFCue name="bloom" at={14} volume={0.44} />
    <LFCue name="whoosh-deep" at={286} volume={0.44} />
    <LFTickRun from={306} count={14} every={9} volume={0.24} hi />
  </LFStage>
);

// ===========================================================================
// C07 — SB-16D I/O & preamps                                          600f
// assets: 36, 37
// ===========================================================================
export const L2C07: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={36} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · THE SAME PREAMPS" dur={600} n="07" />

    <TitleBlock
      part={P}
      kicker="CLASS 1 HDIA, AT THE STAGE END"
      head={'MOVING AN INPUT\nCHANGES NOTHING\nABOUT IT.'}
      headSize={72}
      w={800}
      sub={'The SB-16D carries the same Class 1 HDIA preamp design as the consoles themselves — so an input that lives on the stagebox has the same noise floor as one on the desk.'}
      subSize={25}
    />

    <B from={0} to={300} fade={18}>
      <Plate id={36} box={{x: 1118, y: 80, w: 520, h: 460}} dur={320} pad={16} />
    </B>
    <B from={292} to={600} fade={18}>
      <Plate id={37} box={{x: 1118, y: 80, w: 520, h: 460}} dur={320} pad={16} />
    </B>

    <SpecList
      part={P}
      y={640}
      w={860}
      delay={60}
      size={25}
      items={[
        {k: 'INPUTS', v: '16 mic / line, Class 1 HDIA'},
        {k: 'OUTPUTS', v: '16 line level'},
        {k: 'ROUTING', v: '16 × 16 over Dante'},
      ]}
    />

    <Para x={940} y={620} w={W - 940} size={25} delay={90}>
      {'Sixteen line outputs come back the other way — stage monitors, broadcast splits, or a feed to a second system — without a second cable run.'}
    </Para>

    <LFCue name="whoosh-tight" at={0} volume={0.42} />
    <LFCue name="latch" at={20} volume={0.42} />
    <LFCue name="page-turn" at={286} volume={0.4} />
    <LFTickRun from={306} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C08 — Chassis & mounting                                            540f
// assets: 40, 49
// ===========================================================================
export const L2C08: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={49} opacity={0.18} blur={56} />
    <ChapterMark part={P} label="THE NETWORK · CHASSIS" dur={540} n="08" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        RACK, FLOOR OR STACKED
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1400}>
      <Display size={86} lh={0.92}>
        {'BUILT FOR THE BACK OF A TRUCK.'}
      </Display>
    </At>

    <B from={0} to={270} fade={18}>
      <Plate id={40} box={{x: 0, y: 300, w: 660, h: 480}} dur={290} pad={18} />
      <Para x={716} y={380} w={1100} size={28} delay={40}>
        {'A short-depth steel chassis with protected corners. It is designed to survive the load-in, not just the install — which matters, because a stagebox spends its life being moved.'}
      </Para>
    </B>

    <B from={262} to={540} fade={18}>
      <Plate id={49} box={{x: 0, y: 300, w: 660, h: 480}} dur={290} pad={18} />
      <Para x={716} y={380} w={1100} size={28} delay={280}>
        {'Rack-mount it in a touring case, sit it on the deck in a floor box, or stack a pair. The mounting decision is independent of the audio decision.'}
      </Para>
      <ChipRow
        part={P}
        x={716}
        y={640}
        w={1100}
        delay={300}
        items={[{label: 'RACK MOUNT'}, {label: 'FLOOR / DECK'}, {label: 'STACKED PAIR', accent: true}]}
      />
    </B>

    <LFCue name="whoosh-grain" at={0} volume={0.42} />
    <LFCue name="sub-thump" at={16} volume={0.4} />
    <LFCue name="latch" at={264} volume={0.42} />
    <LFTickRun from={286} count={11} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C09 — Deployment & scaling                                          480f
// assets: 47
// ===========================================================================
export const L2C09: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={47} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · SCALING" dur={480} n="09" />

    <TitleBlock
      part={P}
      kicker="MORE INPUTS, SAME CONSOLE"
      head={'ADD A BOX,\nNOT A DESK.'}
      headSize={82}
      w={800}
      sub={'A second SB-16D extends the same network. The input count grows and the console does not change at all — no new surface, no new engine, no re-specification.'}
      subSize={26}
    />

    <Plate id={47} box={{x: 940, y: 90, w: W - 940, h: 560}} dur={480} pad={20} />

    <Panel
      part={P}
      label="WHERE THIS LANDS"
      body={'A room that grows by a stage,\na tour that adds a support act,\na campus that adds a hall.'}
      x={0}
      y={620}
      w={860}
      h={230}
      delay={70}
      size={27}
    />

    <LFCue name="whoosh-deep" at={0} volume={0.42} />
    <LFCue name="net-ping" at={50} volume={0.42} />
    <LFCue name="net-ping" at={80} volume={0.34} />
    <LFTickRun from={60} count={14} every={9} volume={0.24} hi />
  </LFStage>
);

// ===========================================================================
// C10 — Remote control from the network                               540f
// assets: 39, 86
// ===========================================================================
export const L2C10: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={39} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · CONTROL" dur={540} n="10" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        GAIN, PHANTOM AND PAD, OVER THE NETWORK
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1400}>
      <Display size={86} lh={0.92}>
        {'NOBODY WALKS BACK TO STAGE.'}
      </Display>
    </At>

    <B from={0} to={280} fade={18}>
      <Plate id={39} box={{x: 0, y: 300, w: 760, h: 460}} dur={300} pad={14} bg={C.screen} />
      <Panel
        part={P}
        label="SET FROM THE DESK"
        body={'Preamp gain.\n48 V phantom power.\nPad.\nPer channel, live.'}
        x={796}
        y={300}
        w={1020}
        h={460}
        delay={40}
        size={28}
      />
    </B>

    <B from={272} to={540} fade={18}>
      <Plate id={86} box={{x: 0, y: 300, w: 760, h: 460}} dur={280} pad={20} />
      <Panel
        part={P}
        label="OR FROM ANYWHERE ON IT"
        body={'The same control travels — tablet in hand,\nanywhere the network reaches, while the\nconsole holds the mix.'}
        x={796}
        y={300}
        w={1020}
        h={460}
        delay={290}
        size={27}
      />
    </B>

    <Para y={790} w={1500} size={26} delay={60}>
      {'The stagebox itself has nothing that needs touching mid-show. That is a safety property as much as a convenience one — it removes a reason for anyone to be on stage during a performance.'}
    </Para>

    <LFCue name="click-hard" at={20} volume={0.38} />
    <LFCue name="click-ui" at={44} volume={0.34} />
    <LFCue name="whoosh-tight" at={266} volume={0.42} />
    <LFTickRun from={290} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C11 — Proof: festival remote production                             420f
// assets: 125
// ===========================================================================
export const L2C11: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={125} opacity={0.20} blur={56} />
    <ChapterMark part={P} label="THE NETWORK · IN SERVICE" dur={420} n="11" />

    <TitleBlock
      part={P}
      kicker="FESTIVAL REMOTE PRODUCTION"
      head={'WHERE THE\nDEADLINE IS\nTHE DOORS.'}
      headSize={74}
      w={760}
      sub={'Remote-truck work is the hardest test of a deployment story: the get-in is short, the stage changes between acts, and nothing can be re-pulled once the audience is in.'}
      subSize={25}
    />

    <Plate id={125} box={{x: 900, y: 90, w: W - 900, h: 620}} dur={420} pad={18} />

    <Para y={760} w={820} size={25} delay={70}>
      {'A Sonicview 24XP went into exactly that environment at the 2023 Newport Jazz Festival — capturing a multi-act bill where the console had to be reconfigured between sets without re-cabling the stage.'}
    </Para>

    <LFCue name="reverse-swell" at={0} volume={0.38} />
    <LFCue name="impact-soft" at={14} volume={0.42} />
    <LFTickRun from={40} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C12 — Proof: radio broadcast                                        780f
// assets: 126, 127, 128, 129, 130
// ===========================================================================
export const L2C12: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={127} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · IN SERVICE" dur={780} n="12" />

    <B from={0} to={280} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          CASE STUDY · NEXT-GENERATION RADIO PROGRAMMING
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={1400}>
        <Display size={86} lh={0.92}>
          {'ON AIR, ON A DANTE BACKBONE.'}
        </Display>
      </At>
      <Mosaic
        ids={[126, 127]}
        dur={300}
        cols={2}
        box={{x: 0, y: 300, w: W, h: 460}}
        gap={20}
        delay={20}
        pad={0}
        card={false}
      />
      <Para y={790} w={1500} size={26} delay={50}>
        {'A working broadcast facility rebuilt its studio output around the Sonicview — a room where the schedule does not stop for an installation and the operators are presenters, not engineers.'}
      </Para>
    </B>

    <B from={272} to={540} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          CASE STUDY · NEXT-GENERATION RADIO PROGRAMMING
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={1400}>
        <Display size={82} lh={0.92}>
          {'WHAT THE ROOM ACTUALLY NEEDED.'}
        </Display>
      </At>
      <Plate id={129} box={{x: 0, y: 300, w: 1180, h: 460}} dur={290} pad={16} />
      <Panel
        part={P}
        label="THE SIGNAL PLAN"
        body={'DJ and guest microphones.\nAI voice and BGM playback.\nHeadphone feeds per guest.\nA discrete send to master control.'}
        x={1216}
        y={300}
        w={W - 1216}
        h={460}
        delay={286}
        size={26}
      />
      <Para y={790} w={1500} size={26} delay={310}>
        {'Primary and secondary Dante paths carry all of it, so a network fault during a live hour degrades redundancy rather than taking the station off air.'}
      </Para>
    </B>

    <B from={532} to={780} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          CASE STUDY · NEXT-GENERATION RADIO PROGRAMMING
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={1400}>
        <Display size={82} lh={0.92}>
          {'AND THE OPERATORS DID NOT RELEARN THE ROOM.'}
        </Display>
      </At>
      <Mosaic
        ids={[128, 130]}
        dur={270}
        cols={2}
        box={{x: 0, y: 300, w: W, h: 460}}
        gap={20}
        delay={546}
        pad={0}
        card={false}
      />
      <Para y={790} w={1500} size={26} delay={570}>
        {'That is the part that decides whether an install succeeds. A routing matrix this flexible is only useful if the person on the late shift can still drive it.'}
      </Para>
    </B>

    <LFCue name="whoosh-deep" at={0} volume={0.4} />
    <LFCue name="stinger-chapter" at={12} volume={0.4} />
    <LFCue name="page-turn" at={266} volume={0.4} />
    <LFCue name="net-ping" at={300} volume={0.4} />
    <LFTickRun from={300} count={14} every={9} volume={0.22} />
    <LFCue name="whoosh-tight" at={526} volume={0.42} />
  </LFStage>
);

// ===========================================================================
// C13 — Proof: campus & conference                                    930f
// assets: 4, 5, 6, 131, 132
// ===========================================================================
export const L2C13: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={132} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE NETWORK · IN SERVICE" dur={930} n="13" />

    <B from={0} to={300} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          CASE STUDY · HO CHI MINH CITY UNIVERSITY OF TECHNOLOGY
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={1400}>
        <Display size={82} lh={0.92}>
          {'A CONFERENCE ROOM RUN BY NON-SPECIALISTS.'}
        </Display>
      </At>
      <Mosaic
        ids={[132, 5]}
        dur={320}
        cols={2}
        box={{x: 0, y: 300, w: W, h: 460}}
        gap={20}
        delay={20}
        pad={0}
        card={false}
      />
      <Para y={790} w={1500} size={26} delay={50}>
        {'A university conference facility with a genuinely complex routing requirement — and a rota of staff and students who were never going to be trained as audio engineers.'}
      </Para>
    </B>

    <B from={292} to={620} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          CASE STUDY · HO CHI MINH CITY UNIVERSITY OF TECHNOLOGY
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={1400}>
        <Display size={82} lh={0.92}>
          {'COMPLEX BEHIND, SIMPLE IN FRONT.'}
        </Display>
      </At>
      <Plate id={4} box={{x: 0, y: 300, w: 760, h: 460}} dur={350} pad={16} />
      <Panel
        part={P}
        label="WHAT IS BEING ROUTED"
        body={'Lectern and altar microphones.\nA wireless conference microphone system.\nComputer and playback sources.\nMultiple amplified zones.'}
        x={796}
        y={300}
        w={1020}
        h={460}
        delay={306}
        size={26}
      />
      <Para y={790} w={1500} size={26} delay={330}>
        {'Twenty-two mix buses let each of those zones take its own feed — a main hall, an overflow room, a recording send — without any of them being a compromise of another.'}
      </Para>
    </B>

    <B from={612} to={930} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          THE SAME REQUIREMENT, ELSEWHERE
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={1400}>
        <Display size={82} lh={0.92}>
          {'THE SAME PATTERN, IN EVERY VENUE OF THIS KIND.'}
        </Display>
      </At>
      <Mosaic
        ids={[131, 6]}
        dur={330}
        cols={2}
        box={{x: 180, y: 300, w: 1456, h: 460}}
        gap={24}
        delay={626}
        pad={14}
      />
      <Para y={790} w={1500} size={26} delay={650}>
        {'Houses of worship, lecture theatres, corporate auditoria — the requirement is always the same shape: many sources, many zones, and an operator who needs the room to be obvious.'}
      </Para>
    </B>

    <LFCue name="whoosh-grain" at={0} volume={0.4} />
    <LFCue name="stinger-chapter" at={12} volume={0.4} />
    <LFCue name="page-turn" at={286} volume={0.4} />
    <LFTickRun from={310} count={14} every={9} volume={0.22} />
    <LFCue name="whoosh-deep" at={606} volume={0.42} />
    <LFCue name="impact-soft" at={620} volume={0.4} />
  </LFStage>
);

// ===========================================================================
// C14 — What the workflow becomes                                     450f
// (no new assets; recaps heroes already covered)
// ===========================================================================
export const L2C14: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={50} opacity={0.16} blur={62} />
    <ChapterMark part={P} label="THE NETWORK · THE RESULT" dur={450} n="14" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        WHAT CHANGES ON A SHOW DAY
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={86} lh={0.92}>
        {'THE DEPLOYMENT STOPS BEING THE HARD PART.'}
      </Display>
    </At>

    <Plate id={75} box={{x: 0, y: 320, w: 1080, h: 440}} dur={450} pad={20} />

    <SpecList
      part={P}
      x={1136}
      y={340}
      w={W - 1136}
      delay={30}
      size={24}
      items={[
        {k: 'CABLE TO STAGE', v: 'One Cat5e run'},
        {k: 'GAIN', v: 'Taken at the source'},
        {k: 'ADJUSTMENT', v: 'From the desk, live'},
        {k: 'GROWTH', v: 'Add a box, not a desk'},
        {k: 'FAILURE', v: 'A path, not the show'},
      ]}
    />

    <Para y={800} w={1500} size={26} delay={60}>
      {'None of that is an audio-quality claim. It is a claim about the working day — and for most facilities that is the one that decides the specification.'}
    </Para>

    <LFCue name="bloom" at={0} volume={0.42} />
    <LFCue name="lift-air" at={30} volume={0.36} />
    <LFTickRun from={50} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C15 — Continuation into Part 3                                      270f
// ===========================================================================
export const L2C15: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LFStage part={P}>
      <LFBackdrop id={77} opacity={0.18} blur={58} />
      <LFMotes part={P} opacity={0.45} />
      <ChapterMark part={P} label="PART 2 OF 3 · THE NETWORK" dur={270} n="15" />

      <Mosaic
        ids={[43, 35]}
        dur={270}
        cols={2}
        box={{x: 240, y: 120, w: 1336, h: 320}}
        gap={24}
        delay={4}
        pad={14}
      />

      <At x={0} y={478} w={W}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Rule w={140} color={A} thickness={5} />
        </div>
      </At>
      <At x={0} y={520} w={W}>
        <Display size={76} lh={0.94} align="center" style={{opacity: ramp(f, [16, 44], [0, 1])}}>
          {'THE NETWORK IS IN PLACE.'}
        </Display>
      </At>
      <At x={0} y={640} w={W}>
        <Sub
          size={32}
          color={A}
          align="center"
          italic={false}
          style={{opacity: ramp(f, [52, 82], [0, 1])}}
        >
          {'In Part 3, we complete the ecosystem with total protocol flexibility.'}
        </Sub>
      </At>
      <At x={0} y={834} w={W}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [70, 100], [0, 1])}}>
          <Micro color={C.inkDim} size={17} tracking={3.4}>
            PART 3 · THE PROTOCOL LAYER — THE IF-SERIES EXPANSION CARDS
          </Micro>
        </div>
      </At>

      <LFCue name="impact-mid" at={6} volume={0.5} />
      <LFCue name="bloom" at={30} volume={0.44} />
      <LFCue name="reverse-swell" at={140} volume={0.34} />
    </LFStage>
  );
};

// ===========================================================================
// C16 — CTA & Shivansh Electronics outro                              510f
// ===========================================================================
export const L2C16: React.FC = () => (
  <LFStage part={P} wash={1}>
    <LFBackdrop id={35} opacity={0.12} blur={68} />
    <LFMotes part={P} opacity={0.4} />
    <LFOutro part={P} dur={510} />
    <LFCue name="impact-deep" at={4} volume={0.56} />
    <LFCue name="bloom" at={10} volume={0.46} />
    <LFCue name="lift-air" at={60} volume={0.36} />
    <LFTickRun from={70} count={16} every={6} volume={0.16} />
    <LFCue name="chime-final" at={430} volume={0.5} />
  </LFStage>
);
