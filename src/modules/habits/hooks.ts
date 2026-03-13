/**
 * Habits Module Hooks
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Habit, HabitLog, HabitStats } from './types';
import * as habitsService from './services';

/**
 * Hook для получения списка привычек
 */
export function useHabits(frequency?: Habit['frequency']) {
  const [data, setData] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    habitsService
      .getHabits(frequency)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [frequency]);

  return { data, loading, error };
}

/**
 * Hook для получения записей привычки
 */
export function useHabitLogs(
  habitId: string,
  startDate?: number,
  endDate?: number
) {
  const [data, setData] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    habitsService
      .getHabitLogs(habitId, startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [habitId, startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для получения статистики привычки
 */
export function useHabitStats(habitId: string) {
  const [data, setData] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    habitsService
      .getHabitStats(habitId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [habitId]);

  return { data, loading, error };
}

/**
 * Hook для получения статистики всех привычек
 */
export function useAllHabitsStats() {
  const [data, setData] = useState<HabitStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    habitsService
      .getAllHabitsStats()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для получения процента выполнения за день
 */
export function useDailyCompletion(date: number) {
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    habitsService
      .getHabitsCompletionRate(date)
      .then(setRate)
      .catch((err) => setError(err.message));
  }, [date]);

  return { rate, loading, error };
}

/**
 * Hook для одной привычки
 */
export function useHabit(id: string) {
  const [data, setData] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    habitsService
      .getHabit(id)
      .then((habit) => setData(habit || null))
      .catch((err) => setError(err.message));
  }, [id]);

  return { data, loading, error };
}
