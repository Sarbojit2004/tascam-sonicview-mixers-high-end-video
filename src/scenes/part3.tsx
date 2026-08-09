import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SAFE, accent} from '../lib/theme';
import {ramp} from '../lib/anim';
import {AmbientMotes, AmbientPhoto, At, Stage} from '../components/Stage';
import {Chip, Display, KineticLine, Kicker, Micro, Rule, Spec, Sub} from '../components/Type';
import {Grid, Shot} from '../components/Media';
import {Connector, ConnectorKind} from '../components/Diagram';
import {B, Y} from '../components/Beat';
import {Cue, TickRun} from '../components/Cue';
import {ContactStrip, Outro, PartMark} from '../components/Brand';
import {CONTINUITY} from '../lib/copy';

/**
 * PART 3 — "THE PROTOCOL LAYER"
 *
 * The IF-Series expansion cards, carrying the last 27 coverage-relevant assets.
 *
 * The repository contains imagery for FIVE cards — IF-ST2110, IF-AE16,
 * IF-AN16/OUT, IF-MA64/EX and IF-DA64. The brief also documents IF-MA64/BN
 * (64-channel MADI over coaxial BNC), but no photograph of it exists in the
 * asset set, so it is not given a scene. Its BNC connector story is not lost:
 * the IF-MA64/EX card carries both optical and coaxial MADI connectors, and
 * that scene shows both.
 *
 * Each card gets a vector connector icon alongside its photography, because in
 * a reel this dense the connector type is what makes a card read as
 * functionally distinct rather than as more anonymous I/O.
 */

const P = 3 as const;
const A = accent(P);

