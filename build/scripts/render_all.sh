#!/usr/bin/env bash
# Render all six, in order, stopping on the first failure.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out thumbnails
render() {
  local key=$1 comp=$2 crf=$3
  echo "=== $key ==="
  npx remotion render "$key/index.ts" "$comp" "out/sonicview-$key.mp4" \
    --codec=h264 --crf="$crf" --pixel-format=yuv420p 2>&1 | tail -2
  npx remotion still "$key/index.ts" "${comp}Thumb" \
    "thumbnails/thumbnail-sonicview-$key.png" --image-format=png 2>&1 | tail -1
}
render reel1 Reel1 17
render reel2 Reel2 17
render reel3 Reel3 17
render part1 Part1 18
render part2 Part2 18
render part3 Part3 18
echo "=== all six rendered ==="
