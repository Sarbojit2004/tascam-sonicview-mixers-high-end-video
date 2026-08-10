import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, LF_SAFE, lfAccent} from '../../lib/lf-theme';
import {ramp} from '../../lib/anim';
import {At, LFBackdrop, LFMotes, LFStage} from '../../components/lf/LFStage';
import {BigFigure, ChipRow, LY, Panel, Para, SpecList, TitleBlock} from '../../components/lf/LFLayouts';
import {Fill, LFClip, Mosaic, Plate} from '../../components/lf/LFMedia';
import {ChapterMark, LFOutro} from '../../components/lf/LFBrand';
import {FpgaFlow, PowerFailover} from '../../components/Diagram';
import {Display, Micro, Rule, Spec, Sub} from '../../components/Type';
import {B} from '../../components/Beat';
import {LFCue, LFTickRun} from '../../components/lf/LFCue';

/**
 * LONG-FORM PART 1 — "THE HUB"  ·  298.000 s / 8,940 frames / 1920x1080
 *
 * The extended treatment of the reel series' Part 1: Sonicview 16XP, 24XP and
 * the dp power-redundancy axis. Carries 74 of the 131 coverage-relevant
 * assets — 72 stills plus both repository clips, played at natural speed with
 * longer trims than the reel could afford (the clips still get intercut rather
 * than played through in one static hold).
 *
 * Unlike the reel, dp gets a genuinely standalone segment here: the brief's
 * advice to keep it light was calibrated for 88 seconds, and 298 gives room to
 * explain the actual engineering and the actual anxiety it resolves.
 *
 * Branding is NOT placed in these chapters — BrandingLayer handles every logo
 * appearance from src/lib/lf-brand-plan.ts so the cadence is auditable.
 */

const P = 1 as const;
const A = lfAccent(P);
const W = LF_SAFE.w; // 1816

// ===========================================================================
// C01 — Cold open: the ecosystem premise                               420f
// assets: 51, 98, 84
// ===========================================================================
export const L1C01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LFStage part={P}>
      <LFBackdrop id={51} opacity={0.24} blur={58} />
      <LFMotes part={P} opacity={0.5} />
      <ChapterMark part={P} label="PART 1 OF 3 · THE HUB" dur={420} n="01" />

      <B from={0} to={300} fade={20}>
        <At x={0} y={106} w={W}>
          <div style={{textAlign: 'center'}}>
            <Micro color={A} size={20} tracking={5.0}>
              TASCAM SONICVIEW DIGITAL MIXING CONSOLE ECOSYSTEM
            </Micro>
          </div>
        </At>
        <At x={0} y={146} w={W}>
          <Display size={112} lh={0.90} align="center" style={{opacity: ramp(f, [24, 54], [0, 1])}}>
            {'A CONSOLE IS NOT\nTHE SYSTEM.'}
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
            {'It is the computational hub an entire facility is built around.'}
          </Sub>
        </At>
      </B>

      <B from={300} to={420} fade={16}>
        <Fill id={51} box={{x: 0, y: 168, w: 1180, h: 560}} dur={250} kb={{z: [1.04, 1.12]}} shade="bottom" />
        <Fill
          id={84}
          box={{x: 1216, y: 168, w: W - 1216, h: 560}}
          dur={250}
          kb={{z: [1.06, 1.16]}}
        />
        <At x={0} y={772} w={W}>
          <Display size={82} lh={0.92} align="center" style={{opacity: ramp(f, [316, 344], [0, 1])}}>
            {'MODULAR. PROTOCOL-AGNOSTIC.'}
          </Display>
        </At>
        <At x={0} y={886} w={W}>
          <Spec size={26} color={C.inkDim} style={{textAlign: 'center', opacity: ramp(f, [330, 358], [0, 1])}}>
            44 INPUT CHANNELS · 22 OUTPUT BUSES · 96 kHz · 54-BIT FLOAT
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
// C02 — Four architectural pillars                                     390f
// assets: 13, 25, 26
// ===========================================================================
export const L1C02: React.FC = () => {
  const f = useCurrentFrame();
  const PILLARS = [
    {n: '01', t: 'THE HUB', d: '16XP and 24XP — the processing and tactile control centre.'},
    {n: '02', t: 'POWER REDUNDANCY', d: 'The dp axis. A second supply, not a second tier.'},
    {n: '03', t: 'STAGE-SIDE I/O', d: 'SB-16D, reaching the stage over the network.'},
    {n: '04', t: 'PROTOCOL LAYER', d: 'IF-Series cards that match the facility, natively.'},
  ];
  return (
    <LFStage part={P}>
      <LFBackdrop id={13} opacity={0.16} blur={62} />
      <ChapterMark part={P} label="FOUR ARCHITECTURAL PILLARS" dur={390} n="02" />

      <TitleBlock
        part={P}
        kicker="HOW THE ECOSYSTEM IS ORGANISED"
        head={'ONE CORE.\nFOUR LAYERS\nAROUND IT.'}
        headSize={82}
        w={640}
      />

      <At x={700} y={LY.kicker + 10} w={W - 700 - 320}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          {PILLARS.map((p, i) => {
            const d = 20 + i * 22;
            const o = ramp(f, [d, d + 24], [0, 1]);
            return (
              <div
                key={p.n}
                style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'flex-start',
                  opacity: o,
                  transform: `translateX(${(1 - o) * 30}px)`,
                  borderLeft: `3px solid ${i === 0 ? A : C.line}`,
                  paddingLeft: 24,
                }}
              >
                <Display size={44} lh={1} color={i === 0 ? A : C.inkDim}>
                  {p.n}
                </Display>
                <div>
                  <Display size={40} lh={1.05} color={C.ink}>
                    {p.t}
                  </Display>
                  <Sub size={24} color={C.inkSoft} italic={false} style={{marginTop: 6}}>
                    {p.d}
                  </Sub>
                </div>
              </div>
            );
          })}
        </div>
      </At>

      <At x={0} y={640} w={640}>
        <Para y={0} w={640} size={25} delay={110}>
          {'Dante networking is the load-bearing thread that ties all four together — audio moving as data over standard IP.'}
        </Para>
      </At>

      <Plate id={13} box={{x: 700, y: 596, w: 540, h: 270}} dur={390} pad={14} />
      <Mosaic
        ids={[25, 26]}
        dur={390}
        cols={1}
        box={{x: 1276, y: 596, w: W - 1276, h: 270}}
        gap={12}
        delay={150}
        pad={8}
      />

      <LFCue name="whoosh-deep" at={0} volume={0.42} />
      <LFCue name="stinger-chapter" at={8} volume={0.44} />
      <LFTickRun from={26} count={16} every={9} volume={0.24} hi />
      <LFCue name="click-hard" at={112} volume={0.3} />
    </LFStage>
  );
};

