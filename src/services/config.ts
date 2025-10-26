import { API_ENDPOINTS } from '../utils/constants';

/**
 * API Configuration
 */
export const apiConfig = {
  endpoints: API_ENDPOINTS,
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    delay: 1000,
  },
  
  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 12,
  },
  
  // Cache configuration
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

/**
 * Environment-specific configuration
 */
export const envConfig = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  enableLogging: import.meta.env.DEV,
};

/**
 * Feature flags
 */
export const featureFlags = {
  enableReviews: true,
  enableWishlist: true,
  enableGuestCheckout: true,
  enableSocialLogin: false,
  enableLiveChat: false,
  enableNewsletterSignup: true,
};

/**
 * App metadata
 */
export const appConfig = {
  name: 'Perfume Store',
  description: 'Premium perfumes for everyone',
  version: '1.0.0',
  supportEmail: 'support@perfumestore.com',
  socialMedia: {
    facebook: 'https://facebook.com/perfumestore',
    instagram: 'https://instagram.com/perfumestore',
    twitter: 'https://twitter.com/perfumestore',
  },
};

/**
 * Google Analytics / Tracking
 */
export const analyticsConfig = {
  enabled: import.meta.env.PROD,
  trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
};

/**
 * Image configuration
 */
export const imageConfig = {
  placeholders: {
    product: '/images/placeholder-product.jpg',
    avatar: '/images/placeholder-avatar.jpg',
    banner: '/images/placeholder-banner.jpg',
  },
  
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  },
};

/**
 * SEO Configuration
 */
export const seoConfig = {
  defaultTitle: 'Perfume Store - Premium Fragrances',
  titleTemplate: '%s | Perfume Store',
  defaultDescription: 'Discover premium perfumes for men and women. Shop the latest fragrances from top brands.',
  defaultKeywords: 'perfume, fragrance, cologne, scent, luxury perfume',
  ogImage: '/images/og-image.jpg',
};

export default {
  api: apiConfig,
  env: envConfig,
  features: featureFlags,
  app: appConfig,
  analytics: analyticsConfig,
  image: imageConfig,
  seo: seoConfig,
};