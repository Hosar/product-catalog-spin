/**
 * ProductsServerContainer - Server Component that fetches initial data
 * This component fetches data on the server and passes it to the client container
 */

import React from 'react';
import { ProductsContainer } from './ProductsContainer';
import { getProducts, getProductsByCategory, getCategories } from './productsActions';
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

  // Fetch categories first (needed for both paths)
  const categoriesResult = await getCategories();
  
  if (!categoriesResult.success) {
    // If categories fail, return error
    return (
      <ProductsContainer
        initialProducts={[]}
        initialCategories={[]}
        initialTotal={0}
        initialSkip={0}
        initialLimit={0}
        initialError={categoriesResult.error || 'Failed to fetch categories'}
        className={className}
      />
    );
  }

  const categories = categoriesResult.data || [];

  // Decide which action to use based on the parameters
  let result;
  
  if (category && !searchQuery) {
    // Use category-specific endpoint when category is selected and no search query
    const categoryResult = await getProductsByCategory({
      skip,
      limit,
      category,
      sort,
      sortField,
      sortOrder,
    });
    
    // Transform the response to match the expected structure
    result = {
      success: categoryResult.success,
      products: categoryResult.products,
      total: categoryResult.total,
      skip: categoryResult.skip,
      limit: categoryResult.limit,
      categories: categories,
      error: categoryResult.error,
    };
  } else {
    // Use general products endpoint for search or general browsing
    const productsResult = await getProducts({
      skip,
      limit,
      category,
      sort,
      sortField,
      sortOrder,
      searchQuery,
    });
    
    // Transform the response to match the expected structure
    result = {
      success: productsResult.success,
      products: productsResult.data,
      total: productsResult.total,
      skip: productsResult.skip,
      limit: productsResult.limit,
      categories: categories,
      error: productsResult.error,
    };
  }

  const { success, products, error, total, skip: resultSkip, limit: resultLimit } = result;

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