// ===========================================================================
// C03 — Sonicview 16XP introduced                                      540f
// assets: 59, 60, 62, 66
// ===========================================================================
export const L1C03: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={62} opacity={0.20} blur={58} />
    <ChapterMark part={P} label="THE HUB · TASCAM SONICVIEW 16XP" dur={540} n="03" />

    <TitleBlock
      part={P}
      kicker="TASCAM SONICVIEW 16XP"
      head={'FLAGSHIP ENGINE.\nCOMPACT\nFOOTPRINT.'}
      headSize={80}
      w={700}
      sub={'Historically, a smaller desk meant a smaller engine. The 16XP refuses that trade — the processing is identical to its larger sibling.'}
      subSize={26}
    />

    <B from={0} to={280} fade={18}>
      <Plate id={59} box={{x: LY.colRx, y: 60, w: LY.colRw, h: 620}} dur={300} pad={26} />
    </B>
    <B from={272} to={540} fade={18}>
      <Mosaic
        ids={[60, 62, 66]}
        dur={280}
        cols={1}
        box={{x: LY.colRx, y: 60, w: LY.colRw, h: 620}}
        gap={14}
        delay={278}
        pad={12}
      />
    </B>

    <SpecList
      part={P}
      y={716}
      x={LY.colRx}
      w={LY.colRw}
      delay={40}
      size={24}
      items={[
        {k: 'PHYSICAL MIC / LINE IN', v: '16'},
        {k: 'MOTORIZED FADERS', v: '16 + 1 stereo main, 100 mm'},
        {k: 'TOUCHSCREENS', v: '2 × 7-inch, VIEW system'},
        {k: 'EXPANSION SLOTS', v: '2'},
      ]}
    />

    <LFCue name="whoosh-tight" at={0} volume={0.44} />
    <LFCue name="impact-mid" at={10} volume={0.5} />
    <LFCue name="fader-snap" at={22} volume={0.42} />
    <LFCue name="page-turn" at={268} volume={0.4} />
    <LFTickRun from={286} count={10} every={11} volume={0.22} hi />
  </LFStage>
);

// ===========================================================================
// C04 — 16XP form factor & deployment                                  450f
// assets: 67, 68, 69, 61
// ===========================================================================
export const L1C04: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={67} opacity={0.20} blur={56} />
    <ChapterMark part={P} label="THE HUB · WHERE THE 16XP GOES" dur={450} n="04" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        DEPLOYMENT
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={W}>
      <Display size={86} lh={0.92}>
        {'BUILT FOR ROOMS THAT DO NOT HAVE THE SPACE.'}
      </Display>
    </At>

    <B from={0} to={230} fade={18}>
      <Mosaic
        ids={[67, 68]}
        dur={248}
        cols={2}
        box={{x: 0, y: 322, w: W, h: 430}}
        gap={20}
        delay={8}
        pad={16}
      />
      <Para y={790} w={1160} size={26} delay={40}>
        {'Broadcast booths, outside-broadcast vans and small-to-medium installed rooms all share the same constraint: depth. At 554 mm deep and 13 kg, the 16XP fits where a larger surface simply cannot be sat down.'}
      </Para>
    </B>

    <B from={222} to={450} fade={18}>
      <Plate id={69} box={{x: 0, y: 322, w: 620, h: 430}} dur={228} pad={16} />
      <Plate id={61} box={{x: 652, y: 322, w: 620, h: 430}} dur={228} fit="cover" pad={0} card={false} radius={16} />
      <Panel
        part={P}
        label="THE COMPROMISE THAT ISN'T"
        body={'Same 44-channel architecture.\nSame 54-bit float engine.\nSame Class 1 preamp design.\nOnly the surface is smaller.'}
        x={1304}
        y={322}
        w={W - 1304}
        h={430}
        delay={230}
        size={26}
      />
      <SpecList
        part={P}
        y={790}
        delay={244}
        w={1160}
        size={24}
        items={[
          {k: 'DIMENSIONS (W × H × D)', v: '472.0 × 228.1 × 554.4 mm'},
          {k: 'WEIGHT', v: '13.0 kg'},
          {k: 'POWER', v: 'Standard AC, 65 W'},
        ]}
      />
    </B>

    <LFCue name="whoosh-grain" at={0} volume={0.42} />
    <LFCue name="impact-soft" at={12} volume={0.42} />
    <LFCue name="sweep-down" at={216} volume={0.36} />
    <LFCue name="latch" at={228} volume={0.44} />
    <LFTickRun from={240} count={9} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C05 — The VIEW touchscreen system                                    660f
