# Sonicview series thumbnail — 16:9, 3840 × 2160

A landscape thumbnail for the long-form video covering every model in the
series, in the same design system as the square slides. Same tokens, same red
rule and diagonal, same programmatic halftone and grain, same branding rail,
same forward text layer at 36%.

## A third composition, not a stretched square

The canvas is 1.78× as wide as it is tall, which changes what the layout does:

- The display line gets a **1948pt measure** instead of 1096, so SONICVIEW sets
  at 430px rather than 280. That is the point of a thumbnail — it has to carry
  at a hundred pixels wide, so the word is the picture.
- The lower zone splits left-to-right rather than being squeezed: the family
  photograph takes the left and the model register takes the right. On a slide
  the register is an index; here it is the argument, because this is the
  thumbnail for a video that covers every model.
- **The caption sits under the register, not on the photograph.** On a square
  slide a card over the band is fine. Here the band is the only product shot and
  covering its middle throws the picture away — and the air under a single-row
  register was dead space anyway.

Two collisions the build guards against, both of which happened while making it:
a register that needs two rows runs 200px into the colophon, and a caption whose
title column wraps grows tall enough to cover the register. Both are asserted on
every render rather than eyeballed.

Verified — 3840 × 2160 exact; band colour drift **−0.35 / −0.35 / −0.34** of 255
against the supplied frame with the drawn overlays masked; **zero pixels altered
outside the product silhouette** by the forward text layer; no prohibited
content; all four permitted branding items present.

Rebuild with `python3 build_thumb.py` (needs the prepared `sv/build/` assets).
