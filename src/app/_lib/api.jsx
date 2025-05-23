import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const cleanUpExpiredUsers = () => {
  const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
  const now = new Date();
  const expirationTime = 24 * 60 * 60 * 1000;

  const validUsers = mockedUsers.filter((user) => {
    const createdAt = new Date(user.createdAt);
    const timeElapsed = now - createdAt;
    return timeElapsed <= expirationTime;
  });

  localStorage.setItem("mockedUsers", JSON.stringify(validUsers));
  return validUsers;
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    const mockedUsers = cleanUpExpiredUsers();
    const user = mockedUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      const uniqueToken = `mock-token-${uuidv4()}`;
      return { token: uniqueToken };
    }
    const errorMessage =
      error.response?.data?.error === "user not found"
        ? "User not found. Please register first."
        : error.response?.data?.error ||
          "Login failed. Please check your credentials.";
    throw new Error(errorMessage);
  }
};

export const registerUser = async (email, password) => {
  try {
    console.log("Registering with:", { email, password });
    const response = await api.post("/register", { email, password });
    return response.data;
  } catch (error) {
    console.error("Registration error:", {
      data: error.response?.data,
      status: error.response?.status,
      message: error.message,
    });
    if (
      error.response &&
      error.response.data?.error ===
        "Note: Only defined users succeed registration"
    ) {
      console.log("Mocking successful registration for:", email);
      cleanUpExpiredUsers();
      const newUser = {
        id: Math.floor(Math.random() * 1000).toString(),
        email,
        password,
      };
      const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
      mockedUsers.push(newUser);
      localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));
      const uniqueToken = `mock-token-${uuidv4()}`;
      return {
        id: newUser.id,
        token: uniqueToken,
      };
    }
    if (error.response && error.response.data?.error === "Missing password") {
      throw new Error("Password is required.");
    }
    if (
      error.response &&
      error.response.data?.error === "Missing email or username"
    ) {
      throw new Error("Email is required.");
    }
    throw new Error(
      error.response?.data?.error || "Registration failed. Please try again."
    );
  }
};

export const getUsers = async () => {
  try {
    const page1Response = await api.get("/users?page=1");
    const page1Data = page1Response.data.data;

    const page2Response = await api.get("/users?page=2");
    const page2Data = page2Response.data.data;

    const reqresUsers = [...page1Data, ...page2Data];

    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];

    const allUsers = [...localUsers, ...reqresUsers];
    console.log("Fetched all users (Reqres + Local):", allUsers);

    return allUsers;
  } catch (error) {
    console.error("Get users error:", error.response?.data || error.message);
    throw new Error("Failed to fetch users.");
  }
};

export const getUserById = async (id) => {
  try {
    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    const localUser = localUsers.find((user) => user.id === id);
    if (localUser) {
      return localUser;
    }
    const response = await api.get(`/users/${id}`);
    const userData = response.data.data;
    return {
      id: userData.id.toString(),
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      avatar: userData.avatar,
      role: userData.role || "General Back Office",
      status: userData.status || "Active",
      created_at: userData.created_at || new Date().toISOString(),
    };
  } catch (error) {
    throw new Error("Failed to fetch user details.");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user.");
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    console.log("User updated:", response.data);

    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    const userIndex = localUsers.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      localUsers[userIndex] = { ...localUsers[userIndex], ...userData };
      localStorage.setItem("localUsers", JSON.stringify(localUsers));
    }

    return response.data;
  } catch (error) {
    console.error("Update error:", error.response?.data || error.message);
    throw new Error("Failed to update user.");
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    console.log("User deleted:", id);

    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    const updatedLocalUsers = localUsers.filter((user) => user.id !== id);
    localStorage.setItem("localUsers", JSON.stringify(updatedLocalUsers));

    return response.status === 204;
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
    throw new Error("Failed to delete user.");
  }
};

export default api;
