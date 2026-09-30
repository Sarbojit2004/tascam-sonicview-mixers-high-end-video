import {staticFile} from 'remotion';
import manifest from '../assets.json';

type Info = {w: number; h: number; cut: boolean; cw?: number; ch?: number; white: number};
const M = manifest as unknown as Record<string, Info>;

const pad = (id: number) => `a${String(id).padStart(3, '0')}`;

/** Full-resolution (4096 px long side) ESRGAN rebuild — heroes, full-bleed. */
export const IMG = (id: number) => staticFile(`img/${pad(id)}.jpg`);
/** 1600 px long side — tiles, walls, marquees. */
export const IMG_M = (id: number) => staticFile(`img-m/${pad(id)}.jpg`);
/** Product keyed off its white sweep (WebP + alpha). */
export const CUT = (id: number) => staticFile(`cut/${pad(id)}.webp`);
export const CUT_M = (id: number) => staticFile(`cut-m/${pad(id)}.webp`);
/** Pre-blurred 640 px backdrop. */
export const BLUR = (id: number) => staticFile(`blur/${pad(id)}.jpg`);
/** White knock-out of a black-on-white mark (VIEW, HDIA). */
export const KO = (id: number) => staticFile(`ko/${pad(id)}.png`);

export const info = (id: number): Info => M[String(id)] ?? {w: 1600, h: 900, cut: false, white: 0};
export const aspect = (id: number) => info(id).w / info(id).h;
export const hasCut = (id: number) => Boolean(info(id).cut);
export const cutAspect = (id: number) => {
  const i = info(id);
  return i.cw && i.ch ? i.cw / i.ch : aspect(id);
};

export const LOGO = {
  tascam: staticFile('logo/tascam-white.png'),
  tascamBlack: staticFile('logo/tascam-black.png'),
  shivansh: staticFile('logo/shivansh-white.png'),
  shivanshBlack: staticFile('logo/shivansh-black.png'),
  dante: staticFile('logo/dante-white.png'),
};
/** Aspect ratios of the trimmed logo files (set by scripts/make_variants.py). */
export {default as LOGO_ASPECT} from '../logo-aspect.json';

export const ICON = {
  whatsapp: staticFile('icon/whatsapp.png'),
  instagram: staticFile('icon/instagram.png'),
  youtube: staticFile('icon/youtube.png'),
  facebook: staticFile('icon/facebook.png'),
  website: staticFile('icon/website.png'),
};

export const FX = {
  grain: staticFile('fx/grain.png'),
};
