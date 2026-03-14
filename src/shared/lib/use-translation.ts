'use client';

import { useEffect, useState, useCallback } from 'react';
import i18next, { defaultLocale, locales } from '@/shared/lib/i18n';

export type Locale = 'ru' | 'en';

export function useTranslation(ns: string = 'common') {
  const [ready, setReady] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  const [, forceUpdate] = useState(0);

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

    // Подписка на изменения языка
    const handleLanguageChanged = () => {
      setCurrentLocale(i18next.language as Locale);
      forceUpdate(n => n + 1); // Принудительная перерисовка
    };

    i18next.on('languageChanged', handleLanguageChanged);

    return () => {
      i18next.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const t = useCallback(
    (key: string, defaultValue?: string) => {
      // Если ready=false, используем i18n напрямую для получения перевода
      if (!ready) {
        try {
          // Получаем сохранённый язык или используем default
          const stored = typeof window !== 'undefined' ? localStorage.getItem('lifeos-locale') : null;
          const locale = (stored && locales.includes(stored as Locale)) ? stored as Locale : defaultLocale;
          const value = i18next.getResourceBundle(locale, ns);
          const keys = key.split('.');
          let result: unknown = value;
          for (const k of keys) {
            if (result && typeof result === 'object') {
              result = (result as Record<string, unknown>)[k];
            } else {
              break;
            }
          }
          return typeof result === 'string' ? result : defaultValue !== undefined ? defaultValue : key;
        } catch {
          return defaultValue !== undefined ? defaultValue : key;
        }
      }

      const keys = key.split('.');
      const resource = i18next.getResourceBundle(currentLocale, ns);
      let value: unknown = resource;

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[k];
        } else {
          return defaultValue !== undefined ? defaultValue : key;
        }
      }

      return typeof value === 'string' ? value : defaultValue !== undefined ? defaultValue : key;
    },
    [ready, currentLocale, ns]
  );

  const changeLocale = useCallback(async (locale: Locale) => {
    await i18next.changeLanguage(locale);
    setCurrentLocale(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos-locale', locale);
    }
    // Принудительная перерисовка
    forceUpdate(n => n + 1);
  }, []);

  return {
    t,
    i18n: i18next,
    locale: currentLocale,
    changeLocale,
    ready,
  };
}
