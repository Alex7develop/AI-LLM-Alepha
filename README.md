# Алеф Трейд — AI

Веб-приложение для общения с ИИ-ассистентом компании **Alephtrade**. Пользователь может вести несколько диалогов, отправлять текстовые сообщения, прикреплять изображения и использовать голосовой ввод. Ответы поступают в режиме реального времени через стриминг.

---

## Стек технологий

| Слой | Инструменты |
|------|-------------|
| Фреймворк | React 19 + TypeScript |
| Сборка | Vite 7 |
| Стили | styled-components |
| Markdown | react-markdown + remark-gfm |
| Иконки | react-icons |
| Авторизация | OAuth (oauth.alephtrade.com) → Bearer-токен |

---

## Функциональность

- **Список диалогов** — боковая панель с историей чатов, поддержка создания новых.
- **Стриминг ответов** — ответ ИИ отображается по мере получения чанков.
- **Вложения** — отправка изображений вместе с сообщением.
- **Голосовой ввод** — запись аудио через браузерный MediaRecorder и отправка на API.
- **Авторизация** — токен извлекается из cookie, `localStorage` или параметра `?token=` после OAuth-редиректа.
- **Адаптивный UI** — поддержка мобильных устройств (iOS safe-area, dvh, брейкпоинт 768 px).

---

## Быстрый старт

```bash
# 1. Перейти в папку фронтенда
cd frontend

# 2. Установить зависимости
npm install

# 3. Запустить сервер разработки (http://localhost:5173)
npm run dev
```

### Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Дев-сервер с HMR на `localhost:5173` |
| `npm run build` | Проверка типов + production-сборка в `dist/` |
| `npm run preview` | Локальный предпросмотр собранного `dist/` |
| `npm run lint` | ESLint по всему проекту |

---

## Переменные окружения

Создайте файл **`frontend/.env`** на основе `.env.example`:

```env
VITE_API_BASE=https://api.alephtrade.com
```

> По умолчанию Vite dev-сервер проксирует запросы `/api/*` → `https://api.alephtrade.com` (см. `vite.config.ts`). При необходимости укажите другой адрес API в `VITE_API_BASE`.

---

## Структура проекта

```
frontend/
├── public/               # Статические ресурсы (иконки, логотип)
├── src/
│   ├── api/
│   │   └── client.ts     # HTTP-клиент, все запросы к API
│   ├── hooks/
│   │   ├── useChats.ts          # Загрузка списка чатов
│   │   └── useVoiceRecording.ts # Запись аудио
│   ├── utils/
│   │   ├── authToken.ts         # Работа с токеном
│   │   ├── chatUserId.ts        # Локальный userId
│   │   ├── currentChatStorage.ts
│   │   └── markdownLinks.ts     # Обработка ссылок в markdown
│   ├── App.tsx           # Корень: провайдеры
│   ├── Layout.tsx        # Каркас страницы
│   ├── LayoutContext.tsx # Состояние сайдбара
│   ├── Sidebar.tsx       # Панель диалогов
│   ├── ChatUI.tsx        # Основной интерфейс чата
│   ├── AuthContext.tsx   # Авторизация
│   ├── ChatContext.tsx   # Текущий диалог
│   ├── AuthIcon.tsx      # Иконка профиля / дропдаун
│   ├── AttachFileButton.tsx
│   └── VoiceButton.tsx
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## API

Все запросы идут на `https://api.alephtrade.com`.

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/ai/validate_token` | Проверка токена и данные пользователя |
| `GET` | `/ai/chats/{userId}` | Список чатов пользователя |
| `GET` | `/ai/chat/{dialogId}/history` | История сообщений диалога |
| `POST` | `/ai/chat` | Создание нового чата |
| `POST` | `/stream/ai/chat/{chatId}/message` | Отправка сообщения (стриминг) |
| `POST` | `/stream/ai/chat/{chatId}/audio-stream` | Голосовое сообщение |

Заголовок авторизации: `Authorization: Bearer <token>`.

---

## Авторизация

При открытии страницы приложение ищет токен в следующем порядке:

1. URL-параметр `?token=` (после редиректа с OAuth)
2. Cookie `token`
3. `localStorage` ключ `token`

Если токен не найден — пользователю предлагается войти через **oauth.alephtrade.com**.
