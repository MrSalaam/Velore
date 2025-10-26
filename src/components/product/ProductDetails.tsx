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
    <div className="space-y-6">
      {/* Brand */}
      <p className="text-sm text-gray-500 uppercase tracking-wide">
        {product.brand}
      </p>

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
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
        <span className="text-gray-600">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-gray-900">
          {formatCurrency(finalPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-2xl text-gray-400 line-through">
              {formatCurrency(currentPrice)}
            </span>
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
              Save {product.discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* Fragrance Notes */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Fragrance Notes</h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Top Notes</h4>
            <div className="flex flex-wrap gap-2">
              {product.fragrance.topNotes.map((note, index) => (
                <span
                  key={index}
                  className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Middle Notes</h4>
            <div className="flex flex-wrap gap-2">
              {product.fragrance.middleNotes.map((note, index) => (
                <span
                  key={index}
                  className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Base Notes</h4>
            <div className="flex flex-wrap gap-2">
              {product.fragrance.baseNotes.map((note, index) => (
                <span
                  key={index}
                  className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full"
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
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Size
        </label>
        <div className="grid grid-cols-3 gap-3">
          {product.sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => setSelectedSize(size.size)}
              disabled={size.stock === 0}
              className={`
                px-4 py-3 border-2 rounded-lg font-medium transition-all
                ${
                  selectedSize === size.size
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 hover:border-gray-400'
                }
                ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {size.size}
              {size.stock === 0 && (
                <span className="block text-xs text-gray-500">Out of stock</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={decrementQuantity}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-6 py-2 font-medium">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
              disabled={quantity >= (selectedSizeData?.stock || product.stock)}
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {selectedSizeData?.stock || product.stock} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <button
          onClick={handleWishlistToggle}
          className={`
            p-4 border-2 rounded-lg transition-colors
            ${
              isWishlisted
                ? 'border-red-500 bg-red-50 text-red-500'
                : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <button
          onClick={handleShare}
          className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <Truck className="text-indigo-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium text-gray-900">Free Shipping</h4>
            <p className="text-sm text-gray-600">On orders over $100</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="text-indigo-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium text-gray-900">Authentic Products</h4>
            <p className="text-sm text-gray-600">100% original</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RotateCcw className="text-indigo-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium text-gray-900">Easy Returns</h4>
            <p className="text-sm text-gray-600">30-day return policy</p>
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