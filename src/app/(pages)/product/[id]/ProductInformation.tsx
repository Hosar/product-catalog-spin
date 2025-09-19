'use client';
import React from 'react';
import { Rating } from 'primereact/rating';
import { Chip } from 'primereact/chip';
import type { Product as ProductType } from '@/types/product';

interface ProductInformationProps {
  product: ProductType;
}

/**
 * Product information component containing rating, description, category, SKU, and tags
 * Uses semantic HTML elements for better accessibility
 */
export const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  return (
    <section className="col-12 md:col-8">
      <div className="flex flex-column gap-4">
        {/* Rating */}
        <section className="flex align-items-center gap-3" aria-label="Calificación del producto">
          <Rating 
            value={product.rating} 
            readOnly 
            cancel={false}
            stars={5}
            aria-label={`Calificación: ${product.rating} de 5 estrellas`}
          />
          <span className="text-600">
            {product.rating} ({product.reviews?.length || 0} reseñas)
          </span>
        </section>

        {/* Description */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Descripción</h3>
          <p className="text-600 line-height-3 m-0">
            {product.description}
          </p>
        </section>

        {/* Category and SKU */}
        <section className="grid">
          <div className="col-12 md:col-6">
            <h4 className="text-base font-semibold mb-2">Categoría</h4>
            <Chip 
              label={product.category} 
              className="text-sm"
              aria-label={`Categoría: ${product.category}`}
            />
          </div>
          <div className="col-12 md:col-6">
            <h4 className="text-base font-semibold mb-2">SKU</h4>
            <span className="text-600" aria-label={`Código SKU: ${product.sku}`}>{product.sku}</span>
          </div>
        </section>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <section>
            <h4 className="text-base font-semibold mb-2">Etiquetas</h4>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Etiquetas del producto">
              {product.tags.map((tag, index) => (
                <Chip 
                  key={index}
                  label={tag} 
                  className="text-sm"
                  role="listitem"
                  aria-label={`Etiqueta: ${tag}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
