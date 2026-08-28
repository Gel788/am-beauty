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
npm run build

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

if [ -f deploy/nginx.am-beauty.conf ]; then
  cp deploy/nginx.am-beauty.conf /etc/nginx/sites-available/am-beauty
  ln -sf /etc/nginx/sites-available/am-beauty /etc/nginx/sites-enabled/am-beauty
  nginx -t && systemctl reload nginx
fi

echo "OK: deployed $(git rev-parse --short HEAD)"
