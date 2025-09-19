/**
 * ProductImageTemplate component for displaying product images in DataTable
 */

import React from 'react';
import { Image } from 'primereact/image';
import type { Product } from '@/types/product';

interface ProductImageTemplateProps {
  product: Product;
}

/**
 * ProductImageTemplate component displays product thumbnail with preview functionality
 * @param props - Component props containing the product data
 * @returns JSX element representing product image
 */
export const ProductImageTemplate: React.FC<ProductImageTemplateProps> = ({ product }) => {
  return (
    <Image
      src={product.thumbnail}
      alt={product.title}
      width="60"
      height="60"
      className="border-round"
      preview
    />
  );
};
