import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Mail,
  Download,
  Home,
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderData {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
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
  shippingMethod: string;
  estimatedDelivery: string;
  email: string;
}

export const CheckoutSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Get order data from location state or fetch from API
    if (location.state?.orderId) {
      // Mock order data - in real app, would fetch from API using orderId
      const mockOrderData: OrderData = {
        orderId: location.state.orderId,
        items: location.state.orderData?.items?.map((item: any) => ({
          productId: item.productId,
          productName: item.product.name,
          brand: item.product.brand,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.product.discount
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price,
          image: item.product.images[0],
        })) || [],
        subtotal: location.state.orderData?.subtotal || 0,
        shipping: 10,
        tax: (location.state.orderData?.subtotal || 0) * 0.08,
        total: (location.state.orderData?.subtotal || 0) * 1.08 + 10,
        shippingAddress: location.state.orderData?.shippingAddress || {
          firstName: 'John',
          lastName: 'Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '+1 (555) 123-4567',
        },
        shippingMethod: location.state.orderData?.shippingMethod || 'standard',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
          'en-US',
          { month: 'long', day: 'numeric', year: 'numeric' }
        ),
        email: 'customer@example.com',
      };

      setOrderData(mockOrderData);
      setIsLoading(false);
    } else if (orderId) {
      // Fetch order data from API
      setIsLoading(true);
      setTimeout(() => {
        // Mock API call
        setOrderData({
          orderId,
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '+1 (555) 123-4567',
          },
          shippingMethod: 'standard',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-US',
            { month: 'long', day: 'numeric', year: 'numeric' }
          ),
          email: 'customer@example.com',
        });
        setIsLoading(false);
      }, 1000);
    } else {
      // No order ID, redirect to home
      navigate('/');
    }

    // Confetti effect on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 2;

      // Create confetti particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.left = randomInRange(0, 100) + '%';
        particle.style.animationDuration = randomInRange(2, 4) + 's';
        particle.style.backgroundColor = [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
          '#10b981',
        ][Math.floor(Math.random() * 5)];
        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 4000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [location, orderId, navigate]);

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully!');
    // In real app, would generate and download PDF receipt
  };

  const handleTrackOrder = () => {
    navigate(`/account/orders/${orderData?.orderId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Success Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="mb-6 animate-bounce">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={64} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-500">
            Order #{orderData.orderId}
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Confirmation Message */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <Mail className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Confirmation Email Sent
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We've sent a confirmation email to{' '}
                    <span className="font-medium text-gray-900">
                      {orderData.email}
                    </span>
                    . Please check your inbox for order details and tracking
                    information.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={24} className="text-indigo-600" />
                Order Items
              </h2>

              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-indigo-600" />
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Delivery Address
                  </p>
                  <p className="font-medium text-gray-900">
                    {orderData.shippingAddress.firstName}{' '}
                    {orderData.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {orderData.shippingAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {orderData.shippingAddress.city},{' '}
                    {orderData.shippingAddress.state}{' '}
                    {orderData.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">
                    {orderData.shippingAddress.phone}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Shipping Method
                    </span>
                    <span className="font-medium text-gray-900 capitalize">
                      {orderData.shippingMethod} Shipping
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Estimated Delivery
                    </span>
                    <span className="font-medium text-gray-900">
                      {orderData.estimatedDelivery}
                    </span>
                  </div>
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
                    <span>{formatCurrency(orderData.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{formatCurrency(orderData.shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Tax</span>
                    <span>{formatCurrency(orderData.tax)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>{formatCurrency(orderData.total)}</span>
                </div>

                <Button
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  fullWidth
                  leftIcon={<Download size={18} />}
                >
                  Download Receipt
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleTrackOrder}
                  variant="primary"
                  fullWidth
                  leftIcon={<Truck size={18} />}
                >
                  Track Order
                </Button>

                <Link to="/shop">
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<ShoppingBag size={18} />}
                  >
                    Continue Shopping
                  </Button>
                </Link>

                <Link to="/">
                  <Button variant="outline" fullWidth leftIcon={<Home size={18} />}>
                    Back to Home
                  </Button>
                </Link>
              </div>

              {/* Next Steps */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What's Next?
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      size={16}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Package
                      size={16}
                      className="text-indigo-600 flex-shrink-0 mt-0.5"
                    />
                    <span>We'll send shipping updates via email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Truck
                      size={16}
                      className="text-indigo-600 flex-shrink-0 mt-0.5"
                    />
                    <span>Track your order anytime in your account</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="max-w-5xl mx-auto mt-12 bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              Our customer support team is here to assist you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:support@perfumestore.com"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Mail size={20} />
                Email Support
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                📞 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti CSS */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-particle {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          z-index: 9999;
          animation: confetti-fall linear;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
export default CheckoutSuccess;