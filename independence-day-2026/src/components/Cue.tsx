import React from 'react';
import {Audio, Sequence} from 'remotion';
import {CueName, cue} from '../lib/sfx';

/** One synthesised SFX hit, scheduled at a local frame inside its beat. */
export const Cue: React.FC<{name: CueName; at: number; volume?: number}> = ({
  name,
  at,
  volume = 1,
}) => (
  <Sequence from={at} durationInFrames={140} layout="none" name={`sfx:${name}`}>
    <Audio src={cue(name)} volume={volume} />
  </Sequence>
);

/** A run of evenly spaced hits — used for stepped montage passages. */
export const CueRun: React.FC<{
  name: CueName;
  from: number;
  count: number;
  every: number;
  volume?: number;
  accentEvery?: number;
}> = ({name, from, count, every, volume = 0.5, accentEvery = 4}) => (
  <>
    {new Array(count).fill(0).map((_, i) => (
      <Cue
        key={i}
        name={name}
        at={from + i * every}
        volume={volume * (i % accentEvery === 0 ? 1 : 0.66)}
      />
    ))}
  </>
);
