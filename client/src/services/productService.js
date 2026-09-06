import api from "./api";

export const getProducts = async (params) => {
  const response = await api.get("/product", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post("/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (id, data) => {
  const isFormData = data instanceof FormData;
  const response = await api.patch(`/product/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/product/${id}`);
  return response.data;
};

export const updateProductQuantity = async (id, quantity) => {
  const response = await api.patch(`/product/${id}/quantity`, { quantity });
  return response.data;
};
