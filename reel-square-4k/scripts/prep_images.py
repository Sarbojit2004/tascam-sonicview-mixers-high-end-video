"""
Rebuild every repository image for a 3840 x 3840 canvas.

For each of the 129 distinct images in ../src/lib/ledger.json (plus the Dante
mark, the two brand logos and the five social icons):

  public/img/aNNN.jpg    Real-ESRGAN general-x4v3, 4x, then Lanczos down to a
                         4096 px long side. JPEG q93.
  public/cut/aNNN.webp   Product-on-white shots only: the white sweep keyed
                         out (border flood fill + edge un-mixing), so the
                         product floats on the dark stage. Lossy WebP + alpha.
  public/blur/aNNN.jpg   A 640 px, heavily blurred copy for backdrops. Blurring
                         in CSS at 4K is too slow in a headless renderer, so
                         every glow and backdrop is baked here instead.
  public/logo/*.png      TASCAM + Shivansh Electronics as true transparent
                         marks (white for the dark reel, black for light use).
  public/icon/*.png      Social icons with any white plate removed.

Usage:  python3 scripts/prep_images.py [--only 12,52,...] [--skip-sr]
The ESRGAN model is built by scripts/build_onnx.py from the official
realesr-general-x4v3.pth (github.com/xinntao/Real-ESRGAN, release v0.2.5.0).
"""
import json, os, sys, time
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
REPO = os.path.dirname(PROJ)
PUB = os.path.join(PROJ, 'public')
LEDGER = json.load(open(os.path.join(REPO, 'src/lib/ledger.json')))
LONG = 4096

sys.path.insert(0, HERE)
SKIP_SR = '--skip-sr' in sys.argv
ONLY = None
if '--only' in sys.argv:
    ONLY = {int(x) for x in sys.argv[sys.argv.index('--only') + 1].split(',')}

if not SKIP_SR:
    from sr import upscale


def sr4(rgb: np.ndarray) -> np.ndarray:
    if SKIP_SR:
        h, w, _ = rgb.shape
        return np.array(Image.fromarray(rgb).resize((w * 4, h * 4), Image.LANCZOS))
    return upscale(rgb)


def fit_long(im: Image.Image, long=LONG) -> Image.Image:
    w, h = im.size
    s = min(1.0, long / max(w, h))
    if s >= 1.0:
        return im
    return im.resize((round(w * s), round(h * s)), Image.LANCZOS)


# ---------------------------------------------------------------- cut-outs --
def white_border_fraction(rgb: np.ndarray) -> float:
    b = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3),
                        rgb[:, :4].reshape(-1, 3), rgb[:, -4:].reshape(-1, 3)])
    return float((b.min(1) > 238).mean())


def cutout(rgb: np.ndarray) -> np.ndarray | None:
    """Key a white sweep out of a product shot. Returns RGBA or None."""
    f = rgb.astype(np.float32) / 255.0
    w = f.min(2)                           # whiteness: min channel
    sat = f.max(2) - f.min(2)
    bgish = (w > 0.9) & (sat < 0.08)
    lab, n = ndimage.label(bgish)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    border = border[border > 0]
    bg = np.isin(lab, border)
    if bg.mean() < 0.12:
        return None
    # Soft band around the background edge: estimate coverage from whiteness.
    dist = ndimage.distance_transform_edt(~bg)
    band = (dist > 0) & (dist < 10)
    a = np.ones_like(w)
    a[bg] = 0.0
    a_band = np.clip((1.0 - w) / 0.78, 0.0, 1.0)
    a[band] = np.clip(a_band[band] * 1.15, 0, 1)
    # Inside the background, faint grey shadows keep a trace of density.
    shadow = bg & (w < 0.985)
    a[shadow] = np.clip((0.985 - w[shadow]) * 2.2, 0, 0.35)
    # Keep only the product: largest solid components (drops corner labels / badges).
    solid = a > 0.5
    lab2, n2 = ndimage.label(solid)
    if n2 == 0:
        return None
    sizes = ndimage.sum(solid, lab2, index=np.arange(1, n2 + 1))
    keep_ids = np.where(sizes >= sizes.max() * 0.14)[0] + 1
    keep = np.isin(lab2, keep_ids)
    keep = ndimage.binary_dilation(keep, iterations=14)
    a[~keep] = 0.0
    # Un-mix the white from edge colours so nothing fringes on a dark stage.
    am = np.maximum(a, 1e-3)[..., None]
    fg = np.clip((f - (1.0 - a[..., None])) / am, 0, 1)
    fg = np.where(a[..., None] > 0.98, f, fg)
    a = ndimage.gaussian_filter(a, 0.6)
    out = np.dstack([fg, a])
    return (out * 255 + 0.5).astype(np.uint8)


# ------------------------------------------------------------------ logos --
def knockout(rgb_on_white: np.ndarray, ink=(255, 255, 255)) -> np.ndarray:
    """Black/grey ink on a white plate -> transparent mark in `ink` colour."""
    f = rgb_on_white.astype(np.float32) / 255.0
    lum = 0.2126 * f[..., 0] + 0.7152 * f[..., 1] + 0.0722 * f[..., 2]
    a = np.clip((1.0 - lum) / 0.96, 0, 1)
    a[a < 0.025] = 0
    out = np.zeros((*a.shape, 4), np.float32)
    out[..., :3] = np.array(ink, np.float32) / 255.0
    out[..., 3] = a
    return (out * 255 + 0.5).astype(np.uint8)


def flatten_on_white(im: Image.Image) -> np.ndarray:
    im = im.convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    return np.array(bg.convert('RGB'))


