import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing wishlist in localStorage
export const useWishlist = () => {
  const [wishlist, setWishlist, clearWishlist] = useLocalStorage<string[]>(
    'wishlist',
    []
  );

  const addToWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          return prev;
        }
        return [...prev, productId];
      });
    },
    [setWishlist]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => prev.filter((id) => id !== productId));
    },
    [setWishlist]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(productId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };
};

// Hook for managing recent searches
export const useRecentSearches = (maxSearches: number = 5) => {
  const [searches, setSearches, clearSearches] = useLocalStorage<string[]>(
    'recent-searches',
    []
  );

  const addSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      setSearches((prev) => {
        // Remove duplicates and add new search at the beginning
        const filtered = prev.filter((s) => s !== query);
        const updated = [query, ...filtered];
        
        // Keep only the most recent searches
        return updated.slice(0, maxSearches);
      });
    },
    [setSearches, maxSearches]
  );

  const removeSearch = useCallback(
    (query: string) => {
      setSearches((prev) => prev.filter((s) => s !== query));
    },
    [setSearches]
  );

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
};

// Hook for managing theme preference
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};