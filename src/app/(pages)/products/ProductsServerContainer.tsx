/**
 * ProductsServerContainer - Server Component that fetches initial data
 * This component fetches data on the server and passes it to the client container
 */

import React from 'react';
import { ProductsContainer } from './ProductsContainer';
import { getProductsAndCategories } from './productsActions';
import type { Product } from '@/types/product';

interface ProductsServerContainerProps {
  className?: string;
}

/**
 * Server Component that fetches initial data and passes it to the client container
 * This provides better performance by fetching data on the server
 * Initial render is completely server-side with no client-side data fetching
 */
export async function ProductsServerContainer({ 
  className = '' 
}: ProductsServerContainerProps): Promise<React.ReactElement> {
  // Fetch initial data on the server using the combined action
  const { success, categories, products, error } = await getProductsAndCategories();

  // Extract data or provide defaults
  const initialProducts: Product[] = success ? (products || []) : [];
  const initialCategories: string[] = success ? (categories || []) : [];
  const initialError: string | null = success ? null : (error || null);

  return (
    <ProductsContainer
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialError={initialError}
      className={className}
    />
  );
}
