import type { RootState } from '@/shared/store/types';
import type { SettingsKey, SettingsState } from './settings.type';

export const selectSettingByKey = <K extends SettingsKey>(
  state: RootState,
  key: K,
): SettingsState[K] => state.settings[key];
