import LocalStorageService, {
  StorageKeys,
} from '@/core/helpers/local-storage.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadState = createAsyncThunk('settings/loadState', () =>
  LocalStorageService(StorageKeys.settings).getAll(),
);
