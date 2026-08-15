import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, CANVAS, F, Ground, SAFE, chakraFor, greenFor, saffronFor} from './lib/theme';
import {COPY, NAMES} from './lib/copy';
import {EASE_IN_OUT, EASE_OUT, EASE_SLOW, push, ramp, rnd, stag} from './lib/anim';
import {At, Safe, Stage} from './components/Stage';
import {B, Y} from './components/Beat';
import {Cue, CueRun} from './components/Cue';
import {Display, Kicker, KineticLine, Micro, Spec, Sub, TricolourRule} from './components/Type';
import {AshokaChakra, BreakingChain, Charkha, Horizon, IndiaMap, Rosette, SunRise, TricolourRibbon} from './components/Art';
import {
  BUILDINGS,
  BlockPrint,
  Building,
  DANCES,
  Dancer,
  DesertCoast,
  FESTIVALS,
  Festival,
  INSTRUMENTS,
  Instrument,
  MountainRange,
  RiverDelta,
  WeaveGrid,
} from './components/Motifs';

/**
 * The fourteen beats.
 *
 * Every beat: composes only inside the primary safe rect (250..1580, 72px side
 * margins) for anything the viewer must read, carries its own camera move or
 * asset animation on an eased curve, and schedules its own transition cue on
 * top of the reel-wide ambient bed.
 */

/** Shared header block — kicker over headline, top of the safe rect. */
const Head: React.FC<{
  ground: Ground;
  kicker: string;
  head: string;
  size?: number;
  kickerColor?: string;
  headColor?: string;
  kickerFont?: string;
  delay?: number;
  lift?: boolean;
}> = ({ground, kicker, head, size = 84, kickerColor, headColor, kickerFont, delay = 0, lift = false}) => {
  const f = useCurrentFrame();
  return (
    <>
      <At y={Y.kicker}>
        <div
          style={{
            opacity: ramp(f, [delay, delay + 14], [0, 1]),
            transform: `translateY(${ramp(f, [delay, delay + 18], [12, 0], EASE_OUT)}px)`,
          }}
        >
          <Kicker
            ground={ground}
            color={kickerColor}
            lift={lift}
            style={kickerFont ? {fontFamily: kickerFont, letterSpacing: 1.5, fontSize: 26} : undefined}
          >
            {kicker}
          </Kicker>
          <TricolourRule w={122} h={4} style={{marginTop: 14}} />
        </div>
      </At>
      <At y={Y.head} w={SAFE.w}>
        <KineticLine
          text={head.replace(/\n/g, ' \n')}
          ground={ground}
          size={size}
          color={headColor}
          weight={900}
          delay={delay + 6}
          per={2.6}
          lh={1.08}
          lift={lift}
          style={{maxWidth: SAFE.w}}
        />
      </At>
    </>
  );
};

/** Caption block at the foot of the safe rect. */
const Foot: React.FC<{
  ground: Ground;
  sub?: string;
  micro?: string;
  delay?: number;
  lift?: boolean;
  align?: 'left' | 'center';
}> = ({ground, sub, micro, delay = 0, lift = false, align = 'left'}) => {
  const f = useCurrentFrame();
  const o = ramp(f, [delay, delay + 16], [0, 1]);
  const dy = ramp(f, [delay, delay + 22], [14, 0], EASE_OUT);
  return (
    <>
      {sub ? (
        <At y={Y.caption} w={SAFE.w}>
          <div style={{opacity: o, transform: `translateY(${dy}px)`}}>
            <Sub ground={ground} size={31} align={align} lift={lift} style={{maxWidth: SAFE.w}}>
              {sub}
            </Sub>
          </div>
        </At>
      ) : null}
      {micro ? (
        <At y={Y.foot} w={SAFE.w}>
          <div style={{opacity: ramp(f, [delay + 10, delay + 28], [0, 1])}}>
            <Micro ground={ground} align={align} lift={lift}>
              {micro}
            </Micro>
          </div>
        </At>
      ) : null}
    </>
  );
};

