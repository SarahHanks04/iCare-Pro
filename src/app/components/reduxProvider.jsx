"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <ReduxInitializer>{children}</ReduxInitializer>
    </Provider>
  );
}

function ReduxInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token") || getCookie("authToken");
    if (token) {
      dispatch(loginSuccess({ user: { email: "sarah@gmail.com" }, token }));
      console.log("Rehydrated state with token:", token);
    }
  }, [dispatch]);

  return children;
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
