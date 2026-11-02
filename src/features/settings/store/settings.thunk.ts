import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  LocalStorageService,
  StorageKeys,
} from '@/shared/helpers/local-storage.service';

export const loadState = createAsyncThunk('settings/loadState', () =>
  LocalStorageService(StorageKeys.settings).getAll(),
);
