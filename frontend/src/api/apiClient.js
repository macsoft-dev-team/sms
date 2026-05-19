import axios from "axios";
import { getAuthToken, setAuthToken } from "./token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) setAuthToken(null);
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);
