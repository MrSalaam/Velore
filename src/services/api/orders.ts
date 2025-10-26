import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../../utils/constants';
import { Order, CheckoutData, OrderSummary } from '../../types';
import { buildQueryString } from '../../utils/helpers';

/**
 * Create a new order
 */
export const createOrder = async (orderData: CheckoutData): Promise<Order> => {
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_ORDER, orderData);
  return response.data;
};

/**
 * Get all orders for current user
 */
export const getOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = buildQueryString({ page, limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS}${queryParams}`);
  return response.data;
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.get(API_ENDPOINTS.ORDER_BY_ID(orderId));
  return response.data;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.post(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/cancel`);
  return response.data;
};

/**
 * Request order refund
 */
export const requestRefund = async (
  orderId: string,
  reason: string
): Promise<{
  message: string;
  order: Order;
}> => {
  const response = await axiosInstance.post(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/refund`, {
    reason,
  });
  return response.data;
};

/**
 * Track order
 */
export const trackOrder = async (
  orderId: string
): Promise<{
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  history: Array<{
    status: string;
    date: Date;
    location?: string;
  }>;
}> => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/track`);
  return response.data;
};

/**
 * Get order summary
 */
export const getOrderSummary = async (orderId: string): Promise<OrderSummary> => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/summary`);
  return response.data;
};

/**
 * Get recent orders
 */
export const getRecentOrders = async (limit: number = 5): Promise<Order[]> => {
  const queryParams = buildQueryString({ limit, sortBy: 'newest' });
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS}${queryParams}`);
  return response.data.orders;
};

/**
 * Download order invoice
 */
export const downloadInvoice = async (orderId: string): Promise<Blob> => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/invoice`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Reorder (create new order from existing order)
 */
export const reorder = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.post(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/reorder`);
  return response.data;
};

/**
 * Get order statistics
 */
export const getOrderStatistics = async (): Promise<{
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}> => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS}/statistics`);
  return response.data;
};