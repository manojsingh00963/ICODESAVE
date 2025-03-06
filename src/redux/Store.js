import { configureStore } from '@reduxjs/toolkit'
import pasteReducer from './features/pasteSlice'

export default configureStore({
  reducer: {
    counter: pasteReducer,
  },
})

