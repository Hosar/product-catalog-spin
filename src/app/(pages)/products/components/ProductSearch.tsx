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
  
  // Next.js URL hooks
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get current search query from URL
  const currentSearchQuery = searchParams.get('q') || '';

  // Debounce the input value with 500ms delay
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  // Initialize input value from URL
  useEffect(() => {
    setInputValue(currentSearchQuery);
  }, [currentSearchQuery]);

  // Function to update URL parameters
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

  // Handle debounced search - update URL when debounced value changes
  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();
    
    // Only update URL if the debounced value is different from current URL query
    if (trimmedQuery !== currentSearchQuery) {
      updateUrlParams({
        q: trimmedQuery || null,
        skip: 0, // Reset to first page when searching
      });
    }
  }, [debouncedSearchQuery, currentSearchQuery, updateUrlParams]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setInputValue('');
    updateUrlParams({
      q: null, // Remove search query
      skip: 0, // Reset to first page
    });
  }, [updateUrlParams]);

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
