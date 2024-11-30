import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date object into a readable format
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  try {
    // Handle ISO string format
    if (typeof date === 'string') {
      // Check if date string is valid
      if (isNaN(Date.parse(date))) {
        return 'Invalid Date';
      }
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate the date object
    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}; 