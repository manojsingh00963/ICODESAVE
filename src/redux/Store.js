// store.js
import { configureStore } from '@reduxjs/toolkit';
import pasteReducer from './features/pasteSlice';

const store = configureStore({
  reducer: {
    pastes: pasteReducer, // <--- This key "pastes" is crucial
  },
});

export default store;