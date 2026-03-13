'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const defaultLocale = 'ru';
export const locales = ['ru', 'en'] as const;
export const namespaces = ['common'] as const;

export type Locale = (typeof locales)[number];
export type Namespace = (typeof namespaces)[number];

// Инициализация только на клиенте
if (typeof window !== 'undefined') {
  i18next.use(initReactI18next);
  i18next.use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/../public/locales/${language}/${namespace}.json`)
    )
  );
  i18next.init({
    lng: defaultLocale,
    fallbackLng: 'ru',
    supportedLngs: locales,
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: namespaces,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18next;
