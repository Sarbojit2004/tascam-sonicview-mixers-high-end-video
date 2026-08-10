import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, LF_SAFE, lfAccent} from '../../lib/lf-theme';
import {ramp} from '../../lib/anim';
import {At, LFBackdrop, LFMotes, LFStage} from '../../components/lf/LFStage';
import {ChipRow, LY, Panel, Para, SpecList, TitleBlock} from '../../components/lf/LFLayouts';
import {Fill, Mosaic, Plate} from '../../components/lf/LFMedia';
import {ChapterMark, LFOutro} from '../../components/lf/LFBrand';
import {Connector, ConnectorKind} from '../../components/Diagram';
import {Display, Micro, Rule, Spec, Sub} from '../../components/Type';
import {B} from '../../components/Beat';
import {LFCue, LFTickRun} from '../../components/lf/LFCue';
import {CONTINUITY} from '../../lib/copy';

/**
 * LONG-FORM PART 3 — "THE PROTOCOL LAYER"  ·  298.000 s / 8,940 frames
 *
 * The IF-Series expansion cards, carrying the final 27 coverage-relevant
 * assets. Where the reel had to compress all five cards into roughly ninety
 * seconds, this format gives IF-ST2110 four chapters of its own (2,640 frames)
 * and each remaining card a full chapter — which is the right weighting,
 * because ST 2110 is the one that changes what kind of facility the console
 * can live in.
 *
 * The repository has imagery for FIVE cards. The brief also documents
 * IF-MA64/BN (64-channel MADI over coaxial BNC) but contains no photograph of
 * it, so no chapter invents one; the coaxial story is told on IF-MA64/EX,
 * which physically carries both optical and coaxial MADI connectors.
 *
 * Branding is NOT placed in these chapters — BrandingLayer renders every logo
 * appearance from src/lib/lf-brand-plan.ts so the cadence stays auditable.
 */

const P = 3 as const;
const A = lfAccent(P);
const W = LF_SAFE.w;

// ---------------------------------------------------------------------------
/**
 * Shared chapter body for the four single-card segments (C07..C10).
 *
 * Each card gets the same three-part reading: the product itself, the physical
 * interface that makes it functionally distinct, and the verified numbers. The
 * connector drawing matters more here than in the reel — at 1920x1080 with
 * twenty-three seconds a viewer has time to check the card against the sockets
 * on the back of their own rack.
 */
const LFCardChapter: React.FC<{
  dur: number;
  mark: string;
  n: string;
  name: string;
  head: string;
  headSize?: number;
  frontId: number;
  cardId: number;
  connector: ConnectorKind;
  connectorLabel: string;
  body: string;
  detail: string;
  specs: {k: string; v: string}[];
  chips: {label: string; accent?: boolean}[];
  backdropId: number;
}> = ({
  dur,
  mark,
  n,
  name,
  head,
  headSize = 76,
  frontId,
  cardId,
  connector,
  connectorLabel,
  body,
  detail,
  specs,
  chips,
  backdropId,
}) => {
  const half = Math.round(dur * 0.5);
  return (
    <LFStage part={P}>
      <LFBackdrop id={backdropId} opacity={0.16} blur={58} />
      <ChapterMark part={P} label={mark} dur={dur} n={n} />

      <TitleBlock part={P} kicker={name} head={head} headSize={headSize} w={860} />

      {/* the card, front then angled — both source shots are wide, so the
          plate is sized to their proportion rather than to the column */}
      <B from={0} to={half + 8} fade={16}>
        <Plate id={frontId} box={{x: 0, y: 366, w: 1000, h: 348}} dur={half + 40} pad={16} />
        <Para y={744} w={1000} size={26} delay={30}>
          {body}
        </Para>
      </B>
      <B from={half} to={dur} fade={16}>
        <Plate id={cardId} box={{x: 0, y: 366, w: 1000, h: 348}} dur={half + 40} pad={16} />
        <Para y={744} w={1000} size={26} delay={half + 28}>
          {detail}
        </Para>
      </B>

      {/* physical interface — the thing that makes this card distinct */}
      <At x={1060} y={130} w={W - 1060} h={250}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 16,
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <Connector kind={connector} w={210} h={120} color={C.ink} strokeWidth={3.4} />
          <div style={{flex: 1}}>
            <Micro color={A} size={15}>
              PHYSICAL INTERFACE
            </Micro>
            <Spec size={26} color={C.ink} weight={500} tracking={0.3} style={{marginTop: 10}}>
              {connectorLabel}
            </Spec>
          </div>
        </div>
      </At>

      <SpecList part={P} x={1060} y={430} w={W - 1060} delay={40} size={24} items={specs} />

      <ChipRow part={P} x={1060} y={752} w={W - 1060} delay={70} items={chips} />

      <LFCue name="card-slide" at={6} volume={0.62} />
      <LFCue name="impact-soft" at={26} volume={0.4} />
      <LFCue name="latch" at={44} volume={0.36} />
      <LFTickRun from={60} count={14} every={9} volume={0.22} hi />
      <LFCue name="page-turn" at={half - 8} volume={0.4} />
      <LFCue name="click-hard" at={half + 6} volume={0.34} />
    </LFStage>
  );
};

