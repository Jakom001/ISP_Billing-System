import apiClient from "../services/apiClient";


export const getPayments = () => apiClient.get("/payments/all-payments");
export const addPayment = (paymentData) => apiClient.post("/payments/add-payment", paymentData);
export const updatePayment = (paymentId, updatedPaymentData) =>
  apiClient.put(`/payments/update-payment/${paymentId}`, updatedPaymentData);
export const deletePayment = (paymentId) => apiClient.delete(`/payments/delete-payment/${paymentId}`);
export const getPaymentById = (paymentId) => apiClient.get(`/payments/single-payment/${paymentId}`);