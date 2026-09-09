import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/shopco",
  withCredentials: true,
});

export const getAssetUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/assets/") || path.startsWith("assets/")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:5000${cleanPath}`;
  }
  return path;
};

export default api;
