import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { useProducts } from '@/hooks/useProducts';


interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFilters: FilterState;
}

interface FilterState {
  category?: 'men' | 'women' | 'unisex';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  size?: string;
  rating?: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  activeFilters,
}) => {
  const { updateFilters } = useProducts();

  const categories = [
    { value: 'men', label: "Men's Fragrances" },
    { value: 'women', label: "Women's Fragrances" },
    { value: 'unisex', label: 'Unisex Fragrances' },
  ];

  const brands = [
    'Chanel',
    'Dior',
    'Tom Ford',
    'Versace',
    'Gucci',
    'Prada',
    'Yves Saint Laurent',
    'Armani',
  ];

  const sizes = ['30ml', '50ml', '75ml', '100ml', '150ml'];

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: 10000 },
  ];

  const ratings = [5, 4, 3, 2, 1];

  const handleCategoryChange = (category: 'men' | 'women' | 'unisex') => {
    onFilterChange({
      ...activeFilters,
      category: activeFilters.category === category ? undefined : category,
    });
  };

  const handleBrandChange = (brand: string) => {
    onFilterChange({
      ...activeFilters,
      brand: activeFilters.brand === brand ? undefined : brand,
    });
  };

  const handleSizeChange = (size: string) => {
    onFilterChange({
      ...activeFilters,
      size: activeFilters.size === size ? undefined : size,
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    const isSameRange = activeFilters.minPrice === min && activeFilters.maxPrice === max;
    onFilterChange({
      ...activeFilters,
      minPrice: isSameRange ? undefined : min,
      maxPrice: isSameRange ? undefined : max,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...activeFilters,
      rating: activeFilters.rating === rating ? undefined : rating,
    });
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const handleApplyFilters = () => {
    // Apply current active filters to the products store
    updateFilters(activeFilters);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            rightIcon={<X size={14} />}
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={activeFilters.category === cat.value}
                onChange={() => handleCategoryChange(cat.value as 'men' | 'women' | 'unisex')}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={
                  activeFilters.minPrice === range.min &&
                  activeFilters.maxPrice === range.max
                }
                onChange={() => handlePriceChange(range.min, range.max)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={activeFilters.brand === brand}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Size</h4>
        <div className="space-y-2">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={activeFilters.size === size}
                onChange={() => handleSizeChange(size)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={activeFilters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={handleApplyFilters}
        className="bg-purple-600 text-white rounded p-2 w-full"
      >
        Apply Filters
      </button>
    </div>
  );
};