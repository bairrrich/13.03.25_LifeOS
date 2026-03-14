'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Moon,
  Sun,
  Monitor,
  Dumbbell,
  Heart,
  CheckCircle2,
  Target,
  Book,
  Sparkles,
  Wallet,
  Utensils,
  Globe,
  Search,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/ui/components/command';
import { useTranslation } from '@/shared/lib/use-translation';

const navigationItems = [
  {
    group: 'navigation',
    items: [
      { icon: Calculator, label: 'nav.dashboard', href: '/' },
      { icon: Wallet, label: 'nav.finance', href: '/finance' },
      { icon: Utensils, label: 'nav.nutrition', href: '/nutrition' },
      { icon: Dumbbell, label: 'nav.workouts', href: '/workouts' },
      { icon: Heart, label: 'nav.health', href: '/health' },
      { icon: CheckCircle2, label: 'nav.habits', href: '/habits' },
      { icon: Target, label: 'nav.goals', href: '/goals' },
      { icon: Book, label: 'nav.mind', href: '/mind' },
      { icon: Sparkles, label: 'nav.beauty', href: '/beauty' },
    ],
  },
  {
    group: 'actions',
    items: [
      { icon: CreditCard, label: 'finance.addTransaction', href: '/finance', action: '' },
      { icon: Calendar, label: 'habits.addHabit', href: '/habits', action: '' },
      { icon: Utensils, label: 'nutrition.addMeal', href: '/nutrition', action: '' },
      { icon: Dumbbell, label: 'workouts.addWorkout', href: '/workouts', action: '' },
    ],
  },
  {
    group: 'settings',
    items: [
      { icon: Moon, label: 'theme.dark', action: 'theme:dark' },
      { icon: Sun, label: 'theme.light', action: 'theme:light' },
      { icon: Monitor, label: 'theme.system', action: 'theme:system' },
      { icon: Globe, label: 'language.ru', action: 'lang:ru' },
      { icon: Globe, label: 'language.en', action: 'lang:en' },
    ],
  },
] as const;

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { changeLocale } = useTranslation();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (action: string, href?: string) => {
    setOpen(false);

    if (href && href !== '') {
      router.push(href);
    }

    if (action && action.startsWith('theme:')) {
      const theme = action.split(':')[1];
      setTheme(theme);
    }

    if (action && action.startsWith('lang:')) {
      const lang = action.split(':')[1] as 'ru' | 'en';
      changeLocale(lang);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Поиск команд или страниц..." />
      <CommandList>
        <CommandEmpty>Ничего не найдено.</CommandEmpty>
        {navigationItems.map((group) => (
          <React.Fragment key={group.group}>
            <CommandGroup heading={group.group === 'navigation' ? 'Навигация' : group.group === 'actions' ? 'Действия' : 'Настройки'}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => handleSelect('action' in item ? item.action || '' : '', 'href' in item ? item.href : undefined)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
