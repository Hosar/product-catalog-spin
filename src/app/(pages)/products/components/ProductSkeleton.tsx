/**
 * ProductSkeleton component for loading states
 */

import React from 'react';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

interface ProductSkeletonProps {
  className?: string;
}

/**
 * ProductSkeleton component displays loading skeleton for product cards
 * @param props - Component props
 * @returns JSX element representing a loading skeleton
 */
export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ 
  className = '' 
}) => (
  <Card className={`h-full ${className}`}>
    <div className="flex flex-column gap-3">
      <Skeleton width="100%" height="200px" />
      <Skeleton width="80%" height="1.5rem" />
      <Skeleton width="60%" height="1rem" />
      <Skeleton width="40%" height="1rem" />
      <Skeleton width="100%" height="2rem" />
    </div>
  </Card>
);
