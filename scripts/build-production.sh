#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ] && [ -z "${NEXT_PUBLIC_SITE_URL:-}" ]; then
  echo "Создай .env с NEXT_PUBLIC_SITE_URL=https://твой-домен.ru или экспортируй переменную."
  exit 1
fi

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

echo "→ npm ci"
npm ci

echo "→ npm run build"
npm run build

echo "→ Готово. Запуск:"
echo "  node .next/standalone/server.js"
echo "или:"
echo "  pm2 start ecosystem.config.cjs"
