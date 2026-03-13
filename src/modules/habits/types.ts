/**
 * Habits Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Привычка
 */
export interface Habit extends BaseEntity {
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  color?: string;
  icon?: string;
  description?: string;
}

/**
 * Запись выполнения привычки
 */
export interface HabitLog extends BaseEntity {
  habit_id: string;
  date: number;
  completed: boolean;
  value?: number;
  note?: string;
}

/**
 * Статистика привычки
 */
export interface HabitStats {
  habit_id: string;
  current_streak: number;
  best_streak: number;
  total_completed: number;
  total_missed: number;
  completion_rate: number;
  last_completed?: number;
}

/**
 * Частота привычки
 */
export type HabitFrequency = Habit['frequency'];
