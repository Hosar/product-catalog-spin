/**
 * ProductsContainer component - Container component that handles initial data
 * The presenter component now uses Zustand store for state management and URL synchronization
 */

import React from 'react';
import { ProductsPresenter } from './ProductsPresenter';
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

/**
 * Container component that manages initial data and passes it to the presenter
 * The presenter component now uses Zustand store for state management and URL synchronization
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
