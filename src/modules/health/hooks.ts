/**
 * Health Module Hooks
 */

'use client';

import { useEffect, useState } from 'react';
import type {
  SleepLog,
  WeightLog,
  Vitamin,
  VitaminLog,
  HealthMetric,
  LabTest,
  LabResult,
  SleepStats,
  WeightStats,
} from './types';
import * as healthService from './services';

/**
 * Hook для записей сна
 */
export function useSleepLogs(startDate?: number, endDate?: number) {
  const [data, setData] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getSleepLogs(startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для статистики сна
 */
export function useSleepStats(startDate?: number, endDate?: number) {
  const [data, setData] = useState<SleepStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getSleepStats(startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для записей веса
 */
export function useWeightLogs(startDate?: number, endDate?: number) {
  const [data, setData] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getWeightLogs(startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для статистики веса
 */
export function useWeightStats() {
  const [data, setData] = useState<WeightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getWeightStats()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для последнего веса
 */
export function useLatestWeight() {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getLatestWeight()
      .then(setWeight)
      .catch((err) => setError(err.message));
  }, []);

  return { weight, loading, error };
}

/**
 * Hook для витаминов
 */
export function useVitamins() {
  const [data, setData] = useState<Vitamin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getVitamins()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для записей приёма витаминов
 */
export function useVitaminLogs(vitaminId: string, startDate?: number, endDate?: number) {
  const [data, setData] = useState<VitaminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getVitaminLogs(vitaminId, startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [vitaminId, startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для метрик здоровья
 */
export function useHealthMetrics(
  metricType: HealthMetric['metric_type'],
  startDate?: number,
  endDate?: number
) {
  const [data, setData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getHealthMetrics(metricType, startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [metricType, startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для последнего пульса
 */
export function useLatestHeartRate() {
  const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getLatestHeartRate()
      .then(setHeartRate)
      .catch((err) => setError(err.message));
  }, []);

  return { heartRate, loading, error };
}

/**
 * Hook для лабораторных тестов
 */
export function useLabTests() {
  const [data, setData] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getLabTests()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для результатов лабораторного теста
 */
export function useLabResults(testId: string) {
  const [data, setData] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .getLabResults(testId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [testId]);

  return { data, loading, error };
}
