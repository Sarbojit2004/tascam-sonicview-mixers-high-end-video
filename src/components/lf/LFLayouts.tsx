import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, LF_SAFE, LFPart, lfAccent} from '../../lib/lf-theme';
import {Chip, Display, Kicker, KineticLine, Micro, Rule, Spec, Sub} from '../Type';
import {At} from './LFStage';
import {ramp, stag} from '../../lib/anim';

/**
 * Composed layout primitives for the landscape frame.
 *
 * The three long-form parts share these so a chapter reads as the same
 * publication regardless of which part it is in, and so a chapter file stays
 * about content rather than about geometry.
 */

/** Vertical rhythm inside the 1816 x 992 safe rect. */
export const LY = {
  mark: 0,
  kicker: 76,
  head: 114,
  rule: 306,
  body: 348,
  colLw: 780,
  colRx: 840,
  colRw: 976,
} as const;

/** Headline stack: kicker, display headline, accent rule, optional subhead. */
export const TitleBlock: React.FC<{
  part: LFPart;
  kicker: string;
  head: string;
  sub?: string;
  w?: number;
  x?: number;
  y?: number;
  headSize?: number;
  subSize?: number;
  kinetic?: boolean;
  highlight?: number;
  delay?: number;
}> = ({
  part,
  kicker,
  head,
  sub,
  w = LY.colLw,
  x = 0,
  y = LY.kicker,
  headSize = 78,
  subSize = 27,
  kinetic = false,
  highlight,
  delay = 0,
}) => {
  const a = lfAccent(part);
  const f = useCurrentFrame();
  return (
    <>
      <At x={x} y={y} w={w}>
        <Kicker color={a} size={19} tracking={4.4}>
          {kicker}
        </Kicker>
      </At>
      <At x={x} y={y + 38} w={w}>
        {kinetic ? (
          <KineticLine
            text={head.replace(/\n/g, ' ')}
            size={headSize}
            per={2.6}
            delay={delay + 6}
            lh={0.92}
            highlight={highlight === undefined ? [] : [{word: highlight, color: a}]}
          />
        ) : (
          <Display size={headSize} lh={0.90}>
            {head}
          </Display>
        )}
      </At>
      {sub ? (
        // offset from the real line count — a three-line headline used to run
        // straight through a sub positioned for two
        <At x={x} y={y + 38 + headSize * 0.94 * head.split('\n').length + 34} w={w}>
          <div style={{opacity: ramp(f, [delay + 18, delay + 40], [0, 1])}}>
            <Rule w={104} color={a} thickness={4} style={{marginBottom: 22}} />
            <Sub size={subSize} color={C.inkSoft} lh={1.42}>
              {sub}
            </Sub>
          </div>
        </At>
      ) : null}
    </>
  );
};

/** A vertical list of verified figures. Monospaced, staggered in. */
export const SpecList: React.FC<{
  part: LFPart;
  items: {k: string; v: string}[];
  x?: number;
  y: number;
  w?: number;
  delay?: number;
  size?: number;
}> = ({part, items, x = 0, y, w = LY.colLw, delay = 0, size = 25}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  return (
    <At x={x} y={y} w={w}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
        {items.map((it, i) => {
          const p = ramp(f, [stag(i, 5, delay), stag(i, 5, delay) + 16], [0, 1]);
          return (
            <div
              key={it.k}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                opacity: p,
                transform: `translateX(${(1 - p) * -16}px)`,
              }}
            >
              <div style={{width: 8, height: 8, borderRadius: 8, backgroundColor: a, flexShrink: 0}} />
              <Micro color={C.inkDim} size={15} tracking={2.2} style={{width: 250, flexShrink: 0}}>
                {it.k}
              </Micro>
              <Spec size={size} color={C.ink} weight={500} tracking={0.3}>
                {it.v}
              </Spec>
            </div>
          );
        })}
      </div>
    </At>
  );
};

/** Row of protocol/spec chips. */
export const ChipRow: React.FC<{
  part: LFPart;
  items: {label: string; accent?: boolean}[];
  x?: number;
  y: number;
  w?: number;
  delay?: number;
  size?: number;
}> = ({part, items, x = 0, y, w = LF_SAFE.w, delay = 0, size = 18}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  return (
    <At x={x} y={y} w={w}>
      <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
        {items.map((it, i) => {
          const p = ramp(f, [stag(i, 4, delay), stag(i, 4, delay) + 14], [0, 1]);
          return (
            <div key={it.label} style={{opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
              <Chip bg={it.accent ? a : C.ink} size={size}>
                {it.label}
              </Chip>
            </div>
          );
        })}
      </div>
    </At>
  );
};

/** A raised panel for a pull-quote or a definition. */
export const Panel: React.FC<{
  part: LFPart;
  label: string;
  body: string;
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  size?: number;
}> = ({part, label, body, x, y, w, h, delay = 0, size = 27}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const p = ramp(f, [delay, delay + 20], [0, 1]);
  return (
    <At x={x} y={y} w={w} h={h}>
      <div
        style={{
          height: '100%',
          backgroundColor: C.paperHi,
          border: `1px solid ${C.line}`,
          borderRadius: 16,
          padding: '26px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 14,
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
        }}
      >
        <Micro color={a} size={15} tracking={2.6}>
          {label}
        </Micro>
        <Spec size={size} color={C.ink} weight={500} tracking={0.3} style={{lineHeight: 1.36}}>
          {body}
        </Spec>
      </div>
    </At>
  );
};

/** A big single figure with a unit and caption — for latency, channel counts. */
export const BigFigure: React.FC<{
  part: LFPart;
  value: string;
  unit?: string;
  caption: string;
  x: number;
  y: number;
  size?: number;
  delay?: number;
}> = ({part, value, unit, caption, x, y, size = 150, delay = 0}) => {
  const f = useCurrentFrame();
  const a = lfAccent(part);
  const p = ramp(f, [delay, delay + 22], [0, 1]);
  return (
    <At x={x} y={y}>
      <div style={{opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
          <Display size={size} lh={0.86} color={C.ink}>
            {value}
          </Display>
          {unit ? (
            <Display size={size * 0.30} lh={1} color={a}>
              {unit}
            </Display>
          ) : null}
        </div>
        <Micro color={C.inkDim} size={16} tracking={2.8} style={{marginTop: 12}}>
          {caption}
        </Micro>
      </div>
    </At>
  );
};

/** Body paragraph for the explanatory depth long-form allows. */
export const Para: React.FC<{
  children: React.ReactNode;
  x?: number;
  y: number;
  w?: number;
  size?: number;
  delay?: number;
  color?: string;
}> = ({children, x = 0, y, w = LY.colLw, size = 26, delay = 0, color = C.inkSoft}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 22], [0, 1]);
  return (
    <At x={x} y={y} w={w}>
      <div style={{opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
        <Sub size={size} color={color} lh={1.46} italic={false} weight={400}>
          {children as string}
        </Sub>
      </div>
    </At>
  );
};
