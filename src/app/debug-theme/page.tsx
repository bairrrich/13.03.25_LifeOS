'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/ui/components/button';

export default function DebugPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Theme Debug</h1>
      <p>theme: {theme || 'not set'}</p>
      <p>resolvedTheme: {resolvedTheme || 'not set'}</p>

      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')}>Light</Button>
        <Button onClick={() => setTheme('dark')}>Dark</Button>
        <Button onClick={() => setTheme('high-contrast')}>High Contrast</Button>
        <Button onClick={() => setTheme('system')}>System</Button>
      </div>
    </div>
  );
}
