import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from './CartItem';
import { Button } from '../common/Button';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, itemCount } = useCart();
  const items = cart.items;
  const subtotal = cart.subtotal;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some products to get started!
              </p>
              <Button
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                variant="primary"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.selectedSize}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(subtotal)}
              </span>
            </div>

            {/* Shipping Notice */}
            <p className="text-xs text-gray-600 text-center mb-4">
              Shipping and taxes calculated at checkout
            </p>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                variant="primary"
                size="lg"
                fullWidth
              >
                Proceed to Checkout
              </Button>
              <Button
                onClick={handleViewCart}
                variant="outline"
                size="lg"
                fullWidth
              >
                View Cart
              </Button>
            </div>

            {/* Continue Shopping Link */}
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-3"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};