/** Even grid of art cells inside the safe rect, with a label under each. */
const Grid: React.FC<{
  ground: Ground;
  cols: number;
  rows: number;
  top: number;
  cellH: number;
  items: {key: string; label: string; sub?: string; art: (p: number, i: number) => React.ReactNode}[];
  stagger?: number;
  start?: number;
  labelColor?: string;
}> = ({ground, cols, rows, top, cellH, items, stagger = 5, start = 6, labelColor}) => {
  const f = useCurrentFrame();
  const cellW = SAFE.w / cols;
  return (
    <>
      {items.slice(0, cols * rows).map((it, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const d = stag(i, stagger, start);
        const p = ramp(f, [d, d + 26], [0, 1], EASE_OUT);
        if (p <= 0.001) return null;
        const lift = ramp(f, [d, d + 30], [22, 0], EASE_OUT);
        return (
          <At key={it.key} x={col * cellW} y={top + row * cellH} w={cellW} h={cellH}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100%',
                transform: `translateY(${lift}px)`,
                opacity: Math.min(1, p * 1.4),
              }}
            >
              <div style={{height: cellH - 66, display: 'flex', alignItems: 'center'}}>
                {it.art(p, i)}
              </div>
              <Micro ground={ground} size={16} tracking={1.9} align="center" color={labelColor}>
                {it.label}
              </Micro>
              {it.sub ? (
                <Micro ground={ground} size={13} tracking={1.4} align="center" style={{marginTop: 5, opacity: 0.72}}>
                  {it.sub}
                </Micro>
              ) : null}
            </div>
          </At>
        );
      })}
    </>
  );
};

// ===========================================================================
// B01 — Dawn & the Tricolour  (170f · 5.67s)
// ===========================================================================
export const B01: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  const rise = ramp(f, [0, 150], [0.06, 1], EASE_SLOW);
  return (
    <Stage ground={g} wash={ramp(f, [0, 90], [0.3, 1])}>
      {/* full-frame sunrise + horizon: background, so it may cross the ambient
          strips — nothing here is content the viewer must read */}
      <AbsoluteFill style={{transform: push(f, 170, [1.10, 1.0])}}>
        <SunRise w={CANVAS.w} h={CANVAS.h} progress={rise} opacity={0.95} />
      </AbsoluteFill>
      <AbsoluteFill style={{transform: push(f, 170, [1.06, 1.0], [0, 0], [10, 0])}}>
        <Horizon w={CANVAS.w} h={CANVAS.h} f={f} opacity={0.9} />
      </AbsoluteFill>

      <Head
        ground={g}
        kicker={COPY.b01.kicker}
        head={COPY.b01.head}
        size={92}
        headColor={C.ivory}
        kickerColor={C.saffronOnNight}
        lift
      />

      {/* the tricolour, unfurling left to right */}
      <At x={0} y={352} w={SAFE.w}>
        <div style={{transform: `translateY(${ramp(f, [24, 70], [26, 0], EASE_OUT)}px)`}}>
          <TricolourRibbon
            w={SAFE.w}
            h={228}
            f={f}
            amp={22}
            reveal={ramp(f, [22, 86], [0, 1], EASE_IN_OUT)}
            opacity={ramp(f, [20, 48], [0, 1])}
          />
        </div>
      </At>

      <Foot ground={g} sub={COPY.b01.sub} delay={92} lift />
      <At y={Y.foot + 6}>
        <div style={{opacity: ramp(f, [110, 136], [0, 1])}}>
          <Spec ground={g} size={30} tracking={6} color={C.gold} lift>
            {COPY.b01.stamp}
          </Spec>
        </div>
      </At>

      <Cue name="conch" at={0} volume={0.85} />
      <Cue name="flag-furl" at={22} volume={0.72} />
      <Cue name="bell-temple" at={104} volume={0.42} />
    </Stage>
  );
};

