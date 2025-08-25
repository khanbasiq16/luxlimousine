import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    carlist: [],
};

const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {
        fetchCarsStart(state , action) {
            state.carlist= action?.payload;
        },
    },
});

export const {
    fetchCarsStart,
 
} = carSlice.actions;

export default carSlice.reducer;