#!/usr/bin/env bash
# Синхронизация видео на VPS (файлы в .gitignore, git pull их не тянет)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${DEPLOY_HOST:-root@89.108.113.147}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/am-beauty}"
SSH_OPTS=(-o StrictHostKeyChecking=no)

if [ -n "${SSHPASS:-}" ]; then
  SSH_CMD=(sshpass -e ssh "${SSH_OPTS[@]}")
  RSYNC_CMD=(sshpass -e rsync -avz --progress)
else
  SSH_CMD=(ssh "${SSH_OPTS[@]}")
  RSYNC_CMD=(rsync -avz --progress)
fi

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
"${SSH_CMD[@]}" "$HOST" "mkdir -p $REMOTE_DIR/public/videos $REMOTE_DIR/.next/standalone/public/videos"
"${RSYNC_CMD[@]}" "${files[@]}" "$HOST:$REMOTE_DIR/public/videos/"
"${SSH_CMD[@]}" "$HOST" "chmod 644 $REMOTE_DIR/public/videos/* 2>/dev/null || true"
echo "OK: videos synced"
