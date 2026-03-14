# 🔍 Отчёт об аудите локализации

**Дата:** 14.03.2026  
**Проект:** LifeOS  
**Версия:** Next.js App Router + i18next

---

## 📊 Резюме

| Метрика | Значение |
|---------|----------|
| Всего страниц проверено | 15 |
| Проблем с локализацией | 25+ |
| Уровень покрытия | ~85% |

---

## ✅ Что хорошо работает

### 1. Архитектура i18n
- [`src/shared/lib/i18n.ts`](src/shared/lib/i18n.ts:1) - правильная инициализация i18next с fallback на 'ru'
- [`src/shared/lib/use-translation.ts`](src/shared/lib/use-translation.ts:1) - хук с поддержкой смены языка и localStorage
- Файлы переводов: [`public/locales/ru/common.json`](public/locales/ru/common.json:1) и [`public/locales/en/common.json`](public/locales/en/common.json:1)

### 2. Навигация
- [`src/ui/layout/app-layout.tsx`](src/ui/layout/app-layout.tsx:37) - полностью локализована через `t('nav.*')`

### 3. Большинство UI элементов страниц
- Заголовки, кнопки, диалоги используют `t()` функцию

---

## ❌ Проблемы с локализацией

### Критические (требуют исправления)

#### 1. Главная страница (Dashboard)
**Файл:** [`src/app/page.tsx`](src/app/page.tsx:232)

| Строка | Проблема | Решение |
|--------|----------|---------|
| 232 | захардкожено `углеводов • жиров` | использовать `t('nutrition.carbs')`, `t('nutrition.fat')` |
| 245 | захардкожено `~6.5 км` | использовать `t('units.km')` |

```tsx
// ❌ Плохо
{mockStats.nutrition.carbs}g углеводов • {mockStats.nutrition.fat}g жиров

// ✅ Хорошо
{mockStats.nutrition.carbs}{t('units.g')} {t('nutrition.carbs').toLowerCase()}
```

#### 2. Global Search
**Файл:** [`src/ui/components/global-search.tsx`](src/ui/components/global-search.tsx:192)

| Строка | Проблема | Решение |
|--------|----------|---------|
| 73 | захардкожено `дней серия` | использовать `t('habits.streak')` |
| 115 | захардкожено `% прогресс` | использовать `t('goals.progress')` |
| 192 | `placeholder="Поиск по всем модулям..."` | использовать `t('globalSearch.placeholder')` |
| 203 | `Ничего не найдено` | использовать `t('globalSearch.noResults')` |
| 209 | `Введите запрос для поиска...` | использовать `t('globalSearch.typeHint')` |

---

### Средней важности (mock данные для демонстрации)

> ⚠️ Эти данные используются только для демонстрации и должны быть перенесены в переводы или получать значения динамически.

#### Habits [`src/app/habits/page.tsx`](src/app/habits/page.tsx:28)
```tsx
const mockHabits = [
  { name: 'Чтение книг' },      // ❌
  { name: 'Спорт' },            // ❌
  { name: 'Медитация' },        // ❌
  { name: 'Пить воду' },        // ❌
];
```

#### Nutrition [`src/app/nutrition/page.tsx`](src/app/nutrition/page.tsx:41)
```tsx
const mockFoods = [
  { name: 'Овсянка' },          // ❌
  { name: 'Куриная грудка' },   // ❌
  { name: 'Рис' },              // ❌
  { name: 'Яйца' },             // ❌
  { name: 'Банан' },            // ❌
];
const mockMeals = [
  { name: 'Завтрак' },          // ❌
  { name: 'Обед' },             // ❌
];
```

#### Workouts [`src/app/workouts/page.tsx`](src/app/workouts/page.tsx:32)
```tsx
const mockWorkouts = [
  { name: 'Грудь + Трицепс' },   // ❌
  { name: 'Жим лёжа' },          // ❌
  { name: 'Отжимания на брусьях' }, // ❌
  { name: 'Спина + Бицепс' },     // ❌
  { name: 'Становая тяга' },     // ❌
];
```

