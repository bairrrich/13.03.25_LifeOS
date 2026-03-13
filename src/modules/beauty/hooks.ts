/**
 * Beauty Module Hooks
 */

'use client';

import { useEffect, useState } from 'react';
import type { Cosmetic, BeautyRoutine, RoutineStep, BeautyLog, RoutineStats } from './types';
import * as beautyService from './services';

/**
 * Hook для косметики
 */
export function useCosmetics(category?: Cosmetic['category']) {
  const [data, setData] = useState<Cosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getCosmetics(category)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [category]);

  return { data, loading, error };
}

/**
 * Hook для истекающей косметики
 */
export function useExpiringCosmetics(days = 30) {
  const [data, setData] = useState<Cosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getExpiringCosmetics(days)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [days]);

  return { data, loading, error };
}

/**
 * Hook для рутины
 */
export function useBeautyRoutines(type?: BeautyRoutine['type']) {
  const [data, setData] = useState<BeautyRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getBeautyRoutines(type)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [type]);

  return { data, loading, error };
}

/**
 * Hook для шагов рутины
 */
export function useRoutineSteps(routineId: string) {
  const [data, setData] = useState<RoutineStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getRoutineSteps(routineId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [routineId]);

  return { data, loading, error };
}

/**
 * Hook для записей рутины
 */
export function useBeautyLogs(routineId: string) {
  const [data, setData] = useState<BeautyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getBeautyLogs(routineId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [routineId]);

  return { data, loading, error };
}

/**
 * Hook для статистики рутины
 */
export function useRoutineStats(routineId: string, days = 30) {
  const [data, setData] = useState<RoutineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getRoutineStats(routineId, days)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [routineId, days]);

  return { data, loading, error };
}

/**
 * Hook для количества продуктов
 */
export function useProductsCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getProductsCount()
      .then(setCount)
      .catch((err) => setError(err.message));
  }, []);

  return { count, loading, error };
}

/**
 * Hook для истекающих продуктов
 */
export function useExpiringProductsCount(days = 30) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    beautyService
      .getExpiringProductsCount(days)
      .then(setCount)
      .catch((err) => setError(err.message));
  }, [days]);

  return { count, loading, error };
}
