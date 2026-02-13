import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { store } from './index';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, undefined, UnknownAction>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
