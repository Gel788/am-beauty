# Деплой AM Beauty на хостинг

Сайт — **Next.js 16**. Нужен хостинг с **Node.js 20+** (VPS, облако) или **Docker**. Обычный PHP-хостинг без Node **не подойдёт**.

## Быстрый старт (VPS + Docker) — рекомендуется

1. На сервере установи Docker и Docker Compose.
2. Клонируй репозиторий:
   ```bash
   git clone https://github.com/Gel788/am-beauty.git
   cd am-beauty
   ```
3. Создай `.env`:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://твой-домен.ru
   PORT=3000
   ```
4. Запусти:
   ```bash
   docker compose up -d --build
   ```
5. Настрой nginx (см. `deploy/nginx.conf.example`) и SSL через Certbot.

Сайт слушает порт **3000** внутри сервера; снаружи — 80/443 через nginx.

---

## VPS без Docker (PM2)

```bash
git clone https://github.com/Gel788/am-beauty.git
cd am-beauty
cp .env.example .env   # укажи NEXT_PUBLIC_SITE_URL
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

В `ecosystem.config.cjs` замени `your-domain.ru` на свой домен.

---

## Vercel (самый простой для Next.js)

1. Зайди на [vercel.com](https://vercel.com) → Import Git Repository → `Gel788/am-beauty`
2. Framework: **Next.js** (определится автоматически)
3. Environment variable: `NEXT_PUBLIC_SITE_URL` = `https://твой-домен.ru`
4. Deploy

Домен подключается в Vercel → Settings → Domains.

---

## Переменные окружения

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Да | Публичный URL сайта (для OG, canonical) |
| `PORT` | Нет | Порт (по умолчанию 3000) |
| `HOSTNAME` | Нет | `0.0.0.0` на сервере |

---

## Проверка после деплоя

- [ ] Главная, каталог, карточка товара открываются
- [ ] Картинки в `/public/images` грузятся
- [ ] Корзина и checkout работают (данные в localStorage/Zustand)
- [ ] HTTPS включён (Let's Encrypt)

---

## Что уже настроено в проекте

- `output: "standalone"` — лёгкий production-сервер
- Кэш статики и изображений
- Security headers
- `metadataBase` для SEO и превью в соцсетях
- Docker + docker-compose + пример nginx

Если напишешь **какой хостинг** (Timeweb, Beget, REG.RU, Vercel и т.д.) и **домен** — можно настроить под конкретную панель.
