import { settingsSlice } from './settings.slice';
import { loadState } from './settings.thunk';

export const SettingsActions = {
  ...settingsSlice.actions,
  loadState,
};

export * as SettingsSelectors from './settings.selector';
