import { AppSettings, DailyLog, KhatamCompletion, KhatamHistory, ReadPages } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  READ_PAGES: '@target-khatam/read-pages',
  SETTINGS: '@target-khatam/settings',
  DAILY_LOG: '@target-khatam/daily-log',
  KHATAM_HISTORY: '@target-khatam/khatam-history',
} as const;

export async function getReadPages(): Promise<ReadPages> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.READ_PAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveReadPages(pages: ReadPages): Promise<void> {
  await AsyncStorage.setItem(KEYS.READ_PAGES, JSON.stringify(pages));
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (raw) {
      const settings = JSON.parse(raw);
      // Ensure target has default values if not present
      if (!settings.target) {
        settings.target = {
          enabled: false,
          mode: 'days',
          targetDays: 30,
          khatamPerMonth: 2,
          startDate: '',
        };
      } else {
        // Ensure new fields exist for backward compatibility
        if (!settings.target.mode) settings.target.mode = 'days';
        if (!settings.target.khatamPerMonth) settings.target.khatamPerMonth = 2;
      }
      return settings;
    }
    return {
      language: 'id',
      target: {
        enabled: false,
        mode: 'days',
        targetDays: 30,
        khatamPerMonth: 2,
        startDate: '',
      },
    };
  } catch {
    return {
      language: 'id',
      target: {
        enabled: false,
        mode: 'days',
        targetDays: 30,
        khatamPerMonth: 2,
        startDate: '',
      },
    };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getDailyLog(): Promise<DailyLog> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.DAILY_LOG);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveDailyLog(log: DailyLog): Promise<void> {
  await AsyncStorage.setItem(KEYS.DAILY_LOG, JSON.stringify(log));
}

// Khatam History
export async function getKhatamHistory(): Promise<KhatamHistory> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.KHATAM_HISTORY);
    if (raw) {
      const history: KhatamHistory = JSON.parse(raw);
      // Clean up bug duplicates: remove entries within 60s of previous entry
      const cleaned: KhatamCompletion[] = [];
      for (const c of history.completions) {
        const prev = cleaned[cleaned.length - 1];
        if (!prev || Math.abs(new Date(c.completedAt).getTime() - new Date(prev.completedAt).getTime()) > 60000) {
          cleaned.push(c);
        }
      }
      if (cleaned.length !== history.completions.length) {
        const result = { completions: cleaned, totalCount: cleaned.length };
        await saveKhatamHistory(result);
        return result;
      }
      return history;
    }
    return { completions: [], totalCount: 0 };
  } catch {
    return { completions: [], totalCount: 0 };
  }
}

export async function saveKhatamHistory(history: KhatamHistory): Promise<void> {
  await AsyncStorage.setItem(KEYS.KHATAM_HISTORY, JSON.stringify(history));
}

export async function addKhatamCompletion(completion: KhatamCompletion): Promise<void> {
  const history = await getKhatamHistory();
  history.completions.unshift(completion); // Add to beginning (newest first)
  history.totalCount++;
  await saveKhatamHistory(history);
}

export async function restoreAllData(data: {
  readPages: ReadPages;
  settings: AppSettings;
  dailyLog: DailyLog;
  khatamHistory: KhatamHistory;
}): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.READ_PAGES, JSON.stringify(data.readPages)],
    [KEYS.SETTINGS, JSON.stringify(data.settings)],
    [KEYS.DAILY_LOG, JSON.stringify(data.dailyLog)],
    [KEYS.KHATAM_HISTORY, JSON.stringify(data.khatamHistory)],
  ]);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.READ_PAGES,
    KEYS.SETTINGS,
    KEYS.DAILY_LOG,
    // Note: KHATAM_HISTORY is NOT cleared - preserve history across resets
  ]);
}

export default {
  getReadPages,
  saveReadPages,
  getSettings,
  saveSettings,
  getDailyLog,
  saveDailyLog,
  getKhatamHistory,
  saveKhatamHistory,
  addKhatamCompletion,
  restoreAllData,
  clearAllData
};
