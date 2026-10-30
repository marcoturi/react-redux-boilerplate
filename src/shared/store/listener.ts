import { addListener, createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/shared/store/types';

// One app-wide listener middleware: feature effects register on it with the
// typed helpers below, and setupStore prepends it.
export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
