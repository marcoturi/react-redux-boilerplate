import type { SettingsKey } from '@/features/settings/store/settings.type';
import { StorageKeys } from '@/shared/helpers/local-storage.service';

// Reads a setting as the settings effect saved it
export function readStoredSetting(key: SettingsKey): unknown {
  return JSON.parse(
    localStorage.getItem(`${StorageKeys.settings}${key}`) ?? 'null',
  );
}
