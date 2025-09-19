/**
 * Custom hook for managing product filtering and sorting
 */

import { useState, useMemo, useCallback } from 'react';
import type { Product, SortOption, CategoryOption } from '@/types/product';
import type { Category } from '@/types/category';
import { SORT_OPTIONS, DEFAULT_SORT } from '@/utils/constants';
import { capitalize } from '@/utils/formatters';

interface UseProductFiltersProps {
  products: Product[];
  categories: Category[];
}

interface UseProductFiltersReturn {
  selectedCategory: string;
  sortBy: string;
  filteredAndSortedProducts: Product[];
  categoryOptions: CategoryOption[];
  sortOptions: SortOption[];
  handleCategoryChange: (e: { value: string }) => void;
  handleSortChange: (e: { value: string }) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for managing product filtering and sorting logic
 * @param props - Object containing products and categories arrays
 * @returns Object containing filter state and handlers
 */
export const useProductFilters = ({ 
  products, 
  categories 
}: UseProductFiltersProps): UseProductFiltersReturn => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    const [sortField, sortOrder] = sortBy.split('-');
    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, sortBy]);

  // Category options for dropdown
  const categoryOptions: CategoryOption[] = useMemo(() => [
    { label: 'Todas las categorías', value: '' },
    ...categories.map((category: Category) => ({
      label: capitalize(category.name),
      value: category.name
    }))
  ], [categories]);

  // Event handlers
  const handleCategoryChange = useCallback((e: { value: string }) => {
    setSelectedCategory(e.value);
  }, []);

  const handleSortChange = useCallback((e: { value: string }) => {
    setSortBy(e.value);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory('');
    setSortBy(DEFAULT_SORT);
  }, []);

  return {
    selectedCategory,
    sortBy,
    filteredAndSortedProducts,
    categoryOptions,
    sortOptions: SORT_OPTIONS,
    handleCategoryChange,
    handleSortChange,
    resetFilters,
  };
};
