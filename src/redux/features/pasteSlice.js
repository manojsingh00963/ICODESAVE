import { createSlice } from '@reduxjs/toolkit'

export const pasteSlice = createSlice({
  name: 'pastes',
  initialState: {
    pastes:localStorage.getItem("pastes")
    ? JSON.parse(localStorage.getItem("pastes"))
    : []
  },
  reducers: {
    addToPastes: (state,  action) => {
    },
    updateToPastes: (state, action) => {
      
    },
    resetAllPastes: (state, action) => {
      
    },
    removeTopastes: (state, action) => {
      
    }
  },
})

// Action creators are generated for each case reducer function
export const { addToPastes, updateToPastes, resetAllPastes, removeTopastes } = pasteSlice.actions

export default pasteSlice.reducer