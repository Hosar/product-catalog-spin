/**
 * ProductRatingTemplate component for displaying product rating in DataTable
 */

import React from 'react';
import type { Product } from '@/types/product';

interface ProductRatingTemplateProps {
  product: Product;
}

/**
 * ProductRatingTemplate component displays product rating with star icon
 * @param props - Component props containing the product data
 * @returns JSX element representing product rating with star
 */
export const ProductRatingTemplate: React.FC<ProductRatingTemplateProps> = ({ product }) => {
  return (
    <div className="flex align-items-center gap-2">
      <span className="font-semibold">{product.rating}</span>
      <i className="pi pi-star-fill text-yellow-500"></i>
    </div>
  );
};
