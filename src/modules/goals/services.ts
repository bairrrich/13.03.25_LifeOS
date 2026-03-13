/**
 * Goals Module Services
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  query,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type { Goal, GoalMilestone, GoalProgress, GoalStats } from './types';

const USER_ID = 'default-user';

// ==================== Goals ====================

export async function createGoal(
  data: Omit<Goal, keyof BaseEntity>
): Promise<Goal> {
  return createEntity<Goal>('goals', {
    ...data,
    user_id: USER_ID,
    current_value: data.current_value || 0,
    status: data.status || 'active',
  });
}

export async function updateGoal(
  id: string,
  data: Partial<Goal>
): Promise<Goal | undefined> {
  return updateEntity<Goal>('goals', id, data);
}

export async function deleteGoal(id: string): Promise<boolean> {
  return deleteEntity('goals', id);
}

export async function getGoal(id: string): Promise<Goal | undefined> {
  return getEntity<Goal>('goals', id);
}

export async function getGoals(status?: Goal['status']): Promise<Goal[]> {
  let q = query<Goal>('goals').userId(USER_ID).orderBy('created_at', 'desc');

  if (status) {
    q = q.where('status', 'eq', status);
  }

  const result = await q.execute();
  return result.data;
}

export async function getActiveGoals(): Promise<Goal[]> {
  return getGoals('active');
}

export async function updateGoalProgress(
  goalId: string,
  currentValue: number
): Promise<Goal | undefined> {
  const goal = await getGoal(goalId);
  if (!goal) return undefined;

  const updated = await updateGoal(goalId, { current_value: currentValue });

  // Проверяем, достигнута ли цель
  if (updated && goal.target_value && currentValue >= goal.target_value) {
    await updateGoal(goalId, { status: 'completed' });
  }

  return updated;
}

// ==================== Goal Milestones ====================

export async function createGoalMilestone(
  data: Omit<GoalMilestone, keyof BaseEntity>
): Promise<GoalMilestone> {
  return createEntity<GoalMilestone>('goal_milestones', {
    ...data,
    user_id: USER_ID,
    completed: data.completed ?? false,
  });
}

export async function updateGoalMilestone(
  id: string,
  data: Partial<GoalMilestone>
): Promise<GoalMilestone | undefined> {
  return updateEntity<GoalMilestone>('goal_milestones', id, data);
}

export async function deleteGoalMilestone(id: string): Promise<boolean> {
  return deleteEntity('goal_milestones', id);
}

export async function getGoalMilestones(goalId: string): Promise<GoalMilestone[]> {
  const result = await query<GoalMilestone>('goal_milestones')
    .userId(USER_ID)
    .where('goal_id', 'eq', goalId)
    .orderBy('target_date', 'asc')
    .execute();

  return result.data;
}

export async function completeMilestone(id: string): Promise<GoalMilestone | undefined> {
  return updateGoalMilestone(id, {
    completed: true,
    completed_at: Date.now(),
  });
}

// ==================== Goal Progress ====================

export async function createGoalProgress(
  data: Omit<GoalProgress, keyof BaseEntity>
): Promise<GoalProgress> {
  return createEntity<GoalProgress>('goal_progress', {
    ...data,
    user_id: USER_ID,
  });
}

export async function getGoalProgress(goalId: string): Promise<GoalProgress[]> {
  const result = await query<GoalProgress>('goal_progress')
    .userId(USER_ID)
    .where('goal_id', 'eq', goalId)
    .orderBy('date', 'desc')
    .execute();

  return result.data;
}

export async function logGoalProgress(
  goalId: string,
  value: number,
  note?: string
): Promise<GoalProgress> {
  return createGoalProgress({
    goal_id: goalId,
    value,
    date: Date.now(),
    note,
  });
}

// ==================== Statistics ====================

export async function getGoalStats(goalId: string): Promise<GoalStats> {
  const goal = await getGoal(goalId);
  const milestones = await getGoalMilestones(goalId);

  if (!goal) {
    return {
      goal_id: goalId,
      progress_percent: 0,
      on_track: false,
      milestones_completed: 0,
      milestones_total: 0,
    };
  }

  // Расчёт прогресса
  let progressPercent = 0;
  if (goal.target_value && goal.current_value !== undefined) {
    progressPercent = Math.round((goal.current_value / goal.target_value) * 100);
  }

  // Дни до дедлайна
  let daysRemaining: number | undefined;
  if (goal.deadline) {
    const now = Date.now();
    const diff = goal.deadline - now;
    daysRemaining = Math.round(diff / (1000 * 60 * 60 * 24));
  }

  // On track проверка
  const onTrack = progressPercent >= 50 || (daysRemaining !== undefined && daysRemaining > 30);

  // Milestones
  const milestonesCompleted = milestones.filter((m) => m.completed).length;

  return {
    goal_id: goalId,
    progress_percent: Math.min(progressPercent, 100),
    days_remaining: daysRemaining,
    on_track: onTrack,
    milestones_completed: milestonesCompleted,
    milestones_total: milestones.length,
  };
}

export async function getGoalsSummary(): Promise<{
  total: number;
  active: number;
  completed: number;
  paused: number;
}> {
  const goals = await query<Goal>('goals').userId(USER_ID).execute();

  return {
    total: goals.total,
    active: goals.data.filter((g) => g.status === 'active').length,
    completed: goals.data.filter((g) => g.status === 'completed').length,
    paused: goals.data.filter((g) => g.status === 'paused').length,
  };
}
