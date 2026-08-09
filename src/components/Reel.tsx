import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {Part, Scene, SCENES} from '../lib/theme';
import {bed, vo} from '../lib/sfx';
import {loadFonts} from '../lib/fonts';

/**
 * Shell for one 88-second part.
 *
 * Scenes are laid out from the part's scene table and each one is rendered
 * OVERLAP frames longer than its slot, so the incoming scene cross-dissolves
 * over the outgoing one instead of the frame dipping to the ground colour at
 * every cut. That overlap is what lets the reel run at the very high cut rate
 * this asset volume demands without feeling like a slideshow.
 *
 * The music bed sits at a level that already leaves headroom for the voiceover
 * that gets recorded separately — public/vo/voiceover-reel-partN.mp3 is a
 * silent 88 s placeholder occupying the exact slot that recording will fill.
 */

export const OVERLAP = 14;

export type SceneNode = Scene & {node: React.ReactNode};

export const Reel: React.FC<{part: Part; scenes: SceneNode[]}> = ({part, scenes}) => {
  loadFonts();

  const table = SCENES[part];
  if (scenes.length !== table.length) {
    throw new Error(
      `part ${part}: ${scenes.length} scene nodes for ${table.length} table rows`,
    );
  }

  let f = 0;
  const placed = scenes.map((s, i) => {
    if (s.id !== table[i].id || s.dur !== table[i].dur) {
      throw new Error(
        `part ${part} scene ${i}: ${s.id}/${s.dur} does not match table ${table[i].id}/${table[i].dur}`,
      );
    }
    const from = f;
    f += s.dur;
    return {...s, from};
  });

  return (
    <AbsoluteFill>
      <Audio src={bed(part)} volume={0.40} />
      <Audio src={vo(part)} volume={1} />
      {placed.map((s, i) => (
        <Sequence
          key={s.id}
          from={s.from}
          durationInFrames={s.dur + (i < placed.length - 1 ? OVERLAP : 0)}
          name={`${s.id} · ${s.label}`}
        >
          {s.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
