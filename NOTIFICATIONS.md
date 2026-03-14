# Notifications System Documentation

## Обзор

**Notifications System** — система уведомлений для LifeOS с поддержкой toast-сообщений, notification center и desktop-уведомлений.

## Архитектура

```
src/core/notifications/
├── types.ts                    # Типы и интерфейсы
├── notification-service.ts     # Сервис уведомлений
└── index.ts                    # Экспорты

src/ui/components/
├── toast.tsx                   # Toast компонент
├── toaster.tsx                 # Toaster provider
└── notification-center.tsx     # Notification Center (dropdown)
```

## Основные возможности

### 1. Toast Уведомления
- 4 типа: info, success, warning, error
- Автозакрытие
- Анимация появления/исчезновения
- Настраиваемая позиция

### 2. Notification Center
- Dropdown панель в header
- История уведомлений
- Отметка прочитанных
- Очистка прочитанных/всех

### 3. Desktop Уведомления
- Интеграция с Browser Notification API
- Запрос разрешения
- Фоновые уведомления

### 4. Звуковые сигналы
- Web Audio API beep
- Настраиваемый звук

## Использование

### Быстрое создание уведомлений

```typescript
import { notify, notifyTypes } from '@/core/notifications';

// Общий метод
notify({
  type: 'success',
  priority: 'medium',
  title: 'Успешно!',
  message: 'Данные сохранены',
  autoClose: 5000,
});

// Упрощённые методы
notifyTypes.success('Успешно', 'Данные сохранены');
notifyTypes.error('Ошибка', 'Не удалось сохранить');
notifyTypes.warning('Внимание', 'Бюджет превышен');
notifyTypes.info('Инфо', 'Новое сообщение');
```

### Через Toaster Context

```typescript
import { useToaster } from '@/ui/components/toaster';

function MyComponent() {
  const { success, error, warning, info } = useToaster();

  const handleClick = () => {
    success('Готово!', 'Операция выполнена');
  };

  return <button onClick={handleClick}>Save</button>;
}
```

### Через Notification Service

```typescript
import { notificationService } from '@/core/notifications';

// Создать уведомление
const id = notificationService.create({
  type: 'success',
  priority: 'high',
  title: 'Цель достигнута!',
  message: 'Поздравляем с достижением цели',
});

// Получить уведомление
const notification = notificationService.get(id);

// Отметить как прочитанное
notificationService.markAsRead(id);

// Удалить
notificationService.dismiss(id);

// Удалить все
notificationService.dismissAll();

// Удалить прочитанные
notificationService.dismissRead();
```

### Предустановленные шаблоны

```typescript
// Finance
notificationService.templates.budgetExceeded({
  category: 'Еда',
  amount: 150,
  budget: 100,
});

notificationService.templates.largeTransaction({
  amount: 1000,
  currency: '€',
});

// Habits
notificationService.templates.habitCompleted({
  habitName: 'Чтение',
  streak: 7,
});

notificationService.templates.habitMissed({
  habitName: 'Спорт',
});

// Goals
notificationService.templates.goalCompleted({
  goalName: 'Выучить английский',
});

notificationService.templates.goalMilestone({
  goalName: 'Накопить деньги',
  progress: 50,
});

// Automation
notificationService.templates.automationError({
  ruleName: 'Уведомление о трате',
  error: 'Network error',
});

notificationService.templates.automationTriggered({
  ruleName: 'Ежедневный бюджет',
});
```

## Настройки

```typescript
import { notificationService } from '@/core/notifications';

// Получить настройки
const settings = notificationService.getSettings();

// Обновить настройки
notificationService.updateSettings({
  enabled: true,          // Включить/выключить все уведомления
  showInApp: true,        // Показывать toast в приложении
  sound: false,           // Воспроизводить звук
  desktop: false,         // Показывать desktop уведомления
  maxVisible: 5,          // Максимум видимых toast
  autoClose: 5000,        // Время автозакрытия (мс)
  position: 'top-right',  // Позиция toast
});

// Сбросить настройки
notificationService.resetSettings();
```

