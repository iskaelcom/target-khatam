import { AppSettings, DailyLog, ReadPages } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  READ_PAGES: '@target-khatam/read-pages',
  SETTINGS: '@target-khatam/settings',
  DAILY_LOG: '@target-khatam/daily-log',
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

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.READ_PAGES, KEYS.SETTINGS, KEYS.DAILY_LOG]);
}
