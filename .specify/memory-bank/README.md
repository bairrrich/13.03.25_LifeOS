# Memory Bank Usage Guide

## Что такое Memory Bank?

**Memory Bank** — это структурированная система документации на Markdown, которая сохраняет контекст проекта между сессиями AI-агентов. После каждого сброса памяти агент читает эти файлы для понимания текущего состояния проекта.

## Структура файлов

```
.specify/memory-bank/
├── projectBrief.md      # Фундамент — требования и цели
├── productContext.md    # Почему проект существует
├── systemPatterns.md    # Архитектура и паттерны
├── techContext.md       # Технологический стек
├── activeContext.md     # Текущее состояние (обновляется!)
└── progress.md          # Статус выполнения (обновляется!)
```

## Рабочий процесс AI-агента

### 1. Начало сессии (ОБЯЗАТЕЛЬНО)

Прочитать все файлы Memory Bank **в порядке зависимости**:

```
1. projectBrief.md      ← Фундамент
2. productContext.md    ← Почему
3. systemPatterns.md    ← Архитектура
4. techContext.md       ← Технологии
5. activeContext.md     ← Текущее состояние
6. progress.md          ← Прогресс
```

### 2. Во время работы

- Поддерживать актуальность `activeContext.md`
- Документировать решения в `systemPatterns.md`
- Обновлять `progress.md` после задач

### 3. Завершение сессии

**Обновить `activeContext.md`:**
```markdown
## Current Focus
[Над чем работали]

## Recent Changes
- [Изменение 1]
- [Изменение 2]

## Next Steps
1. [Следующий шаг]

## Active Decisions
- [Решения на рассмотрении]
```

**Обновить `progress.md`:**
```markdown
## What Works
- [Новая функциональность]

## What's Left
- [ ] [Оставшиеся задачи]
```

## Slash команды для работы с Memory Bank

| Команда | Описание |
|---------|----------|
| `/speckit.constitution` | Обновить принципы проекта |
| `/speckit.specify` | Создать спецификацию функции |
| `/speckit.plan` | Создать план реализации |
| `/speckit.tasks` | Сгенерировать задачи |
| `/speckit.implement` | Реализовать функциональность |

## Принципы качественного Memory Bank

| Принцип | Описание |
|---------|----------|
| **Concise** | Файлы должны быть сканируемыми |
| **Current** | Обновлять после значимых изменений |
| **Accurate** | Документация = реальность |
| **Complete** | Достаточно для продолжения работы |
| **Structured** | Согласованное форматирование |

## Чек-лист обновления

### Каждая сессия
- [ ] Прочитать все 6 файлов
- [ ] Проверить `activeContext.md` на актуальность
- [ ] Обновить после завершения работы

### Каждая функция
- [ ] Создать spec в `.specify/specs/`
- [ ] Обновить `progress.md`
- [ ] Обновить `systemPatterns.md` (если новые паттерны)

### Каждый релиз
- [ ] Проверить все файлы на актуальность
- [ ] Обновить версии в файлах
- [ ] Добавить метрики в `progress.md`

## Примеры

### Пример обновления activeContext.md
```markdown
## Recent Changes
- ✅ Создан Memory Bank (6 файлов)
- ✅ Настроен spec-kit workflow

## Next Steps
1. Создать spec для Tasks Module
2. Реализовать базовый CRUD
```

### Пример обновления progress.md
```markdown
## What Works
- Spec-kit workflow настроен
- Memory Bank структура готова

## What's Left
- [ ] Tasks Module spec
- [ ] Tasks Module implementation
```

## Troubleshooting

### Проблема: AI не читает Memory Bank
**Решение**: Явно указать в начале сессии:
> "Прочитай все файлы Memory Bank в порядке: projectBrief → productContext → systemPatterns → techContext → activeContext → progress"

### Проблема: Файлы устарели
**Решение**: Запустить `/speckit.analyze` для проверки согласованности

### Проблема: Слишком много деталей
**Решение**: Использовать принцип Concise — только ключевая информация

---
**Version**: 1.0.0 | **Created**: 2026-03-13
