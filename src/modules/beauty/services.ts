/**
 * Beauty Module Services
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  query,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type {
  Cosmetic,
  BeautyRoutine,
  RoutineStep,
  BeautyLog,
  RoutineStats,
} from './types';

const USER_ID = 'default-user';

// ==================== Cosmetics ====================

export async function createCosmetic(
  data: Omit<Cosmetic, keyof BaseEntity>
): Promise<Cosmetic> {
  return createEntity<Cosmetic>('cosmetics', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateCosmetic(
  id: string,
  data: Partial<Cosmetic>
): Promise<Cosmetic | undefined> {
  return updateEntity<Cosmetic>('cosmetics', id, data);
}

export async function deleteCosmetic(id: string): Promise<boolean> {
  return deleteEntity('cosmetics', id);
}

export async function getCosmetic(id: string): Promise<Cosmetic | undefined> {
  return getEntity<Cosmetic>('cosmetics', id);
}

export async function getCosmetics(
  category?: Cosmetic['category']
): Promise<Cosmetic[]> {
  let q = query<Cosmetic>('cosmetics')
    .userId(USER_ID)
    .orderBy('name', 'asc');

  if (category) {
    q = q.where('category', 'eq', category);
  }

  const result = await q.execute();
  return result.data;
}

export async function getExpiringCosmetics(days = 30): Promise<Cosmetic[]> {
  const cosmetics = await getCosmetics();
  const now = Date.now();
  const threshold = now + days * 24 * 60 * 60 * 1000;

  return cosmetics.filter(
    (c) => c.expiration_date && c.expiration_date <= threshold
  );
}

export async function openCosmetic(id: string): Promise<Cosmetic | undefined> {
  return updateCosmetic(id, { opened_at: Date.now() });
}

// ==================== Beauty Routines ====================

export async function createBeautyRoutine(
  data: Omit<BeautyRoutine, keyof BaseEntity>
): Promise<BeautyRoutine> {
  return createEntity<BeautyRoutine>('beauty_routines', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateBeautyRoutine(
  id: string,
  data: Partial<BeautyRoutine>
): Promise<BeautyRoutine | undefined> {
  return updateEntity<BeautyRoutine>('beauty_routines', id, data);
}

export async function deleteBeautyRoutine(id: string): Promise<boolean> {
  return deleteEntity('beauty_routines', id);
}

export async function getBeautyRoutine(
  id: string
): Promise<BeautyRoutine | undefined> {
  return getEntity<BeautyRoutine>('beauty_routines', id);
}

export async function getBeautyRoutines(
  type?: BeautyRoutine['type']
): Promise<BeautyRoutine[]> {
  let q = query<BeautyRoutine>('beauty_routines')
    .userId(USER_ID)
    .orderBy('name', 'asc');

  if (type) {
    q = q.where('type', 'eq', type);
  }

  const result = await q.execute();
  return result.data;
}

// ==================== Routine Steps ====================

export async function createRoutineStep(
  data: Omit<RoutineStep, keyof BaseEntity>
): Promise<RoutineStep> {
  return createEntity<RoutineStep>('routine_steps', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateRoutineStep(
  id: string,
  data: Partial<RoutineStep>
): Promise<RoutineStep | undefined> {
  return updateEntity<RoutineStep>('routine_steps', id, data);
}

export async function deleteRoutineStep(id: string): Promise<boolean> {
  return deleteEntity('routine_steps', id);
}

export async function getRoutineSteps(routineId: string): Promise<RoutineStep[]> {
  const result = await query<RoutineStep>('routine_steps')
    .userId(USER_ID)
    .where('routine_id', 'eq', routineId)
    .orderBy('step_order', 'asc')
    .execute();

  return result.data;
}

export async function addStepToRoutine(
  routineId: string,
  name: string,
  cosmeticId?: string,
  description?: string,
  duration?: number
): Promise<RoutineStep> {
  // Получаем текущий максимальный order
  const steps = await getRoutineSteps(routineId);
  const maxOrder = steps.reduce((max, s) => Math.max(max, s.step_order), 0);

  return createRoutineStep({
    routine_id: routineId,
    name,
    cosmetic_id: cosmeticId,
    description,
    duration,
    step_order: maxOrder + 1,
  });
}

// ==================== Beauty Logs ====================

export async function createBeautyLog(
  data: Omit<BeautyLog, keyof BaseEntity>
): Promise<BeautyLog> {
  return createEntity<BeautyLog>('beauty_logs', {
    ...data,
    user_id: USER_ID,
    completed: data.completed ?? false,
  });
}

export async function updateBeautyLog(
  id: string,
  data: Partial<BeautyLog>
): Promise<BeautyLog | undefined> {
  return updateEntity<BeautyLog>('beauty_logs', id, data);
}

export async function deleteBeautyLog(id: string): Promise<boolean> {
  return deleteEntity('beauty_logs', id);
}

export async function getBeautyLogs(
  routineId: string,
  startDate?: number,
  endDate?: number
): Promise<BeautyLog[]> {
  let q = query<BeautyLog>('beauty_logs')
    .userId(USER_ID)
    .where('routine_id', 'eq', routineId)
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

export async function completeRoutine(
  routineId: string,
  date: number,
  notes?: string
): Promise<BeautyLog> {
  // Проверяем, есть ли уже запись за сегодня
  const existing = await getBeautyLogs(routineId, date, date);
  const todayLog = existing.find((log) => log.date === date);

  if (todayLog) {
    return updateBeautyLog(todayLog.id, {
      completed: true,
      notes: notes || todayLog.notes,
    }) as Promise<BeautyLog>;
  }

  return createBeautyLog({
    routine_id: routineId,
    date,
    completed: true,
    ...(notes && { notes }),
  });
}

// ==================== Statistics ====================

export async function getRoutineStats(
  routineId: string,
  days = 30
): Promise<RoutineStats> {
  const now = Date.now();
  const startDate = now - days * 24 * 60 * 60 * 1000;

  const logs = await getBeautyLogs(routineId, startDate, now);

  const completedLogs = logs.filter((log) => log.completed);
  const totalTimes = logs.length;
  const completedTimes = completedLogs.length;
  const completionRate = totalTimes > 0 ? (completedTimes / totalTimes) * 100 : 0;

  // Считаем streak (последовательные дни)
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkTimestamp = checkDate.getTime();

    const dayLog = completedLogs.find(
      (log) => log.date >= checkTimestamp && log.date < checkTimestamp + 24 * 60 * 60 * 1000
    );

    if (dayLog) {
      streak++;
    } else if (i > 0) {
      // Прерываем streak, кроме сегодняшнего дня
      break;
    }
  }

  const lastCompleted = completedLogs.length > 0
    ? Math.max(...completedLogs.map((l) => l.date))
    : undefined;

  return {
    routine_id: routineId,
    total_times: totalTimes,
    completed_times: completedTimes,
    completion_rate: Math.round(completionRate),
    last_completed: lastCompleted,
    streak,
  };
}

export async function getProductsCount(): Promise<number> {
  const result = await query<Cosmetic>('cosmetics').userId(USER_ID).execute();
  return result.total;
}

export async function getExpiringProductsCount(days = 30): Promise<number> {
  const products = await getExpiringCosmetics(days);
  return products.length;
}
