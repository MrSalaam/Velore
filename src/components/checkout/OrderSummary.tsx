import React from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

export const OrderSummary: React.FC = () => {
  const { cart } = useCart();
  const { items, subtotal, tax, total } = cart;

  const shippingCost = subtotal >= 100 ? 0 : 10;
  const finalTotal = total + shippingCost;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        {items.map((item) => {
          const itemPrice = item.product.price;
          const hasDiscount = item.product.discount && item.product.discount > 0;
          const discountedPrice = hasDiscount
            ? itemPrice * (1 - item.product.discount! / 100)
            : itemPrice;
          const itemTotal = discountedPrice * item.quantity;

          return (
            <div
              key={`${item.productId}-${item.selectedSize}`}
              className="flex gap-3"
            >
              {/* Product Image */}
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.product.brand} • {item.selectedSize}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600">
                    Qty: {item.quantity}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(itemTotal)}
                    </span>
                    {hasDiscount && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatCurrency(itemPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(tax)}
          </span>
        </div>

        {/* Free Shipping Progress */}
        {subtotal < 100 && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Add {formatCurrency(100 - subtotal)} for free shipping</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                style={{ width: `${(subtotal / 100) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
          <span>Total</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg
            className="w-4 h-4 text-green-600"
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
          <span>Secure checkout</span>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="mt-4 bg-gray-50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-xs font-medium text-gray-900">
              30-Day Money Back Guarantee
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Not satisfied? Get a full refund within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};