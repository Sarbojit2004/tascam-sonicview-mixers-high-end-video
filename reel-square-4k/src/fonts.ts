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

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('fonts');
  Promise.all(
    FACES.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight, style: 'normal'});
      return face.load().then((ff) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(ff));
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
