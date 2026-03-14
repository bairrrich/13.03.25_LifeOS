/**
 * Automation System для LifeOS
 * Система правил и триггеров для автоматизации действий
 */

// Types
export type {
  AutomationRule,
  AutomationLog,
  TriggerType,
  TriggerConfig,
  ScheduleConfig,
  ConditionType,
  Condition,
  BaseCondition,
  LogicalCondition,
  ActionType,
  ActionConfig,
  RuleContext,
  ConditionResult,
  ActionResult,
  NotificationTemplate,
  TemplateVariables,
  BuiltInOperator,
} from './types';

// Engine
export { AutomationEngine, automationEngine } from './automation-engine';

// Scheduler
export {
  AutomationScheduler,
  ConditionChecker,
  scheduler,
  conditionChecker,
  initAutomationScheduler,
  stopAutomationScheduler,
  parseCron,
  matchesCron,
} from './scheduler';

// Service
export {
  createAutomationRule,
  getAutomationRule,
  getAllAutomationRules,
  getActiveAutomationRules,
  updateAutomationRule,
  deleteAutomationRule,
  toggleAutomationRule,
  getAutomationLogs,
  createAutomationLog,
  clearAutomationLogs,
  getRuleStatistics,
  exportAutomationRules,
  importAutomationRules,
} from './automation-service';

// Event Integration
export {
  initAutomationEventIntegration,
  subscribeToEvent,
  refreshAutomationSubscriptions,
} from './event-integration';

// Provider
export { AutomationInitProvider } from './automation-provider';
