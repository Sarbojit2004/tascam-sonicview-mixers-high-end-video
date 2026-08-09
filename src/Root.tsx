import React from 'react';
import {Composition} from 'remotion';
import {CANVAS, FPS, TOTAL_FRAMES, partDuration} from './lib/theme';
import {Part1Hub} from './Part1';
import {Part2Network} from './Part2';
import {Part3Protocol} from './Part3';
import {Thumb1, Thumb2, Thumb3} from './Thumbnails';

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

export const RemotionRoot: React.FC = () => (
  <>
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