// assets: 88, 79, 80, 83, 70, 71, 78  + clip 133
// ===========================================================================
export const L1C05: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={3} opacity={0.18} blur={60} />
    <ChapterMark part={P} label="THE HUB · THE VIEW INTERFACE" dur={660} n="05" />

    <B from={0} to={190} fade={11}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          VISUAL INTERACTIVE ERGONOMIC WORKFLOW
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={92} lh={0.92}>
          {'SEE THE WHOLE MIX,\nNOT ONE MENU OF IT.'}
        </Display>
      </At>
      <Plate id={88} box={{x: 0, y: 348, w: 720, h: 250}} dur={210} pad={40} />
      <Para y={640} w={720} size={26} delay={30}>
        {'Digital consoles historically traded away the analog desk’s single greatest strength: being able to see the entire signal structure at a glance. VIEW puts it back.'}
      </Para>
      <Plate id={79} box={{x: 780, y: 348, w: W - 780, h: 560}} dur={210} pad={20} />
    </B>

    <B from={182} to={392} fade={11}>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={82} lh={0.92}>
          {'EVERY MODULE, ON ITS OWN SCREEN.'}
        </Display>
      </At>
      <Mosaic
        ids={[80, 83, 70]}
        dur={228}
        cols={3}
        box={{x: 0, y: 300, w: W, h: 380}}
        gap={18}
        delay={190}
        pad={12}
        bg={C.screen}
      />
      <ChipRow
        part={P}
        y={716}
        delay={230}
        items={[
          {label: 'OVERVIEW'},
          {label: 'PARAMETRIC EQ', accent: true},
          {label: 'DYNAMICS'},
          {label: 'MONITOR / TALKBACK'},
          {label: 'METERING'},
        ]}
      />
      <Para y={790} w={1300} size={25} delay={244}>
        {'Each screen drives the channels physically beneath it, so the surface and the display never disagree about what you are touching.'}
      </Para>
    </B>

    <B from={384} to={660} fade={11}>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={82} lh={0.92}>
          {'AND THE SURFACE MOVES WITH IT.'}
        </Display>
      </At>
      {/* 16XP clip: a lateral macro track across the fader bank and scribble
          strips. Natural speed, ~4.6 s of the 13 s source. */}
      <LFClip id={133} box={{x: 0, y: 300, w: 1180, h: 400}} radius={16} />
      <Mosaic
        ids={[71, 78]}
        dur={280}
        cols={1}
        box={{x: 1216, y: 300, w: W - 1216, h: 400}}
        gap={16}
        delay={392}
        pad={12}
        bg={C.screen}
      />
      <Para y={736} w={1400} size={26} delay={410}>
        {'Scribble strips carry the channel name and colour, and the motorized faders recall stored position — not just level — the instant a scene is loaded.'}
      </Para>
    </B>

    <LFCue name="lift-air" at={0} volume={0.4} />
    <LFCue name="impact-soft" at={14} volume={0.4} />
    <LFCue name="page-turn" at={178} volume={0.42} />
    <LFTickRun from={196} count={14} every={9} volume={0.24} hi />
    <LFCue name="whoosh-tight" at={378} volume={0.42} />
    <LFCue name="fader-snap" at={398} volume={0.5} />
    <LFCue name="fader-snap" at={420} volume={0.36} />
  </LFStage>
);

// ===========================================================================
// C06 — Motorized faders & tactile recall                              480f
// assets: 82, 87, 89, 65
// ===========================================================================
export const L1C06: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={87} opacity={0.20} blur={56} />
    <ChapterMark part={P} label="THE HUB · TACTILE RECALL" dur={480} n="06" />

    <TitleBlock
      part={P}
      kicker="100 mm MOTORIZED FADERS"
      head={'THE SURFACE\nIS THE STATE.'}
      headSize={82}
      w={700}
      sub={'A fader that reports the wrong position is worse than no fader. Motorization means the surface always tells the truth about the mix.'}
      subSize={26}
    />

    <B from={0} to={250} fade={18}>
      <Fill id={82} box={{x: LY.colRx, y: 60, w: LY.colRw, h: 620}} dur={268} kb={{z: [1.04, 1.14]}} />
    </B>
    <B from={242} to={480} fade={18}>
      <Mosaic
        ids={[87, 89]}
        dur={250}
        cols={1}
        box={{x: LY.colRx, y: 60, w: LY.colRw, h: 620}}
        gap={16}
        delay={248}
        pad={0}
        card={false}
      />
    </B>

    <Plate id={65} box={{x: 0, y: 700, w: 700, h: 286}} dur={480} pad={16} />
    <SpecList
      part={P}
      x={LY.colRx}
      y={716}
      w={LY.colRw}
      delay={60}
      size={24}
      items={[
        {k: 'FADER TRAVEL', v: '100 mm'},
        {k: 'RECALL', v: 'Snapshot position, instantly'},
        {k: 'CHANNEL IDENTITY', v: 'Full-colour scribble strips'},
      ]}
    />

    <LFCue name="whoosh-deep" at={0} volume={0.4} />
    <LFCue name="fader-snap" at={16} volume={0.52} />
    <LFCue name="fader-snap" at={30} volume={0.4} />
    <LFCue name="fader-snap" at={41} volume={0.3} />
    <LFCue name="sweep-up" at={236} volume={0.34} />
    <LFTickRun from={256} count={11} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C07 — The FPGA mixing engine                                         690f
