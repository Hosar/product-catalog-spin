import { describe, it, expect } from 'vitest';
import { formatPrice, capitalize, truncateText, countReviewRatings } from '../formatters';
import type { Review } from '@/types/product';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('should format price with default Mexican locale', () => {
      expect(formatPrice(29.99)).toBe('$29.99');
    });

    it('should format price with custom locale', () => {
      expect(formatPrice(29.99, 'en-US', 'USD')).toBe('$29.99');
    });

    it('should format price with different currency', () => {
      expect(formatPrice(29.99, 'en-US', 'EUR')).toBe('€29.99');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle negative prices', () => {
      expect(formatPrice(-10.50)).toBe('-$10.50');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter of a string', () => {
      expect(capitalize('smartphones')).toBe('Smartphones');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Smartphones')).toBe('Smartphones');
    });

    it('should handle string with numbers', () => {
      expect(capitalize('iphone 15')).toBe('Iphone 15');
    });

    it('should handle special characters', () => {
      expect(capitalize('@smartphone')).toBe('@smartphone');
    });
  });

  describe('truncateText', () => {
  it('should truncate text longer than maxLength', () => {
    const text = 'This is a very long description that should be truncated';
    expect(truncateText(text, 20)).toBe('This is a very long ...');
  });

    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

  it('should handle text exactly at maxLength', () => {
    const text = 'Exactly ten';
    expect(truncateText(text, 10)).toBe('Exactly te...');
  });

    it('should handle zero maxLength', () => {
      const text = 'Any text';
      expect(truncateText(text, 0)).toBe('...');
    });
  });

  describe('countReviewRatings', () => {
    it('should count review ratings correctly', () => {
      const reviews: Review[] = [
        { id: 1, rating: 4, comment: 'Great!', user: 'User1' },
        { id: 2, rating: 3, comment: 'Good', user: 'User2' },
        { id: 3, rating: 4, comment: 'Excellent', user: 'User3' },
        { id: 4, rating: 2, comment: 'Average', user: 'User4' },
        { id: 5, rating: 0, comment: 'Poor', user: 'User5' },
      ];

      const result = countReviewRatings(reviews);
      expect(result).toEqual([1, 0, 1, 1, 2]); // [0, 1, 2, 3, 4] ratings
    });

    it('should handle empty reviews array', () => {
      const result = countReviewRatings([]);
      expect(result).toEqual([0, 0, 0, 0, 0]);
    });

    it('should handle reviews with ratings outside valid range', () => {
      const reviews: Review[] = [
        { id: 1, rating: 4, comment: 'Great!', user: 'User1' },
        { id: 2, rating: 6, comment: 'Invalid', user: 'User2' }, // Invalid rating
        { id: 3, rating: -1, comment: 'Invalid', user: 'User3' }, // Invalid rating
      ];

      const result = countReviewRatings(reviews);
      expect(result).toEqual([0, 0, 0, 0, 1]); // Only valid rating counted
    });

    it('should handle reviews with all same ratings', () => {
      const reviews: Review[] = [
        { id: 1, rating: 3, comment: 'Good', user: 'User1' },
        { id: 2, rating: 3, comment: 'Good', user: 'User2' },
        { id: 3, rating: 3, comment: 'Good', user: 'User3' },
      ];

      const result = countReviewRatings(reviews);
      expect(result).toEqual([0, 0, 0, 3, 0]); // All 3-star ratings
    });
  });
});
