export type {
  Goal,
  GoalMilestone,
  GoalProgress,
  GoalStats,
  GoalType,
  GoalStatus,
} from './types';

export {
  // Goals
  createGoal,
  updateGoal,
  deleteGoal,
  getGoal,
  getGoals,
  getActiveGoals,
  updateGoalProgress,

  // Milestones
  createGoalMilestone,
  updateGoalMilestone,
  deleteGoalMilestone,
  getGoalMilestones,
  completeMilestone,

  // Progress
  createGoalProgress,
  getGoalProgress,
  logGoalProgress,

  // Statistics
  getGoalStats,
  getGoalsSummary,
} from './services';

export {
  useGoals,
  useActiveGoals,
  useGoal,
  useGoalMilestones,
  useGoalProgress,
  useGoalStats,
  useGoalsSummary,
} from './hooks';
