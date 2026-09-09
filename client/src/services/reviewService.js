import api from "./api";

export const getReviews = async () => {
  const response = await api.get("/review");
  return response.data;
};

export const getProductReviews = async (productId) => {
  const response = await api.get(`/review/product/${productId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/review", reviewData);
  return response.data;
};

export const updateReview = async (id, reviewData) => {
  const response = await api.patch(`/review/${id}`, reviewData);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/review/${id}`);
  return response.data;
};
