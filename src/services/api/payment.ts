import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../../utils/constants';
import { PaymentMethod } from '../../types';

/**
 * Create payment intent for Stripe
 */
export const createPaymentIntent = async (amount: number): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_PAYMENT_INTENT, {
    amount,
  });
  return response.data;
};

/**
 * Confirm payment
 */
export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethod: PaymentMethod
): Promise<{
  success: boolean;
  message: string;
  transactionId?: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.CONFIRM_PAYMENT, {
    paymentIntentId,
    paymentMethod,
  });
  return response.data;
};

/**
 * Save payment method
 */
export const savePaymentMethod = async (
  paymentMethod: PaymentMethod
): Promise<{
  id: string;
  paymentMethod: PaymentMethod;
}> => {
  const response = await axiosInstance.post('/payment/methods', paymentMethod);
  return response.data;
};

/**
 * Get saved payment methods
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await axiosInstance.get('/payment/methods');
  return response.data;
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (methodId: string): Promise<{
  message: string;
}> => {
  const response = await axiosInstance.delete(`/payment/methods/${methodId}`);
  return response.data;
};

/**
 * Process refund
 */
export const processRefund = async (
  orderId: string,
  amount: number,
  reason?: string
): Promise<{
  success: boolean;
  refundId: string;
  amount: number;
  message: string;
}> => {
  const response = await axiosInstance.post('/payment/refund', {
    orderId,
    amount,
    reason,
  });
  return response.data;
};

/**
 * Validate discount code
 */
export const validateDiscountCode = async (
  code: string,
  subtotal: number
): Promise<{
  valid: boolean;
  discount: number;
  message: string;
}> => {
  const response = await axiosInstance.post('/payment/validate-discount', {
    code,
    subtotal,
  });
  return response.data;
};

/**
 * Apply discount code
 */
export const applyDiscountCode = async (
  code: string
): Promise<{
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  message: string;
}> => {
  const response = await axiosInstance.post('/payment/apply-discount', { code });
  return response.data;
};

/**
 * Get payment transaction details
 */
export const getTransactionDetails = async (
  transactionId: string
): Promise<{
  id: string;
  amount: number;
  status: string;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}> => {
  const response = await axiosInstance.get(`/payment/transactions/${transactionId}`);
  return response.data;
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  transactions: Array<{
    id: string;
    orderId: string;
    amount: number;
    status: string;
    date: Date;
  }>;
  total: number;
  page: number;
  totalPages: number;
}> => {
  const response = await axiosInstance.get('/payment/history', {
    params: { page, limit },
  });
  return response.data;
};