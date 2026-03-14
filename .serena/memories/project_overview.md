# Project Overview: LifeOS

## Purpose
LifeOS is a personal life management dashboard built with Next.js 16 and React 19.
It provides modules for tracking finance, habits, nutrition, workouts, health, goals, mind, and beauty.

## Tech Stack
- **Frontend:** Next.js 16.1.6, React 19.2.3, TypeScript 5.x
- **Styling:** Tailwind CSS 4.x, Radix UI components
- **Database:** Dexie.js (IndexedDB wrapper)
- **i18n:** next-i18next, react-i18next
- **Theme:** next-themes

## Project Structure
```
src/
├── core/           # Core utilities (database, query engine, events, sync)
├── modules/        # Feature modules (finance, habits, nutrition, etc.)
├── shared/         # Shared utilities, hooks, types
└── ui/             # UI components and layout
```

## Module Structure
Each module contains:
- `types.ts` — TypeScript types
- `services.ts` — Business logic
- `hooks.ts` — React hooks
- `index.ts` — Exports
