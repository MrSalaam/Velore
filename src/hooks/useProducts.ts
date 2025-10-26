import { useCallback, useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { ProductFilters, SortOption } from '../types';
import { toast } from 'react-hot-toast';

export const useProducts = () => {
  const {
    products,
    featuredProducts,
    currentProduct,
    filters,
    sortBy,
    isLoading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    fetchFeaturedProducts,
    searchProducts,
    setFilters,
    setSortBy,
    clearFilters,
    setCurrentProduct,
    clearError,
    resetPagination,
  } = useProductStore();

  // Fetch products with current filters and pagination
  const loadProducts = useCallback(
    async (page?: number) => {
      try {
        await fetchProducts(page);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load products');
      }
    },
    [fetchProducts]
  );

  // Fetch single product
  const loadProduct = useCallback(
    async (id: string) => {
      try {
        await fetchProductById(id);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load product');
      }
    },
    [fetchProductById]
  );

  // Fetch featured products
  const loadFeaturedProducts = useCallback(async () => {
    try {
      await fetchFeaturedProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to load featured products');
    }
  }, [fetchFeaturedProducts]);

  // Search products
  const search = useCallback(
    async (query: string, page?: number) => {
      try {
        if (!query.trim()) {
          loadProducts();
          return;
        }
        await searchProducts(query, page);
      } catch (error: any) {
        toast.error(error.message || 'Search failed');
      }
    },
    [searchProducts, loadProducts]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      setFilters({ ...filters, ...newFilters });
      resetPagination();
    },
    [filters, setFilters, resetPagination]
  );

  // Update sort option
  const updateSortBy = useCallback(
    (newSortBy: SortOption) => {
      setSortBy(newSortBy);
      resetPagination();
    },
    [setSortBy, resetPagination]
  );

  // Clear all filters
  const resetFilters = useCallback(() => {
    clearFilters();
    resetPagination();
  }, [clearFilters, resetPagination]);

  // Filter by category
  const filterByCategory = useCallback(
    (category: string | undefined) => {
      updateFilters({ category: category as any });
    },
    [updateFilters]
  );

  // Filter by brand
  const filterByBrand = useCallback(
    (brand: string | undefined) => {
      updateFilters({ brand });
    },
    [updateFilters]
  );

  // Filter by price range
  const filterByPriceRange = useCallback(
    (minPrice: number | undefined, maxPrice: number | undefined) => {
      updateFilters({ minPrice, maxPrice });
    },
    [updateFilters]
  );

  // Filter by rating
  const filterByRating = useCallback(
    (rating: number | undefined) => {
      updateFilters({ rating });
    },
    [updateFilters]
  );

  // Filter by stock
  const filterByStock = useCallback(
    (inStock: boolean | undefined) => {
      updateFilters({ inStock });
    },
    [updateFilters]
  );

  // Load next page
  const loadNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      loadProducts(pagination.page + 1);
    }
  }, [pagination, loadProducts]);

  // Load previous page
  const loadPreviousPage = useCallback(() => {
    if (pagination.page > 1) {
      loadProducts(pagination.page - 1);
    }
  }, [pagination, loadProducts]);

  // Go to specific page
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        loadProducts(page);
      }
    },
    [pagination.totalPages, loadProducts]
  );

  // Check if there are more pages
  const hasNextPage = pagination.page < pagination.totalPages;
  const hasPreviousPage = pagination.page > 1;

  // Get active filters count
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined
  ).length;

  // Check if any filters are active
  const hasActiveFilters = activeFiltersCount > 0;

  return {
    // State
    products,
    featuredProducts,
    currentProduct,
    filters,
    sortBy,
    isLoading,
    error,
    pagination,
    hasNextPage,
    hasPreviousPage,
    activeFiltersCount,
    hasActiveFilters,

    // Actions
    loadProducts,
    loadProduct,
    loadFeaturedProducts,
    search,
    updateFilters,
    updateSortBy,
    resetFilters,
    filterByCategory,
    filterByBrand,
    filterByPriceRange,
    filterByRating,
    filterByStock,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    setCurrentProduct,
    clearError,
  };
};