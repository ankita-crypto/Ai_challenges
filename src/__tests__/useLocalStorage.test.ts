import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('zenstudy_test_key', 'default_val'));
    
    expect(result.current[0]).toBe('default_val');
    expect(window.localStorage.getItem('zenstudy_test_key')).toBeNull();
  });

  it('should initialize with value from localStorage if preset', () => {
    window.localStorage.setItem('zenstudy_test_key', JSON.stringify('stored_val'));
    
    const { result } = renderHook(() => useLocalStorage('zenstudy_test_key', 'default_val'));
    
    expect(result.current[0]).toBe('stored_val');
  });

  it('should persist new values in localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('zenstudy_test_key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('zenstudy_test_key')).toBe(JSON.stringify('updated'));
  });

  it('should handle functional updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage<number>('zenstudy_test_counter', 10));
    
    act(() => {
      result.current[1](prev => prev + 5);
    });
    
    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('zenstudy_test_counter')).toBe(JSON.stringify(15));
  });

  it('should reject unsafe storage keys', () => {
    expect(() => renderHook(() => useLocalStorage('unsafe_key', 'value'))).toThrow('Unsafe localStorage key rejected');
  });

  it('should sanitize loaded values and remove malformed JSON', () => {
    window.localStorage.setItem('zenstudy_profile', '{broken-json');
    const { result } = renderHook(() => useLocalStorage('zenstudy_profile', 'Student'));

    expect(result.current[0]).toBe('Student');
    expect(window.localStorage.getItem('zenstudy_profile')).toBeNull();
  });

  it('should skip writes that exceed storage budget', () => {
    const { result } = renderHook(() => useLocalStorage('zenstudy_budget', 'safe', { maxBytes: 8 }));

    act(() => {
      result.current[1]('this value is too large');
    });

    expect(result.current[0]).toBe('safe');
    expect(window.localStorage.getItem('zenstudy_budget')).toBeNull();
  });
});
