export type ReadPages = number[];

export type Language = 'id' | 'en';

export interface TargetSettings {
  enabled: boolean;
  mode: 'days' | 'khatam_per_month'; // Target by days or khatam per month
  targetDays: number;        // Used when mode = 'days'
  khatamPerMonth: number;    // Used when mode = 'khatam_per_month'
  startDate: string;         // ISO date string when target started (YYYY-MM-DD)
}

export interface AppSettings {
  language: Language;
  target?: TargetSettings;   // Optional target settings
}

export interface KhatamCompletion {
  id: string;           // Unique ID (timestamp)
  completedAt: string;  // ISO date string
  totalDays: number;    // Days taken for this khatam
}

export interface KhatamHistory {
  completions: KhatamCompletion[];
  totalCount: number;
}

export interface JuzDefinition {
  id: number;
  nameAr: string;
  nameEn: string;
  startPage: number;
  endPage: number;
  totalPages: number;
}

export interface JuzProgress {
  juz: JuzDefinition;
  pagesRead: number;
  totalPages: number;
  percentage: number;
}

export interface OverallProgress {
  pagesRead: number;
  totalPages: number;
  percentage: number;
}

// Key = date string "YYYY-MM-DD", Value = number of pages read that day
export type DailyLog = Record<string, number>;
