import api from "./api";

export const validateCoupon = async (code) => {
  const response = await api.post("/coupon/validate", { code });
  return response.data;
};

export const getAllCoupons = async () => {
  const response = await api.get("/coupon");
  return response.data;
};

export const createCoupon = async (couponData) => {
  const response = await api.post("/coupon", couponData);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupon/${id}`);
  return response.data;
};
