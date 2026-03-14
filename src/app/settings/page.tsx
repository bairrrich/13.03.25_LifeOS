'use client';

import React from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { useTheme } from 'next-themes';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Select } from '@/ui/components/select';
import { Label } from '@/ui/components/label';
import { Separator } from '@/ui/components/separator';
import { Moon, Sun, Monitor, Globe, Calendar, Check, Bell } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const themes = [
  { id: 'light', label: 'theme.light', icon: Sun },
  { id: 'dark', label: 'theme.dark', icon: Moon },
  { id: 'system', label: 'theme.system', icon: Monitor },
];

const languages = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'ru', label: 'Русский', native: 'Русский' },
];

const weekStartDays = [
  { id: 'monday', label: 'settings.monday' },
  { id: 'sunday', label: 'settings.sunday' },
  { id: 'saturday', label: 'settings.saturday' },
];

const currencies = [
  { id: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { id: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { id: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { id: 'RUB', label: 'RUB - Russian Ruble', symbol: '₽' },
];

export default function SettingsPage() {
  const { t, locale, changeLocale } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [selectedTheme, setSelectedTheme] = React.useState(theme || 'system');
  const [selectedLanguage, setSelectedLanguage] = React.useState(locale);
  const [weekStartDay, setWeekStartDay] = React.useState('monday');
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Синхронизация с текущим языком
  React.useEffect(() => {
    setSelectedLanguage(locale || 'en');
  }, [locale]);

  // Загрузка сохранённой валюты
  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lifeos-currency') : null;
    if (stored) {
      setSelectedCurrency(stored);
    }
  }, []);

  // Загрузка настроек уведомлений
  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lifeos-notifications') : null;
    if (stored !== null) {
      setNotificationsEnabled(stored === 'true');
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  const handleLanguageChange = async (newLocale: 'ru' | 'en') => {
    setSelectedLanguage(newLocale);
    await changeLocale(newLocale);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos-currency', newCurrency);
    }
  };

  const handleNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos-notifications', String(newValue));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('nav.settings')}</h1>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>

        <Separator />

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <CardTitle>{t('settings.appearance')}</CardTitle>
            </div>
            <CardDescription>{t('settings.appearanceDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.id}
                  variant={selectedTheme === themeOption.id ? 'default' : 'outline'}
                  className={cn(
                    'flex flex-col items-center gap-2 h-auto py-4',
                    selectedTheme === themeOption.id && 'border-primary'
                  )}
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <themeOption.icon className="h-6 w-6" />
                  <span>{t(themeOption.label)}</span>
                  {selectedTheme === themeOption.id && (
                    <Check className="h-4 w-4 absolute top-2 right-2" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>{t('settings.language')}</CardTitle>
            </div>
            <CardDescription>{t('settings.languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={selectedLanguage === lang.id ? 'default' : 'outline'}
                  className={cn(
                    'flex flex-col items-start gap-1 h-auto py-4 px-4',
                    selectedLanguage === lang.id && 'border-primary'
                  )}
                  onClick={() => handleLanguageChange(lang.id as 'ru' | 'en')}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{lang.native}</span>
                    {selectedLanguage === lang.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{lang.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>{t('settings.currency')}</CardTitle>
            </div>
            <CardDescription>{t('settings.currencyDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {currencies.map((currency) => (
                <Button
                  key={currency.id}
                  variant={selectedCurrency === currency.id ? 'default' : 'outline'}
                  className={cn(
                    'flex flex-col items-start gap-1 h-auto py-4 px-4',
                    selectedCurrency === currency.id && 'border-primary'
                  )}
                  onClick={() => handleCurrencyChange(currency.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{currency.symbol}</span>
                    {selectedCurrency === currency.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{currency.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>{t('settings.notifications')}</CardTitle>
            </div>
            <CardDescription>{t('settings.notificationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant={notificationsEnabled ? 'default' : 'outline'}
              onClick={handleNotificationToggle}
              className="w-full"
            >
              {notificationsEnabled ? '🔔 Включены' : '🔕 Выключены'}
            </Button>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>{t('settings.calendar')}</CardTitle>
            </div>
            <CardDescription>{t('settings.calendarDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.weekStart')}</Label>
              <div className="grid gap-2">
                {weekStartDays.map((day) => (
                  <Button
                    key={day.id}
                    variant={weekStartDay === day.id ? 'default' : 'outline'}
                    className={cn(
                      'flex items-center justify-between',
                      weekStartDay === day.id && 'border-primary'
                    )}
                    onClick={() => setWeekStartDay(day.id)}
                  >
                    <span>{t(day.label)}</span>
                    {weekStartDay === day.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.data')}</CardTitle>
            <CardDescription>{t('settings.dataDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              {t('settings.clearData')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
