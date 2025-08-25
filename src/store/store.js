"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import CarSlice from "./Slices/CarSlice";
import userLocationReducer from "./Slices/UserSlice";
import coordinatesReducer from "./Slices/CoordinatesSlice";
import directionReducer from "./Slices/directionSlice";
import bookingReducer from "./Slices/BookingSlice";

const rootReducer = combineReducers({
  Car:CarSlice,
  userLocation:userLocationReducer,
  Coordinates:coordinatesReducer,
  direction:directionReducer,
  Booking:bookingReducer
});


const persistConfig = {
  key: "root",
  storage,
  blacklist: ["direction"],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
