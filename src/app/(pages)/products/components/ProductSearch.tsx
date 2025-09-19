/**
 * ProductSearch component for real-time product search with debounced input
 */

import React, { useState, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductSearchProps {
  className?: string;
}

/**
 * ProductSearch component provides real-time search functionality with debounced input
 * @param props - Component props
 * @returns JSX element representing search input with real-time search
 */
export const ProductSearch: React.FC<ProductSearchProps> = ({
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSearchQuery = searchParams.get('q') || '';

  const debouncedSearchQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    setInputValue(currentSearchQuery);
  }, [currentSearchQuery]);

  const updateUrlParams = useCallback((newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 0) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${pathname}${newUrl}`, { scroll: false });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();
    
    if (trimmedQuery !== currentSearchQuery) {
      // Get current category from URL to include in search
      const currentCategory = searchParams.get('category') || '';
      
      updateUrlParams({
        q: trimmedQuery || null,
        skip: 0, // Reset to first page when searching
        // Include category in search if it's selected
        ...(currentCategory && { category: currentCategory }),
      });
    }
  }, [debouncedSearchQuery, currentSearchQuery, updateUrlParams, searchParams]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <form className={`flex flex-column gap-2 ${className}`} role="search" aria-label="Búsqueda de productos">
      <label htmlFor="product-search" className="font-semibold">
        Buscar productos:
      </label>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          id="product-search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Buscar productos..."
          className="w-full"
          aria-label="Buscar productos"
        />
      </IconField>
    </form>
  );
};
