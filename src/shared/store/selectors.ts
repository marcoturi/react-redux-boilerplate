import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './types';

export const createAppSelector = createSelector.withTypes<RootState>();
