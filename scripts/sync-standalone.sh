#!/usr/bin/env bash
# Синхронизация assets для Next.js standalone после build
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .next/standalone/server.js ]; then
  exit 0
fi

cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
echo "standalone assets synced"
