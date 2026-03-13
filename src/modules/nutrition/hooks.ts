/**
 * Nutrition Module Hooks
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Food, Meal, MealEntry, Nutrients, DailyGoals } from './types';
import * as nutritionService from './services';

/**
 * Hook для получения продуктов
 */
export function useFoods(search?: string) {
  const [data, setData] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .getFoods(search)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [search]);

  return { data, loading, error };
}

/**
 * Hook для получения приёма пищи
 */
export function useMeals(date: number, type?: Meal['type']) {
  const [data, setData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .getMeals(date, type)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [date, type]);

  return { data, loading, error };
}

/**
 * Hook для получения записей приёма пищи
 */
export function useMealEntries(mealId: string) {
  const [data, setData] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .getMealEntries(mealId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [mealId]);

  return { data, loading, error };
}

/**
 * Hook для получения дневных нутриентов
 */
export function useDailyNutrients(date: number) {
  const [data, setData] = useState<Nutrients | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .calculateDailyNutrients(date)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [date]);

  return { data, loading, error };
}

/**
 * Hook для получения остатка до цели
 */
export function useDailyRemaining(date: number, goals?: DailyGoals) {
  const [data, setData] = useState<Nutrients | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .getDailyRemaining(date, goals)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [date, goals]);

  return { data, loading, error };
}

/**
 * Hook для получения нутриентов приёма пищи
 */
export function useMealNutrients(mealId: string) {
  const [data, setData] = useState<Nutrients | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .calculateMealNutrients(mealId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [mealId]);

  return { data, loading, error };
}

/**
 * Hook для получения сегодняших нутриентов
 */
export function useTodayNutrients() {
  const [data, setData] = useState<Nutrients | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .getTodayNutrients()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для получения сегодняшего остатка
 */
export function useTodayRemaining() {
  const [data, setData] = useState<Nutrients | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nutritionService
      .getTodayRemaining()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для поиска продуктов
 */
export function useFoodSearch(query: string, delay = 300) {
  const [data, setData] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      nutritionService
        .searchFoods(query)
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return { data, loading, error };
}
