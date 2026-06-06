import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    
    expect(result.current[0]).toBe('default_val');
    expect(window.localStorage.getItem('test_key')).toBeNull();
  });

  it('should initialize with value from localStorage if preset', () => {
    window.localStorage.setItem('test_key', JSON.stringify('stored_val'));
    
    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    
    expect(result.current[0]).toBe('stored_val');
  });

  it('should persist new values in localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test_key')).toBe(JSON.stringify('updated'));
  });

  it('should handle functional updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage<number>('test_counter', 10));
    
    act(() => {
      result.current[1](prev => prev + 5);
    });
    
    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('test_counter')).toBe(JSON.stringify(15));
  });
});