// assets: 76, 48, 11
// ===========================================================================
export const L1C07: React.FC = () => (
  <LFStage part={P} wash={0.9}>
    <LFBackdrop id={76} opacity={0.16} blur={64} />
    <ChapterMark part={P} label="THE HUB · THE PROCESSING CORE" dur={690} n="07" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        54-BIT FLOAT-POINT FPGA MIXING ENGINE
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={W}>
      <Display size={86} lh={0.92}>
        {'PROCESSING IN HARDWARE, NOT IN A QUEUE.'}
      </Display>
    </At>

    <B from={0} to={300} fade={18}>
      <At x={0} y={318} w={W} h={400}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <FpgaFlow w={W} h={400} part={P} delay={16} />
        </div>
      </At>
      <Para y={756} w={1500} size={26} delay={40}>
        {'A field-programmable gate array is configured into the exact signal path the mixer needs, so every channel is processed in parallel, in dedicated logic. Nothing waits behind a general-purpose CPU scheduler.'}
      </Para>
    </B>

    <B from={292} to={690} fade={18}>
      <Plate id={76} box={{x: 0, y: 318, w: 600, h: 420}} dur={410} fit="cover" pad={0} card={false} radius={16} />
      <Plate id={48} box={{x: 632, y: 318, w: 600, h: 420}} dur={410} fit="cover" pad={0} card={false} radius={16} />
      <Plate id={11} box={{x: 1264, y: 318, w: W - 1264, h: 420}} dur={410} pad={14} />
      <Para x={0} y={776} w={860} size={25} delay={310}>
        {'54-bit floating-point summing leaves headroom that cannot realistically be exhausted, so gain staging inside the desk stops being something you have to defend.'}
      </Para>
      <Para x={916} y={776} w={900} size={25} delay={330}>
        {'96 kHz throughout, with a measured response that stays flat across the audio band — the engine does not change behaviour as channel count rises.'}
      </Para>
    </B>

    <LFCue name="data-sweep" at={6} volume={0.5} />
    <LFCue name="sub-thump" at={14} volume={0.44} />
    <LFTickRun from={40} count={22} every={8} volume={0.28} hi />
    <LFCue name="whoosh-grain" at={286} volume={0.4} />
    <LFCue name="impact-soft" at={300} volume={0.42} />
  </LFStage>
);

// ===========================================================================
// C08 — Latency: the 0.51 ms path                                      420f
// assets: 1, 2, 3
// ===========================================================================
export const L1C08: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={71} opacity={0.16} blur={62} />
    <ChapterMark part={P} label="THE HUB · LATENCY" dur={420} n="08" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        ANALOG-TO-ANALOG
      </Micro>
    </At>

    <BigFigure part={P} value="0.51" unit="MS" caption="MIC INPUT TO ANALOG OUTPUT" x={0} y={140} size={230} delay={14} />

    <Para y={470} w={880} size={27} delay={48}>
      {'Half a millisecond is roughly the delay of standing seventeen centimetres further from a source. Below the threshold where an in-ear performer hears comb filtering between their own voice and the mix.'}
    </Para>

    <Panel
      part={P}
      label="WHY IT MATTERS ON STAGE"
      body={'Phase interaction between a live source\nand its reinforced version is a latency\nproblem before it is an EQ problem.'}
      x={0}
      y={660}
      w={880}
      h={200}
      delay={70}
      size={26}
    />

    <B from={0} to={220} fade={18}>
      <Plate id={1} box={{x: 940, y: 140, w: W - 940, h: 500}} dur={238} pad={16} bg={C.screen} />
    </B>
    <B from={212} to={420} fade={18}>
      <Mosaic
        ids={[2, 3]}
        dur={220}
        cols={1}
        box={{x: 940, y: 140, w: W - 940, h: 500}}
        gap={16}
        delay={218}
        pad={12}
        bg={C.screen}
      />
    </B>

    <SpecList
      part={P}
      x={940}
      y={706}
      w={W - 940}
      delay={90}
      size={24}
      items={[
        {k: 'INTERNAL LATENCY', v: '20.8 μs'},
        {k: 'ANALOG-TO-ANALOG', v: '0.51 ms'},
        {k: 'SAMPLE RATE', v: '96 kHz'},
      ]}
    />

    <LFCue name="reverse-swell" at={0} volume={0.4} />
    <LFCue name="click-hard" at={30} volume={0.36} />
    <LFTickRun from={44} count={18} every={6} volume={0.26} hi />
    <LFCue name="page-turn" at={208} volume={0.38} />
  </LFStage>
);

