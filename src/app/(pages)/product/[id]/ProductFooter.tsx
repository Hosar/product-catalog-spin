'use client';
import React from 'react';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import type { Product as ProductType } from '@/types/product';

interface ProductFooterProps {
  product: ProductType;
  discountedPrice: number;
  stockStatus: {
    severity: 'success' | 'warning' | 'danger';
    label: string;
  };
  formatPrice: (price: number) => string;
}

/**
 * Product footer component containing pricing information and stock status
 * Uses semantic HTML elements for better accessibility
 */
export const ProductFooter: React.FC<ProductFooterProps> = ({
  product,
  discountedPrice,
  stockStatus,
  formatPrice,
}) => {
  return (
    <footer className="flex flex-column gap-3">
      <Divider />
      <section className="flex justify-content-between align-items-center" aria-label="Información de precio y disponibilidad">
        <div className="flex flex-column gap-1">
          <span className="text-2xl font-bold text-primary" aria-label="Precio actual">
            {formatPrice(discountedPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <div className="flex align-items-center gap-2">
              <span className="text-600 line-through" aria-label="Precio original">
                {formatPrice(product.price)}
              </span>
              <Badge 
                value={`-${product.discountPercentage}%`} 
                severity="success"
                aria-label={`Descuento del ${product.discountPercentage}%`}
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-column align-items-end gap-2">
          <Tag 
            value={stockStatus.label} 
            severity={stockStatus.severity}
            aria-label={`Estado del stock: ${stockStatus.label}`}
          />
          <span className="text-sm text-600" aria-label="Cantidad disponible">
            {product.stock} unidades disponibles
          </span>
        </div>
      </section>
    </footer>
  );
};
