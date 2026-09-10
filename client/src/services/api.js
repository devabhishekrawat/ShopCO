import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_SERVER_URL =
  import.meta.env.VITE_API_ASSET_URL?.replace(/\/+$/, "") ||
  API_URL.replace(/\/api\/.*$/, "");
export const API_ASSET_URL = BASE_SERVER_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAssetUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_SERVER_URL}${cleanPath}`;
};

export default api;