// ===========================================================================
// B02 — 1947, A Nation Awoke  (150f · 5.00s)
// ===========================================================================
export const B02: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  return (
    <Stage ground={g} wash={0.72}>
      <Head ground={g} kicker={COPY.b02.kicker} head={COPY.b02.head} size={92} kickerColor={C.ivoryDim} />

      {/* the charkha turning, then the chain parting */}
      <B from={0} to={68} fade={14}>
        <At x={0} y={318} w={SAFE.w}>
          <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 90, [0.94, 1.02])}}>
            <Charkha
              size={560}
              f={f}
              color={C.ivorySoft}
              accent={C.saffronOnNight}
              reveal={ramp(f, [4, 62], [0, 1], EASE_OUT)}
            />
          </div>
        </At>
      </B>

      <B from={68} to={150} fade={14}>
        <At x={18} y={330} w={900}>
          <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 82, [0.96, 1.03])}}>
            <BreakingChain
              w={900}
              progress={ramp(f, [72, 124], [0, 1], EASE_OUT)}
              color={C.ivoryDim}
            />
          </div>
        </At>
        <At y={686} w={SAFE.w}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              opacity: ramp(f, [86, 106], [0, 1]),
              transform: `scale(${ramp(f, [86, 120], [0.88, 1], EASE_OUT)})`,
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 900,
                fontSize: 236,
                lineHeight: 1,
                letterSpacing: 4,
                color: C.saffronOnNight,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {COPY.b02.year}
            </div>
          </div>
        </At>
      </B>

      <Foot ground={g} sub={COPY.b02.sub} micro={COPY.b02.foot} delay={26} />

      <Cue name="charkha" at={2} volume={0.62} />
      <Cue name="chain-break" at={78} volume={0.8} />
      <Cue name="impact-deep" at={96} volume={0.55} />
    </Stage>
  );
};

// ===========================================================================
// B03 — The Ashoka Chakra  (118f · 3.93s)
// ===========================================================================
export const B03: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  const p = ramp(f, [4, 96], [0, 1], EASE_OUT);
  return (
    <Stage ground={g} wash={0.85}>
      <Head ground={g} kicker={COPY.b03.kicker} head={COPY.b03.head} size={88} kickerColor={C.chakraOnNight} />

      <At x={0} y={330} w={SAFE.w}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            transform: push(f, 118, [0.92, 1.03]),
          }}
        >
          <AshokaChakra
            size={600}
            progress={p}
            color={C.chakraOnNight}
            spin={ramp(f, [88, 118], [0, 7], EASE_IN_OUT)}
          />
        </div>
      </At>

      {/* the count resolving as the last spoke lands */}
      <At y={946} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [86, 104], [0, 1])}}>
          <Spec ground={g} size={30} tracking={5} color={C.gold} align="center">
            {'24'}
          </Spec>
        </div>
      </At>

      <Foot ground={g} sub={COPY.b03.sub} micro={COPY.b03.micro} delay={30} />

      <Cue name="chakra-ring" at={3} volume={0.72} />
      <Cue name="bell-temple" at={86} volume={0.5} />
    </Stage>
  );
};

// ===========================================================================
// B04 — The Himalaya  (108f · 3.60s)
// ===========================================================================
export const B04: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'paper';
  return (
    <Stage ground={g}>
      <Head ground={g} kicker={COPY.b04.kicker} head={COPY.b04.head} size={86} kickerColor={C.chakraOnPaper} />

      <At x={0} y={318} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 108, [1.0, 1.07], [0, -14])}}>
          <MountainRange size={936} f={f} p={ramp(f, [2, 84], [0, 1], EASE_OUT)} />
        </div>
      </At>

      <Foot ground={g} sub={COPY.b04.sub} delay={24} />

      <Cue name="whoosh-silk" at={0} volume={0.6} />
      <Cue name="wind-peak" at={2} volume={0.46} />
    </Stage>
  );
};

