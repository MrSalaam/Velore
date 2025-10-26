export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: 'men' | 'women' | 'unisex';
  sizes: ProductSize[];
  stock: number;
  rating: number;
  reviewCount: number;
  fragrance: FragranceNotes;
  inStock: boolean;
  featured?: boolean;
  createdAt: Date;
}

export interface ProductSize {
  size: string;
  price: number;
  stock: number;
}

export interface FragranceNotes {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
}

export type ProductCategory = 'men' | 'women' | 'unisex';

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  rating?: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';