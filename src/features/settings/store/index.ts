import { settingsSlice } from './settings.slice';
import { loadState } from './settings.thunk';

const SettingsActions = {
  ...settingsSlice.actions,
  loadState,
};

export { SettingsActions };

export * as SettingsSelectors from './settings.selector';