// ===========================================================================
// B05 — Rivers & Forests  (112f · 3.73s)
// ===========================================================================
export const B05: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'paper';
  return (
    <Stage ground={g}>
      <Head ground={g} kicker={COPY.b05.kicker} head={COPY.b05.head} size={78} kickerColor={C.greenOnPaper} />

      <At x={0} y={344} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 112, [1.02, 1.08], [14, -12])}}>
          <RiverDelta size={880} f={f} p={ramp(f, [2, 88], [0, 1], EASE_OUT)} />
        </div>
      </At>

      <Foot ground={g} sub={COPY.b05.sub} delay={26} />

      <Cue name="whoosh-silk" at={0} volume={0.58} />
      <Cue name="water-flow" at={4} volume={0.5} />
    </Stage>
  );
};

// ===========================================================================
// B06 — Desert & Coast  (112f · 3.73s)
// ===========================================================================
export const B06: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'paper';
  return (
    <Stage ground={g}>
      <Head ground={g} kicker={COPY.b06.kicker} head={COPY.b06.head} size={86} kickerColor={C.saffronOnPaper} />

      <At x={0} y={330} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 112, [1.05, 0.99], [-12, 0])}}>
          <DesertCoast size={920} f={f} p={ramp(f, [2, 88], [0, 1], EASE_OUT)} />
        </div>
      </At>

      <Foot ground={g} sub={COPY.b06.sub} delay={26} />

      <Cue name="whoosh-air" at={0} volume={0.6} />
      <Cue name="wind-peak" at={30} volume={0.32} />
      <Cue name="water-flow" at={62} volume={0.34} />
    </Stage>
  );
};

// ===========================================================================
// B07 — Architecture Across Eras  (130f · 4.33s)
// Seven regions and twenty-three centuries, standing together in one frame.
// ===========================================================================
export const B07: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'paper';
  // Two rows (4 + 3) rather than one row of seven: at 936px of safe width a
  // single row leaves each form only ~134px, too small to tell a shikhara from
  // a gopuram, and the region captions collide.
  const ROWS: {items: typeof BUILDINGS; y: number}[] = [
    {items: BUILDINGS.slice(0, 4), y: 310},
    {items: BUILDINGS.slice(4, 7), y: 646},
  ];
  return (
    <Stage ground={g}>
      <Head ground={g} kicker={COPY.b07.kicker} head={COPY.b07.head} size={86} kickerColor={C.saffronOnPaper} />

      {ROWS.map((row, r) => {
        const cellW = SAFE.w / row.items.length;
        const offset = r * 4;
        return (
          <At key={r} x={0} y={row.y} w={SAFE.w} h={318}>
            <div style={{position: 'relative', width: SAFE.w, height: 318, transform: push(f, 130, [0.98, 1.03])}}>
              {row.items.map((b, k) => {
                const i = offset + k;
                const d = stag(i, 8, 8);
                const p = ramp(f, [d, d + 32], [0, 1], EASE_OUT);
                if (p <= 0.001) return null;
                return (
                  <div
                    key={b.kind}
                    style={{
                      position: 'absolute',
                      left: k * cellW,
                      bottom: 66,
                      width: cellW,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Building
                      kind={b.kind}
                      size={Math.min(cellW * 1.12, 252)}
                      p={p}
                      color={C.ink}
                      accent={C.saffronOnPaper}
                    />
                  </div>
                );
              })}
              {/* the common ground line each row stands on */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 62,
                  width: SAFE.w * ramp(f, [6 + r * 24, 60 + r * 24], [0, 1], EASE_OUT),
                  height: 3,
                  backgroundColor: C.inkDim,
                  opacity: 0.5,
                }}
              />
              {/* the era labels arrive with their building */}
              {row.items.map((b, k) => {
                const i = offset + k;
                const d = stag(i, 8, 18);
                const o = ramp(f, [d, d + 20], [0, 1]);
                if (o <= 0.001) return null;
                return (
                  <div
                    key={`${b.kind}-l`}
                    style={{
                      position: 'absolute',
                      left: k * cellW,
                      bottom: 8,
                      width: cellW,
                      opacity: o,
                      textAlign: 'center',
                    }}
                  >
                    <Micro ground={g} size={15} tracking={1.4} align="center" color={C.inkSoft}>
                      {b.name}
                    </Micro>
                    <Micro ground={g} size={12.5} tracking={0.8} align="center" style={{marginTop: 6, opacity: 0.8}}>
                      {b.where}
                    </Micro>
                  </div>
                );
              })}
            </div>
          </At>
        );
      })}

      <Foot ground={g} sub={COPY.b07.sub} delay={44} />

      <Cue name="whoosh-silk" at={0} volume={0.5} />
      <Cue name="stone-set" at={10} volume={0.6} />
      <Cue name="stone-set" at={46} volume={0.44} />
      <Cue name="stone-set" at={74} volume={0.5} />
      <Cue name="impact-deep" at={92} volume={0.4} />
    </Stage>
  );
};

