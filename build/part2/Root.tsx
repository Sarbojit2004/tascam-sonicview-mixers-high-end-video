import React from "react";
import { Composition } from "remotion";
import { Deliverable, Thumbnail, type DeliverableSpec } from "../shared/deliverable.tsx";
import { LANDSCAPE, PART_FRAMES } from "../shared/theme.ts";
import { BEATS } from "./beats.ts";

export const SPEC: DeliverableSpec = {
  name: "Part 2 · The Network Fabric",
  beats: BEATS,
  portrait: false,
  targetFrames: PART_FRAMES,
  channelFrom: 3,
  bed: "bed-part2",
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="Part2" component={Deliverable} defaultProps={{ spec: SPEC }}
      durationInFrames={PART_FRAMES} fps={LANDSCAPE.fps}
      width={LANDSCAPE.width} height={LANDSCAPE.height}
    />
    <Composition
      id="Part2Thumb" component={Thumbnail}
      defaultProps={{ spec: SPEC, beatIndex: 5, frameInBeat: 90 }}
      durationInFrames={1} fps={LANDSCAPE.fps}
      width={LANDSCAPE.width} height={LANDSCAPE.height}
    />
  </>
);
