import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Cart, Product } from '../types';
import { STORAGE_KEYS, MAX_CART_QUANTITY } from '../utils/constants';
import { calculateCartTotals, getCartItemKey } from '../utils/helpers';

interface CartStore {
  cart: Cart;
  shippingCost: number;
  discountAmount: number;
  discountCode: string | null;
  
  // Actions
  addItem: (product: Product, selectedSize: string, quantity?: number) => void;
  removeItem: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  setShippingCost: (cost: number) => void;
  applyDiscount: (code: string, amount: number) => void;
  removeDiscount: () => void;
  getItemQuantity: (productId: string, selectedSize: string) => number;
  isItemInCart: (productId: string, selectedSize: string) => boolean;
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      shippingCost: 0,
      discountAmount: 0,
      discountCode: null,

      addItem: (product, selectedSize, quantity = 1) => {
        const { cart } = get();
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId === product.id && item.selectedSize === selectedSize
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update existing item quantity
          newItems = cart.items.map((item, index) => {
            if (index === existingItemIndex) {
              const newQuantity = Math.min(
                item.quantity + quantity,
                MAX_CART_QUANTITY
              );
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: product.id,
            product,
            quantity: Math.min(quantity, MAX_CART_QUANTITY),
            selectedSize,
          };
          newItems = [...cart.items, newItem];
        }

        const { shippingCost, discountAmount } = get();
        const updatedCart = calculateCartTotals(newItems, shippingCost, discountAmount);

        set({ cart: updatedCart });
      },

      removeItem: (productId, selectedSize) => {
        const { cart, shippingCost, discountAmount } = get();
        const newItems = cart.items.filter(
          (item) => !(item.productId === productId && item.selectedSize === selectedSize)
        );

        const updatedCart = calculateCartTotals(newItems, shippingCost, discountAmount);

        set({ cart: updatedCart });
      },

      updateQuantity: (productId, selectedSize, quantity) => {
        const { cart, shippingCost, discountAmount } = get();

        if (quantity <= 0) {
          get().removeItem(productId, selectedSize);
          return;
        }

        const newItems = cart.items.map((item) => {
          if (item.productId === productId && item.selectedSize === selectedSize) {
            return {
              ...item,
              quantity: Math.min(quantity, MAX_CART_QUANTITY),
            };
          }
          return item;
        });

        const updatedCart = calculateCartTotals(newItems, shippingCost, discountAmount);

        set({ cart: updatedCart });
      },

      clearCart: () => {
        set({
          cart: initialCart,
          shippingCost: 0,
          discountAmount: 0,
          discountCode: null,
        });
      },

      setShippingCost: (cost) => {
        const { cart, discountAmount } = get();
        const updatedCart = calculateCartTotals(cart.items, cost, discountAmount);

        set({ shippingCost: cost, cart: updatedCart });
      },

      applyDiscount: (code, amount) => {
        const { cart, shippingCost } = get();
        const updatedCart = calculateCartTotals(cart.items, shippingCost, amount);

        set({
          discountCode: code,
          discountAmount: amount,
          cart: updatedCart,
        });
      },

      removeDiscount: () => {
        const { cart, shippingCost } = get();
        const updatedCart = calculateCartTotals(cart.items, shippingCost, 0);

        set({
          discountCode: null,
          discountAmount: 0,
          cart: updatedCart,
        });
      },

      getItemQuantity: (productId, selectedSize) => {
        const { cart } = get();
        const item = cart.items.find(
          (item) => item.productId === productId && item.selectedSize === selectedSize
        );
        return item?.quantity || 0;
      },

      isItemInCart: (productId, selectedSize) => {
        const { cart } = get();
        return cart.items.some(
          (item) => item.productId === productId && item.selectedSize === selectedSize
        );
      },
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);