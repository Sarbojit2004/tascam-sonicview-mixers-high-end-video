import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts are vendored into public/fonts by scripts/fetch_fonts.py so an
// 1800-frame render never depends on a network fetch. Loaded via the FontFace
// API behind delayRender so no frame is ever painted with a fallback face —
// which matters more than usual here, because a missing Indic face renders as
// tofu boxes rather than as merely the wrong shape.

type Face = {family: string; file: string; weight: string};

const FACES: Face[] = [
  {family: 'PlayfairDisplay', file: 'fonts/playfair-700.woff2', weight: '700'},
  {family: 'PlayfairDisplay', file: 'fonts/playfair-900.woff2', weight: '900'},
  {family: 'Inter', file: 'fonts/inter-400.woff2', weight: '400'},
  {family: 'Inter', file: 'fonts/inter-600.woff2', weight: '600'},
  {family: 'JetBrainsMono', file: 'fonts/jbm-500.woff2', weight: '500'},
  {family: 'NotoDeva', file: 'fonts/noto-deva.woff2', weight: '600'},
  {family: 'NotoBeng', file: 'fonts/noto-beng.woff2', weight: '600'},
  {family: 'NotoTaml', file: 'fonts/noto-taml.woff2', weight: '600'},
  {family: 'NotoTelu', file: 'fonts/noto-telu.woff2', weight: '600'},
  {family: 'NotoKnda', file: 'fonts/noto-knda.woff2', weight: '600'},
  {family: 'NotoGujr', file: 'fonts/noto-gujr.woff2', weight: '600'},
  {family: 'NotoGuru', file: 'fonts/noto-guru.woff2', weight: '600'},
  {family: 'NotoMlym', file: 'fonts/noto-mlym.woff2', weight: '600'},
  {family: 'NotoOrya', file: 'fonts/noto-orya.woff2', weight: '600'},
  {family: 'NotoArab', file: 'fonts/noto-arab.woff2', weight: '600'},
];

let started = false;

/**
 * Waits only on the explicit FontFace loads. `document.fonts.ready` resolves
 * against every font the document might still be resolving and was observed to
 * hang a render worker under concurrency on the precedent project, so it is
 * deliberately not awaited here.
 */
export const loadFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('load-fonts', {
    timeoutInMilliseconds: 120000,
    retries: 2,
  });

  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
        weight: f.weight,
        style: 'normal',
        display: 'block',
      });
      document.fonts.add(await face.load());
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
