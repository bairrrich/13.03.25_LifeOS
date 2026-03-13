/**
 * Habits Module Services
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  query,
  aggregate,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type { Habit, HabitLog, HabitStats } from './types';

const USER_ID = 'default-user';

// ==================== Habits ====================

export async function createHabit(
  data: Omit<Habit, keyof BaseEntity>
): Promise<Habit> {
  return createEntity<Habit>('habits', {
    ...data,
    user_id: USER_ID,
    target: data.target || 1,
  });
}

export async function updateHabit(
  id: string,
  data: Partial<Habit>
): Promise<Habit | undefined> {
  return updateEntity<Habit>('habits', id, data);
}

export async function deleteHabit(id: string): Promise<boolean> {
  return deleteEntity('habits', id);
}

export async function getHabit(id: string): Promise<Habit | undefined> {
  return getEntity<Habit>('habits', id);
}

export async function getHabits(
  frequency?: Habit['frequency']
): Promise<Habit[]> {
  let q = query<Habit>('habits').userId(USER_ID);

  if (frequency) {
    q = q.where('frequency', 'eq', frequency);
  }

  const result = await q.execute();
  return result.data;
}

export async function getActiveHabits(): Promise<Habit[]> {
  const habits = await getHabits();
  return habits;
}

// ==================== Habit Logs ====================

export async function createHabitLog(
  data: Omit<HabitLog, keyof BaseEntity>
): Promise<HabitLog> {
  return createEntity<HabitLog>('habit_logs', {
    ...data,
    user_id: USER_ID,
    completed: data.completed ?? false,
  });
}

export async function updateHabitLog(
  id: string,
  data: Partial<HabitLog>
): Promise<HabitLog | undefined> {
  return updateEntity<HabitLog>('habit_logs', id, data);
}

export async function deleteHabitLog(id: string): Promise<boolean> {
  return deleteEntity('habit_logs', id);
}

export async function getHabitLog(
  habitId: string,
  date: number
): Promise<HabitLog | undefined> {
  const result = await query<HabitLog>('habit_logs')
    .userId(USER_ID)
    .where('habit_id', 'eq', habitId)
    .where('date', 'eq', date)
    .first();

  return result ?? undefined;
}

export async function getHabitLogs(
  habitId: string,
  startDate?: number,
  endDate?: number
): Promise<HabitLog[]> {
  let q = query<HabitLog>('habit_logs')
    .userId(USER_ID)
    .where('habit_id', 'eq', habitId)
    .orderBy('date', 'desc');

  if (startDate) {
    q = q.where('date', 'gte', startDate);
  }
  if (endDate) {
    q = q.where('date', 'lte', endDate);
  }

  const result = await q.execute();
  return result.data;
}

export async function getTodayLogs(date: number): Promise<HabitLog[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query<HabitLog>('habit_logs')
    .userId(USER_ID)
    .where('date', 'gte', startOfDay.getTime())
    .where('date', 'lte', endOfDay.getTime());

  const result = await q.execute();
  return result.data;
}

export async function completeHabit(
  habitId: string,
  date: number,
  value?: number
): Promise<HabitLog> {
  // Проверяем, есть ли уже запись за сегодня
  const existing = await getHabitLog(habitId, date);

  if (existing) {
    return updateHabitLog(existing.id, {
      completed: true,
      value,
    }) as Promise<HabitLog>;
  }

  return createHabitLog({
    habit_id: habitId,
    date,
    completed: true,
    value,
  });
}

// ==================== Habit Stats ====================

export async function getHabitStats(habitId: string): Promise<HabitStats> {
  const logs = await getHabitLogs(habitId);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let totalCompleted = 0;
  let totalMissed = 0;
  let lastCompleted: number | undefined;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Сортируем по дате (новые сначала)
  const sortedLogs = [...logs].sort((a, b) => b.date - a.date);

  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];

    if (log.completed) {
      totalCompleted++;
      tempStreak++;
      if (!lastCompleted) {
        lastCompleted = log.date;
      }

      // Проверяем, является ли эта запись самой новой (сегодня или вчера)
      if (i === 0) {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor(
          (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 1) {
          currentStreak = tempStreak;
        }
      }
    } else {
      totalMissed++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
      tempStreak = 0;

      // Если это самая новая запись и она не выполнена, currentStreak = 0
      if (i === 0) {
        currentStreak = 0;
      }
    }
  }

  if (tempStreak > bestStreak) {
    bestStreak = tempStreak;
  }

  // Если currentStreak ещё не установлен, используем tempStreak
  if (currentStreak === 0 && tempStreak > 0) {
    currentStreak = tempStreak;
  }

  const total = totalCompleted + totalMissed;
  const completionRate = total > 0 ? (totalCompleted / total) * 100 : 0;

  return {
    habit_id: habitId,
    current_streak: currentStreak,
    best_streak: bestStreak,
    total_completed: totalCompleted,
    total_missed: totalMissed,
    completion_rate: completionRate,
    last_completed: lastCompleted,
  };
}

export async function getAllHabitsStats(): Promise<HabitStats[]> {
  const habits = await getHabits();
  const statsPromises = habits.map((h) => getHabitStats(h.id));
  return Promise.all(statsPromises);
}

export async function getHabitsCompletionRate(
  date: number
): Promise<number> {
  const todayLogs = await getTodayLogs(date);
  const completed = todayLogs.filter((log) => log.completed).length;
  const total = todayLogs.length;

  return total > 0 ? (completed / total) * 100 : 0;
}
