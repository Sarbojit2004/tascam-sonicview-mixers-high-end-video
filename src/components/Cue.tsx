import React from 'react';
import {Audio, Sequence} from 'remotion';
import {CueName, cue} from '../lib/sfx';

/** One synthesised SFX hit, scheduled at a local frame inside its scene. */
export const Cue: React.FC<{name: CueName; at: number; volume?: number}> = ({
  name,
  at,
  volume = 1,
}) => (
  <Sequence from={at} durationInFrames={200} layout="none" name={`sfx:${name}`}>
    <Audio src={cue(name)} volume={volume} />
  </Sequence>
);

/** A run of evenly spaced clock ticks — the montage / packet motif. */
export const TickRun: React.FC<{
  from: number;
  count: number;
  every: number;
  volume?: number;
  hi?: boolean;
}> = ({from, count, every, volume = 0.34, hi = false}) => (
  <>
    {new Array(count).fill(0).map((_, i) => (
      <Cue
        key={i}
        name={hi && i % 2 === 1 ? 'tick-hi' : 'tick'}
        at={from + i * every}
        volume={volume * (i % 4 === 0 ? 1 : 0.68)}
      />
    ))}
  </>
);
