# Automation System Documentation

## Обзор

**Automation System** — система правил и триггеров для автоматизации действий в LifeOS.

## Архитектура

```
src/core/automation/
├── types.ts              # Типы и интерфейсы
├── automation-engine.ts  # Движок выполнения правил
├── scheduler.ts          # Планировщик расписаний
├── automation-service.ts # CRUD сервис
├── event-integration.ts  # Интеграция с Event System
├── automation-provider.tsx # React Provider
└── index.ts              # Экспорты
```

## Основные концепции

### Правило (AutomationRule)

Правило состоит из:
- **Триггер** — когда срабатывает правило
- **Условия** — дополнительные фильтры (опционально)
- **Действия** — что выполняется при срабатывании

### Типы триггеров

| Тип | Описание | Пример |
|-----|----------|--------|
| `event` | Событие в системе | `transaction.created` |
| `schedule` | Cron-расписание | `0 9 * * *` (каждый день в 9:00) |
| `condition` | Периодическая проверка | Проверка баланса каждые 5 минут |
| `manual` | Ручной запуск | Кнопка "Выполнить" |

### Типы условий

- `equals` — равно
- `not_equals` — не равно
- `greater_than` — больше
- `less_than` — меньше
- `contains` — содержит
- `not_contains` — не содержит
- `exists` — существует
- `regex` — regex匹配
- `between` — между
- `in` — в списке
- `and` / `or` / `not` — логические операторы

### Типы действий

| Действие | Описание |
|----------|----------|
| `create_entity` | Создать сущность |
| `update_entity` | Обновить сущность |
| `delete_entity` | Удалить сущность |
| `send_notification` | Отправить уведомление |
| `run_script` | Выполнить скрипт |
| `webhook` | Вызвать webhook |
| `copy_data` | Копировать данные |
| `aggregate_data` | Агрегировать данные |
| `tag_entity` | Добавить тег |
| `change_status` | Изменить статус |

## Примеры использования

### Пример 1: Уведомление о крупной трате

```typescript
import { createAutomationRule } from '@/core/automation';

await createAutomationRule({
  name: 'Уведомление о крупной трате',
  description: 'Уведомлять о тратах больше 1000€',
  enabled: true,
  trigger: {
    type: 'event',
    event: 'transaction.created',
  },
  conditions: [
    {
      type: 'greater_than',
      field: 'amount',
      value: 1000,
    },
    {
      type: 'equals',
      field: 'type',
      value: 'expense',
    },
  ],
  actions: [
    {
      type: 'send_notification',
      data: {
        title: 'Крупная трата',
        body: 'Потрачено {{payload.amount}} {{payload.currency}}',
      },
    },
  ],
  priority: 80,
});
```

### Пример 2: Ежедневный бюджет

```typescript
await createAutomationRule({
  name: 'Проверка дневного бюджета',
  description: 'Проверка расходов в конце дня',
  enabled: true,
  trigger: {
    type: 'schedule',
    schedule: {
      cron: '0 21 * * *', // Каждый день в 21:00
    },
  },
  actions: [
    {
      type: 'aggregate_data',
      aggregation: {
        source_entity: 'transactions',
        field: 'amount',
        operation: 'sum',
      },
    },
  ],
  priority: 50,
});
```

### Пример 3: Авто-завершение привычки

```typescript
await createAutomationRule({
  name: 'Авто-завершение привычки',
  description: 'Завершать привычку после 7 дней',
  enabled: true,
  trigger: {
    type: 'condition',
    condition_check_interval: 3600000, // Проверка каждый час
  },
  conditions: [
    {
      type: 'equals',
      field: 'streak',
      value: 7,
    },
  ],
  actions: [
    {
      type: 'change_status',
      entity_type: 'habits',
      status: 'completed',
    },
  ],
  run_once: true,
});
```

## API

### Создание правила

```typescript
createAutomationRule(rule: Omit<AutomationRule, 'id' | 'created_at' | ...>)
```

### Получение всех правил

```typescript
getAllAutomationRules(): Promise<AutomationRule[]>
```

### Обновление правила

```typescript
updateAutomationRule(ruleId: string, updates: Partial<AutomationRule>)
```

### Удаление правила

```typescript
deleteAutomationRule(ruleId: string)
```

### Включение/выключение

```typescript
toggleAutomationRule(ruleId: string, enabled: boolean)
```

### Получение логов

```typescript
getAutomationLogs(limit?: number, ruleId?: string): Promise<AutomationLog[]>
```

## Cron-выражения

Формат: `минута час день месяц день_недели`

| Пример | Описание |
|--------|----------|
| `* * * * *` | Каждую минуту |
| `*/5 * * * *` | Каждые 5 минут |
| `0 * * * *` | Каждый час |
| `0 9 * * *` | Каждый день в 9:00 |
| `0 0 * * 1` | Каждый понедельник в полночь |
| `0 0 1 * *` | 1 числа каждого месяца |
| `0 0 * * *` | Каждую ночь в полночь |

## Интерполяция переменных

В действиях можно использовать переменные из контекста:

```
{{payload.amount}} — значение поля amount из payload
{{payload.transaction.date}} — вложенное поле
{{timestamp}} — временная метка события
```

## Статистика и мониторинг

Каждое правило отслеживает:
- `trigger_count` — количество срабатываний
- `error_count` — количество ошибок
- `last_triggered_at` — последнее срабатывание

## Best Practices

1. **Приоритеты**: Устанавливайте высокий приоритет (80-100) для критичных правил
2. **Cooldown**: Используйте задержку для предотвращения частых срабатываний
3. **Run Once**: Для одноразовых правил используйте `run_once: true`
4. **Условия**: Добавляйте условия для фильтрации событий
5. **Логирование**: Проверяйте логи для отладки правил

## Интеграция

### В коде

```typescript
import { automationEngine } from '@/core/automation';

// Ручной запуск правила
await automationEngine.triggerManual(ruleId, payload);

// Проверка условия
const result = automationEngine.checkCondition(condition, data);
```

### Через UI

1. Откройте страницу `/automation`
2. Нажмите "Создать правило"
3. Настройте триггер, условия и действия
4. Сохраните правило

## Будущие улучшения

- [ ] Визуальный конструктор правил
- [ ] Шаблоны популярных правил
- [ ] Тестирование правил (dry run)
- [ ] Экспорт/импорт правил
- [ ] Вебхуки для внешних сервисов
- [ ] Расширенные агрегации данных