// ===========================================================================
// C01 — Cold open: the console adapts                                  420f
// assets: 97, 102
// ===========================================================================
export const L3C01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LFStage part={P}>
      <LFBackdrop id={97} opacity={0.22} blur={58} />
      <LFMotes part={P} opacity={0.5} />
      <ChapterMark part={P} label="PART 3 OF 3 · THE PROTOCOL LAYER" dur={420} n="01" />

      <B from={0} to={300} fade={20}>
        <At x={0} y={106} w={W}>
          <div style={{textAlign: 'center'}}>
            <Micro color={A} size={20} tracking={5.0}>
              TASCAM SONICVIEW ECOSYSTEM · THE PROTOCOL LAYER
            </Micro>
          </div>
        </At>
        <At x={0} y={146} w={W}>
          <Display size={112} lh={0.90} align="center" style={{opacity: ramp(f, [24, 54], [0, 1])}}>
            {'THE CONSOLE ADAPTS\nTO THE FACILITY.'}
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
            {'Not the other way around — and not through a rack of converters.'}
          </Sub>
        </At>
      </B>

      <B from={300} to={420} fade={16}>
        <Fill id={102} box={{x: 0, y: 168, w: W, h: 560}} dur={130} kb={{z: [1.04, 1.12]}} shade="bottom" />
        <At x={0} y={772} w={W}>
          <Display size={82} lh={0.92} align="center" style={{opacity: ramp(f, [316, 344], [0, 1])}}>
            {'ONE CONSOLE. EVERY STANDARD.'}
          </Display>
        </At>
        <At x={0} y={886} w={W}>
          <Spec size={26} color={C.inkDim} style={{textAlign: 'center', opacity: ramp(f, [330, 358], [0, 1])}}>
            ST 2110 · AES/EBU · MADI · ANALOG · EXPANDED DANTE
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
// C02 — Two expansion slots                                            480f
// assets: 72, 96
// ===========================================================================
export const L3C02: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={72} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · SLOTS" dur={480} n="02" />

    <TitleBlock
      part={P}
      kicker="TWO INTERNAL EXPANSION SLOTS"
      head={'SPECIFIED LAST.\nCHANGED LATER.'}
      headSize={82}
      w={800}
      sub={'A card slides into the rear bay and the console starts speaking a new protocol natively — no external conversion anywhere in the signal path.'}
      subSize={26}
    />

    <B from={0} to={250} fade={16}>
      <Plate id={72} box={{x: 900, y: 130, w: W - 900, h: 420}} dur={270} pad={18} />
    </B>
    <B from={242} to={480} fade={16}>
      <Plate id={96} box={{x: 900, y: 130, w: W - 900, h: 420}} dur={260} pad={18} />
    </B>

    <ChipRow
      part={P}
      y={620}
      w={800}
      delay={50}
      items={[{label: '2 SLOTS PER CONSOLE', accent: true}, {label: 'FIELD-INSTALLABLE'}]}
    />

    <Para y={700} w={800} size={25} delay={80}>
      {'It is the difference between a console that has to match the facility it was bought for, and one that can follow the facility as the facility changes.'}
    </Para>

    <Panel
      part={P}
      label="WHAT THIS PROTECTS"
      body={'The purchase decision does not have to\npredict the next standards migration.'}
      x={900}
      y={600}
      w={W - 900}
      h={190}
      delay={90}
      size={26}
    />

    <LFCue name="card-slide" at={8} volume={0.66} />
    <LFCue name="stinger-chapter" at={16} volume={0.38} />
    <LFCue name="card-slide" at={244} volume={0.5} />
    <LFTickRun from={60} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C03 — IF-ST2110, the card                                            600f