// ===========================================================================
// C09 — Class 1 HDIA preamps                                           540f
// assets: 81, 8, 9, 10
// ===========================================================================
export const L1C09: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={81} opacity={0.14} blur={60} />
    <ChapterMark part={P} label="THE HUB · THE INPUT STAGE" dur={540} n="09" />

    <TitleBlock
      part={P}
      kicker="CLASS 1 HDIA MICROPHONE PREAMPS"
      head={'NOISE YOU DO NOT\nINHERIT LATER.'}
      headSize={78}
      w={760}
      sub={'High-Definition Instrumentation Architecture. Every dB of noise added at the input is a dB you carry through every process downstream — so the input stage is where it has to be won.'}
      subSize={25}
    />

    <B from={0} to={250} fade={18}>
      <Plate id={81} box={{x: LY.colRx, y: 90, w: LY.colRw, h: 380}} dur={268} pad={50} />
    </B>
    <B from={242} to={540} fade={18}>
      <Mosaic
        ids={[8, 9, 10]}
        dur={310}
        cols={3}
        box={{x: LY.colRx, y: 90, w: LY.colRw, h: 380}}
        gap={14}
        delay={248}
        pad={10}
      />
    </B>

    <At x={LY.colRx} y={498} w={LY.colRw}>
      <Micro color={A} size={16} tracking={2.6}>
        EQUIVALENT INPUT NOISE vs FREQUENCY
      </Micro>
    </At>

    <Para x={LY.colRx} y={546} w={LY.colRw} size={24} delay={70}>
      {'The same preamp design appears on the console and on the SB-16D stagebox, so moving an input from the desk to the stage does not change its noise floor.'}
    </Para>

    <SpecList
      part={P}
      y={772}
      w={760}
      delay={80}
      size={24}
      items={[
        {k: '16XP PREAMPS', v: '16 × Class 1 HDIA'},
        {k: '24XP PREAMPS', v: '24 × Class 1 HDIA'},
        {k: 'SHARED WITH', v: 'SB-16D stagebox'},
      ]}
    />

    <LFCue name="bloom" at={0} volume={0.42} />
    <LFCue name="impact-soft" at={12} volume={0.4} />
    <LFCue name="sweep-up" at={236} volume={0.34} />
    <LFTickRun from={256} count={12} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C10 — Rear I/O & built-in networking                                 480f
// assets: 64, 92, 63, 95
// ===========================================================================
export const L1C10: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={64} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE HUB · CONNECTIVITY" dur={480} n="10" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        REAR PANEL
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1300}>
      <Display size={84} lh={0.92}>
        {'THE NETWORK IS NOT AN OPTION HERE.'}
      </Display>
    </At>

    <B from={0} to={250} fade={18}>
      <Plate id={64} box={{x: 0, y: 300, w: W, h: 320}} dur={268} pad={16} />
      <Para y={654} w={1240} size={26} delay={30}>
        {'A 64-in / 64-out Dante interface is built into every Sonicview — not a card, not an upgrade. The console is a network device from the moment it is powered on.'}
      </Para>
    </B>

    <B from={242} to={480} fade={18}>
      <Mosaic
        ids={[92, 63]}
        dur={250}
        cols={2}
        box={{x: 0, y: 300, w: W, h: 320}}
        gap={20}
        delay={248}
        pad={14}
      />
      <Para y={654} w={1240} size={26} delay={266}>
        {'Alongside it: analog mic/line inputs, analog and digital outputs, word clock, GPIO, footswitch and a USB audio interface — the physical terminations a facility still needs.'}
      </Para>
    </B>

    <ChipRow
      part={P}
      y={764}
      delay={60}
      items={[
        {label: 'BUILT-IN 64 × 64 DANTE', accent: true},
        {label: 'AES67'},
        {label: 'SMPTE ST 2110 INTEROP'},
        {label: 'WORD CLOCK'},
        {label: 'GPIO'},
      ]}
    />

    <Plate id={95} box={{x: 1196, y: 828, w: W - 1196, h: 158}} dur={480} fit="cover" pad={0} card={false} radius={12} opacity={0.98} />

    <LFCue name="whoosh-deep" at={0} volume={0.42} />
    <LFCue name="latch" at={18} volume={0.42} />
    <LFCue name="net-ping" at={70} volume={0.44} />
    <LFCue name="page-turn" at={238} volume={0.4} />
    <LFTickRun from={256} count={12} every={9} volume={0.24} hi />
  </LFStage>
);

