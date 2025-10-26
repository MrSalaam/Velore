import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    if (item.quantity < item.product.stock) {
      updateItemQuantity(item.productId, item.selectedSize, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItemQuantity(item.productId, item.selectedSize, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId, item.selectedSize);
  };

  const itemTotal = item.product.price * item.quantity;
  const hasDiscount = item.product.discount && item.product.discount > 0;
  const discountedPrice = hasDiscount
    ? item.product.price * (1 - item.product.discount! / 100)
    : item.product.price;
  const discountedTotal = discountedPrice * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name & Brand */}
        <div className="mb-2">
          <p className="text-sm text-gray-500">{item.product.brand}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {item.product.name}
          </h3>
        </div>

        {/* Size */}
        <p className="text-sm text-gray-600 mb-2">Size: {item.selectedSize}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-gray-900">
            {formatCurrency(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(item.product.price)}
            </span>
          )}
        </div>

        {/* Quantity Controls - Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.product.stock}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.product.stock && (
          <p className="text-xs text-amber-600 mt-2">
            Maximum stock reached
          </p>
        )}
      </div>

      {/* Quantity & Total - Desktop */}
      <div className="hidden md:flex flex-col items-end gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.product.stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">
            {formatCurrency(discountedTotal)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              {formatCurrency(itemTotal)}
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
};