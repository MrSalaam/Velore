import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { useWishlist } from '../hooks/useLocalStorage';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

// Mock product data - In real app, this would come from API
const mockProducts: Product[] = [
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
      { size: '100ml', price: 385, stock: 20 }
    ],
    createdAt: new Date('2024-01-15'),
    fragrance: {
      topNotes: ['Rose', 'Bergamot'],
      middleNotes: ['Jasmine', 'Violet'],
      baseNotes: ['Musk', 'Vanilla'],
    },
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
      { size: '100ml', price: 420, stock: 14 }
    ],
    createdAt: new Date('2024-01-20'),
    fragrance: {
      topNotes: ['Oud', 'Saffron'],
      middleNotes: ['Leather', 'Amber'],
      baseNotes: ['Sandalwood', 'Patchouli'],
    },
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
    featured: true,
    sizes: [
      { size: '30ml', price: 245, stock: 25 },
      { size: '50ml', price: 295, stock: 22 },
      { size: '100ml', price: 345, stock: 20 }
    ],
    createdAt: new Date('2024-01-10'),
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      middleNotes: ['Neroli', 'Petitgrain'],
      baseNotes: ['Cedar', 'White Musk'],
    },
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
      { size: '50ml', price: 380, stock: 12 },
      { size: '100ml', price: 480, stock: 11 }
    ],
    createdAt: new Date('2024-01-25'),
    fragrance: {
      topNotes: ['Bergamot', 'Pink Pepper'],
      middleNotes: ['Oud', 'Rose'],
      baseNotes: ['Amber', 'Incense'],
    },
  },
];

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get wishlist products
    setIsLoading(true);
    setTimeout(() => {
      const products = mockProducts.filter(product => wishlist.includes(product.id));
      setWishlistProducts(products);
      setIsLoading(false);
    }, 500);
  }, [wishlist]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.sizes[0].size, 1);
    toast.success('Added to cart');
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      toast.success('Wishlist cleared');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {wishlistProducts.length > 0 && (
            <Button
              onClick={handleClearWishlist}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding your favorite fragrances to your wishlist to keep track of items you love.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {product.discount && product.discount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                      {product.featured && (
                        <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full backdrop-blur-sm transition-colors group/remove"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} className="text-red-500 group-hover/remove:text-red-600" />
                    </button>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Brand */}
                    <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

                    {/* Name */}
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'bg-yellow-400'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          product.discount
                            ? product.price * (1 - product.discount / 100)
                            : product.price
                        )}
                      </span>
                      {product.discount && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={!product.inStock}
                      leftIcon={<ShoppingCart size={16} />}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => {
                    wishlistProducts.forEach(product => {
                      if (product.inStock) {
                        addToCart(product, product.sizes[0].size, 1);
                      }
                    });
                    toast.success('All available items added to cart');
                  }}
                  variant="primary"
                  leftIcon={<ShoppingCart size={18} />}
                >
                  Add All to Cart
                </Button>
                <Link to="/shop">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;