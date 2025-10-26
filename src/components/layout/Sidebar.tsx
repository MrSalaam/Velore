import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/Button';
import { ProductFilters } from '../../types';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Tag, Heart, User, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  requireAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: <Home size={20} />,
  },
  {
    path: '/shop',
    label: 'Shop',
    icon: <ShoppingBag size={20} />,
  },
  {
    path: '/deals',
    label: 'Deals',
    icon: <Tag size={20} />,
  },
  {
    path: '/wishlist',
    label: 'Wishlist',
    icon: <Heart size={20} />,
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: <Package size={20} />,
    requireAuth: true,
  },
  {
    path: '/account',
    label: 'Account',
    icon: <User size={20} />,
    requireAuth: true,
  },
];

export const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.requireAuth || (item.requireAuth && isAuthenticated)
  );

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-8 overflow-x-auto">
          {filteredNavItems.map((item) => (
            <li key={item.path} className="flex-shrink-0">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-gray-300'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Breadcrumb Navigation
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.path ? (
              <NavLink
                to={item.path}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </NavLink>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Category Navigation
interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: React.ReactNode;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (slug: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
}) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto py-4">
          <button
            onClick={() => onCategoryClick?.('')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors
              ${
                !activeCategory
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category.slug)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${
                  activeCategory === category.slug
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Tab Navigation
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNav: React.FC<TabNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="border-b border-gray-200">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-shrink-0 py-4 px-2 border-b-2 font-medium transition-colors
              ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  ml-2 px-2 py-0.5 text-xs rounded-full
                  ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const categories = [
    "Men's Fragrances",
    "Women's Fragrances",
    'Unisex Fragrances',
    'Luxury Collection',
    'Gift Sets',
  ];

  const brands = [
    'Chanel',
    'Dior',
    'Tom Ford',
    'Versace',
    'Gucci',
    'Prada',
    'Yves Saint Laurent',
    'Armani',
  ];

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: 10000 },
  ];

  const ratings = [5, 4, 3, 2, 1];

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : (category as any),
    });
  };

  const handleBrandChange = (brand: string) => {
    onFiltersChange({
      ...filters,
      brand: filters.brand === brand ? undefined : brand,
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFiltersChange({
        ...filters,
        minPrice: undefined,
        maxPrice: undefined,
      });
    } else {
      onFiltersChange({
        ...filters,
        minPrice: min,
        maxPrice: max,
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
    });
  };

  const handleStockChange = (inStock: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: filters.inStock === inStock ? undefined : inStock,
    });
  };

  const sidebarContent = (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="p-4">
        {/* Clear Filters Button */}
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={onClearFilters}
          className="mb-4"
        >
          Clear All Filters
        </Button>

        {/* Category Filter */}
        <FilterSection title="Category">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {category}
            </label>
          ))}
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {brand}
            </label>
          ))}
        </FilterSection>

        {/* Price Filter */}
        <FilterSection title="Price Range">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={
                  filters.minPrice === range.min && filters.maxPrice === range.max
                }
                onChange={() => handlePriceChange(range.min, range.max)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              {range.label}
            </label>
          ))}
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection title="Rating">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1">& Up</span>
              </div>
            </label>
          ))}
        </FilterSection>

        {/* Availability Filter */}
        <FilterSection title="Availability">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={() => handleStockChange(true)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            In Stock Only
          </label>
        </FilterSection>
      </div>
    </div>
  );

  // Desktop Sidebar
  if (isOpen && !onClose) {
    return (
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
        {sidebarContent}
      </aside>
    );
  }

  // Mobile Sidebar (with overlay)
  if (isOpen && onClose) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />

        {/* Sidebar */}
        <aside className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-xl">
          {sidebarContent}
        </aside>
      </>
    );
  }

  return null;
};

// Account Sidebar for user dashboard
interface AccountSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const sections = [
    { id: 'profile', label: 'Profile Information', icon: '👤' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'payment', label: 'Payment Methods', icon: '💳' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <nav className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Account</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-xl">{section.icon}</span>
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};