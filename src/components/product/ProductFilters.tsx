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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl max-h-[85vh] sm:max-h-[80vh] lg:max-h-[70vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 sticky top-0 bg-white z-10 pb-3 sm:pb-4 border-b border-gray-100">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            rightIcon={<X size={14} className="sm:w-4 sm:h-4" />}
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs sm:text-sm"
          >
            <span className="hidden xs:inline">Clear All ({activeFilterCount})</span>
            <span className="xs:hidden">Clear ({activeFilterCount})</span>
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-4 sm:mb-6 lg:mb-8 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Category</h4>
        <div className="space-y-2 sm:space-y-3">
          {categories.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <input
                type="checkbox"
                checked={activeFilters.category === cat.value}
                onChange={() => handleCategoryChange(cat.value as 'men' | 'women' | 'unisex')}
                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <span className="font-medium group-hover:text-emerald-600 transition-colors">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4 sm:mb-6 lg:mb-8 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Price Range</h4>
        <div className="space-y-2 sm:space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <input
                type="checkbox"
                checked={
                  activeFilters.minPrice === range.min &&
                  activeFilters.maxPrice === range.max
                }
                onChange={() => handlePriceChange(range.min, range.max)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <span className="font-medium group-hover:text-emerald-600 transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-4 sm:mb-6 lg:mb-8 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Brand</h4>
        <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-56 lg:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100 hover:scrollbar-thumb-emerald-400 pr-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <input
                type="checkbox"
                checked={activeFilters.brand === brand}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <span className="font-medium group-hover:text-emerald-600 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-4 sm:mb-6 lg:mb-8 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Size</h4>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <input
                type="checkbox"
                checked={activeFilters.size === size}
                onChange={() => handleSizeChange(size)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <span className="font-medium group-hover:text-emerald-600 transition-colors">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Rating</h4>
        <div className="space-y-2 sm:space-y-3">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <input
                type="checkbox"
                checked={activeFilters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <div className="flex items-center gap-1 sm:gap-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm sm:text-base ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 sm:ml-2 font-medium group-hover:text-emerald-600 transition-colors">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="sticky bottom-0 bg-white pt-4 sm:pt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-2 sm:pb-0 border-t border-gray-100">
        <Button
          onClick={handleApplyFilters}
          variant="primary"
          size="lg"
          fullWidth
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 sm:py-4 rounded-full transition-all duration-300 active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};