// ===========================================================================
// C11 — Onboard recording & USB                                        390f
// assets: 85, 74, 121
// ===========================================================================
export const L1C11: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={74} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE HUB · CAPTURE" dur={390} n="11" />

    <TitleBlock
      part={P}
      kicker="32-TRACK SDXC + USB AUDIO"
      head={'THE SHOW RECORDS\nITSELF.'}
      headSize={80}
      w={760}
      sub={'A pre-installed IF-MTR32 card captures 32 tracks to card while the show happens — no external recorder, no extra split, no extra failure point.'}
      subSize={26}
    />

    <Plate id={85} box={{x: LY.colRx, y: 70, w: LY.colRw, h: 400}} dur={390} pad={30} />

    <B from={0} to={200} fade={18}>
      <Plate id={74} box={{x: LY.colRx, y: 500, w: LY.colRw, h: 400}} dur={218} fit="cover" pad={0} card={false} />
    </B>
    <B from={192} to={390} fade={18}>
      <Plate id={121} box={{x: LY.colRx, y: 500, w: LY.colRw, h: 400}} dur={200} fit="cover" pad={0} card={false} />
    </B>

    <SpecList
      part={P}
      y={700}
      w={760}
      delay={50}
      size={24}
      items={[
        {k: 'ONBOARD RECORDING', v: '32-track SDXC'},
        {k: 'VIA', v: 'Pre-installed IF-MTR32'},
        {k: 'USB AUDIO', v: '32-in / 32-out, 32-bit / 96 kHz'},
      ]}
    />

    <LFCue name="whoosh-tight" at={0} volume={0.4} />
    <LFCue name="click-hard" at={26} volume={0.34} />
    <LFCue name="tick-triple" at={60} volume={0.36} />
    <LFCue name="sweep-down" at={186} volume={0.34} />
    <LFTickRun from={206} count={9} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C12 — Sonicview 24XP: scale                                          600f
// assets: 110, 109, 113, 108  + clip 134
// ===========================================================================
export const L1C12: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={110} opacity={0.20} blur={56} />
    <ChapterMark part={P} label="THE HUB · TASCAM SONICVIEW 24XP" dur={600} n="12" />

    <B from={0} to={270} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          TASCAM SONICVIEW 24XP
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={92} lh={0.92}>
          {'SAME ENGINE. MORE SURFACE.'}
        </Display>
      </At>
      <Plate id={110} box={{x: 0, y: 300, w: 1180, h: 480}} dur={288} pad={20} />
      <Panel
        part={P}
        label="WHAT CHANGES"
        body={'Three 7-inch screens.\n24 + 1 motorized faders.\n24 physical mic / line inputs.'}
        x={1216}
        y={300}
        w={W - 1216}
        h={230}
        delay={30}
        size={28}
      />
      <Panel
        part={P}
        label="WHAT DOES NOT"
        body={'44 input channels.\n22 output buses.\n0.51 ms, 54-bit float.'}
        x={1216}
        y={550}
        w={W - 1216}
        h={230}
        delay={48}
        size={28}
      />
      <Para y={790} w={1500} size={25} delay={70}>
        {'The larger format exists to cut cognitive load, not to raise the ceiling. A front-of-house engineer can dedicate one screen to output buses while inputs stay under both hands.'}
      </Para>
    </B>

    <B from={262} to={600} fade={18}>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={82} lh={0.92}>
          {'TWENTY-FOUR CHANNELS, UNDER BOTH HANDS.'}
        </Display>
      </At>
      {/* 24XP clip: a tracking move across the illuminated surface. Natural
          speed, ~5.6 s of the 21 s source. */}
      <LFClip id={134} box={{x: 0, y: 300, w: 1180, h: 400}} radius={16} />
      <Mosaic
        ids={[109, 113]}
        dur={340}
        cols={1}
        box={{x: 1216, y: 300, w: W - 1216, h: 400}}
        gap={16}
        delay={270}
        pad={0}
        card={false}
      />
      <Plate id={108} box={{x: 716, y: 726, w: 500, h: 250}} dur={340} pad={12} />
      <SpecList
        part={P}
        x={1252}
        y={756}
        w={W - 1252}
        delay={288}
        size={24}
        items={[
          {k: 'DIMENSIONS (W × H × D)', v: '690.8 × 228.1 × 554.4 mm'},
          {k: 'WEIGHT', v: '18.0 kg'},
          {k: 'POWER', v: 'Standard AC, 85 W'},
        ]}
      />
    </B>

    <LFCue name="reverse-swell" at={0} volume={0.4} />
    <LFCue name="impact-deep" at={30} volume={0.6} />
    <LFCue name="fader-snap" at={44} volume={0.4} />
    <LFCue name="whoosh-deep" at={256} volume={0.44} />
    <LFTickRun from={278} count={14} every={9} volume={0.24} hi />
  </LFStage>
);

// ===========================================================================
// C13 — 24XP control surface & workflow                                480f
// assets: 114, 115, 116, 112, 124
// ===========================================================================
export const L1C13: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={112} opacity={0.18} blur={56} />
    <ChapterMark part={P} label="THE HUB · WORKING THE 24XP" dur={480} n="13" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        THREE BANKS OF EIGHT
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1400}>
      <Display size={84} lh={0.92}>
        {'REACH FOR IT, DO NOT NAVIGATE TO IT.'}
      </Display>
    </At>

    <B from={0} to={250} fade={18}>
      <Mosaic
        ids={[114, 115, 116]}
        dur={268}
        cols={3}
        box={{x: 0, y: 300, w: W, h: 400}}
        gap={18}
        delay={10}
        pad={14}
      />
      <Para y={736} w={1500} size={26} delay={40}>
        {'Three fader banks and three screens mean a complete layer — inputs, outputs, effects returns — can each hold its own physical territory instead of taking turns on one surface.'}
      </Para>
    </B>

    <B from={242} to={480} fade={18}>
      <Plate id={112} box={{x: 0, y: 300, w: 1100, h: 400}} dur={250} fit="cover" pad={0} card={false} />
      <Plate id={124} box={{x: 1136, y: 300, w: W - 1136, h: 400}} dur={250} pad={14} />
      <Para y={736} w={1500} size={26} delay={262}>
        {'Every fader snaps to its stored position the moment a scene loads, so the transition between songs, segments or events is a single recall rather than a sequence of corrections.'}
      </Para>
    </B>

    <LFCue name="whoosh-grain" at={0} volume={0.42} />
    <LFCue name="fader-snap" at={18} volume={0.5} />
    <LFCue name="fader-snap" at={32} volume={0.38} />
    <LFCue name="page-turn" at={238} volume={0.4} />
    <LFTickRun from={256} count={11} every={10} volume={0.22} hi />
  </LFStage>
);

