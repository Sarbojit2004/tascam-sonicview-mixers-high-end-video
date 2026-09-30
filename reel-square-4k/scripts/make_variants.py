"""
Derived variants of the prep_images.py output, cheap enough to rerun any time.

  public/img-m/aNNN.jpg   1600 px long side (tiles, walls, marquees)
  public/cut-m/aNNN.webp  1400 px long side cut-outs
  public/ko/aNNN.png      white knock-outs of black-on-white marks (VIEW #88, HDIA #81)
  public/fx/grain.png     512 px monochrome film grain tile
  src/logo-aspect.json    width/height of each trimmed logo file
"""
import json, os
import numpy as np
from PIL import Image

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(PROJ, 'public')
for d in ('img-m', 'cut-m', 'ko', 'fx'):
    os.makedirs(os.path.join(PUB, d), exist_ok=True)


def newer(src, dst):
    return not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst)


n = 0
for f in sorted(os.listdir(os.path.join(PUB, 'img'))):
    s, d = os.path.join(PUB, 'img', f), os.path.join(PUB, 'img-m', f)
    if newer(s, d):
        im = Image.open(s)
        im.thumbnail((1600, 1600), Image.LANCZOS)
        im.save(d, quality=92, subsampling=0)
        n += 1
for f in sorted(os.listdir(os.path.join(PUB, 'cut'))):
    s, d = os.path.join(PUB, 'cut', f), os.path.join(PUB, 'cut-m', f)
    if newer(s, d):
        im = Image.open(s)
        im.thumbnail((1400, 1400), Image.LANCZOS)
        im.save(d, quality=90, method=5)
        n += 1

for i in (81, 88):
    s = os.path.join(PUB, 'img', f'a{i:03d}.jpg')
    d = os.path.join(PUB, 'ko', f'a{i:03d}.png')
    if os.path.exists(s) and newer(s, d):
        rgb = np.asarray(Image.open(s).convert('RGB')).astype(np.float32) / 255.0
        lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        a = np.clip((1.0 - lum) / 0.92, 0, 1)
        a[a < 0.04] = 0
        out = np.zeros((*a.shape, 4), np.uint8)
        out[..., :3] = 255
        out[..., 3] = (a * 255 + 0.5).astype(np.uint8)
        ys, xs = np.where(out[..., 3] > 10)
        out = out[max(0, ys.min() - 8):ys.max() + 8, max(0, xs.min() - 8):xs.max() + 8]
        Image.fromarray(out).save(d, optimize=True)
        n += 1

g = os.path.join(PUB, 'fx', 'grain.png')
if not os.path.exists(g):
    r = np.random.default_rng(7)
    v = np.clip(r.normal(128, 46, (512, 512)), 0, 255).astype(np.uint8)
    Image.fromarray(v, 'L').save(g, optimize=True)

asp = {}
for f in sorted(os.listdir(os.path.join(PUB, 'logo'))):
    im = Image.open(os.path.join(PUB, 'logo', f))
    asp[f[:-4]] = round(im.size[0] / im.size[1], 5)
for i in (81, 88):
    p = os.path.join(PUB, 'ko', f'a{i:03d}.png')
    if os.path.exists(p):
        im = Image.open(p)
        asp[f'ko{i}'] = round(im.size[0] / im.size[1], 5)
json.dump(asp, open(os.path.join(PROJ, 'src', 'logo-aspect.json'), 'w'), indent=1)
print('variants written:', n, 'logo aspects:', asp)
