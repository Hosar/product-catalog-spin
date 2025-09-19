'use client';
import React from 'react';
import { Skeleton } from 'primereact/skeleton';

interface ProductsSkeletonProps {
  className?: string;
}

/**
 * Skeleton component for loading state of the products page
 * Provides a consistent loading experience across the application
 */
export const ProductsSkeleton: React.FC<ProductsSkeletonProps> = ({ 
  className = '' 
}) => {
  return (
    <main className={`grid ${className}`}>
      <div className="col-12">
        <div className="flex flex-column gap-4 px-4 py-6">
          {/* Header skeleton */}
          <header className="flex flex-column gap-3">
            <Skeleton width="300px" height="2rem" />
            <div className="flex gap-3">
              <Skeleton width="200px" height="3rem" />
              <Skeleton width="200px" height="3rem" />
            </div>
          </header>

          {/* Chart skeleton */}
          <section className="border-round surface-card p-4" aria-label="Cargando gráfico">
            <Skeleton width="100%" height="300px" />
          </section>

          {/* DataTable skeleton */}
          <section className="border-round surface-card" aria-label="Cargando tabla de productos">
            <div className="p-4">
              <Skeleton width="100%" height="3rem" className="mb-3" />
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex align-items-center gap-3 py-3 border-bottom-1 surface-border">
                  <Skeleton width="60px" height="60px" />
                  <div className="flex-1">
                    <Skeleton width="80%" height="1.5rem" className="mb-2" />
                    <Skeleton width="60%" height="1rem" />
                  </div>
                  <Skeleton width="100px" height="1.5rem" />
                  <Skeleton width="80px" height="1.5rem" />
                  <Skeleton width="60px" height="1.5rem" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
