import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        name: action.payload.name || "User",
        email: action.payload.email,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      document.cookie = `authToken=${action.payload.token}; path=/; max-age=3600`;
    },
    logout: (state, action) => {
      const email = action.payload; 
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("mockedUsers");
      if (email) {
        localStorage.removeItem(`avatar-${email}`);
        localStorage.removeItem(`phone-${email}`);
      }
      document.cookie = "authToken=; path=/; max-age=0";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
