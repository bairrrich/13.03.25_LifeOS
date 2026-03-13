/**
 * Nutrition Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Продукт
 */
export interface Food extends BaseEntity {
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
}

/**
 * Приём пищи
 */
export interface Meal extends BaseEntity {
  name: string;
  date: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

/**
 * Запись приёма пищи (связь meal + food)
 */
export interface MealEntry extends BaseEntity {
  meal_id: string;
  food_id: string;
  quantity: number;
  unit?: string;
}

/**
 * Нутриенты (для расчётов)
 */
export interface Nutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
}

/**
 * Дневная норма нутриентов
 */
export interface DailyGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/**
 * Тип приёма пищи
 */
export type MealType = Meal['type'];