// ---------------------------------------------------------------------------
/** Shared layout for the four single-card scenes. */
const CardScene: React.FC<{
  dur: number;
  kicker: string;
  name: string;
  headline: string;
  connector: ConnectorKind;
  connectorLabel: string;
  frontId: number;
  cardId: number;
  body: string;
  chips: {label: string; accent?: boolean}[];
  spec: string;
  strip: number;
}> = ({
  dur,
  kicker,
  name,
  headline,
  connector,
  connectorLabel,
  frontId,
  cardId,
  body,
  chips,
  spec,
  strip,
}) => (
  <Stage part={P}>
    <AmbientPhoto id={cardId} opacity={0.46} blur={46} />
    <PartMark part={P} label={kicker} dur={dur} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        {name}
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={88} lh={0.88}>
        {headline}
      </Display>
    </At>

    <B from={0} to={Math.round(dur * 0.52)} fade={12}>
      <Shot id={frontId} box={{x: 0, y: 348, w: SAFE.w, h: 300}} dur={dur} fit="contain" pad={16} kb={{z: [1, 1]}} />
      <At y={676}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {body}
        </Sub>
      </At>
    </B>

    <B from={Math.round(dur * 0.46)} to={dur} fade={12}>
      <Shot id={cardId} box={{x: 0, y: 348, w: SAFE.w, h: 300}} dur={dur} fit="contain" pad={16} kb={{z: [1, 1]}} />
      <At y={676}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          {chips.map((c) => (
            <Chip key={c.label} bg={c.accent ? A : C.ink}>
              {c.label}
            </Chip>
          ))}
        </div>
      </At>
    </B>

    {/* connector identity — the thing that makes this card distinct */}
    <At x={0} y={766} w={SAFE.w} h={232}>
      <div
        style={{
          height: '100%',
          backgroundColor: C.paperHi,
          border: `1px solid ${C.line}`,
          borderRadius: 14,
          padding: '20px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <Connector kind={connector} w={228} h={132} color={C.ink} strokeWidth={3.4} />
        <div style={{flex: 1}}>
          <Micro color={A} size={15}>
            PHYSICAL INTERFACE
          </Micro>
          <Spec size={30} color={C.ink} weight={500} tracking={0.4} style={{marginTop: 10}}>
            {connectorLabel}
          </Spec>
        </div>
      </div>
    </At>

    <At y={1030}>
      <Spec size={22} color={C.inkDim}>
        {spec}
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={dur} index={strip} delay={dur - 90} />
    <Cue name="card-slide" at={6} volume={0.6} />
    <Cue name="impact-soft" at={30} volume={0.38} />
    <Cue name="whoosh-air" at={Math.round(dur * 0.46) - 8} volume={0.4} />
    <TickRun from={Math.round(dur * 0.5)} count={9} every={8} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S01 — Hook: the console adapts                                       195f
// assets: 97, 102
// ===========================================================================
export const P3S01: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={97} opacity={0.5} blur={44} />
    <AmbientMotes part={P} opacity={0.55} />
    <PartMark part={P} label={CONTINUITY[3].kicker} dur={195} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        THE IF-SERIES EXPANSION LAYER
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <KineticLine
        text={'THE CONSOLE ADAPTS TO THE FACILITY.'}
        size={90}
        per={2.6}
        delay={6}
        highlight={[{word: 2, color: A}]}
      />
    </At>

    <B from={0} to={106} fade={12}>
      <Shot id={97} box={{x: 0, y: 396, w: SAFE.w, h: 460}} dur={118} kb={{z: [1.04, 1.12]}} />
    </B>
    <B from={100} to={195} fade={12}>
      <Shot id={102} box={{x: 0, y: 396, w: SAFE.w, h: 460}} dur={95} kb={{z: [1.05, 1.13]}} />
    </B>

    <At y={890}>
      <Sub size={29} color={C.inkSoft} style={{maxWidth: 878}}>
        {'Not the other way around. No format converters, no stranded gear.'}
      </Sub>
    </At>
    <At y={Y.spec + 24}>
      <Spec size={23} color={C.inkDim}>
        ST 2110 · AES/EBU · MADI · ANALOG · EXPANDED DANTE
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={195} index={0} delay={132} />
    <Cue name="impact-deep" at={2} volume={0.7} />
    <Cue name="swell" at={5} volume={0.46} />
    <Cue name="whoosh-air" at={96} volume={0.42} />
    <TickRun from={22} count={12} every={7} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S02 — Two expansion slots                                            175f
// assets: 72, 96
// ===========================================================================
export const P3S02: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={72} opacity={0.46} blur={46} />
    <PartMark part={P} label="THE PROTOCOL LAYER · SLOTS" dur={175} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        TWO INTERNAL EXPANSION SLOTS
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={92} lh={0.88}>
        {'SPECIFIED LAST.\nCHANGED LATER.'}
      </Display>
    </At>

    <B from={0} to={98} fade={12}>
      <Shot id={72} box={{x: 0, y: 352, w: SAFE.w, h: 430}} dur={110} fit="contain" pad={14} kb={{z: [1, 1]}} />
    </B>
    <B from={92} to={175} fade={12}>
      <Shot id={96} box={{x: 0, y: 352, w: SAFE.w, h: 430}} dur={83} fit="contain" pad={14} kb={{z: [1, 1]}} />
    </B>

    <At y={812}>
      <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
        {'A card slides into the rear bay and the console starts speaking a\nnew protocol natively — no external conversion in the signal path.'}
      </Sub>
    </At>
    <At y={Y.spec + 20}>
      <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
        <Chip bg={A}>2 SLOTS PER CONSOLE</Chip>
        <Chip bg={C.ink}>FIELD-INSTALLABLE</Chip>
      </div>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={175} index={1} delay={112} />
    <Cue name="card-slide" at={8} volume={0.66} />
    <Cue name="whoosh-air" at={86} volume={0.4} />
    <Cue name="card-slide" at={96} volume={0.5} />
    <TickRun from={104} count={8} every={8} volume={0.22} />
  </Stage>
);

// ===========================================================================
// S03 — IF-ST2110, IP broadcast                                        340f
// assets: 24, 27, 28, 30
// ===========================================================================
export const P3S03: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={30} opacity={0.46} blur={44} />
    <PartMark part={P} label="THE PROTOCOL LAYER · IP BROADCAST" dur={340} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        TASCAM IF-ST2110
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={88} lh={0.88}>
        {'ONTO THE SAME IP\nFABRIC AS THE VIDEO.'}
      </Display>
    </At>

    <B from={0} to={128} fade={13}>
      <Shot id={30} box={{x: 0, y: 348, w: SAFE.w, h: 330}} dur={140} kb={{z: [1.04, 1.12]}} bg={C.screen} />
      <At y={706}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Two media ports and a separate control port — the console joins a\nSMPTE ST 2110 plant as a native audio essence source.'}
        </Sub>
      </At>
    </B>

    <B from={122} to={236} fade={13}>
      <Grid ids={[27, 28]} dur={114} cols={1} box={{x: 0, y: 348, w: SAFE.w, h: 330}} gap={12} fit="contain" pad={12} delay={126} stagger={6} />
      <At y={706}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip bg={A}>ST 2110-30 / -31</Chip>
          <Chip bg={C.ink}>AES67</Chip>
          <Chip bg={C.ink}>NMOS IS-04 / IS-05</Chip>
        </div>
      </At>
    </B>

    <B from={230} to={340} fade={13}>
      <Shot id={24} box={{x: 0, y: 348, w: SAFE.w, h: 330}} dur={110} fit="contain" pad={14} kb={{z: [1, 1]}} />
      <At y={706}>
        <Sub size={28} color={C.inkSoft} style={{maxWidth: 884}}>
          {'ST 2022-7 runs the same essence down two paths at once, so a lost\npacket on one network is never a lost sample on air.'}
        </Sub>
      </At>
    </B>

    <At x={0} y={834} w={SAFE.w} h={200}>
      <div
        style={{
          height: '100%',
          backgroundColor: C.paperHi,
          border: `1px solid ${C.line}`,
          borderRadius: 14,
          padding: '18px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <Connector kind="rj45" w={196} h={112} color={C.ink} strokeWidth={3.4} />
        <div style={{flex: 1}}>
          <Micro color={A} size={15}>
            PHYSICAL INTERFACE
          </Micro>
          <Spec size={27} color={C.ink} weight={500} tracking={0.4} style={{marginTop: 9}}>
            RJ45 · PORT 1 / PORT 2 / CONTROL
          </Spec>
        </div>
      </div>
    </At>
    <At y={1064}>
      <Spec size={22} color={C.inkDim}>
        64×64 @ 48 kHz · 32×32 @ 96 kHz · ST 2022-7 REDUNDANCY
      </Spec>
    </At>

    <ContactStrip part={P} y={Y.strip} dur={340} index={2} delay={286} />
    <Cue name="card-slide" at={6} volume={0.62} />
    <Cue name="data-sweep" at={30} volume={0.42} />
    <Cue name="whoosh-air" at={116} volume={0.42} />
    <TickRun from={130} count={16} every={6} volume={0.26} hi />
    <Cue name="whoosh-rev" at={224} volume={0.38} />
    <Cue name="net-ping" at={238} volume={0.44} />
  </Stage>
);

// ===========================================================================
// S04 — ST 2110 control & facility topologies                          295f
// assets: 29, 31, 32, 33, 34
// ===========================================================================
export const P3S04: React.FC = () => (
  <Stage part={P} wash={0.92}>
    <AmbientPhoto id={32} opacity={0.44} blur={48} />
    <PartMark part={P} label="THE PROTOCOL LAYER · TOPOLOGY" dur={295} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        PATCHING, SYNC AND CONFIGURATION
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={88} lh={0.88}>
        {'MANAGED LIKE\nEVERYTHING ELSE.'}
      </Display>
    </At>

    <B from={0} to={136} fade={13}>
      <Grid ids={[29, 31]} dur={148} cols={1} box={{x: 0, y: 348, w: SAFE.w, h: 560}} gap={13} fit="contain" pad={10} delay={4} stagger={6} />
      <At y={936}>
        <Sub size={27} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Destinations, PTP sync status and configuration are handled from the\nsame browser the rest of the plant is managed from.'}
        </Sub>
      </At>
    </B>

    <B from={130} to={295} fade={13}>
      <Grid ids={[32, 33, 34]} dur={165} cols={1} box={{x: 0, y: 348, w: SAFE.w, h: 620}} gap={11} fit="contain" pad={8} delay={134} stagger={6} />
      <At y={996}>
        <Spec size={23} color={C.inkSoft}>
          STUDIO · STADIUM REMOTE PRODUCTION · OB VAN
        </Spec>
        <Spec size={21} color={C.inkDim} style={{marginTop: 10}}>
          ONE CARD, THE SAME ROLE IN EVERY TOPOLOGY
        </Spec>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={295} index={3} delay={22} />
    <Cue name="click-ui" at={16} volume={0.4} />
    <Cue name="data-sweep" at={40} volume={0.38} />
    <Cue name="whoosh-air" at={124} volume={0.42} />
    <Cue name="impact-soft" at={134} volume={0.42} />
    <TickRun from={142} count={16} every={7} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S05..S08 — the four remaining cards
// ===========================================================================
export const P3S05: React.FC = () => (
  <CardScene
    dur={230}
    kicker="THE PROTOCOL LAYER · DIGITAL OUTBOARD"
    name="TASCAM IF-AE16"
    headline={'CLOCK-SAFE\nDIGITAL LINKS.'}
    connector="db25"
    connectorLabel={'DB25 · AES/EBU IN AND OUT'}
    frontId={16}
    cardId={17}
    body={'Sixteen in and sixteen out of AES/EBU, with sample rate conversion\nbuilt in — high-end processors and transmitters connect without\nclocking errors.'}
    chips={[
      {label: '16 IN / 16 OUT'},
      {label: 'SRC 32k – 192 kHz', accent: true},
      {label: 'AES/EBU'},
    ]}
    spec="107 × 40 × 161.5 mm · 0.222 kg"
    strip={4}
  />
);

export const P3S06: React.FC = () => (
  <CardScene
    dur={220}
    kicker="THE PROTOCOL LAYER · ANALOG OUT"
    name="TASCAM IF-AN16/OUT"
    headline={'SIXTEEN MORE\nANALOG SENDS.'}
    connector="db25"
    connectorLabel={'DUAL DB25 · ANALOG LINE OUT'}
    frontId={18}
    cardId={19}
    body={'Sixteen additional analog line outputs for in-ear monitor racks and\nmulti-zone distribution amplifiers, with per-output attenuation.'}
    chips={[{label: '16 ANALOG OUT'}, {label: '0 TO −14 dB IN 0.5 STEPS', accent: true}]}
    spec="107 × 40 × 161.5 mm · 0.240 kg"
    strip={5}
  />
);

export const P3S07: React.FC = () => (
  <CardScene
    dur={240}
    kicker="THE PROTOCOL LAYER · MADI"
    name="TASCAM IF-MA64/EX"
    headline={'INTO EXISTING\nMADI ROUTERS.'}
    connector="optical"
    connectorLabel={'OPTICAL AND COAXIAL MADI'}
    frontId={22}
    cardId={23}
    body={'Sixty-four channels each way over MADI — the interface large studio\nrouters and OB vans were already wired for, so none of it is stranded.'}
    chips={[{label: '64 IN / 64 OUT'}, {label: 'MADI OPTICAL'}, {label: 'MADI COAXIAL', accent: true}]}
    spec="LEGACY ROUTING PRESERVED · NO EXTERNAL CONVERSION"
    strip={6}
  />
);

export const P3S08: React.FC = () => (
  <CardScene
    dur={235}
    kicker="THE PROTOCOL LAYER · EXPANDED DANTE"
    name="TASCAM IF-DA64"
    headline={'A 128 × 128\nDANTE MATRIX.'}
    connector="rj45"
    connectorLabel={'RJ45 · PRIMARY AND SECONDARY'}
    frontId={20}
    cardId={21}
    body={'Sixty-four more Dante channels on top of the sixty-four already built\ninto the console — the capacity a stadium-scale network needs.'}
    chips={[{label: '+64 IN / +64 OUT'}, {label: '128 × 128 TOTAL', accent: true}, {label: 'REDUNDANT PORTS'}]}
    spec="COMBINES WITH THE CONSOLE'S BUILT-IN 64 × 64"
    strip={7}
  />
);

// ===========================================================================
// S09 — Facility control integration                                   240f
// assets: 73, 90, 118, 99, 100, 101
// ===========================================================================
export const P3S09: React.FC = () => (
  <Stage part={P}>
    <AmbientPhoto id={100} opacity={0.44} blur={46} />
    <PartMark part={P} label="THE PROTOCOL LAYER · INTEGRATION" dur={240} />

    <At y={Y.kicker}>
      <Kicker color={A} size={19} tracking={4.6}>
        UNDER FACILITY CONTROL
      </Kicker>
    </At>
    <At y={Y.head} w={SAFE.w}>
      <Display size={88} lh={0.88}>
        {'PART OF THE PLANT,\nNOT A DEVICE IN IT.'}
      </Display>
    </At>

    <B from={0} to={128} fade={12}>
      <Grid ids={[73, 90, 118]} dur={140} cols={1} box={{x: 0, y: 348, w: SAFE.w, h: 560}} gap={11} fit="contain" pad={8} delay={4} stagger={5} />
      <At y={932}>
        <Sub size={27} color={C.inkSoft} style={{maxWidth: 884}}>
          {'Fader, mute and status exchange with a control management system —\nalongside the router, the cameras and the video switcher.'}
        </Sub>
      </At>
    </B>

    <B from={122} to={240} fade={12}>
      <Grid ids={[99, 100, 101]} dur={118} cols={1} box={{x: 0, y: 348, w: SAFE.w, h: 560}} gap={12} delay={126} stagger={6} />
      <At y={932}>
        <Spec size={23} color={C.inkSoft}>
          CLOCK STATUS · SYSTEM TEMPERATURE · FAN STATUS
        </Spec>
        <Spec size={21} color={C.inkDim} style={{marginTop: 10}}>
          MONITORED LIKE ANY OTHER BROADCAST ASSET
        </Spec>
      </At>
    </B>

    <ContactStrip part={P} y={Y.strip} dur={240} index={0} delay={186} />
    <Cue name="data-sweep" at={8} volume={0.4} />
    <Cue name="click-ui" at={34} volume={0.36} />
    <Cue name="whoosh-air" at={116} volume={0.42} />
    <Cue name="impact-soft" at={126} volume={0.42} />
    <TickRun from={132} count={12} every={8} volume={0.24} hi />
  </Stage>
);

// ===========================================================================
// S10 — Close of series                                                130f
// ===========================================================================
export const P3S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage part={P}>
      <AmbientPhoto id={97} opacity={0.48} blur={46} />
      <AmbientMotes part={P} opacity={0.5} />
      <PartMark part={P} label={CONTINUITY[3].kicker} dur={130} />

      <Grid ids={[102, 100]} dur={130} cols={1} box={{x: 0, y: 128, w: SAFE.w, h: 690}} gap={16} delay={2} stagger={6} />

      <At y={856} w={SAFE.w}>
        <Rule w={104} color={A} thickness={4} />
        <Display size={80} lh={0.90} style={{marginTop: 24, opacity: ramp(f, [10, 32], [0, 1])}}>
          {CONTINUITY[3].line}
        </Display>
        <Sub
          size={31}
          italic={false}
          color={A}
          style={{marginTop: 18, opacity: ramp(f, [34, 58], [0, 1])}}
        >
          {CONTINUITY[3].next}
        </Sub>
        <div style={{marginTop: 32, display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 46, height: 2, backgroundColor: C.line}} />
          <Micro color={C.inkDim} size={15}>
            PARTS 1 – 3 COMPLETE
          </Micro>
        </div>
      </At>

      <ContactStrip part={P} y={Y.strip} dur={130} index={1} delay={44} />
      <Cue name="impact-deep" at={4} volume={0.56} />
      <Cue name="shimmer" at={30} volume={0.44} />
      <Cue name="swell" at={54} volume={0.36} />
    </Stage>
  );
};

// ===========================================================================
// S11 — CTA & Shivansh Electronics outro                               340f
// ===========================================================================
export const P3S11: React.FC = () => (
  <Stage part={P} wash={1}>
    <AmbientPhoto id={97} opacity={0.38} blur={54} />
    <AmbientMotes part={P} opacity={0.45} />
    <Outro part={P} dur={340} />
    <Cue name="impact-deep" at={2} volume={0.56} />
    <Cue name="swell" at={6} volume={0.44} />
    <Cue name="shimmer" at={40} volume={0.34} />
    <TickRun from={46} count={12} every={5} volume={0.18} />
    <Cue name="chime-final" at={286} volume={0.5} />
  </Stage>
);
