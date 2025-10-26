import { CartItem } from './cart';
import { Address } from './user';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface CheckoutData {
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  paymentMethod: PaymentMethod;
  useShippingAsBilling: boolean;
  notes?: string;
}

export interface OrderSummary {
  orderId: string;
  total: number;
  itemCount: number;
  estimatedDelivery: string;
  status: OrderStatus;
}