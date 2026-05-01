/**
 * useTheme — manages light/dark theme with localStorage persistence.
 * Uses utils/storage.ts helpers instead of raw localStorage.
 */
import { useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage } from '@/utils/storage';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getFromStorage<Theme>('medisave-theme');
    if (stored) return stored;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    saveToStorage('medisave-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}
