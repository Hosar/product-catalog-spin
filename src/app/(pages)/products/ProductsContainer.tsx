/**
 * ProductsContainer component - Container component that handles data fetching and business logic
 * This component uses Server Actions to fetch data and passes it to the presenter component
 * Initial render uses server-fetched data, client-side fetching only for refetch operations
 */

import React from 'react';
import { ProductsPresenter } from './ProductsPresenter';
import { getProductsAndCategories } from './productsActions';
import type { Product } from '@/types/product';
import { Category } from '@/types/category';

interface ProductsContainerProps {
  initialProducts?: Product[];
  initialTotal?: number;
  initialSkip?: number;
  initialLimit?: number;
  initialCategories?: Category[];
  initialError?: string | null;
  className?: string;
}

interface ProductsData {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

/**
 * Container component that manages data fetching and business logic
 * Uses Server Actions to fetch data and passes it to the presenter
 */
export const ProductsContainer: React.FC<ProductsContainerProps> = ({ 
  initialProducts = [],
  initialTotal = 0,
  initialSkip = 0,
  initialLimit = 0,
  initialCategories = [],
  initialError = null,
  className = '' 
}) => {

  return (
    <ProductsPresenter
      products={initialProducts}
      categories={initialCategories}
      total={initialTotal}
      skip={initialSkip}
      limit={initialLimit}
      loading={false}
      error={initialError}
      className={className}
    />
  );
};
