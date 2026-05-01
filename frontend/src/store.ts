import { configureStore } from '@reduxjs/toolkit';
import medicineReducer from './features/medicine/medicineSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    medicine: medicineReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
