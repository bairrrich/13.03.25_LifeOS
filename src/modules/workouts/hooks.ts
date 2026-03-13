/**
 * Workouts Module Hooks
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Exercise, Workout, Set, ExerciseStats, WorkoutStats } from './types';
import * as workoutsService from './services';

/**
 * Hook для получения упражнений
 */
export function useExercises(muscleGroup?: string, search?: string) {
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getExercises(muscleGroup, search)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [muscleGroup, search]);

  return { data, loading, error };
}

/**
 * Hook для получения тренировок
 */
export function useWorkouts(startDate?: number, endDate?: number) {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getWorkouts(startDate, endDate)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [startDate, endDate]);

  return { data, loading, error };
}

/**
 * Hook для получения последних тренировок
 */
export function useRecentWorkouts(limit = 10) {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getRecentWorkouts(limit)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [limit]);

  return { data, loading, error };
}

/**
 * Hook для получения сетов тренировки
 */
export function useWorkoutSets(workoutId: string) {
  const [data, setData] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getWorkoutSets(workoutId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [workoutId]);

  return { data, loading, error };
}

/**
 * Hook для получения статистики упражнения
 */
export function useExerciseStats(exerciseId: string) {
  const [data, setData] = useState<ExerciseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getExerciseStats(exerciseId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [exerciseId]);

  return { data, loading, error };
}

/**
 * Hook для получения статистики тренировки
 */
export function useWorkoutStats(workoutId: string) {
  const [data, setData] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getWorkoutStats(workoutId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [workoutId]);

  return { data, loading, error };
}

/**
 * Hook для одной тренировки
 */
export function useWorkout(id: string) {
  const [data, setData] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getWorkout(id)
      .then((workout) => setData(workout || null))
      .catch((err) => setError(err.message));
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook для одного упражнения
 */
export function useExercise(id: string) {
  const [data, setData] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getExercise(id)
      .then((exercise) => setData(exercise || null))
      .catch((err) => setError(err.message));
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook для общего количества тренировок
 */
export function useTotalWorkoutCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workoutsService
      .getTotalWorkoutCount()
      .then(setCount)
      .catch((err) => setError(err.message));
  }, []);

  return { count, loading, error };
}
