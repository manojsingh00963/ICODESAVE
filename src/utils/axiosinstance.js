import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["authToken"] = `${token}`; // Use standard Bearer token format
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
