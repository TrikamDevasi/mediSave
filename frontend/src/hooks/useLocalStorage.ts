/**
 * useLocalStorage — persistent state backed by localStorage.
 * Uses utils/storage.ts helpers internally (never raw localStorage).
 */
import { useState, useCallback } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const existing = getFromStorage<T>(key);
    return existing !== null ? existing : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        saveToStorage(key, next);
        return next;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    removeFromStorage(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
