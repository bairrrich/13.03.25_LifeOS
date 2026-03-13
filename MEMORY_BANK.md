# LifeOS Memory Bank

## 📋 Описание проекта

**LifeOS** — это единая life-tracker система для учета, контроля и улучшения всех аспектов жизни человека.

### Основные модули
- **Финансы** — полный финансовый учет (счета, транзакции, бюджеты)
- **Питание** — контроль питания и нутриентов (продукты, приёмы пищи)
- **Тренировки** — планирование и учет тренировок
- **Здоровье** — сон, витамины, анализы, метрики
- **Ум** — книги, фильмы, курсы, заметки
- **Красота** — уход за телом, косметика, рутины
- **Привычки** — формирование и отслеживание привычек
- **Цели** — долгосрочные цели с прогрессом

---

## 🏗️ Архитектура

### Технологический стек
- **Frontend:** Next.js 16, React 19, TypeScript
- **Стили:** Tailwind CSS v4, shadcn/ui компоненты
- **База данных:** Dexie.js (IndexedDB) — offline-first
- **Синхронизация:** Supabase (планируется)
- **i18n:** next-i18next (ru/en)

### Структура проекта
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Корневой layout с ThemeProvider
│   ├── page.tsx            # Главная страница (Dashboard)
│   └── globals.css         # Глобальные стили и CSS переменные
├── core/                   # Ядро платформы
│   ├── entity/             # Entity System (реестр сущностей)
│   ├── database/           # Dexie.js схема БД
│   ├── crud/               # Универсальный CRUD Engine
│   ├── query/              # Query Engine (фильтры, сортировка)
│   ├── events/             # Event Bus (события)
│   └── sync/               # Sync Engine (offline-first)
├── modules/                # Бизнес-модули
│   ├── finance/            # Финансы
│   ├── habits/             # Привычки
│   ├── nutrition/          # Питание
│   ├── workouts/           # Тренировки
│   ├── health/             # Здоровье
│   ├── goals/              # Цели
│   ├── mind/               # Ум (книги, фильмы, курсы)
│   └── beauty/             # Красота
├── ui/                     # UI компоненты
│   ├── components/         # Переиспользуемые компоненты
│   └── layout/             # Layout компоненты
└── shared/                 # Общие утилиты
    ├── lib/                # Утилиты (cn, i18n, generate-id)
    └── types/              # Общие типы (BaseEntity)
```

---

## 🎨 Дизайн-система

### Цветовая схема (OKLCH)
Все цвета заданы в цветовом пространстве OKLCH через CSS-переменные.

#### Light Theme
```css
--background: oklch(0.985 0.002 250);
--foreground: oklch(0.2 0.01 250);
--primary: oklch(0.55 0.12 260);
```

#### Dark Theme
```css
--background: oklch(0.18 0.008 250);
--foreground: oklch(0.92 0.005 250);
--primary: oklch(0.65 0.14 260);
```

#### High Contrast
```css
--background: oklch(1 0 0);
--foreground: oklch(0 0 0);
--primary: oklch(0.4 0.15 260);
```

### Темы
- **Light** — светлая тема по умолчанию
- **Dark** — тёмная тема
- **High Contrast** — контрастная тема для доступности
- **System** — системная (автоматически)

Переключение через `data-theme` атрибут на `<html>`.

---

## 📦 Основные зависимости

### Runtime
```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "dexie": "^4.0.0",
  "next-themes": "^0.4.6",
  "next-i18next": "^15.4.3",
  "zod": "^3.24.0",
  "lucide-react": "^0.577.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.5.0"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5",
  "eslint": "^9",
  "prettier": "^3.8.1",
  "husky": "^9.1.7",
  "lint-staged": "^16.3.3",
  "@commitlint/cli": "^20.4.4",
  "tailwindcss": "^4"
}
```

---

## 🔧 Инструменты разработки

### Команды
```bash
npm run dev          # Запуск dev-сервера
npm run build        # Production сборка
npm run start        # Запуск production сборки
npm run lint         # ESLint проверка
```

### Git Hooks (Husky)
- **pre-commit:** lint-staged (ESLint + Prettier)
- **commit-msg:** commitlint (Conventional Commits)

### Формат коммитов (Conventional Commits)
```
feat: новая функция
fix: исправление ошибки
docs: обновление документации
style: форматирование
refactor: рефакторинг
test: добавление тестов
chore: настройка сборки
```

---

## 📊 База данных

### Схема Dexie.js
База данных содержит 40+ таблиц для всех модулей.

#### Core таблицы
- `transactions` — финансовые транзакции
- `accounts` — счета
- `categories` — категории расходов/доходов
- `budgets` — бюджеты

#### Habits
- `habits` — привычки
- `habit_logs` — записи выполнения

#### Nutrition
- `foods` — продукты
- `meals` — приёмы пищи
- `meal_entries` — записи приёма пищи

#### Workouts
- `exercises` — упражнения
- `workouts` — тренировки
- `sets` — подходы

#### Health
- `sleep_logs` — сон
- `weight_logs` — вес
- `vitamins` — витамины
- `vitamin_logs` — приём витаминов
- `health_metrics` — метрики здоровья
- `lab_tests` — лабораторные тесты
- `lab_results` — результаты тестов

#### Goals
- `goals` — цели
- `goal_milestones` — этапы целей
- `goal_progress` — прогресс целей

#### Mind
- `books` — книги
- `reading_logs` — записи чтения
- `movies` — фильмы
- `courses` — курсы
- `notes` — заметки
- `ideas` — идеи

#### Beauty
- `cosmetics` — косметика
- `beauty_routines` — рутины
- `routine_steps` — шаги рутин
- `beauty_logs` — записи выполнения

#### System
- `sync_queue` — очередь синхронизации
- `devices` — устройства
- `settings` — настройки

### BaseEntity
Все сущности наследуют базовый интерфейс:
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

---

## 🔄 Синхронизация

### Offline-first архитектура
1. Все изменения сначала записываются в локальную БД (IndexedDB)
2. Изменения добавляются в очередь синхронизации (`sync_queue`)
3. Sync Engine отправляет изменения на сервер (Supabase)
4. Pull изменений с сервера
5. Merge и разрешение конфликтов

### Стратегии разрешения конфликтов
- **Last Write Wins** — последняя запись побеждает
- **Merge fields** — объединение полей
- **Manual** — ручное разрешение (планируется)

---

## 🌐 Интернационализация (i18n)

### Поддерживаемые языки
- **ru** — русский (по умолчанию)
- **en** — английский

### Структура
```
public/locales/
├── ru/
│   └── common.json
└── en/
    └── common.json
