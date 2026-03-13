'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="lifeos-theme"
      themes={['light', 'dark', 'high-contrast']}
    >
      {children}
    </NextThemesProvider>
  );
}
