'use client';
import React from 'react';
import type { Product as ProductType } from '@/types/product';

interface ProductSpecificationsProps {
  product: ProductType;
}

/**
 * Product specifications component containing technical details and policies
 * Uses semantic HTML elements (dl, dt, dd) for better accessibility
 */
export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  return (
    <aside className="col-12 md:col-4">
      <div className="flex flex-column gap-4">
        <h3 className="text-lg font-semibold">Especificaciones</h3>
        
        {/* Weight */}
        <dl>
          <dt className="text-base font-semibold mb-1">Peso</dt>
          <dd className="text-600 m-0">{product.weight} kg</dd>
        </dl>

        {/* Dimensions */}
        <dl>
          <dt className="text-base font-semibold mb-1">Dimensiones</dt>
          <dd className="text-600 m-0">
            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
          </dd>
        </dl>

        {/* Availability Status */}
        <dl>
          <dt className="text-base font-semibold mb-1">Estado</dt>
          <dd className="text-600 m-0">{product.availabilityStatus}</dd>
        </dl>

        {/* Minimum Order Quantity */}
        <dl>
          <dt className="text-base font-semibold mb-1">Cantidad mínima</dt>
          <dd className="text-600 m-0">{product.minimumOrderQuantity} unidades</dd>
        </dl>

        {/* Warranty Information */}
        {product.warrantyInformation && (
          <dl>
            <dt className="text-base font-semibold mb-1">Garantía</dt>
            <dd className="text-600 m-0">{product.warrantyInformation}</dd>
          </dl>
        )}

        {/* Shipping Information */}
        {product.shippingInformation && (
          <dl>
            <dt className="text-base font-semibold mb-1">Envío</dt>
            <dd className="text-600 m-0">{product.shippingInformation}</dd>
          </dl>
        )}

        {/* Return Policy */}
        {product.returnPolicy && (
          <dl>
            <dt className="text-base font-semibold mb-1">Política de devolución</dt>
            <dd className="text-600 m-0">{product.returnPolicy}</dd>
          </dl>
        )}
      </div>
    </aside>
  );
};
