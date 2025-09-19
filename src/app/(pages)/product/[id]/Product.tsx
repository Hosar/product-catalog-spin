'use client';
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';
import { ProductHeader } from './ProductHeader';
import { ProductFooter } from './ProductFooter';
import { ProductInformation } from './ProductInformation';
import { ProductSpecifications } from './ProductSpecifications';
import type { Product as ProductType } from '@/types/product';

interface ProductProps {
  product: ProductType;
}

/**
 * Product details component using PrimeReact Card
 * Displays comprehensive product information with Mexican peso formatting
 */
export const Product: React.FC<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Format price in Mexican peso
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Calculate discounted price
  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  // Get stock status
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { severity: 'danger' as const, label: 'Agotado' };
    if (stock < 10) return { severity: 'warning' as const, label: 'Poco stock' };
    return { severity: 'success' as const, label: 'Disponible' };
  };

  const stockStatus = getStockStatus(product.stock);

  // Handle back navigation
  const handleBackClick = () => {
    router.back();
  };

  // Handle image selection
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const header = (
    <ProductHeader
      product={product}
      selectedImageIndex={selectedImageIndex}
      onBackClick={handleBackClick}
      onImageSelect={handleImageSelect}
    />
  );

  const footer = (
    <ProductFooter
      product={product}
      discountedPrice={discountedPrice}
      stockStatus={stockStatus}
      formatPrice={formatPrice}
    />
  );

  return (
    <main className="px-4 py-6">
      <Card 
        header={header} 
        footer={footer}
        className="max-w-4xl mx-auto"
      >
        <article className="grid">
          <ProductInformation product={product} />
          <ProductSpecifications product={product} />
        </article>
      </Card>
    </main>
  );
};
