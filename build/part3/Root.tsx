import React from "react";
import { Composition } from "remotion";
import { Deliverable, Thumbnail, type DeliverableSpec } from "../shared/deliverable.tsx";
import { LANDSCAPE, PART_FRAMES } from "../shared/theme.ts";
import { BEATS } from "./beats.ts";

export const SPEC: DeliverableSpec = {
  name: "Part 3 · The Control Surface",
  beats: BEATS,
  portrait: false,
  targetFrames: PART_FRAMES,
  channelFrom: 0,
  bed: "bed-part3",
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="Part3" component={Deliverable} defaultProps={{ spec: SPEC }}
      durationInFrames={PART_FRAMES} fps={LANDSCAPE.fps}
      width={LANDSCAPE.width} height={LANDSCAPE.height}
    />
    <Composition
      id="Part3Thumb" component={Thumbnail}
      defaultProps={{ spec: SPEC, beatIndex: 1, frameInBeat: 90 }}
      durationInFrames={1} fps={LANDSCAPE.fps}
      width={LANDSCAPE.width} height={LANDSCAPE.height}
    />
  </>
);
