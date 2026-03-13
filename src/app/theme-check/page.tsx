'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeCheckPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [htmlAttr, setHtmlAttr] = useState('');

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    setHtmlAttr(html.getAttribute('data-theme') || 'not set');

    const observer = new MutationObserver(() => {
      setHtmlAttr(html.getAttribute('data-theme') || 'not set');
    });

    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Theme Check</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Theme Check</h1>

      <div className="space-y-2 p-4 border rounded-lg">
        <p><strong>theme:</strong> {theme || 'null'}</p>
        <p><strong>resolvedTheme:</strong> {resolvedTheme || 'null'}</p>
        <p><strong>data-theme attribute:</strong> {htmlAttr}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTheme('light')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Set Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Set Dark
        </button>
        <button
          onClick={() => setTheme('high-contrast')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Set High Contrast
        </button>
        <button
          onClick={() => setTheme('system')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Set System
        </button>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Test Colors:</h2>
        <div className="p-4 bg-background text-foreground rounded">
          <p className="font-semibold">Background/Foreground</p>
          <p className="text-sm">bg: var(--background), text: var(--foreground)</p>
        </div>
        <div className="p-4 bg-primary text-primary-foreground rounded">
          <p className="font-semibold">Primary</p>
          <p className="text-sm">bg: var(--primary), text: var(--primary-foreground)</p>
        </div>
        <div className="p-4 bg-card text-card-foreground rounded border">
          <p className="font-semibold">Card</p>
          <p className="text-sm">bg: var(--card), text: var(--card-foreground)</p>
        </div>
        <div className="p-4 bg-secondary text-secondary-foreground rounded">
          <p className="font-semibold">Secondary</p>
          <p className="text-sm">bg: var(--secondary), text: var(--secondary-foreground)</p>
        </div>
      </div>
    </div>
  );
}
