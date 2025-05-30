import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import staffReducer from './slices/staffSlice';
// import shiftReducer from './slices/shiftSlice';
// import attendanceReducer from './slices/attendanceSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    staff: staffReducer,
    // shift: shiftReducer,
    // attendance: attendanceReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
}); 