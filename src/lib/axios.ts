import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://backend.aqaar.dussur.sa/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and Accept-Language header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("owner_token");
    const isPublicEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");
    
    // Add Authorization header
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Accept-Language header based on current language
    const currentLanguage = localStorage.getItem("i18nextLng") || "ar";
    config.headers["Accept-Language"] = currentLanguage;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
