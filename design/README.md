# Sonicview series — social slides

Ten editorial slides built from the frames in this repository, in two deliveries.

| Folder | Size | Use |
|---|---|---|
| `square-2160x2160/` | 2160 × 2160 | Instagram feed (current delivery) |
| `vertical-2160x3840/` | 2160 × 3840 | 9:16 / stories (earlier delivery) |

`_contact-sheet.png` in each folder shows all ten together.

## The two formats are different compositions, not one scaled

The square canvas loses 44% of its height and **none** of its width. Scaling the
9:16 layout down therefore fails in a way that is easy to miss until measured:
at 244px, `SONIC` spans 529 of the 1092pt measure and `BACK` spans 470, so the
display lines float at half width with a hole beside them, where the same words
at 395px in the 9:16 set run edge to edge. Two full-measure lines cannot be had
in a square — `SONIC` alone wants ~500px, so the stack would eat the canvas.

So the square sets **one** display line to the full measure. The word is not
split across a line break; it is set whole at whatever size fills 1096 — 239px
for CONNECTORS, 300px for BACKBONE. The ten share one measure and vary in scale.
The ~170px that buys back goes to a wide photograph slot (672 × 340, ratio 1.98,
so a desk is not cropped through both ends), a caption turned on its side into a
figure caption beneath the photograph, and a register tall enough for twenty
plates.

## The forward text layer

Where the photograph covers the display line, the buried part of the type is
brought forward over it at 36% rather than being lost. This is per-pixel, not
per-letter: a glyph half behind the chassis keeps its exposed half at full
strength and only its buried half comes forward, and the transition happens
exactly on the product's outline.

It works by drawing the headline twice. The base layer stays behind the
photograph at full opacity — that is what renders every uncovered part
unchanged. A second copy sits above the photograph, masked by the hero's own
alpha, at 36%. Where the product does not cover the line the mask is empty, so
nothing paints there and the base layer shows through untouched.

36% was chosen by rendering 0.28 / 0.36 / 0.44 / 0.52 and comparing: above it
the chassis washes red and the connector legends go; below it the type is a
ghost.

Two things worth knowing if you touch this:

- A CSS `mask-image` is fetched as a **cross-origin** resource and Chromium
  blocks `file://` for those, even though an `<img>` from the same path loads
  fine. Without `--allow-file-access-from-files` on the browser launch the mask
  silently resolves to nothing and the layer never paints, with no error.
- The overlay tints the product inside the letterforms by design, so the colour
  check would report it as a failure. The renderer therefore also writes a
  `control/` frame per slide with the layer hidden, and the colour check
  measures that — leaving the photograph pipeline honestly verified while the
  overlay is audited separately for containment.

## Rules the build holds to

- Every product photograph and both logos appear in their **original colour**,
  unmodified. Nothing is desaturated, filtered or AI-regenerated. Source frames
  carrying an ICC profile are converted to sRGB so PIL and Chromium agree on the
  numbers — that is the correct rendition of the photograph, not a recolour.
- All textures (halftone, paper grain) are generated programmatically.
- Only four informational items appear: the TASCAM logo, the Shivansh
  Electronics logo, the website, and the WhatsApp icon with the three numbers.
- No social handles, email, pricing, unverified specification claims, the Dante
  certification mark, or a call-to-action sentence.

`verify_sq.py` measures these rather than asserting them: exact dimensions,
image coverage, per-channel colour drift of each photograph against its source,
and a regex scan of the generated markup. Latest run — 10/10 exact at
2160 × 2160; 129 placements, 129 distinct, none unplaced; worst per-channel
drift **0.52 of 255**, identical across R, G and B (resampling, not a colour
change); no prohibited content; and **zero pixels altered outside any product
silhouette** by the forward text layer. The 344 and 49 boundary pixels on slides
07 and 08 all fall within one pixel of the outline — the mattes carry a 0.7px
feather and Chromium's mask resampling does not land identically on PIL's
reconstruction of it — so the check allows exactly one pixel of edge tolerance
and counts anything further out as a genuine leak.

Note the colour check must mask the paper caption chip and red geometry that sit
deliberately *on* the band. At 672px wide the chip alone is 2.5% of the band's
area and lifts its mean by ~4.6 per channel; in the 9:16 set the band was 2160px
wide and the same elements vanished in the average.

## Rebuilding

`src/` holds the generator. Everything renders through headless Chromium at
`device_scale_factor=2` from a 1080 CSS px viewport, so the output is exactly
2160 px with no upscaling. No third-party design tool is involved.

```
python3 prep_all.py                 # mattes, trims and textures -> build/
python3 build_all.py                # the 9:16 set
SERIES=sv python3 build_sq.py       # the square set
SERIES=sv python3 verify_sq.py      # the measurement pass
```

`build_sq.py` and `verify_sq.py` are shared with the Model series and select
between them with `SERIES=sv|ms`, so a fix lands on both rather than drifting
between two copies.

`prep_all.py` expects this repository's frames at the path in its `ROOT`
constant, and the scripts resolve fonts and prepared assets relative to their
own working layout (`../../sv/build/`, `../../sv/fonts/`) — adjust those two
paths for wherever you run them from.
