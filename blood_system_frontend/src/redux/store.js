// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import donorReducer from './slices/donorSlice';
import requestReducer from './slices/requestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donors: donorReducer,
    requests: requestReducer,
  },
});