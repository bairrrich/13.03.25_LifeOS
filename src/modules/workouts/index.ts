export type {
  Exercise,
  Workout,
  Set,
  WorkoutType,
  MuscleGroup,
  ExerciseStats,
  WorkoutStats,
} from './types';

export {
  // Exercises
  createExercise,
  updateExercise,
  deleteExercise,
  getExercise,
  getExercises,
  getExercisesByMuscleGroup,

  // Workouts
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkout,
  getWorkouts,
  getWorkoutsByDate,
  getRecentWorkouts,

  // Sets
  createSet,
  updateSet,
  deleteSet,
  getSet,
  getWorkoutSets,
  getExerciseSetsInWorkout,

  // Statistics
  getExerciseStats,
  getWorkoutStats,
  getTotalWorkoutCount,
  getWeeklyVolume,
  getMonthlyVolume,
} from './services';

export {
  useExercises,
  useWorkouts,
  useRecentWorkouts,
  useWorkoutSets,
  useExerciseStats,
  useWorkoutStats,
  useWorkout,
  useExercise,
  useTotalWorkoutCount,
} from './hooks';
