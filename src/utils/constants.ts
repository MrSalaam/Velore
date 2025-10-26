import { ProductCategory, SortOption } from '../types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  FEATURED_PRODUCTS: '/products/featured',
  SEARCH_PRODUCTS: '/products/search',
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile/update',
  CHANGE_PASSWORD: '/auth/password/change',
  RESET_PASSWORD: '/auth/password/reset',
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  CREATE_ORDER: '/orders/create',
  
  // Payment
  CREATE_PAYMENT_INTENT: '/payment/create-intent',
  CONFIRM_PAYMENT: '/payment/confirm',
};

// Product Categories
export const CATEGORIES: ProductCategory[] = ['men', 'women', 'unisex'];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  men: "Men's Perfumes",
  women: "Women's Perfumes",
  unisex: 'Unisex Perfumes',
};

// Product Sizes
export const PRODUCT_SIZES = ['30ml', '50ml', '100ml', '150ml'] as const;

export type ProductSizeType = typeof PRODUCT_SIZES[number];

// Sort Options
export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

// Price Ranges for Filters
export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: Infinity, label: 'Over $500' },
];

// Rating Options
export const RATING_OPTIONS = [5, 4, 3, 2, 1];

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

// Payment Status Labels
export const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

// Tax Rate (can be configured per region)
export const TAX_RATE = 0.08; // 8%

// Free Shipping Threshold
export const FREE_SHIPPING_THRESHOLD = 100;

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 5;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'cart-storage',
  AUTH_TOKEN: 'auth-token',
  USER: 'user-data',
  WISHLIST: 'wishlist',
  RECENT_SEARCHES: 'recent-searches',
};

// Debounce Delays (ms)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  FILTER: 500,
};

// Image Placeholders
export const PLACEHOLDER_IMAGE = '/images/placeholder-product.jpg';
export const PLACEHOLDER_AVATAR = '/images/placeholder-avatar.jpg';

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CARD_NUMBER: /^\d{16}$/,
  CVV: /^\d{3,4}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  PRODUCT_ADDED: 'Product added to cart!',
  PRODUCT_REMOVED: 'Product removed from cart!',
  ORDER_PLACED: 'Order placed successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
};

// Navigation Links
export const NAV_LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'SHOP', path: '/shop' },
  { label: 'MEN', path: '/shop?category=men' },
  { label: 'WOMEN', path: '/shop?category=women' },
  { label: 'UNISEX', path: '/shop?category=unisex' },
];

// Footer Links
export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Careers', path: '/careers' },
  ],
  help: [
    { label: 'Shipping Info', path: '/shipping' },
    { label: 'Returns', path: '/returns' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Size Guide', path: '/size-guide' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  pinterest: 'https://pinterest.com',
};


// Maximum quantities
export const MAX_CART_QUANTITY = 10;
export const MAX_WISHLIST_ITEMS = 50;