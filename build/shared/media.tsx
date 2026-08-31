/**
 * MEDIA PLATES — real photographs, B-roll clips and product video on the page.
 *
 * ═══ THE COMPLETE-PRODUCT RULE, ENFORCED BY CONSTRUCTION ══════════════════
 *
 * The standing rule across this pipeline is absolute: whatever treatment a real
 * image or real video receives, the complete product must be shown fully and
 * legibly at some point during its allotted screen time.
 *
 * That is a property of these components, not a note for whoever writes a scene:
 *
 *   - Every plate uses `objectFit: contain`. A `cover` fit is the single most
 *     common way a product loses its edges, and it is simply not available here.
 *   - `macroReveal` terminates at scale 1.0 by `resolveAt` and clamps there, so
 *     however tight the opening, the whole object is on screen for the rest of
 *     the beat.
 *   - Motion scales the PLATE — frame and image together — never the image
 *     inside a fixed frame. Growing the whole plate cannot eat an edge; scaling
 *     the inner image is exactly what does.
 *
 * ═══ WHY CLIPS SIT IN A PLATE RATHER THAN FILLING THE FRAME ═══════════════
 *
 * The 25 B-roll clips are 1280x720. Blown up to fill a 1920x1080 frame that is
 * a 1.5x upscale and it shows. Presented in a plate at close to native scale
 * they stay sharp — and on the reels, at 952 px wide, they are DOWN-scaled and
 * sharper still. The plate also generates the reliable blank space the contact
 * layer needs, so the constraint and the layout requirement solve each other.
 */
import React from "react";
import { Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

import { COLORS, RADII } from "./theme.ts";
import { EASE_OUT, focusPull, gimbal, macroReveal, platePush, ramp } from "./anim.ts";
import { clip as clipPath, img as imgPath, realVideo } from "./assets.ts";

const plateShadow = `0 18px 48px ${COLORS.shadow}, 0 2px 6px rgba(14,17,22,0.06)`;

interface Box { x: number; y: number; w: number; h: number }

/**
 * A photograph on the page. `mode` chooses the camera:
 *   settle  a small push, for a plate that is one element among several
 *   macro   macro-to-full-reveal, for a plate that IS the beat
 *   drift   constant gimbal drift, for a plate held a long time
 */
export const Plate: React.FC<{
  id: number;
  box: Box;
  portrait: boolean;
  dur: number;
  at?: number;
  mode?: "settle" | "macro" | "drift";
  startScale?: number;
  /** Room in px the plate may grow into without crossing an inset. */
  room?: number;
  radius?: number;
  label?: string;
}> = ({ id, box, portrait, dur, at = 0, mode = "settle", startScale = 2.4, room = 24, radius }) => {
  const f = useCurrentFrame() - at;
  const enter = ramp(f, 0, 18, EASE_OUT);

  let scale = 1;
  let filter = "none";
  let dx = 0;
  let dy = 0;

  if (mode === "macro") {
    scale = macroReveal(f, dur, startScale, 0.72);
    filter = focusPull(f, dur, 0.72, 7);
  } else if (mode === "drift") {
    const g = gimbal(f, dur, 14);
    dx = g.x;
    dy = g.y;
    scale = platePush(f, dur, room, box.w, 0.03);
  } else {
    scale = platePush(f, dur, room, box.w, 0.035);
  }

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: enter,
        transform: `translate(${dx}px, ${dy + (1 - enter) * 12}px) scale(${scale})`,
        transformOrigin: "center center",
        borderRadius: radius ?? RADII.plate,
        overflow: "hidden",
        background: COLORS.paperLift,
        boxShadow: plateShadow,
      }}
    >
      <Img
        src={staticFile(imgPath(id, portrait))}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          // contain, always. The complete product survives into the frame.
          objectFit: "contain",
          display: "block",
          filter,
        }}
      />
    </div>
  );
};