// ===========================================================================
// B08 — Dance, Classical & Folk  (124f · 4.13s)
// ===========================================================================
export const B08: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  return (
    <Stage ground={g} wash={0.8}>
      <Head ground={g} kicker={COPY.b08.kicker} head={COPY.b08.head} size={88} kickerColor={C.gold} />

      <div style={{transform: push(f, 124, [0.98, 1.03])}}>
        <Grid
          ground={g}
          cols={4}
          rows={2}
          top={344}
          cellH={286}
          stagger={5}
          start={8}
          labelColor={C.ivorySoft}
          items={DANCES.map((d) => ({
            key: d.name,
            label: d.name,
            sub: d.where,
            art: (p: number) => (
              <Dancer pose={d.pose} size={196} p={p} color={C.ivory} accent={C.saffronOnNight} />
            ),
          }))}
        />
      </div>

      <Foot ground={g} sub={COPY.b08.sub} delay={54} />

      <Cue name="ghungroo" at={0} volume={0.66} />
      <CueRun name="tabla-na" from={8} count={8} every={5} volume={0.34} accentEvery={4} />
      <Cue name="dhol-hit" at={52} volume={0.44} />
    </Stage>
  );
};

// ===========================================================================
// B09 — Music, Ragas & Rhythms  (112f · 3.73s)
// ===========================================================================
export const B09: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  return (
    <Stage ground={g} wash={0.8}>
      <Head ground={g} kicker={COPY.b09.kicker} head={COPY.b09.head} size={88} kickerColor={C.gold} />

      <div style={{transform: push(f, 112, [1.02, 0.98])}}>
        <Grid
          ground={g}
          cols={4}
          rows={2}
          top={352}
          cellH={272}
          stagger={4.5}
          start={6}
          labelColor={C.ivorySoft}
          items={INSTRUMENTS.map((it) => ({
            key: it.kind,
            label: it.name,
            art: (p: number) => (
              <Instrument kind={it.kind} size={190} p={p} color={C.ivory} accent={C.gold} />
            ),
          }))}
        />
      </div>

      <Foot ground={g} sub={COPY.b09.sub} delay={48} />

      <Cue name="sitar-pluck" at={0} volume={0.66} />
      <CueRun name="tabla-tin" from={10} count={6} every={7} volume={0.30} accentEvery={3} />
      <Cue name="bansuri-swell" at={54} volume={0.36} />
    </Stage>
  );
};

