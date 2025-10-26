import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Address, CheckoutData, PaymentMethod, Order } from '../types';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '../utils/constants';
import * as orderAPI from '../services/api/orders';
import * as paymentAPI from '../services/api/payment';

export const useCheckout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Go to next step
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  // Go to previous step
  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Go to specific step
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // Update shipping address
  const updateShippingAddress = useCallback((address: Address) => {
    setShippingAddress(address);
    if (useShippingAsBilling) {
      setBillingAddress(address);
    }
  }, [useShippingAsBilling]);

  // Update billing address
  const updateBillingAddress = useCallback((address: Address) => {
    setBillingAddress(address);
  }, []);

  // Toggle use shipping as billing
  const toggleUseShippingAsBilling = useCallback(() => {
    setUseShippingAsBilling((prev) => {
      const newValue = !prev;
      if (newValue && shippingAddress) {
        setBillingAddress(shippingAddress);
      }
      return newValue;
    });
  }, [shippingAddress]);

  // Update shipping method
  const updateShippingMethod = useCallback((method: string) => {
    setSelectedShippingMethod(method);
  }, []);

  // Update payment method
  const updatePaymentMethod = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
  }, []);

  // Update order notes
  const updateOrderNotes = useCallback((notes: string) => {
    setOrderNotes(notes);
  }, []);

  // Validate checkout data
  const validateCheckout = useCallback((): boolean => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      navigate('/login');
      return false;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return false;
    }

    if (!shippingAddress) {
      toast.error('Please add a shipping address');
      return false;
    }

    if (!billingAddress) {
      toast.error('Please add a billing address');
      return false;
    }

    if (!selectedShippingMethod) {
      toast.error('Please select a shipping method');
      return false;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    return true;
  }, [
    isAuthenticated,
    cart.items.length,
    shippingAddress,
    billingAddress,
    selectedShippingMethod,
    paymentMethod,
    navigate,
  ]);

  // Process checkout
  const processCheckout = useCallback(async (): Promise<Order | null> => {
    if (!validateCheckout()) {
      return null;
    }

    try {
      setIsProcessing(true);

      // Create payment intent
      const paymentIntent = await paymentAPI.createPaymentIntent(cart.total);

      // Confirm payment
      const paymentResult = await paymentAPI.confirmPayment(
        paymentIntent.paymentIntentId,
        paymentMethod!
      );

      if (!paymentResult.success) {
        toast.error('Payment failed. Please try again.');
        setIsProcessing(false);
        return null;
      }

      // Create order
      const checkoutData: CheckoutData = {
        shippingAddress: shippingAddress!,
        billingAddress: billingAddress!,
        shippingMethod: selectedShippingMethod,
        paymentMethod: paymentMethod!,
        useShippingAsBilling,
        notes: orderNotes,
      };

      const order = await orderAPI.createOrder(checkoutData);

      // Clear cart
      clearCart();

      // Set completed order
      setCompletedOrder(order);

      toast.success(SUCCESS_MESSAGES.ORDER_PLACED);
      setIsProcessing(false);

      // Navigate to success page
      navigate(`/checkout/success?orderId=${order.id}`);

      return order;
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || 'Checkout failed. Please try again.');
      return null;
    }
  }, [
    validateCheckout,
    cart.total,
    paymentMethod,
    shippingAddress,
    billingAddress,
    selectedShippingMethod,
    useShippingAsBilling,
    orderNotes,
    clearCart,
    navigate,
  ]);

  // Reset checkout
  const resetCheckout = useCallback(() => {
    setCurrentStep(1);
    setShippingAddress(null);
    setBillingAddress(null);
    setSelectedShippingMethod('');
    setPaymentMethod(null);
    setUseShippingAsBilling(true);
    setOrderNotes('');
    setCompletedOrder(null);
    setIsProcessing(false);
  }, []);

  // Load default addresses from user
  const loadDefaultAddresses = useCallback(() => {
    if (user && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
      setShippingAddress(defaultAddress);
      if (useShippingAsBilling) {
        setBillingAddress(defaultAddress);
      }
    }
  }, [user, useShippingAsBilling]);

  // Check if step is complete
  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!shippingAddress;
      case 2:
        return !!selectedShippingMethod;
      case 3:
        return !!paymentMethod;
      case 4:
        return !!completedOrder;
      default:
        return false;
    }
  }, [shippingAddress, selectedShippingMethod, paymentMethod, completedOrder]);

  // Check if can proceed to next step
  const canProceed = useCallback((): boolean => {
    return isStepComplete(currentStep);
  }, [currentStep, isStepComplete]);

  return {
    // State
    currentStep,
    isProcessing,
    shippingAddress,
    billingAddress,
    selectedShippingMethod,
    paymentMethod,
    useShippingAsBilling,
    orderNotes,
    completedOrder,
    cart,

    // Step navigation
    nextStep,
    previousStep,
    goToStep,
    canProceed,
    isStepComplete,

    // Address management
    updateShippingAddress,
    updateBillingAddress,
    toggleUseShippingAsBilling,
    loadDefaultAddresses,

    // Checkout data
    updateShippingMethod,
    updatePaymentMethod,
    updateOrderNotes,

    // Actions
    processCheckout,
    resetCheckout,
    validateCheckout,
  };
};