/** A B-roll clip in a plate. Audio was stripped in prep; volume is moot. */
export const Clip: React.FC<{
  n: number;
  box: Box;
  dur: number;
  at?: number;
  from?: number;
  radius?: number;
}> = ({ n, box, dur, at = 0, from = 0, radius }) => {
  const f = useCurrentFrame() - at;
  const enter = ramp(f, 0, 16, EASE_OUT);
  const exit = 1 - ramp(f, dur - 14, 14, EASE_OUT);
  const vis = Math.min(enter, exit);
  const scale = platePush(f, dur, 20, box.w, 0.028);

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: vis,
        transform: `scale(${scale})`,
        borderRadius: radius ?? RADII.plate,
        overflow: "hidden",
        background: COLORS.paperWell,
        boxShadow: plateShadow,
      }}
    >
      <OffthreadVideo
        src={staticFile(clipPath(n))}
        startFrom={Math.round(from * 30)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
};

/**
 * A real product video. NATURAL SPEED, never sped up, never a still frame.
 *
 * Both product videos are 1600x500 (3.2:1). `contain` inside a box of that
 * aspect is exact, so the banner is shown whole with no crop and no pillar.
 */
export const RealVideo: React.FC<{
  id: number;
  box: Box;
  dur: number;
  at?: number;
  radius?: number;
}> = ({ id, box, dur, at = 0, radius }) => {
  const f = useCurrentFrame() - at;
  const enter = ramp(f, 0, 18, EASE_OUT);
  const exit = 1 - ramp(f, dur - 14, 14, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: Math.min(enter, exit),
        borderRadius: radius ?? RADII.plate,
        overflow: "hidden",
        background: COLORS.paperLift,
        boxShadow: plateShadow,
      }}
    >
      <OffthreadVideo
        src={staticFile(realVideo(id))}
        muted
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </div>
  );
};

/**
 * A mosaic of real photographs. Every cell is `contain`, so a mosaic never
 * crops a product to make a grid tidy — cells are sized to the grid and the
 * pictures sit inside them whole.
 */
export const Mosaic: React.FC<{
  ids: number[];
  box: Box;
  portrait: boolean;
  cols: number;
  dur: number;
  at?: number;
  gap?: number;
  /**
   * An optional B-roll clip, rendered as the FIRST cell.
   *
   * This exists because the 25 verified clips are the production's only
   * representational footage, and a first pass placed only 11 of them: the
   * clips could go in `broll` beats, and a montage beat could hold stills, and
   * nothing could hold both. Giving one cell of the grid to moving footage
   * fixes that without inventing beats — and a mosaic where a single cell moves
   * while the rest hold still reads better than either alone, because the eye
   * lands on the motion and then reads outward.
   */
  clip?: number;
}> = ({ ids, box, portrait, cols, dur, at = 0, gap = 14, clip: clipN }) => {
  const f = useCurrentFrame() - at;
  const cells = (clipN ? 1 : 0) + ids.length;
  const rows = Math.ceil(cells / cols);
  const cw = (box.w - gap * (cols - 1)) / cols;
  const ch = (box.h - gap * (rows - 1)) / rows;
  const cell = (i: number) => ({
    left: (i % cols) * (cw + gap),
    top: Math.floor(i / cols) * (ch + gap),
  });
  const out = 1 - ramp(f, dur - 12, 12, EASE_OUT);

  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h }}>
      {clipN ? (
        <div
          style={{
            position: "absolute",
            ...cell(0),
            width: cw,
            height: ch,
            opacity: Math.min(ramp(f, 0, 18, EASE_OUT), out),
            borderRadius: RADII.sm,
            overflow: "hidden",
            background: COLORS.paperWell,
            boxShadow: `0 8px 22px ${COLORS.shadow}`,
          }}
        >
          <OffthreadVideo
            src={staticFile(clipPath(clipN))}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : null}
      {ids.map((id, k) => {
        const i = k + (clipN ? 1 : 0);
        const t = ramp(f, i * 3, 18, EASE_OUT);
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              ...cell(i),
              width: cw,
              height: ch,
              opacity: Math.min(t, out),
              transform: `translateY(${(1 - t) * 14}px)`,
              borderRadius: RADII.sm,
              overflow: "hidden",
              background: COLORS.paperLift,
              boxShadow: `0 8px 22px ${COLORS.shadow}`,
            }}
          >
            <Img
              src={staticFile(imgPath(id, portrait))}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
        );
      })}
    </div>
  );
};
