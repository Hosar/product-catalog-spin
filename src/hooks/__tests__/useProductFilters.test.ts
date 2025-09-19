import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductFilters } from '../useProductFilters';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 15',
    description: 'Latest iPhone',
    price: 999,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://example.com/iphone.jpg',
    images: ['https://example.com/iphone.jpg'],
    sku: 'IPH15-001',
    reviews: []
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24',
    description: 'Latest Samsung phone',
    price: 899,
    discountPercentage: 5,
    rating: 4.2,
    stock: 30,
    brand: 'Samsung',
    category: 'smartphones',
    thumbnail: 'https://example.com/galaxy.jpg',
    images: ['https://example.com/galaxy.jpg'],
    sku: 'SGS24-001',
    reviews: []
  },
  {
    id: 3,
    title: 'MacBook Pro',
    description: 'Apple laptop',
    price: 1999,
    discountPercentage: 0,
    rating: 4.8,
    stock: 20,
    brand: 'Apple',
    category: 'laptops',
    thumbnail: 'https://example.com/macbook.jpg',
    images: ['https://example.com/macbook.jpg'],
    sku: 'MBP-001',
    reviews: []
  },
];

const mockCategories: Category[] = [
  { name: 'smartphones' },
  { name: 'laptops' },
  { name: 'tablets' },
];

describe('useProductFilters', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    expect(result.current.selectedCategory).toBe('');
    expect(result.current.sortBy).toBe('title-asc');
    // The products should be sorted by title ascending (default)
    const expectedOrder = [...mockProducts].sort((a, b) => a.title.localeCompare(b.title));
    expect(result.current.filteredAndSortedProducts).toEqual(expectedOrder);
  });

  it('should filter products by category', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleCategoryChange({ value: 'smartphones' });
    });

    expect(result.current.selectedCategory).toBe('smartphones');
    expect(result.current.filteredAndSortedProducts).toHaveLength(2);
    expect(result.current.filteredAndSortedProducts.every(p => p.category === 'smartphones')).toBe(true);
  });

  it('should sort products by price ascending', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleSortChange({ value: 'price-asc' });
    });

    expect(result.current.sortBy).toBe('price-asc');
    const prices = result.current.filteredAndSortedProducts.map(p => p.price);
    expect(prices).toEqual([899, 999, 1999]);
  });

  it('should sort products by price descending', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleSortChange({ value: 'price-desc' });
    });

    expect(result.current.sortBy).toBe('price-desc');
    const prices = result.current.filteredAndSortedProducts.map(p => p.price);
    expect(prices).toEqual([1999, 999, 899]);
  });

  it('should sort products by rating ascending', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleSortChange({ value: 'rating-asc' });
    });

    expect(result.current.sortBy).toBe('rating-asc');
    const ratings = result.current.filteredAndSortedProducts.map(p => p.rating);
    expect(ratings).toEqual([4.2, 4.5, 4.8]);
  });

  it('should sort products by rating descending', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleSortChange({ value: 'rating-desc' });
    });

    expect(result.current.sortBy).toBe('rating-desc');
    const ratings = result.current.filteredAndSortedProducts.map(p => p.rating);
    expect(ratings).toEqual([4.8, 4.5, 4.2]);
  });

  it('should sort products by title ascending', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleSortChange({ value: 'title-asc' });
    });

    expect(result.current.sortBy).toBe('title-asc');
    const titles = result.current.filteredAndSortedProducts.map(p => p.title);
    expect(titles).toEqual(['iPhone 15', 'MacBook Pro', 'Samsung Galaxy S24']);
  });

  it('should sort products by title descending', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleSortChange({ value: 'title-desc' });
    });

    expect(result.current.sortBy).toBe('title-desc');
    const titles = result.current.filteredAndSortedProducts.map(p => p.title);
    expect(titles).toEqual(['Samsung Galaxy S24', 'MacBook Pro', 'iPhone 15']);
  });

  it('should combine filtering and sorting', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    act(() => {
      result.current.handleCategoryChange({ value: 'smartphones' });
    });

    act(() => {
      result.current.handleSortChange({ value: 'price-asc' });
    });

    expect(result.current.selectedCategory).toBe('smartphones');
    expect(result.current.sortBy).toBe('price-asc');
    expect(result.current.filteredAndSortedProducts).toHaveLength(2);
    
    const prices = result.current.filteredAndSortedProducts.map(p => p.price);
    expect(prices).toEqual([899, 999]);
  });

  it('should reset filters to default values', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    // Set some filters first
    act(() => {
      result.current.handleCategoryChange({ value: 'smartphones' });
    });

    act(() => {
      result.current.handleSortChange({ value: 'price-desc' });
    });

    // Reset filters
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.selectedCategory).toBe('');
    expect(result.current.sortBy).toBe('title-asc');
    // The products should be sorted by title ascending (default)
    const expectedOrder = [...mockProducts].sort((a, b) => a.title.localeCompare(b.title));
    expect(result.current.filteredAndSortedProducts).toEqual(expectedOrder);
  });

  it('should generate correct category options', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    expect(result.current.categoryOptions).toHaveLength(4); // 3 categories + "All categories"
    expect(result.current.categoryOptions[0]).toEqual({ label: 'Todas las categorías', value: '' });
    expect(result.current.categoryOptions[1]).toEqual({ label: 'Smartphones', value: 'smartphones' });
    expect(result.current.categoryOptions[2]).toEqual({ label: 'Laptops', value: 'laptops' });
    expect(result.current.categoryOptions[3]).toEqual({ label: 'Tablets', value: 'tablets' });
  });

  it('should provide sort options', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: mockCategories })
    );

    expect(result.current.sortOptions).toHaveLength(6);
    expect(result.current.sortOptions[0].value).toBe('price-asc');
    expect(result.current.sortOptions[1].value).toBe('price-desc');
  });

  it('should handle empty products array', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: [], categories: mockCategories })
    );

    expect(result.current.filteredAndSortedProducts).toEqual([]);
  });

  it('should handle empty categories array', () => {
    const { result } = renderHook(() => 
      useProductFilters({ products: mockProducts, categories: [] })
    );

    expect(result.current.categoryOptions).toHaveLength(1); // Only "All categories"
    expect(result.current.categoryOptions[0]).toEqual({ label: 'Todas las categorías', value: '' });
  });
});
