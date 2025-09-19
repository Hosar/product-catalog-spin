/**
 * ProductsServerContainer - Server Component that fetches initial data
 * This component fetches data on the server and passes it to the client container
 */

import React from 'react';
import { ProductsContainer } from './ProductsContainer';
import { getProductsAndCategories } from './productsActions';
import type { Product } from '@/types/product';
import { Category } from '@/types/category';

interface ProductsServerContainerProps {
  className?: string;
  searchParams?: {
    skip?: string;
    limit?: string;
    category?: string;
    sort?: string;
    sortField?: string;
    sortOrder?: string;
    q?: string;
  };
}

/**
 * Server Component that fetches initial data and passes it to the client container
 * This provides better performance by fetching data on the server
 * Initial render is completely server-side with no client-side data fetching
 */
export async function ProductsServerContainer({ 
  className = '',
  searchParams = {}
}: ProductsServerContainerProps) {
  // Extract URL parameters with defaults
  const skip = parseInt(searchParams.skip || '0');
  const limit = parseInt(searchParams.limit || '10');
  const category = searchParams.category || '';
  const sort = searchParams.sort || 'title-asc';
  const sortField = searchParams.sortField || '';
  const sortOrder = searchParams.sortOrder || '1';
  const searchQuery = searchParams.q || '';

  // Fetch initial data on the server using the combined action with URL parameters
  const { success, categories, products, error, total, skip: resultSkip, limit: resultLimit } = await getProductsAndCategories({
    skip,
    limit,
    category,
    sort,
    sortField,
    sortOrder,
    searchQuery,
  });

  // Extract data or provide defaults
  const initialProducts: Product[] = success ? (products || []) : [];
  const initialCategories: Category[] = success ? (categories || []) : [];
  const initialError: string | null = success ? null : (error || null);

  return (
    <ProductsContainer
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialTotal={total}
      initialSkip={resultSkip}
      initialLimit={resultLimit}
      initialError={initialError}
      className={className}
    />
  );
}
