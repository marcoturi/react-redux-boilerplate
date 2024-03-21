import LocalStorageService, {
  StorageKeys,
} from '@/shared/helpers/local-storage.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Important: this thunk is here only to showcase the usage of a thunk.
 * In a real app, if you want to persist your redux state to local storage
 * you should use something like redux-persist instead.
 * https://github.com/markerikson/redux-ecosystem-links/blob/master/store-persistence.md
 */
export const loadState = createAsyncThunk('settings/loadState', () =>
  LocalStorageService(StorageKeys.settings).getAll(),
);
