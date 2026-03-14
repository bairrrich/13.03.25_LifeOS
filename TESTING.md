# Testing Documentation

## Обзор

**LifeOS** использует Jest и React Testing Library для тестирования.

## Технологический стек

- **Jest** — тестовый раннер
- **React Testing Library** — тестирование React компонентов
- **user-event** — симуляция пользовательских событий
- **ts-jest** — поддержка TypeScript
- **jsdom** — DOM эмуляция

## Конфигурация

### Файлы конфигурации

- `jest.config.js` — настройки Jest
- `jest.setup.ts` — глобальные моки и setup
- `tsconfig.json` — TypeScript настройки (добавлены типы Jest)

### Команды

```bash
# Запустить все тесты
npm test

# Запустить тесты в watch режиме
npm run test:watch

# Запустить тесты с coverage
npm run test:coverage

# Запустить тесты для CI
npm run test:ci
```

### Запуск конкретных тестов

```bash
# Тесты по паттерну
npm test -- notification
npm test -- automation
npm test -- toast

# Тесты по пути
npm test -- src/core/notifications
```

## Структура тестов

```
src/
├── core/
│   ├── notifications/
│   │   ├── __tests__/
│   │   │   └── notification-service.test.ts
│   │   └── ...
│   ├── automation/
│   │   ├── __tests__/
│   │   │   └── automation-engine.test.ts
│   │   └── ...
├── ui/
│   └── components/
│       ├── __tests__/
│       │   └── toast.test.tsx
│       └── ...
```

## Написание тестов

### Unit тесты (Service)

```typescript
import { NotificationService } from '@/core/notifications';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    localStorage.clear();
    service = new NotificationService();
  });

  it('должен создать уведомление', () => {
    const id = service.create({
      type: 'info',
      priority: 'medium',
      title: 'Test',
      message: 'Test message',
    });

    expect(id).toBeDefined();
    expect(service.get(id)?.title).toBe('Test');
  });
});
```

### Component тесты

```typescript
import { render, screen } from '@testing-library/react';
import { Toast } from '@/ui/components/toast';

describe('Toast', () => {
  it('должен рендерить уведомление', () => {
    render(
      <Toast
        id="1"
        type="success"
        title="Success!"
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });
});
```

### Тесты с событиями

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('должен закрываться по клику', async () => {
  const mockOnClose = jest.fn();
  const user = userEvent.setup();

  render(
    <Toast
      id="1"
      type="info"
      title="Test"
      onClose={mockOnClose}
    />
  );

  await user.click(screen.getByRole('button'));
  expect(mockOnClose).toHaveBeenCalledWith('1');
});
```

### Тесты с таймерами

```typescript
it('должен закрыться через 5 секунд', async () => {
  jest.useFakeTimers();

  render(<Toast id="1" type="info" title="Test" duration={5000} onClose={jest.fn()} />);

  jest.advanceTimersByTime(5000);

  expect(mockOnClose).toHaveBeenCalled();

  jest.useRealTimers();
});
```

## Моки

### localStorage

```typescript
// В jest.setup.ts
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => localStorageStore[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    localStorageStore[key] = value;
  }),
  clear: jest.fn(() => {
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  }),
};
```

### window.matchMedia

```typescript
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});
```

### CustomEvent

```typescript
global.CustomEvent = class CustomEvent extends Event {
  detail: any;
  constructor(type: string, eventInitDict?: CustomEventInit) {
    super(type, eventInitDict);
    this.detail = eventInitDict?.detail;
  }
} as any;
```

## Best Practices

### 1. Очищайте моки между тестами

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 2. Используйте fake timers для асинхронных тестов

```typescript
jest.useFakeTimers();
// ... тест
jest.useRealTimers();
```

### 3. Тестируйте поведение, а не реализацию

```typescript
// ✅ Хорошо
expect(screen.getByText('Success')).toBeInTheDocument();

// ❌ Избегайте
expect(component.state.value).toBe('Success');
```

### 4. Используйте data-testid для сложных селекторов

```typescript
<button data-testid="submit-button">Submit</button>

// В тесте
screen.getByTestId('submit-button');
```

### 5. Группируйте связанные тесты

```typescript
describe('NotificationService', () => {
  describe('create', () => {
    it('...', () => {});
    it('...', () => {});
  });

  describe('getAll', () => {
    it('...', () => {});
  });
});
```

## Coverage

### Запуск с coverage

```bash
npm run test:coverage
```

### Пороги coverage

- Statements: 50%
- Branches: 50%
- Functions: 50%
- Lines: 50%

### Отчёт

Отчёт о coverage доступен в `coverage/lcov-report/index.html`

## CI/CD

### GitHub Actions пример

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
```

## Существующие тесты

### Core

| Файл | Описание | Статус |
|------|----------|--------|
| `notification-service.test.ts` | Тесты Notification Service | ✅ 23 теста |
| `automation-engine.test.ts` | Тесты Automation Engine | ✅ 29 тестов |

### UI Components

| Файл | Описание | Статус |
|------|----------|--------|
| `toast.test.tsx` | Тесты Toast компонента | ✅ 10 тестов |

## Будущие улучшения

- [ ] Тесты для Event Bus
- [ ] Тесты для Automation UI компонентов
- [ ] Integration тесты
- [ ] E2E тесты (Playwright)
- [ ] Snapshot тесты
- [ ] Accessibility тесты

## Полезные ссылки

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries)
- [Common Mistakes with Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
