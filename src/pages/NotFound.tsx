import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularProducts = [
    {
      id: '1',
      name: 'Velvet Rose',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200',
      price: 285,
    },
    {
      id: '2',
      name: 'Oud Noir',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200',
      price: 320,
    },
    {
      id: '3',
      name: 'Ocean Breeze',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200',
      price: 195,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        {/* 404 Illustration */}
        <div className="text-center mb-12">
          {/* Animated 404 Number */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-gray-200 select-none">
              404
            </h1>
            
            {/* Floating Perfume Bottles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-bounce-slow">
                <Sparkles size={80} className="text-indigo-400 opacity-60" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            The page you're looking for seems to have vanished like a forgotten scent.
          </p>
          <p className="text-gray-500">
            Let's get you back to discovering amazing fragrances!
          </p>
        </div>

        {/* Auto Redirect Notice */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-indigo-800">
            Redirecting to homepage in{' '}
            <span className="font-bold text-2xl text-indigo-600">{countdown}</span>{' '}
            seconds...
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Looking for something specific?
          </h3>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for perfumes, brands, or categories..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Search
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                <Home className="text-indigo-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Go Home</h3>
              <p className="text-sm text-gray-600">Return to homepage</p>
            </div>
          </Link>

          <Link to="/shop">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <ShoppingBag className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse Shop</h3>
              <p className="text-sm text-gray-600">Explore our collection</p>
            </div>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center group w-full"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <ArrowLeft className="text-green-600" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Go Back</h3>
            <p className="text-sm text-gray-600">Return to previous page</p>
          </button>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Fragrances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-lg font-bold text-indigo-600">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need help finding something?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="text-indigo-600 hover:text-indigo-700 font-medium underline"
            >
              Contact Support
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/faq"
              className="text-indigo-600 hover:text-indigo-700 font-medium underline"
            >
              Visit FAQ
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/sitemap"
              className="text-indigo-600 hover:text-indigo-700 font-medium underline"
            >
              View Sitemap
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">💡 Did You Know?</p>
          <p className="text-indigo-100">
            The word "perfume" comes from the Latin "per fumum," which means "through smoke."
            Ancient civilizations used aromatic resins and herbs in their religious ceremonies!
          </p>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
export default NotFound;