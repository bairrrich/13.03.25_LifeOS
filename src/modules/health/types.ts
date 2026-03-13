/**
 * Health Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Запись сна
 */
export interface SleepLog extends BaseEntity {
  date: number;
  start_time: number;
  end_time: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
}

/**
 * Запись веса
 */
export interface WeightLog extends BaseEntity {
  date: number;
  weight: number;
  body_fat?: number;
  notes?: string;
}

/**
 * Витамин/добавка
 */
export interface Vitamin extends BaseEntity {
  name: string;
  dosage?: number;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'as_needed';
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'any';
  notes?: string;
}

/**
 * Запись приёма витамина
 */
export interface VitaminLog extends BaseEntity {
  vitamin_id: string;
  date: number;
  taken: boolean;
  time_taken?: number;
  notes?: string;
}

/**
 * Здоровье метрики (давление, пульс и т.д.)
 */
export interface HealthMetric extends BaseEntity {
  metric_type: 'heart_rate' | 'blood_pressure' | 'temperature' | 'stress' | 'energy';
  value: number;
  value2?: number; // Для давления (систолическое/диастолическое)
  unit?: string;
  date: number;
  notes?: string;
}

/**
 * Лабораторный тест
 */
export interface LabTest extends BaseEntity {
  name: string;
  date: number;
  lab_name?: string;
  notes?: string;
}

/**
 * Результат лабораторного теста
 */
export interface LabResult extends BaseEntity {
  test_id: string;
  marker: string;
  value: number;
  unit?: string;
  range_min?: number;
  range_max?: number;
  flag?: 'low' | 'normal' | 'high';
}

/**
 * Статистика сна
 */
export interface SleepStats {
  average_duration: number; // в часах
  average_quality: number;
  total_nights: number;
  best_duration: number;
  worst_duration: number;
}

/**
 * Статистика веса
 */
export interface WeightStats {
  current_weight: number;
  start_weight: number;
  min_weight: number;
  max_weight: number;
  change: number;
}
