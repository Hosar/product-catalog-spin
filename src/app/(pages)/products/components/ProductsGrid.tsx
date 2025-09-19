/**
 * ProductsGrid component for displaying products in a grid layout
 */

import React from 'react';
import { Paginator } from 'primereact/paginator';
import { Card } from 'primereact/card';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { Product, PaginationEvent } from '@/types/product';

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  first: number;
  rows: number;
  totalRecords: number;
  onPageChange: (event: PaginationEvent) => void;
  onProductSelect?: (product: Product) => void;
  className?: string;
}

/**
 * ProductsGrid component displays products in a responsive grid with pagination
 * @param props - Component props
 * @returns JSX element representing a products grid
 */
export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  loading,
  first,
  rows,
  totalRecords,
  onPageChange,
  onProductSelect,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid ${className}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-4 xl:col-3">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className={className}>
        <section className="text-center py-6" aria-label="Sin resultados">
          <i className="pi pi-search text-6xl text-400 mb-3" aria-hidden="true"></i>
          <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-600 m-0">
            Intenta ajustar los filtros para ver más resultados.
          </p>
        </section>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Products Grid */}
      <section className="grid" aria-label="Lista de productos">
        {products.map((product) => (
          <article key={product.id} className="col-12 md:col-6 lg:col-4 xl:col-3">
            <ProductCard 
              product={product} 
              onSelect={onProductSelect}
            />
          </article>
        ))}
      </section>

      {/* Pagination */}
      {totalRecords > rows && (
        <nav className="flex justify-content-center mt-4" aria-label="Navegación de páginas">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            aria-label="Navegación de páginas de productos"
          />
        </nav>
      )}
    </div>
  );
};
