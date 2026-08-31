/**
 * ONE DELIVERABLE, ASSEMBLED.
 *
 * Every one of the six is this component with a different beat list. That is
 * what keeps the ground colour, the type, the motion grammar, the marketing
 * cadence and the end screen identical across all six without six copies of the
 * same wiring drifting apart.
 *
 * Layer order, bottom to top:
 *   1. the scenes
 *   2. the music bed and the sound effects
 *   3. the contact layer — website / social / WhatsApp, never a logo
 *
 * The contact layer is composited ABOVE the scenes deliberately. Its placement
 * is computed to avoid the scene geometry, so it never covers content; being on
 * top means a strip is never accidentally hidden behind a plate that grows.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import { assertRuntime, frames, starts, type Beat } from "./beat.ts";
import { buildContactPlan, type StripAppearance } from "./contactplan.ts";
import { withGeometry } from "./layout.ts";
import { ContactLayer, Page } from "./shell.tsx";
import { Scene } from "./scenes.tsx";
import { SFX_FOR, SFX_FOR_DEMO } from "./sfx.ts";

export interface DeliverableSpec {
  name: string;
  beats: Beat[];
  portrait: boolean;
  targetFrames: number;
  /** Where this deliverable enters the channel rotation, so the six differ. */
  channelFrom: number;
  /** Music bed basename in public/audio. */
  bed: string;
}

/** Beats + plan, computed once and shared by the composition and the audits. */
export function prepare(spec: DeliverableSpec): {
  beats: Beat[];
  plan: StripAppearance[];
} {
  const beats = withGeometry(spec.beats, spec.portrait);
  assertRuntime(spec.name, beats, spec.targetFrames);
  const plan = buildContactPlan(beats, {
    portrait: spec.portrait,
    perBeat: 2,
    channelFrom: spec.channelFrom,
  });
  return { beats, plan };
}

export const Deliverable: React.FC<{ spec: DeliverableSpec }> = ({ spec }) => {
  const { beats, plan } = React.useMemo(() => prepare(spec), [spec]);
  const s = starts(beats);

  return (
    <Page>
      {/* 1 · scenes */}
      {beats.map((b, i) => (
        <Sequence key={b.id} from={s[i]} durationInFrames={frames(b.sec)} layout="none">
          <Scene beat={b} portrait={spec.portrait} />
        </Sequence>
      ))}

      {/* 2 · audio — bed for the whole runtime, effects on mechanical events */}
      <Audio src={staticFile(`audio/${spec.bed}.wav`)} volume={0.34} />
      {beats.map((b, i) => {
        // A demonstrative's sound is chosen by CONCEPT, not by beat kind: each
        // has a different physical event at its centre, and they land at
        // different frames within the animation.
        const fx = b.kind === "demo" && b.demo ? SFX_FOR_DEMO[b.demo] : SFX_FOR[b.kind];
        if (!fx) return null;
        const at = s[i] + Math.min(fx.at, frames(b.sec) - 20);
        return (
          <Sequence key={`fx-${b.id}`} from={at} durationInFrames={60} layout="none">
            <Audio src={staticFile(`audio/sfx/${fx.file}`)} volume={fx.gain} />
          </Sequence>
        );
      })}

      {/* 3 · the marketing layer */}
      <ContactLayer plan={plan} beats={beats} portrait={spec.portrait} />
    </Page>
  );
};

/** A thumbnail: one frame of design, not a frame grab. */
export const Thumbnail: React.FC<{
  spec: DeliverableSpec;
  beatIndex: number;
  frameInBeat?: number;
}> = ({ spec, beatIndex, frameInBeat = 60 }) => {
  const { beats } = React.useMemo(() => prepare(spec), [spec]);
  const b = beats[beatIndex];
  return (
    <Page>
      <AbsoluteFill>
        <Sequence from={-frameInBeat} durationInFrames={frames(b.sec) + frameInBeat} layout="none">
          <Scene beat={b} portrait={spec.portrait} />
        </Sequence>
      </AbsoluteFill>
    </Page>
  );
};
