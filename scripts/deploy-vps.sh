#!/usr/bin/env bash
# Деплой на VPS (git pull + build + pm2 restart)
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/am-beauty}"

cd "$APP_DIR"
git pull origin main
mkdir -p public/uploads/images public/uploads/videos

npm ci
npm run build

pm2 restart am-beauty --update-env
pm2 save

echo "OK: deployed $(git rev-parse --short HEAD)"