// ===========================================================================
// B10 — Craft, Textile & Table  (118f · 3.93s)
// ===========================================================================
export const B10: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'paper';
  const p = ramp(f, [2, 92], [0, 1], EASE_OUT);
  return (
    <Stage ground={g}>
      <Head ground={g} kicker={COPY.b10.kicker} head={COPY.b10.head} size={82} kickerColor={C.greenOnPaper} />

      {/* the printed cloth runs behind; the rosette is the focal figure */}
      <At x={0} y={356} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: 0.34}}>
          <BlockPrint size={SAFE.w} p={ramp(f, [2, 76], [0, 1], EASE_OUT)} rows={4} cols={5} />
        </div>
      </At>
      <At x={0} y={372} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 118, [0.9, 1.02])}}>
          <Rosette
            size={500}
            f={f}
            petals={12}
            progress={ramp(f, [10, 96], [0, 1], EASE_OUT)}
            color={C.saffronOnPaper}
            color2={C.greenOnPaper}
          />
        </div>
      </At>
      <At x={SAFE.w - 182} y={790}>
        <div style={{opacity: ramp(f, [40, 78], [0, 1])}}>
          <WeaveGrid size={170} p={p} />
        </div>
      </At>
      <At x={12} y={806}>
        <div style={{opacity: ramp(f, [48, 84], [0, 1])}}>
          <WeaveGrid size={146} p={p} n={8} color={C.greenOnPaper} accent={C.saffronOnPaper} />
        </div>
      </At>

      <Foot ground={g} sub={COPY.b10.sub} delay={44} />

      <Cue name="whoosh-silk" at={0} volume={0.55} />
      <Cue name="bell-temple" at={46} volume={0.30} />
      <Cue name="tabla-na" at={12} volume={0.3} />
    </Stage>
  );
};

// ===========================================================================
// B11 — Festivals of the Year  (128f · 4.27s)
// Eight festivals across faiths and regions, at equal visual weight.
// ===========================================================================
export const B11: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  return (
    <Stage ground={g} wash={0.9}>
      <Head ground={g} kicker={COPY.b11.kicker} head={COPY.b11.head} size={80} kickerColor={C.saffronOnNight} />

      <div style={{transform: push(f, 128, [0.97, 1.04])}}>
        <Grid
          ground={g}
          cols={4}
          rows={2}
          top={402}
          cellH={264}
          stagger={5.5}
          start={8}
          labelColor={C.gold}
          items={FESTIVALS.map((fe) => ({
            key: fe.kind,
            label: fe.name,
            art: (p: number) => (
              <Festival kind={fe.kind} size={182} p={p} f={f} color={C.gold} accent={C.saffronOnNight} />
            ),
          }))}
        />
      </div>

      <Foot ground={g} sub={COPY.b11.sub} delay={58} />

      <Cue name="dhol-hit" at={0} volume={0.6} />
      <CueRun name="tabla-na" from={10} count={8} every={5.5} volume={0.30} accentEvery={4} />
      <Cue name="ghungroo" at={46} volume={0.34} />
      <Cue name="bell-temple" at={86} volume={0.34} />
    </Stage>
  );
};

