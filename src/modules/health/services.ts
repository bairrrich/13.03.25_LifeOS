/**
 * Health Module Services
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

const USER_ID = 'default-user';

// ==================== Sleep Logs ====================

export async function createSleepLog(
  data: Omit<SleepLog, keyof BaseEntity>
): Promise<SleepLog> {
  return createEntity<SleepLog>('sleep_logs', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateSleepLog(
  id: string,
  data: Partial<SleepLog>
): Promise<SleepLog | undefined> {
  return updateEntity<SleepLog>('sleep_logs', id, data);
}

export async function deleteSleepLog(id: string): Promise<boolean> {
  return deleteEntity('sleep_logs', id);
}

export async function getSleepLog(id: string): Promise<SleepLog | undefined> {
  return getEntity<SleepLog>('sleep_logs', id);
}

export async function getSleepLogs(
  startDate?: number,
  endDate?: number
): Promise<SleepLog[]> {
  let q = query<SleepLog>('sleep_logs')
    .userId(USER_ID)
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

export async function calculateSleepDuration(
  startTime: number,
  endTime: number
): Promise<number> {
  // Возвращаем длительность в часах
  const durationMs = endTime - startTime;
  return Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;
}

export async function getSleepStats(startDate?: number, endDate?: number): Promise<SleepStats> {
  const logs = await getSleepLogs(startDate, endDate);
  
  if (logs.length === 0) {
    return {
      average_duration: 0,
      average_quality: 0,
      total_nights: 0,
      best_duration: 0,
      worst_duration: 0,
    };
  }

  let totalDuration = 0;
  let totalQuality = 0;
  let qualityCount = 0;
  let bestDuration = 0;
  let worstDuration = Infinity;

  for (const log of logs) {
    const duration = await calculateSleepDuration(log.start_time, log.end_time);
    totalDuration += duration;

    if (duration > bestDuration) {
      bestDuration = duration;
    }
    if (duration < worstDuration) {
      worstDuration = duration;
    }

    if (log.quality) {
      const qualityMap = { poor: 1, fair: 2, good: 3, excellent: 4 };
      totalQuality += qualityMap[log.quality];
      qualityCount++;
    }
  }

  if (worstDuration === Infinity) {
    worstDuration = 0;
  }

  return {
    average_duration: Math.round((totalDuration / logs.length) * 10) / 10,
    average_quality: qualityCount > 0 ? Math.round((totalQuality / qualityCount) * 10) / 10 : 0,
    total_nights: logs.length,
    best_duration: bestDuration,
    worst_duration: worstDuration,
  };
}

// ==================== Weight Logs ====================

export async function createWeightLog(
  data: Omit<WeightLog, keyof BaseEntity>
): Promise<WeightLog> {
  return createEntity<WeightLog>('weight_logs', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateWeightLog(
  id: string,
  data: Partial<WeightLog>
): Promise<WeightLog | undefined> {
  return updateEntity<WeightLog>('weight_logs', id, data);
}

export async function deleteWeightLog(id: string): Promise<boolean> {
  return deleteEntity('weight_logs', id);
}

export async function getWeightLog(id: string): Promise<WeightLog | undefined> {
  return getEntity<WeightLog>('weight_logs', id);
}

export async function getWeightLogs(
  startDate?: number,
  endDate?: number
): Promise<WeightLog[]> {
  let q = query<WeightLog>('weight_logs')
    .userId(USER_ID)
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

export async function getWeightStats(): Promise<WeightStats> {
  const logs = await getWeightLogs();

  if (logs.length === 0) {
    return {
      current_weight: 0,
      start_weight: 0,
      min_weight: 0,
      max_weight: 0,
      change: 0,
    };
  }

  const sortedLogs = [...logs].sort((a, b) => a.date - b.date);
  const weights = logs.map((l) => l.weight);

  return {
    current_weight: logs[0].weight,
    start_weight: sortedLogs[0].weight,
    min_weight: Math.min(...weights),
    max_weight: Math.max(...weights),
    change: logs[0].weight - sortedLogs[0].weight,
  };
}

export async function getLatestWeight(): Promise<number | undefined> {
  const logs = await getWeightLogs();
  return logs[0]?.weight;
}

// ==================== Vitamins ====================

export async function createVitamin(
  data: Omit<Vitamin, keyof BaseEntity>
): Promise<Vitamin> {
  return createEntity<Vitamin>('vitamins', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateVitamin(
  id: string,
  data: Partial<Vitamin>
): Promise<Vitamin | undefined> {
  return updateEntity<Vitamin>('vitamins', id, data);
}

export async function deleteVitamin(id: string): Promise<boolean> {
  return deleteEntity('vitamins', id);
}

export async function getVitamin(id: string): Promise<Vitamin | undefined> {
  return getEntity<Vitamin>('vitamins', id);
}

export async function getVitamins(): Promise<Vitamin[]> {
  const result = await query<Vitamin>('vitamins').userId(USER_ID).execute();
  return result.data;
}

// ==================== Vitamin Logs ====================

export async function createVitaminLog(
  data: Omit<VitaminLog, keyof BaseEntity>
): Promise<VitaminLog> {
  return createEntity<VitaminLog>('vitamin_logs', {
    ...data,
    user_id: USER_ID,
    taken: data.taken ?? false,
  });
}

export async function updateVitaminLog(
  id: string,
  data: Partial<VitaminLog>
): Promise<VitaminLog | undefined> {
  return updateEntity<VitaminLog>('vitamin_logs', id, data);
}

export async function deleteVitaminLog(id: string): Promise<boolean> {
  return deleteEntity('vitamin_logs', id);
}

export async function getVitaminLogs(
  vitaminId: string,
  startDate?: number,
  endDate?: number
): Promise<VitaminLog[]> {
  let q = query<VitaminLog>('vitamin_logs')
    .userId(USER_ID)
    .where('vitamin_id', 'eq', vitaminId)
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

export async function markVitaminTaken(
  vitaminId: string,
  date: number,
  timeTaken?: number
): Promise<VitaminLog> {
  // Проверяем, есть ли уже запись
  const existingLogs = await getVitaminLogs(vitaminId, date, date);
  const todayLog = existingLogs.find((log) => log.date === date);

  if (todayLog) {
    return updateVitaminLog(todayLog.id, {
      taken: true,
      time_taken: timeTaken,
    }) as Promise<VitaminLog>;
  }

  return createVitaminLog({
    vitamin_id: vitaminId,
    date,
    taken: true,
    time_taken: timeTaken,
  });
}

// ==================== Health Metrics ====================

export async function createHealthMetric(
  data: Omit<HealthMetric, keyof BaseEntity>
): Promise<HealthMetric> {
  return createEntity<HealthMetric>('health_metrics', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateHealthMetric(
  id: string,
  data: Partial<HealthMetric>
): Promise<HealthMetric | undefined> {
  return updateEntity<HealthMetric>('health_metrics', id, data);
}

export async function deleteHealthMetric(id: string): Promise<boolean> {
  return deleteEntity('health_metrics', id);
}

export async function getHealthMetrics(
  metricType: HealthMetric['metric_type'],
  startDate?: number,
  endDate?: number
): Promise<HealthMetric[]> {
  let q = query<HealthMetric>('health_metrics')
    .userId(USER_ID)
    .where('metric_type', 'eq', metricType)
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

export async function getLatestHeartRate(): Promise<number | undefined> {
  const metrics = await getHealthMetrics('heart_rate');
  return metrics[0]?.value;
}

// ==================== Lab Tests ====================

export async function createLabTest(
  data: Omit<LabTest, keyof BaseEntity>
): Promise<LabTest> {
  return createEntity<LabTest>('lab_tests', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateLabTest(
  id: string,
  data: Partial<LabTest>
): Promise<LabTest | undefined> {
  return updateEntity<LabTest>('lab_tests', id, data);
}

export async function deleteLabTest(id: string): Promise<boolean> {
  return deleteEntity('lab_tests', id);
}

export async function getLabTest(id: string): Promise<LabTest | undefined> {
  return getEntity<LabTest>('lab_tests', id);
}

export async function getLabTests(): Promise<LabTest[]> {
  const result = await query<LabTest>('lab_tests')
    .userId(USER_ID)
    .orderBy('date', 'desc')
    .execute();
  return result.data;
}

// ==================== Lab Results ====================

export async function createLabResult(
  data: Omit<LabResult, keyof BaseEntity>
): Promise<LabResult> {
  // Определяем флаг автоматически
  let flag: 'low' | 'normal' | 'high' | undefined;
  if (data.range_min !== undefined && data.value < data.range_min) {
    flag = 'low';
  } else if (data.range_max !== undefined && data.value > data.range_max) {
    flag = 'high';
  } else if (data.range_min !== undefined && data.range_max !== undefined) {
    flag = 'normal';
  }

  return createEntity<LabResult>('lab_results', {
    ...data,
    user_id: USER_ID,
    flag,
  });
}

export async function updateLabResult(
  id: string,
  data: Partial<LabResult>
): Promise<LabResult | undefined> {
  return updateEntity<LabResult>('lab_results', id, data);
}

export async function deleteLabResult(id: string): Promise<boolean> {
  return deleteEntity('lab_results', id);
}

export async function getLabResults(testId: string): Promise<LabResult[]> {
  const result = await query<LabResult>('lab_results')
    .userId(USER_ID)
    .where('test_id', 'eq', testId)
    .execute();
  return result.data;
}
