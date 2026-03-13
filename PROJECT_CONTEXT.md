# Project Context

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Production сборка
npm run build
```

## Текущая версия
- **Next.js:** 16.1.6
- **React:** 19.2.3
- **TypeScript:** 5.x
- **Tailwind CSS:** 4.x

## Структура модулей

```
modules/
├── finance/      # ✅ Готов
├── habits/       # ✅ Готов
├── nutrition/    # ✅ Готов
├── workouts/     # ✅ Готов
├── health/       # ✅ Готов
├── goals/        # ✅ Готов
├── mind/         # ✅ Готов
└── beauty/       # ✅ Готов
```

Каждый модуль содержит:
- `types.ts` — TypeScript типы
- `services.ts` — Бизнес-логика
- `hooks.ts` — React хуки
- `index.ts` — Экспорты

## Цветовые темы

| Тема | Фон | Текст |
|------|-----|-------|
| Light | `oklch(0.985 0.002 250)` | `oklch(0.2 0.01 250)` |
| Dark | `oklch(0.18 0.008 250)` | `oklch(0.92 0.005 250)` |
| High Contrast | `oklch(1 0 0)` | `oklch(0 0 0)` |

## Переключение тем

```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme('dark');
```

## i18n

```tsx
import { useTranslation } from '@/shared/lib/use-translation';

const { t } = useTranslation();
<h1>{t('dashboard.title')}</h1>
```

## Git Workflow

```bash
# Создание коммита
git add .
git commit -m "feat: описание изменений"

# Формат сообщения: type: description
# type: feat, fix, docs, style, refactor, test, chore
```

## База данных

Все данные хранятся в IndexedDB через Dexie.js.

```typescript
import { db } from '@/core/database';

// Пример запроса
const transactions = await db.transactions
  .where('user_id')
  .equals(userId)
  .toArray();
```

## CRUD операции

```typescript
import { createEntity, updateEntity, deleteEntity } from '@/core';

// Создание
const transaction = await createEntity<Transaction>('transactions', data);

// Обновление
await updateEntity('transactions', id, updates);

// Удаление
await deleteEntity('transactions', id);
```

## Query Engine

```typescript
import { query } from '@/core';

// Фильтрация и сортировка
const result = await query<Transaction>('transactions')
  .userId(USER_ID)
  .where('type', 'eq', 'expense')
  .orderBy('date', 'desc')
  .take(10)
  .execute();
```

## Event System

```typescript
import { emit, on } from '@/core/events';

// Публикация события
emit('transaction.created', transaction);

// Подписка
on('transaction.created', (payload) => {
  console.log('New transaction:', payload);
});
```

## Синхронизация

```typescript
import { addToSyncQueue, runFullSync } from '@/core/sync';

// Добавление в очередь
await addToSyncQueue('transactions', id, 'create', data);

// Запуск синхронизации
await runFullSync(pushFn, pullFn, mergeFn);
```

## UI компоненты

```tsx
import { Button, Card, Badge, ProgressBar } from '@/ui/components';

// Кнопки
<Button variant="default">Save</Button>
<Button variant="destructive">Delete</Button>

// Карточки
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Бейджи
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>

// Прогресс
<ProgressBar value={75} max={100} showLabel />
```

## Layout

```tsx
import { AppLayout } from '@/ui/layout/app-layout';

export default function Page() {
  return (
    <AppLayout>
      <h1>Page Content</h1>
    </AppLayout>
  );
}
```

## Навигация

Sidebar (десктоп) и BottomNav (мобильные):
- Dashboard
- Finance
- Nutrition
- Workouts
- Health
- Habits
- Goals
- Mind
- Beauty

## Проверка тем

Откройте консоль и проверьте:
```javascript
getComputedStyle(document.documentElement)
  .getPropertyValue('--background')
```

## Контакты

Проект: LifeOS
Версия: 0.1.0
Последнее обновление: 2026-03-13