// ===========================================================================
// C14 — The dp power-redundancy axis                                   780f
// assets: 52, 123, 53, 122, 103, 55
// ===========================================================================
export const L1C14: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={123} opacity={0.18} blur={58} />
    <ChapterMark part={P} label="THE HUB · POWER ARCHITECTURE" dur={780} n="14" />

    <B from={0} to={230} fade={18}>
      <At x={0} y={LY.kicker} w={W}>
        <Micro color={A} size={19} tracking={4.4}>
          SONICVIEW 16dp · SONICVIEW 24dp
        </Micro>
      </At>
      <At x={0} y={LY.kicker + 38} w={W}>
        <Display size={94} lh={0.92}>
          {'NOT A BIGGER DESK.\nA SECOND SUPPLY.'}
        </Display>
      </At>
      <Para y={330} w={1400} size={28} delay={26}>
        {'The dp models are the single most misread part of this lineup. They are not a higher tier of audio capability, and they are not a third and fourth console size. They are the same two consoles with a second, independent way to stay powered.'}
      </Para>
      <Mosaic
        ids={[52, 123]}
        dur={248}
        cols={2}
        box={{x: 0, y: 486, w: W, h: 380}}
        gap={20}
        delay={50}
        pad={18}
      />
    </B>

    <B from={222} to={470} fade={18}>
      <At x={0} y={LY.kicker + 38} w={1300}>
        <Display size={84} lh={0.92}>
          {'THE FAILURE THIS REMOVES.'}
        </Display>
      </At>
      <Para y={300} w={860} size={26} delay={232}>
        {'A standard console runs from one AC supply. Trip a breaker, pull a cable, lose a phase — and the audio stops, then the console begins a boot cycle measured in tens of seconds. On a live transmission that is not a fault, it is an outage.'}
      </Para>
      <Para y={520} w={860} size={26} delay={252}>
        {'The dp variants add a redundant DC input fed by the included PS-P2450 adapter. If the primary supply is interrupted, the secondary is already carrying the rail. There is no switchover gap to hear and no reboot to wait through.'}
      </Para>
      <At x={940} y={280} w={W - 940} h={480}>
        <div
          style={{
            height: '100%',
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <PowerFailover w={W - 940} h={480} failAt={110} delay={236} />
        </div>
      </At>
    </B>

    <B from={462} to={780} fade={18}>
      <At x={0} y={LY.kicker + 38} w={1300}>
        <Display size={84} lh={0.92}>
          {'IDENTICAL IN EVERY OTHER RESPECT.'}
        </Display>
      </At>
      <Mosaic
        ids={[53, 122, 103, 55]}
        dur={330}
        cols={2}
        box={{x: 0, y: 300, w: 1180, h: 560}}
        gap={18}
        delay={470}
        pad={14}
      />
      <SpecList
        part={P}
        x={1216}
        y={330}
        w={W - 1216}
        delay={484}
        size={24}
        items={[
          {k: 'POWER', v: 'AC + redundant DC input'},
          {k: 'INCLUDED', v: 'PS-P2450 AC adapter'},
          {k: 'ENGINE', v: 'Identical, 54-bit float'},
          {k: 'SURFACE', v: 'Identical'},
          {k: 'I/O', v: 'Identical'},
        ]}
      />
      <Panel
        part={P}
        label="WHO SPECIFIES dp"
        body={'Broadcast control rooms.\nArena and stadium touring.\nAnywhere a reboot is an incident report.'}
        x={1216}
        y={620}
        w={W - 1216}
        h={240}
        delay={500}
        size={25}
      />
    </B>

    <LFCue name="sub-thump" at={6} volume={0.46} />
    <LFCue name="stinger-chapter" at={14} volume={0.4} />
    <LFCue name="whoosh-deep" at={216} volume={0.42} />
    <LFCue name="relay" at={334} volume={0.78} />
    <LFCue name="impact-deep" at={336} volume={0.52} />
    <LFCue name="lift-air" at={352} volume={0.4} />
    <LFCue name="whoosh-tight" at={456} volume={0.42} />
    <LFTickRun from={478} count={16} every={8} volume={0.24} hi />
  </LFStage>
);

// ===========================================================================
// C15 — dp across the lineup                                           450f
// assets: 54, 56, 57, 58, 104, 105, 106, 107
// ===========================================================================
export const L1C15: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={105} opacity={0.16} blur={58} />
    <ChapterMark part={P} label="THE HUB · CHOOSING A FORMAT" dur={450} n="15" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        TWO DECISIONS, TAKEN SEPARATELY
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1400}>
      <Display size={84} lh={0.92}>
        {'SCALE IS ONE AXIS. RISK IS THE OTHER.'}
      </Display>
    </At>

    <Para y={300} w={1500} size={26} delay={20}>
      {'Sixteen or twenty-four faders is a question about the show. AC-only or AC-plus-DC is a question about the consequence of losing it. Neither answer constrains the other.'}
    </Para>

    <B from={0} to={230} fade={18}>
      <Mosaic
        ids={[54, 56, 57, 58]}
        dur={248}
        cols={4}
        box={{x: 0, y: 420, w: W, h: 396}}
        gap={16}
        delay={30}
        pad={12}
      />
    </B>
    <B from={222} to={450} fade={18}>
      <Mosaic
        ids={[104, 105, 106, 107]}
        dur={240}
        cols={4}
        box={{x: 0, y: 420, w: W, h: 396}}
        gap={16}
        delay={228}
        pad={12}
      />
    </B>

    <ChipRow
      part={P}
      y={856}
      delay={60}
      items={[
        {label: 'SONICVIEW 16XP'},
        {label: 'SONICVIEW 16dp', accent: true},
        {label: 'SONICVIEW 24XP'},
        {label: 'SONICVIEW 24dp', accent: true},
      ]}
    />

    <LFCue name="whoosh-tight" at={0} volume={0.4} />
    <LFCue name="tick-triple" at={24} volume={0.38} />
    <LFCue name="page-turn" at={218} volume={0.4} />
    <LFTickRun from={236} count={10} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C16 — Replacing a fixed-architecture desk                            390f
