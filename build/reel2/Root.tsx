import React from "react";
import { Composition } from "remotion";
import { Deliverable, Thumbnail, type DeliverableSpec } from "../shared/deliverable.tsx";
import { PORTRAIT, REEL_FRAMES } from "../shared/theme.ts";
import { BEATS } from "./beats.ts";

export const SPEC: DeliverableSpec = {
  name: "Reel 2 · The Network Fabric",
  beats: BEATS,
  portrait: true,
  targetFrames: REEL_FRAMES,
  channelFrom: 2,
  bed: "bed-reel2",
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="Reel2" component={Deliverable} defaultProps={{ spec: SPEC }}
      durationInFrames={REEL_FRAMES} fps={PORTRAIT.fps}
      width={PORTRAIT.width} height={PORTRAIT.height}
    />
    <Composition
      id="Reel2Thumb" component={Thumbnail}
      defaultProps={{ spec: SPEC, beatIndex: 5, frameInBeat: 90 }}
      durationInFrames={1} fps={PORTRAIT.fps}
      width={PORTRAIT.width} height={PORTRAIT.height}
    />
  </>
);
