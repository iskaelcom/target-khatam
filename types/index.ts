export type ReadPages = number[];

export type Language = 'id' | 'en';

export interface AppSettings {
  language: Language;
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
