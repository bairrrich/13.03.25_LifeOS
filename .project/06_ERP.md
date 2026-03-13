Ниже — **полная ER-архитектура LifeOS** (системы управления жизнью).
Я структурировал её как **production-уровневую схему данных**, которая подходит для:

* **offline-first**
* **модульной архитектуры**
* **Next.js + Dexie + SQLite + Supabase**
* **100+ сущностей**

Я разобью схему на **доменные области**, чтобы её было проще реализовать.

---

# 1. Общая архитектура базы данных

Все сущности наследуют **BaseEntity**.

```
BaseEntity
```

Общие поля:

```
id
user_id
created_at
updated_at
deleted_at
version
sync_status
metadata
tags
notes
```

---

# 2. Глобальные таблицы системы

Это **ядро платформы**.

```
users
devices
sessions
```

---

## Пользователи

```
users
```

поля

```
id
email
name
avatar
timezone
created_at
```

---

## Устройства

```
devices
```

```
id
user_id
device_name
platform
last_sync
```

---

## Сессии

```
sessions
```

```
id
user_id
device_id
created_at
expires_at
```

---

# 3. Универсальная система сущностей

```
entities
```

используется для:

* универсального поиска
* sync
* audit

```
entities
```

```
id
entity_type
entity_id
user_id
created_at
updated_at
```

---

# 4. Система вложений

```
attachments
```

```
id
entity_type
entity_id
url
type
size
created_at
```

---

# 5. Relations (универсальные связи)

```
relations
```

```
id
entity_a_type
entity_a_id
entity_b_type
entity_b_id
relation_type
```

Пример:

```
Workout → Exercise
Recipe → Food
Goal → Habit
```

---

# 6. Activity / History

```
activity_log
```

```
id
user_id
entity_type
entity_id
action
payload
created_at
```

---

# 7. Finance Module ER

### Accounts

```
accounts
```

```
id
user_id
name
type
currency
balance
```

---

### Transactions

```
transactions
```

```
id
account_id
category_id
amount
currency
date
type
description
```

---

### Categories

```
categories
```

```
id
user_id
name
type
parent_id
```

---

### Budgets

```
budgets
```

```
id
user_id
category_id
amount
period
start_date
end_date
```

---

### Subscriptions

```
subscriptions
```

```
id
user_id
name
amount
currency
billing_cycle
next_payment
```

---

### Investments

```
investments
```

```
id
user_id
asset_name
asset_type
quantity
price
```

---

### Net Worth

```
assets
liabilities
```

---

# 8. Nutrition Module ER

### Foods

```
foods
```

```
id
name
brand
calories
protein
fat
carbs
fiber
```

---

### Recipes

```
recipes
```

```
id
user_id
name
servings
instructions
```

---

### Recipe Ingredients

```
recipe_ingredients
```

```
id
recipe_id
food_id
quantity
unit
```

---

### Meals

```
meals
```

```
id
user_id
name
date
type
```

---

### Meal Entries

```
meal_entries
```

```
id
meal_id
food_id
quantity
```

---

### Nutrition Goals

```
nutrition_goals
```

```
id
user_id
calories_target
protein_target
fat_target
carbs_target
```

---

# 9. Workouts Module ER

### Exercises

```
exercises
```

```
id
name
muscle_group
equipment
difficulty
```

---

### Workouts

```
workouts
```

```
id
user_id
name
date
duration
```

---

### Sets

```
sets
```

```
id
workout_id
exercise_id
reps
weight
duration
distance
```

---

### Programs

```
training_programs
```

```
id
user_id
name
duration_weeks
```

---

### Program Workouts

```
program_workouts
```

```
id
program_id
workout_id
day
```

---

# 10. Health Module ER

### Sleep

```
sleep_logs
```

```
id
user_id
start_time
end_time
quality
```

---

### Weight

```
weight_logs
```

```
id
user_id
weight
date
```

---

### Health Metrics

```
health_metrics
```

```
id
user_id
metric_type
value
date
```

---

### Vitamins

```
vitamins
```

```
id
name
dosage
unit
```

---

### Vitamin Logs

```
vitamin_logs
```

```
id
vitamin_id
date
taken
```

---

### Lab Tests

```
lab_tests
```

```
id
user_id
test_name
date
```

---

### Lab Results

```
lab_results
```

```
id
test_id
marker
value
unit
range_min
range_max
```

---

# 11. Habits Module ER

### Habits

```
habits
```

```
id
user_id
name
frequency
target
color
icon
```

---

### Habit Logs

```
habit_logs
```

```
id
habit_id
date
completed
```

---

### Habit Streaks

```
habit_streaks
```

```
id
habit_id
current_streak
best_streak
```

---

# 12. Goals Module ER

### Goals

```
goals
```

```
id
user_id
name
type
target_value
deadline
```

---

### Goal Milestones

```
goal_milestones
```

```
id
goal_id
name
target_date
completed
```

---

### Goal Progress

```
goal_progress
```

```
id
goal_id
value
date
```

---

# 13. Mind Module ER

### Books

```
books
```

```
id
title
author
pages
```

---

### Reading Logs

```
reading_logs
```

```
id
book_id
date
pages_read
```

---

### Quotes

```
quotes
```

```
id
book_id
text
page
```

---

### Movies

```
movies
```

```
id
title
year
genre
rating
```

---

### Courses

```
courses
```

```
id
title
provider
progress
```

---

### Notes

```
notes
```

```
id
entity_type
entity_id
content
```

---

# 14. Beauty Module ER

### Cosmetics

```
cosmetics
```

```
id
name
brand
category
expiration_date
opened_at
```

---

### Beauty Routines

```
beauty_routines
```

```
id
user_id
name
type
```

---

### Routine Steps

```
routine_steps
```

```
id
routine_id
cosmetic_id
step_order
```

---

### Beauty Logs

```
beauty_logs
```

```
id
routine_id
date
completed
```

---

# 15. Notifications

```
notifications
```

```
id
user_id
type
title
message
read
created_at
```

---

# 16. Reminders

```
reminders
```

```
id
user_id
entity_type
entity_id
time
repeat
```

---

# 17. Search Index

```
search_index
```

```
id
entity_type
entity_id
title
content
tags
```

---

# 18. Analytics Tables

```
analytics_daily
analytics_weekly
analytics_monthly
```

---

# 19. Итоговый размер базы

LifeOS включает примерно:

```
Core           10
Finance        15
Nutrition      10
Workouts       10
Health         12
Habits         5
Goals          5
Mind           8
Beauty         6
System         8
```

Итого:

```
~90–120 таблиц
```

---

# 20. Высокоуровневая ER-диаграмма

```
User
 │
 ├ Accounts ── Transactions ── Categories
 │
 ├ Meals ── MealEntries ── Foods
 │
 ├ Workouts ── Sets ── Exercises
 │
 ├ Habits ── HabitLogs
 │
 ├ Goals ── GoalProgress
 │
 ├ SleepLogs
 │
 ├ Books ── ReadingLogs
 │
 └ BeautyRoutines ── Cosmetics
```

---