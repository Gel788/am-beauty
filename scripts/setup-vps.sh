#!/usr/bin/env bash
# Первичная настройка VPS для AM Beauty (Ubuntu)
set -euo pipefail

DOMAIN="${1:-ambeauty-cosmetica.ru}"
APP_DIR="/var/www/am-beauty"
REPO="https://github.com/Gel788/am-beauty.git"

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq git nginx curl ca-certificates

# Swap для сборки на 1GB RAM
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q swapfile /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Node.js 20
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi

npm install -g pm2

mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO" "$APP_DIR"
else
  cd "$APP_DIR" && git pull origin main
fi

cd "$APP_DIR"
export NEXT_PUBLIC_SITE_URL="https://${DOMAIN}"
npm ci
npm run build

# PM2
pm2 delete am-beauty 2>/dev/null || true
cd "$APP_DIR"
PORT=3000 HOSTNAME=127.0.0.1 NEXT_PUBLIC_SITE_URL="https://${DOMAIN}" \
  pm2 start .next/standalone/server.js --name am-beauty
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null | tail -1 | bash || true

# Nginx
cat > /etc/nginx/sites-available/am-beauty <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/am-beauty /etc/nginx/sites-enabled/am-beauty
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "OK: AM Beauty running on :3000, nginx :80 for ${DOMAIN}"
