import React, { useState } from 'react';
import { MapPin, Plus, Check, Truck } from 'lucide-react';
import { Button } from '../common/Button';
import { Address } from '../../types';

interface ShippingFormProps {
  onSubmit: (data: {
    shippingAddress: Address;
    shippingMethod: 'standard' | 'express' | 'overnight';
  }) => void;
  initialData?: {
    shippingAddress?: Address;
    shippingMethod?: 'standard' | 'express' | 'overnight';
  };
  savedAddresses?: Address[];
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  onSubmit,
  initialData,
  savedAddresses = [],
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialData?.shippingAddress?.id || savedAddresses.find((a) => a.isDefault)?.id || null
  );
  const [isAddingNew, setIsAddingNew] = useState(
    !savedAddresses.length || !selectedAddressId
  );
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>(
    initialData?.shippingMethod || 'standard'
  );

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    firstName: initialData?.shippingAddress?.firstName || '',
    lastName: initialData?.shippingAddress?.lastName || '',
    street: initialData?.shippingAddress?.street || '',
    city: initialData?.shippingAddress?.city || '',
    state: initialData?.shippingAddress?.state || '',
    zipCode: initialData?.shippingAddress?.zipCode || '',
    country: initialData?.shippingAddress?.country || 'United States',
    phone: initialData?.shippingAddress?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingOptions = [
    {
      id: 'standard' as const,
      name: 'Standard Shipping',
      price: 10,
      description: '5-7 business days',
      icon: Truck,
    },
    {
      id: 'express' as const,
      name: 'Express Shipping',
      price: 25,
      description: '2-3 business days',
      icon: Truck,
    },
    {
      id: 'overnight' as const,
      name: 'Overnight Shipping',
      price: 40,
      description: 'Next business day',
      icon: Truck,
    },
  ];

  const validateAddress = (address: Partial<Address>): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!address.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!address.street?.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!address.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!address.state?.trim()) {
      newErrors.state = 'State is required';
    }
    if (!address.zipCode?.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }
    if (!address.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(address.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let addressToSubmit: Address;

    if (isAddingNew) {
      if (!validateAddress(newAddress)) {
        return;
      }
      addressToSubmit = {
        ...newAddress as Address,
        id: Math.random().toString(36).substr(2, 9),
      };
    } else {
      const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);
      if (!selectedAddress) {
        return;
      }
      addressToSubmit = selectedAddress;
    }

    onSubmit({
      shippingAddress: addressToSubmit,
      shippingMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin size={24} className="text-indigo-600" />
        Shipping Address
      </h2>

      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              <Plus size={16} />
              {isAddingNew ? 'Use Saved Address' : 'Add New Address'}
            </button>
          </div>

          {!isAddingNew && (
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => setSelectedAddressId(address.id)}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAddressId === address.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {selectedAddressId === address.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={16} />
                      </div>
                    </div>
                  )}

                  <div className="pr-8">
                    <p className="font-semibold text-gray-900">
                      {address.firstName} {address.lastName}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600 text-sm">{address.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAddingNew && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={newAddress.firstName || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={newAddress.lastName || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="street"
              value={newAddress.street || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="123 Main Street, Apt 4B"
            />
            {errors.street && (
              <p className="text-red-600 text-xs mt-1">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={newAddress.city || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                name="state"
                value={newAddress.state || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select State</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
              {errors.state && (
                <p className="text-red-600 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                name="zipCode"
                value={newAddress.zipCode || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="10001"
              />
              {errors.zipCode && (
                <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={newAddress.phone || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Shipping Method</h3>
        <div className="space-y-3">
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => setShippingMethod(option.id)}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  shippingMethod === option.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      shippingMethod === option.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{option.name}</p>
                      <p className="font-bold text-gray-900">${option.price}</p>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>

                  {shippingMethod === option.id && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Check className="text-white" size={16} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-green-600 font-medium mt-3">
          💚 Free shipping on orders over $100
        </p>
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Continue to Payment
      </Button>
    </form>
  );
};