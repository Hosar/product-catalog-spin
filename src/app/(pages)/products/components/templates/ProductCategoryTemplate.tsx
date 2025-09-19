/**
 * ProductCategoryTemplate component for displaying product category in DataTable
 */

import React from 'react';
import { Tag } from 'primereact/tag';
import { capitalize } from '@/utils/formatters';
import type { Product } from '@/types/product';

interface ProductCategoryTemplateProps {
  product: Product;
}

/**
 * ProductCategoryTemplate component displays product category as a tag
 * @param props - Component props containing the product data
 * @returns JSX element representing product category tag
 */
export const ProductCategoryTemplate: React.FC<ProductCategoryTemplateProps> = ({ product }) => {
  return (
    <Tag value={capitalize(product.category)} severity="info" />
  );
};
