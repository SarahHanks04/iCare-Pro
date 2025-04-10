// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     isAuthenticated: false,
//   },
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       localStorage.setItem("token", action.payload.token); // Store token in local storage
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem("token"); // Remove token from local storage
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  // reducers: {
  //   loginSuccess: (state, action) => {
  //     //   state.user = action.payload.user;
  //     state.user = { name: action.payload.name || "User" };
  //     state.token = action.payload.token;
  //     state.isAuthenticated = true;
  //     localStorage.setItem("token", action.payload.token);
  //     document.cookie = `authToken=${action.payload.token}; path=/; max-age=3600`;
  //     console.log("Token set in cookie:", action.payload.token);
  //   },
  //   logout: (state) => {
  //     state.user = null;
  //     state.token = null;
  //     state.isAuthenticated = false;
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("mockedUsers");
  //     document.cookie = "authToken=; path=/; max-age=0";
  //   },
  // },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        name: action.payload.name || "User",
        email: action.payload.email, // Add email to user object
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      document.cookie = `authToken=${action.payload.token}; path=/; max-age=3600`;
      console.log("Redux State After Login:", {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("mockedUsers");
      document.cookie = "authToken=; path=/; max-age=0";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
