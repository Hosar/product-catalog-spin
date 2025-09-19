/**
 * Custom hook for managing product data and state
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product, ApiError } from '@/types/product';
import { API_ENDPOINTS } from '@/utils/constants';

interface UseProductsReturn {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing product data
 * @returns Object containing products, categories, loading state, error, and refetch function
 */
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(API_ENDPOINTS.PRODUCTS),
        fetch(API_ENDPOINTS.CATEGORIES)
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Error al cargar los datos');
      }

      const productsData: Product[] = await productsResponse.json();
      const categoriesData: string[] = await categoriesResponse.json();

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
};
