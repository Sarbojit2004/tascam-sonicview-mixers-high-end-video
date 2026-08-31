/**
 * THE SCENE RENDERER.
 *
 * One renderer serves all six deliverables. A beat declares WHAT it is about;
 * layout.ts decides WHERE things sit on each canvas; this file draws it.
 *
 * Keeping the three apart is what lets the reels and the parts share a design
 * system without the reels being the parts re-cropped: the same beat kind gets
 * a genuinely different composition per canvas, because the boxes differ, while
 * the type, motion and media treatment stay identical.
 *
 * NO LOGO IS IMPORTED HERE. The end screen is the only component that touches
 * logo.tsx, and audit_branding.mjs fails the build if that changes.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { COLORS } from "./theme.ts";
import { frames, type Beat } from "./beat.ts";
import { boxesFor } from "./layout.ts";
import { beatOpacity } from "./anim.ts";
import { Clip, Mosaic, Plate, RealVideo } from "./media.tsx";
import { DataBlock, Editorial, Headline, HeroFigure, Micro, Rule, Sub } from "./type.tsx";
import { DEMOS } from "./concepts.tsx";
import { EndScreen } from "./outro.tsx";

interface Props {
  beat: Beat;
  portrait: boolean;
}

export const Scene: React.FC<Props> = ({ beat, portrait }) => {
  const f = useCurrentFrame();
  const dur = frames(beat.sec);
  const { media, copy } = boxesFor(beat, portrait);
  const fade = beatOpacity(f, dur, 12, 12);

  const big = portrait ? 1 : 1.02;
  const H1 = Math.round((portrait ? 62 : 60) * big);
  const H2 = Math.round((portrait ? 30 : 29) * big);
  const FIG = Math.round((portrait ? 108 : 122) * big);

  const copyBlock = (children: React.ReactNode) =>
    copy ? (
      <div
        style={{
          position: "absolute",
          left: copy.x,
          top: copy.y,
          width: copy.w,
          maxHeight: copy.h,
          display: "flex",
          flexDirection: "column",
          gap: portrait ? 20 : 18,
        }}
      >
        {children}
      </div>
    ) : null;

  const label = beat.label ? <Micro text={beat.label} at={2} /> : null;

  let body: React.ReactNode = null;

  switch (beat.kind) {
    case "outro":
      return <EndScreen portrait={portrait} />;

    case "cold":
    case "broll":
      body = (
        <>
          {media && beat.clip ? (
            <Clip n={beat.clip} box={media} dur={dur} from={beat.clipFrom ?? 0} />
          ) : media && beat.images?.length ? (
            <Plate id={beat.images[0]} box={media} portrait={portrait} dur={dur} mode="drift" />
          ) : null}
          {copyBlock(
            <>
              {label}
              {beat.hero ? <Headline text={beat.hero} size={H1} at={10} /> : null}
              {beat.sub ? <Sub text={beat.sub} size={H2} at={20} maxW={copy?.w} /> : null}
            </>,
          )}
        </>
      );
      break;

    case "realvideo":
      body = (
        <>
          {media && beat.video ? (
            <RealVideo id={beat.video} box={media} dur={dur} />
          ) : null}
          {copyBlock(
            <>
              {label}
              {beat.hero ? <Headline text={beat.hero} size={H1} at={10} /> : null}
              {beat.sub ? <Sub text={beat.sub} size={H2} at={20} maxW={copy?.w} /> : null}
            </>,
          )}
        </>
      );
      break;

    case "hero":
    case "macro":
    case "screen":
      body = (
        <>
          {media && beat.images?.length ? (
            <Plate
              id={beat.images[0]}
              box={media}
              portrait={portrait}
              dur={dur}
              mode={beat.kind === "macro" ? "macro" : beat.kind === "hero" ? "settle" : "drift"}
              startScale={beat.kind === "macro" ? 2.3 : 1}
            />
          ) : null}
          {copyBlock(
            <>
              {label}
              {beat.hero ? <Headline text={beat.hero} size={H1} at={10} /> : null}
              {beat.sub ? <Sub text={beat.sub} size={H2} at={22} maxW={copy?.w} /> : null}
              {beat.body?.length ? (
                <DataBlock rows={beat.body} at={34} width={copy?.w} size={portrait ? 24 : 23} />
              ) : null}
            </>,
          )}
        </>
      );
      break;

    case "montage":
      body = (
        <>
          {media && beat.images?.length ? (
            <Mosaic
              ids={beat.images}
              box={media}
              portrait={portrait}
              cols={portrait ? 2 : Math.min(4, beat.images.length + (beat.clip ? 1 : 0))}
              dur={dur}
              clip={beat.clip}
            />
          ) : null}
          {copyBlock(
            <>
              {label}
              {beat.hero ? <Headline text={beat.hero} size={Math.round(H1 * 0.82)} at={8} /> : null}
            </>,
          )}
        </>
      );
      break;

    case "specs":
      body = (
        <>
          {media && beat.images?.length ? (
            <Plate id={beat.images[0]} box={media} portrait={portrait} dur={dur} mode="drift" />
          ) : null}
          {copyBlock(
            <>
              {label}
              {beat.hero ? (
                <HeroFigure
                  figure={beat.hero}
                  subtext={beat.sub ?? ""}
                  size={FIG}
                  subSize={portrait ? 21 : 21}
                  color={COLORS.accent}
                  at={10}
                />
              ) : null}
              {beat.body?.length ? (
                <DataBlock rows={beat.body} at={30} width={copy?.w} size={portrait ? 25 : 24} />
              ) : null}
            </>,
          )}
        </>
      );
      break;

    case "demo": {
      const D = beat.demo ? DEMOS[beat.demo] : null;
      body = (
        <>
          {copyBlock(
            <>
              {label}
              {beat.hero ? <Headline text={beat.hero} size={Math.round(H1 * 0.78)} at={6} /> : null}
            </>,
          )}
          {media && D ? (
            <div style={{ position: "absolute", left: media.x, top: media.y }}>
              <D
                w={media.w}
                h={media.h}
                dur={dur}
                {...(beat.demo === "recall" ? { unit: beat.unit === "sv16" ? "sv16" : "sv24" } : {})}
              />
            </div>
          ) : null}
        </>
      );
      break;
    }

    case "problem":
      body = copyBlock(
        <>
          {label}
          {beat.hero ? (
            <Editorial text={beat.hero} size={Math.round(H1 * 1.12)} at={8} color={COLORS.ink} />
          ) : null}
          {beat.sub ? <Sub text={beat.sub} size={H2} at={26} maxW={copy?.w} /> : null}
        </>,
      );
      break;

    case "statement":
    case "bridge":
    default:
      body = copyBlock(
        <>
          {label}
          {beat.hero ? <Headline text={beat.hero} size={H1} at={8} /> : null}
          <Rule width={portrait ? 200 : 260} at={22} />
          {beat.sub ? <Sub text={beat.sub} size={H2} at={28} maxW={copy?.w} /> : null}
          {beat.body?.length ? (
            <DataBlock rows={beat.body} at={38} width={copy?.w} size={portrait ? 25 : 24} />
          ) : null}
        </>,
      );
      break;
  }

  return (
    <AbsoluteFill style={{ background: COLORS.paper, opacity: fade }}>{body}</AbsoluteFill>
  );
};