// assets: 24, 30
// ===========================================================================
export const L3C03: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={30} opacity={0.18} blur={56} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · IP BROADCAST" dur={600} n="03" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        TASCAM IF-ST2110
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={86} lh={0.92}>
        {'ONTO THE SAME IP FABRIC AS THE VIDEO.'}
      </Display>
    </At>

    <B from={0} to={300} fade={18}>
      <Fill id={30} box={{x: 0, y: 316, w: 1100, h: 444}} dur={320} kb={{z: [1.03, 1.10]}} />
      <Panel
        part={P}
        label="WHY IT MATTERS"
        body={'A broadcast plant that has already moved\nits video to IP does not want an audio\nisland sitting beside it.'}
        x={1136}
        y={316}
        w={W - 1136}
        h={444}
        delay={40}
        size={26}
      />
    </B>

    <B from={292} to={600} fade={18}>
      <Plate id={24} box={{x: 320, y: 316, w: 460, h: 444}} dur={320} pad={18} />
      <SpecList
        part={P}
        x={1136}
        y={360}
        w={W - 1136}
        delay={306}
        size={24}
        items={[
          {k: 'MEDIA PORTS', v: 'Port 1 / Port 2'},
          {k: 'CONTROL', v: 'Separate port'},
          {k: 'CAPACITY', v: '64 × 64 at 48 kHz'},
          {k: 'AT HIGH RATE', v: '32 × 32 at 96 kHz'},
        ]}
      />
      <Para x={1136} y={600} w={W - 1136} size={25} delay={330}>
        {'The console joins the plant as a native audio essence source, not as a device something else has to translate.'}
      </Para>
    </B>

    <LFCue name="card-slide" at={6} volume={0.62} />
    <LFCue name="data-sweep" at={30} volume={0.44} />
    <LFTickRun from={50} count={18} every={8} volume={0.24} hi />
    <LFCue name="whoosh-grain" at={286} volume={0.42} />
    <LFCue name="net-ping" at={306} volume={0.42} />
  </LFStage>
);

// ===========================================================================
// C04 — ST 2110, what it carries                                       660f
// assets: 27, 28
// ===========================================================================
export const L3C04: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={27} opacity={0.14} blur={60} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · THE STANDARD" dur={660} n="04" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        SMPTE ST 2110 — THE AUDIO ESSENCE PARTS
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={84} lh={0.92}>
        {'A SUITE, NOT A CABLE.'}
      </Display>
    </At>

    <B from={0} to={320} fade={18}>
      <Plate id={27} box={{x: 0, y: 300, w: 640, h: 460}} dur={340} pad={16} />
      <SpecList
        part={P}
        x={700}
        y={330}
        w={1116}
        delay={30}
        size={25}
        items={[
          {k: 'ST 2110-30', v: 'Uncompressed PCM audio'},
          {k: 'ST 2110-31', v: 'Transparent AES3 transport'},
          {k: 'AES67', v: 'Interoperable audio-over-IP'},
        ]}
      />
      <Para x={700} y={560} w={1116} size={26} delay={60}>
        {'Video, audio and ancillary data travel as separate essence streams on one network. That separation is the whole point of the standard — an audio change stops meaning a video change.'}
      </Para>
    </B>

    <B from={312} to={660} fade={18}>
      <Plate id={28} box={{x: 0, y: 300, w: 640, h: 460}} dur={360} pad={16} />
      <Panel
        part={P}
        label="ST 2022-7 SEAMLESS PROTECTION"
        body={'The same essence is sent down two independent network paths at\nonce, and the receiver reconstructs from whichever packets arrive.\nA lost packet on one path is never a lost sample on air.'}
        x={700}
        y={300}
        w={1116}
        h={280}
        delay={326}
        size={25}
      />
      <Para x={700} y={614} w={1116} size={26} delay={356}>
        {'It is the same idea as a redundant Dante network, written into a broadcast standard — and it is why a facility will accept an IP audio path at all.'}
      </Para>
    </B>

    <LFCue name="whoosh-tight" at={0} volume={0.42} />
    <LFCue name="click-hard" at={22} volume={0.36} />
    <LFTickRun from={44} count={16} every={9} volume={0.24} hi />
    <LFCue name="page-turn" at={306} volume={0.4} />
    <LFCue name="net-ping" at={330} volume={0.4} />
  </LFStage>
);

