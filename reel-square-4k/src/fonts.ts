import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FACES: [string, string, string][] = [
  ['Unbounded', 'fonts/unbounded-var.woff2', '200 900'],
  ['Poppins', 'fonts/poppins-300.woff2', '300'],
  ['Poppins', 'fonts/poppins-400.woff2', '400'],
  ['Poppins', 'fonts/poppins-500.woff2', '500'],
  ['Poppins', 'fonts/poppins-600.woff2', '600'],
  ['Poppins', 'fonts/poppins-700.woff2', '700'],
  ['JetBrains Mono', 'fonts/jbm-var.woff2', '100 800'],
];

let ready: Promise<void> | null = null;

/** Starts (once per page) and returns the font load. */
export const fontsReady = (): Promise<void> => {
  if (!ready) {
    ready = Promise.all(
      FACES.map(([family, file, weight]) => {
        const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight, style: 'normal'});
        return face.load().then((ff) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(ff));
      }),
    ).then(() => undefined);
  }
  return ready;
};

/**
 * Hold the frame until the vendored fonts are in. The delayRender handle is
 * created inside the component — not at bundle evaluation, where it would be
 * registered before Remotion sets up the page's render state, so its timeout
 * could never be cleared and would kill the tab ~90 s later.
 */
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts', {timeoutInMilliseconds: 60000}));
  useEffect(() => {
    fontsReady()
      .then(() => continueRender(handle))
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
};
