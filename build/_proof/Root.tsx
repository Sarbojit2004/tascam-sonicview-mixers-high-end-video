import React from "react";
import { Composition } from "remotion";
import { Page } from "../shared/shell.tsx";
import { EndScreen } from "../shared/outro.tsx";

export const Root: React.FC = () => (
  <>
    <Composition id="OutroPortrait" component={() => (<Page><EndScreen portrait /></Page>)}
      durationInFrames={540} fps={30} width={1080} height={1920} />
    <Composition id="OutroLandscape" component={() => (<Page><EndScreen portrait={false} /></Page>)}
      durationInFrames={540} fps={30} width={1920} height={1080} />
  </>
);