// ===========================================================================
// C05 — ST 2110, control & sync                                        540f
// assets: 29, 31
// ===========================================================================
export const L3C05: React.FC = () => (
  <LFStage part={P} wash={0.94}>
    <LFBackdrop id={31} opacity={0.14} blur={60} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · CONTROL & SYNC" dur={540} n="05" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        DISCOVERY, PATCHING AND PTP
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={84} lh={0.92}>
        {'MANAGED LIKE EVERYTHING ELSE IN THE PLANT.'}
      </Display>
    </At>

    <B from={0} to={280} fade={18}>
      <Plate id={29} box={{x: 0, y: 340, w: 1180, h: 420}} dur={300} pad={16} />
      <Panel
        part={P}
        label="NMOS IS-04 / IS-05"
        body={'The card registers itself and its\nsenders, then accepts connection\nrequests from the facility\'s own\nbroadcast controller.'}
        x={1216}
        y={340}
        w={W - 1216}
        h={420}
        delay={40}
        size={26}
      />
    </B>

    <B from={272} to={540} fade={18}>
      <Plate id={31} box={{x: 0, y: 340, w: 1180, h: 420}} dur={290} pad={16} />
      <Panel
        part={P}
        label="PTP CLOCK"
        body={'Sync comes from the same grandmaster\nthe cameras and the switcher follow,\nnot from a separate audio clock\ndistribution.'}
        x={1216}
        y={340}
        w={W - 1216}
        h={420}
        delay={286}
        size={26}
      />
    </B>

    <Para y={790} w={1500} size={26} delay={60}>
      {'Configuration, destination patching and clock status all happen in a browser — which means the engineer who looks after the rest of the plant can look after this too.'}
    </Para>

    <LFCue name="click-ui" at={16} volume={0.4} />
    <LFCue name="data-sweep" at={40} volume={0.4} />
    <LFTickRun from={60} count={16} every={8} volume={0.24} hi />
    <LFCue name="whoosh-tight" at={266} volume={0.42} />
    <LFCue name="click-ui" at={296} volume={0.36} />
  </LFStage>
);

// ===========================================================================
// C06 — ST 2110, facility topologies                                   840f
// assets: 32, 33, 34
// ===========================================================================
export const L3C06: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={33} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · TOPOLOGIES" dur={840} n="06" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        THE SAME CARD, THREE DIFFERENT BUILDINGS
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={84} lh={0.92}>
        {'WHERE THIS ACTUALLY GETS DEPLOYED.'}
      </Display>
    </At>

    <B from={0} to={290} fade={18}>
      <Plate id={32} box={{x: 0, y: 316, w: 1180, h: 444}} dur={310} pad={16} />
      <Panel
        part={P}
        label="STUDIO"
        body={'Control room, studio floor and\nmaster control on one fabric.\nThe audio path stops being a\nseparate infrastructure to plan,\ncable and maintain.'}
        x={1216}
        y={316}
        w={W - 1216}
        h={444}
        delay={40}
        size={26}
      />
    </B>

    <B from={282} to={570} fade={18}>
      <Plate id={33} box={{x: 0, y: 316, w: 1180, h: 444}} dur={310} pad={16} />
      <Panel
        part={P}
        label="STADIUM REMOTE PRODUCTION"
        body={'Operators stay at base while the\nvenue carries only the network.\nThe console can be at either end\nof that link without changing\nhow it is configured.'}
        x={1216}
        y={316}
        w={W - 1216}
        h={444}
        delay={300}
        size={26}
      />
    </B>

    <B from={562} to={840} fade={18}>
      <Plate id={34} box={{x: 0, y: 316, w: 1180, h: 444}} dur={300} pad={16} />
      <Panel
        part={P}
        label="OB VAN"
        body={'Weight and rack space are the\nconstraint, and an IP truck has\nalready committed to the fabric.\nThe card removes the converter\nrack it would otherwise need.'}
        x={1216}
        y={316}
        w={W - 1216}
        h={444}
        delay={580}
        size={26}
      />
    </B>

    <Para y={790} w={1500} size={26} delay={80}>
      {'One card, the same role in every one of them. That is what makes it an architecture decision rather than a product choice.'}
    </Para>

    <LFCue name="whoosh-deep" at={0} volume={0.42} />
    <LFCue name="stinger-chapter" at={12} volume={0.4} />
    <LFTickRun from={40} count={16} every={9} volume={0.22} hi />
    <LFCue name="page-turn" at={276} volume={0.4} />
    <LFCue name="whoosh-grain" at={556} volume={0.42} />
    <LFCue name="impact-soft" at={572} volume={0.4} />
  </LFStage>
);

