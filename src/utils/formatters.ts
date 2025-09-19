/**
 * Utility functions for formatting data
 */

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
