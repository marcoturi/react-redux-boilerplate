import { SettingsActions } from './index';
import { RemoveValuePayload, SetValuePayload } from './settings.type';
import { captureError } from '@/shared/helpers/error-tracking.service';
import LocalStorageService, {
  StorageKeys,
} from '@/shared/helpers/local-storage.service';
import { createListenerMiddleware, PayloadAction } from '@reduxjs/toolkit';

export const storageMiddleware = createListenerMiddleware<any>();

/**
 * Important: this middleware is here only to showcase the usage of ListenerMiddleware.
 * In a real app, if you want to persist your redux state to local storage
 * you should use something like redux-persist instead.
 * https://github.com/markerikson/redux-ecosystem-links/blob/master/store-persistence.md
 */
storageMiddleware.startListening({
  actionCreator: SettingsActions.setItem,
  effect: (action: PayloadAction<SetValuePayload>) => {
    const { key, value } = action.payload;
    try {
      LocalStorageService(StorageKeys.settings).set(key, value);
    } catch (error) {
      captureError(error, 'Error setting value for local storage key');
    }
  },
});

storageMiddleware.startListening({
  actionCreator: SettingsActions.deleteItem,
  effect: (action: PayloadAction<RemoveValuePayload>) => {
    const { key } = action.payload;
    try {
      LocalStorageService(StorageKeys.settings).clear(key);
    } catch (error) {
      captureError(error, `Error removing value for local storage key: ${key}`);
    }
  },
});
