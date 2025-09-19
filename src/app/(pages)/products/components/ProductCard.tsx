/**
 * ProductCard component for displaying individual product information
 */

import React from 'react';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import type { Product } from '@/types/product';
import { formatPrice, truncateText } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  className?: string;
}

/**
 * ProductCard component displays product information in a card format
 * @param props - Component props
 * @returns JSX element representing a product card
 */
export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect,
  className = ''
}) => {
  const handleClick = () => {
    onSelect?.(product);
  };

  return (
    <Card 
      className={`h-full cursor-pointer hover:shadow-4 transition-all transition-duration-200 ${className}`}
      aria-label={`Producto: ${product.title}`}
      onClick={handleClick}
    >
      <div className="flex flex-column gap-3 h-full">
        {/* Product Image */}
        <div className="relative">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width="100%"
            height="200px"
            className="border-round"
            preview
            aria-label={`Imagen del producto ${product.title}`}
          />
          {product.discountPercentage > 0 && (
            <Tag
              value={`-${product.discountPercentage}%`}
              severity="success"
              className="absolute top-0 right-0 m-2"
              aria-label={`Descuento del ${product.discountPercentage}%`}
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-column gap-2 flex-1">
          <h3 
            className="text-lg font-semibold m-0 line-height-3" 
            aria-label={`Título del producto: ${product.title}`}
          >
            {product.title}
          </h3>
          
          <p 
            className="text-sm text-600 m-0 line-height-3 flex-1" 
            aria-label={`Descripción: ${product.description}`}
          >
            {truncateText(product.description, 100)}
          </p>

          <div className="flex align-items-center gap-2">
            <Rating
              value={product.rating}
              readOnly
              stars={5}
              cancel={false}
              aria-label={`Calificación: ${product.rating} de 5 estrellas`}
            />
            <span 
              className="text-sm text-600" 
              aria-label={`${product.rating} estrellas`}
            >
              ({product.rating})
            </span>
          </div>

          <div className="flex align-items-center justify-content-between">
            <span 
              className="text-xl font-bold text-primary" 
              aria-label={`Precio: ${formatPrice(product.price)}`}
            >
              {formatPrice(product.price)}
            </span>
            <Tag
              value={product.brand}
              severity="info"
              aria-label={`Marca: ${product.brand}`}
            />
          </div>

          <div className="flex align-items-center justify-content-between">
            <span 
              className="text-sm text-600" 
              aria-label={`Stock disponible: ${product.stock} unidades`}
            >
              Stock: {product.stock}
            </span>
            <Tag
              value={product.category}
              severity="secondary"
              aria-label={`Categoría: ${product.category}`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
