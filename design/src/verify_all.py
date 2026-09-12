"""Verification pass over the delivered set.

Checks the three things that actually matter for this brief and can be measured
rather than asserted: exact pixel dimensions, that every distinct image in the
approved allocation appears somewhere, and that no product photograph was
recoloured on its way into a slide.
"""
import json, os, sys, re
SP = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SP)
import numpy as np
from PIL import Image
from spec import SPEC

SLIDES = os.path.join(SP, 'slides')
BUILD = os.path.join(SP, 'build')
fits = json.load(open(os.path.join(SP, 'fits.json')))
ids = json.load(open(SP + '/ids.json'))
ALL = set(ids.values())

print('=' * 74)
print('1. DIMENSIONS  (2160 x 3840 exact, not a minimum)')
bad = 0
for sl in sorted(SPEC):
    p = os.path.join(SLIDES, SPEC[sl]['name'] + '.png')
    if not os.path.exists(p):
        print(f'   {sl}  MISSING'); bad += 1; continue
    im = Image.open(p)
    ok = im.size == (2160, 3840)
    bad += (not ok)
    print(f'   {sl}  {im.size[0]} x {im.size[1]}  {"OK" if ok else "*** WRONG ***"}'
          f'   {os.path.getsize(p)/1e6:5.2f} MB   {SPEC[sl]["name"]}.png')
print(f'   -> {10-bad}/10 exact')

print()
print('=' * 74)
print('2. COVERAGE  (every distinct image placed, none twice)')
used = []
for sl, s in SPEC.items():
    used += [s['hero'], s['band']] + list(s['plates'])
    if 'found' in s:
        used.append(s['found'])
from collections import Counter
c = Counter(used)
dupes = [k for k, n in c.items() if n > 1]
missing = sorted(ALL - set(c) - {'FPGA-05'} - {
    'TASCAM BRAND LOGO.png', 'SHIVANSH ELECTRONICS BRAND LOGO.png'})
logos = {'TASCAM BRAND LOGO.png', 'SHIVANSH ELECTRONICS BRAND LOGO.png', 'DANTE LOGO.jpg',
         'FACEBOOK ICON.png', 'INSTAGRAM ICON.webp', 'YOUTUBE ICON.png',
         'WEBSITE ICON.png', 'WHATSAPP ICON.png'}
missing = [m for m in missing if m not in logos]
print(f'   placements   {len(used)}')
print(f'   distinct     {len(c)}')
print(f'   duplicates   {dupes or "none"}')
print(f'   unplaced     {missing or "none"}')
print(f'   held back    FPGA-05 (Dante DDM READY badge, ruling 01)')

print()
print('=' * 74)
print('3. COLOUR FIDELITY  (lower band vs the supplied frame it came from)')
print('   a filter, blend or desaturation anywhere in the chain would show here')
for sl in sorted(SPEC):
    p = os.path.join(SLIDES, SPEC[sl]['name'] + '.png')
    if not os.path.exists(p) or sl not in fits:
        continue
    slide = Image.open(p).convert('RGB')
    top, h = fits[sl]['band']
    rendered = slide.crop((0, top * 2, 2160, (top + h) * 2))
    srcimg = Image.open(os.path.join(BUILD, f'band_{sl}.png')).convert('RGB')
    # reproduce object-fit: cover
    sw, sh = srcimg.size
    scale = max(2160 / sw, (h * 2) / sh)
    rs = srcimg.resize((max(1, round(sw * scale)), max(1, round(sh * scale))), Image.LANCZOS)
    ox, oy = (rs.width - 2160) // 2, (rs.height - h * 2) // 2
    rs = rs.crop((ox, oy, ox + 2160, oy + h * 2))
    a = np.asarray(rendered).astype(np.float32)
    b = np.asarray(rs).astype(np.float32)
    dR, dG, dB = (a[..., i].mean() - b[..., i].mean() for i in range(3))
    satA = float((a.max(2) - a.min(2)).mean())
    satB = float((b.max(2) - b.min(2)).mean())
    flag = 'OK' if max(abs(dR), abs(dG), abs(dB)) < 4.0 and abs(satA - satB) < 4.0 else 'CHECK'
    print(f'   {sl}  mean RGB drift {dR:+6.2f} {dG:+6.2f} {dB:+6.2f}   '
          f'saturation {satA:6.2f} vs {satB:6.2f}   {flag}')

print()
print('=' * 74)
print('4. CONTENT RULES  (scan the generated markup)')
BANNED = {
    'email address': r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',
    'price figure': r'(?:₹|Rs\.?\s*\d|INR\s*\d|\$\s*\d|\bMRP\b|\bprice\b)',
    'social platform': r'\b(facebook|instagram|youtube|twitter|linkedin|tiktok|x\.com)\b',
    'dante logo file': r'DANTE LOGO',
    'css colour filter': r'(grayscale|sepia|saturate|hue-rotate)\s*\(',
}
pages = sorted(f for f in os.listdir(os.path.join(SP, 'pages')) if f.endswith('.html'))
hits = 0
for f in pages:
    txt = open(os.path.join(SP, 'pages', f)).read()
    for name, pat in BANNED.items():
        m = re.findall(pat, txt, re.I)
        if m:
            print(f'   {f}: {name} -> {set(m)}'); hits += 1
print(f'   -> {"no prohibited content found in any of the 10 pages" if not hits else str(hits)+" HITS"}')
print()
print('   permitted items present on every slide:')
txt = open(os.path.join(SP, 'pages', pages[0])).read()
for item in ['logo_tascam.png', 'logo_shivansh.png', 'www.shivanshelectronics.in',
             'icon_whatsapp.png', '98316 62458', '91477 00677', '89818 07755']:
    everywhere = all(item in open(os.path.join(SP, 'pages', f)).read() for f in pages)
    print(f'     {"yes" if everywhere else "NO "}  {item}')
