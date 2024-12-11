import { store } from './index';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;
// todo: figure out how to type this properly
export type AppDispatch = typeof store.dispatch & ThunkDispatch<any, any, any>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
