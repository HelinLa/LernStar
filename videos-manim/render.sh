#!/usr/bin/env bash
# LernStar · Manim-Render-Helfer (Terminal, wie Remotion/Motion Canvas).
#
#   ./render.sh scenes/parabel.py Parabel                 # -> media/.../Parabel.mp4
#   ./render.sh scenes/parabel.py Parabel parabel-demo    # + cp nach ../videos/parabel-demo.mp4
#
# Manim-Binary aus der conda-Umgebung (per MANIM_BIN überschreibbar).
set -euo pipefail
cd "$(dirname "$0")"

MANIM_BIN="${MANIM_BIN:-$HOME/miniforge3/envs/manim/bin/manim}"
SCENE_FILE="${1:?Szenendatei fehlt, z.B. scenes/parabel.py}"
SCENE_CLASS="${2:?Szenenklasse fehlt, z.B. Parabel}"
TARGET="${3:-}"

if [ ! -x "$MANIM_BIN" ]; then
  echo "✖ manim nicht gefunden: $MANIM_BIN  (MANIM_BIN=... setzen)" >&2
  exit 1
fi

PYTHONPATH=. "$MANIM_BIN" "$SCENE_FILE" "$SCENE_CLASS"

OUT="$(find media -name "${SCENE_CLASS}.mp4" -print -quit)"
echo "MP4: $OUT"
"$HOME/miniforge3/envs/manim/bin/ffprobe" -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate -of default=noprint_wrappers=1 "$OUT" || true

if [ -n "$TARGET" ]; then
  cp "$OUT" "../videos/${TARGET}.mp4"
  echo "-> kopiert nach ../videos/${TARGET}.mp4"
fi
