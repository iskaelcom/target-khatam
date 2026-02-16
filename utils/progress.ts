import { JUZ_DATA, TOTAL_PAGES } from '@/constants/quranData';
import { ReadPages, JuzProgress, OverallProgress, JuzDefinition } from '@/types';

export function getJuzProgress(readPages: ReadPages): JuzProgress[] {
  const readSet = new Set(readPages);
  return JUZ_DATA.map((juz) => {
    let pagesRead = 0;
    for (let p = juz.startPage; p <= juz.endPage; p++) {
      if (readSet.has(p)) pagesRead++;
    }
    return {
      juz,
      pagesRead,
      totalPages: juz.totalPages,
      percentage: Math.round((pagesRead / juz.totalPages) * 100),
    };
  });
}

export function getOverallProgress(readPages: ReadPages): OverallProgress {
  return {
    pagesRead: readPages.length,
    totalPages: TOTAL_PAGES,
    percentage: Math.round((readPages.length / TOTAL_PAGES) * 100),
  };
}

export function getJuzById(id: number): JuzDefinition | undefined {
  return JUZ_DATA.find((j) => j.id === id);
}

export function getBarColor(percentage: number): string {
  if (percentage === 100) return '#2E7D32';
  if (percentage >= 50) return '#66BB6A';
  if (percentage > 0) return '#C8A951';
  return '#E0E0E0';
}
