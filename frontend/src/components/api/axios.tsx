import axios from "axios";

/**
 * Single point of API origin for the HR System.
 *
 * All pages should import this instance and call only the path
 * after the base, e.g.:
 *
 *   import api from "@/components/api/axios";
 *   api.get("/api/v1/employees");
 *   api.post("/api/v1/leave/apply", data);
 *
 * The base URL is read from the VITE_API_BASE_URL env variable
 * (set in frontend/.env). Change that one value to point the
 * entire app at a different backend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001",
  withCredentials: true, // needed for Laravel Sanctum cookie auth
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Attach the Bearer token stored in localStorage (if present).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ─────────────────────────────────────────────────────
// Redirect to /login on 401 so every page gets automatic session expiry handling.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
