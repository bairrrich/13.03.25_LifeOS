'use client';

import { useEffect, useState } from 'react';

export function useLocale() {
  const [locale, setLocale] = useState('ru');

  useEffect(() => {
    const stored = localStorage.getItem('lifeos-locale');
    if (stored === 'ru' || stored === 'en') {
      setLocale(stored);
    }
  }, []);

  return locale;
}