```

### Использование
```typescript
import { useTranslation } from '@/shared/lib/use-translation';

const { t } = useTranslation();
<h1>{t('dashboard.title')}</h1>
```

---

## 📝 Правила разработки

### 1. Управление зависимостями
- Проверять актуальность перед установкой
- Фиксировать версии в package.json
- Предпочитать хорошо поддерживаемые библиотеки

### 2. Стилизация
- Использовать Tailwind CSS + shadcn/ui
- Цвета в OKLCH через CSS-переменные
- Поддержка светлой/тёмной/контрастной тем

### 3. Именование
- Переменные: `camelCase`
- Функции: `camelCase` (глаголы)
- Компоненты: `PascalCase`
- Файлы компонентов: `PascalCase.tsx`
- Константы: `UPPER_SNAKE_CASE`

### 4. Интернационализация
- Все тексты выносить в файлы локалей
- Использовать точечную нотацию ключей

### 5. Mobile First
- Сначала стили для мобильных
- Адаптация через `sm:`, `md:`, `lg:` брейкпоинты

---

## 🚀 Текущий статус

### ✅ Завершено
- [x] Инициализация Next.js проекта
- [x] Настройка Tailwind CSS + shadcn/ui
- [x] Настройка OKLCH цветовой схемы
- [x] Настройка тем (light/dark/high-contrast)
- [x] ESLint + Prettier + Husky + commitlint
- [x] i18n (ru/en)
- [x] Entity System с реестром
- [x] Database Layer (Dexie.js, 40+ таблиц)
- [x] CRUD Engine (универсальный)
- [x] Query Engine (фильтры, сортировка, агрегация)
- [x] Event System (event bus)
- [x] Sync Engine (offline-first)
- [x] UI компоненты (Button, Card, Badge, etc.)
- [x] AppLayout с навигацией
- [x] Finance модуль (полный)
- [x] Habits модуль (полный)
- [x] Nutrition модуль (полный)
- [x] Workouts модуль (полный)
- [x] Health модуль (полный)
- [x] Goals модуль (полный)
- [x] Mind модуль (полный)
- [x] Beauty модуль (полный)

### 🔄 В процессе
- [ ] Dashboard с аналитикой
- [ ] Страницы для модулей
- [ ] Формы для CRUD операций

### 📅 Планируется
- [ ] Automation System
- [ ] AI Assistant
- [ ] Command Palette
- [ ] Global Search
- [ ] Notifications System
- [ ] Тесты (unit/integration/E2E)
- [ ] PWA поддержка
- [ ] Синхронизация с Supabase

---

## 📂 Важные файлы

| Файл | Описание |
|------|----------|
| `.project/00_RULES.md` | Универсальные правила разработки |
| `.project/01_описание.md` | Описание проекта и философия |
| `.project/02_база_данных.md` | ER-диаграмма и схема БД |
| `.project/03_CRUD_Entity.md` | Entity System архитектура |
| `.project/04_архитектура.md` | Модульная архитектура |
| `.project/05_ui.md` | UI Design System |
| `.project/07_sync.md` | Sync Engine архитектура |
| `.project/08_query_engin.md` | Query Engine, Events, Automation |
| `.project/09_core.md` | Core сервисы платформы |
| `.project/10_color_scheme.md` | Документация по цветам |
| `.project/11_theme_fix.md` | Решение проблем с темами |
| `.project/12_theme_fix_complete.md` | Финальное исправление тем |
| `.project/13_background_setup.md` | Настройка фона |

---

## 🔗 Ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Dexie.js Documentation](https://dexie.org)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

**Последнее обновление:** 2026-03-13
**Версия:** 0.1.0 (MVP в разработке)
