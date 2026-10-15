import { configureStore } from '@reduxjs/toolkit';
import noteReducer from './features/noteSlice';
import confirmReducer from './features/confirmSlice';

const store = configureStore({
  reducer: {
    notes: noteReducer,
    confirm: confirmReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore onConfirm function in confirm modal
        ignoredActions: ['confirm/showConfirm'],
        ignoredPaths: ['confirm.onConfirm'],
      },
    }),
});

export default store;