## Notification Center

```typescript
import { NotificationCenter } from '@/ui/components/notification-center';

// Используется в header
function Header() {
  return (
    <header>
      <NotificationCenter />
    </header>
  );
}
```

### Функции Notification Center:

- **Badge с количеством непрочитанных**
- **Список последних 20 уведомлений**
- **Отметка времени** (только что, 5м назад, 2ч назад, 3дн назад)
- **Иконки типов** (ℹ️ ✅ ⚠️ ❌)
- **Действия:**
  - Отметить как прочитанное
  - Отметить все как прочитанное
  - Закрыть уведомление
  - Очистить прочитанные
  - Очистить все

## Приоритеты

| Приоритет | Описание | Пример |
|-----------|----------|--------|
| `low` | Низкий | Напоминание о привычке |
| `medium` | Средний | Обычное уведомление |
| `high` | Высокий | Ошибка, важная цель |

## Типы уведомлений

| Тип | Описание | Цвет |
|-----|----------|------|
| `info` | Информация | Синий |
| `success` | Успех | Зелёный |
| `warning` | Предупреждение | Жёлтый |
| `error` | Ошибка | Красный |

## Позиции Toast

- `top-right` (по умолчанию)
- `top-left`
- `bottom-right`
- `bottom-left`

## Интеграция с Automation System

Автоматическое создание уведомлений при срабатывании правил:

```typescript
// В automation rule action
{
  type: 'send_notification',
  data: {
    title: 'Бюджет превышен',
    body: 'Превышен бюджет категории "Еда"',
  },
}
```

## Desktop Уведомления

```typescript
// Запросить разрешение
const granted = await notificationService.requestDesktopPermission();

if (granted) {
  notificationService.updateSettings({ desktop: true });
}
```

## События

```typescript
// Слушать события toast
window.addEventListener('lifeos-toast', (event: CustomEvent) => {
  const notification = event.detail;
  console.log('New toast:', notification);
});
```

## Хранение

- Уведомления сохраняются в `localStorage` (ключ: `lifeos-notifications`)
- Хранятся последние 100 уведомлений
- Настройки сохраняются в `localStorage` (ключ: `lifeos-notification-settings`)

## Примеры использования

### Finance Module

```typescript
import { financeNotifications } from '@/shared/lib/notifications';

// Превышение бюджета
financeNotifications.budgetExceeded('Еда', 150);

// Добавление транзакции
financeNotifications.transactionAdded(50, 'expense');

// Низкий баланс
financeNotifications.lowBalance('Основной счёт', 10);
```

### Habits Module

```typescript
import { habitsNotifications } from '@/shared/lib/notifications';

// Привычка выполнена
habitsNotifications.habitCompleted('Чтение');

// Серия дней
habitsNotifications.streakReached('Спорт', 30);

// Напоминание
habitsNotifications.reminder('Медитация');
```

### Health Module

```typescript
import { healthNotifications } from '@/shared/lib/notifications';

// Цель достигнута
healthNotifications.goalReached('Вес', 70);

// Напоминание
healthNotifications.reminder('Принять витамины');
```

## Best Practices

1. **Не переусердствуйте** — не создавайте слишком много уведомлений
2. **Используйте правильный тип** — success для успеха, error для ошибок
3. **Настройте автозакрытие** — info/success закрываются быстрее
4. **Приоритеты** — используйте high priority только для важного
5. **Desktop уведомления** — запрашивайте разрешение при необходимости

## Будущие улучшения

- [ ] Группировка уведомлений
- [ ] Кастомные действия
- [ ] Отложенные уведомления
- [ ] Повторяющиеся напоминания
- [ ] Интеграция с календарём
- [ ] Push-уведомления (Service Worker)
