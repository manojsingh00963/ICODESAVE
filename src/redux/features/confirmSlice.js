import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  message: "",
  onConfirm: () => {},
  color: "#ff4d4f",
};

const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    showConfirm: (state, action) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
      state.color = action.payload.color || "#ff4d4f";
    },
    hideConfirm: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showConfirm, hideConfirm } = confirmSlice.actions;
export default confirmSlice.reducer;
