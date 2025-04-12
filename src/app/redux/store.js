import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import userActionsReducer from './slices/userActionsSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    userActions: userActionsReducer, 
  },
});



