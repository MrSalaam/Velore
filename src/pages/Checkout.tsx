import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Package, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Button } from '../components/common/Button';
import { Address } from '../types';
import { toast } from 'react-hot-toast';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutData {
  shippingAddress?: Address;
  shippingMethod?: 'standard' | 'express' | 'overnight';
  billingAddress?: Address;
  sameAsShipping?: boolean;
  paymentMethodId?: string;
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, emptyCart } = useCart();
  const items = cart.items;
  const subtotal = cart.subtotal;

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock saved addresses (would come from user profile in real app)
  const savedAddresses: Address[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
  ];

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items, navigate]);

  const steps = [
    {
      id: 'shipping',
      title: 'Shipping',
      icon: Package,
      description: 'Shipping address',
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: CreditCard,
      description: 'Payment method',
    },
    {
      id: 'review',
      title: 'Review',
      icon: CheckCircle,
      description: 'Review order',
    },
  ];

  const handleShippingSubmit = (data: {
    shippingAddress: Address;
    shippingMethod: 'standard' | 'express' | 'overnight';
  }) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingAddress: data.shippingAddress,
      shippingMethod: data.shippingMethod,
    }));
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (data: {
    billingAddress: Address;
    sameAsShipping: boolean;
  }) => {
    setCheckoutData((prev) => ({
      ...prev,
      billingAddress: data.billingAddress,
      sameAsShipping: data.sameAsShipping,
    }));
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (paymentMethodId: string) => {
    setIsProcessing(true);

    try {
      // Simulate API call to process order
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, would make API call here
      const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      // Clear cart
      emptyCart();

      // Navigate to success page with order ID
      navigate(`/checkout/success?orderId=${orderId}`, {
        state: {
          orderId,
          orderData: {
            ...checkoutData,
            items,
            subtotal,
            paymentMethodId,
          },
        },
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order processing error:', error);
      toast.error('Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleBackToShipping = () => {
    setCurrentStep('shipping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPayment = () => {
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getShippingCost = () => {
    if (!checkoutData.shippingMethod) return 0;
    const costs = { standard: 10, express: 25, overnight: 40 };
    return subtotal >= 100 && checkoutData.shippingMethod === 'standard'
      ? 0
      : costs[checkoutData.shippingMethod];
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted =
                (currentStep === 'payment' && step.id === 'shipping') ||
                (currentStep === 'review' &&
                  (step.id === 'shipping' || step.id === 'payment'));

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    {/* Step Circle */}
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all
                        ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle size={32} />
                      ) : (
                        <Icon size={32} />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="text-center">
                      <p
                        className={`font-semibold ${
                          isActive || isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 mb-12">
                      <div
                        className={`h-full rounded transition-all ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms Section */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                initialData={{
                  shippingAddress: checkoutData.shippingAddress,
                  shippingMethod: checkoutData.shippingMethod,
                }}
                savedAddresses={savedAddresses}
              />
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={handleBackToShipping}
                initialData={{
                  billingAddress: checkoutData.billingAddress,
                  sameAsShipping: checkoutData.sameAsShipping,
                }}
                shippingAddress={checkoutData.shippingAddress}
              />
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Your Order
                </h2>

                {/* Shipping Information */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={20} className="text-indigo-600" />
                      Shipping Address
                    </h3>
                    <button
                      onClick={handleBackToShipping}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  {checkoutData.shippingAddress && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        {checkoutData.shippingAddress.firstName}{' '}
                        {checkoutData.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-600">
                        {checkoutData.shippingAddress.street}
                      </p>
                      <p className="text-gray-600">
                        {checkoutData.shippingAddress.city},{' '}
                        {checkoutData.shippingAddress.state}{' '}
                        {checkoutData.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">
                        {checkoutData.shippingAddress.phone}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 capitalize">
                        Shipping Method: {checkoutData.shippingMethod?.replace('-', ' ')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard size={20} className="text-indigo-600" />
                      Payment Information
                    </h3>
                    <button
                      onClick={handleBackToPayment}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900 mb-2">
                      Card ending in ****
                    </p>
                    {checkoutData.billingAddress && !checkoutData.sameAsShipping && (
                      <>
                        <p className="text-sm text-gray-600 mb-2">Billing Address:</p>
                        <p className="text-gray-600">
                          {checkoutData.billingAddress.firstName}{' '}
                          {checkoutData.billingAddress.lastName}
                        </p>
                        <p className="text-gray-600">
                          {checkoutData.billingAddress.street}
                        </p>
                        <p className="text-gray-600">
                          {checkoutData.billingAddress.city},{' '}
                          {checkoutData.billingAddress.state}{' '}
                          {checkoutData.billingAddress.zipCode}
                        </p>
                      </>
                    )}
                    {checkoutData.sameAsShipping && (
                      <p className="text-sm text-gray-600">
                        Same as shipping address
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Form for Final Submission */}
                <PaymentForm
                  onSubmit={handlePlaceOrder}
                  onBack={handleBackToPayment}
                  initialData={{
                    billingAddress: checkoutData.billingAddress,
                    sameAsShipping: checkoutData.sameAsShipping,
                  }}
                  shippingAddress={checkoutData.shippingAddress}
                  isReview={true}
                  isProcessing={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <OrderSummary />

              {/* Security Badge */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-green-600" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-600">
                      SSL encrypted transaction
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    100% Authentic Products
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    30-Day Money Back Guarantee
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    Free Returns & Exchanges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;