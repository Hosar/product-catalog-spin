/**
 * Utility functions for formatting data
 */

import { Review } from "@/types/product";

/**
 * Formats a price value according to Mexican locale standards
 * @param price - The numeric price value to format
 * @returns Formatted price string with currency symbol
 * @example
 * formatPrice(29.99) // Returns "$29.99"
 */
export function formatPrice(
  value: number,
  locale: string = 'es-MX',
  currency: string = 'MXN',
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    // good defaults for MXN:
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencySign: 'standard', // or 'accounting' for negatives as (−)
    ...options,
  }).format(value);
}

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 * @example
 * capitalize('smartphones') // Returns 'Smartphones'
 */
export const capitalize = (str: string): string => {
  console.log('str', str);
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * @example
 * truncateText('This is a long description', 20) // Returns 'This is a long desc...'
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};


export const countReviewRatings = (reviews: Review[]): number[] => {
  // Initialize an array of 5 positions with all zeros.
  // This array will store the counts for ratings 0, 1, 2, 3, and 4.
  const counts: number[] = [0, 0, 0, 0, 0];

  // Iterate over each review in the provided array.
  for (const review of reviews) {
    const rating = review.rating;

    // Check if the rating is within the desired range (0 to 4).
    if (rating >= 0 && rating < 5) {
      // Increment the count at the index corresponding to the rating.
      counts[rating]++;
    }
  }

  return counts;
}