/**
 * ProductStockTemplate component for displaying product stock in DataTable
 */

import React from 'react';
import { Tag } from 'primereact/tag';
import type { Product } from '@/types/product';

interface ProductStockTemplateProps {
  product: Product;
}

/**
 * ProductStockTemplate component displays product stock with color-coded severity
 * @param props - Component props containing the product data
 * @returns JSX element representing product stock tag
 */
export const ProductStockTemplate: React.FC<ProductStockTemplateProps> = ({ product }) => {
  const severity = product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger';
  
  return (
    <Tag value={product.stock.toString()} severity={severity} />
  );
};
