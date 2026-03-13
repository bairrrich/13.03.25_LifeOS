/**
 * Workouts Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Упражнение
 */
export interface Exercise extends BaseEntity {
  name: string;
  muscle_group?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string;
}

/**
 * Тренировка
 */
export interface Workout extends BaseEntity {
  name: string;
  date: number;
  duration?: number; // в минутах
  type?: string;
  notes?: string;
}

/**
 * Подход (сет)
 */
export interface Set extends BaseEntity {
  workout_id: string;
  exercise_id: string;
  reps?: number;
  weight?: number;
  duration?: number; // в секундах
  distance?: number; // в метрах
  order: number;
}

/**
 * Типы тренировок
 */
export type WorkoutType = 'strength' | 'cardio' | 'yoga' | 'stretching' | 'hiit' | string;

/**
 * Группы мышц
 */
export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'glutes'
  | 'abs'
  | 'forearms'
  | 'traps'
  | 'lats'
  | 'full_body';

/**
 * Статистика упражнения
 */
export interface ExerciseStats {
  exercise_id: string;
  total_workouts: number;
  total_sets: number;
  max_weight: number;
  max_reps: number;
  last_performed?: number;
}

/**
 * Статистика тренировки
 */
export interface WorkoutStats {
  workout_id: string;
  total_exercises: number;
  total_sets: number;
  total_volume: number; // weight * reps
  duration?: number;
}
