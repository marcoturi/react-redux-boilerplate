import { rootReducer, store } from './index';
import { useDispatch, useSelector } from 'react-redux';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
// todo: figure out why AppDispatch is not working with thunk actions
export const useAppDispatch = useDispatch.withTypes<any>();
export const useAppSelector = useSelector.withTypes<RootState>();
