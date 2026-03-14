/**
 * Типы для Dexie базы данных
 */
import type { Table } from 'dexie';
import type { BaseEntity } from '@/shared/types';
import type { EntityConfig } from '@/core/entity';
import type { AutomationRule, AutomationLog } from '@/core/automation/types';

/**
 * Интерфейс для всех таблиц базы данных
 * Каждая таблица расширяет BaseEntity
 */
export interface LifeOSDB {
  // Finance
  transactions: Table<BaseEntity & {
    account_id: string;
    category_id: string;
    amount: number;
    currency: string;
    type: 'expense' | 'income' | 'transfer';
    date: number;
    description?: string;
  }>;

  accounts: Table<BaseEntity & {
    name: string;
    type: 'cash' | 'bank' | 'card' | 'investment';
    currency: string;
    balance: number;
    icon?: string;
    color?: string;
  }>;

  categories: Table<BaseEntity & {
    name: string;
    type: 'income' | 'expense';
    parent_id?: string;
    icon?: string;
    color?: string;
  }>;

  budgets: Table<BaseEntity & {
    name: string;
    category_id: string;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    start_date: number;
    end_date?: number;
  }>;

  // Habits
  habits: Table<BaseEntity & {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    target: number;
    color?: string;
    icon?: string;
    description?: string;
  }>;

  habit_logs: Table<BaseEntity & {
    habit_id: string;
    date: number;
    completed: boolean;
    value?: number;
    note?: string;
  }>;

  // Nutrition
  foods: Table<BaseEntity & {
    name: string;
    calories: number;
    protein?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
    brand?: string;
    serving_size?: number;
    serving_unit?: string;
  }>;

  meals: Table<BaseEntity & {
    name: string;
    date: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }>;

  meal_entries: Table<BaseEntity & {
    meal_id: string;
    food_id: string;
    quantity: number;
    unit?: string;
  }>;

  // Workouts
  exercises: Table<BaseEntity & {
    name: string;
    muscle_group?: string;
    equipment?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    instructions?: string;
  }>;

  workouts: Table<BaseEntity & {
    name: string;
    date: number;
    duration?: number;
    type?: string;
    notes?: string;
  }>;

  sets: Table<BaseEntity & {
    workout_id: string;
    exercise_id: string;
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    order: number;
  }>;

  // Health
  sleep_logs: Table<BaseEntity & {
    date: number;
    start_time: number;
    end_time: number;
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
    notes?: string;
  }>;

  weight_logs: Table<BaseEntity & {
    date: number;
    weight: number;
    body_fat?: number;
    notes?: string;
  }>;

  vitamins: Table<BaseEntity & {
    name: string;
    dosage?: number;
    unit?: string;
    frequency?: string;
    time_of_day?: string;
    notes?: string;
  }>;

  vitamin_logs: Table<BaseEntity & {
    vitamin_id: string;
    date: number;
    taken: boolean;
    time_taken?: number;
    notes?: string;
  }>;

  health_metrics: Table<BaseEntity & {
    metric_type: string;
    value: number;
    value2?: number;
    unit?: string;
    date: number;
    notes?: string;
  }>;

  lab_tests: Table<BaseEntity & {
    name: string;
    date: number;
    lab_name?: string;
    notes?: string;
  }>;

  lab_results: Table<BaseEntity & {
    test_id: string;
    marker: string;
    value: number;
    unit?: string;
    range_min?: number;
    range_max?: number;
    flag?: string;
  }>;

  // Goals
  goals: Table<BaseEntity & {
    name: string;
    type: 'finance' | 'health' | 'learning' | 'personal';
    target_value?: number;
    current_value?: number;
    deadline?: number;
    description?: string;
    status: 'active' | 'completed' | 'paused' | 'abandoned';
  }>;

  goal_milestones: Table<BaseEntity & {
    goal_id: string;
    name: string;
    target_value?: number;
    target_date?: number;
    completed: boolean;
    completed_at?: number;
  }>;

  goal_progress: Table<BaseEntity & {
    goal_id: string;
    value: number;
    date: number;
    note?: string;
  }>;

  // Mind
  books: Table<BaseEntity & {
    title: string;
    author?: string;
    pages?: number;
    current_page?: number;
    status: string;
    rating?: number;
    cover_url?: string;
    notes?: string;
  }>;

  reading_logs: Table<BaseEntity & {
    book_id: string;
    date: number;
    pages_read: number;
    duration?: number;
    notes?: string;
  }>;

  movies: Table<BaseEntity & {
    title: string;
    year?: number;
    genre?: string;
    rating?: number;
    watched: boolean;
    watched_at?: number;
    notes?: string;
  }>;

  courses: Table<BaseEntity & {
    title: string;
    provider?: string;
    url?: string;
    progress: number;
    status: string;
    started_at?: number;
    completed_at?: number;
    notes?: string;
  }>;

  notes: Table<BaseEntity & {
    title: string;
    content: string;
    tags?: string[];
    parent_id?: string;
  }>;

  ideas: Table<BaseEntity & {
    title: string;
    description?: string;
    category?: string;
    status: string;
    tags?: string[];
  }>;

  // Beauty
  cosmetics: Table<BaseEntity & {
    name: string;
    brand?: string;
    category: string;
    expiration_date?: number;
    opened_at?: number;
    notes?: string;
    price?: number;
    size?: number;
    size_unit?: string;
  }>;

  beauty_routines: Table<BaseEntity & {
    name: string;
    type: string;
    description?: string;
  }>;

  routine_steps: Table<BaseEntity & {
    routine_id: string;
    cosmetic_id?: string;
    step_order: number;
    name: string;
    description?: string;
    duration?: number;
  }>;

  beauty_logs: Table<BaseEntity & {
    routine_id: string;
    date: number;
    completed: boolean;
    notes?: string;
  }>;

  // Automation tables
  automation_rules: Table<AutomationRule>;

  automation_logs: Table<AutomationLog>;

  // System tables
  sync_queue: Table<SyncQueueItem>;

  devices: Table<Device>;

  settings: Table<Setting>;
}

/**
 * Элемент очереди синхронизации
 */
export interface SyncQueueItem {
  id?: number;
  entity_type: string;
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  created_at: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
  retry_count: number;
}

/**
 * Устройство пользователя
 */
export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  platform: 'web' | 'ios' | 'android' | 'desktop';
  last_sync: number;
  created_at: number;
}

/**
 * Настройка пользователя
 */
export interface Setting {
  key: string;
  value: unknown;
  updated_at: number;
}

/**
 * Типы всех сущностей для динамического доступа
 */
export type EntityTables = LifeOSDB[keyof LifeOSDB];

/**
 * Тип имени таблицы
 */
export type TableName = keyof LifeOSDB;
