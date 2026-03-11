# Mini-Backend “TaskHub”

Це практична робота з реалізації REST API для управління завданнями з використанням технологічного стеку Node.js, Express, Sequelize (MySQL), Zod та Jest.

## Технологічний стек
- **Node.js** та **Express** — сервер та маршрутизація.
- **MySQL** та **Sequelize (ORM)** — збереження даних та реляції.
- **Zod** — надійна валідація даних запитів (body, query, params).
- **Multer** — завантаження файлів (до 3 шт. на завдання, не більше 5MB кожний).
- **Jest** та **Supertest** — модульне тестування бізнес-логіки (Task Service) з використанням in-memory SQLite бази даних.

## Структура бази даних
- **users** (id, name, email)
- **tasks** (id, title, description, status, priority, userId, createdAt)
- **attachments** (id, taskId, filename, path, mimetype, size)

Зв'язки:
- Користувач `1 — N` Завдання
- Завдання `1 — N` Прикріплені файли

## Встановлення та запуск

1. **Клонування репозиторію:**
   ```bash
   git clone https://github.com/p24user23-dot/internet-prs-pr11-15.git
   cd internet-prs-pr11-15
   ```

2. **Встановлення залежностей:**
   ```bash
   npm install
   ```

3. **Налаштування бази даних:**
   Переконайтесь, що у вас працює локальний MySQL сервер (без пароля для root, якщо ви не змінювали `.env`).

   Запустіть скрипт для автоматичного створення БД:
   ```bash
   node create-db.js
   ```

4. **Запуск сервера (режим розробки):**
   ```bash
   npm run dev
   ```
   *Сервер буде працювати на порту 3000.*

## API Endpoints

### 1. Автентифікація та Користувачі
- `POST /auth/register` (або `POST /users`) — реєстрація користувача (тіло: `name`, `email`).

### 2. Завдання (Tasks)
- `POST /tasks` — створення завдання (тіло: `title`, `description`, `userId`, `priority`, `status`).
- `GET /tasks` — отримання списку завдань.
  - Підтримує **пагінацію**: `page`, `limit`
  - Підтримує **фільтрацію**: `status` (open|done), `priority` (1-5), `search` (пошук по тексту)
  - Підтримує **сортування**: `sort` (createdAt|priority), `order` (asc|desc)
- `GET /tasks/:id` — отримання задачі за ID (разом з прикріпленими файлами).
- `PATCH /tasks/:id` — оновлення задачі.
- `DELETE /tasks/:id` — видалення задачі.

### 3. Файли (Attachments)
- `POST /tasks/:id/attachments` — завантаження від 1 до 3 файлів. Дані передаються як `multipart/form-data` (ключ: `files`).
- `GET /tasks/:id/attachments` — отримання списку файлів, прикріплених до завдання.

## Тестування
Проект покритий повністю автономними Unit-тестами для перевірки створення задачі, оновлення статусу та правильної роботи фільтрів/пагінації.
Запуск тестів (використовує SQLite In-Memory, не потребує піднятої MySQL):
```bash
npm run test
```
