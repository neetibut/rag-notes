import axios from "axios";

// pick VITE_API_URL in dev, VITE_PUBLIC_API_URL in prod
const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // critical for sending cookies!
});

// Add request interceptor to include Authorization header from localStorage as fallback
api.interceptors.request.use((config) => {
  // If no Authorization header is already set, try to get token from localStorage
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
