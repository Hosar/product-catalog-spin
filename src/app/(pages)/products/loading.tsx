import { ProductsSkeleton } from './components/ProductsSkeleton';

/**
 * Loading page for the products route
 * Uses the same skeleton component as the main products page for consistency
 */
export default function Loading() {
  return <ProductsSkeleton />;
}
