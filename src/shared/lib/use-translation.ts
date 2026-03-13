'use client';

import { useEffect, useState } from 'react';
import i18next, { defaultLocale, type Locale } from '@/shared/lib/i18n';

export function useTranslation(ns: string = 'common') {
  const [ready, setReady] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setReady(true);
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    const resource = i18next.getResourceBundle(currentLocale, ns);
    let value: unknown = resource;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const changeLocale = async (locale: Locale) => {
    await i18next.changeLanguage(locale);
    setCurrentLocale(locale);
  };

  return {
    t,
    i18n: i18next,
    locale: currentLocale,
    changeLocale,
    ready,
  };
}
