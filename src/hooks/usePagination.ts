/**
 * Custom hook for managing pagination state and logic
 */

import { useState, useMemo, useCallback } from 'react';
import type { PaginationEvent } from '@/types/product';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  first: number;
  rows: number;
  paginatedItems: T[];
  totalPages: number;
  onPageChange: (event: PaginationEvent) => void;
  resetPagination: () => void;
}

/**
 * Custom hook for managing pagination state and logic
 * @param props - Object containing items array and optional items per page
 * @returns Object containing pagination state and handlers
 */
export const usePagination = <T>({ 
  items, 
  itemsPerPage = PRODUCTS_PER_PAGE 
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);

  // Calculate paginated items
  const paginatedItems = useMemo(() => {
    const start = first;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, first, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Handle page change
  const onPageChange = useCallback((event: PaginationEvent) => {
    setFirst(event.first);
    setCurrentPage(event.page);
  }, []);

  // Reset pagination
  const resetPagination = useCallback(() => {
    setFirst(0);
    setCurrentPage(0);
  }, []);

  return {
    currentPage,
    first,
    rows: itemsPerPage,
    paginatedItems,
    totalPages,
    onPageChange,
    resetPagination,
  };
};
