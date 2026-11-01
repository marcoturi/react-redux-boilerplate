import type { SettingsKey } from '@/features/settings/store/settings.type';
import { StorageKeys } from '@/shared/helpers/local-storage.service';

const settingKey = (key: SettingsKey) => `${StorageKeys.settings}${key}`;

// Reads a setting as the settings effect saved it
export function readStoredSetting(key: SettingsKey): unknown {
  return JSON.parse(localStorage.getItem(settingKey(key)) ?? 'null');
}

// Saves a raw string where the settings effect would save the setting
export function writeStoredSetting(key: SettingsKey, raw: string) {
  localStorage.setItem(settingKey(key), raw);
}
