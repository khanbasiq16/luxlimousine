import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  source: null,       
  destination: null,  
};

const CoordinatesSlice = createSlice({
  name: "coordinates",
  initialState,
  reducers: {
    setSource(state, action) {
      state.source = action.payload;
    },
    setDestination(state, action) {
      state.destination = action.payload;
    },
    clearCoordinates(state) {
      state.source = null;
      state.destination = null;
    },
  },
});

export const { setSource, setDestination, clearCoordinates } = CoordinatesSlice.actions;
export default CoordinatesSlice.reducer;
