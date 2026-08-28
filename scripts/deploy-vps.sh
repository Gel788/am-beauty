#!/usr/bin/env bash
# Деплой на VPS (git pull + build + pm2 restart)
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/am-beauty}"

cd "$APP_DIR"
git pull origin main
mkdir -p public/uploads/images public/uploads/videos public/videos

npm ci
npm run build

# Видео не в git — копируем из public/videos если есть (ручная загрузка на VPS)
if [ -d public/videos ] && ls public/videos/*.{mp4,MP4,mov,MOV,webm,WEBM} 1>/dev/null 2>&1; then
  mkdir -p .next/standalone/public/videos
  cp -n public/videos/*.{mp4,MP4,mov,MOV,webm,WEBM} .next/standalone/public/videos/ 2>/dev/null || true
fi

pm2 restart am-beauty --update-env
pm2 save

echo "OK: deployed $(git rev-parse --short HEAD)"
