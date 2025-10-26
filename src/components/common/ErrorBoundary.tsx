import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. An unexpected error occurred.
              </p>

              {/* Error Details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="bg-gray-50 rounded p-4 overflow-auto max-h-48">
                    <pre className="text-xs text-red-600 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  fullWidth
                  leftIcon={<RefreshCw size={18} />}
                >
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="primary"
                  fullWidth
                  leftIcon={<Home size={18} />}
                >
                  Go Home
                </Button>
              </div>

              {/* Reload Option */}
              <button
                onClick={this.handleReload}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Reload the page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based Error Boundary wrapper (for functional components)
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>

          <p className="text-gray-600 mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>

          <Button onClick={resetError} variant="primary" fullWidth>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

// Simple error display component
interface ErrorMessageProps {
  message: string;
  retry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  retry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="text-red-600" size={24} />
      </div>
      <p className="text-gray-700 text-center mb-4">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};