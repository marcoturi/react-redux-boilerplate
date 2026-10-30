import { captureError } from '@/shared/helpers/error-tracking.service';
import LocalStorageService, {
  StorageKeys,
} from '@/shared/helpers/local-storage.service';
import { startAppListening } from '@/shared/store/listener';
import { SettingsActions } from './index';
import { SettingsKey } from './settings.type';

/**
 * Important: these listeners are here only to showcase the listener middleware.
 * In a real app, if you want to persist your redux state to local storage
 * you should use something like redux-persist instead.
 * https://github.com/markerikson/redux-ecosystem-links/blob/master/store-persistence.md
 */
startAppListening({
  actionCreator: SettingsActions.subscriptionFilterChanged,
  effect: (_action, listenerApi) => {
    try {
      LocalStorageService(StorageKeys.settings).set(
        SettingsKey.filters,
        listenerApi.getState().settings[SettingsKey.filters],
      );
    } catch (error) {
      captureError(error, 'Error saving the settings to local storage');
    }
  },
});

// localStorage can throw (e.g. blocked by the browser): the app keeps the
// default settings, but the error is reported
startAppListening({
  actionCreator: SettingsActions.loadState.rejected,
  effect: (action) => {
    captureError(action.error, 'Error loading the settings from local storage');
  },
});
