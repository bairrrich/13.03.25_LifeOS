# Tech Context

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **Dexie.js** | 4.x | IndexedDB wrapper |

### UI & Styling

| Library | Version | Purpose |
|---------|---------|---------|
| shadcn/ui | latest | Component primitives |
| Radix UI | latest | Accessible components |
| Lucide React | 0.577.0 | Icons |
| class-variance-authority | 0.7.1 | Component variants |
| clsx | 2.1.1 | Class name utility |
| tailwind-merge | 3.5.0 | Tailwind class merging |
| next-themes | 0.4.6 | Theme management |

### Development

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 9.x | Linting |
| Prettier | 3.8.1 | Formatting |
| Husky | 9.1.7 | Git hooks |
| lint-staged | 16.3.3 | Staged file linting |
| commitlint | 20.4.4 | Commit message linting |

### i18n

| Library | Version | Purpose |
|---------|---------|---------|
| next-i18next | 15.4.3 | Internationalization |
| i18next | 25.x | i18n core |
| react-i18next | 16.x | React i18n |

## Project Structure

```
c:\CODE\13.03.26_LifeOS\
├── .husky/                    # Git hooks
├── .project/                  # Проектная документация
├── .qwen/                     # Qwen Code настройки
├── .specify/                  # Spec-kit Memory Bank
│   └── memory-bank/           # AI контекст
│       ├── activeContext.md
│       ├── progress.md
│       ├── projectBrief.md
│       ├── productContext.md
│       ├── systemPatterns.md
│       ├── techContext.md
│       └── README.md
├── public/
│   └── locales/               # i18n переводы
│       ├── ru/common.json
│       └── en/common.json
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── core/                  # Ядро платформы
│   │   ├── entity/
│   │   ├── database/
│   │   ├── crud/
│   │   ├── query/
│   │   ├── events/
│   │   └── sync/
│   ├── modules/               # Бизнес-модули
│   │   ├── finance/
│   │   ├── habits/
│   │   ├── nutrition/
│   │   ├── workouts/
│   │   ├── health/
│   │   ├── goals/
│   │   ├── mind/
│   │   └── beauty/
│   ├── ui/                    # UI компоненты
│   │   ├── components/
│   │   └── layout/
│   └── shared/                # Общие утилиты
│       ├── lib/
│       └── types/
├── .eslintrc.json
├── .gitignore
├── .lintstagedrc
├── .prettierrc
├── commitlint.config.js
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Color System

### OKLCH Color Space
Все цвета заданы в OKLCH для перцептивной равномерности.

#### Light Theme
```css
--background: oklch(0.985 0.002 250);
--foreground: oklch(0.2 0.01 250);
--primary: oklch(0.55 0.12 260);
--secondary: oklch(0.94 0.005 250);
--muted: oklch(0.94 0.003 250);
--accent: oklch(0.9 0.05 280);
--destructive: oklch(0.57 0.18 25);
--border: oklch(0.88 0.005 250);
--ring: oklch(0.55 0.12 260);
```

#### Dark Theme
```css
--background: oklch(0.18 0.008 250);
--foreground: oklch(0.92 0.005 250);
--primary: oklch(0.65 0.14 260);
--secondary: oklch(0.28 0.01 250);
--muted: oklch(0.28 0.01 250);
--accent: oklch(0.32 0.05 280);
--destructive: oklch(0.65 0.18 25);
--border: oklch(0.32 0.01 250);
--ring: oklch(0.65 0.14 260);
```

#### High Contrast
```css
--background: oklch(1 0 0);
--foreground: oklch(0 0 0);
--primary: oklch(0.4 0.15 260);
--border: oklch(0 0 0);
```

## Database Schema

### Dexie.js Configuration
```typescript
db.version(1).stores({
  // Finance
  transactions: 'id,user_id,account_id,category_id,date,type,sync_status,deleted_at',
  accounts: 'id,user_id,type,sync_status,deleted_at',
  categories: 'id,user_id,type,parent_id,sync_status,deleted_at',
  budgets: 'id,user_id,category_id,period,sync_status,deleted_at',

  // Habits
  habits: 'id,user_id,frequency,sync_status,deleted_at',
  habit_logs: 'id,user_id,habit_id,date,sync_status,deleted_at',

  // Nutrition
  foods: 'id,user_id,name,sync_status,deleted_at',
  meals: 'id,user_id,date,type,sync_status,deleted_at',
  meal_entries: 'id,user_id,meal_id,food_id,sync_status,deleted_at',

  // Workouts
  exercises: 'id,user_id,name,muscle_group,sync_status,deleted_at',
  workouts: 'id,user_id,date,sync_status,deleted_at',
  sets: 'id,user_id,workout_id,exercise_id,sync_status,deleted_at',

  // Health
  sleep_logs: 'id,user_id,date,sync_status,deleted_at',
  weight_logs: 'id,user_id,date,sync_status,deleted_at',
  vitamins: 'id,user_id,name,sync_status,deleted_at',
  vitamin_logs: 'id,user_id,vitamin_id,date,taken,sync_status,deleted_at',
  health_metrics: 'id,user_id,metric_type,date,sync_status,deleted_at',
  lab_tests: 'id,user_id,date,sync_status,deleted_at',
  lab_results: 'id,user_id,test_id,marker,sync_status,deleted_at',

  // Goals
  goals: 'id,user_id,type,status,sync_status,deleted_at',
  goal_milestones: 'id,user_id,goal_id,completed,sync_status,deleted_at',
  goal_progress: 'id,user_id,goal_id,date,sync_status,deleted_at',

  // Mind
  books: 'id,user_id,status,author,sync_status,deleted_at',
  reading_logs: 'id,user_id,book_id,date,sync_status,deleted_at',
  movies: 'id,user_id,watched,sync_status,deleted_at',
  courses: 'id,user_id,status,sync_status,deleted_at',
  notes: 'id,user_id,sync_status,deleted_at',
  ideas: 'id,user_id,status,sync_status,deleted_at',

  // Beauty
  cosmetics: 'id,user_id,category,expiration_date,sync_status,deleted_at',
  beauty_routines: 'id,user_id,type,sync_status,deleted_at',
  routine_steps: 'id,user_id,routine_id,step_order,sync_status,deleted_at',
  beauty_logs: 'id,user_id,routine_id,date,sync_status,deleted_at',

  // System
  sync_queue: '++id,entity_type,entity_id,status,created_at',
  devices: 'id,user_id',
  settings: 'key',
});
```

## Build Commands

```bash
# Development
npm run dev          # Next.js dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Quality
npm run lint         # ESLint check
npx prettier --write # Format code

# Git Hooks (automatic)
# pre-commit: lint-staged
# commit-msg: commitlint
```

## Environment Variables

```bash
# No environment variables required for MVP
# Future: Supabase configuration
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Performance Targets

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Security Considerations

- All data stored locally (IndexedDB)
- No server-side processing (MVP)
- Future: Supabase authentication

---

**Last Updated**: 2026-03-13
**Version**: 1.0.0
