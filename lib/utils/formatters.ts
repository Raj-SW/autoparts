// Utility functions for formatting data

import { CURRENCY } from '@/lib/constants';

/**
 * Format price to Mauritian Rupees
 */
export function formatPrice(price: number, currency: string = CURRENCY.CODE): string {
  if (currency === 'MUR' || currency === 'Rs') {
    return `Rs ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  return `${currency} ${price.toFixed(2)}`;
}

/**
 * Convert USD to MUR
 */
export function convertUSDToMUR(usdAmount: number): number {
  return Math.round(usdAmount * CURRENCY.USD_TO_MUR_RATE);
}

/**
 * Convert MUR to USD
 */
export function convertMURToUSD(murAmount: number): number {
  return Math.round(murAmount / CURRENCY.USD_TO_MUR_RATE);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string | number, format: 'short' | 'long' | 'full' = 'short'): string {
  const dateObj = new Date(date);
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const dateObj = new Date(date);
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date, 'short');
}

/**
 * Format phone number to Mauritian format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +230 XXXX XXXX
  if (cleaned.startsWith('230')) {
    const number = cleaned.substring(3);
    return `+230 ${number.substring(0, 4)} ${number.substring(4)}`;
  }
  
  // Format as +230 XXXX XXXX
  if (cleaned.length === 8) {
    return `+230 ${cleaned.substring(0, 4)} ${cleaned.substring(4)}`;
  }
  
  return phone;
}

/**
 * Format part number for display
 */
export function formatPartNumber(partNumber: string): string {
  return partNumber.toUpperCase();
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format stock status
 */
export function formatStockStatus(stock: number, lowStockThreshold: number = 10): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
} {
  if (stock === 0) {
    return { label: 'Out of Stock', variant: 'destructive', color: 'text-red-600' };
  }
  if (stock <= lowStockThreshold) {
    return { label: `Low Stock (${stock})`, variant: 'outline', color: 'text-orange-600' };
  }
  return { label: 'In Stock', variant: 'default', color: 'text-green-600' };
}

/**
 * Format order status to readable format
 */
export function formatOrderStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Format rating display
 */
export function formatRating(rating: number, maxRating: number = 5): string {
  return `${rating.toFixed(1)}/${maxRating}`;
}

/**
 * Format compatibility info
 */
export function formatCompatibility(compatibility: {
  make?: string[];
  model?: string[];
  year?: number[];
}): string {
  const parts: string[] = [];
  
  if (compatibility.make?.length) {
    parts.push(compatibility.make.join(', '));
  }
  
  if (compatibility.model?.length) {
    parts.push(compatibility.model.join(', '));
  }
  
  if (compatibility.year?.length) {
    const years = compatibility.year.sort();
    if (years.length > 1) {
      parts.push(`${years[0]}-${years[years.length - 1]}`);
    } else if (years.length === 1) {
      parts.push(years[0].toString());
    }
  }
  
  return parts.join(' ');
}

