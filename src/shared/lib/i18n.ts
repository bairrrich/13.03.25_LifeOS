import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const defaultLocale = 'ru';
export const locales = ['ru', 'en'];

export type Locale = (typeof locales)[number];

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`@/../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: defaultLocale,
    fallbackLng: 'ru',
    supportedLngs: locales,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
