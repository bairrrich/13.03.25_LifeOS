/**
 * Goals Module Hooks
 */

'use client';

import { useEffect, useState } from 'react';
import type { Goal, GoalMilestone, GoalProgress, GoalStats } from './types';
import * as goalsService from './services';

/**
 * Hook для получения целей
 */
export function useGoals(status?: Goal['status']) {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getGoals(status)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [status]);

  return { data, loading, error };
}

/**
 * Hook для получения активных целей
 */
export function useActiveGoals() {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getActiveGoals()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для одной цели
 */
export function useGoal(id: string) {
  const [data, setData] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getGoal(id)
      .then((goal) => setData(goal || null))
      .catch((err) => setError(err.message));
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook для milestones цели
 */
export function useGoalMilestones(goalId: string) {
  const [data, setData] = useState<GoalMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getGoalMilestones(goalId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [goalId]);

  return { data, loading, error };
}

/**
 * Hook для прогресса цели
 */
export function useGoalProgress(goalId: string) {
  const [data, setData] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getGoalProgress(goalId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [goalId]);

  return { data, loading, error };
}

/**
 * Hook для статистики цели
 */
export function useGoalStats(goalId: string) {
  const [data, setData] = useState<GoalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getGoalStats(goalId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [goalId]);

  return { data, loading, error };
}

/**
 * Hook для сводки по целям
 */
export function useGoalsSummary() {
  const [data, setData] = useState<{
    total: number;
    active: number;
    completed: number;
    paused: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsService
      .getGoalsSummary()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}
