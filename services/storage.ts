import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadPages, AppSettings, DailyLog } from '@/types';

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
    return raw ? JSON.parse(raw) : { language: 'id' };
  } catch {
    return { language: 'id' };
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
