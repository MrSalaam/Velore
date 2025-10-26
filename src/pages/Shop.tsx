import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, Grid, List } from 'lucide-react';
import { Product } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Button } from '../components/common/Button';

// Mock products data
const allProducts: Product[] = [
  {
    id: '1',
    name: 'Velvet Rose',
    brand: 'Tom Ford',
    price: 285,
    discount: 15,
    rating: 4.8,
    reviewCount: 234,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
    description: 'A luxurious blend of rose and velvet',
    category: 'women',
    inStock: true,
    stock: 45,
    featured: true,
    sizes: [
      { size: '50ml', price: 285, stock: 25 },
      { size: '100ml', price: 320, stock: 20 }
    ],
    fragrance: {
      topNotes: ['Rose', 'Bergamot'],
      middleNotes: ['Jasmine', 'Violet'],
      baseNotes: ['Musk', 'Vanilla'],
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Oud Noir',
    brand: 'Versace',
    price: 320,
    discount: 20,
    rating: 4.9,
    reviewCount: 189,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400'],
    description: 'Deep and mysterious oud fragrance',
    category: 'men',
    inStock: true,
    stock: 32,
    featured: true,
    sizes: [
      { size: '50ml', price: 320, stock: 18 },
      { size: '100ml', price: 380, stock: 14 }
    ],
    fragrance: {
      topNotes: ['Oud', 'Saffron'],
      middleNotes: ['Leather', 'Amber'],
      baseNotes: ['Sandalwood', 'Patchouli'],
    },
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Citrus Bloom',
    brand: 'Chanel',
    price: 245,
    rating: 4.7,
    reviewCount: 312,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
    description: 'Fresh and vibrant citrus notes',
    category: 'unisex',
    inStock: true,
    stock: 67,
    featured: false,
    sizes: [
      { size: '30ml', price: 195, stock: 30 },
      { size: '50ml', price: 245, stock: 25 },
      { size: '100ml', price: 295, stock: 12 }
    ],
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      middleNotes: ['Neroli', 'Petitgrain'],
      baseNotes: ['Cedar', 'White Musk'],
    },
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    name: 'Midnight Oud',
    brand: 'Dior',
    price: 380,
    discount: 10,
    rating: 5.0,
    reviewCount: 156,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'],
    description: 'Intense and captivating evening scent',
    category: 'unisex',
    inStock: true,
    stock: 23,
    featured: true,
    sizes: [
      { size: '50ml', price: 380, stock: 15 },
      { size: '100ml', price: 450, stock: 8 }
    ],
    fragrance: {
      topNotes: ['Bergamot', 'Pink Pepper'],
      middleNotes: ['Oud', 'Rose'],
      baseNotes: ['Amber', 'Incense'],
    },
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '5',
    name: 'Amber Mystique',
    brand: 'Gucci',
    price: 295,
    rating: 4.9,
    reviewCount: 445,
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400'],
    description: 'Warm amber with exotic spices',
    category: 'women',
    inStock: true,
    stock: 89,
    sizes: [
      { size: '50ml', price: 295, stock: 45 },
      { size: '100ml', price: 350, stock: 44 }
    ],
    fragrance: {
      topNotes: ['Amber', 'Cinnamon'],
      middleNotes: ['Orchid', 'Honey'],
      baseNotes: ['Vanilla', 'Tonka Bean'],
    },
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '6',
    name: 'Ocean Blue',
    brand: 'Armani',
    price: 210,
    rating: 4.6,
    reviewCount: 523,
    images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400'],
    description: 'Fresh aquatic fragrance',
    category: 'men',
    inStock: true,
    stock: 134,
    sizes: [
      { size: '50ml', price: 210, stock: 50 },
      { size: '75ml', price: 250, stock: 45 },
      { size: '100ml', price: 290, stock: 39 }
    ],
    fragrance: {
      topNotes: ['Sea Notes', 'Mint'],
      middleNotes: ['Lavender', 'Sage'],
      baseNotes: ['Driftwood', 'Musk'],
    },
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '7',
    name: 'Golden Saffron',
    brand: 'Prada',
    price: 340,
    discount: 15,
    rating: 4.8,
    reviewCount: 267,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
    description: 'Luxurious saffron and gold accord',
    category: 'unisex',
    inStock: true,
    stock: 56,
    sizes: [
      { size: '50ml', price: 340, stock: 30 },
      { size: '100ml', price: 420, stock: 26 }
    ],
    fragrance: {
      topNotes: ['Saffron', 'Cardamom'],
      middleNotes: ['Rose', 'Jasmine'],
      baseNotes: ['Amber', 'Oud'],
    },
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '8',
    name: 'Velvet Night',
    brand: 'Yves Saint Laurent',
    price: 275,
    rating: 4.7,
    reviewCount: 389,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400'],
    description: 'Sensual evening fragrance',
    category: 'women',
    inStock: true,
    stock: 72,
    sizes: [
      { size: '30ml', price: 225, stock: 25 },
      { size: '50ml', price: 275, stock: 30 },
      { size: '100ml', price: 350, stock: 17 }
    ],
    fragrance: {
      topNotes: ['Blackberry', 'Plum'],
      middleNotes: ['Iris', 'Violet'],
      baseNotes: ['Vanilla', 'Patchouli'],
    },
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '9',
    name: 'Leather & Wood',
    brand: 'Tom Ford',
    price: 365,
    rating: 5.0,
    reviewCount: 198,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
    description: 'Bold leather and wood composition',
    category: 'men',
    inStock: true,
    stock: 41,
    sizes: [
      { size: '50ml', price: 365, stock: 22 },
      { size: '100ml', price: 450, stock: 19 }
    ],
    fragrance: {
      topNotes: ['Leather', 'Black Pepper'],
      middleNotes: ['Cedarwood', 'Tobacco'],
      baseNotes: ['Vetiver', 'Amber'],
    },
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '10',
    name: 'Rose Garden',
    brand: 'Chanel',
    price: 295,
    rating: 4.8,
    reviewCount: 421,
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400'],
    description: 'Elegant rose bouquet',
    category: 'women',
    inStock: true,
    stock: 98,
    sizes: [
      { size: '50ml', price: 295, stock: 50 },
      { size: '100ml', price: 370, stock: 48 }
    ],
    fragrance: {
      topNotes: ['Rose', 'Peony'],
      middleNotes: ['Lily', 'Magnolia'],
      baseNotes: ['Cedar', 'Musk'],
    },
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '11',
    name: 'Spice Route',
    brand: 'Armani',
    price: 255,
    discount: 10,
    rating: 4.6,
    reviewCount: 178,
    images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400'],
    description: 'Exotic spice blend',
    category: 'men',
    inStock: true,
    stock: 64,
    sizes: [
      { size: '50ml', price: 255, stock: 35 },
      { size: '100ml', price: 320, stock: 29 }
    ],
    fragrance: {
      topNotes: ['Cardamom', 'Pepper'],
      middleNotes: ['Cinnamon', 'Nutmeg'],
      baseNotes: ['Vetiver', 'Sandalwood'],
    },
    createdAt: new Date('2024-04-01'),
  },
  {
    id: '12',
    name: 'White Musk',
    brand: 'Dior',
    price: 220,
    rating: 4.5,
    reviewCount: 356,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'],
    description: 'Clean and fresh musk',
    category: 'unisex',
    inStock: true,
    stock: 112,
    sizes: [
      { size: '30ml', price: 180, stock: 40 },
      { size: '50ml', price: 220, stock: 45 },
      { size: '100ml', price: 280, stock: 27 }
    ],
    fragrance: {
      topNotes: ['White Musk', 'Cotton'],
      middleNotes: ['Jasmine', 'Lily'],
      baseNotes: ['Amber', 'Sandalwood'],
    },
    createdAt: new Date('2024-04-05'),
  },
];

