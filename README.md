# 🍯 Gravity - Monobank Jars Monitor

Монорепозиторий для мониторинга банок Monobank с фронтенд приложением на React и бэкенд на NestJS.

## Структура проекта

```
gravity/
├── packages/
│   ├── backend/              # NestJS приложение
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nodemon.json
│   │   └── .env
│   └── frontend/             # React приложение
│       ├── src/
│       ├── package.json
│       ├── vite.config.ts
│       └── ...
├── package.json              # Корневой package.json с workspaces
└── README.md
```

## Установка и запуск

### Установка зависимостей

```bash
npm install
```

Зависимости будут установлены для обоих пакетов благодаря npm workspaces.

### Разработка

Запустить оба проекта одновременно:

```bash
npm run dev
```

Это запустит:
- **Backend**: NestJS на `http://localhost:3000`
- **Frontend**: React + Vite на `http://localhost:5173`

### Сборка

Собрать оба проекта:

```bash
npm run build
```

Или отдельно:

```bash
# Только бэкенд
npm run build:backend

# Только фронтенд
npm run build:frontend
```

### Запуск в production

```bash
npm start
```

## Скрипты

```bash
npm run dev                 # Запустить оба проекта в режиме разработки
npm run build               # Собрать оба проекта
npm run build:backend       # Собрать только бэкенд
npm run build:frontend      # Собрать только фронтенд
npm start                   # Запустить бэкенд в production
npm run start:dev           # Запустить бэкенд в режиме разработки
npm run lint                # Проверить оба проекта
npm run test                # Тесты бэкенда
npm run test:watch          # Тесты бэкенда в режиме наблюдения
```

## Конфигурация

### Backend (.env)

Файл `.env` находится в `packages/backend/.env`

```env
DB_HOST=your_db_host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_db_name
```

### Frontend

Frontend автоматически проксирует запросы `/api/*` на `http://localhost:3000` во время разработки (см. `vite.config.ts`).

## API Endpoints

- `GET /health` — Проверка здоровья сервиса
- `GET /api/jars` — Получить список всех банок
- `POST /api/jars` — Добавить новую банку
- `DELETE /api/jars/:id` — Удалить банку
- `GET /monobank/jar` — Получить данные банки Monobank

## Лицензия

ISC
npm run start:prod
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── main.ts           # Application entry point
├── app.module.ts     # Main application module
├── app.controller.ts # Main controller
└── app.service.ts    # Main service
```

## Technology Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - JavaScript with static typing
- **Express** - HTTP server library (default transport)
