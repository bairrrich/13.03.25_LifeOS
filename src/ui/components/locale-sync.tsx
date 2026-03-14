'use client';

import { useEffect } from 'react';

export function LocaleSync() {
  useEffect(() => {
    const updateLang = () => {
      const stored = localStorage.getItem('lifeos-locale');
      if (stored === 'ru' || stored === 'en') {
        document.documentElement.lang = stored;
      }
    };

    // Update on mount
    updateLang();

    // Listen for storage changes
    window.addEventListener('storage', updateLang);
    return () => window.removeEventListener('storage', updateLang);
  }, []);

  return null;
}
