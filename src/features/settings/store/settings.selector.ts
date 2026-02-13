import type { RootState } from '@/shared/store/types';
import type { SettingsKey, SettingsState } from './settings.type';

export const getStorageState = (state: RootState) => state.settings;

export const getSettingByKey = <K extends SettingsKey>(
  state: RootState,
  key: K,
): SettingsState[K] => state.settings[key];
