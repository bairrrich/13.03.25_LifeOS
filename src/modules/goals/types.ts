/**
 * Goals Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Цель
 */
export interface Goal extends BaseEntity {
  name: string;
  type: 'finance' | 'health' | 'learning' | 'personal';
  target_value?: number;
  current_value?: number;
  deadline?: number;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
}

/**
 * Шаг цели (milestone)
 */
export interface GoalMilestone extends BaseEntity {
  goal_id: string;
  name: string;
  target_value?: number;
  target_date?: number;
  completed: boolean;
  completed_at?: number;
}

/**
 * Прогресс цели
 */
export interface GoalProgress extends BaseEntity {
  goal_id: string;
  value: number;
  date: number;
  note?: string;
}

/**
 * Статистика цели
 */
export interface GoalStats {
  goal_id: string;
  progress_percent: number;
  days_remaining?: number;
  on_track: boolean;
  milestones_completed: number;
  milestones_total: number;
}

/**
 * Тип цели
 */
export type GoalType = Goal['type'];

/**
 * Статус цели
 */
export type GoalStatus = Goal['status'];
