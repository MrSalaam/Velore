import { REGEX_PATTERNS } from './constants';

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  return REGEX_PATTERNS.EMAIL.test(email.trim());
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
};

/**
 * Validate ZIP code
 */
export const validateZipCode = (zipCode: string): boolean => {
  return REGEX_PATTERNS.ZIP_CODE.test(zipCode);
};

/**
 * Validate credit card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate CVV
 */
export const validateCVV = (cvv: string): boolean => {
  return REGEX_PATTERNS.CVV.test(cvv);
};

/**
 * Validate expiry date
 */
export const validateExpiryDate = (month: number, year: number): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (month < 1 || month > 12) {
    return false;
  }

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
};

/**
 * Validate required field
 */
export const validateRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Validate number range
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate URL
 */
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate form data
 */
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Partial<Record<keyof T, (value: any) => boolean | { isValid: boolean; error?: string }>>
): {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
} => {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const [field, validator] of Object.entries(rules)) {
    // Skip if validator is undefined or not a function
    if (!validator || typeof validator !== 'function') {
      continue;
    }
    
    const value = data[field as keyof T];
    const result = validator(value);

    if (typeof result === 'boolean') {
      if (!result) {
        errors[field as keyof T] = `Invalid ${field}`;
      }
    } else {
      if (!result.isValid) {
        errors[field as keyof T] = result.error || `Invalid ${field}`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate name (letters, spaces, hyphens only)
 */
export const validateName = (name: string): boolean => {
  return /^[a-zA-Z\s-']+$/.test(name) && name.trim().length >= 2;
};

/**
 * Validate username (alphanumeric and underscores)
 */
export const validateUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate integer
 */
export const validateInteger = (value: number): boolean => {
  return Number.isInteger(value);
};

/**
 * Check password match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Validate product quantity
 */
export const validateQuantity = (quantity: number, maxQuantity: number = 10): boolean => {
  return validateInteger(quantity) && validateNumberRange(quantity, 1, maxQuantity);
};

/**
 * Sanitize input (remove potentially harmful characters)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};