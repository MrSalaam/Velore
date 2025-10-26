import React from 'react';
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
};