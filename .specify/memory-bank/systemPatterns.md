# System Patterns

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     LifeOS Platform                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Finance    │  │   Habits     │  │  Nutrition   │  │
│  │   Module     │  │   Module     │  │   Module     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Workouts   │  │   Health     │  │    Goals     │  │
│  │   Module     │  │   Module     │  │   Module     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │    Mind      │  │   Beauty     │                     │
│  │   Module     │  │   Module     │                     │
│  └──────────────┘  └──────────────┘                     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                     Core Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Entity  │ │ Database │ │   CRUD   │ │  Query   │   │
│  │  System  │ │  Layer   │ │  Engine  │ │  Engine  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  ┌──────────┐ ┌──────────┐                              │
│  │  Event   │ │   Sync   │                              │
│  │  System  │ │  Engine  │                              │
│  └──────────┘ └──────────┘                              │
├─────────────────────────────────────────────────────────┤
│                   UI Layer                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  App     │ │Components│ │  Theme   │                │
│  │  Layout  │ │          │ │ Switcher │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Entity System Pattern
Все данные — это сущности с общим базовым интерфейсом.

```typescript
interface BaseEntity {
  id: string;
  user_id: string;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  version: number;
  sync_status: 'local' | 'synced' | 'conflict';
  metadata?: Record<string, unknown>;
  tags?: string[];
  notes?: string;
}
```

**Преимущества:**
- Единый интерфейс для всех операций
- Упрощённая синхронизация
- Общий audit trail

### 2. Repository Pattern (через CRUD Engine)
Универсальный доступ к данным через entity type.

```typescript
// Создание
const transaction = await createEntity<Transaction>(
  'transactions',
  data
);

// Обновление
await updateEntity('transactions', id, updates);

// Удаление (soft delete)
await deleteEntity('transactions', id);
```

### 3. Query Builder Pattern
Декларативные запросы с цепочкой методов.

```typescript
const result = await query<Transaction>('transactions')
  .userId(USER_ID)
  .where('type', 'eq', 'expense')
  .orderBy('date', 'desc')
  .take(10)
  .execute();
```

### 4. Event Bus Pattern
Асинхронная связь между модулями.

```typescript
// Публикация
emit('transaction.created', transaction);

// Подписка
on('transaction.created', (payload) => {
  updateDashboard(payload);
});
```

### 5. Offline-First Sync
Все изменения сначала в локальную БД, затем синхронизация.

```typescript
// 1. Локальное изменение
await createEntity('transactions', data);

// 2. Добавление в очередь
await addToSyncQueue('transactions', id, 'create', data);

// 3. Фоновая синхронизация
await runFullSync(pushFn, pullFn, mergeFn);
```

## Module Structure

Каждый модуль следует единому шаблону:

```
module-name/
├── types.ts       # TypeScript типы
├── services.ts    # Бизнес-логика
├── hooks.ts       # React хуки
└── index.ts       # Публичные экспорты
```

### Service Layer Pattern

```typescript
// Создание сущности
export async function createTransaction(
  data: Omit<Transaction, keyof BaseEntity>
): Promise<Transaction> {
  return createEntity<Transaction>('transactions', {
    ...data,
    user_id: USER_ID,
  });
}

// Запрос с фильтрацией
export async function getTransactions(options?: {
  accountId?: string;
  categoryId?: string;
  type?: 'expense' | 'income' | 'transfer';
}): Promise<Transaction[]> {
  let q = query<Transaction>('transactions').userId(USER_ID);
  
  if (options?.accountId) {
    q = q.where('account_id', 'eq', options.accountId);
  }
  
  const result = await q.execute();
  return result.data;
}
```

### Hook Pattern

```typescript
export function useTransactions(accountId?: string) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactions({ accountId })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accountId]);

  return { data, loading, error };
}
```

## UI Component Patterns

### Atomic Design
Компоненты организованы по принципу Atomic Design:

1. **Primitives** — Button, Input, Select
2. **Components** — Card, Form, Modal
3. **Layout** — AppLayout, Sidebar, Header
4. **Modules** — TransactionList, HabitTracker

### Theme Provider Pattern

```tsx
<ThemeProvider
  attribute="data-theme"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### CSS Variables Pattern

```css
:root {
  --background: oklch(0.985 0.002 250);
  --foreground: oklch(0.2 0.01 250);
  --primary: oklch(0.55 0.12 260);
}

[data-theme="dark"] {
  --background: oklch(0.18 0.008 250);
  --foreground: oklch(0.92 0.005 250);
  --primary: oklch(0.65 0.14 260);
}
```

## Data Flow

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│   UI    │────▶│  Hooks   │────▶│ Services │
└─────────┘     └──────────┘     └──────────┘
     │                                │
     │                                ▼
     │                          ┌──────────┐
     │                          │   CRUD   │
     │                          │  Engine  │
     │                          └──────────┘
     │                                │
     │                                ▼
     │                          ┌──────────┐
     └──────────────────────────│   Event  │
                                │  System  │
                                └──────────┘
```

## State Management

### Local State
- React useState для UI состояния
- useReducer для сложного состояния

### Shared State
- Context API для глобального состояния
- Custom hooks для доступа к данным

### Persistent State
- IndexedDB через Dexie.js
- Синхронизация через Sync Engine

## Error Handling

### Service Layer
```typescript
try {
  const result = await query<Transaction>('transactions')
    .userId(USER_ID)
    .execute();
  return result.data;
} catch (error) {
  console.error('Failed to fetch transactions:', error);
  throw error;
}
```

### Hook Layer
```typescript
useEffect(() => {
  fetchData()
    .then(setData)
    .catch((err) => setError(err.message));
}, []);
```

## Testing Strategy

### Unit Tests
```typescript
describe('createTransaction', () => {
  it('should create a transaction with valid data', async () => {
    const transaction = await createTransaction(validData);
    expect(transaction.id).toBeDefined();
    expect(transaction.amount).toBe(100);
  });
});
```

### Integration Tests
```typescript
describe('Finance Module', () => {
  it('should calculate monthly expenses', async () => {
    const expenses = await getMonthlyExpenses(2026, 3);
    expect(expenses).toBeGreaterThan(0);
  });
});
```

---

**Last Updated**: 2026-03-13
**Version**: 1.0.0
