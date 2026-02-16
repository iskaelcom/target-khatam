import { BackupData } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { getDailyLog, getKhatamHistory, getReadPages, getSettings, restoreAllData } from './storage';

const BACKUP_FILENAME = 'target-khatam-backup.json';
const TOKEN_KEY = '@target-khatam/google-token';

// --- Token Management ---

async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function secureDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export async function saveToken(accessToken: string): Promise<void> {
  await secureSet(TOKEN_KEY, accessToken);
}

export async function getToken(): Promise<string | null> {
  return secureGet(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await secureDelete(TOKEN_KEY);
}

// --- Google Drive REST API ---

async function findBackupFile(accessToken: string): Promise<string | null> {
  const query = encodeURIComponent(`name='${BACKUP_FILENAME}'`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    if (res.status === 401) throw new Error('TOKEN_EXPIRED');
    throw new Error(`Drive search failed: ${res.status}`);
  }
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

async function uploadBackup(accessToken: string, backupData: BackupData, existingFileId: string | null): Promise<void> {
  const metadata: Record<string, unknown> = {
    name: BACKUP_FILENAME,
    mimeType: 'application/json',
  };
  if (!existingFileId) {
    metadata.parents = ['appDataFolder'];
  }

  const boundary = 'target_khatam_backup_boundary';
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${JSON.stringify(backupData)}\r\n` +
    `--${boundary}--`;

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

  const method = existingFileId ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('TOKEN_EXPIRED');
    throw new Error(`Upload failed: ${res.status}`);
  }
}

async function downloadBackup(accessToken: string, fileId: string): Promise<BackupData> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    if (res.status === 401) throw new Error('TOKEN_EXPIRED');
    throw new Error(`Download failed: ${res.status}`);
  }
  const data: BackupData = await res.json();
  if (!data.version || !data.readPages) {
    throw new Error('INVALID_BACKUP');
  }
  return data;
}

async function getBackupMetadata(accessToken: string, fileId: string): Promise<{ modifiedTime: string }> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=modifiedTime`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    if (res.status === 401) throw new Error('TOKEN_EXPIRED');
    throw new Error(`Metadata fetch failed: ${res.status}`);
  }
  return res.json();
}

// --- High-Level Operations ---

export async function performBackup(accessToken: string): Promise<void> {
  const [readPages, settings, dailyLog, khatamHistory] = await Promise.all([
    getReadPages(), getSettings(), getDailyLog(), getKhatamHistory()
  ]);

  const backupData: BackupData = {
    version: 1,
    createdAt: new Date().toISOString(),
    readPages,
    settings,
    dailyLog,
    khatamHistory,
  };

  const fileId = await findBackupFile(accessToken);
  await uploadBackup(accessToken, backupData, fileId);
}

export async function performRestore(accessToken: string): Promise<BackupData> {
  const fileId = await findBackupFile(accessToken);
  if (!fileId) {
    throw new Error('NO_BACKUP');
  }

  const backupData = await downloadBackup(accessToken, fileId);
  await restoreAllData({
    readPages: backupData.readPages,
    settings: backupData.settings,
    dailyLog: backupData.dailyLog,
    khatamHistory: backupData.khatamHistory,
  });

  return backupData;
}

export async function checkBackupStatus(accessToken: string): Promise<{ exists: boolean; lastModified?: string }> {
  const fileId = await findBackupFile(accessToken);
  if (!fileId) {
    return { exists: false };
  }
  const metadata = await getBackupMetadata(accessToken, fileId);
  return { exists: true, lastModified: metadata.modifiedTime };
}

export async function getUserEmail(accessToken: string): Promise<string> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  const data = await res.json();
  return data.email;
}
