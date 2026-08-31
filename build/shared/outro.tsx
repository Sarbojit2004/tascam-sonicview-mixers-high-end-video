/**
 * THE END SCREEN — the only place in any deliverable where a logo exists.
 *
 * §6.1 requires all of this, TOGETHER, in one composed closing frame, on every
 * one of the six deliverables:
 *
 *   1. The Shivansh Electronics logo
 *   2. The TASCAM logo
 *   3. "Authorized Partner of TASCAM"
 *   4. The website, with its icon
 *   5. All three social handles, each with its own icon
 *   6. All three WhatsApp numbers TOGETHER, with the WhatsApp icon, in the
 *      exact format: [icon] +91 98316 62458, +91 91477 00677, +91 89818 07755
 *   7. (this build) a technical-consultation CTA — never a purchase close
 *
 * Each of the three parts gets its own, exactly as each reel does. The parts are
 * not three chapters of one video with a shared ending; each is standalone and
 * resolves itself.
 *
 * COMPOSITION. Both marks sit bare on the page, separated by a hairline rule,
 * scaled to equal optical weight rather than equal height (their aspects differ
 * by nearly 2x — see logo.tsx). Then the designation, then the four icon-paired
 * rows, then the WhatsApp block, then the CTA. Everything arrives on a stagger
 * so the card assembles rather than appearing.
 */
import React from "react";
import { useCurrentFrame } from "remotion";

import { BRAND, CTA } from "./brand.ts";
import { END_SCREEN_REQUIRED, ROWS, WHATSAPP_LINE } from "./endscreen.ts";
import { BrandMark, OPTICAL_HEIGHT } from "./logo.tsx";
import { ChannelIcon } from "./icons.tsx";
import { COLORS, PORTRAIT, LANDSCAPE, SAFE, SPACE } from "./theme.ts";
import { EASE_OUT, ramp } from "./anim.ts";
import { micro, sanitizeGlyphs, spec, subhead } from "./fonts.ts";

interface Props { portrait: boolean }

const Rise: React.FC<{ at: number; children: React.ReactNode; dy?: number }> = ({
  at, children, dy = 12,
}) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 16, EASE_OUT);
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * dy}px)` }}>{children}</div>
  );
};

export const EndScreen: React.FC<Props> = ({ portrait }) => {
  const W = portrait ? PORTRAIT.width : LANDSCAPE.width;
  const padX = portrait ? SAFE.marginX : SPACE.marginX;

  // Type and mark scale per canvas. The reel is read closer and smaller, so it
  // gets proportionally larger type than a straight scale would give.
  const markH = portrait ? 104 : 112;
  const rowFont = portrait ? 30 : 30;
  const iconSize = portrait ? 40 : 40;
  // The marks have different aspects (YouTube is 1.43:1, the website globe
  // 1.33:1, the rest square), so the icon column is sized to the widest of them
  // and each mark is centred within it. That is what keeps the values on a
  // single left axis.
  const iconCol = Math.round(iconSize * 1.55);
  const waFont = portrait ? 27 : 30;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLORS.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: portrait
          ? `${SAFE.contentTop}px ${padX}px ${PORTRAIT.height - SAFE.contentBottom}px`
          : `${SPACE.marginY}px ${padX}px`,
        gap: portrait ? 0 : 0,
      }}
    >
      {/* ── 1 + 2 · both marks, bare on the page, optically balanced ── */}
      <div
        style={{
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: portrait ? 34 : 56,
        }}
      >
        <BrandMark brand="shivansh" height={markH * OPTICAL_HEIGHT.shivansh} at={2} />
        <div
          style={
            portrait
              ? { width: 220, height: 1, background: COLORS.line }
              : { width: 1, height: markH * 0.72, background: COLORS.line }
          }
        />
        <BrandMark brand="tascam" height={markH * OPTICAL_HEIGHT.tascam} at={8} />
      </div>

      {/* ── 3 · the designation, in exactly this wording ── */}
      <div style={{ marginTop: portrait ? 40 : 34 }}>
        <Rise at={16}>
          <div style={{ ...micro(portrait ? 25 : 24, 700, "0.22em"), color: COLORS.accent }}>
            {BRAND.role}
          </div>
        </Rise>
      </div>

      <div
        style={{
          width: portrait ? 300 : 420,
          height: 1,
          background: COLORS.line,
          marginTop: portrait ? 36 : 30,
          marginBottom: portrait ? 36 : 30,
        }}
      />

      {/*
        ── 4 + 5 + 6 · the five contact rows ──

        One CSS grid, not five independently-centred flex rows. Centring each
        row on its own gives every icon a different x, because each value is a
        different width — the marks end up on a ragged diagonal instead of a
        column. A two-column grid with a fixed icon column puts every mark on
        one axis and every value on another, which is what makes the block read
        as a table of ways to get in touch rather than five loose lines.

        The WhatsApp row is the last row of the SAME grid, so its mark sits on
        the same axis as the other four, and its three numbers stay together on
        one line behind one icon exactly as specified.
      */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${iconCol}px 1fr`,
          columnGap: portrait ? 20 : 22,
          rowGap: portrait ? 22 : 18,
          alignItems: "center",
          justifyItems: "start",
          maxWidth: W - padX * 2,
        }}
      >
        {ROWS.map((r, i) => (
          <React.Fragment key={r.icon}>
            <Rise at={26 + i * 5} dy={9}>
              <div style={{ display: "flex", justifyContent: "center", width: iconCol }}>
                <ChannelIcon icon={r.icon} size={r.icon === "website" ? iconSize * 1.12 : iconSize} />
              </div>
            </Rise>
            <Rise at={26 + i * 5} dy={9}>
              <span style={{ ...spec(rowFont, 600, "0.03em"), color: COLORS.inkSoft }}>
                {sanitizeGlyphs(r.value)}
              </span>
            </Rise>
          </React.Fragment>
        ))}

        <Rise at={50} dy={9}>
          <div style={{ display: "flex", justifyContent: "center", width: iconCol }}>
            <ChannelIcon icon="whatsapp" size={iconSize} />
          </div>
        </Rise>
        <Rise at={50} dy={9}>
          <span
            style={{
              ...spec(waFont, 700, "0.02em"),
              color: COLORS.ink,
              whiteSpace: portrait ? "normal" : "nowrap",
              lineHeight: 1.34,
            }}
          >
            {WHATSAPP_LINE}
          </span>
        </Rise>
      </div>

      {/* ── 7 · a technical consultation, never a purchase close ── */}
      <div style={{ marginTop: portrait ? 42 : 34 }}>
        <Rise at={62} dy={8}>
          <div
            style={{
              ...subhead(portrait ? 28 : 27, 500),
              color: COLORS.slate,
              textAlign: "center",
            }}
          >
            {CTA}
          </div>
        </Rise>
      </div>
    </div>
  );
};

/** Re-exported so importers of the component see the contract it satisfies. */
export { END_SCREEN_REQUIRED };
