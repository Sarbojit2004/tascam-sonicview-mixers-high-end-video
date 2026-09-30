import React from 'react';
import {Composition, Still} from 'remotion';
import {Reel} from './Reel';
import {Thumbnail} from './Thumbnail';
import {MUSIC} from './lib/music';

/**
 * Design space is 1920 x 1920; every render passes --scale=2, so the output is
 * 3840 x 3840 with text, SVG and vector edges drawn natively at 4K.
 */
export const Root: React.FC = () => (
  <>
    <Composition
      id="ReelThunderstruck"
      component={Reel}
      defaultProps={{v: 'thunderstruck' as const}}
      durationInFrames={MUSIC.thunderstruck.frames}
      fps={30}
      width={1920}
      height={1920}
    />
    <Composition
      id="ReelLostSky"
      component={Reel}
      defaultProps={{v: 'lostsky' as const}}
      durationInFrames={MUSIC.lostsky.frames}
      fps={30}
      width={1920}
      height={1920}
    />
    <Still id="ThumbThunderstruck" component={Thumbnail} defaultProps={{v: 'thunderstruck' as const}} width={1920} height={1920} />
    <Still id="ThumbLostSky" component={Thumbnail} defaultProps={{v: 'lostsky' as const}} width={1920} height={1920} />
  </>
);
