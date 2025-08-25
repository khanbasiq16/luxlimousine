import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: {}, 
};

const userLocationSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    setUserLocation(state, action) {
      state.location = action.payload; 
    },
    clearUserLocation(state) {
      state.location = {}; 
    },
  },
});

export const { setUserLocation, clearUserLocation } = userLocationSlice.actions;
export default userLocationSlice.reducer;
