#!/bin/sh
# Render one version at 3840 x 3840 and package the deliverables.
#   sh scripts/render.sh ReelThunderstruck sonicview-square-4k-thunderstruck thunderstruck
#
# 1. Remotion renders the picture at --scale=2 (1920 design space -> 3840 px)
#    to a near-lossless CRF 12 master in build/ (not committed).
# 2. ffmpeg muxes the exact music edit (public/audio/<v>.wav) and encodes:
#      out/<name>.mp4        3840 x 3840, H.264 High, 2-pass ~11.5 Mb/s, AAC 320k
#                            (kept under GitHub's 100 MB file limit)
#      out/<name>-1080.mp4   1080 x 1080 upload copy, CRF 16
set -e
ID=$1
NAME=$2
V=$3
CONC=${CONC:-3}
mkdir -p build out
if [ ! -f "build/$NAME-master.mp4" ] || [ -n "$FORCE" ]; then
  npx remotion render src/index.ts "$ID" "build/$NAME-master.mp4" \
    --scale=2 --codec=h264 --crf=12 --pixel-format=yuv420p --muted \
    --concurrency="$CONC" $EXTRA
fi
AUDIO=public/audio/$V.wav
cd build
ffmpeg -y -v error -i "$NAME-master.mp4" -c:v libx264 -preset slow -b:v 11500k -maxrate 20M -bufsize 30M \
  -profile:v high -pix_fmt yuv420p -x264-params "aq-mode=3" -pass 1 -passlogfile "$NAME" -an -f mp4 /dev/null
cd ..
ffmpeg -y -v error -i "build/$NAME-master.mp4" -i "$AUDIO" -map 0:v:0 -map 1:a:0 \
  -c:v libx264 -preset slow -b:v 11500k -maxrate 20M -bufsize 30M -profile:v high -pix_fmt yuv420p \
  -x264-params "aq-mode=3" -pass 2 -passlogfile "build/$NAME" \
  -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart \
  -metadata title="TASCAM Sonicview — Shivansh Electronics" "out/$NAME.mp4"
ffmpeg -y -v error -i "build/$NAME-master.mp4" -i "$AUDIO" -map 0:v:0 -map 1:a:0 \
  -vf "scale=1080:1080:flags=lanczos" -c:v libx264 -preset slow -crf 16 -maxrate 14M -bufsize 20M \
  -profile:v high -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart \
  -metadata title="TASCAM Sonicview — Shivansh Electronics" "out/$NAME-1080.mp4"
ls -la "out/$NAME.mp4" "out/$NAME-1080.mp4"
