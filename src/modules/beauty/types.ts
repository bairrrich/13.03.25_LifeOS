/**
 * Beauty Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Косметический продукт
 */
export interface Cosmetic extends BaseEntity {
  name: string;
  brand?: string;
  category: 'skincare' | 'haircare' | 'makeup' | 'fragrance' | 'body' | 'other';
  expiration_date?: number;
  opened_at?: number;
  notes?: string;
  price?: number;
  size?: number;
  size_unit?: string;
}

/**
 * Бьюти рутина
 */
export interface BeautyRoutine extends BaseEntity {
  name: string;
  type: 'morning' | 'evening' | 'weekly' | 'custom';
  description?: string;
}

/**
 * Шаг рутины
 */
export interface RoutineStep extends BaseEntity {
  routine_id: string;
  cosmetic_id?: string;
  step_order: number;
  name: string;
  description?: string;
  duration?: number; // в минутах
}

/**
 * Запись выполнения рутины
 */
export interface BeautyLog extends BaseEntity {
  routine_id: string;
  date: number;
  completed: boolean;
  duration?: number;
  notes?: string;
}

/**
 * Тип категории косметики
 */
export type CosmeticCategory = Cosmetic['category'];

/**
 * Тип рутины
 */
export type RoutineType = BeautyRoutine['type'];

/**
 * Статистика рутины
 */
export interface RoutineStats {
  routine_id: string;
  total_times: number;
  completed_times: number;
  completion_rate: number;
  last_completed?: number;
  streak: number;
}
