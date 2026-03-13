# System Patterns

## Architecture Overview
```
┌─────────────────────────────────────────────────────────┐
│                    LifeOS Architecture                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Goals      │  │   Habits     │  │   Tasks      │  │
│  │   Module     │  │   Module     │  │   Module     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │           │
│         └─────────────────┼─────────────────┘           │
│                           │                             │
│                  ┌────────▼────────┐                    │
│                  │  Core Engine    │                    │
│                  │  (State Mgmt)   │                    │
│                  └────────┬────────┘                    │
│                           │                             │
│         ┌─────────────────┼─────────────────┐          │
│         │                 │                 │           │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐  │
│  │   Spec Kit   │  │   Memory     │  │  Integrations│  │
│  │   Workflow   │  │   Bank       │  │  (Optional)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Spec-Driven Development
```
Specification → Plan → Tasks → Implementation → Analysis
     ↓            ↓         ↓          ↓            ↓
  spec.md     plan.md   tasks.md    code/     analyze.md
                              tests/
```

**Применение**: Каждая новая функция следует этому workflow через slash-команды Qwen Code.

### 2. Memory Bank Pattern
```
┌──────────────────────────────────────────────────────┐
│              Memory Bank Hierarchy                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  projectBrief.md (фундамент)                         │
│       │                                              │
│       ├── productContext.md (почему)                 │
│       ├── systemPatterns.md (как устроено)           │
│       ├── techContext.md (технологии)                │
│       │                                              │
│       └── activeContext.md (текущее состояние) ───┐  │
│               │                                   │  │
│               └── progress.md (прогресс) ◄────────┘  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Применение**: AI-агент читает все файлы в начале сессии, обновляет `activeContext.md` и `progress.md` в конце.

### 3. Module Contract Pattern
Каждый модуль имеет:
- Чёткий API (вход/выход)
- Изолированное состояние
- Собственные тесты
- Документацию в `.specify/specs/<module>/`

### 4. Event-Driven State Updates
```
User Action → Event → State Update → UI Re-render
                     ↓
              Persistence (optional)
                     ↓
              Memory Bank Update (activeContext.md)
```

## Key Technical Decisions

### Decision: Spec-Driven Workflow
**Context**: Выбор между agile/iterative и spec-driven подходом  
**Decision**: Spec-driven через GitHub Spec Kit  
**Rationale**:
- Сохраняет контекст между сессиями
- Упрощает работу AI-агентам
- Документирование решений по ходу разработки

### Decision: Memory Bank Structure
**Context**: Как сохранять контекст для AI  
**Decision**: Markdown файлы в `.specify/memory-bank/`  
**Rationale**:
- Версионируется вместе с кодом
- Читается человеком и AI
- Не требует внешних зависимостей

### Decision: Modular Architecture
**Context**: Монолит vs микросервисы vs модули  
**Decision**: Модульная архитектура в монолите  
**Rationale**:
- Простота развёртывания
- Изоляция ответственности
- Лёгкость тестирования

## Component Relationships

```
┌─────────────┐         ┌─────────────┐
│   Goals     │────────▶│   Projects  │
│   Module    │ creates │   Module    │
└─────────────┘         └──────┬──────┘
                               │ creates
                               ▼
                         ┌─────────────┐
                         │    Tasks    │
                         │   Module    │
                         └─────────────┘
```

## Extension Points
1. **New Modules**: Добавить в `.specify/specs/` через spec-kit
2. **Integrations**: Через отдельный модуль с контрактом
3. **UI Themes**: Конфигурация в отдельном файле

---
**Version**: 1.0.0 | **Created**: 2026-03-13 | **Last Updated**: 2026-03-13
