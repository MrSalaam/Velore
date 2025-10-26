import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShippingForm } from './ShippingForm';
import { PaymentForm } from './PaymentForm';
import { OrderSummary } from './OrderSummary';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Address } from '../../types';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutFormData {
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  shippingMethod: 'standard' | 'express' | 'overnight';
}

export const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, emptyCart } = useCart();
  const { items, total } = cart;
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [formData, setFormData] = useState<Partial<CheckoutFormData>>({
    sameAsShipping: true,
    shippingMethod: 'standard',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'shipping', label: 'Shipping', number: 1 },
    { id: 'payment', label: 'Payment', number: 2 },
    { id: 'review', label: 'Review', number: 3 },
  ];

  const handleShippingSubmit = (shippingData: {
    shippingAddress: Address;
    shippingMethod: 'standard' | 'express' | 'overnight';
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...shippingData,
    }));
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (paymentData: {
    billingAddress: Address;
    sameAsShipping: boolean;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...paymentData,
    }));
    setCurrentStep('review');
  };

  const handlePlaceOrder = async (paymentMethodId: string) => {
    setIsProcessing(true);

    try {
      // Create order payload
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          price: item.product.price,
        })),
        shippingAddress: formData.shippingAddress!,
        billingAddress: formData.sameAsShipping
          ? formData.shippingAddress!
          : formData.billingAddress!,
        shippingMethod: formData.shippingMethod!,
        paymentMethodId,
        total,
      };

      // TODO: Call API to create order
      // const response = await ordersApi.createOrder(orderData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart
      emptyCart();

      // Show success message
      toast.success('Order placed successfully!');

      // Redirect to success page
      navigate('/checkout/success', {
        state: { orderNumber: 'ORD-' + Date.now() },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToPayment = () => {
    setCurrentStep('payment');
  };

  const handleBackToShipping = () => {
    setCurrentStep('shipping');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-semibold
                      ${
                        currentStep === step.id
                          ? 'bg-indigo-600 text-white'
                          : steps.findIndex((s) => s.id === currentStep) >
                            steps.findIndex((s) => s.id === step.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }
                    `}
                  >
                    {steps.findIndex((s) => s.id === currentStep) >
                    steps.findIndex((s) => s.id === step.id) ? (
                      <Check size={24} />
                    ) : (
                      step.number
                    )}
                  </div>
                  {/* Step Label */}
                  <span
                    className={`
                      mt-2 text-sm font-medium
                      ${
                        currentStep === step.id
                          ? 'text-indigo-600'
                          : 'text-gray-600'
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-4
                      ${
                        steps.findIndex((s) => s.id === currentStep) > index
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Checkout Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                initialData={{
                  shippingAddress: formData.shippingAddress,
                  shippingMethod: formData.shippingMethod,
                }}
                savedAddresses={user?.addresses || []}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={handleBackToShipping}
                initialData={{
                  billingAddress: formData.billingAddress,
                  sameAsShipping: formData.sameAsShipping,
                }}
                shippingAddress={formData.shippingAddress!}
              />
            )}

            {currentStep === 'review' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Your Order
                </h2>

                {/* Order Details */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>{formData.shippingAddress?.street}</p>
                      <p>
                        {formData.shippingAddress?.city},{' '}
                        {formData.shippingAddress?.state}{' '}
                        {formData.shippingAddress?.zipCode}
                      </p>
                      <p>{formData.shippingAddress?.country}</p>
                    </div>
                    <button
                      onClick={handleBackToShipping}
                      className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Billing Address
                    </h3>
                    {formData.sameAsShipping ? (
                      <p className="text-sm text-gray-600">
                        Same as shipping address
                      </p>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p>{formData.billingAddress?.street}</p>
                        <p>
                          {formData.billingAddress?.city},{' '}
                          {formData.billingAddress?.state}{' '}
                          {formData.billingAddress?.zipCode}
                        </p>
                        <p>{formData.billingAddress?.country}</p>
                      </div>
                    )}
                    <button
                      onClick={handleBackToPayment}
                      className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Shipping Method
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {formData.shippingMethod} Shipping
                    </p>
                    <button
                      onClick={handleBackToShipping}
                      className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <PaymentForm
                    onSubmit={handlePlaceOrder}
                    onBack={handleBackToPayment}
                    isReview
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};