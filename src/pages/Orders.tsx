import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  Download,
  MessageCircle,
  RotateCcw,
  X,
  Clock,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface TrackingUpdate {
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
  };
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  trackingHistory: TrackingUpdate[];
}

// Mock order data
const mockOrder: Order = {
  id: '1',
  orderNumber: 'ORD-2024-001234',
  date: '2024-10-20T10:30:00',
  status: 'shipped',
  items: [
    {
      id: '1',
      productId: '1',
      name: 'Velvet Rose Intense',
      brand: 'Tom Ford',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
      size: '50ml',
      quantity: 1,
      price: 242.25,
    },
    {
      id: '2',
      productId: '2',
      name: 'Oud Noir',
      brand: 'Versace',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
      size: '100ml',
      quantity: 1,
      price: 256.0,
    },
  ],
  subtotal: 498.25,
  shipping: 0,
  tax: 39.86,
  discount: 49.83,
  total: 488.28,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1 (555) 123-4567',
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
  paymentMethod: {
    type: 'Visa',
    last4: '4242',
  },
  shippingMethod: 'Standard Shipping',
  trackingNumber: '1Z999AA10123456784',
  estimatedDelivery: '2024-10-25',
  trackingHistory: [
    {
      date: '2024-10-22',
      time: '14:30',
      status: 'Out for Delivery',
      location: 'New York, NY',
      description: 'Package is out for delivery',
    },
    {
      date: '2024-10-22',
      time: '08:15',
      status: 'At Local Facility',
      location: 'New York, NY',
      description: 'Package arrived at local delivery facility',
    },
    {
      date: '2024-10-21',
      time: '16:45',
      status: 'In Transit',
      location: 'Philadelphia, PA',
      description: 'Package is in transit to destination',
    },
    {
      date: '2024-10-20',
      time: '18:20',
      status: 'Shipped',
      location: 'Chicago, IL',
      description: 'Package has been shipped',
    },
    {
      date: '2024-10-20',
      time: '12:00',
      status: 'Processing',
      location: 'Warehouse',
      description: 'Order is being prepared for shipment',
    },
    {
      date: '2024-10-20',
      time: '10:30',
      status: 'Order Placed',
      location: 'Online',
      description: 'Order has been placed successfully',
    },
  ],
};

export const Orders: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order] = useState<Order>(mockOrder);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'shipped':
        return <Truck className="text-blue-600" size={24} />;
      case 'processing':
        return <Package className="text-yellow-600" size={24} />;
      case 'pending':
        return <Clock className="text-orange-600" size={24} />;
      case 'cancelled':
        return <X className="text-red-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    // In real app, would make API call to cancel order
    toast.success('Order cancellation request submitted');
    setShowCancelModal(false);
    setCancelReason('');
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded successfully');
    // In real app, would generate and download PDF invoice
  };

  const handleContactSupport = () => {
    toast.success('Support chat opened');
    // In real app, would open support chat or redirect to support page
  };

  const canCancelOrder = order.status === 'pending' || order.status === 'processing';
  const canReturnOrder = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/account')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Account
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">
                Order #{order.orderNumber} • Placed on{' '}
                {new Date(order.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                leftIcon={<Download size={18} />}
              >
                Download Invoice
              </Button>
              <Button
                onClick={handleContactSupport}
                variant="outline"
                leftIcon={<MessageCircle size={18} />}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-lg border-2 p-6 mb-8 ${getStatusColor(
            order.status
          )}`}
        >
          <div className="flex items-center gap-4">
            {getStatusIcon(order.status)}
            <div className="flex-1">
              <h3 className="text-lg font-semibold capitalize mb-1">
                {order.status === 'shipped' ? 'Out for Delivery' : order.status}
              </h3>
              <p className="text-sm opacity-90">
                {order.status === 'shipped' &&
                  `Estimated delivery: ${new Date(
                    order.estimatedDelivery
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}`}
                {order.status === 'delivered' && 'Your order has been delivered'}
                {order.status === 'processing' &&
                  'Your order is being prepared for shipment'}
                {order.status === 'pending' &&
                  'Your order is awaiting confirmation'}
                {order.status === 'cancelled' && 'Your order has been cancelled'}
              </p>
              {order.trackingNumber && (
                <p className="text-sm font-medium mt-2">
                  Tracking: {order.trackingNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            {order.trackingHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck size={24} className="text-indigo-600" />
                  Order Tracking
                </h2>

                <div className="space-y-6">
                  {order.trackingHistory.map((update, index) => (
                    <div key={index} className="flex gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? 'bg-indigo-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        {index < order.trackingHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>

                      {/* Update Details */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`font-semibold ${
                              index === 0 ? 'text-indigo-600' : 'text-gray-900'
                            }`}
                          >
                            {update.status}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {update.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {update.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(update.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          • {update.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={24} className="text-indigo-600" />
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <Link
                      to={`/product/${item.productId}`}
                      className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      {canReturnOrder && (
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2 flex items-center gap-1">
                          <RotateCcw size={14} />
                          Return Item
                        </button>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reorder Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button variant="outline" fullWidth>
                  Reorder All Items
                </Button>
              </div>
            </div>

            {/* Shipping & Billing Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-indigo-600" />
                  Shipping Address
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-indigo-600" />
                  Billing Address
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.billingAddress.firstName}{' '}
                    {order.billingAddress.lastName}
                  </p>
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{' '}
                    {order.billingAddress.zipCode}
                  </p>
                  <p className="text-sm mt-3">
                    {order.paymentMethod.type} •••• {order.paymentMethod.last4}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        formatCurrency(order.shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-700">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Actions
                </h3>
                <div className="space-y-3">
                  {canCancelOrder && (
                    <Button
                      onClick={() => setShowCancelModal(true)}
                      variant="outline"
                      fullWidth
                      leftIcon={<X size={18} />}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Cancel Order
                    </Button>
                  )}

                  {canReturnOrder && (
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<RotateCcw size={18} />}
                    >
                      Return Order
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<MessageCircle size={18} />}
                  >
                    Get Help
                  </Button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Delivery Information
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    Est. Delivery:{' '}
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck size={16} className="text-indigo-600" />
                    {order.shippingMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
                placeholder="Please tell us why you're cancelling..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                fullWidth
              >
                Keep Order
              </Button>
              <Button
                onClick={handleCancelOrder}
                variant="primary"
                fullWidth
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Orders;