interface FilterState {
  category?: 'men' | 'women' | 'unisex';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  size?: string;
  rating?: number;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const itemsPerPage = 12;

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') as 'men' | 'women' | 'unisex' | null;
    const search = searchParams.get('search');
    if (category) {
      setFilters((prev) => ({ ...prev, category }));
    }
    if (search) {
      setFilters((prev) => ({ ...prev, searchQuery: search }));
    }
  }, [searchParams]);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Brand filter
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    // Size filter
    if (filters.size && !product.sizes.some(s => s.size === filters.size)) {
      return false;
    }

    // Rating filter
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop Perfumes</h1>
          <p className="text-gray-600">
            Discover our complete collection of luxury fragrances
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilters
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={filters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Results Count */}
                <div className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {sortedProducts.length}
                  </span>{' '}
                  {sortedProducts.length === 1 ? 'product' : 'products'} found
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={18} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as SortOption)}
                      className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                    />
                  </div>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                      {filters.category}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, category: undefined }))
                        }
                        className="hover:text-indigo-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.brand && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                      {filters.brand}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, brand: undefined }))
                        }
                        className="hover:text-indigo-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                      ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: undefined,
                            maxPrice: undefined,
                          }))
                        }
                        className="hover:text-indigo-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.size && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                      {filters.size}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, size: undefined }))
                        }
                        className="hover:text-indigo-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.rating && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                      {filters.rating}+ stars
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, rating: undefined }))
                        }
                        className="hover:text-indigo-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={handleClearFilters} variant="primary">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={paginatedProducts}
                  isLoading={isLoading}
                  columns={{
                    mobile: 1,
                    tablet: 2,
                    desktop: viewMode === 'grid' ? 3 : 2,
                  }}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 border rounded-lg transition-colors ${
                                page === currentPage
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page}>...</span>;
                        }
                        return null;
                      })}

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Filters Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <ProductFilters
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                  setShowMobileFilters(false);
                }}
                onClearFilters={() => {
                  handleClearFilters();
                  setShowMobileFilters(false);
                }}
                activeFilters={filters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Shop;