import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../../utils/constants';
import { Product, ProductFilters, SortOption } from '../../types';
import { buildQueryString } from '../../utils/helpers';

/**
 * Get all products with optional filters
 */
export const getProducts = async (
  filters?: ProductFilters,
  sortBy?: SortOption,
  page: number = 1,
  limit: number = 12
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = buildQueryString({
    ...filters,
    sortBy,
    page,
    limit,
  });

  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  return response.data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  const queryParams = buildQueryString({ limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.FEATURED_PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Search products
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = buildQueryString({ q: query, page, limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.SEARCH_PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  category: string,
  page: number = 1,
  limit: number = 12
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = buildQueryString({ category, page, limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get products by brand
 */
export const getProductsByBrand = async (
  brand: string,
  page: number = 1,
  limit: number = 12
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = buildQueryString({ brand, page, limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get related products
 */
export const getRelatedProducts = async (
  productId: string,
  limit: number = 4
): Promise<Product[]> => {
  const queryParams = buildQueryString({ related: productId, limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get new arrivals
 */
export const getNewArrivals = async (limit: number = 8): Promise<Product[]> => {
  const queryParams = buildQueryString({ sortBy: 'newest', limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get best sellers
 */
export const getBestSellers = async (limit: number = 8): Promise<Product[]> => {
  const queryParams = buildQueryString({ sortBy: 'popular', limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};

/**
 * Get sale products
 */
export const getSaleProducts = async (
  page: number = 1,
  limit: number = 12
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = buildQueryString({ onSale: true, page, limit });
  const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}${queryParams}`);
  return response.data;
};