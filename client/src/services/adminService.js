import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsersAdmin = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserRoleAdmin = async (id, role) => {
  const response = await api.patch(`/admin/user/${id}`, { role });
  return response.data;
};

export const deleteUserAdmin = async (id) => {
  const response = await api.delete(`/user/admin/delete/${id}`);
  return response.data;
};
