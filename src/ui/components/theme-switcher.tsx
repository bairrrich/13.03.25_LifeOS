'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { Sun, Moon, Monitor, Contrast } from 'lucide-react';
import { useTranslation } from '@/shared/lib/use-translation';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('theme.toggle')}>
          {theme === 'light' && <Sun className="h-5 w-5" />}
          {theme === 'dark' && <Moon className="h-5 w-5" />}
          {theme === 'high-contrast' && <Contrast className="h-5 w-5" />}
          {!theme && <Monitor className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setTheme('light'); }}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{t('theme.light')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setTheme('dark'); }}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{t('theme.dark')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setTheme('high-contrast'); }}>
          <Contrast className="mr-2 h-4 w-4" />
          <span>{t('theme.highContrast')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setTheme('system'); }}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>{t('theme.system')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
