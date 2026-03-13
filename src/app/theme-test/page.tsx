'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeTestPage() {
  const { theme, resolvedTheme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Theme Test</h1>

      <div className="space-y-2">
        <p>Current theme: <strong>{theme || 'not set'}</strong></p>
        <p>Resolved theme: <strong>{resolvedTheme || 'not set'}</strong></p>
        <p>Available themes: <strong>{themes?.join(', ') || 'none'}</strong></p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTheme('light')} className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Light
        </button>
        <button onClick={() => setTheme('dark')} className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Dark
        </button>
        <button onClick={() => setTheme('high-contrast')} className="px-4 py-2 bg-primary text-primary-foreground rounded">
          High Contrast
        </button>
        <button onClick={() => setTheme('system')} className="px-4 py-2 bg-primary text-primary-foreground rounded">
          System
        </button>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Colors:</h2>
        <div className="space-y-2">
          <div className="p-4 bg-primary text-primary-foreground rounded">
            Primary button
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded">
            Secondary
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded">
            Accent
          </div>
          <div className="p-4 bg-success text-success-foreground rounded">
            Success
          </div>
          <div className="p-4 bg-warning text-warning-foreground rounded">
            Warning
          </div>
          <div className="p-4 bg-destructive text-destructive-foreground rounded">
            Destructive
          </div>
        </div>
      </div>
    </div>
  );
}
