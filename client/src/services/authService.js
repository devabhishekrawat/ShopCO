import api from "./api";

export const signup = async (userData) => {
  const response = await api.post("/user/signup", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/user/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/user/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.patch("/user/profile", userData);
  return response.data;
};