// ===========================================================================
// C07..C10 — the four remaining cards
// ===========================================================================
export const L3C07: React.FC = () => (
  <LFCardChapter
    dur={690}
    mark="THE PROTOCOL LAYER · DIGITAL OUTBOARD"
    n="07"
    name="TASCAM IF-AE16"
    head={'CLOCK-SAFE\nDIGITAL LINKS.'}
    headSize={78}
    frontId={16}
    cardId={17}
    backdropId={17}
    connector="db25"
    connectorLabel="DB25 · AES/EBU IN AND OUT"
    body={'Sixteen channels in and sixteen out of AES/EBU on DB25 — the connection every piece of digital outboard in a rack already has.'}
    detail={'Sample rate conversion is built into the card, so a processor or a transmitter running on its own clock connects without the clicks and dropouts a clock mismatch produces.'}
    specs={[
      {k: 'INPUTS', v: '16 AES/EBU'},
      {k: 'OUTPUTS', v: '16 AES/EBU'},
      {k: 'SRC RANGE', v: '32 kHz – 192 kHz'},
      {k: 'DIMENSIONS', v: '107 × 40 × 161.5 mm'},
      {k: 'WEIGHT', v: '0.222 kg'},
    ]}
    chips={[{label: '16 IN / 16 OUT'}, {label: 'SAMPLE RATE CONVERSION', accent: true}]}
  />
);

export const L3C08: React.FC = () => (
  <LFCardChapter
    dur={630}
    mark="THE PROTOCOL LAYER · ANALOG OUT"
    n="08"
    name="TASCAM IF-AN16/OUT"
    head={'SIXTEEN MORE\nANALOG SENDS.'}
    headSize={78}
    frontId={18}
    cardId={19}
    backdropId={19}
    connector="db25"
    connectorLabel="DUAL DB25 · ANALOG LINE OUT"
    body={'Sixteen additional analog line outputs, for in-ear monitor racks, multi-zone distribution amplifiers and anything else that still wants a line-level feed.'}
    detail={'Each output has its own attenuation, adjustable from 0 to −14 dB in half-decibel steps — so levels are matched at the card rather than in whatever it feeds.'}
    specs={[
      {k: 'OUTPUTS', v: '16 analog line'},
      {k: 'ATTENUATION', v: '0 to −14 dB'},
      {k: 'STEP SIZE', v: '0.5 dB'},
      {k: 'DIMENSIONS', v: '107 × 40 × 161.5 mm'},
      {k: 'WEIGHT', v: '0.240 kg'},
    ]}
    chips={[{label: '16 ANALOG OUT'}, {label: 'PER-OUTPUT ATTENUATION', accent: true}]}
  />
);

export const L3C09: React.FC = () => (
  <LFCardChapter
    dur={690}
    mark="THE PROTOCOL LAYER · MADI"
    n="09"
    name="TASCAM IF-MA64/EX"
    head={'INTO EXISTING\nMADI ROUTERS.'}
    headSize={78}
    frontId={22}
    cardId={23}
    backdropId={23}
    connector="optical"
    connectorLabel="OPTICAL AND COAXIAL MADI"
    body={'Sixty-four channels each way over MADI — the interface large studio routers and OB vans were wired for long before audio-over-IP existed.'}
    detail={'The card carries both optical and coaxial MADI connectors, so it meets whichever the existing plant standardised on. None of that infrastructure becomes stranded.'}
    specs={[
      {k: 'CHANNELS', v: '64 in / 64 out'},
      {k: 'OPTICAL', v: 'MADI over fibre'},
      {k: 'COAXIAL', v: 'MADI over BNC'},
      {k: 'ROUTING', v: 'Existing routers preserved'},
    ]}
    chips={[{label: '64 IN / 64 OUT'}, {label: 'OPTICAL + COAXIAL', accent: true}, {label: 'NO EXTERNAL CONVERSION'}]}
  />
);

