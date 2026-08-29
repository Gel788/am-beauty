#!/usr/bin/env bash
# Деплой на VPS (git pull + build + pm2 restart)
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/am-beauty}"

cd "$APP_DIR"
git pull origin main

mkdir -p public/uploads/images public/uploads/videos public/videos .data
python3 scripts/merge-admin-db.py "$APP_DIR"
chmod 664 .data/admin-db.json 2>/dev/null || true
chmod 775 .data 2>/dev/null || true

npm ci

# Старые фото: ресайз + webp, обновление URL в БД (идемпотентно)
export ADMIN_DB_DIR="$APP_DIR/.data"
export MEDIA_DIR="$APP_DIR/public/uploads"
export APP_DIR="$APP_DIR"
node scripts/reprocess-upload-images.mjs || echo "WARN: reprocess-upload-images failed"

echo "→ clean build"
rm -rf .next
npm run build

if [ ! -f .next/BUILD_ID ]; then
  echo "ERROR: production build incomplete (missing .next/BUILD_ID)"
  exit 1
fi

# Видео не в git — убеждаемся что лежат в public/videos
if ls public/videos/*.{mp4,MP4,mov,MOV,webm,WEBM} 1>/dev/null 2>&1; then
  chmod 644 public/videos/* 2>/dev/null || true
fi

pm2 delete am-beauty 2>/dev/null || true
# Единая БД в корне проекта — не в standalone
export ADMIN_DB_DIR="$APP_DIR/.data"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://ambeauty-cosmetica.ru}" \
  pm2 start ecosystem.config.cjs --update-env
pm2 save

echo "→ verify static chunks"
CHUNK=$(curl -sf "http://127.0.0.1:3000/" | grep -oE "/_next/static/chunks/[^\"]+\.css" | head -1 | sed 's|/_next/static/||' || true)
if [ -n "$CHUNK" ] && [ ! -f ".next/static/$CHUNK" ]; then
  echo "WARN: HTML references missing chunk: $CHUNK"
fi

if [ -f deploy/nginx.am-beauty.conf ]; then
  cp deploy/nginx.am-beauty.conf /etc/nginx/sites-available/am-beauty
  ln -sf /etc/nginx/sites-available/am-beauty /etc/nginx/sites-enabled/am-beauty
  nginx -t && systemctl reload nginx
fi

echo "OK: deployed $(git rev-parse --short HEAD)"
