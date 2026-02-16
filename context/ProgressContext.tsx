import { JUZ_DATA, TOTAL_PAGES } from '@/constants/quranData';
import { clearAllData, getDailyLog, getReadPages, getSettings, saveDailyLog, saveReadPages, saveSettings } from '@/services/storage';
import { DailyLog, JuzProgress, OverallProgress, ReadPages, TargetSettings } from '@/types';
import { getJuzProgress, getOverallProgress } from '@/utils/progress';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

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
  targetSettings: TargetSettings;
  dailyTarget: number | null;
  daysRemaining: number | null;
  togglePage: (page: number) => void;
  markUpToPage: (page: number) => void;
  markJuz: (juzId: number, markAs: 'read' | 'unread') => void;
  updateTargetSettings: (settings: TargetSettings) => Promise<void>;
  resetAll: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [readPages, setReadPages] = useState<ReadPages>([]);
  const [dailyLog, setDailyLog] = useState<DailyLog>({});
  const [targetSettings, setTargetSettings] = useState<TargetSettings>({
    enabled: false,
    mode: 'days',
    targetDays: 30,
    khatamPerMonth: 2,
    startDate: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const dailyLogRef = useRef<DailyLog>({});

  useEffect(() => {
    Promise.all([getReadPages(), getDailyLog(), getSettings()]).then(([pages, log, settings]) => {
      setReadPages(pages);
      setDailyLog(log);
      dailyLogRef.current = log;
      if (settings.target) {
        setTargetSettings(settings.target);
      }
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

  const updateTargetSettings = useCallback(async (settings: TargetSettings) => {
    setTargetSettings(settings);
    const appSettings = await getSettings();
    appSettings.target = settings;
    await saveSettings(appSettings);
  }, []);

  const resetAll = useCallback(async () => {
    await clearAllData();
    setReadPages([]);
    setDailyLog({});
    dailyLogRef.current = {};
    setTargetSettings({ enabled: false, mode: 'days', targetDays: 30, khatamPerMonth: 2, startDate: '' });
  }, []);

  const juzProgress = useMemo(() => getJuzProgress(readPages), [readPages]);
  const overallProgress = useMemo(() => getOverallProgress(readPages), [readPages]);
  const todayPages = dailyLog[getTodayKey()] || 0;

  // Calculate effective target days and total pages based on mode
  const { effectiveTargetDays, targetTotalPages } = useMemo(() => {
    if (targetSettings.mode === 'khatam_per_month') {
      return {
        effectiveTargetDays: 30, // Fixed 30 days for monthly cycle
        targetTotalPages: TOTAL_PAGES * targetSettings.khatamPerMonth,
      };
    }
    return {
      effectiveTargetDays: targetSettings.targetDays,
      targetTotalPages: TOTAL_PAGES, // Single khatam
    };
  }, [targetSettings.mode, targetSettings.targetDays, targetSettings.khatamPerMonth]);

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    if (!targetSettings.enabled || !targetSettings.startDate) return null;

    const start = new Date(targetSettings.startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (targetSettings.mode === 'khatam_per_month') {
      // For khatam mode, show remaining days in CURRENT khatam cycle
      const daysPerKhatam = 30 / targetSettings.khatamPerMonth;
      const currentCycleDays = daysPassed % daysPerKhatam;
      const remaining = Math.ceil(daysPerKhatam - currentCycleDays);
      return Math.max(0, remaining);
    }

    // For days mode, show total remaining days
    const remaining = effectiveTargetDays - daysPassed;
    return Math.max(0, remaining);
  }, [targetSettings, effectiveTargetDays]);

  // Calculate daily target
  const dailyTarget = useMemo(() => {
    if (!targetSettings.enabled || !targetSettings.startDate || daysRemaining === null) return null;

    const remaining = targetTotalPages - overallProgress.pagesRead;
    const daysLeft = daysRemaining || 1;
    return Math.ceil(remaining / daysLeft);
  }, [targetSettings, targetTotalPages, overallProgress.pagesRead, daysRemaining]);

  return (
    <ProgressContext.Provider
      value={{
        readPages,
        isLoading,
        juzProgress,
        overallProgress,
        dailyLog,
        todayPages,
        targetSettings,
        dailyTarget,
        daysRemaining,
        togglePage,
        markUpToPage,
        markJuz,
        updateTargetSettings,
        resetAll,
      }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
