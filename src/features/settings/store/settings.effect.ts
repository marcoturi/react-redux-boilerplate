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
function persist(key: SettingsKey, value: unknown) {
  try {
    LocalStorageService(StorageKeys.settings).set(key, value);
  } catch (error) {
    captureError(error, `Error setting value for local storage key: ${key}`);
  }
}

startAppListening({
  actionCreator: SettingsActions.setItem,
  effect: (action) => {
    persist(action.payload.key, action.payload.value);
  },
});

startAppListening({
  actionCreator: SettingsActions.subscriptionFilterChanged,
  effect: (_action, listenerApi) => {
    persist(
      SettingsKey.filters,
      listenerApi.getState().settings[SettingsKey.filters],
    );
  },
});

startAppListening({
  actionCreator: SettingsActions.deleteItem,
  effect: (action) => {
    const { key } = action.payload;
    try {
      LocalStorageService(StorageKeys.settings).clear(key);
    } catch (error) {
      captureError(error, `Error removing value for local storage key: ${key}`);
    }
  },
});
