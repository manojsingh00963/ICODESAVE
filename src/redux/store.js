import { configureStore } from '@reduxjs/toolkit';
import noteReducer from './features/noteSlice';
import confirmReducer from './features/confirmSlice'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    confirm: confirmReducer,
  },
});


export default store;