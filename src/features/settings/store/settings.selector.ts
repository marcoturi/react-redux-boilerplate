import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/shared/store/types';
import type { SettingsKey } from './settings.type';

export const getStorageState = (state: RootState) => state.settings;
export const getSettingByKey = createSelector(
  getStorageState,
  (storageEntries) =>
    (key: SettingsKey): any =>
      storageEntries[key],
);
