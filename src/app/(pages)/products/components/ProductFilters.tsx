/**
 * ProductFilters component for filtering and sorting products
 */

import React, { useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { CategoryOption } from '@/types/product';

interface ProductFiltersProps {
  selectedCategory: string;
  categoryOptions: CategoryOption[];
  onCategoryChange: (e: { value: string }) => void;
  className?: string;
}

/**
 * ProductFilters component provides filtering and sorting controls
 * @param props - Component props
 * @returns JSX element representing filter controls
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  categoryOptions,
  onCategoryChange,
  className = ''
}) => {
  // Next.js URL hooks
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  console.log('selectedCategory ....:', selectedCategory);
  console.log('ProductFilters - categoryOptions ....:', categoryOptions);

  // Function to update URL parameters
  const updateUrlParams = useCallback((newParams: Record<string, string | number | null>) => {
    console.log('newParams ....:', newParams);
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    console.log('newUrl ....:', newUrl);
    router.replace(`${pathname}${newUrl}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Handle category change with URL update
  const handleCategoryChange = useCallback((e: { value: string }) => {
    console.log('e.value ....:', e.value);
    updateUrlParams({
      category: e.value,
      skip: 0, // Reset to first page
    });
    onCategoryChange(e);
  }, [updateUrlParams, onCategoryChange]);

  return (
    <fieldset className={`flex flex-column md:flex-row gap-3 ${className}`}>
      <legend className="sr-only">Filtros y ordenamiento de productos</legend>
      <div className="flex flex-column gap-2">
        <label htmlFor="category-filter" className="font-semibold">
          Filtrar por categoría:
        </label>
        <Dropdown
          id="category-filter"
          value={selectedCategory}
          options={categoryOptions}
          onChange={handleCategoryChange}
          placeholder="Seleccionar categoría"
          className="w-full md:w-20rem"
          aria-label="Filtrar productos por categoría"
        />
      </div>
    </fieldset>
  );
};
