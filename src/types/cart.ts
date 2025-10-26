import { Product } from './product';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  expiresAt?: Date;
  isActive: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 5.99,
    estimatedDays: '5-7',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 12.99,
    estimatedDays: '2-3',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 24.99,
    estimatedDays: '1',
  },
];