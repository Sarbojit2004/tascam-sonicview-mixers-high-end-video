#!/usr/bin/env python3
"""Package the renderable project as a standalone zip.

    python3 scripts/pack_project.py                 # all three long-form parts
    python3 scripts/pack_project.py --part 2        # just one

`public/img` and `public/audio` are ~110 MB of *derived* files, well past
GitHub's per-file limit, so the zip ships the recipes instead: every source
file plus the bootstrap scripts that regenerate the media byte-for-byte
(`rebuild_media.py` re-cuts the images and clip trims, the two `gen_audio*`
scripts re-synthesise all audio from seeded RNG).

Entries are written sorted, with a fixed timestamp and fixed compression, so
re-running this on unchanged sources produces a byte-identical archive — a zip
that churns on every run is worthless as a committed artifact.
"""

from __future__ import annotations

import argparse
import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "dist-zip"

# Fixed DOS timestamp (1980-01-01) so archive bytes depend only on content.
FIXED_DATE = (1980, 1, 1, 0, 0, 0)

INCLUDE_FILES = [
    "package.json",
    "tsconfig.json",
    "remotion.config.ts",
    "README.md",
]

INCLUDE_TREES = [
    "src",
    "scripts",
    "public/fonts",
    "public/logo",
]

# Derived, huge, or environment-specific — never packaged.
EXCLUDE_DIRS = {
    "node_modules",
    "__pycache__",
    ".git",
    "out",
    "dist-zip",
    "thumbnails",
    "public/img",
    "public/audio",
}

EXCLUDE_SUFFIXES = {".pyc", ".mp4", ".mp3", ".wav", ".jpg", ".jpeg"}
EXCLUDE_NAMES = {".DS_Store"}

# Files a standalone zip cannot render without. Missing any of these means the
# recipient gets an archive that fails at build time, so it is a hard error.
REQUIRED = [
    "src/index.ts",
    "src/Root.tsx",
    "src/lib/ledger.json",
    "src/lib/lf-theme.ts",
    "src/lib/lf-brand-plan.ts",
    "src/components/lf/LFShell.tsx",
    "src/LFThumbnails.tsx",
    "scripts/rebuild_media.py",
    "scripts/gen_audio.py",
    "scripts/gen_audio_longform.py",
    "scripts/verify_render.mjs",
]

PART_FILES = {
    1: ["src/LFPart1.tsx", "src/scenes/lf/part1.tsx"],
    2: ["src/LFPart2.tsx", "src/scenes/lf/part2.tsx"],
    3: ["src/LFPart3.tsx", "src/scenes/lf/part3.tsx"],
}

# Named per part to match the delivery convention. The three archives are
# byte-identical snapshots of the same source tree — the project builds all
# three compositions — each cut at the moment that part was rendered.
SLUG = {1: "part1", 2: "part2", 3: "part3"}


def excluded(rel: pathlib.PurePosixPath) -> bool:
    parts = rel.parts
    for i in range(1, len(parts) + 1):
        if "/".join(parts[:i]) in EXCLUDE_DIRS:
            return True
    if parts and parts[-1] in EXCLUDE_NAMES:
        return True
    return rel.suffix.lower() in EXCLUDE_SUFFIXES


def collect() -> list[pathlib.Path]:
    found: set[pathlib.Path] = set()
    for name in INCLUDE_FILES:
        p = ROOT / name
        if p.is_file():
            found.add(p)
    for tree in INCLUDE_TREES:
        base = ROOT / tree
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if p.is_file() and not excluded(pathlib.PurePosixPath(p.relative_to(ROOT).as_posix())):
                found.add(p)
    return sorted(found)


def pack(part: int, files: list[pathlib.Path]) -> pathlib.Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    target = OUT_DIR / f"sonicview-longform-{SLUG[part]}-project.zip"
    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in files:
            rel = p.relative_to(ROOT).as_posix()
            info = zipfile.ZipInfo(rel, date_time=FIXED_DATE)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, p.read_bytes())
    return target


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--part", type=int, choices=[1, 2, 3], action="append")
    args = ap.parse_args()
    parts = args.part or [1, 2, 3]

    files = collect()
    rels = {p.relative_to(ROOT).as_posix() for p in files}

    missing = [r for r in REQUIRED if r not in rels]
    for part in parts:
        missing += [r for r in PART_FILES[part] if r not in rels]
    if missing:
        print("REFUSING TO PACK — files the zip cannot build without are absent:")
        for m in sorted(set(missing)):
            print(f"  · {m}")
        return 1

    for part in parts:
        target = pack(part, files)
        size = target.stat().st_size
        print(f"  {target.relative_to(ROOT)}  —  {len(files)} files, {size / 1024:.0f} KB")
        if size > 90 * 1024 * 1024:
            print("  ✗ over GitHub's 100 MB file limit")
            return 1
    print(f"\n{len(files)} source files packaged. Media is rebuilt by `npm run bootstrap`.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
