export type {
  Cosmetic,
  BeautyRoutine,
  RoutineStep,
  BeautyLog,
  RoutineStats,
  CosmeticCategory,
  RoutineType,
} from './types';

export {
  // Cosmetics
  createCosmetic,
  updateCosmetic,
  deleteCosmetic,
  getCosmetic,
  getCosmetics,
  getExpiringCosmetics,
  openCosmetic,

  // Beauty Routines
  createBeautyRoutine,
  updateBeautyRoutine,
  deleteBeautyRoutine,
  getBeautyRoutine,
  getBeautyRoutines,

  // Routine Steps
  createRoutineStep,
  updateRoutineStep,
  deleteRoutineStep,
  getRoutineSteps,
  addStepToRoutine,

  // Beauty Logs
  createBeautyLog,
  updateBeautyLog,
  deleteBeautyLog,
  getBeautyLogs,
  completeRoutine,

  // Statistics
  getRoutineStats,
  getProductsCount,
  getExpiringProductsCount,
} from './services';

export {
  useCosmetics,
  useExpiringCosmetics,
  useBeautyRoutines,
  useRoutineSteps,
  useBeautyLogs,
  useRoutineStats,
  useProductsCount,
  useExpiringProductsCount,
} from './hooks';