export const L3C10: React.FC = () => (
  <LFCardChapter
    dur={690}
    mark="THE PROTOCOL LAYER · EXPANDED DANTE"
    n="10"
    name="TASCAM IF-DA64"
    head={'A 128 × 128\nDANTE MATRIX.'}
    headSize={78}
    frontId={20}
    cardId={21}
    backdropId={21}
    connector="rj45"
    connectorLabel="RJ45 · PRIMARY AND SECONDARY"
    body={'Sixty-four more Dante channels each way, on top of the sixty-four already built into every Sonicview — a total of 128 × 128 on one console.'}
    detail={'That is the capacity a stadium-scale or multi-building network runs out of first, and the card adds it with its own redundant primary and secondary ports.'}
    specs={[
      {k: 'CARD ADDS', v: '64 in / 64 out'},
      {k: 'BUILT INTO CONSOLE', v: '64 in / 64 out'},
      {k: 'TOTAL', v: '128 × 128'},
      {k: 'PORTS', v: 'Primary + secondary'},
    ]}
    chips={[{label: '+64 IN / +64 OUT'}, {label: '128 × 128 TOTAL', accent: true}, {label: 'REDUNDANT PORTS'}]}
  />
);

// ===========================================================================
// C11 — Choosing between them                                          690f
// assets: 99, 100
// ===========================================================================
export const L3C11: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={100} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · SPECIFYING" dur={690} n="11" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        TWO SLOTS, FIVE CARDS
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={84} lh={0.92}>
        {'THE CHOICE IS THE BUILDING.'}
      </Display>
    </At>

    <B from={0} to={360} fade={18}>
      <SpecList
        part={P}
        x={0}
        y={330}
        w={1140}
        delay={20}
        size={25}
        items={[
          {k: 'IP BROADCAST PLANT', v: 'IF-ST2110'},
          {k: 'DIGITAL OUTBOARD RACK', v: 'IF-AE16'},
          {k: 'IEM & ZONE AMPS', v: 'IF-AN16/OUT'},
          {k: 'EXISTING MADI ROUTER', v: 'IF-MA64/EX'},
          {k: 'LARGE DANTE NETWORK', v: 'IF-DA64'},
        ]}
      />
      <Para y={604} w={1140} size={26} delay={60}>
        {'Each row is a facility that already exists — a plant that has moved to IP, a rack of digital outboard, a MADI router nobody is going to rip out. The card is chosen to meet it.'}
      </Para>
      {/* portrait source; the plate follows the picture rather than the column */}
      <Plate id={99} box={{x: 1256, y: 180, w: 560, h: 680}} dur={380} pad={16} />
    </B>

    <B from={352} to={690} fade={18}>
      <Panel
        part={P}
        label="AND THE SLOTS COMBINE"
        body={'Two cards can serve two different requirements at once — a MADI\nrouter on one side of the console and an IP fabric on the other,\nwith the mix engine sitting between them as the translation.'}
        x={0}
        y={300}
        w={1140}
        h={280}
        delay={366}
        size={25}
      />
      <Para y={614} w={1140} size={26} delay={396}>
        {'Which is the quiet answer to the migration question: a facility part-way through a standards change does not have to run two systems while it finishes.'}
      </Para>
      <Plate id={100} box={{x: 1200, y: 320, w: W - 1200, h: 380}} dur={360} pad={16} />
    </B>

    <LFCue name="whoosh-tight" at={0} volume={0.42} />
    <LFCue name="click-hard" at={24} volume={0.36} />
    <LFTickRun from={44} count={18} every={9} volume={0.24} hi />
    <LFCue name="page-turn" at={346} volume={0.4} />
    <LFCue name="latch" at={368} volume={0.38} />
  </LFStage>
);

