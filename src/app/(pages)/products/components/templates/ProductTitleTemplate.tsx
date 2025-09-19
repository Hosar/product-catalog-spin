/**
 * ProductTitleTemplate component for displaying product title and description in DataTable
 */

import React from 'react';
import { truncateText } from '@/utils/formatters';
import type { Product } from '@/types/product';

interface ProductTitleTemplateProps {
  product: Product;
}

/**
 * ProductTitleTemplate component displays product title and truncated description
 * @param props - Component props containing the product data
 * @returns JSX element representing product title and description
 */
export const ProductTitleTemplate: React.FC<ProductTitleTemplateProps> = ({ product }) => {
  return (
    <div className="flex flex-column">
      <span className="font-semibold text-900">{product.title}</span>
      <span className="text-600 text-sm">{truncateText(product.description, 50)}</span>
    </div>
  );
};
