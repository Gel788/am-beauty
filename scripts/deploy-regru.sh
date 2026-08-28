#!/usr/bin/env bash
# Деплой статической сборки на REG.RU (shared hosting)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://ambeauty-cosmetica.ru}"
SSH_HOST="${REG_RU_SSH_HOST:-server268.hosting.reg.ru}"
SSH_USER="${REG_RU_SSH_USER:-u3625734}"
REMOTE_DIR="${REG_RU_REMOTE_DIR:-www/ambeauty-cosmetica.ru}"

if [ -z "${REG_RU_SSH_PASS:-}" ]; then
  echo "Укажи пароль: export REG_RU_SSH_PASS='...'"
  exit 1
fi

export SSHPASS="$REG_RU_SSH_PASS"

echo "→ Сборка статики для $SITE_URL"
NEXT_STATIC_EXPORT=true NEXT_PUBLIC_SITE_URL="$SITE_URL" npm run build

if [ ! -d out ]; then
  echo "Папка out/ не найдена после сборки"
  exit 1
fi

echo "→ Бэкап .htaccess на сервере"
sshpass -e ssh -o StrictHostKeyChecking=no "${SSH_USER}@${SSH_HOST}" \
  "cp -n ${REMOTE_DIR}/.htaccess ${REMOTE_DIR}/.htaccess.bak 2>/dev/null || true"

echo "→ Загрузка файлов на сервер"
sshpass -e rsync -avz --delete \
  --exclude '.htaccess' \
  --exclude '.htaccess.bak' \
  out/ "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

echo "→ Готово: $SITE_URL"