// assets: 91, 93, 94, 119, 120
// ===========================================================================
export const L1C16: React.FC = () => (
  <LFStage part={P}>
    <LFBackdrop id={94} opacity={0.14} blur={62} />
    <ChapterMark part={P} label="THE HUB · MIGRATION" dur={390} n="16" />

    <At x={0} y={LY.kicker} w={W}>
      <Micro color={A} size={19} tracking={4.4}>
        REPLACING AN ANALOG DESK
      </Micro>
    </At>
    <At x={0} y={LY.kicker + 38} w={1400}>
      <Display size={84} lh={0.92}>
        {'SAME ROOM. NEW ROUTING.'}
      </Display>
    </At>

    <B from={0} to={200} fade={18}>
      <Mosaic
        ids={[91, 94]}
        dur={218}
        cols={2}
        box={{x: 0, y: 300, w: W, h: 460}}
        gap={20}
        delay={10}
        pad={16}
      />
    </B>
    <B from={192} to={390} fade={18}>
      <Mosaic
        ids={[93, 119, 120]}
        dur={200}
        cols={3}
        box={{x: 0, y: 300, w: W, h: 460}}
        gap={18}
        delay={198}
        pad={14}
      />
    </B>

    <Para y={800} w={1500} size={26} delay={40}>
      {'The channel strip a room was physically wired around becomes a recallable scene. The room keeps its cabling; what changes is that its configuration stops being a state of the hardware.'}
    </Para>

    <LFCue name="whoosh-grain" at={0} volume={0.4} />
    <LFCue name="click-hard" at={40} volume={0.34} />
    <LFCue name="sweep-down" at={186} volume={0.36} />
    <LFTickRun from={206} count={9} every={10} volume={0.22} />
  </LFStage>
);

// ===========================================================================
// C17 — Continuation into Part 2                                       270f
// assets: 111, 117
// ===========================================================================
export const L1C17: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LFStage part={P}>
      <LFBackdrop id={111} opacity={0.18} blur={58} />
      <LFMotes part={P} opacity={0.45} />
      <ChapterMark part={P} label="PART 1 OF 3 · THE HUB" dur={270} n="17" />

      <Mosaic
        ids={[111, 117]}
        dur={270}
        cols={2}
        box={{x: 0, y: 120, w: W, h: 320}}
        gap={20}
        delay={4}
        pad={14}
      />

      <At x={0} y={478} w={W}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Rule w={140} color={A} thickness={5} />
        </div>
      </At>
      <At x={0} y={520} w={W}>
        <Display
          size={76}
          lh={0.94}
          align="center"
          style={{opacity: ramp(f, [16, 44], [0, 1])}}
        >
          {'THE CONSOLE IS THE HUB —\nBUT A HUB IS ONLY AS STRONG\nAS ITS CONNECTIONS.'}
        </Display>
      </At>
      <At x={0} y={762} w={W}>
        <Sub
          size={32}
          color={A}
          align="center"
          italic={false}
          style={{opacity: ramp(f, [52, 82], [0, 1])}}
        >
          {'In Part 2, we go to the stage.'}
        </Sub>
      </At>
      <At x={0} y={834} w={W}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [70, 100], [0, 1])}}>
          <Micro color={C.inkDim} size={17} tracking={3.4}>
            PART 2 · THE NETWORK — DANTE AND THE SB-16D STAGEBOX
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
// C18 — CTA & Shivansh Electronics outro                               510f
// ===========================================================================
export const L1C18: React.FC = () => (
  <LFStage part={P} wash={1}>
    <LFBackdrop id={98} opacity={0.12} blur={68} />
    <LFMotes part={P} opacity={0.4} />
    <LFOutro part={P} dur={510} />
    <LFCue name="impact-deep" at={4} volume={0.56} />
    <LFCue name="bloom" at={10} volume={0.46} />
    <LFCue name="lift-air" at={60} volume={0.36} />
    <LFTickRun from={70} count={16} every={6} volume={0.16} />
    <LFCue name="chime-final" at={430} volume={0.5} />
  </LFStage>
);
