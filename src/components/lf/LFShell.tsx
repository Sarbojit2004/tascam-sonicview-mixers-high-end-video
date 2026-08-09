import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {Chapter, LF_CHAPTERS, LFPart} from '../../lib/lf-theme';
import {lfAmbient, lfBed, lfVo} from '../../lib/lf-sfx';
import {loadFonts} from '../../lib/fonts';
import {BrandingLayer} from './LFBrand';

/**
 * Shell for one 298-second long-form part.
 *
 * Three audio layers run for the whole runtime: the constant ambient texture
 * the format requires underneath everything, the part's music bed above it,
 * and the voiceover slot (a silent 298 s placeholder until the read is
 * recorded). Per-chapter SFX are cued inside the chapters themselves.
 *
 * Chapters render OVERLAP frames longer than their slot so each one
 * cross-dissolves into the next instead of the frame dipping to the ground
 * colour at every chapter boundary.
 *
 * BrandingLayer sits above the chapters and below nothing — it is mounted here
 * rather than inside scenes so the cadence is guaranteed by the plan table.
 */

export const LF_OVERLAP = 18;

export type ChapterNode = Chapter & {node: React.ReactNode};

export const LFShell: React.FC<{part: LFPart; chapters: ChapterNode[]}> = ({part, chapters}) => {
  loadFonts();

  const table = LF_CHAPTERS[part];
  if (chapters.length !== table.length) {
    throw new Error(
      `long-form part ${part}: ${chapters.length} chapter nodes for ${table.length} table rows`,
    );
  }

  let f = 0;
  const placed = chapters.map((c, i) => {
    if (c.id !== table[i].id || c.dur !== table[i].dur) {
      throw new Error(
        `long-form part ${part} chapter ${i}: ${c.id}/${c.dur} does not match table ${table[i].id}/${table[i].dur}`,
      );
    }
    const from = f;
    f += c.dur;
    return {...c, from};
  });

  return (
    <AbsoluteFill>
      <Audio src={lfAmbient()} volume={0.30} />
      <Audio src={lfBed(part)} volume={0.34} />
      <Audio src={lfVo(part)} volume={1} />

      {placed.map((c, i) => (
        <Sequence
          key={c.id}
          from={c.from}
          durationInFrames={c.dur + (i < placed.length - 1 ? LF_OVERLAP : 0)}
          name={`${c.id} · ${c.label}`}
        >
          {c.node}
        </Sequence>
      ))}

      <BrandingLayer part={part} />
    </AbsoluteFill>
  );
};
