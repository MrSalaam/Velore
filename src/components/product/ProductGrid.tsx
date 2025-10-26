import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/Loader';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyMessage = 'No products found',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
}) => {
  // Map column numbers to Tailwind classes
  const getGridCols = (cols: number | undefined, prefix: string = '') => {
    const baseClass = prefix ? `${prefix}:` : '';
    switch (cols) {
      case 1:
        return `${baseClass}grid-cols-1`;
      case 2:
        return `${baseClass}grid-cols-2`;
      case 3:
        return `${baseClass}grid-cols-3`;
      case 4:
        return `${baseClass}grid-cols-4`;
      case 5:
        return `${baseClass}grid-cols-5`;
      case 6:
        return `${baseClass}grid-cols-6`;
      default:
        return `${baseClass}grid-cols-4`;
    }
  };

  const gridClasses = `
    grid gap-6
    ${getGridCols(columns.mobile)}
    ${getGridCols(columns.tablet, 'sm')}
    ${getGridCols(columns.desktop, 'lg')}
  `;

  // Show loading skeletons
  if (isLoading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  // Render product grid
  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};