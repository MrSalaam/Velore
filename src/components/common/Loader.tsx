import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const iconSize = sizes[size];

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            size={iconSize}
            className="animate-spin text-indigo-600"
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div
            className="rounded-full bg-indigo-600 animate-pulse"
            style={{ width: iconSize, height: iconSize }}
          />
        );

      default:
        return null;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderLoader()}
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton Loader for content placeholders
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseStyles = 'animate-pulse bg-gray-200';

  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : undefined),
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Skeleton variant="rectangular" height="200px" className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" className="mb-3" />
      <Skeleton variant="rectangular" height="36px" />
    </div>
  );
};

// Page Loader
interface PageLoaderProps {
  text?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  );
};

// Inline Loader (for buttons, small sections)
interface InlineLoaderProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({
  size = 'sm',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <Loader2
      size={iconSize}
      className={`animate-spin text-current ${className}`}
    />
  );
};