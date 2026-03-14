# LifeOS Memory Bank

## 📋 Project Overview

**LifeOS** — Personal life management system for tracking and improving all aspects of life.

### Core Modules
- **Finance** — Complete financial tracking (accounts, transactions, budgets)
- **Nutrition** — Food tracking and macro counting
- **Workouts** — Workout planning and tracking
- **Health** — Sleep, weight, vitamins, health metrics
- **Mind** — Books, movies, courses, notes
- **Beauty** — Cosmetics and beauty routines
- **Habits** — Habit formation and tracking
- **Goals** — Long-term goals with progress tracking

---

## 🏗️ Architecture

### Technology Stack
- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Database:** Dexie.js (IndexedDB) — offline-first
- **i18n:** next-i18next (ru/en)
- **Charts:** Recharts

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard
│   ├── finance/            # Finance module
│   ├── habits/             # Habits module
│   ├── nutrition/          # Nutrition module
│   ├── workouts/           # Workouts module
│   ├── health/             # Health module
│   ├── goals/              # Goals module
│   ├── mind/               # Mind module
│   ├── beauty/             # Beauty module
│   └── settings/           # Settings page
├── core/                   # Core systems
│   ├── entity/             # Entity System
│   ├── database/           # Database Layer (Dexie)
│   ├── crud/               # CRUD Engine
│   ├── query/              # Query Engine
│   ├── events/             # Event System
│   └── sync/               # Sync Engine
├── modules/                # Business modules
│   ├── finance/
│   ├── habits/
│   ├── nutrition/
│   ├── workouts/
│   ├── health/
│   ├── goals/
│   ├── mind/
│   └── beauty/
├── ui/                     # UI components
│   ├── components/         # Reusable components
│   └── layout/             # Layout components
└── shared/                 # Shared utilities
    ├── lib/                # Utilities (i18n, cn, etc.)
    └── types/              # Shared types
```

---

## 📊 Current Status

### ✅ Completed (100%)

**Phase 0: Infrastructure**
- [x] Next.js 16 project setup
- [x] Tailwind CSS v4 + OKLCH colors
- [x] Theme system (light/dark/high-contrast)
- [x] ESLint + Prettier + Husky
- [x] i18n (ru/en) with 386+ keys
- [x] Language persistence

**Phase 1: Core Systems**
- [x] Entity System (20+ entities)
- [x] Database Layer (40+ tables)
- [x] CRUD Engine
- [x] Query Engine
- [x] Event System
- [x] Sync Engine

**Phase 2: UI Components**
- [x] 10+ UI components (Button, Card, Badge, etc.)
- [x] AppLayout with navigation
- [x] ThemeSwitcher
- [x] LanguageSwitcher
- [x] CommandPalette (⌘K)
- [x] GlobalSearch
- [x] LocaleSync

**Phase 3: Business Modules**
- [x] Finance (Transactions, Accounts, Budgets, Categories)
- [x] Habits (Tracking, Calendar, Streak)
- [x] Nutrition (Meals, Foods, Macros)
- [x] Workouts (Exercises, Sets, Volume)
- [x] Health (Sleep, Weight, Metrics)
- [x] Goals (Tracking, Progress)
- [x] Mind (Books, Movies)
- [x] Beauty (Cosmetics, Routines)

**Phase 4: Dashboard**
- [x] Daily summary widgets (9 cards)
- [x] Charts (Recharts integration)
- [x] Weekly/Monthly toggle
- [x] Quick actions

**Phase 5: Automation System**
- [x] Automation Engine (rule engine, triggers, conditions, actions)
- [x] Scheduler (cron, condition checking)
- [x] Automation Service (CRUD, persistence)
- [x] Event Integration
- [x] UI Components (rule card, form, list, logs table, stats)
- [x] Automation Page (/automation)
- [x] Full localization (RU/EN)

**Phase 6: Notifications System**
- [x] Notification Service (queue, settings, persistence)
- [x] Toast Component (4 types, animations)
- [x] Notification Center (dropdown panel)
- [x] Desktop Notifications
- [x] Sound Notifications
- [x] Templates (finance, habits, goals, automation)
- [x] Full localization (RU/EN)

**Phase 7: Unit Tests**
- [x] Jest + React Testing Library setup
- [x] Notification Service tests (23 tests)
- [x] Automation Engine tests (29 tests)
- [x] Toast Component tests (10 tests)
- [x] Testing documentation

### 🔄 In Progress
- [ ] Integration Tests (Playwright)
- [ ] AI Assistant
- [ ] PWA Support
- [ ] Data Export/Import

---

## 🎨 Design System

### Color Scheme (OKLCH)
All colors use OKLCH color space for perceptual uniformity.

**Light Theme:**
```css
--background: oklch(0.985 0.002 250);
--foreground: oklch(0.2 0.01 250);
--primary: oklch(0.55 0.12 260);
```

**Dark Theme:**
```css
--background: oklch(0.18 0.008 250);
--foreground: oklch(0.92 0.005 250);
--primary: oklch(0.65 0.14 260);
```

**High Contrast:**
```css
--background: oklch(1 0 0);
--foreground: oklch(0 0 0);
```

### Themes
- Light (default)
- Dark
- High Contrast
- System (auto)

---

## 🌐 Internationalization

### Supported Languages
- **ru** — Russian 
- **en** — English (default)

### Translation Keys: 386+
- common: 40 keys
- nav: 10 keys
- dashboard: 38 keys
- finance: 52 keys
- habits: 18 keys
- nutrition: 20 keys
- workouts: 22 keys
- health: 24 keys
- goals: 17 keys
- mind: 19 keys
- beauty: 22 keys
- theme: 4 keys
- language: 3 keys
- errors: 10 keys
- validation: 7 keys
- commandPalette: 4 keys
- globalSearch: 3 keys
- settings: 13 keys
- units: 9 keys

### Language Persistence
- Stored in localStorage (`lifeos-locale`)
- Synced across all pages
- HTML lang attribute updates automatically
- Survives page refresh and navigation

---

## 📦 Database Schema

### Core Tables (40+)
- `transactions`, `accounts`, `categories`, `budgets`
- `habits`, `habit_logs`
- `foods`, `meals`, `meal_entries`
- `exercises`, `workouts`, `sets`
- `sleep_logs`, `weight_logs`, `vitamins`, `health_metrics`
- `goals`, `goal_milestones`, `goal_progress`
- `books`, `movies`, `courses`, `notes`, `ideas`
- `cosmetics`, `beauty_routines`, `routine_steps`
- `sync_queue`, `devices`, `settings`

### BaseEntity Interface
All entities inherit:
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

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open Command Palette |
| `↑` `↓` | Navigate results |
| `Enter` | Select result |
| `Escape` | Close |

---

## 📱 Mobile Navigation

**Bottom Nav (5 buttons):**
1. 📊 Dashboard
2. 💰 Finance
3. 🍽️ Nutrition
4. 💪 Workouts
5. ⋮ More (dropdown)
   - Health
   - Habits
   - Goals
   - Mind
   - Beauty
   - Settings

---

## 🚀 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:ci      # CI mode
```

