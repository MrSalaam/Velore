import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useLocalStorage';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }
    const defaultSize = product.sizes[0]?.size || '50ml';
    addToCart(product, defaultSize, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {hasDiscount && (
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

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
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
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
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
            {formatCurrency(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="sm"
          fullWidth
          disabled={!product.inStock}
          leftIcon={<ShoppingCart size={16} />}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Link>
  );
};