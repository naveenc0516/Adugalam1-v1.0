

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* 🔐 AXIOS INTERCEPTOR */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    // 🔑 JWT use pannina idhu correct
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
  
