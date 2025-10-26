import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    const baseStyles = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500';

    const paddingStyles = leftIcon && rightIcon
      ? 'pl-10 pr-10'
      : leftIcon
      ? 'pl-10 pr-4'
      : rightIcon || isPasswordType
      ? 'pl-4 pr-10'
      : 'px-4';

    const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`
              ${baseStyles}
              ${stateStyles}
              ${paddingStyles}
              ${disabledStyles}
              py-2.5
              ${className}
            `}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {!isPasswordType && rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);