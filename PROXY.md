# Обход CORS для API

Запросы с `devdisk.alephtrade.com` на `api.alephtrade.com` блокируются CORS. Решение — прокси.

## Локальная разработка (`npm run dev`)

Vite уже настроен: запросы к `/api/*` проксируются на `https://api.alephtrade.com`. Ничего дополнительно делать не нужно.

## Продакшен (devdisk.alephtrade.com)

Сервер, который раздаёт фронтенд, должен проксировать `/api` на `api.alephtrade.com`.

### Пример для nginx

```nginx
location /api/ {
    proxy_pass https://api.alephtrade.com/;
    proxy_set_header Host api.alephtrade.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Альтернатива: CORS на API

Если бэкенд добавит заголовок `Access-Control-Allow-Origin: https://devdisk.alephtrade.com`, прокси не нужен. Тогда в `.env` укажите:

```
VITE_API_BASE=https://api.alephtrade.com
```
