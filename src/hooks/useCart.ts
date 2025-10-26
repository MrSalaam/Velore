import { useCallback } from 'react';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '../utils/constants';

export const useCart = () => {
  const {
    cart,
    shippingCost,
    discountAmount,
    discountCode,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setShippingCost,
    applyDiscount,
    removeDiscount,
    getItemQuantity,
    isItemInCart,
  } = useCartStore();

  // Add item with toast notification
  const addToCart = useCallback(
    (product: Product, selectedSize: string, quantity: number = 1) => {
      addItem(product, selectedSize, quantity);
      toast.success(SUCCESS_MESSAGES.PRODUCT_ADDED);
    },
    [addItem]
  );

  // Remove item with toast notification
  const removeFromCart = useCallback(
    (productId: string, selectedSize: string) => {
      removeItem(productId, selectedSize);
      toast.success(SUCCESS_MESSAGES.PRODUCT_REMOVED);
    },
    [removeItem]
  );

  // Update item quantity
  const updateItemQuantity = useCallback(
    (productId: string, selectedSize: string, quantity: number) => {
      updateQuantity(productId, selectedSize, quantity);
    },
    [updateQuantity]
  );

  // Increment quantity
  const incrementQuantity = useCallback(
    (productId: string, selectedSize: string) => {
      const currentQuantity = getItemQuantity(productId, selectedSize);
      updateQuantity(productId, selectedSize, currentQuantity + 1);
    },
    [getItemQuantity, updateQuantity]
  );

  // Decrement quantity
  const decrementQuantity = useCallback(
    (productId: string, selectedSize: string) => {
      const currentQuantity = getItemQuantity(productId, selectedSize);
      if (currentQuantity > 1) {
        updateQuantity(productId, selectedSize, currentQuantity - 1);
      } else {
        removeFromCart(productId, selectedSize);
      }
    },
    [getItemQuantity, updateQuantity, removeFromCart]
  );

  // Clear entire cart
  const emptyCart = useCallback(() => {
    clearCart();
    toast.success('Cart cleared');
  }, [clearCart]);

  // Apply discount code
  const applyDiscountCode = useCallback(
    async (code: string) => {
      try {
        // In a real app, you would validate with API
        // const response = await validateDiscountCode(code, cart.subtotal);
        
        // Mock validation
        if (code === 'SAVE10') {
          applyDiscount(code, cart.subtotal * 0.1);
          toast.success('Discount code applied!');
          return true;
        } else {
          toast.error('Invalid discount code');
          return false;
        }
      } catch (error) {
        toast.error('Failed to apply discount code');
        return false;
      }
    },
    [applyDiscount, cart.subtotal]
  );

  // Remove discount code
  const removeDiscountCode = useCallback(() => {
    removeDiscount();
    toast.success('Discount code removed');
  }, [removeDiscount]);

  // Check if cart is empty
  const isEmpty = cart.items.length === 0;

  // Get cart item count
  const itemCount = cart.totalItems;

  return {
    // State
    cart,
    shippingCost,
    discountAmount,
    discountCode,
    isEmpty,
    itemCount,

    // Actions
    addToCart,
    removeFromCart,
    updateItemQuantity,
    incrementQuantity,
    decrementQuantity,
    emptyCart,
    setShippingCost,
    applyDiscountCode,
    removeDiscountCode,
    getItemQuantity,
    isItemInCart,
  };
};