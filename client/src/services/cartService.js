import api from "./api";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (productId, quantity = 1, size = "") => {
  const response = await api.post("/cart", { productId, quantity, size });
  return response.data;
};

export const updateCartItemQuantity = async (
  productId,
  quantity,
  size = "",
  itemId = ""
) => {
  const response = await api.patch(`/cart/${productId}`, {
    quantity,
    size,
    itemId,
  });
  return response.data;
};

export const removeCartItem = async (productId, size = "", itemId = "") => {
  const response = await api.delete(`/cart/${productId}`, {
    data: { size, itemId },
    params: { size, itemId },
  });
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart");
  return response.data;
};
