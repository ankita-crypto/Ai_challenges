import { useState } from 'react';
import { isWithinStorageBudget, redactError } from '../utils/security';

interface UseLocalStorageOptions<T> {
  sanitize?: (value: unknown) => T;
  maxBytes?: number;
}

const SAFE_STORAGE_KEY = /^zenstudy_[a-z0-9_:-]{1,48}$/;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((val: T) => T)) => void] {
  if (!SAFE_STORAGE_KEY.test(key)) {
    throw new Error('Unsafe localStorage key rejected');
  }

  const sanitizeValue = options.sanitize ?? ((value: unknown) => value as T);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? sanitizeValue(JSON.parse(item)) : initialValue;
    } catch (error) {
      console.warn(`Storage read skipped for ${key}: ${redactError(error)}`);
      window.localStorage.removeItem(key);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const nextValue = value instanceof Function ? value(storedValue) : value;
      const valueToStore = sanitizeValue(nextValue);

      if (!isWithinStorageBudget(valueToStore, options.maxBytes)) {
        throw new Error('localStorage value exceeds safe size budget');
      }

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Storage write skipped for ${key}: ${redactError(error)}`);
    }
  };

  return [storedValue, setValue];
}
