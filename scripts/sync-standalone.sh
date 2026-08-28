#!/usr/bin/env bash
# Синхронизация assets для Next.js standalone после build
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .next/standalone/server.js ]; then
  exit 0
fi

cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static

# Персистентные загрузки — симлинк, чтобы не терялись при rebuild
mkdir -p public/uploads/images public/uploads/videos
UPLOADS_SRC="$(pwd)/public/uploads"
UPLOADS_DST="$(pwd)/.next/standalone/public/uploads"
rm -rf "$UPLOADS_DST"
ln -sfn "$UPLOADS_SRC" "$UPLOADS_DST"
echo "standalone assets synced"