// ===========================================================================
// C12 — Facility control integration                                   600f
// assets: 73, 90, 118
// ===========================================================================
export const L3C12: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={90} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · INTEGRATION" dur={600} n="12" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        UNDER FACILITY CONTROL
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1500}>
      <Display size={84} lh={0.92}>
        {'PART OF THE PLANT, NOT A DEVICE IN IT.'}
      </Display>
    </At>

    <B from={0} to={300} fade={18}>
      <Mosaic
        ids={[73, 90]}
        dur={320}
        cols={2}
        box={{x: 0, y: 316, w: 1360, h: 444}}
        gap={24}
        delay={20}
        pad={14}
      />
      <Panel
        part={P}
        label="EXCHANGED WITH THE CONTROL SYSTEM"
        body={'Fader position.\nMute state.\nDevice status.'}
        x={1400}
        y={316}
        w={W - 1400}
        h={444}
        delay={40}
        size={27}
      />
    </B>

    <B from={292} to={600} fade={18}>
      <Plate id={118} box={{x: 0, y: 316, w: 1360, h: 444}} dur={320} pad={16} />
      <Panel
        part={P}
        label="MONITORED LIKE ANY ASSET"
        body={'Clock status.\nSystem temperature.\nFan status.'}
        x={1400}
        y={316}
        w={W - 1400}
        h={444}
        delay={306}
        size={27}
      />
    </B>

    <Para y={790} w={1500} size={26} delay={60}>
      {'The console sits on the facility control system alongside the router, the cameras and the video switcher — which is how a broadcast engineer expects to find it.'}
    </Para>

    <LFCue name="data-sweep" at={8} volume={0.42} />
    <LFCue name="click-ui" at={34} volume={0.36} />
    <LFTickRun from={54} count={16} every={9} volume={0.24} hi />
    <LFCue name="whoosh-tight" at={286} volume={0.42} />
    <LFCue name="net-ping" at={310} volume={0.4} />
  </LFStage>
);

// ===========================================================================
// C13 — The complete architecture                                      600f
// assets: 101
// ===========================================================================
export const L3C13: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={101} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE PROTOCOL LAYER · THE WHOLE SYSTEM" dur={600} n="13" />

    <TitleBlock
      part={P}
      kicker="THREE PARTS, ONE ARCHITECTURE"
      head={'WHAT THE THREE\nPARTS ADD UP TO.'}
      headSize={76}
      w={860}
    />

    <SpecList
      part={P}
      y={400}
      w={900}
      delay={30}
      size={25}
      items={[
        {k: 'THE HUB', v: '16XP, 24XP and the dp axis'},
        {k: 'THE NETWORK', v: 'Dante and the SB-16D'},
        {k: 'THE PROTOCOL LAYER', v: 'The IF-Series cards'},
      ]}
    />

    <Para y={580} w={900} size={26} delay={70}>
      {'A processing core that does not change, a transport that reaches wherever the inputs are, and an interface layer that matches whatever the building already speaks.'}
    </Para>

    <Plate id={101} box={{x: 960, y: 130, w: W - 960, h: 640}} dur={600} pad={18} />

    <LFCue name="bloom" at={0} volume={0.44} />
    <LFCue name="lift-air" at={34} volume={0.36} />
    <LFTickRun from={54} count={16} every={9} volume={0.22} />
    <LFCue name="impact-soft" at={300} volume={0.36} />
  </LFStage>
);

// ===========================================================================
// C14 — Close of series                                                300f
// ===========================================================================
export const L3C14: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LFStage part={P}>
      <LFBackdrop id={97} opacity={0.18} blur={58} />
      <LFMotes part={P} opacity={0.45} />
      <ChapterMark part={P} label={CONTINUITY[3].kicker} dur={300} n="14" />

      <Mosaic
        ids={[102, 100]}
        dur={300}
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
          {CONTINUITY[3].line.toUpperCase()}
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
          {CONTINUITY[3].next}
        </Sub>
      </At>
      <At x={0} y={834} w={W}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [70, 100], [0, 1])}}>
          <Micro color={C.inkDim} size={17} tracking={3.4}>
            PART 1 · THE HUB — PART 2 · THE NETWORK — PART 3 · THE PROTOCOL LAYER
          </Micro>
        </div>
      </At>

      <LFCue name="impact-mid" at={6} volume={0.5} />
      <LFCue name="bloom" at={30} volume={0.44} />
      <LFCue name="reverse-swell" at={150} volume={0.34} />
    </LFStage>
  );
};

// ===========================================================================
// C15 — CTA & Shivansh Electronics outro                               510f
// ===========================================================================
export const L3C15: React.FC = () => (
  <LFStage part={P} wash={1}>
    <LFBackdrop id={96} opacity={0.12} blur={68} />
    <LFMotes part={P} opacity={0.4} />
    <LFOutro part={P} dur={510} />
    <LFCue name="impact-deep" at={4} volume={0.56} />
    <LFCue name="bloom" at={10} volume={0.46} />
    <LFCue name="lift-air" at={60} volume={0.36} />
    <LFTickRun from={70} count={16} every={6} volume={0.16} />
    <LFCue name="chime-final" at={430} volume={0.5} />
  </LFStage>
);
