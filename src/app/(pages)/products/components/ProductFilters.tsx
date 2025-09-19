/**
 * ProductFilters component for filtering and sorting products
 */

import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import type { SortOption, CategoryOption } from '@/types/product';

interface ProductFiltersProps {
  selectedCategory: string;
  sortBy: string;
  categoryOptions: CategoryOption[];
  sortOptions: SortOption[];
  onCategoryChange: (e: { value: string }) => void;
  onSortChange: (e: { value: string }) => void;
  className?: string;
}

/**
 * ProductFilters component provides filtering and sorting controls
 * @param props - Component props
 * @returns JSX element representing filter controls
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  sortBy,
  categoryOptions,
  sortOptions,
  onCategoryChange,
  onSortChange,
  className = ''
}) => {
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
          onChange={onCategoryChange}
          placeholder="Seleccionar categoría"
          className="w-full md:w-20rem"
          aria-label="Filtrar productos por categoría"
        />
      </div>
      
      <div className="flex flex-column gap-2">
        <label htmlFor="sort-dropdown" className="font-semibold">
          Ordenar por:
        </label>
        <Dropdown
          id="sort-dropdown"
          value={sortBy}
          options={sortOptions}
          onChange={onSortChange}
          placeholder="Seleccionar orden"
          className="w-full md:w-20rem"
          aria-label="Ordenar productos"
        />
      </div>
    </fieldset>
  );
};
