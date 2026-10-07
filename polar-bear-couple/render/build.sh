#!/usr/bin/env bash
# Renders skits end to end: frames -> video, cues -> audio, then muxes into videos/<skit>.mp4
# Usage: render/build.sh [skit ...]   (no args = every skit except the test sheet)
#        AUDIO_ONLY=1 render/build.sh  re-does only the soundtrack, reusing build/<skit>.video.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
skits=("$@")
if [ ${#skits[@]} -eq 0 ]; then
  for f in render/skits/[0-9]*.js; do skits+=("$(basename "$f" .js)"); done
fi
mkdir -p build videos
for s in "${skits[@]}"; do
  if [ "${AUDIO_ONLY:-0}" = "1" ] && [ -f "build/$s.video.mp4" ]; then
    node render/render.js "$s" --cues
  else
    node render/render.js "$s"
  fi
  python3 render/audio.py "$s"
  ffmpeg -y -loglevel error -i "build/$s.video.mp4" -i "build/$s.wav" \
    -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "videos/$s.mp4"
  echo "done: videos/$s.mp4"
done
