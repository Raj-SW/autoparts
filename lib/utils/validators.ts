// Validation utility functions

import { VALIDATION } from '@/lib/constants';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validate Mauritian phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return VALIDATION.PHONE_REGEX.test(cleaned);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`);
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    errors.push(`Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate name
 */
export function isValidName(name: string): boolean {
  return (
    name.length >= VALIDATION.MIN_NAME_LENGTH &&
    name.length <= VALIDATION.MAX_NAME_LENGTH &&
    /^[a-zA-Z\s'-]+$/.test(name)
  );
}

/**
 * Validate price
 */
export function isValidPrice(price: number): boolean {
  return price > 0 && Number.isFinite(price);
}

/**
 * Validate stock quantity
 */
export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= 0;
}

/**
 * Validate part number format
 */
export function isValidPartNumber(partNumber: string): boolean {
  // Part numbers should be alphanumeric with optional hyphens and underscores
  return /^[A-Z0-9_-]{3,50}$/i.test(partNumber);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate year range
 */
export function isValidYearRange(startYear: number, endYear?: number): boolean {
  const currentYear = new Date().getFullYear();
  const minYear = 1900;

  if (startYear < minYear || startYear > currentYear) {
    return false;
  }

  if (endYear !== undefined) {
    return endYear >= startYear && endYear <= currentYear;
  }

  return true;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate image file type
 */
export function isValidImageFile(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
}

/**
 * Validate file size (in bytes)
 */
export function isValidFileSize(sizeInBytes: number, maxSizeInMB: number = 5): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

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
}

/**
 * Validate postal code for Mauritius
 */
export function isValidPostalCode(postalCode: string): boolean {
  // Mauritius postal codes are 5 digits
  return /^\d{5}$/.test(postalCode);
}

