'use client';

import * as React from 'react';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, changeLocale, ready } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Languages className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLocale('ru')}
          className={locale === 'ru' ? 'bg-accent' : ''}
        >
          🇷🇺 Русский
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
