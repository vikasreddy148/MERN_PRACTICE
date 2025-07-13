import axios from "axios";
import { serverEndpoint } from "./config.js";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: serverEndpoint,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.status} ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`
      );
    }
    return response;
  },
  (error) => {
    // Log errors
    console.error("Response error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.warn("Unauthorized request - user may need to re-authenticate");
    } else if (error.response?.status >= 500) {
      console.error("Server error occurred");
    } else if (!error.response) {
      console.error("Network error - no response received");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
