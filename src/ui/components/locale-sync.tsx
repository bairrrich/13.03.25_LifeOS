'use client';

import { useEffect } from 'react';
import i18next from '@/shared/lib/i18n';

export function LocaleSync() {
  useEffect(() => {
    const updateLang = async () => {
      const stored = localStorage.getItem('lifeos-locale');
      if (stored === 'ru' || stored === 'en') {
        document.documentElement.lang = stored;
        // Синхронизируем с i18n
        await i18next.changeLanguage(stored);
      }
    };

    // Update on mount
    updateLang();

    // Listen for storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lifeos-locale') {
        updateLang();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return null;
}
