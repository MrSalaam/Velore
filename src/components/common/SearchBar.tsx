import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useRecentSearches } from '../../hooks/useLocalStorage';
import { debounce } from '../../utils/helpers';
import { DEBOUNCE_DELAY } from '../../utils/constants';
import { MdCancel } from "react-icons/md";

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search for perfumes...',
  showSuggestions = true,
  onSearch,
  className = '',
  autoFocus = false,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { search, products = [], isLoading } = useProducts();
  const { searches = [], addSearch, removeSearch, clearSearches } = useRecentSearches();

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((searchQuery: string) => {
      if (searchQuery.trim() && showSuggestions) {
        search(searchQuery);
      }
    }, DEBOUNCE_DELAY.SEARCH)
  ).current;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() && showSuggestions) {
      debouncedSearch(value);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle search submit
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    addSearch(searchQuery);

    // Close dropdown and clear input
    setShowDropdown(false);
    setQuery('');

    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to shop page with search query
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle clear input
  const handleClear = () => {
    setQuery('');
    setShowDropdown(false);
    // Keep focus on input for better UX
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle clear all recent searches
  const handleClearAllSearches = () => {
    clearSearches();
    setShowDropdown(false);
    // Keep focus on input for better UX
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowDropdown(false);
    handleSearch(searchQuery);
  };

  // Handle product suggestion click
  const handleProductClick = (productId: string) => {
    if (query.trim()) {
      addSearch(query);
    }
    setShowDropdown(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showRecentSearches = isFocused && searches && searches.length > 0 && !query;
  const showProductSuggestions = showSuggestions && query.trim() && products.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (searches && searches.length > 0 && !query) {
                setShowDropdown(true);
              }
            }}
            onBlur={() => {
              // Delay to allow click events on dropdown items
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder={placeholder}
            className="
              block w-full max-w-sm pl-10 pr-10 py-2.5
              border border-gray-300 rounded-full
              focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent
              placeholder-gray-400
            "
            autoFocus={autoFocus}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-7 pl-7 flex items-center text-gray-400 hover:text-gray-600"
            >
              <MdCancel size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (showRecentSearches || showProductSuggestions) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {/* Recent Searches */}
          {showRecentSearches && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <Clock size={14} />
                Recent Searches
              </div>
              {searches.map((searchQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(searchQuery)}
                  className="
                    w-full flex items-center justify-between gap-2 px-3 py-2
                    text-left text-gray-700 hover:bg-gray-50 rounded
                  "
                >
                  <span className="flex items-center gap-2">
                    <Search size={16} className="text-gray-400" />
                    {searchQuery}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(searchQuery);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MdCancel size={14}  />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Clear All Button */}
          {searches.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={handleClearAllSearches}
                className="
                  w-full px-3 py-2 text-sm font-medium text-red-600
                  hover:bg-red-50 rounded text-center transition-colors
                "
                aria-label="Clear all recent searches"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Suggestions */}
          {showProductSuggestions && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <TrendingUp size={14} />
                Suggestions
              </div>
              {isLoading ? (
                <div className="px-3 py-4 text-center text-gray-500">
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full" />
                </div>
              ) : (
                products.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="
                      w-full flex items-center gap-3 px-3 py-2
                      text-left hover:bg-gray-50 rounded
                    "
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}

          {/* View All Results */}
          {query.trim() && (
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={() => handleSearch()}
                className="
                  w-full px-3 py-2 text-sm font-medium text-emerald-600
                  hover:bg-emerald-50 rounded text-center
                "
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};