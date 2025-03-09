import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Function to safely get pastes from localStorage
const getInitialPastes = () => {
  const storedPastes = localStorage.getItem('pastes');
  try {
    return storedPastes ? JSON.parse(storedPastes) : [];
  } catch (error) {
    console.error('Invalid JSON in localStorage, resetting pastes:', error);
    localStorage.removeItem('pastes'); // Reset corrupted storage
    return [];
  }
};

export const pasteSlice = createSlice({
  name: 'pastes',
  initialState: {
    pastes: getInitialPastes(),
  },
  reducers: {
    addToPastes: (state, action) => {
      const paste = action.payload;
      const exists = state.pastes.some((p) => p.id === paste.id);
      if (!exists) {
        state.pastes.push(paste);
        localStorage.setItem('pastes', JSON.stringify(state.pastes));
        toast.success('Paste created successfully!');
      } else {
        toast.error('Paste with this ID already exists.');
      }
    },
    updateToPastes: (state, action) => {
      const updatedPaste = action.payload;
      const index = state.pastes.findIndex((paste) => paste.id === updatedPaste.id);
      if (index !== -1) {
        state.pastes[index] = updatedPaste;
        localStorage.setItem('pastes', JSON.stringify(state.pastes));
        toast.success('Paste updated successfully!');
      } else {
        toast.error('Paste not found for update.');
      }
    },
    resetAllPastes: (state) => {
      state.pastes = [];
      localStorage.removeItem('pastes');
      toast.info('All pastes cleared.');
    },
    removeTopastes: (state, action) => {
      const pasteId = action.payload;
      if (toast.warning(confirm("Are you sure to want to delete!")) == true) {
        state.pastes = state.pastes.filter((paste) => paste.id !== pasteId);
        localStorage.setItem('pastes', JSON.stringify(state.pastes));
        toast.success('Paste removed successfully!');
      } else {
        toast.error('Paste deletion cancelled.');
      }
    },
  },
});

// Export actions
export const { addToPastes, updateToPastes, resetAllPastes, removeTopastes } =
  pasteSlice.actions;

export default pasteSlice.reducer;