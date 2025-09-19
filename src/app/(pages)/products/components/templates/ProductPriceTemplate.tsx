/**
 * ProductPriceTemplate component for displaying product price with discount in DataTable
 */

import React from 'react';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types/product';

interface ProductPriceTemplateProps {
  product: Product;
}

/**
 * ProductPriceTemplate component displays product price with discount information
 * @param props - Component props containing the product data
 * @returns JSX element representing product price with discount
 */
export const ProductPriceTemplate: React.FC<ProductPriceTemplateProps> = ({ product }) => {
  const discountPrice = product.price * (1 - product.discountPercentage / 100);
  
  return (
    <div className="flex flex-column">
      <span className="font-semibold text-900">{formatPrice(discountPrice)}</span>
      {product.discountPercentage > 0 && (
        <span className="text-500 text-sm line-through">{formatPrice(product.price)}</span>
      )}
    </div>
  );
};
