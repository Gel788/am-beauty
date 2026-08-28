#!/usr/bin/env bash
# Синхронизация видео на VPS (файлы в .gitignore, git pull их не тянет)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${DEPLOY_HOST:-root@89.108.113.147}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/am-beauty}"

if [ ! -d "$ROOT/public/videos" ]; then
  echo "Нет папки public/videos"
  exit 1
fi

shopt -s nullglob
files=("$ROOT/public/videos"/*.{mp4,MP4,mov,MOV,webm,WEBM})
if [ ${#files[@]} -eq 0 ]; then
  echo "Нет видеофайлов в public/videos"
  exit 1
fi

echo "→ $HOST:$REMOTE_DIR/public/videos/"
ssh "$HOST" "mkdir -p $REMOTE_DIR/public/videos $REMOTE_DIR/.next/standalone/public/videos"
rsync -avz --progress "${files[@]}" "$HOST:$REMOTE_DIR/public/videos/"
ssh "$HOST" "cp -n $REMOTE_DIR/public/videos/* $REMOTE_DIR/.next/standalone/public/videos/ 2>/dev/null || true"
echo "OK: videos synced"
