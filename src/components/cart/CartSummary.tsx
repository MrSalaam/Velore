import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { cart, discountAmount, applyDiscountCode, removeDiscountCode, discountCode } = useCart();
  
  const subtotal = cart.subtotal;
  const tax = cart.tax;
  const total = cart.total;
  
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = subtotal >= 100 ? 0 : 10;
  const finalTotal = total + shippingCost;

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const success = await applyDiscountCode(promoCode);
      if (success) {
        setPromoCode('');
      } else {
        setError('Invalid coupon code');
      }
    } catch (err) {
      setError('Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeDiscountCode();
    setPromoCode('');
    setError('');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Coupon Code Section */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code
        </label>
        
        {discountCode ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {discountCode}
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                error={error}
              />
              <Button
                onClick={handleApplyCoupon}
                variant="outline"
                isLoading={isApplying}
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-gray-600">
          <span>Tax</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>

        {/* Free Shipping Progress */}
        {subtotal < 100 && (
          <div className="pt-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Free shipping at $100</span>
              <span className="font-medium">
                {formatCurrency(100 - subtotal)} to go
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${(subtotal / 100) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between text-lg font-bold text-gray-900 pb-6 border-b border-gray-200 mb-6">
        <span>Total</span>
        <span>{formatCurrency(finalTotal)}</span>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Button
          onClick={handleCheckout}
          variant="primary"
          size="lg"
          fullWidth
          className="mb-3"
        >
          Proceed to Checkout
        </Button>
      )}

      {/* Continue Shopping Link */}
      <button
        onClick={() => navigate('/shop')}
        className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Continue Shopping
      </button>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Secure checkout guaranteed</span>
        </div>
      </div>
    </div>
  );
};