#### Beauty [`src/app/beauty/page.tsx`](src/app/beauty/page.tsx:39)
```tsx
const mockCosmetics = [
  { name: 'Увлажняющий крем' },  // ❌
  { name: 'Шампунь' },           // ❌
  { name: 'Парфюм' },           // ❌
];
const mockRoutines = [
  { name: 'Утренняя рутина' },   // ❌
  { name: 'Вечерняя рутина' },   // ❌
  // steps
  { name: 'Очищение' },           // ❌
  { name: 'Тонизирование' },     // ❌
  { name: 'Увлажнение' },        // ❌
  { name: 'Демакияж' },          // ❌
  { name: 'Сыворотка' },         // ❌
];
```

#### Goals [`src/app/goals/page.tsx`](src/app/goals/page.tsx:27)
```tsx
const mockGoals = [
  { name: 'Накопить 5000€' },    // ❌
  { name: 'Прочитать 20 книг' }, // ❌
  { name: 'Похудеть на 10кг' }, // ❌
];
```

#### Mind [`src/app/mind/page.tsx`](src/app/mind/page.tsx:33)
```tsx
const mockBooks = [
  { title: 'Атомные привычки', author: 'Джеймс Клир' }, // ❌
  { title: 'Думай медленно', author: 'Даниэль Канеман' }, // ❌
];
const mockMovies = [
  { title: 'Начало', genre: 'Фантастика' },    // ❌
  { title: 'Интерстеллар', genre: 'Фантастика' }, // ❌
];
```

#### Finance [`src/app/finance/page.tsx`](src/app/finance/page.tsx:26)
```tsx
const mockTransactions = [
  { category: 'Зарплата' },     // ❌
  { category: 'Еда' },          // ❌
  { category: 'Транспорт' },    // ❌
];
```

#### Finance Accounts [`src/app/finance/accounts/page.tsx`](src/app/finance/accounts/page.tsx:24)
```tsx
const mockAccounts = [
  { name: 'Наличные' },         // ❌
  { name: 'Основной счёт' },    // ❌
  { name: 'Visa Card' },        // ⚠️ English only
  { name: 'Инвестиции' },       // ❌
];
```

---

## 🔧 Рекомендации

### 1. Немедленные действия
- [ ] Исправить захардкоженные тексты в [`src/app/page.tsx`](src/app/page.tsx:232) (строки 232, 245)
- [ ] Добавить переводы для global-search в файлы common.json

### 2. Среднесрочные
- [ ] Создать отдельный namespace для демо-данных или получать их динамически
- [ ] Добавить eslint правило для проверки hardcoded текстов

### 3. Улучшение переводов
- [ ] Добавить отсутствующие ключи в common.json:
  - `beauty.steps` - шаг (в единственном числе)
  - `beauty.daysLeft` - дней до истечения (уже есть)

---

## 📁 Структура переводов (достаточна)

```
common.json
├── common      ✅ покрыто
├── nav         ✅ покрыто
├── dashboard   ✅ покрыто
├── finance     ✅ покрыто
├── habits      ✅ покрыто
├── nutrition   ✅ покрыто
├── workouts    ✅ покрыто
├── health      ✅ покрыто
├── goals       ✅ покрыто
├── mind        ✅ покрыто
├── beauty      ✅ покрыто
├── theme       ✅ покрыто
├── language    ✅ покрыто
├── errors      ✅ покрыто
├── validation  ✅ покрыто
├── commandPalette ✅ покрыто
├── globalSearch    ⚠️ не хватает некоторых ключей
├── settings    ✅ покрыто
└── units       ✅ покрыто
```

---

## 🎯 Вывод

Приложение имеет **хорошую базовую структуру i18n** (~85% покрытия). Основные проблемы:

1. **Критические:** 6+ захардкоженных строк в UI (search, dashboard)
2. **Средние:** ~20+ строк в mock данных (временно, для демо)

Для production версии рекомендуется исправить критические проблемы и перенести демо-данные в переводы.