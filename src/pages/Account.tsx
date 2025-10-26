import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Edit2,
  Mail,
  Phone,
  Calendar,
  Shield,
  CreditCard,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

// Mock user data
const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://i.pravatar.cc/150?img=12',
  memberSince: '2023-01-15',
  totalOrders: 24,
  totalSpent: 3450.0,
  rewardPoints: 450,
};

const recentOrders = [
  {
    id: 'ORD-001',
    date: '2024-10-20',
    status: 'delivered',
    total: 285.0,
    items: 2,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100',
  },
  {
    id: 'ORD-002',
    date: '2024-10-15',
    status: 'shipped',
    total: 420.0,
    items: 3,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=100',
  },
  {
    id: 'ORD-003',
    date: '2024-10-10',
    status: 'processing',
    total: 195.0,
    items: 1,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=100',
  },
];

const savedAddresses = [
  {
    id: '1',
    type: 'home',
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    firstName: 'John',
    lastName: 'Doe',
    street: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
];

const wishlistItems = [
  {
    id: '1',
    name: 'Midnight Oud',
    brand: 'Dior',
    price: 380,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100',
    inStock: true,
  },
  {
    id: '2',
    name: 'Golden Saffron',
    brand: 'Prada',
    price: 340,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100',
    inStock: true,
  },
  {
    id: '3',
    name: 'Ocean Blue',
    brand: 'Armani',
    price: 210,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=100',
    inStock: false,
  },
];

type TabType = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    {
      id: 'overview' as TabType,
      name: 'Overview',
      icon: User,
    },
    {
      id: 'orders' as TabType,
      name: 'Orders',
      icon: Package,
    },
    {
      id: 'addresses' as TabType,
      name: 'Addresses',
      icon: MapPin,
    },
    {
      id: 'wishlist' as TabType,
      name: 'Wishlist',
      icon: Heart,
    },
    {
      id: 'settings' as TabType,
      name: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              {/* User Profile */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative inline-block mb-4">
                  <img
                    src={mockUser.avatar}
                    alt={`${mockUser.firstName} ${mockUser.lastName}`}
                    className="w-24 h-24 rounded-full"
                  />
                  <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                    <Edit2 size={14} />
                  </button>
                </div>
                <h2 className="font-bold text-xl text-gray-900">
                  {mockUser.firstName} {mockUser.lastName}
                </h2>
                <p className="text-gray-600 text-sm">{mockUser.email}</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  Member since{' '}
                  {new Date(mockUser.memberSince).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.name}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="text-indigo-600" size={24} />
                      <span className="text-2xl font-bold text-gray-900">
                        {mockUser.totalOrders}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="text-green-600" size={24} />
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(mockUser.totalSpent)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Total Spent</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="text-purple-600" size={24} />
                      <span className="text-2xl font-bold text-gray-900">
                        {mockUser.rewardPoints}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Reward Points</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <Link to="/account/orders">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/account/orders/${order.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={order.image}
                            alt="Order"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {order.id}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(order.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              • {order.items} {order.items === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>
                            <ChevronRight className="text-gray-400 ml-auto mt-1" size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <Heart size={32} className="mb-4" />
                    <h3 className="text-xl font-bold mb-2">Wishlist</h3>
                    <p className="text-indigo-100 mb-4">
                      {wishlistItems.length} items saved
                    </p>
                    <Button
                      onClick={() => setActiveTab('wishlist')}
                      variant="primary"
                      className="bg-white text-indigo-600 hover:bg-gray-100"
                    >
                      View Wishlist
                    </Button>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow p-6 text-white">
                    <MapPin size={32} className="mb-4" />
                    <h3 className="text-xl font-bold mb-2">Addresses</h3>
                    <p className="text-green-100 mb-4">
                      {savedAddresses.length} saved addresses
                    </p>
                    <Button
                      onClick={() => setActiveTab('addresses')}
                      variant="primary"
                      className="bg-white text-green-600 hover:bg-gray-100"
                    >
                      Manage Addresses
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/account/orders/${order.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              {order.id}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items} {order.items === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900 mb-2">
                            {formatCurrency(order.total)}
                          </p>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                  <Button variant="primary" leftIcon={<MapPin size={18} />}>
                    Add New Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-white rounded-lg shadow p-6 relative"
                    >
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="text-indigo-600" size={20} />
                          <span className="font-semibold text-gray-900 capitalize">
                            {address.type}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-gray-600">{address.phone}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" fullWidth>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" fullWidth>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                  <span className="text-gray-600">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-xl font-bold text-gray-900 mb-4">
                          {formatCurrency(item.price)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            disabled={!item.inStock}
                          >
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Heart size={18} className="fill-red-500 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit2 size={16} />}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User size={18} className="text-gray-400" />
                        <span className="text-gray-900">{mockUser.firstName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User size={18} className="text-gray-400" />
                        <span className="text-gray-900">{mockUser.lastName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail size={18} className="text-gray-400" />
                        <span className="text-gray-900">{mockUser.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone size={18} className="text-gray-400" />
                        <span className="text-gray-900">{mockUser.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Password & Security
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Keep your account secure by using a strong password
                  </p>
                  <Button variant="outline" leftIcon={<Shield size={18} />}>
                    Change Password
                  </Button>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Order Updates
                          </p>
                          <p className="text-sm text-gray-600">
                            Get notified about your order status
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Promotional Emails
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive offers and promotions
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;