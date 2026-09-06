import api from "./api";

export const checkoutOrder = async (orderData) => {
  const response = await api.post("/order/checkout", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/order");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/order/${id}`);
  return response.data;
};

export const getAllOrdersAdmin = async () => {
  const response = await api.get("/order/admin/all");
  return response.data;
};

export const getOrderByIdAdmin = async (id) => {
  const response = await api.get(`/order/admin/${id}`);
  return response.data;
};

export const updateOrderStatusAdmin = async (id, status) => {
  const response = await api.patch(`/order/admin/${id}/status`, { status });
  return response.data;
};
