/**
 * Workouts Module Services
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  query,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type { Exercise, Workout, Set, ExerciseStats, WorkoutStats } from './types';

const USER_ID = 'default-user';

// ==================== Exercises ====================

export async function createExercise(
  data: Omit<Exercise, keyof BaseEntity>
): Promise<Exercise> {
  return createEntity<Exercise>('exercises', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateExercise(
  id: string,
  data: Partial<Exercise>
): Promise<Exercise | undefined> {
  return updateEntity<Exercise>('exercises', id, data);
}

export async function deleteExercise(id: string): Promise<boolean> {
  return deleteEntity('exercises', id);
}

export async function getExercise(id: string): Promise<Exercise | undefined> {
  return getEntity<Exercise>('exercises', id);
}

export async function getExercises(
  muscleGroup?: string,
  search?: string
): Promise<Exercise[]> {
  const q = query<Exercise>('exercises').userId(USER_ID).orderBy('name', 'asc');

  const result = await q.execute();
  let exercises = result.data;

  if (muscleGroup) {
    exercises = exercises.filter((e) => e.muscle_group === muscleGroup);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    exercises = exercises.filter((e) =>
      e.name.toLowerCase().includes(searchLower)
    );
  }

  return exercises;
}

export async function getExercisesByMuscleGroup(
  muscleGroup: string
): Promise<Exercise[]> {
  return getExercises(muscleGroup);
}

// ==================== Workouts ====================

export async function createWorkout(
  data: Omit<Workout, keyof BaseEntity>
): Promise<Workout> {
  return createEntity<Workout>('workouts', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateWorkout(
  id: string,
  data: Partial<Workout>
): Promise<Workout | undefined> {
  return updateEntity<Workout>('workouts', id, data);
}

export async function deleteWorkout(id: string): Promise<boolean> {
  return deleteEntity('workouts', id);
}

export async function getWorkout(id: string): Promise<Workout | undefined> {
  return getEntity<Workout>('workouts', id);
}

export async function getWorkouts(
  startDate?: number,
  endDate?: number
): Promise<Workout[]> {
  let q = query<Workout>('workouts')
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

export async function getWorkoutsByDate(date: number): Promise<Workout[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getWorkouts(startOfDay.getTime(), endOfDay.getTime());
}

export async function getRecentWorkouts(limit = 10): Promise<Workout[]> {
  const result = await query<Workout>('workouts')
    .userId(USER_ID)
    .orderBy('date', 'desc')
    .take(limit)
    .execute();

  return result.data;
}

// ==================== Sets ====================

export async function createSet(
  data: Omit<Set, keyof BaseEntity>
): Promise<Set> {
  return createEntity<Set>('sets', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateSet(
  id: string,
  data: Partial<Set>
): Promise<Set | undefined> {
  return updateEntity<Set>('sets', id, data);
}

export async function deleteSet(id: string): Promise<boolean> {
  return deleteEntity('sets', id);
}

export async function getSet(id: string): Promise<Set | undefined> {
  return getEntity<Set>('sets', id);
}

export async function getWorkoutSets(workoutId: string): Promise<Set[]> {
  const result = await query<Set>('sets')
    .userId(USER_ID)
    .where('workout_id', 'eq', workoutId)
    .orderBy('order', 'asc')
    .execute();

  return result.data;
}

export async function getExerciseSetsInWorkout(
  workoutId: string,
  exerciseId: string
): Promise<Set[]> {
  const result = await query<Set>('sets')
    .userId(USER_ID)
    .where('workout_id', 'eq', workoutId)
    .where('exercise_id', 'eq', exerciseId)
    .orderBy('order', 'asc')
    .execute();

  return result.data;
}

// ==================== Statistics ====================

export async function getExerciseStats(exerciseId: string): Promise<ExerciseStats> {
  // Получаем все сеты для этого упражнения
  const allSets = await query<Set>('sets')
    .userId(USER_ID)
    .where('exercise_id', 'eq', exerciseId)
    .execute();

  const sets = allSets.data;
  
  let maxWeight = 0;
  let maxReps = 0;
  let lastPerformed: number | undefined;
  const workoutIds = new Set<string>();

  for (const set of sets) {
    if (set.weight && set.weight > maxWeight) {
      maxWeight = set.weight;
    }
    if (set.reps && set.reps > maxReps) {
      maxReps = set.reps;
    }
    workoutIds.add(set.workout_id);
  }

  // Получаем даты тренировок
  for (const workoutId of workoutIds) {
    const workout = await getWorkout(workoutId);
    if (workout) {
      if (!lastPerformed || workout.date > lastPerformed) {
        lastPerformed = workout.date;
      }
    }
  }

  return {
    exercise_id: exerciseId,
    total_workouts: workoutIds.size,
    total_sets: sets.length,
    max_weight: maxWeight,
    max_reps: maxReps,
    last_performed: lastPerformed,
  };
}

export async function getWorkoutStats(workoutId: string): Promise<WorkoutStats> {
  const sets = await getWorkoutSets(workoutId);
  
  const exerciseIds = new Set<string>();
  let totalVolume = 0;

  for (const set of sets) {
    exerciseIds.add(set.exercise_id);
    totalVolume += (set.weight || 0) * (set.reps || 0);
  }

  const workout = await getWorkout(workoutId);

  return {
    workout_id: workoutId,
    total_exercises: exerciseIds.size,
    total_sets: sets.length,
    total_volume: totalVolume,
    duration: workout?.duration,
  };
}

export async function getTotalWorkoutCount(): Promise<number> {
  const result = await query<Workout>('workouts')
    .userId(USER_ID)
    .execute();

  return result.total;
}

// ==================== Volume Tracking ====================

export async function getWeeklyVolume(weekStart: number): Promise<number> {
  const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;

  const workouts = await getWorkouts(weekStart, weekEnd);
  let totalVolume = 0;

  for (const workout of workouts) {
    const stats = await getWorkoutStats(workout.id);
    totalVolume += stats.total_volume;
  }

  return totalVolume;
}

export async function getMonthlyVolume(monthStart: number): Promise<number> {
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  return getWeeklyVolume(monthStart); // Упрощённая версия
}
