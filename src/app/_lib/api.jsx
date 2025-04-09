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
    // Check localStorage for mocked users
    const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
    const user = mockedUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      return { token: `mock-token-${email}` };
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
    // Only defined users succeed registration
    if (
      error.response &&
      error.response.data?.error ===
        "Note: Only defined users succeed registration"
    ) {
      console.log("Mocking successful registration for:", email);
      const newUser = {
        id: Math.floor(Math.random() * 1000).toString(),
        email,
        password, // In a real app, you should hash the password
      };
      // Store the mocked user in localStorage
      const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
      mockedUsers.push(newUser);
      localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));
      return {
        id: newUser.id,
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
    // Check localStorage first
    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    const localUser = localUsers.find((user) => user.id === id);
    if (localUser) {
      return localUser; // Already in the correct format
    }

    // Fetch from API
    const response = await api.get(`/users/${id}`);
    // Normalize the API response to match the local user structure
    const userData = response.data.data; // Extract the user data
    return {
      id: userData.id.toString(), // Ensure id is a string
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      avatar: userData.avatar,
      role: userData.role || "General Back Office", // Add default role if missing
      status: userData.status || "Active", // Add default status if missing
      created_at: userData.created_at || new Date().toISOString(), // Add default created_at if missing
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

export default api;
