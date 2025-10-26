import { create } from 'zustand';
import { Product, ProductFilters, SortOption } from '../types';
import * as productAPI from '../services/api/products';

interface ProductStore {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  sortBy: SortOption;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchProducts: (page?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string, page?: number) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  setSortBy: (sortBy: SortOption) => void;
  clearFilters: () => void;
  setCurrentProduct: (product: Product | null) => void;
  clearError: () => void;
  resetPagination: () => void;
}

const initialFilters: ProductFilters = {
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  brand: undefined,
  inStock: undefined,
  rating: undefined,
};

const initialPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  filters: initialFilters,
  sortBy: 'popular',
  isLoading: false,
  error: null,
  pagination: initialPagination,

  fetchProducts: async (page = 1) => {
    try {
      set({ isLoading: true, error: null });

      const { filters, sortBy, pagination } = get();
      
      const response = await productAPI.getProducts(
        filters,
        sortBy,
        page,
        pagination.limit
      );

      set({
        products: response.products,
        pagination: {
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const product = await productAPI.getProductById(id);

      set({
        currentProduct: product,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch product',
        currentProduct: null,
        isLoading: false,
      });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true, error: null });

      const products = await productAPI.getFeaturedProducts(8);

      set({
        featuredProducts: products,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch featured products',
        isLoading: false,
      });
    }
  },

  searchProducts: async (query, page = 1) => {
    try {
      set({ isLoading: true, error: null });

      const { pagination } = get();
      
      const response = await productAPI.searchProducts(
        query,
        page,
        pagination.limit
      );

      set({
        products: response.products,
        pagination: {
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to search products',
        isLoading: false,
      });
    }
  },

  setFilters: (filters) => {
    set({ filters });
    // Automatically fetch products with new filters
    get().fetchProducts(1);
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    // Automatically fetch products with new sort
    get().fetchProducts(1);
  },

  clearFilters: () => {
    set({ filters: initialFilters });
    get().fetchProducts(1);
  },

  setCurrentProduct: (product) => {
    set({ currentProduct: product });
  },

  clearError: () => {
    set({ error: null });
  },

  resetPagination: () => {
    set({ pagination: initialPagination });
  },
}));