def trim(rgba: np.ndarray, pad=8) -> np.ndarray:
    ys, xs = np.where(rgba[..., 3] > 10)
    y0, y1 = max(0, ys.min() - pad), min(rgba.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(rgba.shape[1], xs.max() + pad)
    return rgba[y0:y1, x0:x1]


def do_logos():
    att = os.environ.get('LOGO_DIR', '')
    tascam_src = os.path.join(att, '2.png') if att and os.path.exists(os.path.join(att, '2.png')) else os.path.join(REPO, 'TASCAM BRAND LOGO.png')
    shiv_src = os.path.join(att, '1.webp') if att and os.path.exists(os.path.join(att, '1.webp')) else os.path.join(REPO, 'SHIVANSH ELECTRONICS BRAND LOGO.png')
    for name, src in [('tascam', tascam_src), ('shivansh', shiv_src), ('dante', os.path.join(REPO, 'DANTE LOGO.jpg'))]:
        rgb = flatten_on_white(Image.open(src))
        if name == 'shivansh':
            # The plate is a white rounded pill: everything outside it is
            # transparent in the source and flattens to white as well.
            pass
        big = sr4(rgb)
        big = np.array(fit_long(Image.fromarray(big), 4000))
        for ink, suffix in [((255, 255, 255), 'white'), ((0, 0, 0), 'black')]:
            k = trim(knockout(big, ink))
            if name == 'dante' and suffix == 'white':
                # Dante's mark is red ink on white in the brand guide; the
                # source here is black, so the white knockout is correct.
                pass
            Image.fromarray(k).save(os.path.join(PUB, 'logo', f'{name}-{suffix}.png'), optimize=True)
        print('logo', name, big.shape, flush=True)


def do_icons():
    icons = {'facebook': 'FACEBOOK ICON.png', 'instagram': 'INSTAGRAM ICON.webp', 'website': 'WEBSITE ICON.png',
             'whatsapp': 'WHATSAPP ICON.png', 'youtube': 'YOUTUBE ICON.png'}
    for k, f in icons.items():
        im = Image.open(os.path.join(REPO, f)).convert('RGBA')
        a = np.array(im)
        if k == 'website':
            # Black ink on a *baked-in* grey/white checkerboard: key every light
            # neutral pixel reachable from the border, then knock the ink out
            # as a white mark so it reads on the dark outro.
            rgb = a[..., :3].astype(np.float32) / 255.0
            light = (rgb.min(2) > 0.68) & ((rgb.max(2) - rgb.min(2)) < 0.08)
            lab, _ = ndimage.label(light)
            border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
            bg = np.isin(lab, border[border > 0])
            flat = a[..., :3].copy()
            flat[bg] = 255
            ko = knockout(flat, (255, 255, 255))
            im = Image.fromarray(trim(ko, 6))
            im.thumbnail((512, 512), Image.LANCZOS)
            im.save(os.path.join(PUB, 'icon', f'{k}.png'), optimize=True)
            print('icon', k, im.size, flush=True)
            continue
        if (a[..., 3] > 250).mean() > 0.97:          # opaque plate -> key the white
            rgb = a[..., :3].astype(np.float32) / 255.0
            w = rgb.min(2)
            lab, _ = ndimage.label(w > 0.93)
            border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
            bg = np.isin(lab, border[border > 0])
            alpha = np.where(bg, 0, 255).astype(np.uint8)
            alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2)))
            a[..., 3] = alpha
        im = Image.fromarray(a)
        im.thumbnail((512, 512), Image.LANCZOS)
        im.save(os.path.join(PUB, 'icon', f'{k}.png'), optimize=True)
        print('icon', k, im.size, flush=True)


# ------------------------------------------------------------------- main --
def main():
    manifest = {}
    mpath = os.path.join(PROJ, 'src', 'assets.json')
    if os.path.exists(mpath):
        manifest = {int(k): v for k, v in json.load(open(mpath)).items()}
    if ONLY is None or 0 in ONLY:
        do_logos()
        do_icons()
    items = [e for e in LEDGER if e['kind'] == 'image']
    t0 = time.time()
    for i, e in enumerate(items):
        if ONLY is not None and e['id'] not in ONLY:
            continue
        slug = f"a{e['id']:03d}"
        src = Image.open(os.path.join(REPO, e['source']))
        if src.mode in ('RGBA', 'LA', 'P'):
            rgb = flatten_on_white(src)
        else:
            rgb = np.array(src.convert('RGB'))
        h0, w0 = rgb.shape[:2]
        big = Image.fromarray(sr4(rgb))
        big = fit_long(big)
        big.save(os.path.join(PUB, 'img', slug + '.jpg'), quality=93, subsampling=0, optimize=True)
        small = big.copy()
        small.thumbnail((640, 640), Image.LANCZOS)
        small.filter(ImageFilter.GaussianBlur(18)).save(os.path.join(PUB, 'blur', slug + '.jpg'), quality=88)
        info = {'w': big.size[0], 'h': big.size[1], 'src': [w0, h0], 'cut': False, 'white': white_border_fraction(rgb)}
        if info['white'] > 0.85:
            c = cutout(np.array(big))
            if c is not None:
                ct = trim(c, pad=4)
                Image.fromarray(ct).save(os.path.join(PUB, 'cut', slug + '.webp'), quality=90, method=5)
                info.update(cut=True, cw=int(ct.shape[1]), ch=int(ct.shape[0]))
        manifest[e['id']] = info
        json.dump({str(k): v for k, v in sorted(manifest.items())}, open(mpath, 'w'), indent=1)
        print(f"[{i + 1}/{len(items)}] #{e['id']} {w0}x{h0} -> {big.size} cut={info['cut']} {time.time() - t0:.0f}s", flush=True)
    print('done', flush=True)


if __name__ == '__main__':
    main()
