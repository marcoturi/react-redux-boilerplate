import { SettingsKey } from './settings.type';
import { RootState } from '@/core/store/types';
import { createSelector } from '@reduxjs/toolkit';

export const getStorageState = (state: RootState) => state.settings;
export const getSettingByKey = createSelector(
  getStorageState,
  (storageEntries) =>
    (key: SettingsKey): any =>
      storageEntries[key],
);
