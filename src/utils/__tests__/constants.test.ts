import { describe, it, expect } from 'vitest';
import { SORT_OPTIONS, CHART_COLORS, PRODUCTS_PER_PAGE, DEFAULT_SORT, API_ENDPOINTS } from '../constants';

describe('constants', () => {
  describe('SORT_OPTIONS', () => {
    it('should have all required sort options', () => {
      expect(SORT_OPTIONS).toHaveLength(6);
      
      const expectedOptions = [
        { label: 'Precio: Menor a Mayor', value: 'price-asc' },
        { label: 'Precio: Mayor a Menor', value: 'price-desc' },
        { label: 'Calificación: Menor a Mayor', value: 'rating-asc' },
        { label: 'Calificación: Mayor a Menor', value: 'rating-desc' },
        { label: 'Nombre: A-Z', value: 'title-asc' },
        { label: 'Nombre: Z-A', value: 'title-desc' },
      ];

      expectedOptions.forEach((expectedOption, index) => {
        expect(SORT_OPTIONS[index]).toEqual(expectedOption);
      });
    });

    it('should have unique values for all sort options', () => {
      const values = SORT_OPTIONS.map(option => option.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('CHART_COLORS', () => {
    it('should have valid hex color codes', () => {
      CHART_COLORS.forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have at least 5 colors', () => {
      expect(CHART_COLORS.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('PRODUCTS_PER_PAGE', () => {
    it('should be a positive number', () => {
      expect(PRODUCTS_PER_PAGE).toBeGreaterThan(0);
    });

    it('should be a reasonable page size', () => {
      expect(PRODUCTS_PER_PAGE).toBe(12);
    });
  });

  describe('DEFAULT_SORT', () => {
    it('should be a valid sort option', () => {
      const validSortValues = SORT_OPTIONS.map(option => option.value);
      expect(validSortValues).toContain(DEFAULT_SORT);
    });

    it('should be title-asc', () => {
      expect(DEFAULT_SORT).toBe('title-asc');
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have all required endpoints', () => {
      expect(API_ENDPOINTS.PRODUCTS).toBe('/api/products');
      expect(API_ENDPOINTS.CATEGORIES).toBe('/api/products/categories');
    });

    it('should have valid endpoint paths', () => {
      Object.values(API_ENDPOINTS).forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\//);
      });
    });
  });
});
