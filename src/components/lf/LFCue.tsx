import React from 'react';
import {Audio, Sequence} from 'remotion';
import {LFCueName, lfCue} from '../../lib/lf-sfx';

/** One synthesised SFX hit, scheduled at a local frame inside its chapter. */
export const LFCue: React.FC<{name: LFCueName; at: number; volume?: number}> = ({
  name,
  at,
  volume = 1,
}) => (
  <Sequence from={at} durationInFrames={300} layout="none" name={`sfx:${name}`}>
    <Audio src={lfCue(name)} volume={volume} />
  </Sequence>
);

/** A run of evenly spaced clock ticks — the packet / clocking motif. */
export const LFTickRun: React.FC<{
  from: number;
  count: number;
  every: number;
  volume?: number;
  hi?: boolean;
}> = ({from, count, every, volume = 0.30, hi = false}) => (
  <>
    {new Array(count).fill(0).map((_, i) => (
      <LFCue
        key={i}
        name={hi && i % 2 === 1 ? 'tick-hi' : 'tick'}
        at={from + i * every}
        volume={volume * (i % 4 === 0 ? 1 : 0.66)}
      />
    ))}
  </>
);
