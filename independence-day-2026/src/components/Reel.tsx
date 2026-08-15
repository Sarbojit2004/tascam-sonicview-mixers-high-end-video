import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {Beat, BEATS} from '../lib/theme';
import {ambient, bed, vo} from '../lib/sfx';
import {loadFonts} from '../lib/fonts';

/**
 * Shell for the 60-second reel.
 *
 * Beats are laid out from the beat table and each renders OVERLAP frames
 * longer than its slot, so the incoming beat cross-dissolves over the outgoing
 * one instead of the frame dipping to the ground colour at every cut. That
 * overlap is what lets 14 beats land in 60 seconds without reading as a
 * slideshow.
 *
 * Three continuous audio layers run the whole runtime:
 *   - the ambient texture bed, at a low constant level, never interrupted
 *   - the music bed, whose own energy contour is cut to the beat table
 *   - the voiceover slot — a silent 60 s placeholder as delivered; see
 *     VO_SCRIPT.md for the timed script and how to drop a recording in
 * Per-beat transition cues are scheduled inside each beat's own scene.
 */

export const OVERLAP = 14;

export type BeatNode = Beat & {node: React.ReactNode};

export const Reel: React.FC<{beats: BeatNode[]}> = ({beats}) => {
  loadFonts();

  if (beats.length !== BEATS.length) {
    throw new Error(`${beats.length} beat nodes for ${BEATS.length} table rows`);
  }

  let f = 0;
  const placed = beats.map((b, i) => {
    if (b.id !== BEATS[i].id || b.dur !== BEATS[i].dur) {
      throw new Error(
        `beat ${i}: ${b.id}/${b.dur} does not match table ${BEATS[i].id}/${BEATS[i].dur}`,
      );
    }
    const from = f;
    f += b.dur;
    return {...b, from};
  });

  return (
    <AbsoluteFill>
      {/* the constant ambient texture layer — plays for the entire 60 s */}
      <Audio src={ambient()} volume={0.30} />
      {/* the score */}
      <Audio src={bed()} volume={0.62} />
      {/* the voiceover slot — silent placeholder as shipped */}
      <Audio src={vo()} volume={1} />
      {placed.map((b, i) => (
        <Sequence
          key={b.id}
          from={b.from}
          durationInFrames={b.dur + (i < placed.length - 1 ? OVERLAP : 0)}
          name={`${b.id} · ${b.label}`}
        >
          {b.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