---

## 📈 Metrics

- **Pages:** 21+
- **UI Components:** 25+
- **CRUD Operations:** 32+
- **Translation Keys:** 500+
- **Database Tables:** 42+
- **Business Modules:** 8
- **Core Systems:** 8 (Entity, Database, CRUD, Query, Events, Sync, Automation, Notifications)
- **Test Suites:** 3
- **Unit Tests:** 62
- **Test Coverage:** 62+ tests passing

---

## 🔧 Key Features

### Command Palette (⌘K)
- Quick navigation to all pages
- Quick actions (add transaction, habit, etc.)
- Theme switching
- Language switching

### Global Search
- Search across all modules
- Type-ahead results
- Filter by type
- Instant results

### Automation System
- Create automation rules with triggers, conditions, actions
- Event-based triggers (transaction.created, habit.completed, etc.)
- Schedule triggers (cron expressions)
- 10+ action types (create/update/delete entity, notifications, webhooks)
- Rule priority and cooldown
- Execution logs and statistics

### Notifications System
- Toast notifications (4 types: info, success, warning, error)
- Notification Center in header
- Desktop notifications
- Sound notifications
- Notification templates
- Settings persistence

### Settings
- Theme selection (light/dark/system)
- Language selection (RU/EN)
- Week start day (Monday/Sunday/Saturday)
- Data management

---

## 📝 Recent Updates

### 2026-03-14
- ✅ Full i18n localization (RU/EN)
- ✅ Language persistence across pages
- ✅ HTML lang attribute sync
- ✅ Settings page language button sync
- ✅ All units localized (€, kcal, kg, g, etc.)
- ✅ Command Palette implemented
- ✅ Global Search implemented
- ✅ Mobile navigation with More button
- ✅ All module pages completed

### 2026-03-14 (continued)
- ✅ Automation System fully implemented
- ✅ Notifications System fully implemented
- ✅ Unit Tests setup (Jest + RTL)
- ✅ 62 unit tests passing
- ✅ Testing documentation created

---

## 🎯 Next Steps

### High Priority
1. [ ] Integration Tests (Playwright)
2. [ ] AI Assistant (analysis & recommendations)
3. [ ] PWA Support

### Medium Priority
4. [ ] Data Export/Import
5. [ ] Analytics Dashboard
6. [ ] More UI component tests

### Low Priority
7. [ ] Supabase Sync
8. [ ] Push Notifications (Service Worker)
9. [ ] Mobile App (React Native)

---

**Last Updated:** 2026-03-14
**Version:** 0.2.0 (Automation + Notifications + Tests Complete)
