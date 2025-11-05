import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useLocalStorage';
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
      className="group relative block w-full"
    >
      {/* Product Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

          {/* Premium Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full sm:group-hover:translate-x-full transition-transform duration-1000 z-20"></div>

          {/* Product Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover sm:group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg animate-pulse">
                SAVE {product.discount}%
              </div>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-30 p-2 sm:p-3 rounded-full backdrop-blur-md transition-all duration-300 transform active:scale-95 sm:hover:scale-110 ${
              isWishlisted
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-600 sm:hover:bg-white shadow-md'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={16}
              className={`sm:w-[18px] sm:h-[18px] ${isWishlisted ? 'fill-current' : ''}`}
            />
          </button>

          {/* Quick Actions - Show on Hover (Desktop) / Always Show (Mobile) */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transform translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-500">
            <button
              onClick={handleAddToCart}
              className="w-full bg-white/95 backdrop-blur-sm text-gray-900 font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-full hover:bg-emerald-600 hover:text-white active:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl text-sm sm:text-base"
            >
              <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Add to Cart</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <span className="bg-white text-gray-900 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs sm:text-sm text-emerald-600 font-medium mb-1 sm:mb-2 tracking-wide uppercase">
            {product.brand}
          </p>

          {/* Product Name */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`sm:w-[14px] sm:h-[14px] ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {product.rating}
            </span>
            <span className="text-xs sm:text-sm text-gray-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed hidden sm:block">
            {product.description}
          </p>

          {/* Price Container */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0 mt-auto">
            <div className="flex flex-col w-full sm:w-auto">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-emerald-600 font-medium mt-0.5 sm:mt-1">
                  Save {formatCurrency(product.price * (product.discount! / 100))}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
              product.stock > 50
                ? 'bg-emerald-100 text-emerald-700'
                : product.stock > 20
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {product.stock > 50 ? 'In Stock' : product.stock > 20 ? 'Limited' : 'Low Stock'}
            </div>
          </div>

          {/* Fragrance Notes Preview */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 hidden md:block">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 font-medium uppercase tracking-wider">
              Top Notes
            </p>
            <div className="flex flex-wrap gap-1">
              {product.fragrance?.topNotes?.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};