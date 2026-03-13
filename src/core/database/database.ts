/**
 * Dexie.js база данных для LifeOS
 * Offline-first архитектура с IndexedDB
 */

import Dexie, { type Table } from 'dexie';
import type { LifeOSDB, SyncQueueItem, Device, Setting } from './types';
import type { BaseEntity } from '@/shared/types';

/**
 * Основной класс базы данных
 */
class LifeOSDatabase extends Dexie implements LifeOSDB {
  // Finance tables
  transactions!: Table<BaseEntity & {
    account_id: string;
    category_id: string;
    amount: number;
    currency: string;
    type: 'expense' | 'income' | 'transfer';
    date: number;
    description?: string;
  }>;

  accounts!: Table<BaseEntity & {
    name: string;
    type: 'cash' | 'bank' | 'card' | 'investment';
    currency: string;
    balance: number;
    icon?: string;
    color?: string;
  }>;

  categories!: Table<BaseEntity & {
    name: string;
    type: 'income' | 'expense';
    parent_id?: string;
    icon?: string;
    color?: string;
  }>;

  budgets!: Table<BaseEntity & {
    name: string;
    category_id: string;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    start_date: number;
    end_date?: number;
  }>;

  // Habits tables
  habits!: Table<BaseEntity & {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    target: number;
    color?: string;
    icon?: string;
    description?: string;
  }>;

  habit_logs!: Table<BaseEntity & {
    habit_id: string;
    date: number;
    completed: boolean;
    value?: number;
    note?: string;
  }>;

  // Nutrition tables
  foods!: Table<BaseEntity & {
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

  meals!: Table<BaseEntity & {
    name: string;
    date: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }>;

  meal_entries!: Table<BaseEntity & {
    meal_id: string;
    food_id: string;
    quantity: number;
    unit?: string;
  }>;

  // Workouts tables
  exercises!: Table<BaseEntity & {
    name: string;
    muscle_group?: string;
    equipment?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    instructions?: string;
  }>;

  workouts!: Table<BaseEntity & {
    name: string;
    date: number;
    duration?: number;
    type?: string;
    notes?: string;
  }>;

  sets!: Table<BaseEntity & {
    workout_id: string;
    exercise_id: string;
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    order: number;
  }>;

  // Health tables
  sleep_logs!: Table<BaseEntity & {
    date: number;
    start_time: number;
    end_time: number;
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
    notes?: string;
  }>;

  weight_logs!: Table<BaseEntity & {
    date: number;
    weight: number;
    body_fat?: number;
    notes?: string;
  }>;

  // Health tables (additional)
  vitamins!: Table<BaseEntity & {
    name: string;
    dosage?: number;
    unit?: string;
    frequency?: string;
    time_of_day?: string;
    notes?: string;
  }>;

  vitamin_logs!: Table<BaseEntity & {
    vitamin_id: string;
    date: number;
    taken: boolean;
    time_taken?: number;
    notes?: string;
  }>;

  health_metrics!: Table<BaseEntity & {
    metric_type: string;
    value: number;
    value2?: number;
    unit?: string;
    date: number;
    notes?: string;
  }>;

  lab_tests!: Table<BaseEntity & {
    name: string;
    date: number;
    lab_name?: string;
    notes?: string;
  }>;

  lab_results!: Table<BaseEntity & {
    test_id: string;
    marker: string;
    value: number;
    unit?: string;
    range_min?: number;
    range_max?: number;
    flag?: string;
  }>;

  // Goals tables
  goals!: Table<BaseEntity & {
    name: string;
    type: 'finance' | 'health' | 'learning' | 'personal';
    target_value?: number;
    current_value?: number;
    deadline?: number;
    description?: string;
    status: 'active' | 'completed' | 'paused' | 'abandoned';
  }>;

  goal_milestones!: Table<BaseEntity & {
    goal_id: string;
    name: string;
    target_value?: number;
    target_date?: number;
    completed: boolean;
    completed_at?: number;
  }>;

  goal_progress!: Table<BaseEntity & {
    goal_id: string;
    value: number;
    date: number;
    note?: string;
  }>;

  // Mind tables
  books!: Table<BaseEntity & {
    title: string;
    author?: string;
    pages?: number;
    current_page?: number;
    status: string;
    rating?: number;
    cover_url?: string;
    notes?: string;
  }>;

  reading_logs!: Table<BaseEntity & {
    book_id: string;
    date: number;
    pages_read: number;
    duration?: number;
    notes?: string;
  }>;

  movies!: Table<BaseEntity & {
    title: string;
    year?: number;
    genre?: string;
    rating?: number;
    watched: boolean;
    watched_at?: number;
    notes?: string;
  }>;

  courses!: Table<BaseEntity & {
    title: string;
    provider?: string;
    url?: string;
    progress: number;
    status: string;
    started_at?: number;
    completed_at?: number;
    notes?: string;
  }>;

  notes!: Table<BaseEntity & {
    title: string;
    content: string;
    tags?: string[];
    parent_id?: string;
  }>;

  ideas!: Table<BaseEntity & {
    title: string;
    description?: string;
    category?: string;
    status: string;
    tags?: string[];
  }>;

  // Beauty tables
  cosmetics!: Table<BaseEntity & {
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

  beauty_routines!: Table<BaseEntity & {
    name: string;
    type: string;
    description?: string;
  }>;

  routine_steps!: Table<BaseEntity & {
    routine_id: string;
    cosmetic_id?: string;
    step_order: number;
    name: string;
    description?: string;
    duration?: number;
  }>;

  beauty_logs!: Table<BaseEntity & {
    routine_id: string;
    date: number;
    completed: boolean;
    notes?: string;
  }>;

  // System tables
  sync_queue!: Table<SyncQueueItem>;
  devices!: Table<Device>;
  settings!: Table<Setting>;

  constructor() {
    super('LifeOSDB');

    this.version(1).stores({
      // Finance
      transactions:
        'id,user_id,account_id,category_id,date,type,sync_status,deleted_at',
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

    // Индексы для производительности
    this.version(2).stores({
      // Добавляем составные индексы
      transactions:
        'id,user_id,[account_id+date],[category_id+date],[type+date],sync_status,deleted_at',
      habit_logs:
        'id,user_id,[habit_id+date],[date+completed],sync_status,deleted_at',
      meals: 'id,user_id,[date+type],sync_status,deleted_at',
      workouts: 'id,user_id,date,sync_status,deleted_at',
    });
  }
}

/**
 * Экземпляр базы данных (singleton)
 */
export const db = new LifeOSDatabase();

/**
 * Проверка готовности базы данных
 */
export async function initDatabase(): Promise<void> {
  await db.open();
  console.log('Database initialized:', db.name);
}

/**
 * Очистка базы данных (для разработки)
 */
export async function clearDatabase(): Promise<void> {
  await db.delete();
  await initDatabase();
}

export default db;
