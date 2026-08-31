import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Page } from "../shared/shell.tsx";
import { EndScreen } from "../shared/outro.tsx";
import { DEMOS, type DemoKey } from "../shared/concepts.tsx";
import { COLORS } from "../shared/theme.ts";

const Demo: React.FC<{ k: DemoKey; w: number; h: number }> = ({ k, w, h }) => {
  const C = DEMOS[k];
  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: COLORS.paper }}>
        <C w={w} h={h} dur={660} />
      </AbsoluteFill>
    </Page>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition id="OutroPortrait" component={() => (<Page><EndScreen portrait /></Page>)}
      durationInFrames={540} fps={30} width={1080} height={1920} />
    <Composition id="OutroLandscape" component={() => (<Page><EndScreen portrait={false} /></Page>)}
      durationInFrames={540} fps={30} width={1920} height={1080} />
    {(["hdia","summing","redundancy","afv","recall"] as DemoKey[]).map((k) => (
      <Composition key={k} id={`Demo-${k}`} component={() => <Demo k={k} w={1560} h={820} />}
        durationInFrames={660} fps={30} width={1920} height={1080} />
    ))}
  </>
);
