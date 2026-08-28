#!/usr/bin/env bash
# Деплой на VPS (git pull + build + pm2 restart)
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/am-beauty}"

cd "$APP_DIR"
git pull origin main

mkdir -p public/uploads/images public/uploads/videos public/videos .data

merge_db() {
  local root_db=".data/admin-db.json"
  local legacy_db=".next/standalone/.data/admin-db.json"
  mkdir -p .data
  if [ -f "$legacy_db" ] && [ -f "$root_db" ]; then
    if [ "$legacy_db" -nt "$root_db" ]; then
      cp "$legacy_db" "$root_db"
    fi
  elif [ -f "$legacy_db" ]; then
    cp "$legacy_db" "$root_db"
  fi
  chmod 664 .data/admin-db.json 2>/dev/null || true
  chmod 775 .data 2>/dev/null || true
}

merge_db

npm ci
npm run build

# Видео не в git — убеждаемся что лежат в public/videos
if ls public/videos/*.{mp4,MP4,mov,MOV,webm,WEBM} 1>/dev/null 2>&1; then
  chmod 644 public/videos/* 2>/dev/null || true
fi

pm2 delete am-beauty 2>/dev/null || true
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://ambeauty-cosmetica.ru}" \
  pm2 start ecosystem.config.cjs --update-env
pm2 save

if [ -f deploy/nginx.am-beauty.conf ]; then
  cp deploy/nginx.am-beauty.conf /etc/nginx/sites-available/am-beauty
  ln -sf /etc/nginx/sites-available/am-beauty /etc/nginx/sites-enabled/am-beauty
  nginx -t && systemctl reload nginx
fi

echo "OK: deployed $(git rev-parse --short HEAD)"
