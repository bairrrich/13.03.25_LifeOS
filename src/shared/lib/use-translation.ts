'use client';

import { useEffect, useState, useCallback } from 'react';
import i18next, { defaultLocale, locales } from '@/shared/lib/i18n';

export type Locale = 'ru' | 'en';

export function useTranslation(ns: string = 'common') {
  const [ready, setReady] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Инициализация при монтировании
    const init = async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('lifeos-locale') : null;
      const locale = (stored && locales.includes(stored as Locale)) ? stored as Locale : defaultLocale;

      await i18next.changeLanguage(locale);
      setCurrentLocale(locale);
      setReady(true);
    };

    init();
  }, []);

  const t = useCallback(
    (key: string, defaultValue?: string) => {
      if (!ready) return key;

      const keys = key.split('.');
      const resource = i18next.getResourceBundle(currentLocale, ns);
      let value: unknown = resource;

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[k];
        } else {
          return defaultValue || key;
        }
      }

      return typeof value === 'string' ? value : defaultValue || key;
    },
    [ready, currentLocale, ns]
  );

  const changeLocale = useCallback(async (locale: Locale) => {
    await i18next.changeLanguage(locale);
    setCurrentLocale(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos-locale', locale);
    }
  }, []);

  return {
    t,
    i18n: i18next,
    locale: currentLocale,
    changeLocale,
    ready,
  };
}
