import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ReadPages, JuzProgress, OverallProgress, DailyLog } from '@/types';
import { getReadPages, saveReadPages, clearAllData, getDailyLog, saveDailyLog } from '@/services/storage';
import { getJuzProgress, getOverallProgress } from '@/utils/progress';
import { JUZ_DATA } from '@/constants/quranData';

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface ProgressContextType {
  readPages: ReadPages;
  isLoading: boolean;
  juzProgress: JuzProgress[];
  overallProgress: OverallProgress;
  dailyLog: DailyLog;
  todayPages: number;
  togglePage: (page: number) => void;
  markUpToPage: (page: number) => void;
  markJuz: (juzId: number, markAs: 'read' | 'unread') => void;
  resetAll: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [readPages, setReadPages] = useState<ReadPages>([]);
  const [dailyLog, setDailyLog] = useState<DailyLog>({});
  const [isLoading, setIsLoading] = useState(true);
  const dailyLogRef = useRef<DailyLog>({});

  useEffect(() => {
    Promise.all([getReadPages(), getDailyLog()]).then(([pages, log]) => {
      setReadPages(pages);
      setDailyLog(log);
      dailyLogRef.current = log;
      setIsLoading(false);
    });
  }, []);

  const recordDaily = useCallback((prevPages: ReadPages, newPages: ReadPages) => {
    const prevSet = new Set(prevPages);
    const newSet = new Set(newPages);
    let added = 0;
    let removed = 0;
    for (const p of newSet) {
      if (!prevSet.has(p)) added++;
    }
    for (const p of prevSet) {
      if (!newSet.has(p)) removed++;
    }
    const net = added - removed;
    if (net === 0) return;

    const today = getTodayKey();
    const log = { ...dailyLogRef.current };
    log[today] = Math.max(0, (log[today] || 0) + net);
    dailyLogRef.current = log;
    setDailyLog(log);
    saveDailyLog(log);
  }, []);

  const togglePage = useCallback((page: number) => {
    setReadPages((prev) => {
      const set = new Set(prev);
      if (set.has(page)) {
        set.delete(page);
      } else {
        set.add(page);
      }
      const updated = Array.from(set).sort((a, b) => a - b);
      saveReadPages(updated);
      recordDaily(prev, updated);
      return updated;
    });
  }, [recordDaily]);

  const markUpToPage = useCallback((page: number) => {
    setReadPages((prev) => {
      const set = new Set(prev);
      const isAlreadyRead = set.has(page);

      if (isAlreadyRead) {
        for (let p = page; p <= 604; p++) {
          set.delete(p);
        }
      } else {
        for (let p = 1; p <= page; p++) {
          set.add(p);
        }
      }

      const updated = Array.from(set).sort((a, b) => a - b);
      saveReadPages(updated);
      recordDaily(prev, updated);
      return updated;
    });
  }, [recordDaily]);

  const markJuz = useCallback((juzId: number, markAs: 'read' | 'unread') => {
    const juz = JUZ_DATA.find((j) => j.id === juzId);
    if (!juz) return;

    setReadPages((prev) => {
      const set = new Set(prev);
      for (let p = juz.startPage; p <= juz.endPage; p++) {
        if (markAs === 'read') {
          set.add(p);
        } else {
          set.delete(p);
        }
      }
      const updated = Array.from(set).sort((a, b) => a - b);
      saveReadPages(updated);
      recordDaily(prev, updated);
      return updated;
    });
  }, [recordDaily]);

  const resetAll = useCallback(async () => {
    await clearAllData();
    setReadPages([]);
    setDailyLog({});
    dailyLogRef.current = {};
  }, []);

  const juzProgress = useMemo(() => getJuzProgress(readPages), [readPages]);
  const overallProgress = useMemo(() => getOverallProgress(readPages), [readPages]);
  const todayPages = dailyLog[getTodayKey()] || 0;

  return (
    <ProgressContext.Provider
      value={{ readPages, isLoading, juzProgress, overallProgress, dailyLog, todayPages, togglePage, markUpToPage, markJuz, resetAll }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
