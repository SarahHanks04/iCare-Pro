import axios from "axios";

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

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    if (error.response && error.response.data?.error === "user not found") {
      return {
        token: `mock-token-${email}`,
      };
    }
    throw new Error("Login failed. Please check your credentials.");
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
    // Only defined users succeed registration" error
    if (
      error.response &&
      error.response.data?.error ===
        "Note: Only defined users succeed registration"
    ) {
      console.log("Mocking successful registration for:", email);
      return {
        id: Math.floor(Math.random() * 1000),
        token: `mock-token-${email}`,
      };
    }
    // Handle other specific errors
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
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users.");
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
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

export default api;
