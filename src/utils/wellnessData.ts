import type { MoodType, TriggerOption } from '../types/wellness';

export const MOOD_TYPES: MoodType[] = [
  { id: 'calm', label: 'Calm & Focused', emoji: '🌿', rating: 5, color: '#0d9488' },
  { id: 'energetic', label: 'Energized', emoji: '⚡', rating: 4, color: '#f59e0b' },
  { id: 'uncertain', label: 'Uncertain / Doubting', emoji: '🌫️', rating: 3, color: '#a855f7' },
  { id: 'stressed', label: 'Stressed / Anxious', emoji: '😰', rating: 2, color: '#6366f1' },
  { id: 'burned_out', label: 'Burned Out', emoji: '🔋', rating: 1, color: '#ef4444' }
];

export const TRIGGER_OPTIONS: TriggerOption[] = [
  { id: 'backlog', label: 'Syllabus Backlog' },
  { id: 'mock_tests', label: 'Mock Test Scores' },
  { id: 'family_pressure', label: 'Family Expectations' },
  { id: 'peer_comparison', label: 'Comparing to Peers' },
  { id: 'sleep_deprived', label: 'Lack of Sleep' },
  { id: 'time_management', label: 'Time Management' },
  { id: 'exam_date', label: 'Exam Date Approaching' },
  { id: 'general_life', label: 'Non-Academic Issues' }
];

export const MOOD_LABELS = Object.fromEntries(MOOD_TYPES.map((mood) => [mood.id, mood.label])) as Record<MoodType['id'], string>;
export const TRIGGER_LABELS = Object.fromEntries(TRIGGER_OPTIONS.map((trigger) => [trigger.id, trigger.label])) as Record<TriggerOption['id'], string>;
