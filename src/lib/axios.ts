import axios from "axios";

const isServer = typeof window === "undefined";

const axiosInstance = axios.create({
  // Use absolute URL on server, relative path on client for proxying
  baseURL: isServer
    ? "http://202.10.44.210:3001/api"
    : process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Dispatch custom event for 401 errors
        window.dispatchEvent(new CustomEvent("session-expired"));
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
