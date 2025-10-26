// src/utils/helpers.ts

import { Product, CartItem, Cart } from '../types';
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from './constants';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US').format(date);
};



export const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isPhoneValid = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (
  items: CartItem[],
  shippingCost: number = 0,
  discountAmount: number = 0
): Cart => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const size = item.product.sizes.find(s => s.size === item.selectedSize);
    const price = size?.price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const tax = subtotal * TAX_RATE;
  
  // Free shipping if subtotal meets threshold
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
  
  const total = subtotal + tax + shipping - discountAmount;

  return {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    discount: discountAmount,
    total: Math.max(0, total), // Ensure total is never negative
  };
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number => {
  if (discountType === 'percentage') {
    return (subtotal * discountValue) / 100;
  }
  return discountValue;
};

/**
 * Get unique brands from products
 */
export const getUniqueBrands = (products: Product[]): string[] => {
  const brands = products.map(p => p.brand);
  return Array.from(new Set(brands)).sort();
};

/**
 * Filter products by criteria
 */
export const filterProducts = (
  products: Product[],
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    rating?: number;
    searchQuery?: string;
  }
): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Brand filter
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Stock filter
    if (filters.inStock && !product.inStock) {
      return false;
    }

    // Rating filter
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort products
 */
export const sortProducts = (
  products: Product[],
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating'
): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    
    default:
      return sorted;
  }
};

/**
 * Generate random ID
 */
export const generateId = (prefix: string = ''): string => {
  const random = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number

): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Get random items from array
 */
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Group array by key
 */
export const groupBy = <T>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Calculate average rating
 */
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Number((sum / ratings.length).toFixed(1));
};

/**
 * Check if date is within range
 */
export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry async function
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delay * attempt);
      }
    }
  }

  throw lastError!;
};

/**
 * Format query params for URL
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const filtered = Object.entries(params).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  if (filtered.length === 0) return '';

  const queryString = filtered
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `?${queryString}`;
};

/**
 * Parse query string from URL
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (smooth: boolean = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get cart item key (for unique identification)
 */
export const getCartItemKey = (productId: string, size: string): string => {
  return `${productId}-${size}`;
};

/**
 * Check if cart contains product
 */
export const isProductInCart = (
  items: CartItem[],
  productId: string,
  size: string
): boolean => {
  return items.some(
    item => item.productId === productId && item.selectedSize === size
  );
};

/**
 * Get savings amount
 */
export const getSavings = (originalPrice: number, currentPrice: number): number => {
  return Math.max(0, originalPrice - currentPrice);
};

/**
 * Get discount percentage
 */
export const getDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= 0) return 0;
  const savings = getSavings(originalPrice, currentPrice);
  return Math.round((savings / originalPrice) * 100);
};