export const MOOD_IDS = ['calm', 'energetic', 'uncertain', 'stressed', 'burned_out'] as const;
export const TRIGGER_IDS = [
  'backlog',
  'mock_tests',
  'family_pressure',
  'peer_comparison',
  'sleep_deprived',
  'time_management',
  'exam_date',
  'general_life'
] as const;
export const EXAM_IDS = ['JEE', 'NEET', 'UPSC', 'BOARDS', 'GENERAL'] as const;

export type MoodId = (typeof MOOD_IDS)[number];
export type TriggerId = (typeof TRIGGER_IDS)[number];
export type ExamId = (typeof EXAM_IDS)[number];
export type ThemeMode = 'dark' | 'light';
export type AppTab = 'dashboard' | 'tracker' | 'analytics' | 'bot' | 'tools';
export type WellnessToolId = 'breathing' | 'grounding' | 'timer';
export type ToolActionEffect = 'show_breathing' | 'show_grounding' | 'show_timer';

export interface MoodLog {
  id: string;
  date: string;
  mood: MoodId;
  rating: 1 | 2 | 3 | 4 | 5;
  triggers: TriggerId[];
  notes: string;
}

export interface MoodType {
  id: MoodId;
  label: string;
  emoji: string;
  rating: MoodLog['rating'];
  color: string;
}

export interface TriggerOption {
  id: TriggerId;
  label: string;
}
