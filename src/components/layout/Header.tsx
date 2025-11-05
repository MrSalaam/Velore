import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart,  LogOut, Search, ChevronDown } from 'lucide-react';
import { MdShoppingCartCheckout } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { motion } from 'framer-motion';
import { SearchBar } from '../common/SearchBar';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useLocalStorage';
import { NAV_LINKS } from '../../utils/constants';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);

  const { isAuthenticated, user, logout, getUserInitials } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="bg-white sticky top-0 z-50 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group" aria-label="VELORÉ Home">
              <div className="relative">

              </div>
              <div className="-ml-3 flex  flex-col">
                  {/* Logo Text */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-wider">
                  VELORÉ
                </h1>
                {/* Tagline */}
                <p className="text-xs pl-1 text-gray-800 font-medium tracking-wide">LUXURY PERFUMES...</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center mx-16 gap-6" role="navigation" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Search Bar */}
            <motion.div
              className="hidden lg:block flex-1 max-w-2xl mx-12"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onFocus={() => {}}
              onBlur={() => {}}
              tabIndex={-1}
            >
              <SearchBar />
            </motion.div>

            {/* Right Section - Icons & User */}
            <div className="flex items-center gap-2">

              {/* Search Icon (Mobile/Tablet) */}
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                aria-label="Search"
                whileTap={{ scale: 0.95 }}
              >
                <Search size={22} />
              </motion.button>

              {/* User Icon (Mobile) */}
              {isAuthenticated ? (
                <div className="relative md:hidden">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="User Menu"
                    whileTap={{ scale: 0.95 }}
                  >
                    <VscAccount size={22} />
                  </motion.button>

                  {/* Mobile User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <VscAccount size={16} />
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <MdShoppingCartCheckout size={16} />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart size={16} />
                          Wishlist
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative md:hidden">
                  <motion.button
                    onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                    className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="User Menu"
                    whileTap={{ scale: 0.95 }}
                  >
                    <VscAccount size={22} />
                  </motion.button>

                  {/* Mobile Login/Signup Dropdown */}
                  {isLoginMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsLoginMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Wishlist */}
              <motion.button
                onClick={() => navigate('/wishlist')}
                className="relative p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hidden sm:block focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                aria-label={`Wishlist with ${wishlist.length} items`}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                    {wishlist.length}
                  </span>
                )}
              </motion.button>

              {/* Cart */}
              <motion.button
                onClick={() => navigate('/cart')}
                className="relative p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hidden md:block focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                aria-label={`Shopping Cart with ${itemCount} items`}
                whileTap={{ scale: 0.95 }}
              >
                <MdShoppingCartCheckout size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </motion.button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative hidden md:block">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="User account menu"
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-sm">
                      {getUserInitials()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName}</p>
                      <p className="text-xs text-gray-500">My Account</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <VscAccount size={16} />
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <MdShoppingCartCheckout size={16} />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart size={16} />
                          Wishlist
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative hidden md:block">
                  <motion.button
                    onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                    className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="User Menu"
                    whileTap={{ scale: 0.95 }}
                  >
                    <VscAccount size={22} />
                  </motion.button>

                  {/* Login/Signup Dropdown */}
                  {isLoginMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsLoginMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <motion.div
          className="lg:hidden  border-gray-200 bg-white z-40 my-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto my-2 px-4 py-8">
            <SearchBar />
          </div>
        </motion.div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden border-t border-gray-200 bg-white"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Mobile navigation">
            <ul className="space-y-1" role="menu">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block py-3 px-4 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              
              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  <li className="pt-4 border-t border-gray-200">
                    <Link
                      to="/account"
                      className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <VscAccount size={18} />
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MdShoppingCartCheckout size={18} />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart size={18} />
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="pt-4 border-t border-gray-200">
                    <Link
                      to="/login"
                      className="block py-3 px-4 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block py-3 px-4 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-medium rounded-lg transition-all duration-200 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </motion.div>
      )}

      </motion.header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center w-full py-2 px-2">
          {/* Home */}
          <Link
            to="/"
            className="flex flex-col items-center gap-1 p-1 text-gray-600 hover:text-emerald-600 transition-colors flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded"
            aria-label="Home"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Shop */}
          <Link
            to="/shop"
            className="flex flex-col items-center gap-1 p-1 text-gray-600 hover:text-emerald-600 transition-colors flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded"
            aria-label="Shop"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xs font-medium">Shop</span>
          </Link>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="flex flex-col items-center gap-1 p-1 text-gray-600 hover:text-emerald-600 transition-colors relative flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-md flex items-center justify-center">
              <MdShoppingCartCheckout className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                {itemCount}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </button>
        </div>
      </div>
    </>
  );
};
