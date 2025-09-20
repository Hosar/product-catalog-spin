/**
 * ProductsContainer component - Container component that handles initial data
 * The presenter component now uses Next.js URL hooks for state management
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
  className?: string;
}

/**
 * Container component that manages initial data and passes it to the presenter
 * The presenter component now uses Next.js URL hooks for state management
 */
export const ProductsContainer: React.FC<ProductsContainerProps> = ({ 
  initialProducts = [],
  initialTotal = 0,
  initialSkip = 0,
  initialLimit = 0,
  initialCategories = [],
  className = '' 
}) => {
  return (
    <ProductsPresenter
      products={initialProducts}
      categories={initialCategories}
      total={initialTotal}
      skip={initialSkip}
      limit={initialLimit}
      className={className}
    />
  );
};
