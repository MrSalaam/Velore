import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import { CartItem } from '../types/cart';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateItemQuantity, removeFromCart, emptyCart } = useCart();
  const { items, subtotal, tax, total } = cart;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Mock shipping cost (free shipping over $100)
  const shippingCost = subtotal >= 100 ? 0 : 10;
  const finalTotal = total + shippingCost - discount;

  const handleQuantityChange = (productId: string, selectedSize: string, newQuantity: number) => {
    const item = items.find(
      (i: CartItem) => i.productId === productId && i.selectedSize === selectedSize
    );

    if (!item) return;

    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (newQuantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} items available in stock`);
      return;
    }

    updateItemQuantity(productId, selectedSize, newQuantity);
    toast.success('Cart updated');
  };

  const handleRemoveItem = (productId: string, selectedSize: string) => {
    removeFromCart(productId, selectedSize);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      emptyCart();
      toast.success('Cart cleared');
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    // Mock coupon validation
    const validCoupons: Record<string, number> = {
      SAVE10: 10,
      SAVE20: 20,
      WELCOME15: 15,
    };

    const couponDiscount = validCoupons[couponCode.toUpperCase()];

    if (couponDiscount) {
      const discountAmount = (subtotal * couponDiscount) / 100;
      setDiscount(discountAmount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon applied! You saved ${formatCurrency(discountAmount)}`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty Cart Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={64} className="text-gray-400" />
              </div>
            </div>

            {/* Empty State Text */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="primary" size="lg" leftIcon={<ShoppingBag size={20} />}>
                  Start Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-all duration-300 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block mb-4">
                <span className="text-emerald-600 font-medium text-sm tracking-[0.3em] uppercase">
                  Your Cart
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-4 tracking-tight">
                Shopping
                <span className="block font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                  Cart
                </span>
              </h1>
            </div>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-3 px-6 py-3 border border-red-300 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => {
              const itemPrice = item.product.price;
              const hasDiscount = item.product.discount && item.product.discount > 0;
              const discountedPrice = hasDiscount
                ? itemPrice * (1 - item.product.discount! / 100)
                : itemPrice;
              const itemTotal = discountedPrice * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.selectedSize}`}
                  className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.product.brand}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.productId, item.selectedSize)
                          }
                          className="text-red-600 hover:text-red-700 p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Size */}
                      <p className="text-sm text-gray-600 mb-3">
                        Size: <span className="font-medium">{item.selectedSize}</span>
                      </p>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.selectedSize,
                                  item.quantity - 1
                                )
                              }
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.selectedSize,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(itemTotal)}
                          </div>
                          {hasDiscount && (
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(itemPrice * item.quantity)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                {item.product.discount}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.product.stock && (
                        <p className="text-xs text-orange-600 mt-2">
                          Maximum available quantity reached
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-8">
                <label className="block text-base font-bold text-gray-900 mb-4">
                  Coupon Code
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium transition-all duration-300"
                      disabled={!!appliedCoupon}
                    />
                  </div>
                  {appliedCoupon ? (
                    <Button onClick={handleRemoveCoupon} variant="outline" className="px-6 py-4 rounded-full font-semibold">
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={handleApplyCoupon} variant="primary" className="px-6 py-4 rounded-full font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      Apply
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-emerald-600 mt-3 flex items-center gap-2 font-medium">
                    <Tag size={16} />
                    Coupon "{appliedCoupon}" applied
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Try: SAVE10, SAVE20, or WELCOME15
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-base font-medium">Subtotal</span>
                  <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-base font-medium">Discount</span>
                    <span className="font-bold text-lg">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-base font-medium">Shipping</span>
                  <span className="font-bold text-lg">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-base font-medium">Tax (Estimated)</span>
                  <span className="font-bold text-lg">{formatCurrency(tax)}</span>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < 100 && (
                  <div className="pt-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Add {formatCurrency(100 - subtotal)} more for free shipping!
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${(subtotal / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-2xl font-bold text-gray-900 mb-8">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={() => navigate('/checkout')}
                variant="primary"
                size="lg"
                fullWidth
                className="mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </Button>

              <Link to="/shop">
                <Button variant="outline" size="lg" fullWidth className="font-semibold py-4 rounded-full border-2 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300">
                  Continue Shopping
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
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
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Fast delivery (2-5 days)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;