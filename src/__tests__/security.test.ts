import { describe, expect, it } from 'vitest';
import {
  sanitizeExamId,
  sanitizeMoodLog,
  sanitizeMoodLogs,
  sanitizePomodoroCount,
  sanitizeText,
  sanitizeTheme,
  sanitizeUserName,
  SECURITY_LIMITS
} from '../utils/security';

describe('security validation and sanitization', () => {
  it('escapes HTML-sensitive characters in user supplied text', () => {
    expect(sanitizeText('<img src=x onerror=alert(1)>', 100)).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('bounds text length and removes control characters', () => {
    expect(sanitizeText('hello\u0000 world', 5)).toBe('hello');
  });

  it('sanitizes profile preferences to safe defaults', () => {
    expect(sanitizeUserName('')).toBe('Student');
    expect(sanitizeExamId('UNKNOWN')).toBe('GENERAL');
    expect(sanitizeTheme('solarized')).toBe('dark');
    expect(sanitizePomodoroCount(-1)).toBe(0);
  });

  it('drops invalid mood logs and invalid trigger IDs', () => {
    const sanitized = sanitizeMoodLog({
      id: 'abc',
      date: '2026-06-06T07:00:00.000Z',
      mood: 'stressed',
      rating: 2,
      triggers: ['mock_tests', 'bad_trigger'],
      notes: '<script>alert(1)</script>'
    });

    expect(sanitized).toMatchObject({
      mood: 'stressed',
      rating: 2,
      triggers: ['mock_tests'],
      notes: '&lt;script&gt;alert(1)&lt;/script&gt;'
    });
  });

  it('limits restored mood logs to the retention budget', () => {
    const logs = Array.from({ length: SECURITY_LIMITS.moodLogs + 5 }, (_, index) => ({
      id: String(index),
      date: new Date().toISOString(),
      mood: 'calm',
      rating: 5,
      triggers: [],
      notes: 'ok'
    }));

    expect(sanitizeMoodLogs(logs)).toHaveLength(SECURITY_LIMITS.moodLogs);
    expect(sanitizeMoodLogs([{ mood: 'invalid' }])).toHaveLength(0);
  });
});
