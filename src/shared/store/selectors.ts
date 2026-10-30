import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/shared/store/types';

export const createAppSelector = createSelector.withTypes<RootState>();
