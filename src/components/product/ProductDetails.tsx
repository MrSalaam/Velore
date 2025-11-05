import React, { useState } from 'react';
import { Star, Heart, Share2, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../common/Button';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '50ml');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const selectedSizeData = product.sizes.find((s) => s.size === selectedSize);
  const currentPrice = selectedSizeData?.price || product.price;
  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? currentPrice * (1 - product.discount! / 100)
    : currentPrice;

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const incrementQuantity = () => {
    if (quantity < (selectedSizeData?.stock || product.stock)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Brand */}
      <p className="text-sm text-emerald-600 font-medium uppercase tracking-wide">
        {product.brand}
      </p>

      {/* Product Name */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
        <span className="text-gray-600 font-medium">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-5xl font-bold text-gray-900">
          {formatCurrency(finalPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-3xl text-gray-400 line-through">
              {formatCurrency(currentPrice)}
            </span>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              Save {product.discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>

      {/* Fragrance Notes */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 space-y-6 shadow-xl">
        <h3 className="font-bold text-gray-900 text-2xl">Fragrance Notes</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">Top Notes</h4>
            <div className="flex flex-wrap gap-3">
              {product.fragrance.topNotes.map((note, index) => (
                <span
                  key={index}
                  className="text-sm bg-white border border-emerald-200 px-4 py-2 rounded-full font-medium text-emerald-700 shadow-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">Middle Notes</h4>
            <div className="flex flex-wrap gap-3">
              {product.fragrance.middleNotes.map((note, index) => (
                <span
                  key={index}
                  className="text-sm bg-white border border-emerald-200 px-4 py-2 rounded-full font-medium text-emerald-700 shadow-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">Base Notes</h4>
            <div className="flex flex-wrap gap-3">
              {product.fragrance.baseNotes.map((note, index) => (
                <span
                  key={index}
                  className="text-sm bg-white border border-emerald-200 px-4 py-2 rounded-full font-medium text-emerald-700 shadow-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-base font-bold text-gray-900 mb-4">
          Select Size
        </label>
        <div className="grid grid-cols-3 gap-4">
          {product.sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => setSelectedSize(size.size)}
              disabled={size.stock === 0}
              className={`
                px-6 py-4 border-2 rounded-full font-semibold transition-all duration-300 hover:scale-105
                ${
                  selectedSize === size.size
                    ? 'border-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-lg'
                    : 'border-gray-300 hover:border-emerald-400'
                }
                ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {size.size}
              {size.stock === 0 && (
                <span className="block text-xs text-gray-500 mt-1">Out of stock</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="block text-base font-bold text-gray-900 mb-4">
          Quantity
        </label>
        <div className="flex items-center gap-6">
          <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden">
            <button
              onClick={decrementQuantity}
              className="px-6 py-3 hover:bg-emerald-50 transition-colors font-bold text-lg"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-8 py-3 font-bold text-lg bg-gray-50">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="px-6 py-3 hover:bg-emerald-50 transition-colors font-bold text-lg"
              disabled={quantity >= (selectedSizeData?.stock || product.stock)}
            >
              +
            </button>
          </div>
          <span className="text-base text-gray-600 font-medium">
            {selectedSizeData?.stock || product.stock} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!product.inStock}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <button
          onClick={handleWishlistToggle}
          className={`
            p-4 border-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg
            ${
              isWishlisted
                ? 'border-red-500 bg-red-50 text-red-500'
                : 'border-gray-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
            }
          `}
        >
          <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <button
          onClick={handleShare}
          className="p-4 border-2 border-gray-300 rounded-full hover:border-emerald-400 transition-all duration-300 hover:scale-110 shadow-lg hover:bg-emerald-50"
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50">
          <Truck className="text-emerald-600 flex-shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Free Shipping</h4>
            <p className="text-base text-gray-600">On orders over $100</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50">
          <ShieldCheck className="text-emerald-600 flex-shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Authentic Products</h4>
            <p className="text-base text-gray-600">100% original</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50">
          <RotateCcw className="text-emerald-600 flex-shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Easy Returns</h4>
            <p className="text-base text-gray-600">30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      {product.inStock && product.stock < 10 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Only {product.stock} left in stock - order soon!
          </p>
        </div>
      )}
    </div>
  );
};