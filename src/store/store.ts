import { configureStore } from '@reduxjs/toolkit';
import actionsReducer from './actionsSlice';

export const store = configureStore({
  reducer: {
    actions: actionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;