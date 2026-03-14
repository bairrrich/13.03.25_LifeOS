'use client';

import React from 'react';
import { initAutomationScheduler, initAutomationEventIntegration } from '@/core/automation';

/**
 * Инициализация Automation System при загрузке приложения
 */
export function AutomationInitProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Инициализация scheduler для расписаний
    initAutomationScheduler();

    // Интеграция с Event System
    initAutomationEventIntegration();

    // Cleanup при размонтировании
    return () => {
      // В будущем можно добавить остановку scheduler
    };
  }, []);

  return <>{children}</>;
}
