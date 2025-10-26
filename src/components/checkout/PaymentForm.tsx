import React, { useState } from 'react';
import { CreditCard, Lock, Calendar, HelpCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Address } from '../../types';

interface PaymentFormProps {
  onSubmit: (paymentData: any) => void;
  onBack: () => void;
  isProcessing?: boolean;
  isReview?: boolean;
  initialData?: {
    billingAddress?: Address;
    sameAsShipping?: boolean;
  };
  shippingAddress?: Address;
}

interface CardData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onBack,
  isProcessing = false,
  isReview = false,
  initialData,
  shippingAddress,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  const [errors, setErrors] = useState<Partial<CardData>>({});

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardData({ ...cardData, cardNumber: formatted });
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setCardData({ ...cardData, expiryDate: formatted });
      setErrors({ ...errors, expiryDate: '' });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardData({ ...cardData, cvv: value });
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CardData> = {};

    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card' && !validateForm()) {
      return;
    }

    onSubmit({
      method: paymentMethod,
      ...(paymentMethod === 'card' && {
        cardData: {
          ...cardData,
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        },
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard size={24} className="text-indigo-600" />
        Payment Method
      </h2>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`p-4 border-2 rounded-lg transition-all ${
            paymentMethod === 'card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <CreditCard className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-400'}`} size={32} />
          <p className="font-semibold text-center">Credit Card</p>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('paypal')}
          className={`p-4 border-2 rounded-lg transition-all ${
            paymentMethod === 'paypal'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">PP</span>
          </div>
          <p className="font-semibold text-center">PayPal</p>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('apple')}
          className={`p-4 border-2 rounded-lg transition-all ${
            paymentMethod === 'apple'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="w-8 h-8 mx-auto mb-2 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">🍎</span>
          </div>
          <p className="font-semibold text-center">Apple Pay</p>
        </button>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-3 pl-12 border ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {errors.cardNumber && (
              <p className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              value={cardData.cardName}
              onChange={(e) => {
                setCardData({ ...cardData, cardName: e.target.value });
                setErrors({ ...errors, cardName: '' });
              }}
              placeholder="JOHN DOE"
              className={`w-full px-4 py-3 border ${
                errors.cardName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase`}
            />
            {errors.cardName && (
              <p className="text-red-600 text-xs mt-1">{errors.cardName}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-3 pl-12 border ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.expiryDate && (
                <p className="text-red-600 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                CVV *
                <HelpCircle size={14} className="text-gray-400" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className={`w-full px-4 py-3 pl-12 border ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.cvv && (
                <p className="text-red-600 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Save Card */}
          <div className="flex items-center">
            <input
              id="saveCard"
              type="checkbox"
              checked={cardData.saveCard}
              onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      {/* PayPal */}
      {paymentMethod === 'paypal' && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your purchase.</p>
          <div className="w-32 h-32 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-6xl">💳</span>
          </div>
        </div>
      )}

      {/* Apple Pay */}
      {paymentMethod === 'apple' && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Click continue to pay with Apple Pay.</p>
          <div className="w-32 h-32 mx-auto bg-gray-50 rounded-full flex items-center justify-center">
            <span className="text-6xl">🍎</span>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">Secure Payment</p>
            <p>Your payment information is encrypted and secure. We never store your full card details.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          size="lg"
          fullWidth
          disabled={isProcessing}
        >
          Back to Shipping
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Complete Order'}
        </Button>
      </div>
    </form>
  );
};