import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booking: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    CreateBookigninstance(state, action) {
      state.booking = action?.payload;
    },
    
    Clearbookinginstance(state) {
      state.booking = null;
    },
  },
});

export const { CreateBookigninstance, Clearbookinginstance } =
  bookingSlice.actions;

export default bookingSlice.reducer;
