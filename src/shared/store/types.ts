import { useDispatch, useSelector } from 'react-redux';
import type { RootState, setupStore } from './index';

export type { RootState };
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
