import api from "../lib/api"; // your axios instance

export const createCheckoutSession = async (data) => {
  try {
    const res = await api.post("/billing/create-checkout", data);
    return res.data;
  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    throw error;
  }
};