// ===========================================================================
// B12 — Many Tongues, One Country  (118f · 3.93s)
// ===========================================================================
export const B12: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  // three staggered rows: 4 / 4 / 3
  const rows = [NAMES.slice(0, 4), NAMES.slice(4, 8), NAMES.slice(8, 11)];
  return (
    <Stage ground={g} wash={0.82}>
      <Head ground={g} kicker={COPY.b12.kicker} head={COPY.b12.head} size={78} kickerColor={C.chakraOnNight} />

      <At x={0} y={392} w={SAFE.w} h={420}>
        <div
          style={{
            width: SAFE.w,
            height: 420,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
            transform: push(f, 118, [0.96, 1.02]),
          }}
        >
          {rows.map((row, r) => (
            <div key={r} style={{display: 'flex', justifyContent: 'center', gap: 34, alignItems: 'baseline'}}>
              {row.map((n, k) => {
                const i = r * 4 + k;
                const d = stag(i, 5.5, 8);
                const o = ramp(f, [d, d + 20], [0, 1]);
                if (o <= 0.001) return null;
                const dy = ramp(f, [d, d + 26], [20, 0], EASE_OUT);
                return (
                  <div key={n.label} style={{opacity: o, transform: `translateY(${dy}px)`, textAlign: 'center'}}>
                    <div
                      style={{
                        fontFamily: (F as Record<string, string>)[n.font],
                        fontWeight: 600,
                        fontSize: 62,
                        lineHeight: 1.3,
                        color: i % 3 === 0 ? C.saffronOnNight : i % 3 === 1 ? C.ivory : C.greenOnNight,
                      }}
                    >
                      {n.text}
                    </div>
                    <Micro ground={g} size={13} tracking={1.6} align="center" style={{marginTop: 2}}>
                      {n.label}
                    </Micro>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </At>

      <Foot ground={g} sub={COPY.b12.sub} micro={COPY.b12.micro} delay={62} />

      <Cue name="whoosh-silk" at={0} volume={0.55} />
      <CueRun name="tabla-tin" from={8} count={11} every={5.5} volume={0.26} accentEvery={4} />
      <Cue name="bansuri-swell" at={64} volume={0.34} />
    </Stage>
  );
};

// ===========================================================================
// B13 — Unity in Diversity  (120f · 4.00s) — opens the closing passage
// ===========================================================================
export const B13: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'paper';
  return (
    <Stage ground={g}>
      <Head
        ground={g}
        kicker={COPY.b13.kicker}
        head={COPY.b13.head}
        size={88}
        kickerColor={C.saffronOnPaper}
        kickerFont={F.deva}
      />

      <At x={0} y={286} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', transform: push(f, 120, [0.95, 1.03])}}>
          <IndiaMap
            size={636}
            progress={ramp(f, [4, 74], [0, 1], EASE_OUT)}
            points={ramp(f, [50, 110], [0, 1], EASE_OUT)}
            color={chakraFor(g)}
            fill={`${greenFor(g)}14`}
            pointColor={saffronFor(g)}
            strokeWidth={4}
          />
        </div>
      </At>

      {/* a tricolour thread sweeping across the closing passage */}
      <At x={0} y={1004} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [78, 104], [0, 1])}}>
          <TricolourRule w={ramp(f, [78, 116], [0, 340], EASE_OUT)} h={6} />
        </div>
      </At>

      <Foot ground={g} sub={COPY.b13.sub} delay={64} />

      <Cue name="riser-tanpura" at={0} volume={0.5} />
      <Cue name="whoosh-silk" at={2} volume={0.44} />
      <Cue name="bell-temple" at={74} volume={0.42} />
    </Stage>
  );
};

// ===========================================================================
// B14 — The Wish  (180f · 6.00s)
//
// The wish is entirely about India. "Shivansh Electronics" appears once, name
// only, as a signature beneath it — no designation, no tagline, no contact
// detail, no call to action.
// ===========================================================================
export const B14: React.FC = () => {
  const f = useCurrentFrame();
  const g: Ground = 'night';
  return (
    <Stage ground={g} wash={1}>
      {/* the chakra, held back as a watermark behind the wish */}
      <At x={(SAFE.w - 760) / 2} y={190}>
        <div style={{opacity: ramp(f, [0, 60], [0, 0.11])}}>
          <AshokaChakra
            size={760}
            progress={1}
            color={C.chakraOnNight}
            spin={ramp(f, [0, 180], [0, 12], EASE_SLOW)}
          />
        </div>
      </At>

      {/* soft rising motes of light through the closing beat */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {new Array(24).fill(0).map((_, i) => {
          const sp = 0.30 + rnd(i * 5) * 0.55;
          const y0 = SAFE.y + SAFE.h - ((f * sp + rnd(i * 3) * 900) % 980);
          const o = ramp(f, [6, 44], [0, 0.5]) * (0.4 + rnd(i * 7) * 0.6);
          const s = 2.4 + rnd(i * 11) * 3.6;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: SAFE.x + rnd(i * 13) * SAFE.w,
                top: y0,
                width: s,
                height: s,
                borderRadius: s,
                backgroundColor: i % 3 === 0 ? C.saffronOnNight : C.gold,
                opacity: o,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* शुभ स्वतंत्रता दिवस */}
      <At y={196} w={SAFE.w}>
        <div
          style={{
            opacity: ramp(f, [4, 30], [0, 1]),
            transform: `translateY(${ramp(f, [4, 36], [16, 0], EASE_OUT)}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: F.deva,
              fontWeight: 600,
              fontSize: 66,
              lineHeight: 1.5,
              color: C.saffronOnNight,
            }}
          >
            {COPY.b14.deva}
          </div>
        </div>
      </At>

      <At y={330} w={SAFE.w}>
        <div style={{opacity: ramp(f, [24, 50], [0, 1]), textAlign: 'center'}}>
          <Sub ground={g} size={38} align="center" color={C.ivorySoft}>
            {COPY.b14.line1}
          </Sub>
        </div>
      </At>

      <At y={412} w={SAFE.w}>
        <KineticLine
          text={COPY.b14.head}
          ground={g}
          size={98}
          color={C.ivory}
          weight={900}
          delay={36}
          per={3.4}
          lh={1.14}
          align="center"
        />
      </At>

      <At y={664} w={SAFE.w}>
        <div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, [72, 96], [0, 1])}}>
          <TricolourRule w={ramp(f, [72, 108], [0, 300], EASE_OUT)} h={7} />
        </div>
      </At>

      <At y={716} w={SAFE.w}>
        <div style={{opacity: ramp(f, [86, 110], [0, 1]), textAlign: 'center'}}>
          <Display ground={g} size={54} weight={700} color={C.gold} align="center">
            {COPY.b14.sub}
          </Display>
        </div>
      </At>

      {/* the flag, low in the frame, under the wish */}
      <At x={0} y={840} w={SAFE.w}>
        <div style={{opacity: ramp(f, [96, 128], [0, 1])}}>
          <TricolourRibbon
            w={SAFE.w}
            h={186}
            f={f}
            amp={16}
            reveal={ramp(f, [92, 134], [0, 1], EASE_OUT)}
          />
        </div>
      </At>

      {/* the single Shivansh Electronics mention — name only */}
      <At y={1136} w={SAFE.w}>
        <div style={{opacity: ramp(f, [124, 152], [0, 1]), textAlign: 'center'}}>
          <div
            style={{
              width: 62,
              height: 1.6,
              backgroundColor: C.ivoryDim,
              margin: '0 auto 22px',
              opacity: 0.7,
            }}
          />
          <Spec ground={g} size={31} tracking={5.4} color={C.ivorySoft} align="center">
            {COPY.b14.signature}
          </Spec>
        </div>
      </At>

      <Cue name="shimmer-gold" at={0} volume={0.56} />
      <Cue name="chime-close" at={34} volume={0.6} />
      <Cue name="flag-furl" at={96} volume={0.4} />
      <Cue name="bell-temple" at={124} volume={0.42} />
    </Stage>
  );
};

export const SCENE_NODES: React.ReactNode[] = [
  <B01 key="B01" />,
  <B02 key="B02" />,
  <B03 key="B03" />,
  <B04 key="B04" />,
  <B05 key="B05" />,
  <B06 key="B06" />,
  <B07 key="B07" />,
  <B08 key="B08" />,
  <B09 key="B09" />,
  <B10 key="B10" />,
  <B11 key="B11" />,
  <B12 key="B12" />,
  <B13 key="B13" />,
  <B14 key="B14" />,
];

/** Re-exported so the still-check composition can frame a single beat. */
export const SCENES_BY_ID: Record<string, React.ReactNode> = Object.fromEntries(
  ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12', 'B13', 'B14'].map(
    (id, i) => [id, SCENE_NODES[i]],
  ),
);

// `Safe` and `greenFor` are part of the layout toolkit and intentionally
// re-exported for the still-check composition.
export {Safe, greenFor};
