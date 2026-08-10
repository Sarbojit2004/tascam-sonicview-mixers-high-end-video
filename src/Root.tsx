import React from 'react';
import {Composition} from 'remotion';
import {CANVAS, FPS, TOTAL_FRAMES, partDuration} from './lib/theme';
import {Part1Hub} from './Part1';
import {Part2Network} from './Part2';
import {Part3Protocol} from './Part3';
import {Thumb1, Thumb2, Thumb3} from './Thumbnails';
import {LongformPart1Hub} from './LFPart1';
import {LongformPart2Network} from './LFPart2';
import {LongformPart3Protocol} from './LFPart3';
import {LongformThumb1, LongformThumb2, LongformThumb3} from './LFThumbnails';
import {LF_CANVAS, LF_FPS, LF_TOTAL_FRAMES, lfPartDuration} from './lib/lf-theme';

/**
 * Each part is an independently renderable 1080x1920 / 30 fps / 2640-frame
 * composition, so re-rendering one never touches the others.
 */
const guard = (part: 1 | 2 | 3): number => {
  const d = partDuration(part);
  if (d !== TOTAL_FRAMES) {
    throw new Error(`part ${part} scene table sums to ${d}, expected ${TOTAL_FRAMES}`);
  }
  return d;
};

const lfGuard = (part: 1 | 2 | 3): number => {
  const d = lfPartDuration(part);
  if (d !== LF_TOTAL_FRAMES) {
    throw new Error(`long-form part ${part} chapter table sums to ${d}, expected ${LF_TOTAL_FRAMES}`);
  }
  return d;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LongformPart1Hub"
      component={LongformPart1Hub}
      durationInFrames={lfGuard(1)}
      fps={LF_FPS}
      width={LF_CANVAS.w}
      height={LF_CANVAS.h}
    />
    <Composition
      id="LongformPart2Network"
      component={LongformPart2Network}
      durationInFrames={lfGuard(2)}
      fps={LF_FPS}
      width={LF_CANVAS.w}
      height={LF_CANVAS.h}
    />
    <Composition
      id="LongformPart3Protocol"
      component={LongformPart3Protocol}
      durationInFrames={lfGuard(3)}
      fps={LF_FPS}
      width={LF_CANVAS.w}
      height={LF_CANVAS.h}
    />
    <Composition
      id="Part1Hub"
      component={Part1Hub}
      durationInFrames={guard(1)}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
    <Composition
      id="Part2Network"
      component={Part2Network}
      durationInFrames={guard(2)}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
    <Composition
      id="Part3Protocol"
      component={Part3Protocol}
      durationInFrames={guard(3)}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
    {([['LongformThumb1', LongformThumb1], ['LongformThumb2', LongformThumb2], ['LongformThumb3', LongformThumb3]] as const).map(
      ([id, Comp]) => (
        <Composition
          key={id}
          id={id}
          component={Comp}
          durationInFrames={1}
          fps={LF_FPS}
          width={LF_CANVAS.w}
          height={LF_CANVAS.h}
        />
      ),
    )}
    <Composition
      id="Thumb1"
      component={Thumb1}
      durationInFrames={1}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
    <Composition
      id="Thumb2"
      component={Thumb2}
      durationInFrames={1}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
    <Composition
      id="Thumb3"
      component={Thumb3}
      durationInFrames={1}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
  </>
);
