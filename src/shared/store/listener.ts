import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './types';

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
