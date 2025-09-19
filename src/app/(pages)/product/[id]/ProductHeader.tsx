'use client';
import React from 'react';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import type { Product as ProductType } from '@/types/product';

interface ProductHeaderProps {
  product: ProductType;
  selectedImageIndex: number;
  onBackClick: () => void;
  onImageSelect: (index: number) => void;
}

/**
 * Product header component containing navigation, main image, and image gallery
 * Uses semantic HTML elements for better accessibility
 */
export const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  selectedImageIndex,
  onBackClick,
  onImageSelect,
}) => {
  return (
    <header className="flex flex-column gap-3">
      <nav className="flex align-items-center gap-2" aria-label="Navegación del producto">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          onClick={onBackClick}
          aria-label="Volver a la lista de productos"
        />
        <h1 className="text-2xl font-bold m-0">{product.title}</h1>
      </nav>
      
      {/* Main product image */}
      <figure className="flex justify-content-center">
        <Image
          src={product.images?.[selectedImageIndex] || product.thumbnail}
          alt={product.title}
          width="400"
          height="400"
          preview
          className="border-round"
        />
      </figure>

      {/* Image thumbnails */}
      {product.images && product.images.length > 1 && (
        <nav className="flex flex-wrap gap-2 justify-content-center" aria-label="Galería de imágenes del producto">
          {product.images.map((image, index) => (
            <button
              key={index}
              type="button"
              className={`border-round cursor-pointer transition-all transition-duration-200 p-0 ${
                selectedImageIndex === index ? 'border-2 border-primary' : 'border-1 border-300'
              }`}
              onClick={() => onImageSelect(index)}
              aria-label={`Ver imagen ${index + 1} de ${product.images.length}`}
              aria-pressed={selectedImageIndex === index}
            >
              <Image
                src={image}
                alt={`${product.title} - Imagen ${index + 1}`}
                width="60"
                height="60"
                className="border-round"
              />
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
