import React from 'react';
import {AbsoluteFill, Composition, Sequence} from 'remotion';
import {BEATS, CANVAS, FPS, TOTAL_FRAMES, totalDuration} from './lib/theme';
import {Reel} from './components/Reel';
import {SafeGuides} from './components/Stage';
import {SCENE_NODES} from './scenes';
import {loadFonts} from './lib/fonts';

const beats = BEATS.map((b, i) => ({...b, node: SCENE_NODES[i]}));

const total = totalDuration();
if (total !== TOTAL_FRAMES) {
  throw new Error(`beat table sums to ${total}, expected ${TOTAL_FRAMES}`);
}

const TheReel: React.FC = () => <Reel beats={beats} />;

/**
 * Verification composition: renders one beat in isolation with the safe-zone
 * guides overlaid, so a still can be checked for content straying into the
 * top/bottom strips or the side margins. Never part of a delivered render.
 */
const SafeCheck: React.FC<{beat: number}> = ({beat}) => {
  loadFonts();
  const i = Math.max(0, Math.min(BEATS.length - 1, beat));
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={BEATS[i].dur} name={BEATS[i].label}>
        {SCENE_NODES[i]}
      </Sequence>
      <SafeGuides />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reel"
      component={TheReel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
    <Composition
      id="SafeCheck"
      component={SafeCheck}
      durationInFrames={200}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
      defaultProps={{beat: 0}}
    />
  </>
);
