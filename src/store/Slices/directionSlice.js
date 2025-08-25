import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  directionData: null,
};

const directionSlice = createSlice({
  name: "direction",
  initialState,
  reducers: {
    setDirectionData(state, action) {
      state.directionData = action.payload;
    },
    clearDirectionData(state) {
      state.directionData = null;
    },
  },
});

export const { setDirectionData, clearDirectionData } = directionSlice.actions;
export default directionSlice.reducer;
