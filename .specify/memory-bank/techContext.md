# Technology Context

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI библиотека |
| TypeScript | 5.x | Типизация |
| Bootstrap | 5.x | CSS фреймворк |
| Material Design | - | UI/UX принципы |

### Backend (если применимо)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| Express/Fastify | - | API сервер |

### Build & Tooling
| Technology | Version | Purpose |
|------------|---------|---------|
| Vite | 5.x | Сборка |
| ESLint | - | Линтинг |
| Prettier | - | Форматирование |
| Vitest/Jest | - | Тестирование |

### AI & Development
| Technology | Version | Purpose |
|------------|---------|---------|
| Qwen Code | latest | AI ассистент |
| GitHub Spec Kit | 0.2.x | Spec-driven workflow |
| Git | - | Version control |

## Development Environment

### Requirements
- Node.js 20.x или выше
- npm/yarn/pnpm
- Git
- Qwen Code (VS Code extension)

### Setup Commands
```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Запуск тестов
npm test

# Сборка
npm run build
```

## Project Structure
```
LifeOS/
├── .specify/
│   ├── memory-bank/       # Memory Bank файлы
│   │   ├── projectBrief.md
│   │   ├── productContext.md
│   │   ├── systemPatterns.md
│   │   ├── techContext.md
│   │   ├── activeContext.md
│   │   └── progress.md
│   ├── memory/
│   │   └── constitution.md
│   ├── specs/             # Спецификации функций
│   │   └── 001-<feature>/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       └── tasks.md
│   ├── scripts/           # PowerShell скрипты
│   └── templates/         # Шаблоны spec-kit
├── .qwen/
│   └── spec-kit/
│       └── commands/      # Slash команды для Qwen
├── .agents/
│   └── skills/            # Skills для Qwen Code
├── src/
│   ├── components/
│   ├── modules/
│   ├── hooks/
│   └── utils/
├── tests/
└── docs/
```

## Coding Standards

### TypeScript
- Strict mode включён
- Явные типы для всех функций
- Interfaces для публичных API
- Type guards для валидации

### React
- Функциональные компоненты
- Hooks для состояния
- Server Components где возможно
- Suspense для асинхронных операций

### Testing
- TDD: тесты перед реализацией
- Unit тесты для утилит
- Integration тесты для модулей
- E2E для критических путей

### Documentation
- JSDoc для публичных API
- README для модулей
- Spec-kit для функций

## Dependencies

### Core
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x"
}
```

### Dev Dependencies
```json
{
  "@types/react": "^18.x",
  "@types/node": "^20.x",
  "vite": "^5.x",
  "vitest": "^1.x"
}
```

## Constraints

### Performance
- Initial load < 3s
- First Interaction < 100ms
- Lighthouse score > 90

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

### Security
- No sensitive data в localStorage
- CSP headers
- XSS protection

## Known Issues
- [ ] Memory Bank требует ручного обновления
- [ ] Spec-kit workflow может быть медленным для простых задач

## Future Considerations
- Миграция на React 19
- PWA поддержка
- Offline-first архитектура

---
**Version**: 1.0.0 | **Created**: 2026-03-13 | **Last Updated**: 2026-03-13
