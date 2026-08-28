#!/usr/bin/env bash
# Legacy: standalone не используется (Next 16 + Turbopack). Оставлен для совместимости postbuild.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p public/uploads/images public/uploads/videos public/videos

if [ -f .next/standalone/server.js ]; then
  cp -r public .next/standalone/
  mkdir -p .next/standalone/.next
  cp -r .next/static .next/standalone/.next/static
  UPLOADS_SRC="$(pwd)/public/uploads"
  UPLOADS_DST="$(pwd)/.next/standalone/public/uploads"
  rm -rf "$UPLOADS_DST"
  ln -sfn "$UPLOADS_SRC" "$UPLOADS_DST"
  echo "standalone assets synced"
else
  echo "standalone skipped (using next start)"
fi
