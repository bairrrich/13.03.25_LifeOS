# LifeOS Constitution

## Core Principles

### I. Spec-Driven Development
Все функции начинаются со спецификации. Spec-kit используется для:
- Создания функциональных спецификаций перед реализацией
- Планирования работ через задачи
- Документирования архитектурных решений

### II. Quality First
- TDD обязательный для новой функциональности
- Integration тесты для критических путей
- Код ревью через spec-kit анализ

### III. Simplicity (YAGNI)
- Начинать с простого решения
- Не добавлять сложность без необходимости
- Рефакторинг перед добавлением новой функциональности

### IV. Documentation
- Вся документация в `.specify/specs/`
- Spec-kit slash команды для генерации документации
- Constitution обновляется при изменении принципов

## Development Workflow

1. **Specification**: `/speckit.specify` → `spec.md`
2. **Clarify**: `/speckit.clarify` (опционально)
3. **Plan**: `/speckit.plan` → `plan.md`
4. **Tasks**: `/speckit.tasks` → `tasks.md`
5. **Implement**: `/speckit.implement`
6. **Analyze**: `/speckit.analyze` (опционально)
7. **Checklist**: `/speckit.checklist` (опционально)

## Governance

Constitution имеет приоритет над всеми другими практиками.
Изменения требуют документирования и одобрения.

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
