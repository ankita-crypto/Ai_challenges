import { EXAM_IDS, MOOD_IDS, TRIGGER_IDS, type ExamId, type MoodLog, type ThemeMode, type TriggerId } from '../types/wellness';

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/g;
const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

export function secureRandom(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 4294967295;
  }
  return Math.random();
}

export const SECURITY_LIMITS = {
  userName: 32,
  journalNote: 1200,
  chatMessage: 240,
  groundingEntry: 300,
  moodLogs: 100,
  localStorageBytes: 120_000
} as const;

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"'`]/g, (char) => HTML_ENTITY_MAP[char]);
}

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value
    .normalize('NFKC')
    .replace(CONTROL_CHARS, ' ')
    .replace(/\s{3,}/g, ' ')
    .trim()
    .slice(0, maxLength);

  return escapeHtml(normalized);
}

export function sanitizePlainText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFKC')
    .replace(CONTROL_CHARS, ' ')
    .replace(/\s{3,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function isValidMoodId(value: unknown): value is MoodLog['mood'] {
  return typeof value === 'string' && MOOD_IDS.includes(value as MoodLog['mood']);
}

export function isValidTriggerId(value: unknown): value is TriggerId {
  return typeof value === 'string' && TRIGGER_IDS.includes(value as TriggerId);
}

export function sanitizeUserName(value: unknown): string {
  return sanitizeText(value, SECURITY_LIMITS.userName) || 'Student';
}

export function sanitizeExamId(value: unknown): ExamId {
  return EXAM_IDS.includes(value as ExamId) ? (value as ExamId) : 'GENERAL';
}

export function sanitizeTheme(value: unknown): ThemeMode {
  return value === 'light' || value === 'dark' ? value : 'dark';
}

export function sanitizePomodoroCount(value: unknown): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10_000 ? value : 0;
}

export function sanitizeMoodLog(value: unknown): MoodLog | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<MoodLog>;
  if (!isValidMoodId(candidate.mood)) {
    return null;
  }

  const timestamp = typeof candidate.date === 'string' ? Date.parse(candidate.date) : Number.NaN;
  const date = Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : new Date().toISOString();
  const rawRating = candidate.rating;
  const rating = typeof rawRating === 'number' && Number.isInteger(rawRating) && rawRating >= 1 && rawRating <= 5
    ? rawRating as MoodLog['rating']
    : 3;
  const triggers = Array.isArray(candidate.triggers)
    ? Array.from(new Set(candidate.triggers.filter(isValidTriggerId)))
    : [];

  return {
    id: sanitizePlainText(candidate.id, 64) || crypto.randomUUID(),
    date,
    mood: candidate.mood,
    rating,
    triggers,
    notes: sanitizeText(candidate.notes, SECURITY_LIMITS.journalNote)
  };
}

export function sanitizeMoodLogs(value: unknown): MoodLog[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(sanitizeMoodLog)
    .filter((log): log is MoodLog => Boolean(log))
    .slice(0, SECURITY_LIMITS.moodLogs);
}

export function isWithinStorageBudget(value: unknown, maxBytes: number = SECURITY_LIMITS.localStorageBytes): boolean {
  return new Blob([JSON.stringify(value)]).size <= maxBytes;
}

export function redactError(error: unknown): string {
  if (error instanceof Error) {
    return error.name || 'ApplicationError';
  }

  return 'ApplicationError';
}
