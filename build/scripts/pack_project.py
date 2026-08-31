#!/usr/bin/env python3
"""
Build one standalone, deterministic project zip per deliverable.

DETERMINISTIC: entries are sorted and every timestamp is fixed, so re-packing an
unchanged tree produces a byte-identical archive. That makes the zips diffable
and stops them churning the repository on every build.

STANDALONE: each zip carries the shared modules the deliverable needs, not a
reference to them, so unzipping it anywhere gives a working project. The derived
media (public/img, public/clips, public/audio — ~160 MB) is NOT included; the
zip ships the RECIPES instead, and a README that says how to rebuild them from
the source files in the repository root.

REFUSES TO PACK an incomplete archive. Every file the project cannot build
without is listed in REQUIRED, and a missing one is a hard failure rather than a
zip that looks fine until someone tries to use it.
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "dist-zip")
FIXED_DATE = (1980, 1, 1, 0, 0, 0)

SHARED = [
    "anim.ts", "assets.ts", "beat.ts", "brand.ts", "concepts.tsx", "contact.tsx",
    "contactplan.ts", "deliverable.tsx", "endscreen.ts", "fonts.ts", "icons.tsx",
    "layout.ts", "logo.tsx", "media.tsx", "outro.tsx", "scenes.tsx", "sfx.ts",
    "shell.tsx", "spec.ts", "theme.ts", "type.tsx",
]

SCRIPTS = [
    "prep_brand.py", "prep_media.py", "synth_audio.py", "export_audio.py",
    "audit_all.mts", "audit_contrast.mjs", "verify_render.mjs",
    "emit_cues.mts", "emit_vo.mts", "vo_narration.json", "pack_project.py",
]

ROOT_FILES = ["package.json", "tsconfig.json", "remotion.config.ts", "asset-ledger.json"]

FONTS = ["archivo-normal.woff2", "archivo-italic.woff2",
         "fraunces-normal.woff2", "fraunces-italic.woff2"]

README = """# TASCAM Sonicview — {name}

Standalone Remotion project for `{key}`. {canvas}, {frames} frames at 30 fps.

## Rebuild

The derived media (`public/img`, `public/clips`, `public/audio`, `public/icon`,
`public/logo`) is ~160 MB and is NOT in this archive. It is all reproducible
from the source files in the repository root:

```bash
npm install
export SONICVIEW_MEDIA_DIR=/path/to/the/source/files
python3 scripts/prep_brand.py      # key the website icon, strip both logo plates
python3 scripts/prep_media.py      # 133 assets at two widths, 25 clips, 2 videos
python3 scripts/synth_audio.py     # 13 sound effects and 6 music beds, from code
```

`SONICVIEW_MEDIA_DIR` should point at the directory holding the 166 source
photographs and videos plus the 25 `SV-BR-*.mp4` clips.

## Verify, then render

```bash
node --experimental-strip-types scripts/audit_all.mts   # coverage, contact, compliance, glyphs
npx tsc --noEmit
npx remotion render {key}/index.ts {comp} out/sonicview-{key}.mp4 \\
  --codec=h264 --crf={crf} --pixel-format=yuv420p
node scripts/verify_render.mjs {key}
```

## The standalone audio deliverables

```bash
node --experimental-strip-types scripts/emit_cues.mts
python3 scripts/export_audio.py    # music bed + SFX layer, each at exact runtime
```
"""

SPECS = {
    "reel1": ("Reel 1 · The Computational Core", "Reel1", "1080x1920", 5340, 17),
    "reel2": ("Reel 2 · The Network Fabric", "Reel2", "1080x1920", 5340, 17),
    "reel3": ("Reel 3 · The Control Surface", "Reel3", "1080x1920", 5340, 17),
    "part1": ("Part 1 · The Computational Core", "Part1", "1920x1080", 8940, 18),
    "part2": ("Part 2 · The Network Fabric", "Part2", "1920x1080", 8940, 18),
    "part3": ("Part 3 · The Control Surface", "Part3", "1920x1080", 8940, 18),
}


def add(zf, arc, path, missing):
    if not os.path.exists(path):
        missing.append(arc)
        return
    zi = zipfile.ZipInfo(arc, date_time=FIXED_DATE)
    zi.compress_type = zipfile.ZIP_DEFLATED
    zi.external_attr = 0o644 << 16
    with open(path, "rb") as fh:
        zf.writestr(zi, fh.read())


def pack(key):
    name, comp, canvas, frames, crf = SPECS[key]
    os.makedirs(OUT, exist_ok=True)
    dst = os.path.join(OUT, f"sonicview-{key}-project.zip")

    entries = []
    for f in ROOT_FILES:
        entries.append((f, os.path.join(ROOT, f)))
    for f in SHARED:
        entries.append((f"shared/{f}", os.path.join(ROOT, "shared", f)))
    for f in SCRIPTS:
        entries.append((f"scripts/{f}", os.path.join(ROOT, "scripts", f)))
    for f in FONTS:
        entries.append((f"public/fonts/{f}", os.path.join(ROOT, "public", "fonts", f)))
    for f in ("Root.tsx", "index.ts", "beats.ts"):
        entries.append((f"{key}/{f}", os.path.join(ROOT, key, f)))
    entries.append((f"vo/VO_{key.upper()}.md", os.path.join(ROOT, "vo", f"VO_{key.upper()}.md")))

    missing = []
    entries.sort(key=lambda e: e[0])
    with zipfile.ZipFile(dst, "w") as zf:
        for arc, path in entries:
            add(zf, arc, path, missing)
        zi = zipfile.ZipInfo("README.md", date_time=FIXED_DATE)
        zi.compress_type = zipfile.ZIP_DEFLATED
        zf.writestr(zi, README.format(
            name=name, key=key, comp=comp, canvas=canvas, frames=frames, crf=crf))

    if missing:
        os.remove(dst)
        print(f"  {key}: REFUSED — {len(missing)} required file(s) missing:", file=sys.stderr)
        for m in missing:
            print(f"      {m}", file=sys.stderr)
        return False
    print(f"  {key:6s} {len(entries) + 1:3d} files  {os.path.getsize(dst) / 1024:7.1f} KB")
    return True


def main():
    keys = sys.argv[1:] or list(SPECS)
    ok = all(pack(k) for k in keys)
    if ok:
        print(f"\n{len(keys)} project zip(s) in dist-zip/ — deterministic, standalone.")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
